/* Deterministic, DOM-free rules for the deck-building expedition. */
(function (root) {
    const CARDS = {
        pulse: { name: 'Vibration Pulse', type: 'attack', cost: 1, damage: 6, up: { damage: 9 }, text: 'Deal {damage} damage.' },
        shield: { name: 'Tactile Shield', type: 'skill', cost: 1, block: 5, up: { block: 8 }, text: 'Gain {block} Block.' },
        scan: { name: 'Sensory Scan', type: 'skill', cost: 0, draw: 1, vulnerable: 1, up: { vulnerable: 2 }, text: 'Draw {draw}. Apply {vulnerable} Vulnerable.' },
        burst: { name: 'Burst Stimulus', type: 'attack', cost: 2, damage: 16, up: { damage: 22 }, text: 'Deal {damage} damage.' },
        echo: { name: 'Double Pulse', type: 'attack', cost: 1, damage: 4, hits: 2, up: { damage: 6 }, text: 'Deal {damage} damage twice. Amplify applies to each hit.' },
        heat: { name: 'Thermal Afterimage', type: 'skill', cost: 1, burn: 5, up: { burn: 8 }, text: 'Apply {burn} Heat. Deals damage before the enemy acts, then decreases by 1.' },
        cooling: { name: 'Cooling Feedback', type: 'skill', cost: 1, block: 7, weak: 1, up: { block: 10, weak: 2 }, text: 'Gain {block} Block. Apply {weak} Weak.' },
        sync: { name: 'Phase Sync', type: 'skill', cost: 0, energy: 1, draw: 1, exhaust: true, up: { draw: 2 }, text: 'Gain {energy} Energy. Draw {draw}. Exhaust.' },
        amplify: { name: 'Signal Amplifier', type: 'power', cost: 1, strength: 2, exhaust: true, up: { strength: 3 }, text: 'Gain {strength} Amplify for this battle. Adds damage to every hit. Exhaust.' },
        adapt: { name: 'Sensory Retuning', type: 'skill', cost: 1, block: 4, draw: 2, up: { block: 7 }, text: 'Gain {block} Block. Draw {draw}.' },
        phantom: { name: 'Phantom Motion', type: 'attack', cost: 1, damage: 7, vulnerable: 2, up: { damage: 10 }, text: 'Deal {damage} damage, then apply {vulnerable} Vulnerable.' },
        overload: { name: 'Overload', type: 'attack', cost: 2, damage: 25, self: 3, up: { damage: 32 }, text: 'Deal {damage} damage. Lose {self} HP.' },
        threshold: { name: 'Threshold Control', type: 'skill', cost: 2, block: 17, up: { block: 23 }, text: 'Gain {block} Block.' },
        feedback: { name: 'Feedback Loop', type: 'attack', cost: 1, damage: 5, draw: 1, up: { damage: 8 }, text: 'Deal {damage} damage. Draw {draw}.' },
        insulate: { name: 'Insulation', type: 'power', cost: 2, armor: 3, exhaust: true, up: { armor: 5 }, text: 'Gain {armor} Block at the start of each turn this battle. Exhaust.' },
        illusion: { name: 'Multimodal Illusion', type: 'skill', cost: 1, burn: 3, weak: 2, up: { burn: 5 }, text: 'Apply {burn} Heat and {weak} Weak.' },
        resonance: { name: 'Resonance Strike', type: 'attack', cost: 2, damage: 10, hits: 2, up: { damage: 14 }, text: 'Deal {damage} damage twice.' },
        recovery: { name: 'Recovery Protocol', type: 'skill', cost: 1, heal: 5, block: 4, exhaust: true, up: { heal: 8, block: 7 }, text: 'Heal {heal} HP. Gain {block} Block. Exhaust.' },
        tactile_brush: { name: 'Tactile Brush', type: 'attack', cost: 1, damage: 3, hits: 3, research: 'brush', up: { damage: 4 }, text: 'Deal {damage} vibration damage three times. Amplify applies to every hit.' },
        funneling: { name: 'Phantom Funneling', type: 'attack', cost: 2, damage: 10, pierce: true, research: 'phantom', up: { damage: 14 }, text: 'Deal {damage} vibration damage, bypassing enemy Block. Block is not consumed.' },
        thermal_referral: { name: 'Thermal Referral', type: 'attack', cost: 2, damage: 6, hits: 2, burn: 2, research: 'referral', up: { damage: 8, burn: 3 }, text: 'Deal {damage} thermal damage twice, then apply {burn} Heat. Amplify applies to both hits.' },
        thermal_masking: { name: 'Thermal Masking', type: 'skill', cost: 2, evade: 1, counter: 8, exhaust: true, research: 'masking', up: { counter: 12 }, text: 'Prepare Evasion: avoid the next incoming hit, then counter for {counter} damage. Persists until triggered. Evasion does not stack; the strongest counter is kept. Exhaust.' },
        thermic_vib: { name: 'ThermicVib Fusion', type: 'attack', cost: 2, damage: 7, burn: 3, block: 4, research: 'fusion', up: { damage: 10, burn: 5, block: 6 }, text: 'Deal {damage} damage, apply {burn} Heat, and gain {block} Block.' },
        pseudo_haptic: { name: 'Pseudo-Haptic Shift', type: 'skill', cost: 1, evade: 1, draw: 1, exhaust: true, research: 'pseudo', up: { draw: 2 }, text: 'Prepare Evasion: avoid the next incoming hit. Draw {draw}. Evasion persists until triggered and does not stack. Keeps any prepared counter. Exhaust.' }

    };
    const ARCHETYPES = {
        vibration: { name: 'Vibration', subtitle: 'Multi-hit · Amplify', description: 'Chain small hits and amplify each one for explosive damage.', cards: ['pulse','pulse','tactile_brush','funneling','shield','shield','shield','shield','echo','scan'] },
        thermal: { name: 'Thermal', subtitle: 'Heat stacks · Defense', description: 'Build lingering heat damage and stay safe behind cooling defenses.', cards: ['pulse','thermal_referral','thermal_masking','shield','shield','shield','shield','heat','heat','cooling'] },
        multimodal: { name: 'Multimodal', subtitle: 'Card cycling · Vulnerable', description: 'Cycle cards, expose vulnerabilities, and connect your attacks.', cards: ['pulse','thermic_vib','pseudo_haptic','shield','shield','shield','scan','scan','phantom','adapt'] }
    };
    const families = { vibration:['pulse','burst','echo','amplify','overload','resonance','tactile_brush','funneling'], thermal:['heat','cooling','insulate','recovery','thermal_referral','thermal_masking'], multimodal:['scan','sync','adapt','phantom','illusion','feedback','thermic_vib','pseudo_haptic'], shared:['shield','threshold'] };
    for (const [family, ids] of Object.entries(families)) for (const id of ids) CARDS[id].family = family;
    // Ten distinct starter cards per field. Legacy IDs remain valid for saved runs.
    const BASIC_CARDS = {
        vibration: [
            ['strike','Contact Pulse',{damage:6},'Deal {damage} damage.',{damage:9}],
            ['guard','Damping Pad',{block:5},'Gain {block} Block.',{block:8}],
            ['echo','Pulse Pair',{damage:3,hits:2},'Deal {damage} damage twice.',{damage:5}],
            ['drive','Actuator Drive',{strength:1,exhaust:true,type:'power'},'Gain {strength} Amplify this battle. Exhaust.',{strength:2}],
            ['resonance','Resonant Burst',{damage:13,cost:2},'Deal {damage} damage.',{damage:18}],
            ['probe','Frequency Probe',{damage:4,weak:1},'Deal {damage} damage. Apply {weak} Weak.',{damage:7}],
            ['focus','Steady Rhythm',{morale:2,exhaust:true},'Gain Morale for {morale} turns: attack damage +25%. Exhaust.',{morale:3}],
            ['relay','Signal Relay',{block:4,draw:1},'Gain {block} Block. Draw {draw}.',{block:7}],
            ['disrupt','Threshold Scan',{vulnerable:1,draw:1,cost:0,exhaust:true},'Apply {vulnerable} Vulnerable. Draw {draw}. Exhaust.',{vulnerable:2}],
            ['retune','Fast Retuning',{block:3,energy:1,cost:0,exhaust:true},'Gain {block} Block and {energy} Energy. Exhaust.',{block:6}]
        ],
        thermal: [
            ['strike','Warm Contact',{damage:5,burn:1},'Deal {damage} damage. Apply {burn} Heat.',{damage:8}],
            ['guard','Thermal Barrier',{block:6},'Gain {block} Block.',{block:9}],
            ['ember','Residual Warmth',{burn:4},'Apply {burn} Heat.',{burn:6}],
            ['cool','Cooling Contact',{block:4,weak:1},'Gain {block} Block. Apply {weak} Weak.',{block:7}],
            ['soak','Heat Soak',{damage:10,burn:3,cost:2},'Deal {damage} damage. Apply {burn} Heat.',{damage:14,burn:4}],
            ['insulate','Insulating Layer',{armor:1,type:'power',exhaust:true},'Gain {armor} Block at the start of each turn this battle. Exhaust.',{armor:2}],
            ['monitor','Temperature Scan',{draw:1,block:3},'Draw {draw}. Gain {block} Block.',{draw:2}],
            ['focus','Comfort Zone',{morale:2,block:3},'Gain {block} Block and Morale for {morale} turns: attack damage +25%.',{block:5}],
            ['recover','Thermal Recovery',{heal:3,block:3,exhaust:true},'Heal {heal} HP. Gain {block} Block. Exhaust.',{heal:5}],
            ['power','Heat Budget',{energy:1,cost:0,exhaust:true},'Gain {energy} Energy. Exhaust.',{energy:2}]
        ],
        multimodal: [
            ['strike','Combined Signal',{damage:6},'Deal {damage} damage.',{damage:9}],
            ['guard','Sensory Buffer',{block:5},'Gain {block} Block.',{block:8}],
            ['scan','Cue Alignment',{draw:1,vulnerable:1},'Draw {draw}. Apply {vulnerable} Vulnerable.',{draw:2}],
            ['pair','Paired Feedback',{damage:4,block:4},'Deal {damage} damage. Gain {block} Block.',{damage:6,block:6}],
            ['warm','Warm Pulse',{damage:4,burn:2},'Deal {damage} damage. Apply {burn} Heat.',{burn:4}],
            ['gate','Sensory Gate',{weak:1,block:4},'Apply {weak} Weak. Gain {block} Block.',{weak:2}],
            ['focus','Cue Confidence',{morale:2,draw:1},'Draw {draw}. Gain Morale for {morale} turns: attack damage +25%.',{morale:3}],
            ['sync','Synchronized Input',{energy:1,draw:1,cost:0,exhaust:true},'Gain {energy} Energy. Draw {draw}. Exhaust.',{draw:2}],
            ['integrate','Cue Integration',{damage:11,draw:1,cost:2},'Deal {damage} damage. Draw {draw}.',{damage:16}],
            ['retune','Crossmodal Retuning',{block:3,draw:1},'Gain {block} Block. Draw {draw}.',{block:6}]
        ],
        generation: [
            ['prompt','Prompt Pulse',{damage:6},'Deal {damage} damage.',{damage:9}],
            ['guard','Output Stabilizer',{block:5},'Gain {block} Block.',{block:8}],
            ['sample','Candidate Sampling',{draw:2,block:2},'Draw {draw}. Gain {block} Block.',{block:5}],
            ['denoise','Denoising Step',{block:5,weak:1},'Gain {block} Block. Apply {weak} Weak.',{block:8}],
            ['guide','Guidance Signal',{damage:4,vulnerable:1},'Deal {damage} damage. Apply {vulnerable} Vulnerable.',{damage:7}],
            ['latent','Latent Prior',{strength:1,draw:1,type:'power',exhaust:true},'Gain {strength} Amplify. Draw {draw}. Exhaust.',{strength:2}],
            ['inference','Fast Inference',{energy:1,draw:1,cost:0,exhaust:true},'Gain {energy} Energy. Draw {draw}. Exhaust.',{draw:2}],
            ['refine','Iterative Refinement',{damage:2,hits:3},'Deal {damage} damage three times.',{damage:3}],
            ['align','Preference Alignment',{morale:2,block:4},'Gain {block} Block and Morale for {morale} turns: attack damage +25%.',{morale:3}],
            ['repair','Signal Reconstruction',{heal:3,block:3,exhaust:true},'Heal {heal} HP. Gain {block} Block. Exhaust.',{heal:5}]
        ]
    };
    ARCHETYPES.generation = { name:'HapticGeneration', subtitle:'Generation · Refinement · Morale', description:'Generate haptic signals with AI. Sample candidates, refine outputs, and build Morale.', cards:[] };
    for (const c of Object.values(CARDS)) c.rarity = c.research ? 'special' : 'legacy';
    for (const [family, definitions] of Object.entries(BASIC_CARDS)) {
        ARCHETYPES[family].cards = definitions.map(([key,name,values,text,up]) => {
            const id = `${family}_${key}`;
            CARDS[id] = { name, type:values.damage ? 'attack' : 'skill', cost:1, ...values, family, rarity:'basic', text, up };
            return id;
        });
    }
    // Source concepts and game adaptations are deliberately described separately.
    // Search links avoid inventing unverified DOI identifiers.
    const findPaper = title => 'https://scholar.google.com/scholar?q=' + encodeURIComponent(title);
    const RESEARCH = {
        brush: { title: 'Tactile Brush: Drawing on Skin with a Tactile Grid Display', citation: 'Israr & Poupyrev · CHI 2011', concept: 'Timed vibrotactile actuators can create apparent motion across the skin.', adaptation: 'A moving tactile stroke becomes three sequential strikes.', link: findPaper('Tactile Brush Drawing on Skin with a Tactile Grid Display'), linkLabel: 'Find publication' },
        phantom: { title: 'Information Transmission by Phantom Sensations', citation: 'Alles · 1970', concept: 'Multiple tactile stimuli can produce a perceived location between the physical stimulation sites.', adaptation: 'An illusory attack location becomes a strike that bypasses armor.', link: findPaper('Information Transmission by Phantom Sensations Alles'), linkLabel: 'Find publication' },
        referral: { title: 'Thermal Crossing: Palm-Free Thermal Rendering with Thermal Illusions', citation: 'Yi, Yi & Yoon · ISWC 2026', concept: 'Thermal referral motivates rendering warmth beyond the directly heated contact sites.', adaptation: 'Redistributed warmth becomes two thermal strikes followed by lingering Heat. Two strikes are a game rule, not an experimental result.', link: 'https://dl.acm.org/doi/abs/10.1145/3830727.3834812', linkLabel: 'Publication page' },
        masking: { title: 'Warm or Cool, Large or Small? The Challenge of Thermal Displays', citation: 'Jones & Ho · IEEE Transactions on Haptics 2008 (review)', concept: 'Thermal display design depends on thermal perception and interactions with other sensory cues.', adaptation: 'Player-proposed Thermal Masking: sensory concealment becomes one avoided hit and a counterattack. This review is background on thermal displays; it does not establish an evasion or counterattack effect.', link: findPaper('Warm or Cool Large or Small The Challenge of Thermal Displays'), linkLabel: 'Find review' },
        fusion: { title: 'ThermicVib: Enabling Dynamic Thermal Sensation with Multimodal Haptic Glove for Thermal-Responsive Interaction', citation: 'Yi, Lee & Yoon · ISMAR 2024', concept: 'Combining thermal and vibrotactile feedback motivates a multimodal thermal interaction.', adaptation: 'One card combines direct damage, lingering Heat, and defense.', link: 'https://thermicvib.hcitech.org/', linkLabel: 'Project page' },
        pseudo: { title: 'Pseudo-Haptic Feedback: Can Isometric Input Devices Simulate Force Feedback?', citation: 'Lécuyer et al. · IEEE VR 2000', concept: 'Visual feedback and input mapping can contribute to perceived haptic properties.', adaptation: 'A perceptual shift becomes evasion and card cycling. Avoiding damage is a fictional mechanic.', link: findPaper('Pseudo-Haptic Feedback Can Isometric Input Devices Simulate Force Feedback'), linkLabel: 'Find publication' }
    };
    const paperCatalog = typeof module !== 'undefined' && module.exports ? require('./haptic-paper-cards.js') : root.HapticPaperCards;
    if (!paperCatalog) throw new Error('Paper card catalog must load before the rules engine');
    // Keep old prototype IDs playable, but only field specials enter rewards.
    for (const c of Object.values(CARDS)) if (c.rarity === 'special') c.rarity = 'legacy';
    Object.assign(RESEARCH, paperCatalog.papers);
    Object.assign(CARDS, paperCatalog.cards);
    // Retired IDs are retained only so old saves can be migrated safely.
    const RETIRED_NEUTRALS = Object.keys(CARDS).filter(id=>CARDS[id].rarity==='neutral');
    for (const id of RETIRED_NEUTRALS) CARDS[id].rarity='legacy';
    for (const [family, a] of Object.entries(ARCHETYPES)) a.specialCards = Object.keys(CARDS).filter(id => CARDS[id].family === family && CARDS[id].rarity === 'special');
    const themes = typeof module !== 'undefined' && module.exports ? require('./haptic-deck-themes.js') : root.HapticDeckThemes;
    if (!themes) throw new Error('Deck themes must load before the rules engine');
    for (const [id,spec] of Object.entries({...themes.basics,...themes.specials})) {
        const old = CARDS[id];
        CARDS[id] = { name:old.name, family:old.family, rarity:old.rarity, ...(old.research ? {research:old.research} : {}), ...spec };
    }
    Object.assign(ARCHETYPES.vibration, {subtitle:'Shield · Tank · Retaliation',description:'Build Block, retain protection, and turn incoming hits into counterattacks.'});
    Object.assign(ARCHETYPES.thermal, {subtitle:'Heat · Damage over time',description:'Stack Heat, preserve its intensity, and trigger repeated damage without consuming it.'});
    Object.assign(ARCHETYPES.multimodal, {subtitle:'Choose two · Fuse · Attack & defend',description:'Select two hand cards and fuse their material values into one combined attack and shield.'});
    Object.assign(ARCHETYPES.generation, {subtitle:'Install · Turrets · Automation',description:'Deploy up to three persistent turrets. Build an automated attack and defense network.'});
    const P=typeof module!=='undefined'&&module.exports?require('./haptic-paper-protocols.js'):root.HapticPaperProtocols;
    if(!P)throw new Error('Research protocols must load before the engine');
    const TURRETS = {
        pulse:{name:'Pulse Sentry',symbol:'⌁'},shield:{name:'Shield Projector',symbol:'◈'},rail:{name:'Rail Sentry',symbol:'↗'},
        scatter:{name:'Scatter Sentry',symbol:'⋔'},suppressor:{name:'Suppressor',symbol:'≈'},repair:{name:'Repair Station',symbol:'+'},
        bastion:{name:'Bastion',symbol:'▣'},supply:{name:'Supply Relay',symbol:'⚡'},recon:{name:'Recon Scanner',symbol:'⌕'}
    };
    const TURRET_LIMIT = 3;
    const turretCap = type => ['supply','recon','suppressor'].includes(type) ? 3 : type === 'repair' ? 4 : 20;
    const RELICS = {
        cushion:{name:'Geomagic Touch',device:'force-arm',text:'Start each battle with 5 Block and retain 25% of remaining Block between turns.'},
        battery:{name:'Novint Falcon',device:'parallel-arm',text:'The first turret installed each battle activates immediately once, then keeps its normal turn-end activation.'},
        lens:{name:'Haptuator',device:'tactor',text:'Start each battle with 2 permanent Retaliation: counter each incoming hit that is not evaded.'},
        thermos:{name:'Peltier Thermode',device:'thermode',text:'Start each battle with 3 enemy Heat. Every Heat application gains +1 Heat.'},
        notebook:{name:'Electrotactile Array',device:'array',text:'Every fusion gains +2 damage and +2 Block. Draw one extra card on the first turn.'},
        moss:{name:'SenseGlove',device:'glove',text:'The first counterattack each turn heals 1 HP. Heal 4 HP after winning a battle.'}
    };
    const ENEMIES = {
        static: { name: 'Noise Slime', hp: 30, art: 'slime', color: 'moss', intent: [{ damage: 6 }, { damage: 9 }, { damage: 5, block: 5 }], description: 'A mischievous blob of signal noise.' },
        beetle: { name: 'Vibration Beetle', hp: 35, art: 'beetle', color: 'amber', intent: [{ damage: 5, block: 6 }, { damage: 7, hits: 2 }, { block: 9, strength: 1 }], description: 'An armored shell hides a dangerous multi-hit attack.' },
        wisp: { name: 'Thermal Wisp', hp: 32, art: 'wisp', color: 'rose', intent: [{ damage: 8 }, { damage: 4, strength: 2 }, { damage: 12 }], description: 'Its attacks grow fiercer as heat builds up.' },
        sentinel: { name: 'Threshold Sentinel', hp: 59, art: 'golem', color: 'amber', elite: true, intent: [{ block: 9, strength: 2 }, { damage: 12 }, { damage: 7, hits: 2 }], description: 'Strike during its preparation, then brace for heavy hits.' },
        specter: { name: 'Adaptation Specter', hp: 55, art: 'wisp', color: 'violet', elite: true, intent: [{ damage: 10 }, { damage: 6, hits: 2 }, { damage: 8, strength: 2 }], description: 'Adapts over time and grows increasingly dangerous.' },
        boss: { name: 'Sensory Devourer', hp: 108, art: 'boss', color: 'violet', intent: [{ damage: 11 }, { block: 10, strength: 2 }, { damage: 7, hits: 2 }, { damage: 18 }], description: 'Awakens once below half HP, gaining 3 Amplify. Prepare for a long battle.' }
    };
    const TYPES = ['combat', 'elite', 'camp', 'treasure', 'event', 'boss'];
    function random(s) { s.seed = (Math.imul(1664525, s.seed) + 1013904223) >>> 0; return s.seed / 4294967296; }
    function shuffle(s, values) {
        const a = [...values];
        for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(random(s) * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
        return a;
    }
    function card(id, upgraded = false) {
        const base = CARDS[id];
        if (!base) throw new Error('Unknown card');
        return { ...base, ...(upgraded ? base.up : {}), id, upgraded };
    }
    function cardText(c) { return c.text.replace(/\{(\w+)\}/g, (_, key) => String(c[key] || 0)); }
    function makeMap(s) {
        const layout = [['combat'], ['combat', 'event'], ['elite', 'combat', 'treasure'], ['camp', 'camp'], ['combat', 'elite'], ['camp', 'treasure'], ['boss']];
        return layout.map((types, floor) => types.map((type, col) => {
            const next = floor === 0 ? [0, 1] : floor === 1 ? (col === 0 ? [0, 1] : [1, 2])
                : floor === 2 ? (col === 0 ? [0] : col === 2 ? [1] : [0, 1]) : floor === 5 ? [0] : [0, 1];
            const pool = type === 'elite' ? ['sentinel', 'specter'] : ['static', 'beetle', 'wisp'];
            return { id: `${floor}-${col}`, type, floor, col, next: floor === 6 ? [] : next.map(n => `${floor + 1}-${n}`), enemy: type === 'boss' ? 'boss' : pool[Math.floor(random(s) * pool.length)] };
        }));
    }
    function create(seed = Date.now(), archetype = 'vibration') {
        if (!ARCHETYPES[archetype]) archetype = 'vibration';
        const s = { version: 1, runId: `research-${seed}`, archetype, seed: seed >>> 0, phase: 'map', hp: 72, maxHp: 72, gold: 0, relics: [{vibration:'cushion',thermal:'thermos',multimodal:'notebook',generation:'battery'}[archetype]], deck: [], map: [], path: [], available: ['0-0'], battle: null, reward: null, node: null, wins: 0, log: [] };
        s.log = ['Expedition started. Choose your first route.'];
        s.deck = ARCHETYPES[archetype].cards.map(id => ({ id, upgraded: false }));
        s.map = makeMap(s);
        return s;
    }
    function note(s, text) { s.log = [...s.log.slice(-7), text]; }
    function draw(s, count) {
        const b = s.battle;
        for (let i = 0; i < count && b.hand.length < 10; i++) {
            if (!b.draw.length) { b.draw = shuffle(s, b.discard); b.discard = []; }
            if (!b.draw.length) break;
            b.hand.push(b.draw.pop());
        }
    }
    function intent(s) {
        const b = s.battle, base = ENEMIES[b.enemy.id].intent[(b.turn - 1) % ENEMIES[b.enemy.id].intent.length];
        return { ...base, damage: base.damage ? Math.max(0, Math.floor((base.damage + b.enemy.strength) * (b.enemy.weak > 0 ? .75 : 1))) : 0, hits: base.hits || 1 };
    }
    function startBattle(s, enemyId) {
        const source = ENEMIES[enemyId], bonus = s.node.floor >= 4 && !source.elite && enemyId !== 'boss' ? 7 : 0;
        s.phase = 'battle';
        s.battle = { enemy: { id: enemyId, hp: source.hp + bonus, maxHp: source.hp + bonus, block: 0, strength: 0, weak: 0, vulnerable: 0, burn: s.relics.includes('thermos') ? 3 : 0, awakened: false }, turn: 0, energy: 0, block: 0, strength: 0, armor: 0, evade: 0, counter: 0, counterHeat:0, morale: 0, lastFamily: null, retaliate:0, thorns:s.relics.includes('lens')?2:0, retain:s.relics.includes('cushion')?25:0, heatPower:s.relics.includes('thermos')?1:0, heatRetention:0, fusionPower:s.relics.includes('notebook')?2:0, turrets:[], turretSerial:0, queuedEnergy:0, queuedDraw:0, firstInstallUsed:false, counterHealUsed:false, research:{}, researchCue:'balanced', draw: shuffle(s, s.deck.map(c => ({ ...c }))), hand: [], discard: [], exhaust: [], played: 0 };
        note(s, `${source.name} appears.`);
        startTurn(s);
    }
    function startTurn(s,emit=()=>{}) {
        const b = s.battle;
        b.lastFamily = null;
        b.counterHealUsed=false;
        b.turn++; b.energy = 3 + b.queuedEnergy; b.queuedEnergy=0;
        b.block = Math.floor(b.block*b.retain/100) + b.armor + (b.turn === 1 && s.relics.includes('cushion') ? 5 : 0);
        draw(s, 5 + b.queuedDraw + (b.turn === 1 && s.relics.includes('notebook') ? 1 : 0)); b.queuedDraw=0;
        P.startTurn(s,protocolContext(s,emit));
    }
    function visit(s, id) {
        if (s.phase !== 'map' || !s.available.includes(id)) return false;
        const node = s.map.flat().find(n => n.id === id);
        if (!node) return false;
        s.node = node; s.path.push(id); s.available = [];
        if (['combat', 'elite', 'boss'].includes(node.type)) startBattle(s, node.enemy);
        else if (node.type === 'treasure') {
            s.gold += 25; const relic = gainRelic(s); s.reward = { gold: 25, relic, cards: [] }; s.phase = 'treasure';
        } else s.phase = node.type;
        return true;
    }
    function gainRelic(s) {
        const pool = Object.keys(RELICS).filter(id => !s.relics.includes(id));
        if (!pool.length) { s.gold += 30; return null; }
        const id = pool[Math.floor(random(s) * pool.length)]; s.relics.push(id); return id;
    }
    function advance(s) { s.phase = 'map'; s.available = [...s.node.next]; s.reward = null; s.battle = null; }
    function win(s) {
        if (s.phase !== 'battle') return;
        s.wins++;
        if (s.relics.includes('moss')) s.hp = Math.min(s.maxHp, s.hp + 4);
        note(s, `${ENEMIES[s.battle.enemy.id].name} defeated!`);
        if (s.node.type === 'boss') { s.phase = 'victory'; return; }
        const gold = s.node.type === 'elite' ? 38 : 20;
        s.gold += gold;
        const pool = Object.keys(CARDS).filter(id => CARDS[id].rarity === 'special');
        const signature = shuffle(s, pool.filter(id => CARDS[id].family === s.archetype))[0];
        const cards = shuffle(s, [signature, ...shuffle(s, pool.filter(id => id !== signature)).slice(0, 2)]);
        s.reward = { gold, cards, relic: s.node.type === 'elite' ? gainRelic(s) : null }; s.phase = 'reward';
    }
    function check(s) {
        if (s.hp <= 0) { s.hp = 0; s.phase = 'defeat'; note(s, 'The expedition has ended. Try again with a new deck.'); return true; }
        if (s.battle.enemy.hp <= 0) { s.battle.enemy.hp = 0; win(s); return true; }
        const e = s.battle.enemy;
        if (e.id === 'boss' && !e.awakened && e.hp <= e.maxHp / 2) { e.awakened = true; e.strength += 3; note(s, 'The Devourer awakens! Enemy Amplify +3.'); }
        return false;
    }
    function damageEnemy(s, amount, emit, options = {}) {
        const e = s.battle.enemy;
        const absorbed = options.pierce ? 0 : Math.min(e.block, amount);
        e.block -= absorbed;
        const damage = Math.min(Math.max(0, e.hp), amount - absorbed);
        e.hp -= damage;
        if (absorbed) emit({ target: 'enemy', kind: 'absorb', amount: absorbed });
        if (damage) emit({ target: 'enemy', kind: 'damage', amount: damage, ...(options.source ? { source: options.source } : {}) });
        return damage;
    }
    function gainBlock(s,amount,emit){if(amount<=0)return;s.battle.block+=amount;emit({target:'player',kind:'block',amount});P.onBlock(s,amount,protocolContext(s,emit));}
    function protocolContext(s,emit){return {
        emit,block:n=>gainBlock(s,n,emit),heat:n=>applyHeat(s,n,emit),tick:(hooks=true)=>heatTick(s,emit,hooks),
        damage:(n,opts={})=>damageEnemy(s,n,emit,opts),counter:n=>retaliation(s,n,emit),intent:()=>intent(s),
        turretCap,activate:ts=>activateTurrets(s,emit,ts),tag:label=>{note(s,label);emit({target:'player',kind:'research',amount:0,label});},
        retrieve:(kind,n)=>{const b=s.battle;for(const pile of [b.draw,b.discard])for(let i=pile.length-1;i>=0&&n>0&&b.hand.length<10;i--){const c=card(pile[i].id,pile[i].upgraded);if(c.block||c.retaliate||c.armor||c.thorns||c.retain||['vib_mask','vib_boundaries','vib_fiery','vib_gan','vib_texture'].includes(c.protocol)){b.hand.push(pile.splice(i,1)[0]);n--;}}}
    };}
    function cardChoices(s,index){if(s.phase!=='battle'||!s.battle.hand[index])return [];const i=s.battle.hand[index];return P.choices(card(i.id,i.upgraded),s);}
    function playReason(s,index){if(s.phase!=='battle'||!s.battle.hand[index])return 'Unavailable';const i=s.battle.hand[index],c=card(i.id,i.upgraded);if(c.cost>s.battle.energy)return 'Not enough Energy';if(c.install&&s.battle.turrets.length>=TURRET_LIMIT)return 'Turret slots full';if(['gen_chathap','gen_gan'].includes(c.protocol)&&!s.battle.turrets.length)return 'Install a turret first';return '';}
    function applyHeat(s, amount, emit) {
        if (!amount) return;
        const total=amount+s.battle.heatPower;
        s.battle.enemy.burn+=total;
        emit({target:'enemy',kind:'heat',amount:total});P.onHeat(s,total,protocolContext(s,emit));
    }
    function heatTick(s, emit, hooks=true) {
        const raw=hooks?P.heatAmount(s,s.battle.enemy.burn):s.battle.enemy.burn;
        const amount=Math.min(s.battle.enemy.hp,raw);
        if(amount>0){s.battle.enemy.hp-=amount;emit({target:'enemy',kind:'damage',amount,source:'heat'});if(hooks)P.afterTick(s);}
    }
    function turretDescription(t) {
        const p=t.power;
        const programs={gen_hapticgen:`Waveform ${['quiet','peak','tail'][t.phase||0]} · base ${p}`,gen_ldm:`Denoising shield ${p} · +2 per activation`,gen_prompt:t.phase?`Audio → touch · next hit ${p*2}`:'Text → audio · charging',gen_descriptors:`Texture ${t.variant} · ${p}`,gen_texture:`Paired texture · base ${p}`,gen_video:`Intent-change detector · ${p} piercing`,gen_scene:`Scene scaffolding · ${p} Energy or ${p*4} Block`,gen_learning:`Learned renderer · ${t.pending||0} new patterns`};
        if(t.program)return programs[t.program];
        return {pulse:`${p} damage`,shield:`${p} Block`,rail:`${p} piercing damage`,scatter:`${p} damage × 3`,suppressor:`${p} Weak`,repair:`${p} HP`,bastion:`${p} damage + ${p} Block`,supply:`+${p} next-turn Energy`,recon:`+${p} next-turn draw`}[t.type];
    }
    function activateTurrets(s, emit, turrets=s.battle.turrets) {
        const b=s.battle;
        for (const t of turrets) {
            if (b.enemy.hp<=0) break;
            emit({target:'player',kind:'turret',amount:t.power,turret:t.id});
            if(P.turret(s,t,protocolContext(s,emit)))continue;
            if (['pulse','rail','bastion','scatter'].includes(t.type)) for(let hit=0;hit<(t.type==='scatter'?3:1);hit++) damageEnemy(s,t.power,emit,{pierce:t.type==='rail',source:'turret'});
            if (['shield','bastion'].includes(t.type)) { gainBlock(s,t.power,emit); }
            if(t.type==='suppressor') b.enemy.weak+=t.power;
            if(t.type==='repair') { const amount=Math.min(s.maxHp-s.hp,t.power);s.hp+=amount;if(amount)emit({target:'player',kind:'heal',amount}); }
            if(t.type==='supply') b.queuedEnergy=Math.min(30,b.queuedEnergy+t.power);
            if(t.type==='recon') b.queuedDraw=Math.min(30,b.queuedDraw+t.power);
        }
    }
    function scrapTurret(s,id) {
        if(s.phase!=='battle')return false;
        const i=s.battle.turrets.findIndex(t=>t.id===id);
        if(i<0)return false;
        const [t]=s.battle.turrets.splice(i,1);note(s,`${TURRETS[t.type].name} dismantled. Slot freed; no Energy or card is refunded.`);return true;
    }
    function fusionMaterial(c) {
        return {attack:c.fusionAttack ?? ((c.damage||0)*(c.hits||1)+(c.burn||0)),block:c.fusionBlock ?? (c.block||0),burn:c.fuseBurn||0,weak:c.fuseWeak||0,vulnerable:c.fuseVulnerable||0,draw:c.fuseDraw||0,evade:c.fuseEvade||0};
    }
    function fusionPreview(s, indices) {
        if(s.phase!=='battle'||!Array.isArray(indices)||indices.length!==2||indices.some(i=>!Number.isInteger(i))||indices[0]===indices[1])return null;
        const b=s.battle,instances=indices.map(i=>b.hand[i]);if(instances.some(c=>!c))return null;
        const cards=instances.map(c=>card(c.id,c.upgraded));
        if(s.archetype!=='multimodal'&&!cards.some(c=>c.family==='multimodal'))return null;
        const parts=cards.map(fusionMaterial),attack=parts.reduce((n,p)=>n+p.attack,0)+b.fusionPower;
        const result={cost:1,damage:Math.floor((attack+b.strength)*(b.enemy.vulnerable>0?1.5:1)*(b.morale>0?1.25:1)),block:parts.reduce((n,p)=>n+p.block,0)+b.fusionPower,burn:parts.reduce((n,p)=>n+p.burn,0),weak:parts.reduce((n,p)=>n+p.weak,0),vulnerable:parts.reduce((n,p)=>n+p.vulnerable,0),draw:parts.reduce((n,p)=>n+p.draw,0),evade:parts.some(p=>p.evade)?1:0};
        result.notes=[];result.families=cards.map(c=>c.family);
        for(let position=0;position<cards.length;position++)P.preview(s,cards[position],{card:cards[1-position],material:parts[1-position],position:1-position},result);
        P.globalPreview(s,result);return result;
    }
    function fuse(s, indices, emit=()=>{}) {
        const result=fusionPreview(s,indices);if(!result||s.battle.energy<result.cost)return false;
        const b=s.battle,materials=indices.map(i=>b.hand[i]);
        b.energy-=result.cost;[...indices].sort((a,b)=>b-a).forEach(i=>b.hand.splice(i,1));
        for(let h=0;h<(result.hits||1);h++)damageEnemy(s,Math.floor(result.damage/(result.hits||1))+(h===0?result.damage%(result.hits||1):0),emit,{source:'multimodal',pierce:result.pierce});
        gainBlock(s,result.block,emit);
        applyHeat(s,result.burn,emit);b.enemy.weak+=result.weak;b.enemy.vulnerable+=result.vulnerable;
        if(result.evade){b.evade=1;emit({target:'player',kind:'evasion',amount:1});}
        // Material card effects do not also play; draw resolves before materials enter discard.
        draw(s,result.draw);
        for(let i=0;i<materials.length;i++){const instance=materials[i];if(result.returnMaterial===i&&b.hand.length<10)b.hand.push(instance);else(card(instance.id,instance.upgraded).exhaust?b.exhaust:b.discard).push(instance);}
        P.afterFusion(s,result);for(const label of result.notes||[])protocolContext(s,emit).tag(label);
        b.played++;b.lastFamily='multimodal';
        note(s,`Fusion · ${materials.map(c=>card(c.id,c.upgraded).name).join(' + ')} · damage ${result.damage} / Block +${result.block}.`);
        check(s);return true;
    }
    function retaliation(s, amount, emit) {
        if(!amount)return;
        damageEnemy(s,amount,emit,{source:'counter'});
        const b=s.battle;
        if(s.relics.includes('moss')&&!b.counterHealUsed){b.counterHealUsed=true;const healed=Math.min(1,s.maxHp-s.hp);s.hp+=healed;if(healed)emit({target:'player',kind:'heal',amount:healed});}
    }
    function play(s, index, emit = () => {}, choice = null) {
        if (s.phase !== 'battle' || !Number.isInteger(index)) return false;
        const b = s.battle, instance = b.hand[index];
        if (!instance) return false;
        const c = card(instance.id, instance.upgraded), e = b.enemy;
        if(!P.choiceValid(c,s,choice))return false;
        if (c.cost > b.energy || (c.install && (!TURRETS[c.install] || b.turrets.length>=TURRET_LIMIT))) return false;
        b.energy -= c.cost; b.hand.splice(index, 1); b.played++;
        let dealt = 0;
        if (c.heatBurst) {
            const amount = e.burn * c.heatBurst; e.burn = 0;
            dealt += damageEnemy(s, amount, emit, { pierce: true, source: 'thermal' });
        }
        const crossBonus = c.crossBonus && b.lastFamily && b.lastFamily !== c.family ? c.crossBonus : 0;
        if (c.damage || c.shieldStrike) for (let hit = 0; hit < (c.hits || 1); hit++) {
            const amount = Math.floor(((c.damage||0) + (c.shieldStrike?Math.floor(b.block*c.shieldStrike):0) + crossBonus + b.strength) * (e.vulnerable > 0 ? 1.5 : 1) * (b.morale > 0 ? 1.25 : 1));
            dealt += damageEnemy(s, amount, emit, { pierce: c.pierce, source: c.research ? c.family : undefined });
        }
        gainBlock(s,c.block||0,emit); b.energy += c.energy || 0; b.strength += c.strength || 0; b.armor += c.armor || 0;
        applyHeat(s,c.burn||0,emit);
        if(c.heatMultiply){const extra=Math.floor(e.burn*c.heatMultiply/100);e.burn+=extra;if(extra)emit({target:'enemy',kind:'heat',amount:extra});}
        for(let i=0;i<(c.heatTick||0)&&e.hp>0;i++)heatTick(s,emit);
        b.retaliate+=c.retaliate||0;b.thorns+=c.thorns||0;b.retain=Math.min(75,b.retain+(c.retain||0));
        b.heatPower+=c.heatPower||0;b.heatRetention=Math.max(b.heatRetention,c.heatRetention||0);b.fusionPower+=c.fusionPower||0;
        if(c.turretBuff)for(const t of b.turrets)t.power=Math.min(turretCap(t.type),t.power+c.turretBuff);
        if(c.install){
            const t={id:++b.turretSerial,type:c.install,power:Math.min(turretCap(c.install),c.turretPower)};
            P.install(s,t,c,choice);
            b.turrets.push(t);emit({target:'player',kind:'install',amount:t.power,turret:t.id});
            if(s.relics.includes('battery')&&!b.firstInstallUsed){b.firstInstallUsed=true;activateTurrets(s,emit,[t]);}
        }
        for(let i=0;i<(c.triggerTurrets||0)&&e.hp>0;i++)activateTurrets(s,emit);
        e.weak += c.weak || 0; e.vulnerable += c.vulnerable || 0;
        if (c.morale) {
            b.morale = Math.max(b.morale || 0, c.morale);
            emit({ target: 'player', kind: 'morale', amount: c.morale });
        }
        if (c.evade) {
            b.evade = 1;
            b.counter = Math.max(b.counter || 0, c.counter || 0);
            b.counterHeat=Math.max(b.counterHeat,c.counterHeat||0);
            emit({ target: 'player', kind: 'evasion', amount: 1 });
        }
        const healed = Math.min(s.maxHp - s.hp, c.heal || 0);
        if (healed) emit({ target: 'player', kind: 'heal', amount: healed });
        if (c.self) emit({ target: 'player', kind: 'damage', amount: Math.min(s.hp + healed, c.self) });

        if(c.retaliate||c.thorns)emit({target:'player',kind:'retaliation',amount:(c.retaliate||0)+(c.thorns||0)});
        s.hp = s.hp + healed - (c.self || 0);
        P.contextCard(s,c,choice,protocolContext(s,emit));
        b.lastFamily = c.family;
        if (c.draw) draw(s, c.draw);
        // Resolve draw before discarding: a card cannot immediately draw itself.
        (c.exhaust ? b.exhaust : b.discard).push(instance);
        note(s, `${c.name}${instance.upgraded ? '+' : ''}${c.damage || c.shieldStrike || c.heatTick || c.heatBurst ? ` · damage ${dealt}` : ''}${c.block ? ` · Block +${c.block}` : ''}${c.evade ? ` · Evasion ready${b.counter ? ` / counter ${b.counter}` : ''}` : ''}.`);
        check(s); return true;
    }
    function endTurn(s, emit = () => {}) {
        if (s.phase !== 'battle') return false;
        const b=s.battle,e=b.enemy;
        b.discard.push(...b.hand);b.hand=[];
        P.beforeEnd(s,protocolContext(s,emit));if(check(s))return true;
        activateTurrets(s,emit);if(check(s))return true;
        if(e.burn>0){heatTick(s,emit);if(!b.heatRetention&&!P.stopDecay(s))e.burn=Math.max(0,e.burn-1);if(check(s))return true;}
        const move=intent(s);let lost=0;P.beforeEnemy(s,move,protocolContext(s,emit));if(check(s))return true;
        for(let hit=0;hit<move.hits;hit++){
            if(move.damage<=0)continue;
            P.beforeHit(s,move.damage,protocolContext(s,emit));if(check(s))return true;
            if(b.evade){
                b.evade=0;const counter=b.counter,heat=b.counterHeat;b.counter=0;b.counterHeat=0;
                emit({target:'player',kind:'evade',amount:move.damage});
                note(s,`Evaded ${move.damage} damage.`);retaliation(s,counter,emit);applyHeat(s,heat,emit);P.evade(s,protocolContext(s,emit));
            }else{
                const blocked=Math.min(b.block,move.damage);b.block-=blocked;
                const damage=Math.min(s.hp,move.damage-blocked);s.hp-=damage;lost+=damage;
                if(blocked)emit({target:'player',kind:'absorb',amount:blocked});
                if(damage)emit({target:'player',kind:'damage',amount:damage});
                // Dead actors cannot counter or heal themselves back to life.
                if(s.hp<=0){check(s);return true;}
                retaliation(s,b.retaliate+b.thorns,emit);if(e.hp>0)P.afterHit(s,blocked,damage,protocolContext(s,emit));
            }
            if(check(s))return true;
        }
        b.retaliate=0;
        e.weak=Math.max(0,e.weak-1);e.vulnerable=Math.max(0,e.vulnerable-1);
        e.block=move.block||0;e.strength+=move.strength||0;
        if(move.block)emit({target:'enemy',kind:'block',amount:move.block});
        note(s,`Enemy action · HP lost ${lost}${move.block?` · enemy Block +${move.block}`:''}.`);
        b.morale=Math.max(0,b.morale-1);if(!check(s)){startTurn(s,emit);check(s);}return true;
    }
    function reward(s, id = null) {
        if (s.phase !== 'reward' || (id !== null && !s.reward.cards.includes(id))) return false;
        if (id) { s.deck.push({ id, upgraded: false }); note(s, `${CARDS[id].name} acquired.`); }
        advance(s); return true;
    }
    function camp(s, action, index) {
        if (s.phase !== 'camp') return false;
        if (action === 'heal') { const amount = Math.min(s.maxHp - s.hp, 22); s.hp += amount; note(s, `Rest · HP restored: ${amount}.`); }
        else if (action === 'upgrade') {
            const c = s.deck[index]; if (!c || c.upgraded) return false;
            c.upgraded = true; note(s, `${CARDS[c.id].name}+ upgraded.`);
        } else return false;
        advance(s); return true;
    }
    function event(s, action, index) {
        if (s.phase !== 'event') return false;
        if (action === 'heal') { if (s.gold < 15) return false; s.gold -= 15; s.hp = Math.min(s.maxHp, s.hp + 16); note(s, 'Infusion: restored up to 16 HP.'); }
        else if (action === 'remove') { if (!s.deck[index] || s.deck.length <= 5 || s.hp <= 6) return false; s.hp -= 6; const [c] = s.deck.splice(index, 1); note(s, `Signal cleanup · ${CARDS[c.id].name} removed.`); }
        else if (action !== 'leave') return false;
        advance(s); return true;
    }
    function leaveTreasure(s) { if (s.phase !== 'treasure') return false; advance(s); return true; }
    function restore(raw) {
        // Only restore saves this ruleset could have produced; never evaluate stored content.
        try {
            const s = JSON.parse(raw);
            const pile = a => Array.isArray(a) && a.length <= 100 && a.every(c => c && CARDS[c.id] && typeof c.upgraded === 'boolean');
            if (!s || s.version !== 1 || !['map','battle','reward','camp','event','treasure','victory','defeat'].includes(s.phase)) return null;
            if (![s.hp,s.maxHp,s.gold,s.seed,s.wins].every(Number.isFinite) || s.hp < 0 || s.hp > s.maxHp || s.maxHp !== 72 || s.gold < 0 || !pile(s.deck)) return null;
            if (!Array.isArray(s.relics) || s.relics.some(r => !RELICS[r]) || !Array.isArray(s.path) || s.path.length > 7 || !Array.isArray(s.log)) return null;
            if (!Array.isArray(s.map) || s.map.length !== 7 || s.map.some((row, f) => !Array.isArray(row) || row.some((n, c) => n.id !== `${f}-${c}` || n.floor !== f || n.col !== c || !TYPES.includes(n.type) || !ENEMIES[n.enemy] || !Array.isArray(n.next)))) return null;
            const ids = s.map.flat().map(n => n.id);
            if (!Array.isArray(s.available) || [...s.path,...s.available].some(id => !ids.includes(id)) || s.map.flat().some(n => n.next.some(id => !ids.includes(id)))) return null;
            if (typeof s.runId !== 'string' || !s.runId || s.runId.length > 140) s.runId = `legacy-research-${s.seed}`;
            if (!s.archetype) s.archetype = 'vibration';
            if (!ARCHETYPES[s.archetype]) return null;
            if (s.phase !== 'map' && (!s.node || !ids.includes(s.node.id))) return null;
            if (s.phase === 'reward' && (!s.reward || !Array.isArray(s.reward.cards) || s.reward.cards.some(id => !CARDS[id]))) return null;
            if (s.phase === 'treasure' && (!s.reward || (s.reward.relic && !RELICS[s.reward.relic]))) return null;
            if (s.phase === 'battle') {
                const b = s.battle;
                if (!b || !b.enemy || !ENEMIES[b.enemy.id] || ![b.hand,b.draw,b.discard,b.exhaust].every(pile)) return null;
                const defaults={retaliate:0,thorns:0,retain:0,heatPower:0,heatRetention:0,fusionPower:0,counterHeat:0,queuedEnergy:0,queuedDraw:0,turretSerial:0};
                for(const [field,value] of Object.entries(defaults)){
                    if(b[field]===undefined)b[field]=value;
                    const cap=field==='retain'?75:field==='heatRetention'?1:['queuedEnergy','queuedDraw'].includes(field)?30:1000000;
                    if(!Number.isSafeInteger(b[field])||b[field]<0||b[field]>cap)return null;
                }
                for(const field of ['firstInstallUsed','counterHealUsed']){if(b[field]===undefined)b[field]=false;if(typeof b[field]!=='boolean')return null;}
                if(b.turrets===undefined)b.turrets=[];
                if(!Array.isArray(b.turrets)||b.turrets.length>TURRET_LIMIT||b.turrets.some(t=>!t||!Object.hasOwn(TURRETS,t.type)||!Number.isSafeInteger(t.id)||t.id<1||t.id>b.turretSerial||!Number.isInteger(t.power)||t.power<1||t.power>turretCap(t.type))||new Set(b.turrets.map(t=>t.id)).size!==b.turrets.length)return null;
                if(!P.stateValid(b))return null;
                if(b.researchCue===undefined)b.researchCue='balanced';
                if(!['attack','guard','balanced'].includes(b.researchCue))return null;
                const programs=['gen_hapticgen','gen_ldm','gen_prompt','gen_descriptors','gen_texture','gen_video','gen_scene','gen_learning'];
                for(const t of b.turrets){
                    if(t.program!==undefined&&!programs.includes(t.program))return null;
                    if((t.program!==undefined&&t.phase===undefined)||(t.phase!==undefined&&(!Number.isInteger(t.phase)||t.phase<0||t.phase>2)))return null;
                    if(t.program==='gen_descriptors'&&!['rough','bumpy','slippery'].includes(t.variant))return null;
                    if(t.pending!==undefined&&(!Number.isInteger(t.pending)||t.pending<0||t.pending>3))return null;
                    if(t.seen!==undefined&&(!Array.isArray(t.seen)||t.seen.length>6||t.seen.some(f=>!['vibration','thermal','multimodal','generation','shared','neutral'].includes(f))))return null;
                    if(t.lastEvent!==undefined&&(typeof t.lastEvent!=='string'||t.lastEvent.length>30))return null;
                }
                for (const field of ['evade','counter','morale']) {
                    if (b[field] === undefined) b[field] = 0;
                    if (!Number.isInteger(b[field]) || b[field] < 0 || b[field] > (field === 'evade' ? 1 : field === 'counter' ? 100 : 100)) return null;
                }
                if ((b.counter || b.counterHeat) && !b.evade) return null;
                if (b.lastFamily === undefined) b.lastFamily = null;
                if (b.lastFamily !== null && !['vibration','thermal','multimodal','generation','neutral','shared'].includes(b.lastFamily)) return null;
                if (![b.turn,b.energy,b.block,b.strength,b.armor,b.enemy.hp,b.enemy.maxHp,b.enemy.block,b.enemy.strength,b.enemy.weak,b.enemy.vulnerable,b.enemy.burn].every(n => Number.isFinite(n) && n >= 0)) return null;
            }
            let migrated=false;
            const replaceRetired = c => {
                if(!RETIRED_NEUTRALS.includes(c.id))return c;
                migrated=true;
                const slot={neutral_crossing:0,neutral_bow:0,thermic_vib:1,neutral_xr:2}[c.id];
                return {...c,id:ARCHETYPES[s.archetype].cards[slot]};
            };
            s.deck=s.deck.map(replaceRetired);
            if(s.battle)for(const field of ['hand','draw','discard','exhaust'])if(Array.isArray(s.battle[field]))s.battle[field]=s.battle[field].map(replaceRetired);
            if(s.reward?.cards){
                const used=new Set(s.reward.cards.filter(id=>!RETIRED_NEUTRALS.includes(id)));
                s.reward.cards=s.reward.cards.map(id=>{
                    if(!RETIRED_NEUTRALS.includes(id))return id;
                    migrated=true;
                    const replacement=[...ARCHETYPES[s.archetype].specialCards,...Object.keys(CARDS).filter(k=>CARDS[k].rarity==='special')].find(k=>!used.has(k));
                    used.add(replacement);return replacement;
                });
            }
            if(migrated)note(s,'Retired Neutral cards were replaced with matching starter basics; retired reward choices were replaced with field specials.');
            if (s.log.some(text => /[\uac00-\ud7af]/.test(String(text)))) s.log = ['Expedition resumed. Your deck and progress are unchanged.'];
            return s;
        } catch { return null; }
    }
    const api = { cardChoices, playReason, researchStatus:P.status, TURRETS, TURRET_LIMIT, turretDescription, fusionMaterial, fusionPreview, fuse, scrapTurret, CARDS, RESEARCH, ARCHETYPES, RELICS, ENEMIES, create, card, cardText, visit, play, endTurn, intent, reward, camp, event, leaveTreasure, restore };
    if (typeof module !== 'undefined' && module.exports) module.exports = api;
    else root.HapticRun = api;
})(globalThis);
