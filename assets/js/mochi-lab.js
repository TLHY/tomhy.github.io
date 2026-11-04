(() => {
    const root=document.getElementById('mochi-lab');if(!root)return;
    const wallet=MochiWallet,room=document.getElementById('lab-room'),shop=document.getElementById('lab-upgrades'),message=document.getElementById('lab-message');
    function refresh(state){
        root.querySelector('[data-lab-gold]').textContent=state.gold;
        for(const id of Object.keys(wallet.CATALOG))room.classList.toggle(`has-${id}`,state.owned.includes(id));
        shop.innerHTML=Object.entries(wallet.CATALOG).map(([id,item])=>`<article class="lab-upgrade"><div><strong>${item.name}</strong><p>${item.text}</p></div><button data-buy="${id}" ${state.owned.includes(id)||state.gold<item.cost?'disabled':''}>${state.owned.includes(id)?'Installed':`${item.cost} Gold`}</button></article>`).join('');
        root.querySelector('.lab-save-note').textContent=wallet.isPersistent()?'Lab Gold and upgrades save in this browser.':'This page only: browser storage is unavailable.';
    }
    wallet.subscribe(refresh);
    root.addEventListener('click',async event=>{
        const buy=event.target.closest('[data-buy]');
        if(buy){buy.disabled=true;const result=await wallet.buy(buy.dataset.buy);message.textContent=result.ok?`${wallet.CATALOG[buy.dataset.buy].name} installed!`:result.reason;dispatchEvent(new Event('mochi-lab-layout'));return;}
        const furniture=event.target.closest('[data-furniture]');
        if(furniture){
            const action=furniture.dataset.furniture;
            MochiCompanion.home();
            const text=MochiCompanion.care(action);
            message.textContent=text;
            room.dataset.activity=action;
            clearTimeout(room.activityTimer);room.activityTimer=setTimeout(()=>delete room.dataset.activity,1800);
        }
        if(event.target.closest('[data-call-home]')){MochiCompanion.home();message.textContent='Welcome home, Mochi.';}
        if(event.target.closest('[data-explore]')){MochiCompanion.explore();message.textContent='Mochi is exploring. Hold and carry them home, or use Call home.';}
    });
    addEventListener('mochi-location',event=>{root.querySelector('.lab-resident').textContent=event.detail.home?'Mochi is home':'Mochi is exploring';});
})();
