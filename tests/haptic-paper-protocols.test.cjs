const {test}=require('node:test'),assert=require('node:assert/strict');
const E=require('../assets/js/haptic-run-engine.js');
function battle(family='vibration'){const s=E.create(7,family);s.relics=[];E.visit(s,'0-0');s.battle.block=0;s.battle.retain=0;s.battle.enemy.hp=500;s.battle.enemy.maxHp=500;return s;}
function cast(s,id,choice=null,upgraded=false){s.battle.hand.push({id,upgraded});s.battle.energy=99;const index=s.battle.hand.length-1;assert(E.play(s,index,()=>{},choice),id);}
function end(s){s.battle.block=100;E.endTurn(s);}
function turret(s,id,choice=null){cast(s,id,choice);return s.battle.turrets.at(-1);}
function activate(s){cast(s,'generation_align');}
function pair(s,a,b){s.battle.hand=[{id:a,upgraded:false},{id:b,upgraded:false}];s.battle.energy=5;return E.fusionPreview(s,[0,1]);}

test('referred contact returns blocked amplitude once; moving contact progresses across three hits',()=>{
 const s=battle();cast(s,'vib_event');end(s);assert.equal(s.battle.enemy.hp,494);end(s);assert.equal(s.battle.enemy.hp,494);
 const m=battle();cast(m,'vib_stretch');m.battle.enemy.id='beetle';m.battle.turn=2;end(m);assert.equal(m.battle.enemy.hp,494);assert.equal(m.battle.research.stretch,1);m.battle.turn=1;m.battle.enemy.block=0;end(m);assert.equal(m.battle.enemy.hp,488);assert.equal(m.battle.research.stretch,0);
});
test('masking protects a too-small shield; boundaries bank protection for the next turn',()=>{
 const s=battle();cast(s,'vib_mask');E.endTurn(s);assert.equal(s.hp,72);assert.equal(s.battle.enemy.hp,494);assert.equal(s.battle.research.maskPulse,0);
 const bank=battle();cast(bank,'vib_boundaries');end(bank);assert.equal(bank.battle.block,3);assert.equal(bank.battle.research.boundaryReserve,0);
});
test('stimulation crossover branches on the telegraphed threshold; fiery contact reacts differently to blocked and damaging hits',()=>{
 const s=battle();s.battle.block=6;cast(s,'vib_compare');assert.equal(s.battle.thorns,3);
 const low=battle();cast(low,'vib_compare');assert.equal(low.battle.block,9);assert.equal(low.battle.retaliate,3);
 const hot=battle();cast(hot,'vib_fiery');end(hot);assert.equal(hot.battle.enemy.burn,2);
 const damaged=battle();cast(damaged,'vib_fiery');damaged.battle.enemy.id='beetle';damaged.battle.turn=2;E.endTurn(damaged);assert.equal(damaged.hp,62);assert.equal(damaged.battle.enemy.burn,0);
});
test('prompted resonance records an attack and replays it on two later turns, not immediately',()=>{
 const s=battle();cast(s,'vib_prompt');end(s);assert.equal(s.battle.enemy.hp,500);assert.equal(s.battle.research.wave,8);end(s);assert.equal(s.battle.enemy.hp,492);end(s);assert.equal(s.battle.enemy.hp,484);assert.equal(s.battle.research.waveLeft,0);
});
test('conversation retrieves defensive cards; texture learns from damage; adaptive rendering recognizes repeated patterns',()=>{
 const s=battle();s.battle.hand=[];s.battle.draw=[{id:'pulse',upgraded:false},{id:'shield',upgraded:false}];s.battle.discard=[{id:'thermal_guard',upgraded:false}];cast(s,'vib_conversation');assert.deepEqual(s.battle.hand.map(c=>c.id),['shield','thermal_guard']);
 const learn=battle();cast(learn,'vib_gan');E.endTurn(learn);assert.equal(learn.battle.thorns,1);end(learn);assert.equal(learn.battle.retain,5);
 const adaptive=battle();cast(adaptive,'vib_texture');E.endTurn(adaptive);assert.equal(adaptive.hp,72);adaptive.battle.turn=1;E.endTurn(adaptive);assert.equal(adaptive.hp,66);assert.equal(adaptive.battle.research.seen.length,1);
});
test('referral echoes one turn later; thermal masking temporarily removes Heat and relocates it on evasion',()=>{
 const s=battle('thermal');cast(s,'thermal_referral');assert.equal(s.battle.enemy.burn,4);end(s);assert.equal(s.battle.enemy.burn,6);
 const mask=battle('thermal');mask.battle.enemy.burn=10;cast(mask,'thermal_masking');assert.equal(mask.battle.enemy.burn,0);assert.equal(mask.battle.research.masked,10);E.endTurn(mask);assert.equal(mask.hp,72);assert.equal(mask.battle.enemy.burn,17);assert.equal(mask.battle.enemy.hp,500);
});
test('six wrist sites close a circuit; grasp coupling is bounded even when the bracelet grants Block',()=>{
 const s=battle('thermal');cast(s,'thermal_bracelet');for(let i=0;i<6;i++)cast(s,'thermal_ember');assert.equal(s.battle.research.ring,0);assert.equal(s.battle.enemy.hp,470);assert.equal(s.battle.block,12);
 const coupled=battle('thermal');cast(coupled,'thermal_grasp');cast(coupled,'thermal_bracelet');cast(coupled,'thermal_ember');assert.equal(coupled.battle.enemy.burn,8);assert.equal(coupled.battle.research.heatApps,2);assert.equal(coupled.battle.block,4);
});
test('immersion activates after three applications, and acceleration modifies successive thermal ticks',()=>{
 const s=battle('thermal');cast(s,'thermal_vr');for(let i=0;i<3;i++)cast(s,'thermal_ember');assert.equal(s.battle.enemy.burn,17);end(s);assert.equal(s.battle.research.heatApps,0);
 const flow=battle('thermal');flow.battle.enemy.burn=8;flow.battle.heatRetention=1;cast(flow,'thermal_motion');for(let i=0;i<3;i++)cast(flow,'thermal_power');assert.equal(flow.battle.enemy.hp,464);assert.equal(flow.battle.enemy.burn,8);assert.equal(flow.battle.research.motion,0);
});
test('HeatFlow routes require a choice and trade immediate Heat against a late closed-loop burst',()=>{
 for(const mode of ['line','loop']){
  const s=battle('thermal');s.battle.hand=[{id:'thermal_flow',upgraded:false}];const before=JSON.stringify(s);assert.equal(E.play(s,0),false);assert.equal(JSON.stringify(s),before);
  assert(E.play(s,0,()=>{},mode));assert.equal(s.battle.enemy.burn,mode==='line'?6:0);
  for(let i=0;i<3;i++)end(s);assert.equal(s.battle.research.flow,undefined);assert.equal(s.battle.enemy.hp,mode==='line'?470:464);
 }
});
test('Flip-Pelt alternates faces; evaporation trades Heat for delayed protection; material insulation protects a finite number of decays',()=>{
 const s=battle('thermal');cast(s,'thermal_flip');assert.equal(s.battle.enemy.burn,6);cast(s,'thermal_flip');assert.equal(s.battle.block,12);end(s);assert.equal(s.battle.enemy.burn,6);
 const chill=battle('thermal');chill.battle.enemy.burn=10;cast(chill,'thermal_chill');assert.equal(chill.battle.enemy.burn,6);assert.equal(chill.battle.research.cooling,14);E.endTurn(chill);assert.equal(chill.hp,72);assert.equal(chill.battle.research.cooling,0);
 const ins=battle('thermal');ins.battle.enemy.burn=5;cast(ins,'thermal_conduct','insulate');end(ins);end(ins);assert.equal(ins.battle.enemy.burn,5);end(ins);assert.equal(ins.battle.enemy.burn,4);
});
test('module choice alters later recipes without mutating the preview; wetness transfer needs a thermal partner',()=>{
 const s=battle('multimodal');cast(s,'multi_blox','heat');const p=pair(s,'multimodal_strike','multimodal_guard');assert.equal(p.burn,3);const raw=JSON.stringify(s);E.fusionPreview(s,[0,1]);assert.equal(JSON.stringify(s),raw);
 const transfer=battle('multimodal');let a=pair(transfer,'multi_moisture','thermal_guard');assert(a.notes.some(x=>x.includes('transferred')));assert.equal(a.damage,0);assert.equal(a.block,22);
 a=pair(transfer,'multi_moisture','multimodal_guard');assert.equal(a.damage,7);assert.equal(a.block,19);
});
test('avatar context biases the dominant cue; force/electrical alignment conditionally pierces',()=>{
 const s=battle('multimodal');cast(s,'multi_avatar');const p=pair(s,'multimodal_strike','multimodal_guard');assert.equal(p.damage,10);assert.equal(p.block,15);
 const edge=battle('multimodal');let q=pair(edge,'multi_shape','multimodal_guard');assert(q.pierce);q=pair(edge,'multi_shape','multimodal_strike');assert(!q.pierce);
});
test('Hap-n-Roll returns a reusable partner but never rescues an Exhaust material; symmetric bimanual cues split the hit',()=>{
 const s=battle('multimodal');pair(s,'multi_roll','multimodal_guard');assert(E.fuse(s,[0,1]));assert(s.battle.hand.some(c=>c.id==='multimodal_guard'));assert(s.battle.discard.some(c=>c.id==='multi_roll'));
 const exhaust=battle('multimodal');pair(exhaust,'multi_roll','multimodal_sync');assert(E.fuse(exhaust,[0,1]));assert(exhaust.battle.exhaust.some(c=>c.id==='multimodal_sync'));
 const hands=battle('multimodal');const p=pair(hands,'multi_bimanual','multimodal_pair');assert.equal(p.hits,2);assert.equal(p.block,23);
});
test('buoyancy moves half the shield to next turn; tool guidance is sensitive to selection order',()=>{
 const s=battle('multimodal');const p=pair(s,'multi_aqua','multimodal_guard');assert.equal(p.reserve,11);assert.equal(p.block,12);E.fuse(s,[0,1]);assert.equal(s.battle.research.reserve,11);E.endTurn(s);assert.equal(s.battle.block,11);
 const guide=battle('multimodal');let q=pair(guide,'multi_guidance','multimodal_guard');assert(q.notes.includes('Attack → defense toolpath'));const damage=q.damage;
 guide.battle.hand.reverse();q=E.fusionPreview(guide,[0,1]);assert(q.damage<damage);assert(q.notes.includes('Reverse toolpath: defensive correction'));
});
test('cabin channels cycle only on confirmed fusion; ultrasonic modulation branches on matching sensory families',()=>{
 const s=battle('multimodal');cast(s,'multi_attra');pair(s,'multimodal_strike','multimodal_guard');const first=E.fusionPreview(s,[0,1]);assert.equal(first.burn,4);assert.equal(s.battle.research.attraPhase,0);E.fuse(s,[0,1]);assert.equal(s.battle.research.attraPhase,1);
 const illusion=battle('multimodal');let p=pair(illusion,'multi_illusion','multimodal_guard');assert.equal(p.evade,1);assert(!p.pierce);p=pair(illusion,'multi_illusion','thermal_guard');assert(p.pierce);assert.equal(p.evade,0);
});
test('generated waveform cycles quiet/peak/tail, while prompt-to-touch has a genuine charging stage',()=>{
 const s=battle('generation');const t=turret(s,'gen_hapticgen');for(let i=0;i<3;i++)activate(s);assert.equal(s.battle.enemy.hp,485);assert.equal(t.phase,0);
 const pipe=battle('generation');turret(pipe,'gen_prompt');activate(pipe);assert.equal(pipe.battle.enemy.hp,500);activate(pipe);assert.equal(pipe.battle.enemy.hp,482);
});
test('diffusion stabilizes across activations and gets re-noised by damage; conversational edits change a chosen installation',()=>{
 const s=battle('generation');const t=turret(s,'gen_ldm');activate(s);assert.equal(t.power,8);s.battle.block=0;s.battle.enemy.strength=20;E.endTurn(s);assert.equal(t.power,9);
 const chat=battle('generation');const a=turret(chat,'generation_prompt');cast(chat,'gen_chathap',`${a.id}:invert`);assert.equal(a.type,'shield');assert.equal(a.program,undefined);
 const state=JSON.stringify(chat);chat.battle.hand.push({id:'gen_chathap',upgraded:false});const before=JSON.stringify(chat);assert.equal(E.play(chat,chat.battle.hand.length-1,()=>{},'999:amp'),false);assert.equal(JSON.stringify(chat),before);
});
test('perceptual descriptors choose three distinct texture programs and paired texture follows the last visual cue',()=>{
 const rough=battle('generation');turret(rough,'gen_descriptors','rough');activate(rough);assert.equal(rough.battle.enemy.hp,494);
 const bump=battle('generation');turret(bump,'gen_descriptors','bumpy');activate(bump);assert.equal(bump.battle.enemy.weak,2);assert.equal(bump.battle.block,4);
 const slippery=battle('generation');turret(slippery,'gen_descriptors','slippery');activate(slippery);assert.equal(slippery.battle.evade,1);
 const paired=battle('generation');turret(paired,'gen_texture');cast(paired,'pulse');activate(paired);assert.equal(paired.battle.enemy.hp,486);assert.equal(paired.battle.block,0);
});
test('GAN preference improves one candidate at a cost to the other; video events do not fire twice for unchanged intent',()=>{
 const s=battle('generation');const a=turret(s,'generation_prompt'),b=turret(s,'generation_guard');cast(s,'gen_gan',String(a.id));assert.equal(a.power,7);assert.equal(b.power,4);
 const video=battle('generation');turret(video,'gen_video');activate(video);activate(video);assert.equal(video.battle.enemy.hp,491);video.battle.turn=2;activate(video);assert.equal(video.battle.enemy.hp,482);
});
test('generated scenes depend on distinct object roles; learned rendering generalizes only to newly played families',()=>{
 const scene=battle('generation');turret(scene,'gen_scene');activate(scene);assert.equal(scene.battle.block,4);turret(scene,'generation_prompt');turret(scene,'generation_guard');activate(scene);assert.equal(scene.battle.queuedEnergy,1);
 const learn=battle('generation');turret(learn,'gen_learning');activate(learn);assert.equal(learn.battle.queuedDraw,1);activate(learn);assert.equal(learn.battle.block,2);cast(learn,'thermal_ember');activate(learn);assert.equal(learn.battle.queuedDraw,2);
});
test('every special has a unique protocol; pending state and turret programs survive saves; malformed state is rejected',()=>{
 const specials=Object.values(E.CARDS).filter(c=>c.rarity==='special');assert.equal(specials.length,40);assert.equal(new Set(specials.map(c=>c.protocol)).size,40);
 const s=battle('thermal');cast(s,'thermal_flow','loop');cast(s,'thermal_masking');assert.deepEqual(E.restore(JSON.stringify(s)),s);
 const g=battle('generation');turret(g,'gen_prompt');activate(g);assert.deepEqual(E.restore(JSON.stringify(g)),g);
 for(const change of [x=>x.battle.research.unknown=1,x=>x.battle.research.stretch=99,x=>x.battle.research.flow.left=-1]){const bad=structuredClone(s);change(bad);assert.equal(E.restore(JSON.stringify(bad)),null);}
 const malformed=structuredClone(g);delete malformed.battle.turrets[0].phase;assert.equal(E.restore(JSON.stringify(malformed)),null);
 const legacy=battle();delete legacy.battle.research;delete legacy.battle.researchCue;assert(E.restore(JSON.stringify(legacy)));
});
