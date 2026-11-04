/* Fixed-step, seeded rules for a writing-themed survivor / bullet-hell game. */
(function(root) {
    const W = 640, H = 440;
    const MOVEMENT_SCALE = 3;
    const DURATIONS = { survival: 35, proofread: 14, boss: 50 };
    const UPGRADES = {
        nib: { name:'Sharper Nib', text:'+2 pen damage.', max:5 },
        flow: { name:'Fast Draft', text:'Fire your pen 16% faster.', max:5 },
        split: { name:'Split Sentence', text:'Fire one additional pen in a spread.', max:3 },
        footnote: { name:'Orbiting Commas', text:'Add a protective comma orbiting around you.', max:4 },
        revision: { name:'Revision Wave', text:'Unlock or strengthen a periodic area attack.', max:4 },
        pace: { name:'Reading Flow', text:'Move 12% faster.', max:4 },
        margins: { name:'Wide Margins', text:'Increase XP pickup radius by 24.', max:4 },
        draft: { name:'Second Draft', text:'+1 maximum HP and heal 3 HP.', max:3 },
        coffee: { name:'Coffee Break', text:'Heal 3 HP.', max:Infinity }
    };
    function random(s) { s.seed = (Math.imul(1664525,s.seed)+1013904223)>>>0; return s.seed/4294967296; }
    const clamp = (n,a,b)=>Math.max(a,Math.min(b,n));
    const distance = (a,b)=>Math.hypot(a.x-b.x,a.y-b.y);
    function create(seed=Date.now()) {
        return { seed:seed>>>0, phase:'survival', chapter:1, phaseTime:0, time:0, level:1, xp:0, needed:9, kills:0, hp:8, maxHp:8, player:{x:W/2,y:H/2,r:9}, enemies:[], shots:[], bullets:[], gems:[], effects:[], upgrades:{}, choices:[], paused:false, dash:0, dashCooldown:0, invulnerable:0, fireClock:0, spawnClock:.5, patternClock:1, pulseClock:4, orbitClock:0, orbitAngle:0, boss:null, hazards:[], bossPattern:null, bossJumpHeld:false, rule:'white', message:'Chapter I · The Blank Page', cause:'', nextId:1, resumePhase:null };
    }
    function isHarmful(kind,moving) { return kind==='white' || (kind==='blue' && moving) || (kind==='orange' && !moving); }
    function hit(s,cause) {
        if(s.invulnerable>0 || s.phase==='defeat' || s.phase==='victory')return;
        s.hp--;s.invulnerable=1.15;s.effects.push({x:s.player.x,y:s.player.y,r:12,life:.35,max:.35,kind:'hurt'});
        if(s.hp<=0){s.hp=0;s.phase='defeat';s.cause=cause;}
    }
    function levelUp(s) {
        if(s.xp<s.needed || !['survival','proofread','boss'].includes(s.phase))return;
        s.xp-=s.needed;s.level++;s.needed=6+s.level*3;s.resumePhase=s.phase;s.phase='upgrade';
        const pool=Object.keys(UPGRADES).filter(id=>id!=='coffee' && (s.upgrades[id]||0)<UPGRADES[id].max);
        const options=[];
        while(pool.length && options.length<3){const index=Math.floor(random(s)*pool.length);options.push(pool.splice(index,1)[0]);}
        if(options.length<3)options.push('coffee');
        s.choices=options;
    }
    function choose(s,id) {
        if(s.phase!=='upgrade' || !s.choices.includes(id))return false;
        s.upgrades[id]=(s.upgrades[id]||0)+1;
        if(id==='draft'){s.maxHp++;s.hp=Math.min(s.maxHp,s.hp+3);}
        if(id==='coffee')s.hp=Math.min(s.maxHp,s.hp+3);
        s.phase=s.resumePhase;s.resumePhase=null;s.choices=[];
        levelUp(s);return true;
    }
    function kill(s,e) {
        if(e.dead)return;
        e.dead=true;s.kills++;
        if(s.gems.length>=150){s.xp+=e.kind==='critic'?3:1;}else s.gems.push({x:e.x,y:e.y,xp:e.kind==='critic'?3:1});
        if(s.effects.length<30)s.effects.push({x:e.x,y:e.y,r:e.r,life:.25,max:.25,kind:'ink'});
    }
    function damageEnemy(s,e,amount) { if(e.dead)return;e.hp-=amount;if(e.hp<=0)kill(s,e); }
    function spawnEnemy(s) {
        if(s.enemies.length>=85)return;
        const edge=Math.floor(random(s)*4), t=random(s);
        const kind=s.chapter>=2 && random(s)<.22?'critic':random(s)<.3?'doubt':'typo';
        const hp=kind==='critic'?15+s.chapter*3:kind==='doubt'?3+s.chapter:4+s.chapter;
        s.enemies.push({id:s.nextId++,kind,x:edge===0?-18:edge===1?W+18:t*W,y:edge===2?-18:edge===3?H+18:t*H,r:kind==='critic'?15:kind==='doubt'?8:11,hp,maxHp:hp,speed:MOVEMENT_SCALE*(kind==='critic'?21:kind==='doubt'?45+s.chapter*4:28+s.chapter*4),dead:false});
    }
    function addBullet(s,x,y,angle,speed,kind='white',r=5) {
        if(s.bullets.length>=200)return;
        s.bullets.push({x,y,vx:Math.cos(angle)*speed,vy:Math.sin(angle)*speed,kind,r,life:10});
    }
    const BOSS_ARENA = { left:156, right:484, top:172, bottom:410 };
    function prepareBoss(s,dt) {
        const enraged=s.boss.hp<s.boss.maxHp/2;
        const clock=s.phaseTime*(enraged?1.25:1),cycle=Math.floor(clock/26),t=clock%26;
        const slot=t<6?0:t<11?1:t<16?2:t<22?3:4;
        const id=(cycle%2===0?['orbit','margins','beams','gravity','colors']:['orbit','beams','margins','gravity','colors'])[slot];
        const control=id==='gravity'?'gravity':'free';
        const names={margins:'MARGIN SHIFT',beams:'DELETE BEAMS',gravity:'GRAVITY UNDERLINES',colors:'STOP / GO',orbit:'ORBITAL ERASERS'};
        if(s.bossPattern?.id!==id){
            s.hazards=[];s.bullets=[];s.patternClock=.7;s.bossCue=.7;
            s.player.vy=0;s.bossJumpHeld=false;s.boss.stageVolley=0;s.boss.attackName=null;s.boss.lastColor=null;
            s.invulnerable=Math.max(s.invulnerable,.35);
        }
        s.bossPattern={id,name:s.boss.attackName||names[id],control,enraged,cycle};
        s.rule=id==='colors'?(s.boss.lastColor||'blue'):'white';
        s.bossCue=Math.max(0,(s.bossCue||0)-dt);
    }
    function rectangle(s,definition){
        if(s.hazards.length>=48)return;
        s.hazards.push({vx:0,vy:0,warning:.4,life:3,age:0,kind:'white',...definition});
    }
    function bossPattern(s){
        const a=BOSS_ARENA,enraged=s.bossPattern.enraged,cycle=s.bossPattern.cycle;
        s.boss.volley=(s.boss.volley||0)+1;
        s.boss.stageVolley=(s.boss.stageVolley||0)+1;
        const n=s.boss.stageVolley,variant=(n-1+cycle)%3,speed=enraged?315:240;
        const width=a.right-a.left,height=a.bottom-a.top;
        const flowLeft=cycle%2===0;
        function gate(gap,size,delay,fromLeft=flowLeft){
            const x=fromLeft?a.left-22:a.right+4,vx=fromLeft?speed:-speed;
            rectangle(s,{type:'bar',x,y:a.top,w:18,h:gap-size/2-a.top,vx,warning:delay});
            rectangle(s,{type:'bar',x,y:gap+size/2,w:18,h:a.bottom-gap-size/2,vx,warning:delay});
        }
        function beam(x,y,w,h,warning,life=.24){rectangle(s,{type:'beam',x,y,w,h,warning,life});}
        if(s.bossPattern.id==='margins'){
            const gap=a.top+[65,169,116][(n-1)%3],size=enraged?68:82;
            if(variant===1){
                s.boss.attackName='FALLING MARGINS';
                const gapX=a.left+80+((n+cycle)%3)*82,opening=enraged?78:96;
                rectangle(s,{type:'bar',x:a.left,y:a.top-24,w:gapX-opening/2-a.left,h:16,vy:speed,warning:.4});
                rectangle(s,{type:'bar',x:gapX+opening/2,y:a.top-24,w:a.right-gapX-opening/2,h:16,vy:speed,warning:.4});
            }else{
                s.boss.attackName=variant===0?'STAGGERED GATES':'CROSS-CUT GATE';
                gate(gap,size,.36);
                if(variant===0){
                    const second=a.top+[145,89,169][(n-1)%3];
                    gate(second,size,enraged?.68:.76);
                }else{
                    beam(a.left,clamp(s.player.y-7,a.top,a.bottom-14),width,14,enraged?.7:.9,.2);
                }
            }
            s.patternClock=enraged?.72:.98;
        }else if(s.bossPattern.id==='beams'){
            const warning=enraged?.5:.68;
            if(variant===0){
                s.boss.attackName='CROSSLINE DELETION';
                beam(clamp(s.player.x-11,a.left,a.right-22),a.top,22,height,warning);
                beam(a.left,clamp(s.player.y-8,a.top,a.bottom-16),width,16,warning+.08);
            }else if(variant===1){
                s.boss.attackName='TYPEWRITER RAKE';
                const direction=n%2===0?1:-1;
                for(let i=0;i<3;i++)beam(clamp(s.player.x-10+(i-1)*62*direction,a.left,a.right-20),a.top,20,height,warning+i*(enraged?.1:.14),.26);
            }else{
                s.boss.attackName='LAST SAFE COLUMN';
                const opening=enraged?66:80;
                const center=clamp(s.player.x+(n%2===0?82:-82),a.left+opening/2+14,a.right-opening/2-14);
                beam(a.left,a.top,center-opening/2-a.left,height,warning+.16,.3);
                beam(center+opening/2,a.top,a.right-center-opening/2,height,warning+.16,.3);
                beam(a.left,clamp(s.player.y-7,a.top,a.bottom-14),width,14,warning+.34,.18);
            }
            s.patternClock=enraged?.84:1.12;
        }else if(s.bossPattern.id==='gravity'){
            const fromLeft=flowLeft,x=fromLeft?a.left-42:a.right+6,vx=fromLeft?speed:-speed;
            const tall=variant===0;
            s.boss.attackName=tall?'HIGH UNDERLINE':variant===1?'LOW CEILING':'DOUBLE UNDERLINE';
            const h=tall?48:variant===1?20:26,w=tall?34:22;
            rectangle(s,{type:'underline',x,y:a.bottom-h,w,h,vx,warning:.46});
            if(variant===1){
                rectangle(s,{type:'ceiling',x:x-18,y:a.bottom-106,w:64,h:30,vx,warning:.46});
            }else if(variant===2){
                rectangle(s,{type:'underline',x,y:a.bottom-26,w:22,h:26,vx,warning:.66});
            }
            if(enraged&&n%3===0)beam(clamp(s.player.x-9,a.left,a.right-18),a.top,18,height,.85,.18);
            s.patternClock=enraged?.94:1.18;
        }else if(s.bossPattern.id==='orbit'){
            const direction=n%2===1?1:-1;
            s.boss.attackName=`ORBITAL ERASERS - ${direction>0?'CW':'CCW'}`;
            const pairs=enraged?3:2,warning=enraged?.65:.85,life=enraged?2.1:1.8;
            for(let pair=0;pair<pairs;pair++)for(let side=0;side<2;side++)rectangle(s,{type:'rotating-beam',x:0,y:0,w:enraged?16:12,h:1,phi:(n%2===1?-.8:.4)+pair*Math.PI/pairs+side*Math.PI,spin:direction*(enraged?1.65:1.05),warning,life});
            s.patternClock=warning+life+.25;
        }else{
            const kind=n%2===1?'blue':'orange';
            s.rule=kind;s.boss.lastColor=kind;
            s.boss.attackName=kind==='blue'?'STOP, THEN WEAVE':'MOVE, THEN WEAVE';
            rectangle(s,{type:'color-wall',kind,x:flowLeft?a.left-24:a.right+4,y:a.top,w:18,h:height,vx:flowLeft?speed:-speed,warning:.36});
            const gap=a.top+[74,164,116][(n-1)%3];
            gate(gap,enraged?68:84,enraged?.96:1.06);
            s.patternClock=enraged?1.14:1.4;
        }
    }
    function emitterAt(phi){
        const a=BOSS_ARENA,cx=(a.left+a.right)/2,cy=(a.top+a.bottom)/2;
        const dx=Math.cos(phi),dy=Math.sin(phi);
        const radius=Math.min(((a.right-a.left)/2+28)/Math.max(.00001,Math.abs(dx)),((a.bottom-a.top)/2+22)/Math.max(.00001,Math.abs(dy)));
        return {x:cx+dx*radius,y:cy+dy*radius};
    }
    function rotatingGeometry(h){
        const phi=h.phi+h.spin*Math.max(0,h.age-h.warning),origin=emitterAt(phi);
        return {...origin,angle:phi+Math.PI,length:800};
    }
    function rectangleHit(p,h){
        if(h.type==='rotating-beam'){
            const ray=rotatingGeometry(h),dx=Math.cos(ray.angle),dy=Math.sin(ray.angle);
            const along=clamp((p.x-ray.x)*dx+(p.y-ray.y)*dy,0,ray.length);
            return Math.hypot(p.x-ray.x-along*dx,p.y-ray.y-along*dy)<p.r+h.w/2;
        }
        const closestX=clamp(p.x,h.x,h.x+h.w),closestY=clamp(p.y,h.y,h.y+h.h);
        return Math.hypot(p.x-closestX,p.y-closestY)<p.r;
    }
    function pattern(s) {
        const p=s.player;
        if(s.phase==='proofread') {
            if(s.phaseTime<2)return;
            const round=Math.floor((s.phaseTime-2)/2);
            s.rule=s.chapter===1?'white':s.chapter===2?(round%2===0?'blue':'white'):(round%2===0?'orange':'white');
            if(s.rule==='white') {
                const fromLeft=round%2===0;
                const gap=40+random(s)*(H-80);
                for(let y=15;y<H;y+=26)if(Math.abs(y-gap)>45)addBullet(s,fromLeft?-10:W+10,y,fromLeft?0:Math.PI,170+s.chapter*12,'white',5);
            }else{
                // Parallel vertical columns leave room to move, but colors change collision rules.
                const offset=random(s)*32;
                for(let x=12+offset;x<W;x+=32)addBullet(s,x,-10,Math.PI/2,150+s.chapter*12,s.rule,5);
            }
            s.patternClock=1.25-s.chapter*.1;
        }else if(s.phase==='boss' && s.boss) {
            bossPattern(s);
        }
    }
    function transition(s) {
        s.phaseTime=0;s.hazards=[];s.bullets=[];s.shots=[];s.enemies=[];s.patternClock=2;s.rule='white';s.invulnerable=Math.max(1.5,s.invulnerable);
        if(s.phase==='survival') {s.phase='proofread';s.message=['','Proofread I · Dodge the Redlines','Proofread II · Blue Ink: stop to pass','Proofread III · Orange Ink: keep moving'][s.chapter];}
        else if(s.phase==='proofread' && s.chapter<3){s.chapter++;s.phase='survival';s.spawnClock=.5;s.message=['','','Chapter II · The Rough Draft','Chapter III · Kill Your Darlings'][s.chapter];}
        else if(s.phase==='proofread'){s.phase='boss';s.boss={x:W/2,y:64,r:28,hp:240,maxHp:240};s.message='Final Draft · The Inner Editor';s.patternClock=1;s.player.x=W/2;s.player.y=BOSS_ARENA.bottom-32;}
    }
    function step(s,input={},dt=1/60) {
        if(s.paused || !['survival','proofread','boss'].includes(s.phase))return;
        dt=clamp(dt,0,.05);s.time+=dt;s.phaseTime+=dt;
        s.invulnerable=Math.max(0,s.invulnerable-dt);s.dashCooldown=Math.max(0,s.dashCooldown-dt);s.dash=Math.max(0,s.dash-dt);
        if(s.phase==='boss'&&s.boss)prepareBoss(s,dt);
        let ix=Number(input.x)||0,iy=Number(input.y)||0;const length=Math.hypot(ix,iy);if(length>1){ix/=length;iy/=length;}
        const gravity=s.phase==='boss'&&s.bossPattern?.control==='gravity';
        const arena=s.phase==='boss'?BOSS_ARENA:{left:3,right:W-3,top:3,bottom:H-3};
        const before={...s.player};
        let speed=116*MOVEMENT_SCALE*(1+.12*(s.upgrades.pace||0));
        if(gravity){
            s.dash=0;
            const held=iy<-.3||!!input.jumpHeld;
            const grounded=s.player.y>=arena.bottom-s.player.r-.5;
            if(grounded&&((held&&!s.bossJumpHeld)||input.dash)){s.player.vy=-280;s.jumpTime=0;}
            s.bossJumpHeld=held;
            s.jumpTime=(s.jumpTime||0)+dt;
            const acceleration=held&&s.player.vy<0&&s.jumpTime<.22?420:850;
            s.player.vy=(s.player.vy||0)+acceleration*dt;
            s.player.y+=s.player.vy*dt;
            s.player.x+=ix*speed*dt;
            if(s.player.y>=arena.bottom-s.player.r){s.player.y=arena.bottom-s.player.r;s.player.vy=0;}
        }else{
            if(input.dash&&length>.1&&s.dashCooldown===0){s.dash=.18;s.dashCooldown=3;s.invulnerable=Math.max(s.invulnerable,.22);}
            if(s.dash>0)speed*=3.2;
            s.player.x+=ix*speed*dt;s.player.y+=iy*speed*dt;
        }
        s.player.x=clamp(s.player.x,arena.left+s.player.r,arena.right-s.player.r);
        s.player.y=clamp(s.player.y,arena.top+s.player.r,arena.bottom-s.player.r);
        const moving=distance(before,s.player)>.04;s.moving=moving;
        s.effects=s.effects.filter(e=>(e.life-=dt)>0);
        if(s.phase==='survival') {
            s.spawnClock-=dt;if(s.spawnClock<=0){spawnEnemy(s);s.spawnClock=Math.max(.24,.9-s.chapter*.12-s.phaseTime*.006);}
        }
        for(const enemy of s.enemies){const d=distance(enemy,s.player)||1;enemy.x+=(s.player.x-enemy.x)/d*enemy.speed*dt;enemy.y+=(s.player.y-enemy.y)/d*enemy.speed*dt;if(d<enemy.r+s.player.r)hit(s,enemy.kind==='critic'?'Overwhelmed by criticism.':'Caught by a wandering typo.');}
        if(!['survival','proofread','boss'].includes(s.phase))return;
        // Pens auto-target; proofreading is a pure dodge phase.
        if(s.phase!=='proofread') {
            s.fireClock-=dt;
            const targets=s.boss?[...s.enemies,s.boss]:s.enemies;
            const target=targets.filter(e=>!e.dead).sort((a,b)=>distance(a,s.player)-distance(b,s.player))[0];
            if(s.fireClock<=0 && target){
                s.fireClock=.56*Math.pow(.84,s.upgrades.flow||0);
                const amount=1+(s.upgrades.split||0),angle=Math.atan2(target.y-s.player.y,target.x-s.player.x);
                for(let i=0;i<amount && s.shots.length<90;i++){const a=angle+(i-(amount-1)/2)*.13;s.shots.push({x:s.player.x,y:s.player.y,vx:Math.cos(a)*340,vy:Math.sin(a)*340,r:4,damage:3+2*(s.upgrades.nib||0),life:1.9});}
            }
            const commas=s.upgrades.footnote||0;s.orbitAngle+=dt*2.6;s.orbitClock-=dt;
            if(commas && s.orbitClock<=0){s.orbitClock=.3;for(let i=0;i<commas;i++){const angle=s.orbitAngle+i*Math.PI*2/commas,pos={x:s.player.x+Math.cos(angle)*40,y:s.player.y+Math.sin(angle)*40};for(const enemy of s.enemies)if(distance(pos,enemy)<enemy.r+10)damageEnemy(s,enemy,5);if(s.boss&&distance(pos,s.boss)<s.boss.r+10)s.boss.hp-=5;}}
            s.pulseClock-=dt;
            if(s.upgrades.revision && s.pulseClock<=0){s.pulseClock=4.5;const radius=70+8*s.upgrades.revision,damage=6+4*s.upgrades.revision;for(const e of s.enemies)if(distance(s.player,e)<radius)damageEnemy(s,e,damage);if(s.boss && distance(s.player,s.boss)<radius+s.boss.r)s.boss.hp-=damage;s.effects.push({x:s.player.x,y:s.player.y,r:radius,life:.5,max:.5,kind:'pulse'});}
        }
        for(const shot of s.shots){shot.x+=shot.vx*dt;shot.y+=shot.vy*dt;shot.life-=dt;for(const e of s.enemies)if(!e.dead&&shot.life>0&&distance(shot,e)<shot.r+e.r){damageEnemy(s,e,shot.damage);shot.life=0;}if(s.boss&&shot.life>0&&distance(shot,s.boss)<shot.r+s.boss.r){s.boss.hp-=shot.damage;shot.life=0;}}
        s.shots=s.shots.filter(x=>x.life>0&&x.x>-20&&x.x<W+20&&x.y>-20&&x.y<H+20);s.enemies=s.enemies.filter(e=>!e.dead);
        if(s.boss && s.boss.hp<=0){s.boss.hp=0;s.phase='victory';s.message='The final page is yours.';return;}
        if(['proofread','boss'].includes(s.phase)){s.patternClock-=dt;if(s.patternClock<=0)pattern(s);}
        for(const bullet of s.bullets){bullet.x+=bullet.vx*dt;bullet.y+=bullet.vy*dt;bullet.life-=dt;if(distance(bullet,s.player)<bullet.r+s.player.r && isHarmful(bullet.kind,moving))hit(s,bullet.kind==='blue'?'Blue ink catches you when you move.':bullet.kind==='orange'?'Orange ink catches you when you stand still.':'Crossed a redline.');}
        s.bullets=s.bullets.filter(x=>x.life>0&&x.x>-30&&x.x<W+30&&x.y>-30&&x.y<H+30);
        for(const hazard of s.hazards){
            hazard.age+=dt;
            if(hazard.age>=hazard.warning&&hazard.age<hazard.warning+hazard.life){
                const activeDt=Math.min(dt,hazard.age-hazard.warning);
                hazard.x+=hazard.vx*activeDt;hazard.y+=hazard.vy*activeDt;
                if(rectangleHit(s.player,hazard)&&isHarmful(hazard.kind,moving))hit(s,hazard.type==='rotating-beam'?'Circle with the rotating erasers; avoid the center and watch the reversal.':hazard.type==='beam'?'Caught in a deletion beam. Move away from the warning line.':hazard.type==='underline'?'Hold for the high underline; tap beneath low ceilings.':hazard.type==='ceiling'?'Use a short tap beneath low ceilings.':hazard.kind==='blue'?'Blue walls are safe only when you stay still.':hazard.kind==='orange'?'Keep moving through orange walls.':'Find the opening between the moving margins.');
            }
        }
        s.hazards=s.hazards.filter(h=>h.age<h.warning+h.life);
        const pickup=25+24*(s.upgrades.margins||0);
        for(const gem of s.gems){const d=distance(gem,s.player);if(d<pickup+35){const speed=210*dt;gem.x+=(s.player.x-gem.x)/(d||1)*Math.min(d,speed);gem.y+=(s.player.y-gem.y)/(d||1)*Math.min(d,speed);}if(distance(gem,s.player)<12){s.xp+=gem.xp;gem.taken=true;}}
        s.gems=s.gems.filter(g=>!g.taken);
        if(s.phase==='defeat')return;
        levelUp(s);if(s.phase==='upgrade')return;
        if(s.phaseTime>=DURATIONS[s.phase]) {
            if(s.phase==='boss'){s.phase='defeat';s.cause='The deadline arrived before the Editor was defeated.';}
            else transition(s);
        }
    }
    const api={W,H,BOSS_ARENA,emitterAt,rotatingGeometry,DURATIONS,UPGRADES,create,step,choose,isHarmful};
    if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.WritingGame=api;
})(globalThis);
