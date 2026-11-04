(() => {
    const E = HapticRun, KEY = 'tomhy_haptic_run_v1';
    const app = document.getElementById('run-app'), dialog = document.getElementById('run-dialog');
    const escape = v => String(v).replace(/[&<>"']/g, c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[c]));
    let state = null, saved = null, choosing = null, busy = false, selectedArchetype = 'vibration', researchFamily = 'vibration', fusionSelecting = false, fusionSelected = [];
    try { saved = E.restore(localStorage.getItem(KEY)); } catch { /* Saving is optional. */ }
    const labels = { combat:'Battle', elite:'Elite', camp:'Rest site', treasure:'Treasure', event:'Event', boss:'Final Boss' };
    const symbols = { combat:'⚔', elite:'◆', camp:'☾', treasure:'▣', event:'?', boss:'♛' };
    const familyName = family => family === 'neutral' ? 'Neutral' : E.ARCHETYPES[family]?.name || 'Shared';
    const typeNames = { attack:'Attack', skill:'Skill', power:'Power' };
    function persist() {
        try { localStorage.setItem(KEY, JSON.stringify(state)); } catch { /* Browser storage may be disabled. */ }
        for (const reward of MochiWallet.researchRewards(state)) MochiWallet.award(reward.id, reward.amount);
    }
    function showDialog(title, body) {
        document.getElementById('dialog-content').innerHTML = `<h2>${escape(title)}</h2>${body}`;
        if (!dialog.open) dialog.showModal();
    }
    function cardMarkup(instance, action = '', index = '', disabled = false) {
        const c = E.card(instance.id, instance.upgraded);
        const picking=action==='play'&&fusionSelecting;
        if(picking){action='fusion-pick';disabled=false;}
        return `<${action ? 'button' : 'article'} ${action ? `type="button" data-action="${action}" data-index="${index}" ${disabled ? 'disabled' : ''}` : ''} data-family="${c.family}" ${picking ? `aria-pressed="${fusionSelected.includes(Number(index))}"` : ''} class="lab-card ${c.type} ${c.upgraded ? 'upgraded' : ''}">
            <div class="card-cap"><span class="card-cost" aria-label="Energy ${c.cost}">${c.cost}</span><span>${familyName(c.family)} · ${typeNames[c.type]}${c.exhaust ? ' · Exhaust' : ''}</span></div>
            <span class="card-glyph" aria-hidden="true">${c.type === 'attack' ? '⌁' : c.type === 'power' ? '✦' : '◈'}</span>
            <h3>${escape(c.name)}${c.upgraded ? '+' : ''}</h3><p>${escape(E.cardText(c))}</p>
            ${c.research ? `<span class="research-card-tag">PAPER-INSPIRED · ${escape(E.RESEARCH[c.research].citation)}</span>` : ''}
            ${picking ? `<span class="card-footer">${fusionSelected.includes(Number(index)) ? 'Selected ✓' : 'Select as material'} · ${E.fusionMaterial(c).attack} ATK / ${E.fusionMaterial(c).block} Block</span>` : action === 'play' ? `<span class="card-footer">${disabled ? (c.install&&state?.battle?.turrets.length>=E.TURRET_LIMIT?'Turret slots full':'Not enough Energy') : 'Play card'}</span>` : action ? '<span class="card-footer">Choose</span>' : ''}
        </${action ? 'button' : 'article'}>`;
    }
    function researchDialog() {
        const fields = [...Object.keys(E.ARCHETYPES), 'neutral'];
        const ids = Object.keys(E.CARDS).filter(id=>E.CARDS[id].family===researchFamily && ['special','neutral'].includes(E.CARDS[id].rarity));
        showDialog('Research card library', `<p>Each field has ten distinct basic cards and ten special cards. Neutral research cards can support any deck. Cross-disciplinary papers may inspire different cards in more than one field.</p><p class="muted">Paper descriptions use the supplied research summaries. Neutral sources currently use the four publication entries on this homepage; the full HCI Tech Lab list and linked abstracts have not been independently checked. All combat effects are fictional adaptations.</p><div class="research-tabs" role="group" aria-label="Research field">${fields.map(f=>`<button data-action="research-family" data-family="${f}" aria-pressed="${f===researchFamily}">${escape(familyName(f))} · ${Object.values(E.CARDS).filter(c=>c.family===f&&['special','neutral'].includes(c.rarity)).length}</button>`).join('')}</div><div class="research-library">${ids.map(id=>{
            const c=E.CARDS[id], r=E.RESEARCH[c.research];
            return `<section class="research-entry">${cardMarkup({id,upgraded:false})}<div class="research-notes"><h3>${escape(r.title)}</h3><p class="muted">${escape(r.citation)}</p><p><strong>${r.evidence==='profile-entry'?'Publication title':'Supplied summary'}:</strong> ${escape(r.concept)}</p><p><strong>Game adaptation:</strong> ${escape(c.adaptation)}</p><p><strong>Upgrade:</strong> ${escape(E.cardText(E.card(id,true)))}</p><a href="${escape(r.link)}" target="_blank" rel="noopener noreferrer">${escape(r.linkLabel)} ↗</a></div></section>`;
        }).join('')}</div><h2>Starter deck catalogs</h2>${Object.entries(E.ARCHETYPES).map(([id,a]) => `<details class="basic-catalog"><summary>${escape(a.name)} · 10 basic cards</summary><div class="card-gallery">${a.cards.map(id=>cardMarkup({id,upgraded:false})).join('')}</div></details>`).join('')}`);
    }
    function deckDialog() {
        showDialog(`Your deck · ${state.deck.length} cards`, `<p>Upgraded cards are marked +. This is your full expedition deck, not your current hand.</p><div class="card-gallery">${state.deck.map(c => cardMarkup(c)).join('')}</div>`);
    }
    function helpDialog() {
        showDialog('Expedition guide', `<p>Play as Mochi, the little slime from the homepage. Choose Vibration (shield/tank/counters), Thermal (Heat damage over time), Multimodal (two-card fusion), or HapticGeneration (installed turrets). Mix families through card rewards.</p><ol class="help-list"><li><strong>Routes:</strong> Choose a highlighted connected node. Travel upward; completed rooms cannot be revisited.</li><li><strong>Combat:</strong> Each turn starts with 3 Energy and 5 cards. Attack enemies and gain Block against their next action. Their intent is always visible.</li><li><strong>End turn:</strong> Discard your remaining hand. The enemy acts, your Block resets, and a new turn begins. When your draw pile is empty, shuffle the discard pile.</li><li><strong>Vulnerable / Weak:</strong> Vulnerable increases incoming attack damage by 50%. Weak reduces outgoing attack damage by 25%. Each stack lasts one enemy action.</li><li><strong>Heat / Amplify:</strong> Heat deals damage before the enemy acts, ignores Block, then decreases by 1. Amplify adds damage to each hit.</li><li><strong>Morale:</strong> Attack cards deal 25% more damage for the listed number of turns. Morale refreshes to the longer duration when reapplied; counterattacks and Heat are unchanged.</li><li><strong>Evasion:</strong> Avoid one incoming hit, then consume Evasion. It persists through non-attacking turns and does not stack. Thermal Masking also counters; enemy Block reduces counter damage, while Amplify and Vulnerable do not modify it. A lethal counter cancels the remaining enemy hits.</li><li><strong>Tank and Heat:</strong> Retaliation counters every incoming hit, including fully blocked hits, but not evaded hits. A fatal hit prevents retaliation. Temporary Retaliation expires after the enemy action; permanent Retaliation lasts this battle. Retain preserves a percentage of remaining Block (maximum 75%). Heat triggers before the enemy; some cards trigger extra non-consuming ticks or prevent decay.</li><li><strong>Fusion:</strong> Select two hand cards, preview, and confirm for 1 Energy. Materials move to discard or Exhaust; normal material effects do not also play. Multimodal decks can fuse any pair; other decks must include a Multimodal material. The Electrotactile Array adds +2 attack and defense.</li><li><strong>Turrets:</strong> Install at most three; new turrets activate at that turn end, before Heat and the enemy. Turrets persist only for the current encounter. Dismantle freely to clear a slot, with no refund. Supply/Recon queue resources for the next turn. Firmware caps: damage/shields 20, repair 4, suppression/supply/recon 3. Novint Falcon immediately activates the first installation each battle.</li><li><strong>Combo cards:</strong> Fusion bonuses are shown on the selected material cards. Conductive Release triggers Heat twice without consuming it; Heat and turrets do not gain direct-card Amplify or Morale bonuses.</li><li><strong>Research cards:</strong> Use the Research cards button for source concepts, game adaptations, and upgrade effects.</li><li><strong>Rewards:</strong> Win Gold and choose 1 of 3 cards, or skip to keep your deck focused. Elites also guarantee a relic.</li><li><strong>Rest / Events:</strong> Heal or permanently upgrade a card. Spend Gold to heal at an event, or trade HP to remove a card.</li><li><strong>Final encounter:</strong> HP, deck, and relics persist between battles. Defeat the boss at the seventh node to win. At 0 HP, the run ends.</li></ol><p class="muted">Relics represent haptic devices; their bonuses are fictional game rules. Fictional game rules inspired by haptics research, not a simulation of real perceptual effects. No sound or device vibration. Progress is saved in this browser when storage is available.</p>`);
    }
    function deviceIcon(type) {
        const paths = {
            'force-arm':'M5 27 H23 V23 H5 Z M14 23 V17 L23 11 L18 5 L12 8 M23 11 L28 8',
            'parallel-arm':'M5 26 H27 L24 21 H8 Z M8 21 L5 9 L16 5 L27 9 L24 21 M5 9 L16 17 L27 9 M16 17 V24',
            tactor:'M6 9 H26 V25 H6 Z M10 9 V5 H22 V9 M11 14 H21 M11 19 H21 M2 12 V22 M30 12 V22',
            thermode:'M5 10 H27 V24 H5 Z M5 14 H27 M10 18 V24 M16 18 V24 M22 18 V24 M10 6 V3 M16 6 V3 M22 6 V3',
            array:'M5 5 H27 V27 H5 Z M10 10 H12 V12 H10 Z M20 10 H22 V12 H20 Z M10 20 H12 V22 H10 Z M20 20 H22 V22 H20 Z',
            glove:'M10 28 L5 19 V15 L10 18 V7 H14 V15 H16 V4 H20 V15 H22 V7 H26 V22 L22 28 Z'
        };
        return `<svg class="device-icon" viewBox="0 0 32 32" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round">${`<path d="${paths[type] || paths.tactor}"/>`}</svg>`;
    }
    function relicList() {
        return state.relics.map(id => `<span class="relic" title="${escape(E.RELICS[id].text)}">${deviceIcon(E.RELICS[id].device)} ${escape(E.RELICS[id].name)}<small>${escape(E.RELICS[id].text)}</small></span>`).join('');
    }
    function header() {
        return `<section class="run-header"><div><span class="eyebrow">HAPTIC LAB · ${escape(E.ARCHETYPES[state.archetype].name)} deck</span><h1>${state.phase === 'battle' ? labels[state.node.type] : 'Forest Expedition'}</h1></div><div class="run-resources"><span class="health">HP <strong>${state.hp} / ${state.maxHp}</strong></span><span>Run Gold <strong>${state.gold}</strong></span><span>Lab Gold <strong data-wallet-balance>${MochiWallet.read().gold}</strong></span><button data-action="deck">Deck ${state.deck.length}</button><button data-action="restart">New run</button></div></section><div class="relic-strip" aria-label="Your relics">${relicList()}</div>`;
    }
    function mapMarkup() {
        const coord = n => ({ x: state.map[n.floor].length === 1 ? 300 : state.map[n.floor].length === 2 ? 180 + n.col * 240 : 100 + n.col * 200, y: 40 + (6 - n.floor) * 96 });
        const nodes = state.map.flat();
        const lines = nodes.flatMap(n => n.next.map(id => {
            const a = coord(n), b = coord(nodes.find(x => x.id === id));
            const used = state.path.includes(n.id) && state.path.includes(id);
            const open = state.path.at(-1) === n.id && state.available.includes(id);
            return `<line x1="${a.x}" y1="${a.y}" x2="${b.x}" y2="${b.y}" class="${used ? 'traveled' : open ? 'open-route' : ''}"/>`;
        })).join('');
        return `<div class="map-layout"><section class="map-panel"><div class="section-heading"><h2>Expedition Map</h2><span>${state.path.length} / 7 rooms</span></div><p class="muted">Travel from bottom to top along connected paths.</p><div class="route-map"><svg viewBox="0 0 600 672" preserveAspectRatio="none" aria-hidden="true">${lines}</svg>${nodes.map(n => {
            const p = coord(n), visited = state.path.includes(n.id), open = state.available.includes(n.id);
            return `<button class="map-node ${n.type} ${visited ? 'visited' : ''} ${open ? 'available' : ''}" style="left:${p.x / 6}%;top:${p.y}px" data-action="visit" data-id="${n.id}" ${!open ? 'disabled' : ''} aria-label="Floor ${n.floor + 1} ${labels[n.type]}${visited ? ' completed' : open ? ' available' : ' locked'}"><span>${visited ? '✓' : symbols[n.type]}</span><small>${labels[n.type]}</small></button>`;
        }).join('')}</div></section><aside class="route-guide"><span class="eyebrow">CHOOSE YOUR EXPERIMENT</span><h2>What will you<br>risk today?</h2><p>Save HP on a safer path, or challenge an Elite to discover powerful relics.</p><dl>${Object.entries(labels).map(([id, text]) => `<div><dt>${symbols[id]} ${text}</dt><dd>${{combat:'Card choice + 20 Gold',elite:'Tough foe · Card + relic + 38 Gold',camp:'Heal 22 HP or upgrade one card',treasure:'One relic + 25 Gold',event:'Trade Gold for healing, or HP for card removal',boss:'Sensory Devourer · 108 HP'}[id]}</dd></div>`).join('')}</dl><p class="muted">Spend Gold to heal at events. Rest sites and treasures let you continue without a battle.</p></aside></div>`;
    }
    function monster(enemy) {
        const outline = '#2e383b';
        const art = {
            slime: `<ellipse cx="80" cy="126" rx="50" ry="7" fill="#233f3025"/><g class="sprite-body"><path d="M27 111 Q25 78 43 68 Q48 38 78 39 Q106 37 116 67 Q136 85 134 110 L123 120 L39 120Z" fill="#afca7a"/><path d="M40 104 Q38 72 57 67 Q57 49 77 48" fill="none" stroke="#ddebaf" stroke-width="8"/><path d="M45 118 L52 108 M111 118 L104 109"/><rect x="55" y="79" width="9" height="12" fill="#23352c" stroke="none"/><rect x="93" y="79" width="9" height="12" fill="#23352c" stroke="none"/><path d="M72 101 H86"/><path d="M22 56 H31 V47 H40 M124 49 V57 H137" fill="none" stroke="#98b95a"/></g>`,
            beetle: `<ellipse cx="80" cy="129" rx="55" ry="6" fill="#233f3025"/><g class="sprite-legs" fill="none"><path d="M47 70 L24 58 L15 67 M43 92 H18 L10 104 M49 111 L29 123 L22 135 M114 70 L137 58 L146 67 M119 92 H144 L152 104 M111 111 L132 123 L139 135" stroke="#5c4a38" stroke-width="7"/></g><g class="sprite-body"><path d="M58 40 L52 23 L38 17 M101 40 L108 23 L123 17" fill="none" stroke-width="4"/><circle cx="37" cy="17" r="5" fill="#f1d568"/><circle cx="124" cy="17" r="5" fill="#f1d568"/><path d="M50 55 L60 39 H101 L113 55 L126 85 L118 112 L100 126 H62 L42 112 L35 85Z" fill="#c28743"/><path d="M79 53 L59 60 L48 86 L54 109 L74 118 H80Z" fill="#e7bb68" stroke="none"/><path d="M80 53 L100 60 L112 86 L106 109 L86 118 H80Z" fill="#a96a34" stroke="none"/><path d="M80 56 V121" stroke="#65492c" stroke-width="5"/><path d="M57 41 L66 29 H96 L106 41 L100 59 H62Z" fill="#5b6242"/><rect x="65" y="39" width="8" height="8" fill="#f7f3af" stroke="none"/><rect x="89" y="39" width="8" height="8" fill="#f7f3af" stroke="none"/><path d="M45 78 L63 71 M98 71 L115 78 M45 101 L61 96 M99 96 L115 101" stroke="#f4cf82" stroke-width="3"/></g>`,
            wisp: `<ellipse cx="80" cy="128" rx="37" ry="5" fill="#cc765c25"/><g class="sprite-float"><path d="M42 112 Q25 94 40 72 Q37 98 53 85 Q47 54 73 38 Q72 17 92 8 Q80 42 107 56 Q128 37 122 28 Q149 73 125 88 Q145 108 119 118 Q80 135 42 112Z" fill="#d95d48"/><path d="M53 111 Q44 90 63 75 Q61 93 77 84 Q70 57 89 39 Q87 62 105 75 Q114 91 107 99 Q127 104 112 114Z" fill="#f5aa4f" stroke="none"/><path d="M69 113 Q61 101 80 88 Q79 101 92 95 Q107 107 97 118Z" fill="#fff0ae" stroke="none"/><path d="M64 75 H72 M97 75 H105" stroke="#543d37" stroke-width="5"/><path d="M80 88 H88" stroke="#543d37"/><rect x="26" y="54" width="5" height="8" fill="#e5824c" stroke="none"/><rect x="130" y="100" width="5" height="8" fill="#e5824c" stroke="none"/></g>`,
            golem: `<ellipse cx="80" cy="132" rx="57" ry="5" fill="#233f3025"/><g class="sprite-body"><path d="M41 49 H24 V63 H15 V99 H37 V82 H45 M119 49 H136 V63 H145 V99 H123 V82 H115" fill="#8d9d96"/><path d="M44 110 H68 V132 H39 V123 H44 M92 110 H116 V123 H121 V132 H92Z" fill="#657b75"/><path d="M41 52 L55 42 H105 L119 52 V111 H41Z" fill="#9dada2"/><path d="M50 51 H110 V105 H50Z" fill="#6b827b" stroke="none"/><path d="M52 39 V18 H107 V39 L97 47 H62Z" fill="#a9b9ac"/><path d="M61 29 H98" stroke="#283d3d" stroke-width="9"/><path d="M65 29 H94" stroke="#b6f0dc" stroke-width="4"/><path d="M80 59 L98 79 L80 99 L62 79Z" fill="#c0f2d5"/><path d="M80 69 L88 79 L80 89 L72 79Z" fill="#4e8f81" stroke="none"/><path d="M24 66 V88 M136 66 V88 M55 56 V64 M105 56 V64" fill="none" stroke="#d6dbc3" stroke-width="3"/></g>`,
            specter: `<ellipse cx="80" cy="129" rx="40" ry="5" fill="#6b4d8d25"/><g class="sprite-float"><ellipse class="specter-ring" cx="80" cy="54" rx="53" ry="17" fill="none" stroke="#ab91c5" stroke-dasharray="5 6"/><path d="M43 59 Q41 27 80 18 Q119 28 117 59 L129 115 L109 103 L97 126 L80 108 L62 126 L51 104 L30 115Z" fill="#a38ac2" fill-opacity=".76"/><path d="M53 62 Q50 35 79 29 Q103 36 106 62 L101 96 L80 86 L59 97Z" fill="#e4d7ec" stroke="none"/><path d="M56 61 L72 65 L69 76 L56 73Z M104 61 L88 65 L91 76 L104 73Z" fill="#493e65" stroke="none"/><path d="M72 86 Q80 80 88 86" fill="none" stroke="#493e65"/><path d="M30 75 L16 85 L20 99 M130 75 L144 85 L140 99" fill="none" stroke="#a38ac2" stroke-width="6"/><rect x="25" y="34" width="5" height="5" fill="#b99cd6" stroke="none"/><rect x="133" y="25" width="5" height="5" fill="#b99cd6" stroke="none"/></g>`,
            boss: `<ellipse cx="80" cy="131" rx="68" ry="6" fill="#32203f35"/><g class="sprite-body"><path d="M42 51 L17 13 L24 61 L11 83 L28 105 L31 86 L44 80 M118 51 L143 13 L136 61 L149 83 L132 105 L129 86 L116 80" fill="#675278"/><path d="M43 47 L39 21 L60 35 L80 20 L100 35 L121 21 L117 47 L130 77 L119 116 L100 128 L60 128 L41 116 L30 77Z" fill="#544063"/><path d="M59 43 L80 31 L101 43 L112 74 L103 112 H57 L48 74Z" fill="#846194" stroke="none"/><path d="M47 58 L70 63 L64 74 L50 72 M113 58 L90 63 L96 74 L110 72" fill="#f7d08d" stroke="none"/><path d="M53 88 L65 79 L80 84 L95 79 L107 88 L96 110 H64Z" fill="#241d32"/><path d="M60 85 L65 94 L72 84 M88 84 L95 94 L101 85 M68 108 L73 100 L79 109 M83 109 L88 100 L94 107" fill="#f1e4c1" stroke="none"/><path d="M80 42 L86 51 L80 61 L74 51Z" fill="#e5c0ef" stroke="none"/><path d="M35 112 L24 126 H49 M125 112 L136 126 H111" fill="#675278"/></g>`
        };
        const key = enemy === E.ENEMIES.specter ? 'specter' : enemy.art;
        return `<div class="monster monster-${key}" aria-hidden="true"><svg class="monster-sprite" viewBox="0 0 160 140" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="${outline}" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round">${art[key] || art.slime}</svg></div>`;
    }
    function mochiHero(mood = 'idle') {
        return `<div class="mochi-player" data-mood="${mood}" role="img" aria-label="Mochi, your slime companion"><span class="mochi-battle-shadow"></span><span class="fluffy-body">${MochiArt.render('research')}</span><span class="mochi-shield" aria-hidden="true"></span></div>`;
    }
    function animateBattle(cue) {
        const actor = app.querySelector('.mochi-player');
        if (!actor) return;
        actor.dataset.mood = cue;
        if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
        const body = actor.querySelector('.fluffy-body');
        const frames = {
            attack: [{transform:'scale(1)'},{transform:'translateX(-8px) scale(1.12,.88)',offset:.2},{transform:'translateX(30px) scale(.94,1.08)',offset:.55},{transform:'scale(1)'}],
            evade: [{transform:'translateX(0)'},{transform:'translateX(-20px) skewX(-8deg)',opacity:.4},{transform:'translateX(0)',opacity:1}],
            hit: [{transform:'translateX(0)'},{transform:'translateX(-9px) scale(.94,1.04)'},{transform:'translateX(5px)'},{transform:'translateX(-3px)'},{transform:'translateX(0)'}],
            block: [{transform:'scale(1)'},{transform:'scale(1.12,.88)'},{transform:'scale(1)'}],
            heal: [{transform:'translateY(0)'},{transform:'translateY(-12px) scale(.97,1.04)'},{transform:'translateY(0)'}]
        };
        const animation = body.animate(frames[cue] || frames.heal, {duration:cue === 'attack' ? 420 : 500,easing:'ease-out'});
        animation.onfinish = () => { if (actor.isConnected) actor.dataset.mood = 'idle'; };
    }
    function researchEffect(family) {
        const arena = app.querySelector('.arena');
        if (!arena) return;
        const pulse = document.createElement('span');
        pulse.className = `research-pulse pulse-${family}`;
        pulse.setAttribute('aria-hidden', 'true');
        arena.append(pulse);
        setTimeout(() => pulse.remove(), 700);
    }
    function combatEffects(effects) {
        const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
        const counts = { player: 0, enemy: 0 };
        let duration = 0;
        for (const effect of effects) {
            if(effect.kind==='turret'){const t=app.querySelector(`[data-turret-id="${effect.turret}"]`);if(t&&!reduced)t.animate([{filter:'brightness(1)'},{filter:'brightness(1.6)'},{filter:'brightness(1)'}],{duration:400});continue;}
            const actor = app.querySelector(effect.target === 'player' ? '.mochi-player' : '.enemy-station .monster');
            if (!actor) continue;
            const row = counts[effect.target]++;
            const delay = row * 150;
            duration = Math.max(duration, delay + 950);
            const number = document.createElement('span');
            number.className = `combat-number fx-${effect.kind}`;
            number.setAttribute('aria-hidden', 'true');
            const labels = { damage: `−${effect.amount} HP`, heal: `+${effect.amount} HP`, block: `+${effect.amount} Block`, absorb: `${effect.amount} Blocked`, heat: `+${effect.amount} Heat`, morale: `Morale ${effect.amount} turns`, retaliation:`+${effect.amount} Counter`, install:'Turret installed', evasion: 'Evasion ready', evade: `Evaded ${effect.amount}` };
            number.textContent = labels[effect.kind];
            number.style.setProperty('--fx-delay', `${delay}ms`);
            number.style.setProperty('--fx-row', row % 3);
            actor.append(number);
            const timer = setTimeout(() => {
                if (!actor.isConnected) return;
                if (effect.kind === 'damage') {
                    const flash = document.createElement('span');
                    flash.className = `combat-impact${['heat','thermal'].includes(effect.source) ? ' heat-impact' : effect.source === 'counter' ? ' counter-impact' : ''}`;
                    flash.setAttribute('aria-hidden', 'true');
                    actor.append(flash);
                    setTimeout(() => flash.remove(), 450);
                    if (!reduced) {
                        const sprite = actor.querySelector('.fluffy-body, .monster-sprite');
                        sprite?.animate([{transform:'translateX(0)',filter:'brightness(1)'},{transform:'translateX(-7px)',filter:'brightness(2)'},{transform:'translateX(6px)'},{transform:'translateX(0)',filter:'brightness(1)'}], {duration:300,easing:'ease-out'});
                    }
                }
            }, delay);
            // DOM replacement cancels obsolete effects; no persistent combat state is changed.
            setTimeout(() => { clearTimeout(timer); number.remove(); }, delay + 1000);
        }
        return duration;
    }
    function turretIcon(type) {
        return `<svg viewBox="0 0 64 48" class="turret-art" aria-hidden="true"><path d="M12 44H52L46 34H18Z" fill="#49616a"/><path d="M27 18H37V36H27Z" fill="#97ad9b"/><path d="M15 10H43V25H15Z" fill="#a7c5b5" stroke="#294a49" stroke-width="2"/><path d="M42 14H58V21H42Z" fill="#657f89"/><text x="27" y="22" text-anchor="middle" fill="#203c31" font-size="15">${escape(E.TURRETS[type].symbol)}</text></svg>`;
    }
    function turretMarkup() {
        const b=state.battle;
        if(!b.turrets.length&&state.archetype!=='generation'&&!b.hand.some(c=>E.card(c.id,c.upgraded).install))return '';
        return `<section class="turret-field" aria-label="Installed turrets"><div class="turret-heading"><strong>Turret network · ${b.turrets.length} / ${E.TURRET_LIMIT}</strong><span>Activate at turn end, before the enemy. Dismantling refunds nothing.</span></div><div class="turret-grid">${b.turrets.map(t=>`<article class="turret-card" data-turret-id="${t.id}">${turretIcon(t.type)}<strong>${escape(E.TURRETS[t.type].name)}</strong><span>${escape(E.turretDescription(t))}</span><button data-action="scrap-turret" data-id="${t.id}" ${fusionSelecting?'disabled':''} aria-label="Dismantle ${escape(E.TURRETS[t.type].name)}">Dismantle</button></article>`).join('')}${Array.from({length:E.TURRET_LIMIT-b.turrets.length},()=>'<div class="turret-empty">Empty installation slot</div>').join('')}</div>${b.turrets.length===E.TURRET_LIMIT?'<p class="turret-full">Network full. Dismantle a turret before installing another.</p>':''}</section>`;
    }
    function fusionMarkup() {
        const b=state.battle;
        if(!fusionSelecting)return state.archetype==='multimodal'||b.hand.some(c=>E.card(c.id,c.upgraded).family==='multimodal')?`<div class="fusion-toolbar"><button data-action="fusion-start" ${b.hand.length<2||b.energy<1?'disabled':''}>Fuse 2 hand cards · 1 Energy</button><span>Choose two materials for a combined attack and shield.</span></div>`:'';
        const result=E.fusionPreview(state,fusionSelected);
        return `<section class="fusion-panel" aria-label="Card fusion"><h3>Choose two materials · ${fusionSelected.length} / 2</h3><p>Only the listed material values and fusion bonuses apply. Materials are discarded or exhausted; their normal play effects do not also activate.</p><div class="fusion-preview" role="status" aria-live="polite">${result?`${result.damage} damage + ${result.block} Block · 1 Energy${result.burn?` · ${result.burn} Heat`:''}${result.weak?` · ${result.weak} Weak`:''}${result.vulnerable?` · ${result.vulnerable} Vulnerable`:''}${result.draw?` · draw ${result.draw}`:''}${result.evade?' · Evasion':''}`:fusionSelected.length===2?'Include a Multimodal material in this deck.':'Select two cards below to preview the result.'}</div><button class="primary" data-action="fusion-confirm" ${!result||b.energy<1?'disabled':''}>Confirm fusion</button><button data-action="fusion-cancel">Cancel</button></section>`;
    }
    function bossReview(enemy, turn) {
        if (enemy.id !== 'boss') return '';
        const quotes = enemy.awakened ? [
            'The claims are stronger now. Where is the stronger evidence?',
            'Please add another baseline. The previous baseline is also attacking.',
            'The sample size is small. I will double the number of attacks.',
            'I appreciate the revisions. Unfortunately, I have four more concerns.'
        ] : [
            'What exactly is novel about your approach?',
            'The baseline needs strengthening. I have prepared a shield.',
            'Can you replicate this result? Twice, please.',
            'Your conclusion seems stronger than the evidence.'
        ];
        return `<aside class="spire-review" aria-label="Fictional reviewer comment"><span>Reviewer 2 · ${enemy.awakened ? 'Second round' : 'First round'}</span><p>${escape(quotes[(turn-1)%quotes.length])}</p></aside>`;
    }
    function battleMarkup() {
        const b = state.battle, e = b.enemy, enemy = E.ENEMIES[e.id], move = E.intent(state);
        const mechanicStatus=[b.retaliate+b.thorns?`Counter ${b.retaliate+b.thorns}`:'',b.retain?`Retain ${b.retain}%`:'',b.heatPower?`Heat boost +${b.heatPower}`:'',b.fusionPower?`Fusion +${b.fusionPower}`:''].filter(Boolean).join(' · ')||E.ARCHETYPES[state.archetype].subtitle;
        const morale = b.morale ? `Morale +25% · ${b.morale} turns` : '';
        const evasion = b.evade ? `Evasion ready${b.counter ? ` · Counter ${b.counter}` : ''}` : '';
        const intent = [move.damage ? `Attack ${move.damage}${move.hits > 1 ? ` × ${move.hits}` : ''}` : '', move.block ? `Block +${move.block}` : '', move.strength ? `Amplify +${move.strength}` : ''].filter(Boolean).join(' · ');
        const statuses = [[e.burn,'Heat'],[e.weak,'Weak'],[e.vulnerable,'Vulnerable'],[e.strength,'Amplify'],[e.block,'Block']].filter(([v]) => v > 0);
        return `<section class="battle-panel"><div class="battle-meta"><span class="eyebrow">Floor ${state.node.floor + 1} · Turn ${b.turn}</span><button data-action="route">View route</button></div>${bossReview(e,b.turn)}<div class="arena"><div class="player-station"><span class="eyebrow">YOUR RESEARCH COMPANION</span><h2>Mochi</h2>${mochiHero()}<p>Block <strong>${b.block}</strong> · Amplify <strong>${b.strength}</strong>${b.armor ? ` · Block each turn +${b.armor}` : ''}</p><p class="muted">Your little research companion.<br>Manage cards and Energy to keep Mochi safe.</p></div><div class="enemy-station"><div class="intent" role="status" aria-label="Enemy intent">Next intent <strong>${escape(intent)}</strong></div>${monster(enemy)}<h2>${escape(enemy.name)}${e.awakened ? ' · Awakened' : ''}</h2><div class="hp-track" role="meter" aria-label="Enemy HP" aria-valuenow="${e.hp}" aria-valuemin="0" aria-valuemax="${e.maxHp}"><span style="width:${Math.max(0, e.hp / e.maxHp * 100)}%"></span><b>${e.hp} / ${e.maxHp}</b></div><div class="enemy-statuses">${statuses.map(([v,label]) => `<span>${label} ${v}</span>`).join('')}</div><p class="muted">${escape(enemy.description)}</p></div></div><div class="turn-bar"><span class="energy">Energy <strong>${b.energy}</strong> / 3</span><span class="player-defense">Block <strong>${b.block}</strong> · Amplify <strong>${b.strength}</strong>${evasion ? `<span class="evasion-status">${evasion}</span>` : ''}${morale ? `<span class="morale-status">${morale}</span>` : ''}</span><span class="pile-counts">Draw ${b.draw.length} · Discard ${b.discard.length} · Exhaust ${b.exhaust.length}</span><button class="primary" data-action="end" ${fusionSelecting?'disabled':''}>End turn →</button></div>${turretMarkup()}${fusionMarkup()}<div class="deck-status" aria-label="Deck mechanics">${mechanicStatus}${b.heatRetention?' · Heat does not decay':''}${b.counterHeat?` · Heat response ${b.counterHeat}`:''}</div><div class="hand" aria-label="Hand">${b.hand.length ? b.hand.map((c,i) => cardMarkup(c,'play',i,(E.card(c.id,c.upgraded).cost > b.energy || (E.card(c.id,c.upgraded).install && b.turrets.length>=E.TURRET_LIMIT)))).join('') : '<p>Your hand is empty. End your turn to draw new cards.</p>'}</div><p class="muted small">Played cards go to the discard pile. Exhausted cards cannot be drawn again this battle.</p></section><details class="battle-log" open><summary>Expedition log</summary><ol>${state.log.slice(-4).map(t => `<li>${escape(t)}</li>`).join('')}</ol></details>`;
    }
    function rewardMarkup() {
        const r = state.reward;
        return `<section class="choice-panel"><span class="eyebrow">EXPERIMENT COMPLETE</span><h2>Battle won</h2>${mochiHero('victory')}<p class="reward-gold">Run Gold +${r.gold} · Lab Gold +${state.node.type === 'elite' ? 20 : 10}</p>${r.relic ? `<div class="relic-reward"><strong>✦ ${E.RELICS[r.relic].name}</strong><p>${E.RELICS[r.relic].text}</p></div>` : ''}<h3>Choose one card to add to your deck.</h3><p class="muted">Skip if none of these cards fit your strategy.</p><div class="reward-cards">${r.cards.map(id => cardMarkup({id,upgraded:false},'reward',id)).join('')}</div><button class="secondary" data-action="skip">Skip card reward →</button></section>`;
    }
    function chooseMarkup() {
        if (choosing) {
            const upgrade = choosing === 'upgrade';
            return `<section class="choice-panel"><h2>${upgrade ? 'Choose a card to upgrade' : 'Choose a card to remove'}</h2><p>${upgrade ? 'Preview the upgraded effects below. The upgrade lasts for this entire expedition.' : 'Lose 6 HP to permanently remove one card from your expedition deck.'}</p><div class="card-gallery">${state.deck.map((c,i) => upgrade && c.upgraded ? '' : cardMarkup(upgrade ? {...c,upgraded:true} : c,upgrade ? 'upgrade' : 'remove',i)).join('')}</div><button data-action="cancel">← Back</button></section>`;
        }
        if (state.phase === 'camp') return `<section class="choice-panel"><div class="room-symbol">☾</div><span class="eyebrow">A QUIET PLACE</span><h2>Calibration Camp</h2><p>Choose one action, then continue your expedition.</p><div class="room-options"><button data-action="heal"><strong>Rest</strong><span>Heal ${Math.min(22,state.maxHp-state.hp)} HP</span></button><button data-action="choose-upgrade" ${state.deck.every(c => c.upgraded) ? 'disabled' : ''}><strong>Research</strong><span>Permanently upgrade one card</span></button></div></section>`;
        if (state.phase === 'event') return `<section class="choice-panel"><div class="room-symbol">?</div><span class="eyebrow">FIELD LABORATORY</span><h2>Abandoned Field Lab</h2><p>Among the old equipment, you discover a working healing station and a signal cleanup tool.</p><div class="room-options"><button data-action="event-heal" ${state.gold < 15 ? 'disabled' : ''}><strong>Infusion</strong><span>15 Gold → heal up to 16 HP</span></button><button data-action="choose-remove" ${state.hp <= 6 || state.deck.length <= 5 ? 'disabled' : ''}><strong>Signal Cleanup</strong><span>6 HP → remove one card</span></button><button data-action="event-leave"><strong>Move on</strong><span>Keep your HP and Gold</span></button></div></section>`;
        const r = state.reward;
        return `<section class="choice-panel"><div class="room-symbol">▣</div><span class="eyebrow">A SMALL DISCOVERY</span><h2>Research Cache</h2><p>Run Gold +${r.gold} · Lab Gold +8</p>${r.relic ? `<div class="relic-reward"><h3>✦ ${E.RELICS[r.relic].name}</h3><p>${E.RELICS[r.relic].text}</p></div>` : '<p>All relics collected. Gain 30 additional Gold instead.</p>'}<button class="primary" data-action="treasure-leave">Take the relic and continue →</button></section>`;
    }
    function finalMarkup() {
        const won = state.phase === 'victory';
        return `<section class="choice-panel finale">${mochiHero(won ? 'victory' : 'tired')}<span class="eyebrow">${won ? 'EXPEDITION COMPLETE' : 'EXPERIMENT ENDED'}</span><h2>${won ? 'The Sensory Spire is yours!' : 'This experiment has ended.'}</h2><p>${won ? 'Lab Gold +60 sent home! Mochi has tamed the Devourer with signals, shields, heat, and illusion.' : 'Try a different route or card combination. Mochi is ready for another adventure.'}</p><div class="run-summary"><span>Defeated ${state.wins}</span><span>Rooms ${state.path.length} / 7</span><span>Cards ${state.deck.length}</span><span>Relics ${state.relics.length}</span></div><button class="primary" data-action="choose-new">Try another starter deck</button><button data-action="deck">View final deck</button></section>`;
    }
    function render(focus = false) {
        if (!state) {
            app.innerHTML = `<section class="lobby"><span class="eyebrow">A HAPTIC DECKBUILDING ROGUELIKE</span><h1>Sensory Spire</h1><p class="lobby-copy">Collect signals. Combine sensations.<br>Build a deck and explore the forest with Mochi.</p><div class="lobby-tags"><span>40 basic · 40 special · 4 neutral cards</span><span>Branching routes</span><span>Elites & Final Boss</span><span>Earn Lab Gold for Mochi’s home</span></div><div class="archetype-grid" role="group" aria-label="Choose a starter deck">${Object.entries(E.ARCHETYPES).map(([id,a]) => `<button class="archetype ${id} ${id === selectedArchetype ? 'selected' : ''}" data-action="archetype" data-id="${id}" aria-pressed="${id === selectedArchetype}"><span class="archetype-symbol" aria-hidden="true">${{vibration:'⌁',thermal:'♨',multimodal:'◈',generation:'✧'}[id]}</span><strong>${a.name}</strong><b>${a.subtitle}</b><span>${a.description}</span><small>${a.cards.length} distinct basic cards · Matching-family rewards</small></button>`).join('')}</div><div class="lobby-actions">${saved && !['victory','defeat'].includes(saved.phase) ? '<button class="primary" data-action="continue">Continue expedition</button>' : ''}<button class="${saved ? 'secondary' : 'primary'}" data-action="${saved ? 'restart' : 'new'}">Start with ${E.ARCHETYPES[selectedArchetype].name}</button><button data-action="help">How to play</button></div><p class="muted">10–20 minutes · No sound · Browser autosave</p><p class="small muted">Combine attacks, shields, Heat, and Amplify.<br>Inspired by research concepts; not a simulation of real haptic effects.</p></section>`;
            return;
        }
        let body = state.phase === 'map' ? mapMarkup() : state.phase === 'battle' ? battleMarkup() : state.phase === 'reward' ? rewardMarkup() : ['victory','defeat'].includes(state.phase) ? finalMarkup() : chooseMarkup();
        app.innerHTML = header() + body;
        if (focus) { const target = app.querySelector('.choice-panel h2, .battle-panel h2, .map-panel h2'); if (target) { target.tabIndex = -1; target.focus({preventScroll:true}); } }
    }
    function announce(text) { document.getElementById('run-announcement').textContent = text; }
    document.addEventListener('click', async event => {
        const button = event.target.closest('button[data-action]');
        if (!button || button.disabled || busy) return;
        const action = button.dataset.action, index = Number(button.dataset.index);
        if (state?.phase==='battle' && action==='fusion-start') { fusionSelecting=true;fusionSelected=[];render();announce('Select two hand cards for fusion.');app.querySelector('.hand button')?.focus();return; }
        if (action==='fusion-cancel') {fusionSelecting=false;fusionSelected=[];render();app.querySelector('[data-action="fusion-start"]')?.focus();return;}
        if (fusionSelecting && action==='fusion-pick') {
            fusionSelected=fusionSelected.includes(index)?fusionSelected.filter(i=>i!==index):fusionSelected.length<2?[...fusionSelected,index]:fusionSelected;
            render();app.querySelector(`[data-action="fusion-pick"][data-index="${index}"]`)?.focus({preventScroll:true});return;
        }
        if (fusionSelecting&&['end','play','scrap-turret'].includes(action))return;
        if (action === 'archetype' && !state && E.ARCHETYPES[button.dataset.id]) { selectedArchetype = button.dataset.id; render(); app.querySelector(`[data-action="archetype"][data-id="${selectedArchetype}"]`)?.focus({preventScroll:true}); return; }
        if (action === 'choose-new') { if (dialog.open) dialog.close(); saved = state || saved; selectedArchetype = state?.archetype || selectedArchetype; state = null; choosing = null; fusionSelecting=false;fusionSelected=[];render(); app.scrollIntoView({behavior:'instant'}); return; }
        if (action === 'help') { helpDialog(); return; }
        if (action === 'research') { researchFamily = state?.archetype || selectedArchetype; researchDialog(); return; }
        if (action === 'research-family' && [...Object.keys(E.ARCHETYPES),'neutral'].includes(button.dataset.family)) { researchFamily=button.dataset.family; researchDialog(); dialog.querySelector(`[data-family="${researchFamily}"][data-action="research-family"]`)?.focus(); return; }
        if (action === 'restart') { showDialog('Start a new expedition?', state ? '<p>Return to deck selection. Your existing run stays saved until you start a new one.</p><button class="danger" data-action="choose-new">Choose a starter deck</button>' : `<p>Replace your saved run with a new ${escape(E.ARCHETYPES[selectedArchetype].name)} expedition.</p><button class="danger" data-action="new">Start with this deck</button>`); return; }
        if (action === 'deck' && state) { deckDialog(); return; }
        if (action === 'route' && state) { showDialog('Expedition route', `<p>Room ${state.path.length} / 7 · Finish this battle to choose your next route.</p>${mapMarkup()}`); return; }
        busy = true;
        const before = state?.phase;
        const oldHp = state?.hp;
        const played = action === 'play' && state?.phase === 'battle' && state.battle.hand[index] ? E.card(state.battle.hand[index].id, state.battle.hand[index].upgraded) : null;
        const effects = [];
        const emit = effect => effects.push(effect);
        let changed = false;
        if (action === 'new') { if (dialog.open) dialog.close(); state = E.create(Date.now(), selectedArchetype); state.runId = `research-${crypto.randomUUID ? crypto.randomUUID() : Date.now() + '-' + Math.random().toString(36).slice(2)}`; saved = null; choosing = null; changed = true; }
        else if (action === 'continue' && saved) { state = saved; saved = null; changed = true; }
        else if (state) {
            if (action === 'visit') changed = E.visit(state,button.dataset.id);
            if (action === 'play') changed = E.play(state,index,emit);
            if (action === 'fusion-confirm') {changed=E.fuse(state,fusionSelected,emit);if(changed){fusionSelecting=false;fusionSelected=[];}}
            if (action === 'scrap-turret') changed=E.scrapTurret(state,Number(button.dataset.id));
            if (action === 'end') changed = E.endTurn(state,emit);
            if (action === 'reward') changed = E.reward(state,button.dataset.index);
            if (action === 'skip') changed = E.reward(state);
            if (action === 'heal') changed = E.camp(state,'heal');
            if (action === 'upgrade') { changed = E.camp(state,'upgrade',index); choosing = null; }
            if (action === 'remove') { changed = E.event(state,'remove',index); choosing = null; }
            if (action === 'event-heal') changed = E.event(state,'heal');
            if (action === 'event-leave') changed = E.event(state,'leave');
            if (action === 'treasure-leave') changed = E.leaveTreasure(state);
            if (action === 'choose-upgrade' && state.phase === 'camp') { choosing = 'upgrade'; changed = true; }
            if (action === 'choose-remove' && state.phase === 'event') { choosing = 'remove'; changed = true; }
            if (action === 'cancel') { choosing = null; changed = true; }
        }
        if (changed) {
            persist();
            // Keep the last hit visible before replacing combat with rewards or defeat.
            if (before === 'battle' && state.phase !== 'battle' && effects.length) {
                const duration = combatEffects(effects);
                if (action==='fusion-confirm')researchEffect('multimodal');else if(played?.research||played?.install||played?.triggerTurrets) researchEffect(played.family);
                app.setAttribute('aria-busy', 'true');
                app.querySelectorAll('button').forEach(button => button.disabled = true);
                await new Promise(resolve => setTimeout(resolve, duration));
                app.removeAttribute('aria-busy');
            }
            render(before !== state.phase || !!choosing || action === 'cancel');
            if (state.phase === 'battle') {
                combatEffects(effects);
                if (action==='fusion-confirm')researchEffect('multimodal');else if(played?.research||played?.install||played?.triggerTurrets) researchEffect(played.family);
            }
            if (state.phase === 'battle') {
                const cue = action === 'end' ? (state.hp < oldHp ? 'hit' : effects.some(e => e.kind === 'evade') ? 'evade' : 'block') : played ? (played.damage || played.shieldStrike || played.heatTick || played.heatBurst ? 'attack' : played.heal ? 'heal' : played.evade ? 'evade' : 'block') : action==='fusion-confirm' ? 'attack' : 'idle';
                if (cue !== 'idle') animateBattle(cue);
            }
            announce(state.phase === 'battle' ? `${effects.map(e => `${e.target === 'player' ? 'Mochi' : 'Enemy'}: ${e.amount} ${e.kind}`).join('. ')}. ${state.log.at(-1)} Energy ${state.battle.energy}, Enemy HP ${state.battle.enemy.hp}.` : state.phase === 'map' ? 'Choose your next route.' : state.phase === 'reward' ? 'Victory! Choose your reward card.' : 'View updated.');
            if (before === 'battle' && state.phase === 'battle') (app.querySelector('.hand button:not(:disabled)') || app.querySelector('[data-action="end"]'))?.focus({preventScroll:true});
            if (before !== state.phase) {
                const destination = state.phase === 'map' ? app.querySelector('.map-node.available') : app;
                destination?.scrollIntoView({behavior:'instant',block:state.phase === 'map' ? 'center' : 'start'});
            }
        }
        busy = false;
    });
    MochiWallet.subscribe(wallet => { document.querySelectorAll('[data-wallet-balance]').forEach(el => el.textContent = wallet.gold); });
    render();
})();
