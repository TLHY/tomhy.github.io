(() => {
    const E=WritingGame,canvas=document.getElementById('writing-canvas'),ctx=canvas.getContext('2d');
    const overlay=document.getElementById('game-overlay'),pauseButton=document.getElementById('pause-button'),help=document.getElementById('writing-help');
    const dashButton=document.getElementById('dash-button'),pad=document.getElementById('move-pad'),stick=document.getElementById('move-stick');
    const keys=new Set(),reduced=matchMedia('(prefers-reduced-motion: reduce)');
    let jumpHeld=false;
    let state=null,raf=0,last=0,accumulator=0,pendingDash=false,analog={x:0,y:0},pointer=null,lastPhase='',lastBossPattern='',hudClock=0,best={kills:0,level:0},lastAnnouncement='',lastReview='';
    try{const saved=JSON.parse(localStorage.getItem('tomhy_writing_best_v1')||'{}');for(const key of ['kills','level'])if(Number.isFinite(saved[key]))best[key]=Math.max(0,saved[key]);}catch{/* Optional local score. */}
    function saveBest(){MochiWallet.award(state.runId,MochiWallet.writingReward(state));best.kills=Math.max(best.kills,state.kills);best.level=Math.max(best.level,state.level);try{localStorage.setItem('tomhy_writing_best_v1',JSON.stringify(best));}catch{/* The game works without storage. */}}
    function clearInput(){keys.clear();analog={x:0,y:0};pendingDash=false;jumpHeld=false;stick.style.transform='translate(0,0)';pointer=null;}
    function announce(text){if(text===lastAnnouncement)return;lastAnnouncement=text;document.getElementById('writing-announcement').textContent=text;}
    function start(){state=E.create();state.runId=`writing-${crypto.randomUUID ? crypto.randomUUID() : Date.now()+'-'+Math.random().toString(36).slice(2)}`;lastPhase='';lastBossPattern='';last=0;accumulator=0;clearInput();overlay.hidden=true;pauseButton.disabled=false;canvas.focus({preventScroll:true});canvas.scrollIntoView({block:'center',behavior:'instant'});updateHud();ensureFrame();}
    function setPaused(paused){if(!state||['victory','defeat'].includes(state.phase))return;state.paused=paused;clearInput();last=0;accumulator=0;showOverlay();updateHud();if(!paused)canvas.focus({preventScroll:true});ensureFrame();}
    function ruleHint(){
        if(!state)return 'Three chapters. One final draft.';
        if(state.phase==='survival')return 'Auto-fire on. Collect ink drops and build your tools.';
        if(state.phase==='boss'&&state.bossPattern){
            const hints={margins:'Thread staggered openings; falling shutters also change the safe column.',beams:'Watch crossed warnings, sequential beams, and the last safe column.',gravity:'GRAVITY ON · Hold for tall/pair barriers; tap beneath low ceilings. Up / W / Space / JUMP.',orbit:'Lasers sweep around the box. Circle with them, avoid the center, and watch for reversal.',colors:state.rule==='blue'?'BLUE WALL: stop, then move into the opening in the trailing white wall.':'ORANGE WALL: keep moving, then weave through the trailing white wall.'};
            return `${state.bossPattern.name} · ${hints[state.bossPattern.id]}`;
        }
        return state.rule==='blue'?'BLUE / B: stand still when ink touches you.':state.rule==='orange'?'ORANGE / O: keep moving when ink touches you.':'WHITE / •: dodge the redlines. Dash if cornered.';
    }

    function showOverlay(){
        if(!state){overlay.hidden=false;overlay.innerHTML=`<div class="overlay-card"><span class="eyebrow">WRITING GAME</span><h2>A blank page.<br>A very loud inner critic.</h2><p>Your pen fires automatically. You handle the movement, the build, and the redlines.</p><div class="run-facts"><span>3 chapters + boss</span><span>3–4 minutes</span><span>No sound</span></div><button class="primary" data-game="start">Start writing →</button><p class="small">Best: ${best.kills} ink cleared · Level ${best.level}</p></div>`;return;}
        const phase=state.phase;
        if(state.paused){overlay.hidden=false;overlay.innerHTML='<div class="overlay-card"><span class="eyebrow">TAKE A BREATH</span><h2>Draft paused.</h2><p>Your page can wait.</p><button class="primary" data-game="resume">Resume writing</button></div>';return;}
        if(phase==='upgrade'){overlay.hidden=false;overlay.innerHTML=`<div class="overlay-card upgrade-screen"><span class="eyebrow">LEVEL ${state.level} · TIME IS PAUSED</span><h2>Choose a writing tool.</h2><div class="upgrade-options">${state.choices.map(id=>`<button data-upgrade="${id}"><span class="upgrade-icon">${{nib:'✎',flow:'»',split:'⋔',footnote:',',revision:'◎',pace:'↗',margins:'⌑',draft:'♡',coffee:'☕'}[id]}</span><strong>${E.UPGRADES[id].name}</strong><span>${E.UPGRADES[id].text}</span><small>Rank ${state.upgrades[id]||0}${id==='coffee'?'':` / ${E.UPGRADES[id].max}`}</small></button>`).join('')}</div></div>`;return;}
        if(['victory','defeat'].includes(phase)){saveBest();overlay.hidden=false;overlay.innerHTML=`<div class="overlay-card"><span class="eyebrow">${phase==='victory'?'FINAL DRAFT COMPLETE':'A DRAFT, NOT A FAILURE'}</span><h2>${phase==='victory'?'The page is yours.':'Try another sentence.'}</h2><p>${phase==='victory'?'You outlasted the redlines and silenced the Inner Editor.':state.cause}</p><div class="run-facts"><span>Level ${state.level}</span><span>${state.kills} ink cleared</span><span>${Math.floor(state.time)} seconds</span><span>Lab Gold +${MochiWallet.writingReward(state)}</span></div><button class="primary" data-game="start">Write another draft →</button></div>`;pauseButton.disabled=true;announce(phase==='victory'?'Victory! The final draft is complete.':`Run ended. ${state.cause}`);return;}
        overlay.hidden=true;
    }
    function updateReview(){
        const panel=document.getElementById('reviewer-panel'),line=state?E.reviewLine(state):null;
        panel.hidden=!line;
        if(!line){lastReview='';return;}
        const key=`${line.speaker}:${line.text}`;
        if(key===lastReview)return;
        lastReview=key;
        document.getElementById('reviewer-speaker').textContent=`${line.speaker} · ${state.bossPattern.name}`;
        document.getElementById('reviewer-quote').textContent=line.text;
    }
    function updateHud(){
        const s=state;
        updateReview();
        document.getElementById('hp-label').textContent=s?`${s.hp} / ${s.maxHp}`:'8 / 8';document.getElementById('level-label').textContent=s?.level||1;
        const time=Math.floor(s?.time||0);document.getElementById('time-label').textContent=`${Math.floor(time/60)}:${String(time%60).padStart(2,'0')}`;
        document.getElementById('kills-label').textContent=s?.kills||0;document.getElementById('dash-label').textContent=s?.dashCooldown>0?`${s.dashCooldown.toFixed(1)}s`:'Ready';
        const xp=document.getElementById('xp-bar');xp.max=s?.needed||9;xp.value=s?.xp||0;document.getElementById('xp-label').textContent=`${s?.xp||0} / ${s?.needed||9} XP`;
        const active=s&&['survival','proofread','boss'].includes(s.phase)&&!s.paused;
        const gravity=s?.phase==='boss'&&s.bossPattern?.control==='gravity';dashButton.textContent=gravity?'JUMP':'DASH';document.querySelector('.hud>div:last-child small').textContent=gravity?'JUMP':'DASH';if(gravity)document.getElementById('dash-label').textContent='Up / hold';dashButton.setAttribute('aria-label',gravity?'Jump. Hold to jump higher.':'Dash in your movement direction');dashButton.disabled=!active||(!gravity&&s.dashCooldown>0);pauseButton.textContent=s?.paused?'Resume · P':'Pause · P';
        document.getElementById('phase-label').textContent=!s?'Your blank page awaits.':s.phase==='upgrade'?`Level ${s.level} · Choose an upgrade`:s.phase==='victory'?'Final draft complete':s.phase==='defeat'?'The draft can wait':`${s.message}${s.phase==='boss'&&s.boss.hp<s.boss.maxHp/2?' · ENRAGED':''} · ${Math.ceil(Math.max(0,E.DURATIONS[s.phase]-s.phaseTime))}s`;
        document.getElementById('phase-hint').textContent=ruleHint();
        document.getElementById('build-list').innerHTML=s?Object.entries(s.upgrades).map(([id,n])=>`<span>${E.UPGRADES[id].name} <b>${n}</b></span>`).join('')||'Your pen is ready.':'Your pen is ready.';
    }
    function resize(){const dpr=Math.min(devicePixelRatio||1,2);canvas.width=E.W*dpr;canvas.height=E.H*dpr;ctx.setTransform(dpr,0,0,dpr,0,0);draw();}
    function circle(x,y,r,fill,stroke){ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);if(fill){ctx.fillStyle=fill;ctx.fill();}if(stroke){ctx.strokeStyle=stroke;ctx.stroke();}}
    function drawEraser(position,angle,active,warning=false){
        ctx.save();ctx.translate(position.x,position.y);ctx.rotate(angle);ctx.globalAlpha=active?1:warning?.85:.22;
        ctx.fillStyle=active?'#f5e8cc':'#b7a6a0';ctx.strokeStyle=active?'#fff7e2':'#947b7b';ctx.lineWidth=1.5;
        ctx.beginPath();ctx.moveTo(-11,-7);ctx.lineTo(5,-7);ctx.lineTo(13,-4);ctx.lineTo(16,0);ctx.lineTo(13,4);ctx.lineTo(5,7);ctx.lineTo(-11,7);ctx.closePath();ctx.fill();ctx.stroke();
        ctx.fillStyle=active?'#e1a097':'#7c696d';ctx.fillRect(-9,-5,7,10);ctx.fillStyle=active?'#ffffff':'#ebc29d';ctx.fillRect(7,-2,7,4);
        ctx.restore();
    }
    function draw(){
        const s=state;ctx.clearRect(0,0,E.W,E.H);ctx.fillStyle='#18282d';ctx.fillRect(0,0,E.W,E.H);
        ctx.strokeStyle='#284047';ctx.lineWidth=1;for(let y=27;y<E.H;y+=28){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(E.W,y);ctx.stroke();}
        ctx.strokeStyle='#6b4c53';ctx.beginPath();ctx.moveTo(48,0);ctx.lineTo(48,E.H);ctx.stroke();ctx.strokeStyle='#8a9d89';ctx.lineWidth=2;ctx.strokeRect(3,3,E.W-6,E.H-6);
        if(!s){ctx.fillStyle='#b8b49a';ctx.font='20px monospace';ctx.textAlign='center';ctx.fillText('a story is waiting here_',E.W/2,E.H/2);return;}
        for(const gem of s.gems){ctx.fillStyle=gem.xp>1?'#f0cf7e':'#9de0c4';ctx.save();ctx.translate(gem.x,gem.y);ctx.rotate(Math.PI/4);ctx.fillRect(-3,-3,6,6);ctx.restore();}
        for(const e of s.enemies){ctx.save();ctx.translate(e.x,e.y);if(e.kind==='critic'){ctx.fillStyle='#9b5967';ctx.fillRect(-14,-15,28,30);ctx.fillStyle='#f3dcbd';ctx.font='bold 16px monospace';ctx.textAlign='center';ctx.fillText(e.id%2?'R2':'Fig.',0,6);}else if(e.kind==='doubt'){circle(0,0,e.r,'#ab8cc5');ctx.fillStyle='#231e32';ctx.font='bold 13px monospace';ctx.textAlign='center';ctx.fillText('?',0,5);}else{ctx.fillStyle='#d49579';ctx.fillRect(-10,-10,20,20);ctx.fillStyle='#33292c';ctx.font='bold 12px monospace';ctx.textAlign='center';ctx.fillText(['a?','[?]','404','TeX'][e.id%4],0,4);}ctx.restore();}
        if(s.boss){const boss=s.boss;ctx.save();ctx.translate(boss.x,boss.y);ctx.fillStyle='#c6b6a1';ctx.fillRect(-28,-24,56,48);ctx.fillStyle='#e8dec9';ctx.fillRect(-23,-30,46,48);ctx.fillStyle='#9c4b56';ctx.fillRect(-16,-12,10,5);ctx.fillRect(6,-12,10,5);ctx.fillRect(-12,5,24,5);ctx.restore();ctx.fillStyle='#4c3642';ctx.fillRect(155,14,330,9);ctx.fillStyle='#e2a6a2';ctx.fillRect(155,14,330*Math.max(0,boss.hp/boss.maxHp),9);ctx.fillStyle='#e1d8c2';ctx.font='10px monospace';ctx.textAlign='center';ctx.fillText('THE INNER EDITOR',E.W/2,117);}
        if(s.phase==='boss'){
            const a=E.BOSS_ARENA,gravity=s.bossPattern?.control==='gravity';
            ctx.fillStyle='#101c22';ctx.fillRect(a.left-10,a.top-10,a.right-a.left+20,a.bottom-a.top+20);
            ctx.fillStyle='#1b2c32';ctx.fillRect(a.left,a.top,a.right-a.left,a.bottom-a.top);
            ctx.strokeStyle=gravity?'#79c7ed':'#e6e6d0';ctx.lineWidth=3;ctx.strokeRect(a.left,a.top,a.right-a.left,a.bottom-a.top);
            ctx.fillStyle=gravity?'#79c7ed':'#d8d8bf';ctx.font='bold 11px monospace';ctx.textAlign='center';ctx.fillText(s.bossPattern?.name||'ENTER THE CORRECTION BOX',E.W/2,a.top-20);
            ctx.save();ctx.beginPath();ctx.rect(a.left,a.top,a.right-a.left,a.bottom-a.top);ctx.clip();
            for(const h of s.hazards){
                if(h.type==='rotating-beam'){
                    const ray=E.rotatingGeometry(h),active=h.age>=h.warning;
                    ctx.strokeStyle=active?'#fff4df':'#e3ad77';ctx.globalAlpha=active?.9:.65;
                    ctx.lineWidth=active?h.w:1.5;ctx.setLineDash(active?[]:[5,7]);
                    ctx.beginPath();ctx.moveTo(ray.x,ray.y);ctx.lineTo(ray.x+Math.cos(ray.angle)*ray.length,ray.y+Math.sin(ray.angle)*ray.length);ctx.stroke();
                    if(active){ctx.strokeStyle='#ffffff';ctx.lineWidth=Math.max(2,h.w*.3);ctx.stroke();}
                    ctx.setLineDash([]);ctx.globalAlpha=1;continue;
                }
                const active=h.age>=h.warning,color={white:'#f0e6ce',blue:'#79c7ed',orange:'#ffbb72'}[h.kind];
                ctx.fillStyle=color;ctx.strokeStyle=color;
                if(!active){if(h.vx){ctx.globalAlpha=.7;ctx.lineWidth=3;ctx.setLineDash([3,4]);const edgeX=h.vx>0?a.left+2:a.right-2;ctx.beginPath();ctx.moveTo(edgeX,h.y);ctx.lineTo(edgeX,h.y+h.h);ctx.stroke();ctx.setLineDash([]);}ctx.globalAlpha=.16;ctx.fillRect(h.x,h.y,h.w,h.h);ctx.globalAlpha=.85;ctx.setLineDash([4,5]);ctx.lineWidth=2;ctx.strokeRect(h.x,h.y,h.w,h.h);ctx.setLineDash([]);}
                else{ctx.globalAlpha=h.type==='beam'?.9:1;ctx.fillRect(h.x,h.y,h.w,h.h);if(h.type!=='beam'){ctx.fillStyle='#17252c';ctx.fillRect(h.x+3,h.y+4,Math.max(3,h.w-6),3);ctx.fillRect(h.x+3,h.y+h.h-7,Math.max(3,h.w-6),3);}}
                if(h.kind!=='white'){ctx.globalAlpha=1;ctx.fillStyle='#17252c';ctx.font='bold 10px monospace';ctx.textAlign='center';ctx.fillText(h.kind==='blue'?'B':'O',h.x+h.w/2,h.y+h.h/2);}
                ctx.globalAlpha=1;
            }
            ctx.restore();
            if(s.bossPattern?.id==='orbit'){
                // Small eraser cannons surround the box; only lit cannons are dangerous.
                for(let i=0;i<12;i++)drawEraser(E.emitterAt(i*Math.PI/6),i*Math.PI/6+Math.PI,false);
                for(const h of s.hazards.filter(h=>h.type==='rotating-beam')){const ray=E.rotatingGeometry(h);drawEraser(ray,ray.angle,h.age>=h.warning,true);}
            }
        }
        for(const shot of s.shots){ctx.save();ctx.translate(shot.x,shot.y);ctx.rotate(Math.atan2(shot.vy,shot.vx));ctx.fillStyle='#e8e7b6';ctx.fillRect(-6,-2,12,4);ctx.fillStyle='#9ce3cc';ctx.fillRect(4,-2,4,4);ctx.rotate(-Math.atan2(shot.vy,shot.vx));ctx.font='bold 10px monospace';ctx.textAlign='center';ctx.fillStyle='#f3ebc0';ctx.fillText(shot.glyph||'a',0,-8);ctx.restore();}
        for(const bullet of s.bullets){ctx.save();ctx.translate(bullet.x,bullet.y);const color={white:'#f7eee1',blue:'#79c7ed',orange:'#ffbb72'}[bullet.kind];ctx.fillStyle=color;if(bullet.kind==='blue')ctx.fillRect(-bullet.r,-bullet.r,bullet.r*2,bullet.r*2);else if(bullet.kind==='orange'){ctx.rotate(Math.PI/4);ctx.fillRect(-bullet.r,-bullet.r,bullet.r*2,bullet.r*2);ctx.rotate(-Math.PI/4);}else circle(0,0,bullet.r,color);if(bullet.kind==='white'&&bullet.glyph){ctx.fillStyle=color;ctx.font='9px monospace';ctx.textAlign='center';ctx.fillText(bullet.glyph,0,-bullet.r-4);}if(bullet.kind!=='white'){ctx.fillStyle='#203139';ctx.font='bold 7px monospace';ctx.textAlign='center';ctx.fillText(bullet.kind==='blue'?'B':'O',0,2.5);}ctx.restore();}
        const commas=s.upgrades.footnote||0;if(s.phase!=='proofread')for(let i=0;i<commas;i++){const a=s.orbitAngle+i*Math.PI*2/commas;ctx.fillStyle='#e7d39b';ctx.font='bold 28px monospace';ctx.textAlign='center';ctx.fillText(',',s.player.x+Math.cos(a)*40,s.player.y+Math.sin(a)*40+5);}
        for(const effect of s.effects){ctx.globalAlpha=effect.life/effect.max;ctx.lineWidth=effect.kind==='pulse'?3:2;circle(effect.x,effect.y,effect.r*(1.2-effect.life/effect.max*.3),null,effect.kind==='hurt'?'#f1a5a2':effect.kind==='pulse'?'#b9d5a0':'#d8be8e');}ctx.globalAlpha=1;
        const player=s.player;ctx.save();ctx.translate(player.x,player.y);ctx.globalAlpha=s.invulnerable>0?.6:1;if(s.dash>0)circle(0,0,18,null,'#a3dec6');ctx.fillStyle=s.phase==='boss'&&s.bossPattern?.control==='gravity'?'#79c7ed':'#a7ddbf';ctx.beginPath();ctx.moveTo(0,-12);ctx.lineTo(9,5);ctx.lineTo(0,10);ctx.lineTo(-9,5);ctx.closePath();ctx.fill();ctx.strokeStyle='#eff9df';ctx.stroke();ctx.fillStyle='#25383d';ctx.fillRect(-4,-1,3,3);ctx.fillRect(2,-1,3,3);ctx.restore();
        if(s.phase==='proofread' && s.phaseTime<2){ctx.fillStyle='#102128db';ctx.fillRect(90,155,460,110);ctx.fillStyle='#f0d6a0';ctx.font='bold 20px monospace';ctx.textAlign='center';ctx.fillText('PROOFREAD THE PATTERN',E.W/2,195);ctx.font='12px monospace';ctx.fillText(s.chapter===1?'WHITE: DODGE':s.chapter===2?'BLUE: STOP MOVING':'ORANGE: KEEP MOVING',E.W/2,225);}
    }
    function frame(now){raf=0;if(document.hidden)return;const dt=Math.min((now-(last||now))/1000,.1);last=now;if(state&&!state.paused){accumulator+=dt;while(accumulator>=1/60){accumulator-=1/60;const x=analog.x+(keys.has('ArrowRight')||keys.has('KeyD')?1:0)-(keys.has('ArrowLeft')||keys.has('KeyA')?1:0),y=analog.y+(keys.has('ArrowDown')||keys.has('KeyS')?1:0)-(keys.has('ArrowUp')||keys.has('KeyW')?1:0);E.step(state,{x,y,dash:pendingDash,jumpHeld:jumpHeld||keys.has('Space')},1/60);pendingDash=false;}}
        if(state&&state.phase!==lastPhase){lastPhase=state.phase;clearInput();showOverlay();updateHud();announce(state.phase==='upgrade'?`Level ${state.level}. Choose a tool.`:state.message);}
        const currentPattern=state?.phase==='boss'?state.bossPattern?.id||'':'';if(currentPattern!==lastBossPattern){lastBossPattern=currentPattern;updateHud();if(currentPattern)announce(ruleHint());}
        hudClock+=dt;if(hudClock>.1){hudClock=0;updateHud();}draw();if(state&&!state.paused&&['survival','proofread','boss'].includes(state.phase))raf=requestAnimationFrame(frame);
    }
    function ensureFrame(){if(!raf&&!document.hidden)raf=requestAnimationFrame(frame);}
    document.addEventListener('keydown',event=>{if(help.open)return;if(event.code==='Space'&&event.target.closest('button'))return;if(['KeyP','Escape'].includes(event.code)&&state&&!event.repeat){event.preventDefault();setPaused(!state.paused);return;}if(['ArrowUp','ArrowDown','ArrowLeft','ArrowRight','KeyW','KeyA','KeyS','KeyD','Space'].includes(event.code)&&state){event.preventDefault();if(event.code==='Space'){keys.add('Space');if(!event.repeat)pendingDash=true;}else keys.add(event.code);}});
    document.addEventListener('keyup',event=>keys.delete(event.code));
    pauseButton.addEventListener('click',()=>setPaused(!state.paused));
    document.getElementById('help-button').addEventListener('click',()=>{if(state&&!['victory','defeat'].includes(state.phase))setPaused(true);help.showModal();});
    overlay.addEventListener('click',event=>{const button=event.target.closest('button');if(!button)return;if(button.dataset.game==='start')start();else if(button.dataset.game==='resume')setPaused(false);else if(button.dataset.upgrade&&state){if(E.choose(state,button.dataset.upgrade)){lastPhase=state.phase;clearInput();showOverlay();updateHud();canvas.focus({preventScroll:true});last=0;accumulator=0;ensureFrame();}}});
    function moveStick(event){if(pointer!==event.pointerId)return;const rect=pad.getBoundingClientRect(),dx=event.clientX-(rect.left+rect.width/2),dy=event.clientY-(rect.top+rect.height/2),length=Math.hypot(dx,dy),limit=30;analog={x:dx/Math.max(limit,length),y:dy/Math.max(limit,length)};stick.style.transform=`translate(${analog.x*limit}px,${analog.y*limit}px)`;}
    stick.addEventListener('pointerdown',event=>{if(event.button!==0||!state||state.paused||!['survival','proofread','boss'].includes(state.phase))return;event.preventDefault();pointer=event.pointerId;stick.setPointerCapture(pointer);moveStick(event);});
    stick.addEventListener('pointermove',moveStick);for(const type of ['pointerup','pointercancel','lostpointercapture'])stick.addEventListener(type,event=>{if(pointer!==event.pointerId)return;analog={x:0,y:0};pointer=null;stick.style.transform='translate(0,0)';});
    dashButton.addEventListener('pointerdown',event=>{if(event.button===0){event.preventDefault();pendingDash=true;jumpHeld=true;dashButton.setPointerCapture(event.pointerId);}});for(const type of ['pointerup','pointercancel','lostpointercapture'])dashButton.addEventListener(type,()=>{jumpHeld=false;});dashButton.addEventListener('click',event=>{if(event.detail===0)pendingDash=true;});
    document.addEventListener('visibilitychange',()=>{if(document.hidden){setPaused(true);cancelAnimationFrame(raf);raf=0;last=0;}else{draw();}});
    addEventListener('blur',()=>{if(state)setPaused(true);});addEventListener('resize',resize);
    showOverlay();updateHud();resize();
})();
