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
test('four starter archetypes have distinct ten-card decks and matching reward guarantees',()=>{
 const decks=[];
 for(const archetype of Object.keys(E.ARCHETYPES)) {
  const s=E.create(14,archetype);decks.push(s.deck.map(c=>c.id).join(','));
  assert.equal(s.archetype,archetype);assert.equal(s.deck.length,10);
  assert(s.deck.every(c=>E.CARDS[c.id]));
  E.visit(s,'0-0');s.battle.enemy.hp=1;hand(s,['pulse']);E.play(s,0);
  assert.equal(s.phase,'reward');assert(s.reward.cards.some(id=>E.CARDS[id].family===archetype));
  assert.equal(E.restore(JSON.stringify(s)).archetype,archetype);
 }
 assert.equal(new Set(decks).size,4);
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

test('research starters keep ten cards, use ten distinct family basics, and preserve restored decks',()=>{
 for (const family of Object.keys(E.ARCHETYPES)) {
  const s=E.create(14,family); const special=s.deck.filter(c=>E.CARDS[c.id].research);
  assert.equal(s.deck.length,10); assert.equal(special.length,0); assert.equal(new Set(s.deck.map(c=>c.id)).size,10); assert(s.deck.every(c=>E.CARDS[c.id].family===family));
  assert(special.every(c=>E.CARDS[c.id].family===family));
 }
 const old=E.create(12); old.deck=Array.from({length:10},()=>({id:'pulse',upgraded:false}));
 assert.deepEqual(E.restore(JSON.stringify(old)).deck,old.deck);
});
test('Tactile Brush amplifies each of its three hits',()=>{
 const s=battle(); hand(s,['tactile_brush']); s.battle.strength=2; const hp=s.battle.enemy.hp; const fx=[];
 E.play(s,0,e=>fx.push(e)); assert.equal(s.battle.enemy.hp,hp-15);
 assert.deepEqual(fx.map(e=>e.amount),[5,5,5]); assert(fx.every(e=>e.source==='vibration'));
});
test('Phantom Funneling bypasses Block without consuming it',()=>{
 const s=battle(); hand(s,['funneling']); s.battle.enemy.block=40; const hp=s.battle.enemy.hp;
 E.play(s,0); assert.equal(s.battle.enemy.hp,hp-10); assert.equal(s.battle.enemy.block,40);
});
test('Thermal Referral strikes twice, then adds Heat that ticks before the enemy',()=>{
 const s=battle(); hand(s,['thermal_referral']); const hp=s.battle.enemy.hp; const fx=[];
 E.play(s,0,e=>fx.push(e)); assert.equal(s.battle.enemy.hp,hp-12); assert.equal(s.battle.enemy.burn,2);
 assert.deepEqual(fx.filter(e=>e.kind==='damage').map(e=>e.amount),[6,6]);
 E.endTurn(s); assert.equal(s.battle.enemy.hp,hp-14); assert.equal(s.battle.enemy.burn,1);
});
test('Thermal Masking evades one hit, preserves Block and counters once',()=>{
 const s=battle(); hand(s,['thermal_masking']); s.battle.block=4; const hp=s.hp, enemy=s.battle.enemy.hp, fx=[];
 E.play(s,0); assert.equal(s.battle.evade,1); assert.equal(s.battle.counter,8); assert.equal(s.battle.exhaust[0].id,'thermal_masking');
 E.endTurn(s,e=>fx.push(e)); assert.equal(s.hp,hp); assert.equal(s.battle.enemy.hp,enemy-8);
 assert.equal(s.battle.evade,0); assert.equal(s.battle.counter,0);
 assert.equal(fx[0].kind,'evade'); assert.equal(fx[1].source,'counter');
 E.endTurn(s); assert(s.hp<hp); assert.equal(s.battle.enemy.hp,enemy-8);
});
test('evasion only stops the first hit of a multi-hit enemy attack',()=>{
 const s=battle(); hand(s,['thermal_masking']); s.battle.enemy.id='beetle'; s.battle.turn=2; s.battle.block=0;
 E.play(s,0); const hp=s.hp; E.endTurn(s); assert.equal(s.hp,hp-7);
});
test('counter damage respects enemy Block but ignores Amplify and Vulnerable',()=>{
 const s=battle(); hand(s,['thermal_masking']); s.battle.enemy.block=3; s.battle.enemy.vulnerable=2; s.battle.strength=30;
 E.play(s,0); const hp=s.battle.enemy.hp, fx=[]; E.endTurn(s,e=>fx.push(e));
 assert.equal(s.battle.enemy.hp,hp-5); assert(fx.some(e=>e.kind==='absorb'&&e.amount===3));
});
test('lethal counter cancels further hits and enemy buffs and produces a reward',()=>{
 const s=battle(); hand(s,['thermal_masking']); s.battle.enemy.id='beetle'; s.battle.turn=2; s.battle.enemy.hp=3; s.battle.block=0;
 E.play(s,0); const hp=s.hp,fx=[]; E.endTurn(s,e=>fx.push(e));
 assert.equal(s.phase,'reward'); assert.equal(s.hp,hp); assert(fx.some(e=>e.source==='counter'&&e.amount===3));
 assert.equal(fx.filter(e=>e.kind==='evade').length,1);
});
test('evasion persists through non-attacking turns and resets at the next battle',()=>{
 const s=battle(); hand(s,['thermal_masking']); s.battle.enemy.id='sentinel';
 E.play(s,0); E.endTurn(s); assert.equal(s.battle.evade,1); assert.equal(s.battle.counter,8);
 const hp=s.hp; E.endTurn(s); assert.equal(s.hp,hp); assert.equal(s.battle.evade,0);
 s.battle.enemy.hp=1; hand(s,['funneling']); E.play(s,0); E.reward(s); E.visit(s,'1-0');
 assert.equal(s.battle.evade,0); assert.equal(s.battle.counter,0);
});
test('ThermicVib Fusion combines direct damage, Heat and defense',()=>{
 const s=battle(); hand(s,['thermic_vib']); const hp=s.battle.enemy.hp, block=s.battle.block;
 E.play(s,0); assert.equal(s.battle.enemy.hp,hp-7); assert.equal(s.battle.enemy.burn,3); assert.equal(s.battle.block,block+4);
});
test('Pseudo-Haptic Shift draws, exhausts and does not stack or weaken a prepared counter',()=>{
 const s=battle(); hand(s,['thermal_masking','pseudo_haptic']); s.battle.hand[0].upgraded=true;
 E.play(s,0); const count=s.battle.hand.length; E.play(s,0);
 assert.equal(s.battle.hand.length,count); assert.equal(s.battle.evade,1); assert.equal(s.battle.counter,12); assert.equal(s.battle.exhaust.length,2);
});
test('evasion and counter survive saves; legacy battles default safely; invalid fields are rejected',()=>{
 const s=battle(); hand(s,['thermal_masking']); E.play(s,0);
 assert.deepEqual(E.restore(JSON.stringify(s)),s);
 for (const [field,value] of [['evade',2],['evade',-1],['counter',101],['counter','8']]) {
  const invalid=structuredClone(s); invalid.battle[field]=value; assert.equal(E.restore(JSON.stringify(invalid)),null);
 }
 delete s.battle.evade; delete s.battle.counter; const old=E.restore(JSON.stringify(s));
 assert.equal(old.battle.evade,0); assert.equal(old.battle.counter,0);
});
test('all forty field specials and four neutral cards have sources, upgrades and can appear in rewards',()=>{
 const ids=Object.keys(E.CARDS).filter(id=>['special','neutral'].includes(E.CARDS[id].rarity)); assert.equal(ids.length,44);
 for(const id of ids) { const c=E.card(id); const source=E.RESEARCH[c.research]; assert(source.title&&source.concept&&c.adaptation); assert(source.link.startsWith('https://')); assert.notEqual(E.cardText(c),E.cardText(E.card(id,true))); }
 const found=new Set();
 for(let seed=0;seed<450;seed++) { const s=battle(seed); s.battle.enemy.hp=1; hand(s,['pulse']); E.play(s,0); s.reward.cards.forEach(id=>found.add(id)); }
 assert(ids.every(id=>found.has(id)));
});

test('Morale boosts direct attacks for two turns, multiplies Vulnerable and leaves Heat unchanged',()=>{
 const s=battle(); hand(s,['vibration_focus','pulse']); s.battle.enemy.hp=100; s.battle.enemy.maxHp=100; s.battle.enemy.vulnerable=2;
 E.play(s,0); const hp=s.battle.enemy.hp; E.play(s,0); assert.equal(hp-s.battle.enemy.hp,11);
 s.battle.enemy.burn=3; const heatHp=s.battle.enemy.hp; E.endTurn(s); assert.equal(heatHp-s.battle.enemy.hp,3); assert.equal(s.battle.morale,1);
 hand(s,['pulse']); const nextHp=s.battle.enemy.hp; E.play(s,0); assert.equal(nextHp-s.battle.enemy.hp,11);
 E.endTurn(s); assert.equal(s.battle.morale,0);
});
test('all four basic catalogs have ten distinct cards, complete upgrades and saveable states',()=>{
 assert.equal(Object.keys(E.ARCHETYPES).length,4);
 for(const [family,a] of Object.entries(E.ARCHETYPES)) {
  assert.equal(a.cards.length,10); assert.equal(new Set(a.cards).size,10);
  for(const id of a.cards) {
   assert.equal(E.CARDS[id].family,family); assert.equal(E.CARDS[id].rarity,'basic');
   for(const upgraded of [false,true]) {
    const s=battle(); s.battle.enemy.hp=100; s.battle.enemy.maxHp=100;
    hand(s,[id]); s.battle.hand[0].upgraded=upgraded;
    assert(E.play(s,0)); assert(E.restore(JSON.stringify(s)));
   }
  }
 }
});
test('relics are haptic devices and old relic IDs retain their gameplay bonuses',()=>{
 assert.equal(E.RELICS.cushion.name,'Geomagic Touch'); assert.equal(E.RELICS.thermos.name,'Peltier Thermode');
 assert(Object.values(E.RELICS).every(r=>r.device&&r.text));
 const s=E.create(1); s.relics=['cushion','battery','lens','thermos','notebook','moss']; E.visit(s,'0-0');
 assert.equal(s.battle.block,5); assert.equal(s.battle.energy,4); assert.equal(s.battle.strength,1); assert.equal(s.battle.enemy.burn,3); assert.equal(s.battle.hand.length,6);
 assert(E.restore(JSON.stringify(s)));
});

test('each field has ten specials linked to ten different source papers',()=>{
 for(const [family,a] of Object.entries(E.ARCHETYPES)) {
  assert.equal(a.specialCards.length,10);
  const sources=a.specialCards.map(id=>E.CARDS[id].research);
  assert.equal(new Set(sources).size,10);
  assert(a.specialCards.every(id=>E.CARDS[id].family===family));
 }
});
test('all active specials and neutral cards resolve and restore in normal and upgraded form',()=>{
 for(const [id,c] of Object.entries(E.CARDS).filter(([,c])=>['special','neutral'].includes(c.rarity))) for(const upgraded of [false,true]) {
  const s=battle(); s.hp=40;s.battle.enemy.hp=200;s.battle.enemy.maxHp=200;s.battle.enemy.burn=5;
  hand(s,[id]);s.battle.hand[0].upgraded=upgraded;
  assert(E.play(s,0),id); assert(E.restore(JSON.stringify(s)),id);
  E.endTurn(s); assert(s.hp>=0&&s.hp<=s.maxHp,id);
 }
});
test('Conductive Release consumes Heat, bypasses Block, and does not gain direct attack multipliers',()=>{
 const s=battle();hand(s,['thermal_conduct']);s.battle.enemy.burn=5;s.battle.enemy.block=50;s.battle.enemy.vulnerable=3;s.battle.strength=20;s.battle.morale=3;
 const hp=s.battle.enemy.hp;E.play(s,0);assert.equal(hp-s.battle.enemy.hp,10);assert.equal(s.battle.enemy.burn,0);assert.equal(s.battle.enemy.block,50);
 const empty=battle();hand(empty,['thermal_conduct']);const before=empty.battle.enemy.hp;E.play(empty,0);assert.equal(empty.battle.enemy.hp,before);
});
test('cross-family bonus includes Neutral, does not trigger on the same family, and resets each turn',()=>{
 for(const [previous,bonus] of [['vibration',4],['neutral',4],['multimodal',0],[null,0]]) {
  const s=battle();hand(s,['multi_guidance']);s.battle.enemy.hp=100;s.battle.enemy.maxHp=100;s.battle.lastFamily=previous;
  E.play(s,0);assert.equal(s.battle.enemy.hp,100-7-bonus);assert.equal(s.battle.lastFamily,'multimodal');
  E.endTurn(s);assert.equal(s.battle.lastFamily,null);
 }
});
test('neutral cards are earnable in every archetype; basic and legacy cards are excluded from rewards',()=>{
 const found=new Set();
 for(let seed=0;seed<180;seed++)for(const family of Object.keys(E.ARCHETYPES)){
  const s=E.create(seed,family);E.visit(s,'0-0');s.battle.enemy.hp=1;hand(s,['pulse']);E.play(s,0);
  assert.equal(s.reward.cards.length,3);assert.equal(new Set(s.reward.cards).size,3);
  assert(s.reward.cards.some(id=>E.CARDS[id].family===family));
  for(const id of s.reward.cards){assert(['special','neutral'].includes(E.CARDS[id].rarity));if(E.CARDS[id].family==='neutral')found.add(id);}
 }
 assert.equal(found.size,4);
});
