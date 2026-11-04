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
        recovery: { name: 'Recovery Protocol', type: 'skill', cost: 1, heal: 5, block: 4, exhaust: true, up: { heal: 8, block: 7 }, text: 'Heal {heal} HP. Gain {block} Block. Exhaust.' }
    };
    const ARCHETYPES = {
        vibration: { name: 'Vibration', subtitle: 'Multi-hit · Amplify', description: 'Chain small hits and amplify each one for explosive damage.', cards: ['pulse','pulse','pulse','pulse','shield','shield','shield','shield','echo','scan'] },
        thermal: { name: 'Thermal', subtitle: 'Heat stacks · Defense', description: 'Build lingering heat damage and stay safe behind cooling defenses.', cards: ['pulse','pulse','pulse','shield','shield','shield','shield','heat','heat','cooling'] },
        multimodal: { name: 'Multimodal', subtitle: 'Card cycling · Vulnerable', description: 'Cycle cards, expose vulnerabilities, and connect your attacks.', cards: ['pulse','pulse','pulse','shield','shield','shield','scan','scan','phantom','adapt'] }
    };
    const families = { vibration:['pulse','burst','echo','amplify','overload','resonance'], thermal:['heat','cooling','insulate','recovery'], multimodal:['scan','sync','adapt','phantom','illusion','feedback'], shared:['shield','threshold'] };
    for (const [family, ids] of Object.entries(families)) for (const id of ids) CARDS[id].family = family;
    const RELICS = {
        cushion: { name: 'Gel Cushion', text: 'Gain 5 Block on the first turn of each battle.' },
        battery: { name: 'Spare Battery', text: 'Gain 1 extra Energy on the first turn of each battle.' },
        lens: { name: 'Calibration Lens', text: 'Start each battle with 1 Amplify.' },
        thermos: { name: 'Residual Heat Capsule', text: 'Apply 3 Heat when a battle begins.' },
        notebook: { name: 'Lab Notebook', text: 'Draw 1 extra card on the first turn of each battle.' },
        moss: { name: 'Healing Moss', text: 'Heal 5 HP after winning a battle.' }
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
        const s = { version: 1, runId: `research-${seed}`, archetype, seed: seed >>> 0, phase: 'map', hp: 72, maxHp: 72, gold: 0, relics: ['cushion'], deck: [], map: [], path: [], available: ['0-0'], battle: null, reward: null, node: null, wins: 0, log: [] };
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
        s.battle = { enemy: { id: enemyId, hp: source.hp + bonus, maxHp: source.hp + bonus, block: 0, strength: 0, weak: 0, vulnerable: 0, burn: s.relics.includes('thermos') ? 3 : 0, awakened: false }, turn: 0, energy: 0, block: 0, strength: s.relics.includes('lens') ? 1 : 0, armor: 0, draw: shuffle(s, s.deck.map(c => ({ ...c }))), hand: [], discard: [], exhaust: [], played: 0 };
        note(s, `${source.name} appears.`);
        startTurn(s);
    }
    function startTurn(s) {
        const b = s.battle;
        b.turn++; b.energy = 3 + (b.turn === 1 && s.relics.includes('battery') ? 1 : 0);
        b.block = b.armor + (b.turn === 1 && s.relics.includes('cushion') ? 5 : 0);
        draw(s, 5 + (b.turn === 1 && s.relics.includes('notebook') ? 1 : 0));
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
        if (s.relics.includes('moss')) s.hp = Math.min(s.maxHp, s.hp + 5);
        note(s, `${ENEMIES[s.battle.enemy.id].name} defeated!`);
        if (s.node.type === 'boss') { s.phase = 'victory'; return; }
        const gold = s.node.type === 'elite' ? 38 : 20;
        s.gold += gold;
        const pool = Object.keys(CARDS).filter(id => !['pulse', 'shield'].includes(id));
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
    function play(s, index, emit = () => {}) {
        if (s.phase !== 'battle' || !Number.isInteger(index)) return false;
        const b = s.battle, instance = b.hand[index];
        if (!instance) return false;
        const c = card(instance.id, instance.upgraded), e = b.enemy;
        if (c.cost > b.energy) return false;
        b.energy -= c.cost; b.hand.splice(index, 1); b.played++;
        let dealt = 0;
        if (c.damage) for (let hit = 0; hit < (c.hits || 1); hit++) {
            const amount = Math.floor((c.damage + b.strength) * (e.vulnerable > 0 ? 1.5 : 1));
            const absorbed = Math.min(e.block, amount); e.block -= absorbed;
            const damage = Math.min(e.hp, amount - absorbed); e.hp -= damage; dealt += damage;
            if (absorbed) emit({ target: 'enemy', kind: 'absorb', amount: absorbed });
            if (damage) emit({ target: 'enemy', kind: 'damage', amount: damage });
        }
        b.block += c.block || 0; b.energy += c.energy || 0; b.strength += c.strength || 0; b.armor += c.armor || 0;
        e.burn += c.burn || 0; e.weak += c.weak || 0; e.vulnerable += c.vulnerable || 0;
        const healed = Math.min(s.maxHp - s.hp, c.heal || 0);
        if (healed) emit({ target: 'player', kind: 'heal', amount: healed });
        if (c.self) emit({ target: 'player', kind: 'damage', amount: Math.min(s.hp + healed, c.self) });
        if (c.block) emit({ target: 'player', kind: 'block', amount: c.block });
        if (c.burn) emit({ target: 'enemy', kind: 'heat', amount: c.burn });
        s.hp = s.hp + healed - (c.self || 0);
        if (c.draw) draw(s, c.draw);
        // Resolve draw before discarding: a card cannot immediately draw itself.
        (c.exhaust ? b.exhaust : b.discard).push(instance);
        note(s, `${c.name}${instance.upgraded ? '+' : ''}${c.damage ? ` · damage ${dealt}` : ''}${c.block ? ` · Block +${c.block}` : ''}.`);
        check(s); return true;
    }
    function endTurn(s, emit = () => {}) {
        if (s.phase !== 'battle') return false;
        const b = s.battle, e = b.enemy;
        b.discard.push(...b.hand); b.hand = [];
        // Heat bypasses armor. A heat kill cancels the enemy intent.
        if (e.burn > 0) { note(s, `Heat damage: ${e.burn}.`); emit({ target: 'enemy', kind: 'damage', amount: Math.min(e.hp, e.burn), source: 'heat' }); e.hp -= e.burn; e.burn--; if (check(s)) return true; }
        const move = intent(s);
        let lost = 0;
        for (let hit = 0; hit < move.hits; hit++) {
            const blocked = Math.min(b.block, move.damage); b.block -= blocked;
            const damage = Math.min(Math.max(0, s.hp - lost), move.damage - blocked);
            if (blocked) emit({ target: 'player', kind: 'absorb', amount: blocked });
            if (damage) emit({ target: 'player', kind: 'damage', amount: damage });
            lost += move.damage - blocked;
        }
        s.hp -= lost; e.weak = Math.max(0, e.weak - 1); e.vulnerable = Math.max(0, e.vulnerable - 1);
        // Enemy armor lasts through the next player turn, then is replaced.
        if (move.block) emit({ target: 'enemy', kind: 'block', amount: move.block });
        e.block = move.block || 0; e.strength += move.strength || 0;
        note(s, `Enemy action · HP lost ${lost}${move.block ? ` · enemy Block +${move.block}` : ''}${move.strength ? ` · enemy Amplify +${move.strength}` : ''}.`);
        if (!check(s)) startTurn(s);
        return true;
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
                if (![b.turn,b.energy,b.block,b.strength,b.armor,b.enemy.hp,b.enemy.maxHp,b.enemy.block,b.enemy.strength,b.enemy.weak,b.enemy.vulnerable,b.enemy.burn].every(n => Number.isFinite(n) && n >= 0)) return null;
            }
            if (s.log.some(text => /[\uac00-\ud7af]/.test(String(text)))) s.log = ['Expedition resumed. Your deck and progress are unchanged.'];
            return s;
        } catch { return null; }
    }
    const api = { CARDS, ARCHETYPES, RELICS, ENEMIES, create, card, cardText, visit, play, endTurn, intent, reward, camp, event, leaveTreasure, restore };
    if (typeof module !== 'undefined' && module.exports) module.exports = api;
    else root.HapticRun = api;
})(globalThis);
