const { test } = require('node:test');
const assert = require('node:assert/strict');
const E = require('../assets/js/haptic-run-engine.js');
function battle(seed=12) { const s=E.create(seed); E.visit(s,'0-0'); return s; }
function hand(s, ids) { s.battle.hand=ids.map(id=>({id,upgraded:false})); s.battle.energy=3; }

test('seeded map/deck are reproducible and only connected nodes are accessible',()=>{
 const a=E.create(42),b=E.create(42); assert.deepEqual(a,b);
 assert.equal(E.visit(a,'6-0'),false); assert.equal(E.visit(a,'0-0'),true);
 assert.equal(E.visit(a,'0-0'),false);
 assert.equal(a.battle.hand.length,5); assert.equal(a.battle.block,5);
});
test('every branch has a connected route to the boss',()=>{
 const s=E.create(1);
 for(const node of s.map.flat()) {
  if(node.floor===6) {assert.equal(node.type,'boss');continue;}
  assert(node.next.length>0);
  for(const id of node.next) assert.equal(s.map.flat().find(n=>n.id===id).floor,node.floor+1);
 }
});
test('card costs, disabled plays and block',()=>{
 const s=battle();hand(s,['shield','burst','pulse']);
 assert(E.play(s,0));assert.equal(s.battle.block,10);assert.equal(s.battle.energy,2);
 assert(E.play(s,0));assert.equal(s.battle.energy,0);
 assert.equal(E.play(s,0),false);assert.equal(s.battle.hand.length,1);
 assert.equal(E.play(s,99),false);
});
test('vulnerable boosts damage and weak lowers the shown and actual intent',()=>{
 const s=battle();hand(s,['scan','pulse','cooling']);const initial=s.battle.enemy.hp;
 E.play(s,0);E.play(s,0);assert.equal(s.battle.enemy.hp,initial-9);
 E.play(s,0);const move=E.intent(s);const hp=s.hp;const block=s.battle.block;
 E.endTurn(s);assert.equal(hp-s.hp,Math.max(0,move.damage*move.hits-block));
 assert.equal(s.battle.enemy.weak,0);assert.equal(s.battle.enemy.vulnerable,0);
});
test('strength is applied to each hit and exhaust does not enter discard',()=>{
 const s=battle();hand(s,['amplify','echo']);const hp=s.battle.enemy.hp;
 E.play(s,0);assert.equal(s.battle.exhaust.length,1);assert.equal(s.battle.discard.length,0);
 E.play(s,0);assert.equal(s.battle.enemy.hp,hp-12);
});
test('turn resets block/energy and reshuffles discarded cards',()=>{
 const s=battle();s.battle.draw=[];hand(s,['pulse','shield']);s.battle.block=100;
 E.endTurn(s);assert.equal(s.battle.block,0);assert.equal(s.battle.energy,3);
 assert.equal(s.battle.hand.length,2);assert.equal(s.battle.discard.length,0);
});
test('heat kill cancels enemy action and victory produces unique reward choices',()=>{
 const s=battle();s.battle.enemy.hp=3;s.battle.enemy.burn=4;s.battle.block=0;
 const hp=s.hp;E.endTurn(s);assert.equal(s.phase,'reward');assert.equal(s.hp,hp);
 assert.equal(new Set(s.reward.cards).size,3);assert.equal(s.gold,20);
 const id=s.reward.cards[0];assert(E.reward(s,id));assert.equal(s.deck.length,11);
 assert.deepEqual(s.available,['1-0','1-1']);assert.equal(s.phase,'map');
});
test('skip reward keeps the deck thin and cannot claim twice',()=>{
 const s=battle();s.battle.enemy.hp=1;hand(s,['pulse']);E.play(s,0);
 assert(E.reward(s));assert.equal(s.deck.length,10);assert.equal(E.reward(s),false);
});
test('death ends the run; cards cannot be played afterward',()=>{
 const s=battle();s.hp=1;s.battle.block=0;E.endTurn(s);
 assert.equal(s.phase,'defeat');assert.equal(s.hp,0);assert.equal(E.play(s,0),false);
});
test('camp upgrade changes card effects permanently and only one action is allowed',()=>{
 const s=E.create(3);s.node=s.map[3][0];s.phase='camp';
 assert(E.camp(s,'upgrade',0));assert(s.deck[0].upgraded);assert.equal(E.card(s.deck[0].id,true).damage,9);
 assert.equal(E.camp(s,'heal'),false);
});
test('camp healing caps at max HP',()=>{
 const s=E.create();s.phase='camp';s.node=s.map[3][0];s.hp=65;
 E.camp(s,'heal');assert.equal(s.hp,72);
});
test('event removal spends health, healing spends gold; insufficient funds are rejected',()=>{
 const s=E.create();s.phase='event';s.node=s.map[1][1];
 assert.equal(E.event(s,'heal'),false);assert(E.event(s,'remove',0));assert.equal(s.hp,66);assert.equal(s.deck.length,9);
 s.phase='event';s.gold=20;s.hp=50;assert(E.event(s,'heal'));assert.equal(s.hp,66);assert.equal(s.gold,5);
});
test('elite reward guarantees an additional relic',()=>{
 const s=E.create();s.node=s.map[2][0];s.available=[s.node.id];E.visit(s,s.node.id);
 s.battle.enemy.hp=1;hand(s,['pulse']);E.play(s,0);
 assert.equal(s.phase,'reward');assert(s.reward.relic);assert.equal(s.relics.length,2);assert.equal(s.gold,38);
});
test('treasure grants once, and advancing does not grant again',()=>{
 const s=E.create();s.available=['2-2'];assert(E.visit(s,'2-2'));assert.equal(s.relics.length,2);assert.equal(s.gold,25);
 assert(E.leaveTreasure(s));assert.equal(E.leaveTreasure(s),false);assert.equal(s.gold,25);
});
test('boss awakens exactly once and victory ends the expedition',()=>{
 const s=E.create();s.available=['6-0'];E.visit(s,'6-0');hand(s,['burst','pulse']);s.battle.enemy.hp=60;
 E.play(s,0);assert(s.battle.enemy.awakened);assert.equal(s.battle.enemy.strength,3);
 E.play(s,0);assert.equal(s.battle.enemy.strength,3);
 s.battle.enemy.hp=1;s.battle.energy=3;hand(s,['pulse']);E.play(s,0);assert.equal(s.phase,'victory');
});
test('save/reload preserves mid-battle piles and RNG; corrupt saves are rejected',()=>{
 const s=battle();hand(s,['pulse']);E.play(s,0);const restored=E.restore(JSON.stringify(s));assert.deepEqual(restored,s);
 E.endTurn(s);E.endTurn(restored);assert.deepEqual(restored,s);
 assert.equal(E.restore('bad'),null);assert.equal(E.restore('{}'),null);
 s.deck[0].id='unknown';assert.equal(E.restore(JSON.stringify(s)),null);
});
test('relics affect first turn resources and persistent armor',()=>{
 const s=E.create();s.relics=['cushion','battery','lens','thermos','notebook'];E.visit(s,'0-0');
 assert.equal(s.battle.energy,4);assert.equal(s.battle.hand.length,6);assert.equal(s.battle.strength,1);assert.equal(s.battle.enemy.burn,3);
 hand(s,['insulate']);E.play(s,0);s.battle.block=100;E.endTurn(s);assert.equal(s.battle.block,3);
});
test('all card definitions and upgrades have fully resolved descriptions',()=>{
 for(const id of Object.keys(E.CARDS)) for(const upgraded of [false,true]) {
  const c=E.card(id,upgraded);assert(!E.cardText(c).includes('{'));assert(c.cost>=0);
 }
});
test('a draw card cannot draw itself before resolving',()=>{
 const s=battle();hand(s,['scan']);s.battle.draw=[];s.battle.discard=[];
 E.play(s,0);assert.equal(s.battle.hand.length,0);assert.equal(s.battle.discard[0].id,'scan');
});
test('three starter archetypes have distinct ten-card decks and matching reward guarantees',()=>{
 const decks=[];
 for(const archetype of Object.keys(E.ARCHETYPES)) {
  const s=E.create(14,archetype);decks.push(s.deck.map(c=>c.id).join(','));
  assert.equal(s.archetype,archetype);assert.equal(s.deck.length,10);
  assert(s.deck.every(c=>E.CARDS[c.id]));
  E.visit(s,'0-0');s.battle.enemy.hp=1;hand(s,['pulse']);E.play(s,0);
  assert.equal(s.phase,'reward');assert(s.reward.cards.some(id=>E.CARDS[id].family===archetype));
  assert.equal(E.restore(JSON.stringify(s)).archetype,archetype);
 }
 assert.equal(new Set(decks).size,3);
});
test('legacy common-deck saves remain loadable without changing their cards',()=>{
 const s=E.create(9);delete s.archetype;const deck=structuredClone(s.deck);
 const restored=E.restore(JSON.stringify(s));assert.equal(restored.archetype,'vibration');assert.deepEqual(restored.deck,deck);
 s.archetype='invalid';assert.equal(E.restore(JSON.stringify(s)),null);
});
test('public rules text is English and old localized logs are migrated',()=>{
 const texts=[...Object.values(E.CARDS).flatMap(c=>[c.name,c.text]),...Object.values(E.ARCHETYPES).flatMap(a=>[a.name,a.subtitle,a.description]),...Object.values(E.RELICS).flatMap(r=>[r.name,r.text]),...Object.values(E.ENEMIES).flatMap(e=>[e.name,e.description])];
 assert(texts.every(text=>!/[\uac00-\ud7af]/.test(text)));
 const s=E.create(1);s.log=['\uc774\uc804 \uae30\ub85d'];
 const restored=E.restore(JSON.stringify(s));assert(restored);assert.match(restored.log[0],/resumed/);assert.deepEqual(restored.deck,s.deck);
});

test('combat feedback reports each hit after block and caps lethal HP damage',()=>{
 const s=battle(); hand(s,['echo']); s.battle.enemy.block=3; s.battle.enemy.hp=4;
 const effects=[]; E.play(s,0,e=>effects.push(e));
 assert.deepEqual(effects,[{target:'enemy',kind:'absorb',amount:3},{target:'enemy',kind:'damage',amount:1},{target:'enemy',kind:'damage',amount:3}]);
 assert.equal(s.phase,'reward');
});
test('incoming multi-hit feedback separates blocked damage from actual HP loss',()=>{
 const s=battle(); s.battle.enemy.id='beetle'; s.battle.turn=2; s.battle.block=9;
 const effects=[]; const hp=s.hp; E.endTurn(s,e=>effects.push(e));
 assert.deepEqual(effects,[{target:'player',kind:'absorb',amount:7},{target:'player',kind:'absorb',amount:2},{target:'player',kind:'damage',amount:5}]);
 assert.equal(hp-s.hp,5);
});
test('healing feedback uses actual restored HP and rejected plays emit nothing',()=>{
 const s=battle(); hand(s,['recovery']); s.hp=s.maxHp-2; const effects=[];
 E.play(s,0,e=>effects.push(e));
 assert.deepEqual(effects,[{target:'player',kind:'heal',amount:2},{target:'player',kind:'block',amount:4}]);
 assert.equal(E.play(s,99,e=>effects.push(e)),false); assert.equal(effects.length,2);
});
test('lethal Heat feedback is capped and cancels the incoming attack',()=>{
 const s=battle(); s.battle.enemy.hp=2; s.battle.enemy.burn=8; const effects=[];
 E.endTurn(s,e=>effects.push(e));
 assert.deepEqual(effects,[{target:'enemy',kind:'damage',amount:2,source:'heat'}]); assert.equal(s.phase,'reward');
});
