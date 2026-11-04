/* Local, shared progression for Mochi's home. Game-run currencies stay separate. */
(function(root){
    const KEY='tomhy_mochi_lab_v1';
    const CATALOG={
        bed:{name:'Cloud Mattress',cost:30,text:'Naps at home restore Energy twice as fast.'},
        feeder:{name:'Berry Garden',cost:25,text:'Feeding restores 10 extra Fullness.'},
        desk:{name:'Research Desk',cost:45,text:'Studying restores 15 Happiness instead of 8.'},
        lamp:{name:'Firefly Lamp',cost:20,text:'Petting restores 8 extra Happiness.'},
        shelf:{name:'Archive Shelf',cost:60,text:'Playing costs 6 less Energy.'},
        room:{name:'Window Extension',cost:90,text:'Expand and decorate Mochi’s little laboratory.'}
    };
    function fresh(){return {version:1,gold:0,owned:[],claims:{}};}
    function normalize(value){
        if(!value||value.version!==1||!Number.isSafeInteger(value.gold)||value.gold<0)return fresh();
        const owned=Array.isArray(value.owned)?[...new Set(value.owned.filter(id=>Object.hasOwn(CATALOG,id)))]:[];
        const claims={};
        if(value.claims&&typeof value.claims==='object')for(const [id,amount]of Object.entries(value.claims))if(id.length<=180&&Number.isSafeInteger(amount)&&amount>=0&&amount<=100000)Object.defineProperty(claims,id,{value:amount,enumerable:true,writable:true,configurable:true});
        return {version:1,gold:Math.min(value.gold,10000000),owned,claims};
    }
    function credit(state,id,amount){
        if(typeof id!=='string'||!id||id.length>180||!Number.isSafeInteger(amount)||amount<0||amount>100000)return {ok:false,amount:0,reason:'Invalid reward.'};
        if(Object.hasOwn(state.claims,id))return {ok:true,amount:0,duplicate:true};
        Object.defineProperty(state.claims,id,{value:amount,enumerable:true,writable:true,configurable:true});state.gold=Math.min(10000000,state.gold+amount);
        return {ok:true,amount};
    }
    function purchase(state,id){
        const item=Object.hasOwn(CATALOG,id)?CATALOG[id]:null;
        if(!item)return {ok:false,reason:'Unknown upgrade.'};
        if(state.owned.includes(id))return {ok:false,reason:'Already installed.'};
        if(state.gold<item.cost)return {ok:false,reason:`Need ${item.cost-state.gold} more Lab Gold.`};
        state.gold-=item.cost;state.owned.push(id);return {ok:true,cost:item.cost};
    }
    function writingReward(s){return Math.floor(s.kills/4)+Math.max(0,s.level-1)*3+(s.phase==='victory'?50:0);}
    function researchRewards(s){
        if(!s?.runId||!Array.isArray(s.path))return [];
        return s.path.flatMap((id,index)=>{
            const node=s.map.flat().find(n=>n.id===id);
            const completed=index<s.path.length-1||['reward','treasure','victory'].includes(s.phase);
            const amount={combat:10,elite:20,treasure:8,boss:60}[node?.type]||0;
            return completed&&amount?[{id:`${s.runId}:${id}`,amount}]:[];
        });
    }
    const core={KEY,CATALOG,fresh,normalize,credit,purchase,writingReward,researchRewards};
    if(typeof module!=='undefined'&&module.exports){module.exports=core;return;}
    let memory=fresh(),persistent=true;const listeners=new Set(),pending=new Set();
    function read(){if(!persistent)return structuredClone(memory);try{const raw=localStorage.getItem(KEY);memory=raw?normalize(JSON.parse(raw)):(persistent?fresh():memory);}catch{persistent=false;}return structuredClone(memory);}
    function notify(){for(const listener of listeners)listener(read());}
    function mutate(operation){
        const run=()=>{const state=read(),result=operation(state);memory=state;try{localStorage.setItem(KEY,JSON.stringify(state));persistent=true;}catch{persistent=false;}notify();return {...result,persistent};};
        return navigator.locks?.request?navigator.locks.request('mochi-lab-wallet',run):Promise.resolve(run());
    }
    function enqueue(operation){const promise=mutate(operation);pending.add(promise);promise.finally(()=>pending.delete(promise));return promise;}
    root.MochiWallet={...core,read,award:(id,amount)=>enqueue(s=>credit(s,id,amount)),buy:id=>enqueue(s=>purchase(s,id)),subscribe(listener){listeners.add(listener);listener(read());return()=>listeners.delete(listener);},isPersistent:()=>persistent};
    document.addEventListener('click',async event=>{const link=event.target.closest('a[href]');if(!link||!pending.size||event.ctrlKey||event.metaKey||event.shiftKey||event.altKey||link.target==='_blank'||link.origin!==location.origin)return;event.preventDefault();await Promise.allSettled([...pending]);location.assign(link.href);});
    addEventListener('storage',event=>{if(event.key===KEY){persistent=true;notify();}});
})(globalThis);
