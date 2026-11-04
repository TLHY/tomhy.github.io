/* Fictional research mechanics derived from supplied paper summaries, not empirical simulations. */
(function(root){
 const numbers=['boundaryReserve','conduction','referred','stretch','stretchStep','maskPulse','boundary','reserve','fiery','recordWave','wave','waveLeft','waveTurn','texture','adaptive','referral','masked','maskRelease','bracelet','ring','immersion','heatApps','motion','motionStep','flip','noDecay','grasp','graspTurn','cooling','blox','avatar','attra','attraPhase'];
 const cap=(n,a,b)=>Math.max(a,Math.min(b,n));
 function init(b){if(!b.research)b.research={};return b.research;}
 function stateValid(b){
  const r=init(b);if(!r||Array.isArray(r)||typeof r!=='object')return false;
  for(const [key,value]of Object.entries(r)){
   if(numbers.includes(key)){if(!Number.isSafeInteger(value)||value<0||value>1000000)return false;}
   else if(key==='seen'){if(!Array.isArray(value)||value.length>12||value.some(x=>typeof x!=='string'||x.length>30))return false;}
   else if(key==='flow'){if(!value||!['line','loop'].includes(value.mode)||!Number.isInteger(value.left)||value.left<1||value.left>3||!Number.isInteger(value.power)||value.power<1||value.power>30)return false;}
   else return false;
  }
  const limits={stretch:3,motion:3,ring:5,flip:1,conduction:1,blox:3,attraPhase:2,waveLeft:2};for(const [k,max]of Object.entries(limits))if((r[k]||0)>max)return false;
  if(r.stretch&&!r.stretchStep||r.waveLeft&&(!r.wave||!r.waveTurn)||r.adaptive&&!Array.isArray(r.seen))return false;
  return true;
 }
 function choices(c,s){
  const simple={thermal_flow:[['line','Straight route','Front-load Heat, then continue along two more nodes.'],['loop','Loop route','Build Heat over three nodes; the closing loop adds three bonus Heat passes.']],thermal_conduct:[['conduct','Conductor','Double the next Heat tick, then lose half the Heat.'],['insulate','Insulator','Protect Heat from its next two normal decays.']],multi_blox:[['heat','Thermal module','Every fusion adds Heat.'],['air','Airflow module','Every fusion adds Weak.'],['scent','Olfactory cue','Every fusion draws one extra card.']],gen_descriptors:[['rough','Rough','Three small strikes each activation.'],['bumpy','Bumpy','Weak plus a defensive bump.'],['slippery','Slippery','Evasion every other activation.']]};
  if(simple[c.protocol])return simple[c.protocol].map(([id,label,description])=>({id,label,description}));
  if(c.protocol==='gen_chathap')return s.battle.turrets.flatMap(t=>[['amp','Amplify','Increase its power.'],['invert','Invert','Swap attack and defense roles; remove its old program.'],['tempo','Preview','Activate it now; permanently lose 1 power.']].map(([verb,label,description])=>({id:`${t.id}:${verb}`,label:`${label} #${t.id}`,description})));
  if(c.protocol==='gen_gan')return s.battle.turrets.map(t=>({id:String(t.id),label:`Prefer turret #${t.id}`,description:'Improve this candidate; other candidates lose 1 power.'}));
  return [];
 }
 function choiceValid(c,s,choice){const opts=choices(c,s);return opts.length?opts.some(o=>o.id===choice):!['gen_chathap','gen_gan'].includes(c.protocol);}
 function contextCard(s,c,choice,x){
  const b=s.battle,r=init(b),p=c.protocolPower||1,e=b.enemy;
  switch(c.protocol){
   case 'vib_event':r.referred=p;break;
   case 'vib_stretch':r.stretch=3;r.stretchStep=p;break;
   case 'vib_mask':r.maskPulse=p;break;
   case 'vib_boundaries':r.boundary=p;break;
   case 'vib_compare':if(b.block>=x.intent().damage){b.thorns+=p;x.tag('Matched threshold: permanent counter');}else{x.block(p*3);b.retaliate+=p;}break;
   case 'vib_fiery':r.fiery=p;break;
   case 'vib_prompt':r.recordWave=p;break;
   case 'vib_conversation':x.retrieve('guard',p);break;
   case 'vib_gan':r.texture=p;break;
   case 'vib_texture':r.adaptive=p;r.seen=r.seen||[];break;
   case 'thermal_referral':r.referral=(r.referral||0)+p;break;
   case 'thermal_masking':r.masked=(r.masked||0)+e.burn;e.burn=0;r.maskRelease=Math.max(r.maskRelease||0,p);break;
   case 'thermal_bracelet':r.bracelet=p;r.ring=r.ring||0;break;
   case 'thermal_vr':r.immersion=p;break;
   case 'thermal_flow':r.flow={mode:choice,left:choice==='line'?2:3,power:p};if(choice==='line')x.heat(p*2);break;
   case 'thermal_motion':r.motion=3;r.motionStep=p;break;
   case 'thermal_flip':if(!r.flip){x.heat(p);r.flip=1;x.tag('Hot face');}else{x.block(Math.min(28,e.burn+p));r.noDecay=Math.max(r.noDecay||0,1);r.flip=0;x.tag('Cold face');}break;
   case 'thermal_grasp':r.grasp=p;r.graspTurn=0;break;
   case 'thermal_chill':{const n=Math.min(4,e.burn);e.burn-=n;r.cooling=p+n*2;e.weak+=2;x.tag(`Evaporated ${n} Heat`);break;}
   case 'thermal_conduct':if(choice==='conduct')r.motion=1,r.motionStep=100;else r.noDecay=Math.max(r.noDecay||0,p);if(choice==='conduct')r.conduction=1;break;
   case 'multi_blox':r.blox={heat:1,air:2,scent:3}[choice];break;
   case 'multi_avatar':r.avatar=p;break;
   case 'multi_attra':r.attra=p;r.attraPhase=r.attraPhase||0;break;
   case 'gen_chathap':{const [id,verb]=choice.split(':'),t=b.turrets.find(t=>t.id===Number(id));if(verb==='amp')t.power=Math.min(x.turretCap(t.type),t.power+p);if(verb==='invert'){t.type={pulse:'shield',shield:'pulse',rail:'bastion',bastion:'rail',scatter:'repair',repair:'scatter',supply:'recon',recon:'supply',suppressor:'shield'}[t.type];t.power=Math.min(x.turretCap(t.type),t.power);delete t.program;delete t.variant;delete t.phase;delete t.seen;delete t.lastEvent;delete t.pending;}if(verb==='tempo'){x.activate([t]);t.power=Math.max(1,t.power-1);}x.tag('Conversation revision');break;}
   case 'gen_gan':for(const t of b.turrets)t.power=t.id===Number(choice)?Math.min(x.turretCap(t.type),t.power+p):Math.max(1,t.power-1);x.tag('Preference update');break;
  }
  // Learned rendering remembers new sensory families, rather than granting unconditional draw.
  for(const t of b.turrets)if(t.program==='gen_learning'){
   t.seen=t.seen||[];if(!t.seen.includes(c.family)){t.seen.push(c.family);t.pending=Math.min(3,(t.pending||0)+1);}
  }
  b.researchCue=c.type==='attack'?'attack':c.block?'guard':'balanced';
 }
 function install(s,t,c,choice){
  if(!c.protocol)return;t.program=c.protocol;t.phase=0;
  if(c.protocol==='gen_descriptors')t.variant=choice;
  if(c.protocol==='gen_learning'){t.seen=[];t.pending=0;}
 }
 function turret(s,t,x){
  const b=s.battle,p=t.power;switch(t.program){
   case 'gen_hapticgen':x.damage(p*[1,3,1][t.phase%3],{source:'turret'});t.phase=(t.phase+1)%3;return true;
   case 'gen_ldm':x.block(p);t.power=Math.min(18,p+2);return true;
   case 'gen_prompt':if(t.phase){x.damage(p*2,{source:'turret'});t.phase=0;}else{t.phase=1;x.tag('Audio latent ready');}return true;
   case 'gen_descriptors':if(t.variant==='rough')for(let i=0;i<3;i++)x.damage(p,{source:'turret'});else if(t.variant==='bumpy'){b.enemy.weak+=p;x.block(p*2);}else{if(t.phase%2===0)b.evade=1;t.phase=(t.phase+1)%2;}return true;
   case 'gen_texture':{const cue=b.researchCue||'balanced';if(cue!=='guard')x.damage(p*(cue==='attack'?2:1),{source:'turret'});if(cue!=='attack')x.block(p*(cue==='guard'?2:1));return true;}
   case 'gen_video':{const m=x.intent(),key=`${m.damage}:${m.hits}`;if(key!==t.lastEvent){x.damage(p,{pierce:true,source:'turret'});t.lastEvent=key;}else x.tag('No new motion event');return true;}
   case 'gen_scene':{const kinds=new Set(b.turrets.filter(v=>v.id!==t.id).map(v=>v.type));if(kinds.size>=2){b.queuedEnergy=Math.min(30,b.queuedEnergy+p);x.tag('Coherent scene: Energy queued');}else x.block(p*4);return true;}
   case 'gen_learning':if(t.pending){b.queuedDraw=Math.min(30,b.queuedDraw+t.pending);t.pending=0;}else x.block(p*2);return true;
  }return false;
 }
 function onHeat(s,amount,x){const r=init(s.battle);r.heatApps=(r.heatApps||0)+1;
  if(r.bracelet){r.ring=((r.ring||0)+1)%6;x.block(r.bracelet);if(!r.ring){x.tick();x.tag('Six-site circuit closed');}}
  if(r.immersion&&r.heatApps>=3){const extra=Math.floor(amount*r.immersion/100);s.battle.enemy.burn+=extra;if(extra)x.emit({target:'enemy',kind:'heat',amount:extra});}
 }
 function onBlock(s,amount,x){const b=s.battle,r=init(b);if(amount>0&&r.grasp&&r.graspTurn!==b.turn){r.graspTurn=b.turn;x.heat(r.grasp);}}
 function heatAmount(s,amount){const r=init(s.battle);if(r.motion){const step=r.motion===1&&r.motionStep===100?100:(4-r.motion)*r.motionStep;r.motion--;return Math.floor(amount*(1+step/100));}return amount;}
 function afterTick(s){const r=init(s.battle);if(r.conduction){s.battle.enemy.burn=Math.floor(s.battle.enemy.burn/2);r.conduction=0;}}
 function beforeEnemy(s,move,x){const r=init(s.battle),key=`${move.damage}:${move.hits}`;
  if(r.adaptive&&!(r.seen||[]).includes(key)){if(!r.seen)r.seen=[];if(r.seen.length<12)r.seen.push(key);x.block(r.adaptive);x.tag('Unseen pattern: armor adapted');}
 }
 function beforeHit(s,amount,x){const b=s.battle,r=init(b);
  if(r.cooling){x.block(r.cooling);r.cooling=0;x.tag('Cooling shield released');}
  if(r.maskPulse&&b.block>0){x.block(Math.max(0,amount-b.block));x.counter(r.maskPulse);r.maskPulse=0;x.tag('Contact location masked');}
 }
 function afterHit(s,blocked,damage,x){const b=s.battle,r=init(b);
  if(blocked&&r.referred){x.counter(Math.min(18,blocked*r.referred));r.referred=0;x.tag('Remote contact returned');}
  if(r.stretch){const n=4-r.stretch;r.stretch--;x.counter(n*r.stretchStep);x.tag(`Motion segment ${n}/3`);}
  if(r.boundary&&blocked&&!damage)r.boundaryReserve=Math.min(12,(r.boundaryReserve||0)+r.boundary);
  if(r.fiery){if(!damage&&blocked)x.heat(r.fiery);else if(damage)x.block(r.fiery*2);}
  if(r.recordWave){r.wave=Math.min(18,(blocked+damage)+r.recordWave);r.waveLeft=2;r.waveTurn=b.turn+1;r.recordWave=0;x.tag('Waveform recorded');}
  if(r.texture){if(damage)b.thorns+=r.texture;else b.retain=Math.min(75,b.retain+5);}
  for(const t of b.turrets)if(t.program==='gen_ldm'&&damage)t.power=Math.max(1,t.power-1);
 }
 function evade(s,x){const r=init(s.battle);if(r.maskRelease){x.heat((r.masked||0)+r.maskRelease);r.masked=0;r.maskRelease=0;x.tag('Hidden warmth relocated');}}
 function startTurn(s,x){const r=init(s.battle);r.heatApps=0;
  if(r.reserve){x.block(r.reserve);r.reserve=0;}if(r.boundaryReserve){x.block(r.boundaryReserve);r.boundaryReserve=0;}
  if(r.referral){const n=r.referral;r.referral=0;x.heat(n);x.tag('Referral echo arrived');}
 }
 function beforeEnd(s,x){const b=s.battle,r=init(b);
  if(r.flow){x.heat(r.flow.power);r.flow.left--;if(!r.flow.left){if(r.flow.mode==='loop'){x.tick();x.tick();x.tick();}delete r.flow;x.tag('Thermal route completed');}}
  if(r.waveLeft&&b.turn>=r.waveTurn){x.counter(r.wave);r.waveLeft--;x.tag('Recorded waveform replay');}
 }
 function stopDecay(s){const r=init(s.battle);if(r.noDecay){r.noDecay--;return true;}return false;}
 function preview(s,c,other,result){
  const r=init(s.battle),m=other.material,p=c.protocolPower||1;result.notes=result.notes||[];
  switch(c.protocol){
   case 'multi_blox':result.burn+=other.card.family==='thermal'?p:0;result.weak+=other.card.family==='thermal'?0:1;result.notes.push('Modular channel');break;
   case 'multi_moisture':if(other.card.family==='thermal'||m.burn||other.card.burn){const shift=Math.min(result.damage,p);result.damage-=shift;result.block+=shift;result.notes.push('Cold + wet: attack transferred to shield');}break;
   case 'multi_avatar':{const key=result.damage>=result.block?'damage':'block';result[key]+=p;result.notes.push('Visual cue strengthens dominant signal');break;}
   case 'multi_shape':if(m.block>=m.attack){result.pierce=true;result.notes.push('Force + electrical alignment: pierce');}break;
   case 'multi_roll':if(!other.card.exhaust){result.returnMaterial=other.position;result.notes.push('Reusable partner returns to hand');}break;
   case 'multi_bimanual':if(Math.abs(m.attack-m.block)<=p){result.hits=2;result.block+=p;result.notes.push('Symmetric hands: split strike + shield');}break;
   case 'multi_aqua':{const reserve=Math.floor(result.block/2);result.block-=reserve;result.reserve=(result.reserve||0)+reserve;result.notes.push(`Buoyancy: ${reserve} Block next turn`);break;}
   case 'multi_guidance':if(other.position===1&&m.block>=m.attack){result.damage+=p;result.notes.push('Attack → defense toolpath');}else{result.block+=p;result.notes.push('Reverse toolpath: defensive correction');}break;
   case 'multi_attra':result.block+=p;result.notes.push('Integrated cabin buffer');break;
   case 'multi_illusion':if(c.family===other.card.family){result.evade=1;result.notes.push('Coherent modulation: decoy');}else{result.pierce=true;result.damage+=p;result.notes.push('Cross-modal phantom strike');}break;
  }
 }
 function globalPreview(s,result){const r=init(s.battle);result.notes=result.notes||[];
  if(r.blox===1)result.burn+=3;if(r.blox===2)result.weak+=1;if(r.blox===3)result.draw+=1;
  if(r.avatar){const k=result.damage>=result.block?'damage':'block';result[k]+=r.avatar;result.notes.push('Avatar context');}
  if(r.attra){const i=r.attraPhase||0;if(i===0)result.burn+=r.attra;if(i===1)result.weak+=1;if(i===2)result.block+=r.attra*2;result.notes.push(['Cabin: Heat','Cabin: airflow','Cabin: motion'][i]);}
 }
 function afterFusion(s,result){const r=init(s.battle);for(const t of s.battle.turrets)if(t.program==='gen_learning'){t.seen=t.seen||[];for(const f of result.families||[])if(!t.seen.includes(f)){t.seen.push(f);t.pending=Math.min(3,(t.pending||0)+1);}}if(result.reserve)r.reserve=(r.reserve||0)+result.reserve;if(r.attra)r.attraPhase=((r.attraPhase||0)+1)%3;s.battle.researchCue='balanced';}
 function status(s){const r=init(s.battle),out=[];
  if(r.stretch)out.push(`Moving contact ${4-r.stretch}/3`);if(r.referred)out.push('Referred contact armed');if(r.maskPulse)out.push('Contact masking armed');if(r.recordWave)out.push('Waveform recording');if(r.waveLeft)out.push(`Replay ×${r.waveLeft}`);if(r.boundary)out.push(`Boundary bank ${r.boundaryReserve||0}`);if(r.maskRelease)out.push(`Hidden Heat ${r.masked||0}`);if(r.referral)out.push(`Referral echo +${r.referral}`);if(r.bracelet)out.push(`Wrist sites ${r.ring||0}/6`);if(r.immersion)out.push(`Immersion ${Math.min(r.heatApps||0,3)}/3`);if(r.flow)out.push(`${r.flow.mode} route · ${r.flow.left} nodes`);if(r.motion)out.push(`Thermal flow ×${r.motion}`);if(r.noDecay)out.push(`Insulation ${r.noDecay}`);if(r.grasp)out.push('Grasp coupling');if(r.blox)out.push(`Module: ${['','thermal','airflow','olfactory'][r.blox]}`);if(r.avatar)out.push('Avatar bias');if(r.attra)out.push(`Cabin: ${['Heat','airflow','motion'][r.attraPhase||0]}`);return out;
 }
 const api={init,stateValid,choices,choiceValid,contextCard,install,turret,onHeat,onBlock,heatAmount,afterTick,beforeEnemy,beforeHit,afterHit,evade,startTurn,beforeEnd,stopDecay,preview,globalPreview,afterFusion,status};
 if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.HapticPaperProtocols=api;
})(globalThis);
