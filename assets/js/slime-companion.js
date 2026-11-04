/* A page companion: discover real borders, walk on them, and carry by long press. */
(() => {
    const KEY = "tomhy_fluffy_slime_v1";
    const SIZE = 64;
    const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)");
    let saved = {};
    try { saved = JSON.parse(localStorage.getItem(KEY) || "{}") || {}; } catch { /* Optional storage. */ }
    const clamp = (n, low, high) => Math.max(low, Math.min(high, n));
    const stat = (key, fallback) => Number.isFinite(saved[key]) ? clamp(saved[key], 0, 100) : fallback;
    const state = { hunger: stat("hunger", 80), joy: stat("joy", 85), energy: stat("energy", 90), sleeping: false };
    const host = document.createElement("div");
    host.className = "slime-companion";
    host.innerHTML = `
      <button class="fluffy-pet" type="button" aria-label="Mochi the slime. Click to care, or hold to carry." aria-expanded="false" aria-controls="slime-care">
        <span class="fluffy-shadow" aria-hidden="true"></span><span class="fluffy-body" aria-hidden="true">
          <svg class="mochi-art" viewBox="0 0 120 105" fill="none" xmlns="http://www.w3.org/2000/svg" focusable="false">
            <defs>
              <radialGradient id="mochi-jelly" cx=".37" cy=".22" r=".88">
                <stop stop-color="#fbfff3"/><stop offset=".35" stop-color="#dceebd"/><stop offset=".72" stop-color="#b9d68f"/><stop offset="1" stop-color="#ecf6d8"/>
              </radialGradient>
              <radialGradient id="mochi-bubble" cx=".3" cy=".25" r=".8">
                <stop stop-color="#fff" stop-opacity=".98"/><stop offset=".4" stop-color="#e9f6cf" stop-opacity=".86"/><stop offset="1" stop-color="#a9c77c" stop-opacity=".9"/>
              </radialGradient>
              <radialGradient id="mochi-shine"><stop stop-color="#fff" stop-opacity=".98"/><stop offset=".5" stop-color="#fff" stop-opacity=".7"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient>
              <radialGradient id="mochi-eye" cx=".35" cy=".25" r=".8"><stop stop-color="#454c39"/><stop offset=".5" stop-color="#11170d"/><stop offset="1" stop-color="#020502"/></radialGradient>
            </defs>
            <g stroke="#465334" stroke-width="1.5" fill="url(#mochi-bubble)">
              <circle class="mochi-bubble bubble-top" cx="57" cy="9" r="6"/>
              <circle cx="40" cy="29" r="10"/><circle cx="73" cy="32" r="7"/>
              <circle class="mochi-bubble bubble-left" cx="12" cy="43" r="4"/>
              <circle cx="66" cy="21" r="1.6"/>
            </g>
            <path d="M7 87 C15 83 15 72 20 62 C26 43 35 32 51 32 C69 30 77 41 82 56 C88 73 99 79 113 83 C121 86 118 91 107 91 L96 91 C94 92 96 98 89 98 C82 96 80 95 74 97 C68 99 67 103 59 101 C52 97 49 97 42 99 C35 102 29 104 26 98 C23 92 20 92 12 93 C3 94 0 90 7 87Z" fill="url(#mochi-jelly)" stroke="#3f4d2e" stroke-width="1.8" stroke-linejoin="round"/>
            <path d="M8 89 C17 87 20 88 25 91 C30 96 28 100 35 98 M45 96 Q53 94 59 98 Q65 101 71 96 M78 94 Q85 91 90 95 M98 87 L112 87" stroke="#f8ffe9" stroke-width="2.4" stroke-linecap="round"/>
            <circle cx="79" cy="54" r="9" fill="url(#mochi-bubble)" stroke="#54613b" stroke-width="1.3"/>
            <ellipse cx="45" cy="41" rx="17" ry="6" fill="url(#mochi-shine)" transform="rotate(-22 45 41)"/>
            <ellipse cx="32" cy="85" rx="7" ry="10" fill="url(#mochi-shine)"/>
            <ellipse cx="76" cy="78" rx="7" ry="7" fill="url(#mochi-shine)"/>
            <ellipse cx="93" cy="87" rx="6" ry="5" fill="url(#mochi-shine)"/>
            <circle cx="67" cy="72" r="4" fill="url(#mochi-shine)"/>
            <g class="mochi-eyes">
              <g class="mochi-eye"><ellipse cx="36" cy="54" rx="4.4" ry="5.5" fill="url(#mochi-eye)"/><ellipse cx="34.9" cy="52.2" rx="1.4" ry="1.8" fill="white" opacity=".95"/></g>
              <g class="mochi-eye"><ellipse cx="58" cy="60" rx="5" ry="5.6" fill="url(#mochi-eye)"/><ellipse cx="56.7" cy="58.1" rx="1.6" ry="1.8" fill="white" opacity=".95"/></g>
            </g>
            <g class="mochi-happy-eyes" stroke="#28391b" stroke-width="2.4" stroke-linecap="round"><path d="M32 55 Q36 49 40 55"/><path d="M53 60 Q58 54 63 60"/></g>
            <g class="mochi-mouth"><circle cx="36" cy="70" r="6.2" fill="#f3f0ad" stroke="#687341" stroke-width="1.2"/><ellipse cx="33.4" cy="70" rx="3.4" ry="4.6" fill="#faf7cf" stroke="#899152" stroke-width="1"/><path d="M32 66 Q36 68 33 73" stroke="#fffde7" stroke-width="1.5" stroke-linecap="round"/></g>
          </svg>
        </span><span class="fluffy-emote" aria-hidden="true"></span>
      </button>
      <section class="slime-care" id="slime-care" role="dialog" aria-label="Care for Mochi" hidden>
        <div class="slime-care-heading"><strong>Mochi <span>your little companion</span></strong><button type="button" class="slime-care-close" aria-label="Close slime care">×</button></div>
        <p class="slime-care-message" role="status" aria-live="polite">A little jelly, happy to see you.</p>
        <div class="slime-needs"></div>
        <div class="slime-care-actions"><button type="button" data-care="feed">🍓 Feed</button><button type="button" data-care="pet">♡ Pet</button><button type="button" data-care="play">✦ Play</button><button type="button" data-care="sleep">☾ Nap</button></div>
        <p class="slime-care-hint">Hold Mochi to carry. Release near a border to settle. Arrow keys move Mochi while focused.</p>
      </section>`;
    document.body.appendChild(host);
    const pet = host.querySelector(".fluffy-pet");
    const panel = host.querySelector(".slime-care");
    const message = host.querySelector(".slime-care-message");
    const emote = host.querySelector(".fluffy-emote");
    const needs = host.querySelector(".slime-needs");
    const meters = {};
    for (const [key, label] of [["hunger", "Fullness"], ["joy", "Happiness"], ["energy", "Energy"]]) {
        const row = document.createElement("label");
        row.className = "slime-need";
        row.append(document.createTextNode(label));
        const meter = document.createElement("meter");
        meter.min = 0; meter.max = 100; meter.setAttribute("aria-label", label);
        row.appendChild(meter); needs.appendChild(row); meters[key] = meter;
    }
    let rails = [], support = null, x = 0, y = 0, direction = 1;
    let raf = 0, previous = 0, idleUntil = 0, lastSave = 0, reactionUntil = 0;
    let pointer = null, dragging = false, holdTimer = 0, landing = null;
    let cooldownUntil = 0, nextBlink = 0, blinkUntil = 0, suspended = document.hidden;
    let keyWalkingUntil = 0, squashUntil = 0, carryAngle = 0;
    let motion = "", facing = 1;

    function face(value) {
        facing = value < 0 ? -1 : 1;
        pet.dataset.facing = facing < 0 ? "left" : "right";
        pet.style.setProperty("--walk-lean", `${facing * 4}deg`);
    }
    function updateMotion(now, walking = false) {
        const next = dragging ? "carried" : landing ? "airborne" : state.sleeping ? "sleeping"
            : now < squashUntil ? "landing" : pet.classList.contains("is-playing") ? "playing"
            : !pointer && panel.hidden && (walking || now < keyWalkingUntil) ? "walking" : "idle";
        if (next !== motion) { motion = next; pet.dataset.motion = next; }
        if (dragging && Math.abs(carryAngle) > 0.05) {
            carryAngle *= 0.91;
            pet.style.setProperty("--carry-angle", `${carryAngle.toFixed(2)}deg`);
        }
    }
    face(1);
    updateMotion(performance.now());

    function persist() {
        try { localStorage.setItem(KEY, JSON.stringify({ ...state, updated: Date.now() })); } catch { /* The pet works without storage. */ }
    }
    function updateNeeds() {
        for (const key of Object.keys(meters)) meters[key].value = Math.round(state[key]);
        pet.classList.toggle("is-sleeping", state.sleeping);
        host.querySelector('[data-care="sleep"]').textContent = state.sleeping ? "☀ Wake" : "☾ Nap";
    }
    function paint() {
        pet.style.transform = `translate3d(${x - SIZE / 2}px, ${y - 53}px, 0)`;
        if (!panel.hidden) positionPanel();
    }
    function nearest(px, py, candidates = rails) {
        return candidates.map(rail => {
            const rx = clamp(px, rail.left, rail.right);
            return { rail, x: rx, distance: Math.hypot(rx - px, rail.y - py) };
        }).sort((a, b) => a.distance - b.distance)[0];
    }
    function collectRails() {
        const old = support;
        rails = [];
        const add = (element, edge) => {
            const rect = element.getBoundingClientRect();
            if (rect.width < 90 || rect.height === 0 || !element.getClientRects().length) return;
            const left = rect.left + scrollX + 30, right = rect.right + scrollX - 30;
            const railY = (edge === "top" ? rect.top : rect.bottom) + scrollY;
            if (railY < 58 || right <= left) return;
            let spaces = [[left, right]];
            const blockers = element.matches("h3, .panel-head") ? [element] : [...element.querySelectorAll("a, button")];
            for (const blocker of blockers) {
                const range = document.createRange();
                range.selectNodeContents(blocker);
                for (const box of range.getClientRects()) {
                    if (box.bottom + scrollY < railY - 49 || box.top + scrollY > railY) continue;
                    const low = box.left + scrollX - 34, high = box.right + scrollX + 34;
                    spaces = spaces.flatMap(([a, b]) => high <= a || low >= b ? [[a, b]] : [[a, Math.min(b, low)], [Math.max(a, high), b]].filter(([c, d]) => d - c > 12));
                }
            }
            spaces.forEach(([a, b]) => rails.push({ element, edge, left: a, right: b, y: railY }));
        };
        document.querySelectorAll(".profile-dock, .panel.active, .console-wrap").forEach(el => { add(el, "top"); add(el, "bottom"); });
        document.querySelectorAll(".panel.active .panel-head, .panel.active .pixel-card h3").forEach(el => add(el, "bottom"));
        if (!rails.length) return;
        support = rails.find(r => old && r.element === old.element && r.edge === old.edge && x >= r.left && x <= r.right) || nearest(x || innerWidth / 2, y || 0).rail;
        if (!pointer && !landing) {
            x = clamp(x || support.left + 70, support.left, support.right);
            y = support.y;
            paint();
        }
    }
    function settle() {
        const target = nearest(x, y);
        if (!target) return;
        support = target.rail;
        landing = { fromX: x, fromY: y, toX: target.x, toY: support.y, start: performance.now() };
        idleUntil = performance.now() + 1800;
        pet.classList.remove("is-carried");
        carryAngle = 0;
        pet.style.setProperty("--carry-angle", "0deg");
        react("♡", "A perfect little perch.");
    }
    function positionPanel() {
        const rect = pet.getBoundingClientRect();
        const width = Math.min(300, innerWidth - 24);
        panel.style.width = `${width}px`;
        panel.style.left = `${clamp(rect.left + rect.width / 2 - width / 2, 12, innerWidth - width - 12)}px`;
        const height = panel.offsetHeight;
        const top = rect.bottom + 12 + height < innerHeight ? rect.bottom + 12 : rect.top - height - 12;
        panel.style.top = `${clamp(top, 12, Math.max(12, innerHeight - height - 12))}px`;
    }
    function openPanel(open, focus = false) {
        panel.hidden = !open;
        pet.setAttribute("aria-expanded", String(open));
        updateMotion(performance.now());
        if (open) { updateNeeds(); positionPanel(); if (focus) panel.querySelector("button").focus(); }
        else if (focus) pet.focus({ preventScroll: true });
    }
    function react(symbol, text) {
        emote.textContent = symbol;
        message.textContent = text;
        reactionUntil = performance.now() + 2200;
        pet.classList.add("is-happy");
    }
    const actions = {
        feed() { state.hunger = Math.min(100, state.hunger + 24); state.energy = Math.min(100, state.energy + 5); react("🍓", "Nom nom. Mochi loved that berry!"); },
        pet() { state.joy = Math.min(100, state.joy + 18); react("♡", "So soft! Mochi leans into your hand."); },
        play() {
            if (state.energy < 15) { react("☾", "A little sleepy. Try a nap first."); return; }
            state.joy = Math.min(100, state.joy + 25); state.energy -= 12; state.hunger = Math.max(0, state.hunger - 6);
            react("✦", "Bounce, bounce! That was fun.");
            pet.classList.add("is-playing");
        }
    };
    host.querySelectorAll("[data-care]").forEach(button => button.addEventListener("click", () => {
        const action = button.dataset.care;
        if (action === "sleep") {
            state.sleeping = !state.sleeping;
            react(state.sleeping ? "zZ" : "☀", state.sleeping ? "Mochi is recharging. Sweet dreams." : "Ready to explore again!");
        } else if (state.sleeping) react("zZ", "Wake Mochi before playing or feeding.");
        else if (performance.now() < cooldownUntil) { message.textContent = "One little moment…"; return; }
        else { actions[action](); cooldownUntil = performance.now() + 1200; }
        updateNeeds(); persist();
    }));
    host.querySelector(".slime-care-close").addEventListener("click", () => openPanel(false, true));
    document.addEventListener("pointerdown", event => { if (!host.contains(event.target)) openPanel(false); });
    pet.addEventListener("pointerdown", event => {
        if (event.button !== 0) return;
        event.stopPropagation();
        pointer = { id: event.pointerId, clientX: event.clientX, clientY: event.clientY, offsetX: event.clientX + scrollX - x, offsetY: event.clientY + scrollY - y };
        pet.setPointerCapture(event.pointerId);
        clearTimeout(holdTimer);
        holdTimer = setTimeout(() => {
            if (!pointer) return;
            dragging = true; landing = null;
            pet.style.setProperty("--carry-stretch", "1.12");
            pet.classList.add("is-carried");
            updateMotion(performance.now());
            openPanel(false);
            react("!", "Where are we going?");
        }, 280);
    });
    pet.addEventListener("pointermove", event => {
        if (!pointer || event.pointerId !== pointer.id) return;
        const deltaX = event.clientX - pointer.clientX;
        const deltaY = event.clientY - pointer.clientY;
        pointer.clientX = event.clientX; pointer.clientY = event.clientY;
        if (!dragging) return;
        if (Math.abs(deltaX) > 1) face(deltaX);
        carryAngle = clamp(-deltaX * 0.9, -22, 22);
        pet.style.setProperty("--carry-angle", `${carryAngle}deg`);
        pet.style.setProperty("--carry-stretch", String(clamp(1.12 + Math.abs(deltaY) * 0.004, 1.12, 1.3)));
        x = clamp(event.clientX + scrollX - pointer.offsetX, scrollX + 32, scrollX + innerWidth - 32);
        y = clamp(event.clientY + scrollY - pointer.offsetY, scrollY + 54, scrollY + innerHeight - 12);
        paint();
    });
    function release(event, cancelled = false) {
        if (!pointer || event.pointerId !== pointer.id) return;
        clearTimeout(holdTimer);
        const wasDragging = dragging;
        pointer = null; dragging = false;
        if (pet.hasPointerCapture(event.pointerId)) pet.releasePointerCapture(event.pointerId);
        if (wasDragging) settle();
        else if (!cancelled) openPanel(panel.hidden);
    }
    pet.addEventListener("contextmenu", event => event.preventDefault());
    pet.addEventListener("pointerup", event => release(event));
    pet.addEventListener("pointercancel", event => release(event, true));
    pet.addEventListener("lostpointercapture", event => release(event, true));
    pet.addEventListener("click", event => { if (event.detail === 0) openPanel(panel.hidden, true); });
    pet.addEventListener("keydown", event => {
        event.stopPropagation();
        if (event.key === "Escape") openPanel(false);
        if (["ArrowLeft", "ArrowRight"].includes(event.key) && support) {
            event.preventDefault();
            direction = event.key === "ArrowLeft" ? -1 : 1;
            face(direction);
            keyWalkingUntil = performance.now() + 240;
            x = clamp(x + direction * 18, support.left, support.right);
            idleUntil = performance.now() + 1500; paint();
        }
    });
    panel.addEventListener("keydown", event => { event.stopPropagation(); if (event.key === "Escape") openPanel(false, true); });
    function animate(now) {
        raf = 0;
        if (suspended) return;
        const dt = Math.min((now - (previous || now)) / 1000, 0.1);
        previous = now;
        let walking = false;
        if (landing) {
            const t = reduceMotion.matches ? 1 : Math.min(1, (now - landing.start) / (landing.duration || 420));
            const ease = 1 - (1 - t) ** 3;
            x = landing.fromX + (landing.toX - landing.fromX) * ease;
            y = landing.fromY + (landing.toY - landing.fromY) * ease - Math.sin(t * Math.PI) * 24;
            if (t === 1) { landing = null; squashUntil = now + 360; }
            paint();
        } else if (!pointer && panel.hidden && support && !state.sleeping && now > idleUntil && !reduceMotion.matches) {
            face(direction);
            walking = true;
            x += direction * 16 * dt;
            if (x >= support.right || x <= support.left) {
                x = clamp(x, support.left, support.right); direction *= -1; idleUntil = now + 1600;
                const neighbors = rails.filter(r => r !== support && Math.abs(r.y - support.y) > 8 && Math.abs(r.y - support.y) < 400 && x >= r.left - 40 && x <= r.right + 40);
                if (neighbors.length && Math.random() < 0.35) {
                    const target = neighbors[Math.floor(Math.random() * neighbors.length)];
                    landing = { fromX: x, fromY: y, toX: clamp(x, target.left, target.right), toY: target.y, start: now, duration: Math.max(420, Math.abs(target.y - y) * 2) };
                    support = target;
                }
            }
            if (!landing) y = support.y;
            paint();
        }
        // Needs change gently while this page is open, with no offline punishment.
        state.hunger = Math.max(0, state.hunger - dt / 90);
        state.joy = Math.max(0, state.joy - dt / 150);
        state.energy = clamp(state.energy + (state.sleeping ? dt / 2 : -dt / 180), 0, 100);
        if (now > nextBlink) { blinkUntil = now + 160; nextBlink = now + 3500 + Math.random() * 3000; }
        pet.classList.toggle("is-blinking", now < blinkUntil);
        if (now > reactionUntil) {
            emote.textContent = state.sleeping ? "zZ" : state.hunger < 25 ? "🍓?" : "";
            pet.classList.remove("is-happy", "is-playing");
        }
        updateMotion(now, walking);
        if (now - lastSave > 15000) { lastSave = now; updateNeeds(); persist(); }
        raf = requestAnimationFrame(animate);
    }
    let layoutFrame = 0;
    function queueLayout() {
        if (layoutFrame) return;
        layoutFrame = requestAnimationFrame(() => { layoutFrame = 0; collectRails(); });
    }
    const resize = new ResizeObserver(queueLayout);
    document.querySelectorAll(".console-wrap, .profile-dock, .panel-stack").forEach(el => resize.observe(el));
    const mutation = new MutationObserver(queueLayout);
    document.querySelectorAll(".panel, .dock-body").forEach(el => mutation.observe(el, { childList: true, subtree: true, attributes: true, attributeFilter: ["class"] }));
    addEventListener("resize", queueLayout);
    addEventListener("scroll", () => { if (!panel.hidden) positionPanel(); }, { passive: true });
    document.addEventListener("visibilitychange", () => {
        suspended = document.hidden; previous = 0;
        if (suspended) { cancelAnimationFrame(raf); raf = 0; persist(); }
        else if (!raf) raf = requestAnimationFrame(animate);
    });
    addEventListener("blur", () => { if (pointer) release({ pointerId: pointer.id }, true); });
    addEventListener("pagehide", persist);
    updateNeeds();
    collectRails();
    support = rails.find(r => r.element.matches(".profile-dock") && r.edge === "top") || rails.find(r => r.element.matches(".profile-dock")) || support;
    if (support) { x = clamp(support.right - 48, support.left, support.right); y = support.y; paint(); }
    if (!suspended) raf = requestAnimationFrame(animate);
})();
