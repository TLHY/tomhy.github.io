const tabs = Array.from(document.querySelectorAll(".pak-tab"));
const panels = Array.from(document.querySelectorAll(".panel"));
let slimeEngine = null;

function normalizeUrl(value) {
    if (typeof value !== "string") {
        return "";
    }

    const cleaned = normalizeDisplayText(value);
    if (!cleaned) {
        return "";
    }

    return cleaned;
}

function normalizeDisplayText(value) {
    if (typeof value !== "string") {
        return "";
    }

    let text = value.trim();
    if (!text) {
        return "";
    }

    // Remove decorative wrappers like [Text] while preserving inner content.
    while (text.startsWith("[") && text.endsWith("]") && text.length > 1) {
        text = text.slice(1, -1).trim();
    }

    return text;
}

function appendFormattedText(container, text) {
    const content = normalizeDisplayText(text);
    const lines = content.split("\n");

    lines.forEach((line, lineIndex) => {
        const chunks = line.split(/(\*\*[^*]+\*\*)/g);
        chunks.forEach((chunk) => {
            if (chunk.startsWith("**") && chunk.endsWith("**") && chunk.length > 4) {
                const strong = document.createElement("strong");
                strong.textContent = chunk.slice(2, -2);
                container.appendChild(strong);
            } else if (chunk) {
                container.appendChild(document.createTextNode(chunk));
            }
        });

        if (lineIndex < lines.length - 1) {
            container.appendChild(document.createElement("br"));
        }
    });
}

function createContentImage(src, alt, cssClass) {
    const normalizedSrc = normalizeUrl(src);
    if (!normalizedSrc) {
        return null;
    }

    const image = document.createElement("img");
    image.className = cssClass;
    image.src = normalizedSrc;
    image.alt = alt || "";
    image.loading = "lazy";
    return image;
}

function setActivePanel(targetId) {
    slimeEngine?.pause?.();
    tabs.forEach((tab) => {
        tab.classList.toggle("active", tab.dataset.panel === targetId);
    });

    panels.forEach((panel) => {
        panel.classList.toggle("active", panel.id === targetId);
    });
}

function createCard(card) {
    const article = document.createElement("article");
    article.className = "pixel-card";

    const image = createContentImage(card.image, card.imageAlt || card.title || "Card image", "content-image card-image");
    if (image) {
        article.appendChild(image);
    }

    const title = document.createElement("h3");
    appendFormattedText(title, card.title || "Untitled");
    article.appendChild(title);

    if (Array.isArray(card.list) && card.list.length > 0) {
        const ul = document.createElement("ul");
        card.list.forEach((item) => {
            const li = document.createElement("li");
            appendFormattedText(li, item);
            ul.appendChild(li);
        });
        article.appendChild(ul);
    } else {
        const paragraph = document.createElement("p");
        appendFormattedText(paragraph, card.text || "");
        article.appendChild(paragraph);
    }

    return article;
}

function createHomePreviewCard(preview) {
    const article = document.createElement("article");
    article.className = "pixel-card home-preview-card";
    if (preview.target) {
        article.classList.add(`home-preview-${preview.target}`);
    }
    if (preview.wide) {
        article.classList.add("home-preview-wide");
    }

    const title = document.createElement("h3");
    appendFormattedText(title, preview.title || "Untitled");
    article.appendChild(title);

    const lines = Array.isArray(preview.lines) ? preview.lines : [];
    if (lines.length > 0) {
        const ul = document.createElement("ul");
        lines.forEach((line) => {
            const li = document.createElement("li");
            if (typeof line === "string") {
                appendFormattedText(li, line);
            } else {
                const entry = document.createElement("div");
                entry.className = "home-preview-entry";

                const titleRow = document.createElement("div");
                titleRow.className = "home-preview-title-row";

                if (line.date) {
                    const dateText = document.createElement("span");
                    dateText.className = "home-preview-date";
                    appendFormattedText(dateText, line.date);
                    titleRow.appendChild(dateText);
                }

                const titleText = document.createElement("span");
                titleText.className = "home-preview-main-title";
                appendFormattedText(titleText, line.title || line.text || "");
                titleRow.appendChild(titleText);

                if (line.link) {
                    const linkIcon = createEntryLinkIcon(line.link, line.linkLabel || "Open publication page");
                    if (linkIcon) {
                        titleRow.appendChild(linkIcon);
                    }
                }

                entry.appendChild(titleRow);

                if (line.text) {
                    const detail1 = document.createElement("span");
                    detail1.className = "home-preview-detail";
                    appendFormattedText(detail1, line.text);
                    entry.appendChild(detail1);
                }

                if (line.text2) {
                    const detail2 = document.createElement("span");
                    detail2.className = "home-preview-detail";
                    appendFormattedText(detail2, line.text2);
                    entry.appendChild(detail2);
                }

                li.appendChild(entry);
            }
            ul.appendChild(li);
        });
        article.appendChild(ul);
    } else {
        const paragraph = document.createElement("p");
        paragraph.textContent = "No recent updates yet.";
        article.appendChild(paragraph);
    }

    const button = document.createElement("button");
    button.type = "button";
    button.className = "preview-jump";
    button.dataset.panel = preview.target;
    button.textContent = `Open ${preview.label}`;
    button.addEventListener("click", () => {
        const targetPanel = preview.target;
        setActivePanel(targetPanel);
        const targetTab = tabs.find((tab) => tab.dataset.panel === targetPanel);
        if (targetTab) {
            targetTab.focus();
        }
    });
    article.appendChild(button);

    return article;
}

function createEntryLinkIcon(link, label = "Open link") {
    const normalizedLink = normalizeUrl(link);
    if (!normalizedLink) {
        return null;
    }

    const anchor = document.createElement("a");
    anchor.className = "entry-link-icon";
    anchor.href = normalizedLink;
    anchor.target = "_blank";
    anchor.rel = "noopener noreferrer";
    anchor.ariaLabel = label;
    anchor.title = label;
    return anchor;
}

function createPublicationTitleLink(link, label, titleText) {
    const normalizedLink = normalizeUrl(link);
    if (!normalizedLink) {
        return null;
    }

    const anchor = document.createElement("a");
    anchor.className = "publication-title-link";
    anchor.href = normalizedLink;
    anchor.target = "_blank";
    anchor.rel = "noopener noreferrer";
    anchor.ariaLabel = label;
    anchor.title = label;
    appendFormattedText(anchor, titleText || "Untitled");
    return anchor;
}

function createTimelineEntry(entry) {
    const wrapper = document.createElement("div");
    wrapper.className = "timeline-entry";

    const time = document.createElement("time");
    time.textContent = normalizeDisplayText(entry.date) || "TBD";

    const card = document.createElement("div");
    card.className = "pixel-card publication-card";

    const body = document.createElement("div");
    body.className = "publication-body";

    const image = createContentImage(entry.image, entry.imageAlt || entry.title || "Publication image", "content-image publication-image");
    if (image) {
        const imageFrame = document.createElement("div");
        imageFrame.className = "publication-thumb-frame";
        imageFrame.appendChild(image);
        body.appendChild(imageFrame);
    } else {
        body.classList.add("no-thumb");
    }

    const content = document.createElement("div");
    content.className = "publication-content";

    const title = document.createElement("h3");
    const titleLink = createPublicationTitleLink(entry.link, "Open publication page", entry.title || "Untitled");
    if (titleLink) {
        title.appendChild(titleLink);
    } else {
        appendFormattedText(title, entry.title || "Untitled");
    }

    const paragraph = document.createElement("p");
    appendFormattedText(paragraph, entry.text || "");

    content.appendChild(title);
    content.appendChild(paragraph);
    if (entry.text2) {
        const paragraph2 = document.createElement("p");
        paragraph2.className = "entry-secondary";
        appendFormattedText(paragraph2, entry.text2);
        content.appendChild(paragraph2);
    }
    if (entry.link) {
        const linkIcon = createEntryLinkIcon(entry.link, "Open publication page");
        if (linkIcon) {
            content.appendChild(linkIcon);
        }
    }

    body.appendChild(content);
    card.appendChild(body);
    wrapper.appendChild(time);
    wrapper.appendChild(card);

    return wrapper;
}

function setText(id, value) {
    const element = document.getElementById(id);
    if (element && typeof value === "string") {
        element.textContent = normalizeDisplayText(value);
    }
}

function randomBetween(min, max) {
    return Math.random() * (max - min) + min;
}

function initSlimePlayground(meta = {}) {
    const playground = document.getElementById("meta-playground");
    const slimeLayer = document.getElementById("slime-layer");

    if (!playground || !slimeLayer) {
        return;
    }

    if (slimeEngine && typeof slimeEngine.stop === "function") {
        slimeEngine.stop();
    }

    const config = meta.playground || {};
    setText("meta-zone-title", config.title || "Digital Care Lab");
    setText("meta-zone-hint", typeof config.hint === "string" ? config.hint : "");

    slimeLayer.innerHTML = "";

    const SAVE_KEY = "tomhy_digipet_v1";
    const SAVE_INTERVAL_MS = 5000;
    const STAGE_EXP = [0, 30, 90, 160];
    const stageBranches = {
        good: [
            { label: "", role: "healer" },
            { label: "Rookie", role: "archer" },
            { label: "Champion", role: "sword" },
            { label: "Ultimate", role: "mage" }
        ],
        bad: [
            { label: "", role: "healer" },
            { label: "Rookie-Virus", role: "archer" },
            { label: "Champion-Rogue", role: "sword" },
            { label: "Ultimate-Fallen", role: "mage" }
        ]
    };

    function createInitialPet() {
        return {
            x: 0,
            y: 0,
            targetX: 0,
            targetY: 0,
            facingRight: false,
            size: 40,
            moveSpeed: randomBetween(20, 36),
            wobbleOffset: randomBetween(0, Math.PI * 2),
            roamPauseUntil: 0,
            restingUntil: 0,
            castUntil: 0,
            stageIndex: 0,
            branch: "undecided",
            sickness: false,
            mess: 18,
            careMistakes: 0,
            nextMessAt: 0,
            nextMistakeAt: 0,
            stats: {
                health: 84,
                hunger: 72,
                happiness: 68,
                hygiene: 66,
                energy: 70,
                exp: 0,
                age: 0
            }
        };
    }

    const pet = createInitialPet();
    let lastSaveAt = 0;
    let rafId = 0;
    let lastTime = performance.now();

    const petEl = document.createElement("div");
    petEl.className = "ro-char tamagotchi-pet role-healer stage-0";
    petEl.style.setProperty("--char-size", `${pet.size}px`);

    const shadow = document.createElement("span");
    shadow.className = "ro-shadow";

    const sprite = document.createElement("div");
    sprite.className = "ro-sprite";

    const idleSheet = document.createElement("span");
    idleSheet.className = "ro-idle-sheet";

    const fightSheet = document.createElement("span");
    fightSheet.className = "ro-fight-sheet";

    const nameTag = document.createElement("span");
    nameTag.className = "ro-name";
    nameTag.textContent = "";

    const emote = document.createElement("span");
    emote.className = "ro-emote";
    emote.textContent = "!";

    sprite.appendChild(idleSheet);
    sprite.appendChild(fightSheet);
    petEl.appendChild(shadow);
    petEl.appendChild(sprite);
    petEl.appendChild(nameTag);
    petEl.appendChild(emote);
    slimeLayer.appendChild(petEl);

    const panel = document.createElement("div");
    panel.className = "tama-panel is-hidden";

    const panelHead = document.createElement("div");
    panelHead.className = "tama-panel-head";

    const panelTitle = document.createElement("span");
    panelTitle.className = "tama-panel-title";
    panelTitle.textContent = "STATUS";
    panelHead.appendChild(panelTitle);

    const closeBtn = document.createElement("button");
    closeBtn.type = "button";
    closeBtn.className = "tama-close";
    closeBtn.textContent = "X";
    closeBtn.setAttribute("aria-label", "Close status window");
    panelHead.appendChild(closeBtn);

    panel.appendChild(panelHead);

    const statusLine = document.createElement("div");
    statusLine.className = "tama-status";
    panel.appendChild(statusLine);

    const bars = document.createElement("div");
    bars.className = "tama-bars";
    panel.appendChild(bars);

    const controls = document.createElement("div");
    controls.className = "tama-controls";
    panel.appendChild(controls);

    slimeLayer.appendChild(panel);

    const statusBtn = document.createElement("button");
    statusBtn.type = "button";
    statusBtn.className = "tama-status-trigger";
    statusBtn.textContent = "STATUS";
    statusBtn.setAttribute("aria-expanded", "false");
    statusBtn.setAttribute("aria-controls", "tama-status-panel");
    panel.id = "tama-status-panel";
    slimeLayer.appendChild(statusBtn);

    function openStatusPanel() {
        panel.classList.remove("is-hidden");
        statusBtn.setAttribute("aria-expanded", "true");
    }

    function closeStatusPanel() {
        panel.classList.add("is-hidden");
        statusBtn.setAttribute("aria-expanded", "false");
    }

    function toggleStatusPanel() {
        if (panel.classList.contains("is-hidden")) {
            openStatusPanel();
        } else {
            closeStatusPanel();
        }
    }

    statusBtn.addEventListener("click", toggleStatusPanel);
    closeBtn.addEventListener("click", closeStatusPanel);

    function createBar(label) {
        const row = document.createElement("div");
        row.className = "tama-row";
        const text = document.createElement("span");
        text.className = "tama-label";
        text.textContent = label;
        const bar = document.createElement("span");
        bar.className = "tama-bar";
        const fill = document.createElement("span");
        fill.className = "tama-fill";
        bar.appendChild(fill);
        row.appendChild(text);
        row.appendChild(bar);
        bars.appendChild(row);
        return fill;
    }

    const fills = {
        health: createBar("HP"),
        hunger: createBar("HUN"),
        happiness: createBar("JOY"),
        hygiene: createBar("CLR"),
        energy: createBar("ENE"),
        mess: createBar("MS")
    };

    function clamp(value, min, max) {
        return Math.max(min, Math.min(max, value));
    }

    function showPopup(text) {
        const pop = document.createElement("span");
        pop.className = "ro-damage";
        pop.textContent = text;
        pop.style.left = `${pet.x + pet.size / 2 + randomBetween(-8, 8)}px`;
        pop.style.top = `${pet.y - 8}px`;
        slimeLayer.appendChild(pop);
        setTimeout(() => pop.remove(), 620);
    }

    function getStageByPet() {
        const branch = pet.branch === "bad" ? "bad" : "good";
        return stageBranches[branch][pet.stageIndex];
    }

    function savePetState(force = false) {
        if (!force && performance.now() - lastSaveAt < SAVE_INTERVAL_MS) {
            return;
        }

        try {
            localStorage.setItem(
                SAVE_KEY,
                JSON.stringify({
                    stageIndex: pet.stageIndex,
                    branch: pet.branch,
                    sickness: pet.sickness,
                    mess: pet.mess,
                    careMistakes: pet.careMistakes,
                    stats: pet.stats,
                    savedAt: Date.now()
                })
            );
            lastSaveAt = performance.now();
        } catch (error) {
            // Storage can fail in restricted browser contexts.
        }
    }

    function loadPetState() {
        try {
            const raw = localStorage.getItem(SAVE_KEY);
            if (!raw) {
                return;
            }

            const parsed = JSON.parse(raw);
            if (!parsed || typeof parsed !== "object") {
                return;
            }

            pet.stageIndex = clamp(Number(parsed.stageIndex) || 0, 0, STAGE_EXP.length - 1);
            pet.branch = parsed.branch === "bad" ? "bad" : parsed.branch === "good" ? "good" : "undecided";
            pet.sickness = Boolean(parsed.sickness);
            pet.mess = clamp(Number(parsed.mess) || 0, 0, 100);
            pet.careMistakes = clamp(Number(parsed.careMistakes) || 0, 0, 999);

            const stats = parsed.stats || {};
            ["health", "hunger", "happiness", "hygiene", "energy", "exp", "age"].forEach((key) => {
                const value = Number(stats[key]);
                if (Number.isFinite(value)) {
                    pet.stats[key] = key === "age" ? clamp(value, 0, 10000) : clamp(value, 0, 200);
                }
            });
        } catch (error) {
            // Ignore corrupt or unavailable storage.
        }
    }

    function applyRoleFromStage() {
        const stage = getStageByPet();
        petEl.classList.remove("role-healer", "role-archer", "role-sword", "role-mage");
        petEl.classList.remove("stage-0", "stage-1", "stage-2", "stage-3");
        petEl.classList.add(`role-${stage.role}`);
        petEl.classList.add(`stage-${pet.stageIndex}`);
        nameTag.textContent = "";
    }

    function updateEvolution() {
        const score = (pet.stats.health + pet.stats.happiness + pet.stats.hygiene + pet.stats.energy + pet.stats.hunger - pet.mess) / 5;

        if (pet.branch === "undecided" && pet.stats.exp >= STAGE_EXP[1]) {
            const goodPath = pet.careMistakes <= 2 && score >= 50 && !pet.sickness;
            pet.branch = goodPath ? "good" : "bad";
            showPopup(goodPath ? "GOOD PATH" : "DARK PATH");
        }

        let nextStage = 0;
        if (pet.stats.exp >= STAGE_EXP[3] && (pet.branch === "bad" || score >= 60)) {
            nextStage = 3;
        } else if (pet.stats.exp >= STAGE_EXP[2] && (pet.branch === "bad" || score >= 48)) {
            nextStage = 2;
        } else if (pet.stats.exp >= STAGE_EXP[1] && (pet.branch === "bad" || score >= 40)) {
            nextStage = 1;
        }

        if (nextStage !== pet.stageIndex) {
            pet.stageIndex = nextStage;
            applyRoleFromStage();
            petEl.classList.add("is-cast");
            emote.textContent = "!";
            showPopup("DIGIVOLVE");
            setTimeout(() => {
                petEl.classList.remove("is-cast");
                emote.textContent = "~";
            }, 520);
            savePetState(true);
        }
    }

    function clearPetState() {
        Object.assign(pet, createInitialPet());
        applyRoleFromStage();
        updateBars();
        updateStatus(performance.now());
        try {
            localStorage.removeItem(SAVE_KEY);
        } catch (error) {
            // Ignore storage cleanup failures.
        }
        showPopup("RESET");
    }

    function action(type) {
        const now = performance.now();

        if (type === "feed") {
            pet.stats.hunger += 26;
            pet.stats.happiness += 6;
            pet.stats.exp += 5;
            showPopup("+FOOD");
        }

        if (type === "play") {
            pet.stats.happiness += 20;
            pet.stats.energy -= 10;
            pet.stats.hunger -= 7;
            pet.stats.exp += 8;
            showPopup("+JOY");
        }

        if (type === "clean") {
            pet.stats.hygiene += 28;
            pet.mess -= 42;
            pet.stats.exp += 4;
            showPopup("+CLEAN");
        }

        if (type === "rest") {
            pet.restingUntil = now + 7000;
            pet.stats.exp += 2;
            emote.textContent = "z";
            showPopup("REST");
        }

        if (type === "train") {
            pet.castUntil = now + 450;
            pet.stats.energy -= 12;
            pet.stats.hunger -= 5;
            pet.stats.happiness += 4;
            pet.stats.exp += randomBetween(10, 16);
            emote.textContent = "*";
            showPopup("+XP");
        }

        if (type === "medic") {
            pet.stats.energy -= 4;
            pet.stats.happiness -= 6;
            if (pet.sickness && Math.random() < 0.8) {
                pet.sickness = false;
                pet.stats.health += 10;
                showPopup("CURED");
            } else {
                showPopup("MED");
            }
        }

        if (type === "reset") {
            clearPetState();
            return;
        }

        ["health", "hunger", "happiness", "hygiene", "energy", "exp"].forEach((key) => {
            pet.stats[key] = clamp(pet.stats[key], 0, 200);
        });
        pet.mess = clamp(pet.mess, 0, 100);

        updateEvolution();
        updateBars();
        updateStatus(now);
        savePetState();
    }

    [
        { label: "FEED", id: "feed" },
        { label: "PLAY", id: "play" },
        { label: "CLEAN", id: "clean" },
        { label: "REST", id: "rest" },
        { label: "TRAIN", id: "train" },
        { label: "MED", id: "medic" },
        { label: "RESET", id: "reset" }
    ].forEach((control) => {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "tama-btn";
        btn.textContent = control.label;
        btn.addEventListener("click", () => action(control.id));
        controls.appendChild(btn);
    });

    function updateBars() {
        Object.keys(fills).forEach((key) => {
            const source = key === "mess" ? pet.mess : pet.stats[key];
            const value = clamp(source, 0, 100);
            fills[key].style.width = `${value}%`;
        });
    }

    function getBounds() {
        const rect = slimeLayer.getBoundingClientRect();
        return {
            width: Math.max(120, rect.width),
            height: Math.max(90, rect.height)
        };
    }

    function placePet(bounds) {
        pet.x = bounds.width * 0.5 - pet.size * 0.5;
        pet.y = bounds.height * 0.42 - pet.size * 0.45;
        pet.targetX = pet.x;
        pet.targetY = pet.y;
    }

    function pickRoamTarget(bounds) {
        const margin = 8;
        const minX = margin;
        const maxX = Math.max(minX, bounds.width - pet.size - margin);
        const minY = margin;
        const maxY = Math.max(minY, bounds.height - pet.size - margin);
        pet.targetX = randomBetween(minX, maxX);
        pet.targetY = randomBetween(minY, maxY);
    }

    function updateRoaming(dt, now, bounds) {
        const resting = now < pet.restingUntil;
        const speed = pet.moveSpeed * (resting ? 0.3 : 1);

        if (!pet.targetX && !pet.targetY) {
            pickRoamTarget(bounds);
        }

        if (now >= pet.roamPauseUntil) {
            const dx = pet.targetX - pet.x;
            const dy = pet.targetY - pet.y;
            const distance = Math.hypot(dx, dy);

            if (Math.abs(dx) > 0.15) {
                pet.facingRight = dx > 0;
            }

            if (distance <= 1.2) {
                pet.roamPauseUntil = now + randomBetween(300, 1400);
                pickRoamTarget(bounds);
            } else if (distance > 0) {
                const step = Math.min(distance, speed * dt);
                pet.x += (dx / distance) * step;
                pet.y += (dy / distance) * step;
            }
        }

        const margin = 8;
        const maxX = Math.max(margin, bounds.width - pet.size - margin);
        const maxY = Math.max(margin, bounds.height - pet.size - margin);
        pet.x = clamp(pet.x, margin, maxX);
        pet.y = clamp(pet.y, margin, maxY);
    }

    function updateStatus(now) {
        const resting = now < pet.restingUntil;
        const low = [pet.stats.hunger, pet.stats.happiness, pet.stats.hygiene, pet.stats.energy].some((v) => v < 20);
        const mood = pet.sickness ? "Sick" : resting ? "Sleeping" : low ? "Worried" : "Active";
        const stage = getStageByPet();
        const branchLabel = pet.branch === "bad" ? "Virus" : pet.branch === "good" ? "Vaccine" : "Neutral";
        const stagePrefix = stage.label ? `${stage.label} | ` : "";
        statusLine.textContent = `${stagePrefix}Mood: ${mood} | Path: ${branchLabel} | Mistakes ${pet.careMistakes} | EXP ${Math.floor(pet.stats.exp)} | Age ${Math.floor(pet.stats.age)}m`;
        emote.textContent = resting ? "z" : pet.sickness ? "x" : low ? "!" : "~";
    }

    function tick(now) {
        const dt = Math.min((now - lastTime) / 1000, 0.05);
        lastTime = now;
        const bounds = getBounds();

        const resting = now < pet.restingUntil;
        pet.stats.age += dt / 6;

        pet.stats.hunger -= dt * (resting ? 0.6 : 1.2);
        pet.stats.happiness -= dt * (resting ? 0.35 : 0.7);
        pet.stats.hygiene -= dt * 0.55;
        pet.stats.energy += dt * (resting ? 4.8 : -0.9);
        pet.mess += dt * (resting ? 0.35 : 0.6);

        if (!pet.nextMessAt) {
            pet.nextMessAt = now + randomBetween(12000, 22000);
        }

        if (now >= pet.nextMessAt) {
            pet.mess += randomBetween(14, 24);
            pet.stats.hygiene -= randomBetween(4, 8);
            showPopup("MESS!");
            pet.nextMessAt = now + randomBetween(13000, 24000);
        }

        const lowCount = [pet.stats.hunger, pet.stats.happiness, pet.stats.hygiene, pet.stats.energy].filter((v) => v < 20).length;

        if (!pet.sickness && (lowCount >= 2 || pet.mess > 70) && Math.random() < dt * 0.35) {
            pet.sickness = true;
            showPopup("SICK");
        }

        if (lowCount >= 2 && now >= pet.nextMistakeAt) {
            pet.careMistakes += 1;
            pet.nextMistakeAt = now + 9000;
        }

        if (lowCount > 0) {
            pet.stats.health -= dt * (1.2 + lowCount * 0.6);
        } else {
            pet.stats.health += dt * 0.5;
        }

        if (pet.mess > 80) {
            pet.stats.health -= dt * 1.3;
            pet.stats.happiness -= dt * 0.7;
        }

        if (pet.sickness) {
            pet.stats.health -= dt * 1.8;
            pet.stats.energy -= dt * 0.8;
            pet.stats.happiness -= dt * 0.55;
        }

        ["health", "hunger", "happiness", "hygiene", "energy"].forEach((key) => {
            pet.stats[key] = clamp(pet.stats[key], 0, 100);
        });
        pet.mess = clamp(pet.mess, 0, 100);
        pet.careMistakes = clamp(pet.careMistakes, 0, 999);

        updateEvolution();
        updateBars();
        updateStatus(now);
        updateRoaming(dt, now, bounds);

        petEl.classList.toggle("is-cast", now < pet.castUntil);
        if (now >= pet.castUntil && now >= pet.restingUntil) {
            petEl.classList.remove("is-cast");
        }

        const wobble = Math.sin(now * 0.006 + pet.wobbleOffset) * 0.05;
        const faceScale = pet.facingRight ? -1 : 1;
        petEl.style.left = `${pet.x}px`;
        petEl.style.top = `${pet.y}px`;
        petEl.style.transform = `scale(${(1 + wobble) * faceScale}, ${1 - wobble})`;

        savePetState();

        rafId = requestAnimationFrame(tick);
    }

    function onResize() {
        const bounds = getBounds();
        const margin = 8;
        const maxX = Math.max(margin, bounds.width - pet.size - margin);
        const maxY = Math.max(margin, bounds.height - pet.size - margin);
        pet.x = clamp(pet.x, margin, maxX);
        pet.y = clamp(pet.y, margin, maxY);
        pickRoamTarget(bounds);
    }

    loadPetState();
    applyRoleFromStage();
    placePet(getBounds());
    pickRoamTarget(getBounds());
    updateBars();
    updateStatus(performance.now());

    window.addEventListener("resize", onResize);
    rafId = requestAnimationFrame(tick);

    slimeEngine = {
        stop() {
            cancelAnimationFrame(rafId);
            window.removeEventListener("resize", onResize);
            savePetState(true);
        }
    };
}

function initHapticTycoon(meta = {}) {
    const playground = document.getElementById("meta-playground");
    const gameLayer = document.getElementById("slime-layer");

    if (!playground || !gameLayer) {
        return;
    }

    if (slimeEngine && typeof slimeEngine.stop === "function") {
        slimeEngine.stop();
    }

    const config = meta.playground || {};
    setText("meta-zone-title", config.title || "Haptic Workshop");
    setText("meta-zone-hint", config.hint || "Match the sensation");
    playground.setAttribute("aria-label", "Haptic order kiosk game");
    gameLayer.className = "slime-layer haptic-layer";
    gameLayer.innerHTML = "";

    const SAVE_KEY = "tomhy_haptic_tycoon_v1";
    const RANKINGS_KEY = "tomhy_haptic_rankings_v1";
    const NICKNAME_KEY = "tomhy_haptic_nickname_v1";
    const ORDER_SECONDS = 24;
    const RUNNER_SECONDS = 10;
    const recipes = [
        {
            mode: "thermal",
            name: "Thermal Referral",
            customer: "Create one warm point",
            unit: "heat",
            delayLabel: "Sync gap",
            delays: [0, 20, 40]
        },
        {
            mode: "vibro",
            name: "Phantom Vibration",
            customer: "Place a vibration between motors",
            unit: "buzz",
            delayLabel: "Pulse gap",
            delays: [20, 60, 100]
        },
        {
            mode: "runner",
            name: "Pulse Course",
            customer: "Clear the haptic pattern without hitting an obstacle"
        }
    ];
    const runnerPatterns = PulseCourse.patterns;
    const positions = [25, 50, 75];
    const strengths = [60, 80, 120];
    const positionNames = { 25: "LEFT", 50: "CENTER", 75: "RIGHT" };
    const strengthNames = { 60: "SOFT", 80: "MEDIUM", 120: "STRONG" };
    function readBestScore() {
        try { return Math.max(0, Number(localStorage.getItem(SAVE_KEY)) || 0); }
        catch { return 0; }
    }

    const state = {
        coins: 0,
        streak: 0,
        served: 0,
        missed: 0,
        highScore: readBestScore(),
        nickname: "",
        mode: "thermal",
        left: 60,
        right: 60,
        delay: 20,
        order: null,
        deadline: 0,
        started: false,
        locked: false,
        timerId: 0,
        paused: false,
        pausedAt: 0
    };

    function element(tag, className, text) {
        const node = document.createElement(tag);
        if (className) {
            node.className = className;
        }
        if (typeof text === "string") {
            node.textContent = text;
        }
        return node;
    }

    const scoreboard = element("div", "haptic-scoreboard");
    const coinsText = element("span", "haptic-coins");
    const streakText = element("span", "haptic-streak");
    const highText = element("span", "haptic-high");
    scoreboard.append(coinsText, streakText, highText);

    const toolbar = element("div", "haptic-toolbar");
    const phase = element("span", "haptic-phase", "HOW TO PLAY");
    const pauseButton = element("button", "haptic-pause", "Pause");
    pauseButton.type = "button";
    pauseButton.hidden = true;
    pauseButton.setAttribute("aria-pressed", "false");
    toolbar.append(phase, pauseButton);
    const help = element("p", "haptic-help");
    help.id = "haptic-help";
    playground.tabIndex = 0;
    playground.setAttribute("aria-describedby", help.id);
    const orderCard = element("section", "haptic-order");
    orderCard.setAttribute("aria-label", "Current customer order");
    const orderTop = element("div", "haptic-order-top");
    const customer = element("span", "haptic-customer", "ORDER #01");
    const timer = element("span", "haptic-timer", "24.0s");
    orderTop.append(customer, timer);
    const recipeName = element("strong", "haptic-order-name");
    const request = element("span", "haptic-order-request");
    const orderSpecs = element("div", "haptic-order-specs");

    function createOrderSpec(label) {
        const spec = element("div", "haptic-order-spec");
        const specLabel = element("span", "haptic-order-spec-label", label);
        const specValue = element("strong", "haptic-order-spec-value", "--");
        spec.append(specLabel, specValue);
        orderSpecs.appendChild(spec);
        return { label: specLabel, value: specValue };
    }

    const modeSpec = createOrderSpec("SENSATION");
    const positionSpec = createOrderSpec("POSITION");
    const strengthSpec = createOrderSpec("INTENSITY");
    const gapSpec = createOrderSpec("PULSE GAP");
    orderCard.append(orderTop, recipeName, request, orderSpecs);

    const sensationStage = element("div", "haptic-stage");
    const arm = element("div", "haptic-arm");
    const leftActuator = element("span", "haptic-actuator haptic-actuator-left", "A");
    const rightActuator = element("span", "haptic-actuator haptic-actuator-right", "B");
    const targetMarker = element("span", "haptic-marker haptic-target-marker");
    targetMarker.setAttribute("aria-label", "Customer target");
    const outputMarker = element("span", "haptic-marker haptic-output-marker");
    outputMarker.setAttribute("aria-label", "Rendered sensation");
    const wave = element("span", "haptic-wave");
    arm.append(leftActuator, rightActuator, targetMarker, outputMarker, wave);

    const runnerTrack = element("div", "haptic-runner-track");
    runnerTrack.hidden = true;
    const runnerGrid = element("span", "haptic-runner-grid");
    const runnerPlayer = element("span", "haptic-runner-player");
    runnerPlayer.setAttribute("aria-label", "Runner");
    const runnerFinish = element("span", "haptic-runner-finish", "END");
    runnerTrack.append(runnerGrid, runnerPlayer, runnerFinish);
    const runnerProgress = element("progress", "haptic-runner-progress");
    runnerProgress.max = 100;
    runnerProgress.value = 0;
    runnerProgress.hidden = true;
    runnerProgress.setAttribute("aria-label", "Course progress");

    outputMarker.addEventListener("animationend", (event) => {
        if (event.animationName === "haptic-pop") {
            outputMarker.classList.remove("is-rendering");
        }
    });
    wave.addEventListener("animationend", (event) => {
        if (event.animationName === "haptic-wave") {
            wave.classList.remove("is-rendering");
        }
    });

    const stageCaption = element("div", "haptic-stage-caption");
    const stageLegend = element("span", "haptic-stage-legend", "TARGET / OUTPUT");
    stageCaption.appendChild(stageLegend);
    sensationStage.append(arm, runnerTrack, runnerProgress, stageCaption);

    const station = element("section", "haptic-station");
    const modeControl = element("div", "haptic-mode-control");
    modeControl.setAttribute("role", "group");
    modeControl.setAttribute("aria-label", "Rendering station");
    const thermalButton = element("button", "haptic-mode is-active", "THERMAL");
    const vibroButton = element("button", "haptic-mode", "VIBRO");
    thermalButton.type = "button";
    vibroButton.type = "button";
    thermalButton.dataset.mode = "thermal";
    vibroButton.dataset.mode = "vibro";
    modeControl.append(thermalButton, vibroButton);

    const controls = element("div", "haptic-controls");

    function createStepper(key, label, min, max, step) {
        const row = element("div", "haptic-control");
        const labelText = element("span", "haptic-control-label", label);
        const valueText = element("output", "haptic-control-value");
        const heading = element("span", "haptic-control-head");
        heading.append(labelText, valueText);
        const stepper = element("div", "haptic-stepper");
        const decreaseButton = element("button", "haptic-stepper-button", "-");
        const increaseButton = element("button", "haptic-stepper-button", "+");
        decreaseButton.type = "button";
        increaseButton.type = "button";
        decreaseButton.setAttribute("aria-label", `Decrease ${label}`);
        increaseButton.setAttribute("aria-label", `Increase ${label}`);
        stepper.append(decreaseButton, increaseButton);
        row.append(heading, stepper);
        controls.appendChild(row);
        return { decreaseButton, increaseButton, labelText, valueText, min, max, step };
    }

    const leftControl = createStepper("left", "A HEAT", 0, 100, 5);
    const rightControl = createStepper("right", "B HEAT", 0, 100, 5);
    const delayControl = createStepper("delay", "SYNC GAP", 0, 120, 20);
    const thermalControls = element("div", "haptic-thermal-controls");
    thermalControls.hidden = true;
    const thermalPlacement = element("div", "haptic-thermal-placement");
    const thermalPlacementLabel = element("span", "haptic-thermal-control-label", "PLACE REFERRAL");
    const thermalPositionButtons = element("div", "haptic-thermal-position-buttons");
    const positionButtons = positions.map((position) => {
        const button = element("button", "haptic-thermal-position-button", positionNames[position]);
        button.type = "button";
        button.dataset.position = String(position);
        thermalPositionButtons.appendChild(button);
        return button;
    });
    thermalPlacement.append(thermalPlacementLabel, thermalPositionButtons);
    const thermalPump = element("div", "haptic-thermal-pump");
    const thermalPumpHead = element("div", "haptic-thermal-pump-head");
    const thermalPumpLabel = element("span", "haptic-thermal-control-label", "PUMPED HEAT");
    const thermalPumpReadout = element("output", "haptic-thermal-pump-readout", "COLD");
    thermalPumpHead.append(thermalPumpLabel, thermalPumpReadout);
    const thermalGauge = element("div", "haptic-thermal-gauge");
    thermalGauge.setAttribute("aria-label", "Pumped heat level");
    const thermalGaugeSegments = Array.from({ length: 6 }, () => {
        const segment = element("span", "haptic-thermal-gauge-segment");
        thermalGauge.appendChild(segment);
        return segment;
    });
    const thermalPumpActions = element("div", "haptic-thermal-pump-actions");
    const ventButton = element("button", "haptic-thermal-vent", "VENT");
    const pumpButton = element("button", "haptic-thermal-pump-button", "PUMP HEAT");
    ventButton.type = "button";
    pumpButton.type = "button";
    thermalPumpActions.append(ventButton, pumpButton);
    thermalPump.append(thermalPumpHead, thermalGauge, thermalPumpActions);
    thermalControls.append(thermalPlacement, thermalPump);
    const jumpButton = element("button", "haptic-jump", "TAP / HOLD TO JUMP");
    jumpButton.type = "button";
    jumpButton.hidden = true;
    jumpButton.disabled = true;
    const renderButton = element("button", "haptic-render", "SUBMIT ORDER");
    renderButton.type = "button";
    const feedback = element("div", "haptic-feedback", "NEW ORDER READY");
    feedback.setAttribute("aria-live", "polite");
    station.append(modeControl, controls, thermalControls, jumpButton, renderButton, feedback);

    const startScreen = element("section", "haptic-start-screen");
    const startEyebrow = element("span", "haptic-start-eyebrow", "SELF-SERVICE LAB");
    const startTitle = element("strong", "haptic-start-title", "HAPTIC ORDER KIOSK");
    const startCopy = element("p", "haptic-start-copy", "Match the position and heat, tune a vibration, or jump through a pulse course. Start with a thermal order; each ticket explains what to do.");
    const nicknameField = element("label", "haptic-nickname-field");
    const nicknameLabel = element("span", "haptic-nickname-label", "NICKNAME");
    const nicknameInput = element("input", "haptic-nickname-input");
    nicknameInput.type = "text";
    nicknameInput.maxLength = 12;
    nicknameInput.autocomplete = "nickname";
    nicknameInput.spellcheck = false;
    nicknameInput.placeholder = "Name (optional)";
    nicknameField.append(nicknameLabel, nicknameInput);
    const rankings = element("section", "haptic-rankings");
    rankings.setAttribute("aria-label", "Local best streak rankings");
    const rankingsTitle = element("strong", "haptic-rankings-title", "LOCAL RANKING");
    const rankingsList = element("ol", "haptic-rankings-list");
    rankings.append(rankingsTitle, rankingsList);
    const startButton = element("button", "haptic-start-button", "OPEN KIOSK");
    startButton.type = "button";
    startScreen.append(startEyebrow, startTitle, startCopy, nicknameField, rankings, startButton);
    const nextButton = element("button", "haptic-next", "Next order →");
    nextButton.type = "button";
    nextButton.hidden = true;
    station.appendChild(nextButton);
    gameLayer.append(toolbar, scoreboard, help, orderCard, sensationStage, station, startScreen);
    let pendingAction = null;

    function stopClock() {
        window.clearInterval(state.timerId);
        state.timerId = 0;
    }

    function startClock() {
        stopClock();
        state.timerId = window.setInterval(tick, 100);
    }

    function setPaused(paused) {
        if (!state.started || state.locked || state.paused === paused) return;
        state.paused = paused;
        pauseButton.textContent = paused ? "Resume" : "Pause";
        pauseButton.setAttribute("aria-pressed", String(paused));
        gameLayer.classList.toggle("is-paused", paused);
        orderCard.inert = paused;
        sensationStage.inert = paused;
        station.inert = paused;
        if (paused) {
            state.pausedAt = performance.now();
            stopClock();
            stopSyncIndicators();
            runner.heldInputs.clear();
            cancelAnimationFrame(runner.rafId);
            phase.textContent = "PAUSED · Resume when ready";
        } else {
            const now = performance.now();
            state.deadline += now - state.pausedAt;
            if (runner.active) {
                runner.startTime += now - state.pausedAt;
                runner.lastTime = now;
                runner.rafId = requestAnimationFrame(updateRunner);
            } else if (state.order.mode === "vibro") startSyncIndicators();
            phase.textContent = "MATCH THE TICKET";
            startClock();
        }
    }

    function onVisibilityChange() {
        if (document.hidden) setPaused(true);
    }
    const visibilityObserver = new IntersectionObserver(([entry]) => {
        if (!entry.isIntersecting) setPaused(true);
    });
    visibilityObserver.observe(playground);
    document.addEventListener("visibilitychange", onVisibilityChange);
    pauseButton.addEventListener("click", () => setPaused(!state.paused));
    nextButton.addEventListener("click", () => {
        const action = pendingAction;
        pendingAction = null;
        nextButton.hidden = true;
        if (action) action();
        playground.focus({ preventScroll: true });
    });

    const controlMap = {
        left: leftControl,
        right: rightControl,
        delay: delayControl
    };
    let syncLoopId = 0;
    let syncPulseTimeoutIds = [];
    let lastOrderMode = "";
    const runner = {
        active: false,
        rafId: 0,
        startTime: 0,
        lastTime: 0,
        y: 0,
        velocity: 0,
        obstacles: [],
        lives: 3,
        heldInputs: new Set(),
        holdTime: 0,
        elapsed: 0,
        accumulator: 0
    };
    const thermalGame = {
        position: 50,
        strength: 0
    };

    function normalizeNickname(value) {
        return String(value || "").trim().replace(/\s+/g, " ").slice(0, 12);
    }

    function loadRankings() {
        try {
            const saved = JSON.parse(localStorage.getItem(RANKINGS_KEY) || "[]");
            if (!Array.isArray(saved)) {
                return [];
            }
            return saved.filter((entry) => entry && typeof entry.nickname === "string");
        } catch (error) {
            return [];
        }
    }

    function renderRankings() {
        const saved = loadRankings()
            .sort((a, b) => (Number(b.bestStreak) || 0) - (Number(a.bestStreak) || 0) || (Number(b.highScore) || 0) - (Number(a.highScore) || 0))
            .slice(0, 5);
        rankingsList.innerHTML = "";

        if (saved.length === 0) {
            rankingsList.appendChild(element("li", "haptic-ranking-empty", "NO SCORES YET"));
            return;
        }

        saved.forEach((entry, index) => {
            const row = element("li", "haptic-ranking-row");
            const rank = element("span", "haptic-ranking-position", `#${index + 1}`);
            const name = element("span", "haptic-ranking-name", entry.nickname);
            const score = element("span", "haptic-ranking-score", `${Number(entry.bestStreak) || 0} STREAK`);
            row.append(rank, name, score);
            rankingsList.appendChild(row);
        });
    }

    function recordRanking() {
        const nickname = normalizeNickname(state.nickname);
        if (!nickname) {
            return;
        }

        const saved = loadRankings();
        const existing = saved.find((entry) => entry.nickname.toLowerCase() === nickname.toLowerCase());
        if (existing) {
            existing.nickname = nickname;
            existing.bestStreak = Math.max(Number(existing.bestStreak) || 0, state.streak);
            existing.highScore = Math.max(Number(existing.highScore) || 0, state.coins);
        } else {
            saved.push({ nickname, bestStreak: state.streak, highScore: state.coins });
        }

        try {
            localStorage.setItem(RANKINGS_KEY, JSON.stringify(saved));
            localStorage.setItem(NICKNAME_KEY, nickname);
        } catch (error) {
            // Ignore storage restrictions.
        }
        renderRankings();
    }

    function pulseMarker(marker, delay) {
        const visualDelay = delay * 4;
        const pulse = () => {
            marker.classList.remove("is-beeping");
            void marker.offsetWidth;
            marker.classList.add("is-beeping");
        };

        pulse();
        if (visualDelay > 0) {
            syncPulseTimeoutIds.push(window.setTimeout(pulse, visualDelay));
        }
        syncPulseTimeoutIds.push(window.setTimeout(() => marker.classList.remove("is-beeping"), Math.max(180, visualDelay + 180)));
    }

    function stopSyncIndicators() {
        window.clearInterval(syncLoopId);
        syncLoopId = 0;
        syncPulseTimeoutIds.forEach((timeoutId) => window.clearTimeout(timeoutId));
        syncPulseTimeoutIds = [];
        targetMarker.classList.remove("is-beeping");
        outputMarker.classList.remove("is-beeping");
    }

    function startSyncIndicators() {
        stopSyncIndicators();
        const pulseBoth = () => {
            if (!state.order || state.locked) {
                return;
            }
            syncPulseTimeoutIds = [];
            pulseMarker(targetMarker, state.order.delay);
            pulseMarker(outputMarker, state.delay);
        };
        pulseBoth();
        syncLoopId = window.setInterval(pulseBoth, 1100);
    }

    function stopThermalGame() {
        positionButtons.forEach((button) => {
            button.disabled = true;
        });
        pumpButton.disabled = true;
        ventButton.disabled = true;
    }

    function updateThermalSelection() {
        const rightPower = thermalGame.strength * ((thermalGame.position - 10) / 80);
        state.left = thermalGame.strength - rightPower;
        state.right = rightPower;
        state.delay = state.order.delay;
        updateOutput();
        outputMarker.style.left = `${thermalGame.position}%`;
        outputMarker.style.opacity = String(0.2 + (thermalGame.strength / 120) * 0.8);
        positionButtons.forEach((button) => {
            button.classList.toggle("is-active", Number(button.dataset.position) === thermalGame.position);
        });
        thermalGaugeSegments.forEach((segment, index) => {
            const segmentStrength = (index + 1) * 20;
            segment.classList.toggle("is-filled", segmentStrength <= thermalGame.strength);
            segment.classList.toggle("is-target", segmentStrength === state.order.strength);
        });
        thermalPumpReadout.textContent = strengthNames[thermalGame.strength] || (thermalGame.strength === 0 ? "COLD" : `${thermalGame.strength / 20} / 6`);
        pumpButton.disabled = thermalGame.strength >= 120;
        ventButton.disabled = thermalGame.strength <= 0;
        renderButton.disabled = thermalGame.strength === 0;
    }

    function resetThermalGame() {
        thermalGame.position = 50;
        thermalGame.strength = 0;
        positionButtons.forEach((button) => {
            button.disabled = false;
        });
        updateThermalSelection();
    }

    function setThermalPosition(position) {
        if (!state.started || state.locked || !state.order || state.order.mode !== "thermal") {
            return;
        }

        thermalGame.position = position;
        updateThermalSelection();
        feedback.textContent = `${positionNames[thermalGame.position]} PLACED | PUMP TO ${strengthNames[state.order.strength]}`;
    }

    function moveThermalDiamond(direction) {
        const currentIndex = positions.indexOf(thermalGame.position);
        const nextIndex = Math.max(0, Math.min(positions.length - 1, currentIndex + direction));
        setThermalPosition(positions[nextIndex]);
    }

    function adjustThermalHeat(amount) {
        if (!state.started || state.locked || !state.order || state.order.mode !== "thermal") {
            return;
        }

        thermalGame.strength = Math.max(0, Math.min(120, thermalGame.strength + amount));
        updateThermalSelection();
        if (amount > 0) {
            thermalGauge.classList.remove("is-pumping");
            void thermalGauge.offsetWidth;
            thermalGauge.classList.add("is-pumping");
            if (navigator.vibrate) {
                navigator.vibrate(18);
            }
        }
        feedback.textContent = `${thermalPumpReadout.textContent} HEAT | TARGET ${strengthNames[state.order.strength]}`;
    }

    function stopRunner() {
        runner.active = false;
        cancelAnimationFrame(runner.rafId);
        runner.rafId = 0;
        runner.obstacles.forEach((obstacle) => obstacle.element.remove());
        runner.obstacles = [];
        runner.y = 0;
        runner.velocity = 0;
        runner.heldInputs.clear();
        runnerPlayer.style.setProperty("--runner-turn", "0deg");
        runnerPlayer.style.transform = "translateY(0)";
        runnerPlayer.classList.remove("is-jumping", "is-crashed");
    }

    function finishRunner(success) {
        if (!runner.active || state.locked) {
            return;
        }

        runner.active = false;
        cancelAnimationFrame(runner.rafId);
        if (success) {
            const earned = 15 + state.streak * 2;
            state.coins += earned;
            state.streak += 1;
            state.served += 1;
            state.highScore = Math.max(state.highScore, state.coins);
            try { localStorage.setItem(SAVE_KEY, String(state.highScore)); } catch { /* Storage is optional. */ }
            recordRanking();
            updateScoreboard();
            finishOrder(`COURSE CLEARED | +${earned} COINS`, true);
        } else {
            runner.lives -= 1;
            strengthSpec.value.textContent = `${runner.lives} / 3`;
            runnerPlayer.classList.add("is-crashed");
            jumpButton.disabled = true;

            if (runner.lives > 0) {
                state.locked = true;
                feedback.textContent += ` · ${runner.lives} ${runner.lives === 1 ? "life" : "lives"} left`;
                feedback.className = "haptic-feedback is-hit";
                stopClock();
                pauseButton.hidden = true;
                phase.textContent = "TRY AGAIN WHEN READY";
                nextButton.textContent = "Retry course →";
                nextButton.hidden = false;
                pendingAction = () => {
                    state.locked = false;
                    pauseButton.hidden = false;
                    state.deadline = performance.now() + RUNNER_SECONDS * 1000;
                    timer.classList.remove("is-urgent");
                    jumpButton.disabled = false;
                    feedback.textContent = "Jump over each obstacle";
                    feedback.className = "haptic-feedback";
                    phase.textContent = "MATCH THE TICKET";
                    startRunner(state.order.pattern);
                    startClock();
                };
            } else {
                state.streak = 0;
                state.missed += 1;
                updateScoreboard();
                finishOrder("OUT OF LIVES", false);
            }
        }
    }

    function jumpRunner() {
        if (!runner.active || state.paused || state.locked || runner.y > 0) return;
        runner.velocity = 300;
        runner.holdTime = 0;
        runnerPlayer.classList.add("is-jumping");
        if (navigator.vibrate) navigator.vibrate(18);
    }

    function pressJump(input) {
        if (!runner.active || state.paused || state.locked) return;
        runner.heldInputs.add(input);
        jumpRunner();
    }

    function updateRunner(now) {
        if (!runner.active || state.paused) return;
        runner.accumulator += Math.min((now - runner.lastTime) / 1000, 0.1);
        runner.lastTime = now;
        while (runner.accumulator >= PulseCourse.step) {
            runner.accumulator -= PulseCourse.step;
            runner.elapsed += PulseCourse.step;
            PulseCourse.advance(runner, runner.heldInputs.size > 0);
            const hit = runner.obstacles.find((obstacle) => PulseCourse.collides(runner, obstacle, runner.elapsed));
            if (hit) {
                feedback.textContent = hit.kind === "ceiling" ? "Ceiling hit — use a short tap here" : "Spike hit — hold longer for tall or paired spikes";
                finishRunner(false);
                return;
            }
        }
        runnerPlayer.classList.toggle("is-jumping", runner.y > 0);
        runnerPlayer.style.transform = `translateY(${-runner.y}px)`;
        runnerPlayer.style.setProperty("--runner-turn", `${runner.y > 0 ? Math.min(90, runner.holdTime * 180) : 0}deg`);
        runner.obstacles.forEach((obstacle) => {
            const x = 28 + (obstacle.time - runner.elapsed) * PulseCourse.speed;
            obstacle.element.style.transform = `translateX(${x}px)`;
            if (!obstacle.passed && x + obstacle.width < 28) {
                obstacle.passed = true;
                obstacle.element.classList.add("is-passed");
            }
        });
        runnerGrid.style.transform = `translateX(${-((runner.elapsed * PulseCourse.speed) % 32)}px)`;
        runnerFinish.style.transform = `translateX(${28 + (RUNNER_SECONDS - runner.elapsed) * PulseCourse.speed}px)`;
        timer.textContent = `${Math.max(0, RUNNER_SECONDS - runner.elapsed).toFixed(1)}s`;
        timer.classList.toggle("is-urgent", runner.elapsed > RUNNER_SECONDS - 3);
        runnerProgress.value = Math.min(100, runner.elapsed / RUNNER_SECONDS * 100);
        if (runner.elapsed >= RUNNER_SECONDS) {
            finishRunner(true);
            return;
        }
        runner.rafId = requestAnimationFrame(updateRunner);
    }

    function startRunner(pattern) {
        stopRunner();
        runner.elapsed = 0;
        runner.accumulator = 0;
        runnerProgress.value = 0;
        runner.obstacles = pattern.obstacles.map((definition) => {
            const obstacle = element("span", `haptic-runner-obstacle is-${definition.kind}`);
            obstacle.style.width = `${definition.width}px`;
            obstacle.style.height = `${definition.height}px`;
            obstacle.style.bottom = `${10 + definition.bottom}px`;
            obstacle.style.transform = `translateX(${28 + definition.time * PulseCourse.speed}px)`;
            obstacle.setAttribute("aria-hidden", "true");
            runnerTrack.appendChild(obstacle);
            return { ...definition, element: obstacle, passed: false };
        });
        runner.active = true;
        runner.startTime = performance.now();
        runner.lastTime = runner.startTime;
        runner.rafId = requestAnimationFrame(updateRunner);
    }

    function updateScoreboard() {
        coinsText.textContent = `COINS ${state.coins}`;
        streakText.textContent = `STREAK ${state.streak}`;
        highText.textContent = `BEST ${state.highScore}`;
    }

    function outputPosition() {
        const total = state.left + state.right;
        return total === 0 ? 50 : 10 + (state.right / total) * 80;
    }

    function updateOutput() {
        const position = outputPosition();
        outputMarker.style.left = `${position}%`;
        outputMarker.style.opacity = state.left + state.right === 0 ? "0.2" : "1";
        leftActuator.style.setProperty("--power", `${state.left}%`);
        rightActuator.style.setProperty("--power", `${state.right}%`);
        delayControl.valueText.textContent = `${state.delay}ms`;
        leftControl.valueText.textContent = String(state.left);
        rightControl.valueText.textContent = String(state.right);
        Object.entries(controlMap).forEach(([key, control]) => {
            control.decreaseButton.disabled = state[key] <= control.min;
            control.increaseButton.disabled = state[key] >= control.max;
        });
    }

    function setControlLabel(control, label) {
        control.labelText.textContent = label;
        control.decreaseButton.setAttribute("aria-label", `Decrease ${label}`);
        control.increaseButton.setAttribute("aria-label", `Increase ${label}`);
    }

    function setMode(mode) {
        state.mode = mode;
        thermalButton.classList.toggle("is-active", mode === "thermal");
        vibroButton.classList.toggle("is-active", mode === "vibro");
        setControlLabel(leftControl, mode === "thermal" ? "A HEAT" : "A BUZZ");
        setControlLabel(rightControl, mode === "thermal" ? "B HEAT" : "B BUZZ");
        setControlLabel(delayControl, mode === "thermal" ? "SYNC GAP" : "PULSE GAP");
        sensationStage.dataset.mode = mode;
    }

    function nextOrder() {
        stopRunner();
        stopSyncIndicators();
        stopThermalGame();
        outputMarker.classList.remove("is-rendering");
        wave.classList.remove("is-rendering");
        const availableRecipes = recipes.filter((candidate) => candidate.mode !== lastOrderMode);
        const recipe = state.served + state.missed === 0 ? recipes[0] : availableRecipes[Math.floor(Math.random() * availableRecipes.length)];
        const isRunnerOrder = recipe.mode === "runner";
        const isPhantomOrder = recipe.mode === "vibro";
        const isThermalOrder = recipe.mode === "thermal";
        lastOrderMode = recipe.mode;
        state.order = isRunnerOrder
            ? { ...recipe, pattern: runnerPatterns[Math.floor(Math.random() * runnerPatterns.length)] }
            : {
                ...recipe,
                position: positions[Math.floor(Math.random() * positions.length)],
                strength: strengths[Math.floor(Math.random() * strengths.length)],
                delay: recipe.delays[Math.floor(Math.random() * recipe.delays.length)]
            };
        const orderSeconds = isRunnerOrder ? RUNNER_SECONDS : ORDER_SECONDS;
        state.deadline = performance.now() + orderSeconds * 1000;
        state.locked = false;
        nextButton.hidden = true;
        pauseButton.hidden = false;
        phase.textContent = "MATCH THE TICKET";
        modeControl.hidden = true;
        gapSpec.value.parentElement.hidden = !isPhantomOrder;
        gapSpec.value.textContent = `${state.order.delay}ms`;
        help.textContent = isRunnerOrder
            ? "Tap for a short jump; hold for a high jump over stacked or paired spikes. Stay low under ceiling spikes. Use JUMP, Space or ↑. Three lives."
            : isThermalOrder
                ? "1. Choose the ticket’s position. 2. Pump heat to the marked level (VENT lowers it). 3. Submit."
                : "Match position with the A/B balance, intensity with A + B, and PULSE GAP with the ticket. Then submit.";
        customer.textContent = `ORDER #${String(state.served + state.missed + 1).padStart(2, "0")}`;
        recipeName.textContent = state.order.name;
        request.textContent = state.order.customer;
        modeSpec.label.textContent = isRunnerOrder ? "ORDER" : "SENSATION";
        positionSpec.label.textContent = isRunnerOrder ? "PATTERN" : "POSITION";
        strengthSpec.label.textContent = isRunnerOrder ? "LIVES" : "INTENSITY";
        modeSpec.value.textContent = isRunnerOrder ? "RHYTHM RUN" : state.order.mode === "thermal" ? "THERMAL" : "VIBRATION";
        positionSpec.value.textContent = isRunnerOrder ? state.order.pattern.name : positionNames[state.order.position];
        runner.lives = isRunnerOrder ? 3 : runner.lives;
        strengthSpec.value.textContent = isRunnerOrder ? `${runner.lives} / 3` : strengthNames[state.order.strength];
        if (!isRunnerOrder) {
            targetMarker.style.left = `${state.order.position}%`;
            targetMarker.style.opacity = "1";
        }
        orderCard.dataset.mode = state.order.mode;
        timer.textContent = `${orderSeconds.toFixed(1)}s`;
        timer.classList.remove("is-urgent");
        sensationStage.classList.remove("is-success");
        sensationStage.classList.toggle("is-runner", isRunnerOrder);
        station.classList.toggle("is-runner", isRunnerOrder);
        station.classList.toggle("is-thermal-game", isThermalOrder);
        modeControl.classList.toggle("is-single-mode", isPhantomOrder);
        thermalButton.hidden = isPhantomOrder;
        thermalControls.hidden = !isThermalOrder;
        arm.hidden = isRunnerOrder;
        runnerTrack.hidden = !isRunnerOrder;
        runnerProgress.hidden = !isRunnerOrder;
        jumpButton.hidden = !isRunnerOrder;
        jumpButton.disabled = !isRunnerOrder;
        stageLegend.textContent = isRunnerOrder ? "TAP = LOW · HOLD = HIGH" : "TARGET / OUTPUT";
        feedback.textContent = "BUILD THE REQUEST";
        feedback.className = "haptic-feedback";
        renderButton.disabled = isRunnerOrder;
        if (isRunnerOrder) {
            feedback.textContent = "COURSE IN PROGRESS";
            startRunner(state.order.pattern);
        } else if (isThermalOrder) {
            setMode("thermal");
            resetThermalGame();
            stageLegend.textContent = "TARGET / PUMPED REFERRAL";
            feedback.textContent = `PLACE DIAMOND | PUMP TO ${strengthNames[state.order.strength]}`;
        } else {
            if (isPhantomOrder) {
                setMode("vibro");
            }
            state.left = 40;
            state.right = 40;
            state.delay = 0;
            updateOutput();
            startSyncIndicators();
        }
        startClock();
    }

    function startGame() {
        if (state.started) {
            return;
        }

        const nickname = normalizeNickname(nicknameInput.value) || "Guest";
        nicknameInput.setCustomValidity("");
        nicknameInput.value = nickname;
        state.nickname = nickname;
        recordRanking();
        state.started = true;
        startScreen.hidden = true;
        gameLayer.classList.add("is-playing");
        nextOrder();
        playground.focus({ preventScroll: true });
    }

    function finishOrder(message, success) {
        state.locked = true;
        jumpButton.disabled = true;
        stopRunner();
        stopSyncIndicators();
        stopThermalGame();
        renderButton.disabled = true;
        feedback.textContent = message;
        feedback.className = `haptic-feedback ${success ? "is-success" : "is-fail"}`;
        stopClock();
        pauseButton.hidden = true;
        phase.textContent = success ? "ORDER COMPLETE" : "ORDER FINISHED";
        nextButton.textContent = "Next order →";
        nextButton.hidden = false;
        pendingAction = nextOrder;
        nextButton.focus({ preventScroll: true });
    }

    function renderSensation() {
        if (!state.started || state.locked || !state.order || state.order.mode === "runner") {
            return;
        }

        const positionError = Math.abs(outputPosition() - state.order.position);
        const powerError = Math.abs(state.left + state.right - state.order.strength);
        const delayError = Math.abs(state.delay - state.order.delay);
        const modePenalty = state.mode === state.order.mode ? 0 : 45;
        const powerWeight = state.order.mode === "thermal" ? 1.3 : 0.35;
        const successThreshold = state.order.mode === "thermal" ? 80 : 55;
        const accuracy = Math.max(0, Math.round(100 - positionError * 1.25 - powerError * powerWeight - delayError * 0.22 - modePenalty));
        const earned = accuracy >= successThreshold ? Math.max(1, Math.round(accuracy / 10) + state.streak) : 0;

        outputMarker.classList.remove("is-rendering");
        wave.classList.remove("is-rendering");
        void outputMarker.offsetWidth;
        outputMarker.classList.add("is-rendering");
        wave.classList.add("is-rendering");

        if (state.mode === "vibro" && navigator.vibrate) {
            navigator.vibrate([40, Math.max(20, state.delay), 40]);
        }

        if (accuracy >= successThreshold) {
            state.coins += earned;
            state.streak += 1;
            state.served += 1;
            state.highScore = Math.max(state.highScore, state.coins);
            try { localStorage.setItem(SAVE_KEY, String(state.highScore)); } catch { /* Storage is optional. */ }
            recordRanking();
            sensationStage.classList.add("is-success");
            finishOrder(`RENDERING SUCCESSFUL | ${accuracy}% MATCH | +${earned} COINS`, true);
        } else {
            state.streak = 0;
            state.missed += 1;
            finishOrder(`TRY AGAIN | ${accuracy}% MATCH. Position ${Math.round(outputPosition())}% / target ${state.order.position}%; intensity ${Math.round(state.left + state.right)} / ${state.order.strength}; gap ${state.delay} / ${state.order.delay}ms.`, false);
        }
        updateScoreboard();
    }

    function tick() {
        if (state.started && !state.paused && !state.locked && state.order) {
            if (state.order.mode === "runner") return;
            const remaining = Math.max(0, state.deadline - performance.now());
            timer.textContent = `${(remaining / 1000).toFixed(1)}s`;
            timer.classList.toggle("is-urgent", remaining < 6000);
            if (remaining === 0) {
                state.streak = 0;
                state.missed += 1;
                updateScoreboard();
                finishOrder("ORDER MISSED", false);
            }
        }
    }

    [thermalButton, vibroButton].forEach((button) => {
        button.addEventListener("click", () => setMode(button.dataset.mode));
    });

    positionButtons.forEach((button) => {
        button.addEventListener("click", () => {
            setThermalPosition(Number(button.dataset.position));
        });
    });
    pumpButton.addEventListener("click", () => adjustThermalHeat(20));
    ventButton.addEventListener("click", () => adjustThermalHeat(-20));
    thermalGauge.addEventListener("animationend", () => thermalGauge.classList.remove("is-pumping"));

    Object.entries(controlMap).forEach(([key, control]) => {
        control.decreaseButton.addEventListener("click", () => {
            if (state.locked || state.paused) return;
            state[key] = Math.max(control.min, state[key] - control.step);
            updateOutput();
        });
        control.increaseButton.addEventListener("click", () => {
            if (state.locked || state.paused) return;
            state[key] = Math.min(control.max, state[key] + control.step);
            updateOutput();
        });
    });
    jumpButton.addEventListener("pointerdown", (event) => {
        if (event.button !== 0) return;
        event.preventDefault();
        jumpButton.focus({ preventScroll: true });
        jumpButton.setPointerCapture(event.pointerId);
        pressJump(`pointer-${event.pointerId}`);
    });
    const releasePointer = (event) => runner.heldInputs.delete(`pointer-${event.pointerId}`);
    jumpButton.addEventListener("pointerup", releasePointer);
    jumpButton.addEventListener("pointercancel", releasePointer);
    jumpButton.addEventListener("lostpointercapture", releasePointer);
    // Assistive technology may activate buttons without pointer/key events.
    jumpButton.addEventListener("click", (event) => { if (event.detail === 0 && !runner.heldInputs.size) jumpRunner(); });
    renderButton.addEventListener("click", renderSensation);
    startButton.addEventListener("click", startGame);
    nicknameInput.addEventListener("input", () => nicknameInput.setCustomValidity(""));
    nicknameInput.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
            startGame();
        }
    });

    function handleGameKeydown(event) {
        if (!playground.contains(event.target) || event.target.closest("input, textarea, select") || event.target.isContentEditable) return;
        if (event.code === "ArrowLeft" || event.code === "ArrowRight") event.stopPropagation();
        if (state.paused || state.locked) return;
        if (runner.active && (event.code === "Space" || event.code === "ArrowUp")) {
            event.preventDefault();
            if (event.repeat) return;
            pressJump(event.code);
        }
        if (runner.active && event.code === "Enter" && event.target === jumpButton) {
            event.preventDefault();
            if (event.repeat) return;
            pressJump(event.code);
        }
        if (state.started && !state.locked && state.order?.mode === "thermal" && (event.code === "ArrowLeft" || event.code === "ArrowRight")) {
            event.preventDefault();
            moveThermalDiamond(event.code === "ArrowLeft" ? -1 : 1);
        }
    }

    function releaseGameKey(event) { runner.heldInputs.delete(event.code); }
    function onWindowBlur() { setPaused(true); }
    window.addEventListener("keyup", releaseGameKey);
    window.addEventListener("blur", onWindowBlur);
    playground.addEventListener("keydown", handleGameKeydown);

    try {
        nicknameInput.value = normalizeNickname(localStorage.getItem(NICKNAME_KEY));
    } catch (error) {
        nicknameInput.value = "";
    }
    renderRankings();
    updateScoreboard();
    setMode(state.mode);
    updateOutput();
    customer.textContent = "KIOSK CLOSED";
    timer.textContent = "READY";
    recipeName.textContent = "No active order";
    request.textContent = "Open the kiosk to receive a customer ticket.";
    targetMarker.style.opacity = "0";
    renderButton.disabled = true;
    // No timers run while the kiosk is closed.

    slimeEngine = {
        pause() { setPaused(true); },
        stop() {
            window.clearInterval(state.timerId);
            playground.removeEventListener("keydown", handleGameKeydown);
            window.removeEventListener("keyup", releaseGameKey);
            window.removeEventListener("blur", onWindowBlur);
            document.removeEventListener("visibilitychange", onVisibilityChange);
            visibilityObserver.disconnect();
            pendingAction = null;
            stopRunner();
            stopSyncIndicators();
            stopThermalGame();
        }
    };
}

function fillCards(containerId, cards) {
    const container = document.getElementById(containerId);
    if (!container || !Array.isArray(cards)) {
        return;
    }

    container.innerHTML = "";
    cards.forEach((card) => {
        container.appendChild(createCard(card));
    });
}

function fillTimeline(containerId, entries) {
    const container = document.getElementById(containerId);
    if (!container || !Array.isArray(entries)) {
        return;
    }

    container.innerHTML = "";
    entries.forEach((entry) => {
        container.appendChild(createTimelineEntry(entry));
    });
}

function trimText(value, maxLength) {
    const text = normalizeDisplayText(value);
    if (text.length <= maxLength) {
        return text;
    }
    return `${text.slice(0, maxLength - 3)}...`;
}

function normalizeEntries(entries, mode = "as-listed") {
    if (!Array.isArray(entries)) {
        return [];
    }

    // Keep default behavior predictable: order follows content.json as written.
    if (mode === "as-listed") {
        return [...entries];
    }

    // Optional mode for future use if you decide to sort by date strings.
    if (mode === "date-desc") {
        return [...entries].sort((a, b) => String(b?.date || "").localeCompare(String(a?.date || "")));
    }

    return [...entries];
}

function getCardBrief(card) {
    if (!card) {
        return "";
    }

    if (Array.isArray(card.list) && card.list.length > 0) {
        return trimText(card.list.slice(0, 2).join(" | "), 110);
    }

    return trimText(card.text || "", 110);
}

function createProfileSectionBlock(titleText, items) {
    const block = document.createElement("section");
    block.className = "pixel-card profile-tab-block";

    const title = document.createElement("h3");
    appendFormattedText(title, titleText);
    block.appendChild(title);

    const visibleItems = Array.isArray(items)
        ? items.filter((item) => typeof item === "string"
            ? normalizeDisplayText(item)
            : item && [item.period, item.title, item.text, item.link].some(normalizeDisplayText))
        : [];

    if (visibleItems.length === 0) {
        return block;
    }

    const list = document.createElement("ul");
    visibleItems.forEach((item) => {
        const li = document.createElement("li");
        if (typeof item === "string") {
            appendFormattedText(li, item);
        } else {
            const titleRow = document.createElement("span");
            titleRow.className = "profile-item-title-row";

            const primary = document.createElement("span");
            primary.className = "profile-item-title";
            const label = [normalizeDisplayText(item.period), normalizeDisplayText(item.title)]
                .filter(Boolean)
                .join(" - ");

            const itemLink = normalizeUrl(item.link);
            if (itemLink) {
                const titleLink = document.createElement("a");
                titleLink.className = "profile-item-link";
                titleLink.href = itemLink;
                titleLink.target = "_blank";
                titleLink.rel = "noopener noreferrer";
                titleLink.ariaLabel = item.title || "Open link";
                titleLink.title = item.title || "Open link";
                appendFormattedText(titleLink, label || "Untitled");
                primary.appendChild(titleLink);

                const icon = createEntryLinkIcon(itemLink, item.title || "Open link");
                if (icon) {
                    titleRow.appendChild(primary);
                    titleRow.appendChild(icon);
                } else {
                    titleRow.appendChild(primary);
                }
            } else {
                appendFormattedText(primary, label || "Untitled");
                titleRow.appendChild(primary);
            }

            li.appendChild(titleRow);

            if (item.text) {
                const secondary = document.createElement("span");
                secondary.className = "profile-item-note";
                appendFormattedText(secondary, item.text);
                li.appendChild(secondary);
            }
        }
        list.appendChild(li);
    });
    block.appendChild(list);

    return block;
}

function fillProfileSections(data = {}) {
    const container = document.getElementById("profile-sections");
    if (!container) {
        return;
    }

    const profileTab = data.profileTab || {};
    const sections = [
    {
        title: profileTab.aboutMeTitle || "About Me",
        items: profileTab.aboutMe
    },
    {
        title: profileTab.researchExperienceTitle || "Research Experience",
        items: profileTab.researchExperience
    },
    {
        title: profileTab.honorsAwardsTitle || "Honors & Awards",
        items: profileTab.honorsAwards
    },
    {
        title: profileTab.activitiesTitle || "Activities",
        items: profileTab.activities
    }
];

    container.innerHTML = "";
    sections.forEach((section) => {
        container.appendChild(createProfileSectionBlock(section.title, section.items));
    });
}

function buildHomePreviews(data = {}) {
    const previewSettings = data.home?.previewSettings || {};
    const topCount = Math.max(1, Math.min(Number(previewSettings.topCount) || 5, 12));
    const orderMode = previewSettings.orderMode || "as-listed";

    const profileCards = Array.isArray(data.profile?.cards) ? data.profile.cards : [];
    const publicationEntries = normalizeEntries(data.publications?.entries, orderMode);
    const newsEntries = normalizeEntries(data.news?.entries, orderMode);

    const profileRecent = profileCards.slice(0, Math.min(2, topCount));
    const publicationRecent = publicationEntries.slice(0, topCount);
    const newsRecent = newsEntries.slice(0, topCount);

    return [
        {
            target: "publications",
            label: "Publications",
            title: data.home?.cardTitles?.publications || "Latest Publications",
            wide: true,
            lines: publicationRecent.length > 0
                ? publicationRecent.map((entry) => ({
                    date: normalizeDisplayText(entry.date) || "TBD",
                    title: trimText(entry.title || "Publication", 120),
                    text: trimText(normalizeDisplayText(entry.text2) || "", 90),
                    text2: trimText(normalizeDisplayText(entry.text) || "", 140),
                    link: entry.link,
                    linkLabel: "Open publication page"
                }))
                : ["Add publication entries to show latest papers."]
        },
        {
            target: "news",
            label: "News",
            title: data.home?.cardTitles?.news || "Latest News",
            lines: newsRecent.length > 0
                ? newsRecent.map((entry) => ({
                    date: normalizeDisplayText(entry.date) || "Soon",
                    title: trimText(entry.title || "Update", 74),
                    text: trimText(entry.text || "", 130),
                    text2: ""
                }))
                : ["Add news updates to show recent announcements."]
        }
    ];
}

function fillHomePreviews(data = {}) {
    const container = document.getElementById("home-grid");
    if (!container) {
        return;
    }

    container.innerHTML = "";
    const previews = buildHomePreviews(data);
    previews.forEach((preview) => {
        container.appendChild(createHomePreviewCard(preview));
    });
}

function fillProfileDock(data = {}) {
    const container = document.getElementById("dock-profile-card");
    const linksContainer = document.getElementById("dock-profile-links");
    if (!container) {
        return;
    }

    const profileCards = Array.isArray(data.profile?.cards) ? data.profile.cards : [];

    container.innerHTML = "";
    if (!linksContainer) {
        return;
    }

    linksContainer.innerHTML = "";

    if (profileCards.length === 0) {
        const notice = document.createElement("p");
        notice.className = "loading";
        notice.textContent = "Add a profile card to show snapshot.";
        container.appendChild(notice);
        return;
    }

    profileCards.forEach((card) => {
        container.appendChild(createCard(card));
    });

    const links = data.profile?.links || {};

    const linkedinUrl = normalizeUrl(links.linkedin);
    if (linkedinUrl) {
        const linkedin = document.createElement("a");
        linkedin.className = "social-link social-link-linkedin";
        linkedin.href = linkedinUrl;
        linkedin.target = "_blank";
        linkedin.rel = "noopener noreferrer";
        linkedin.ariaLabel = "LinkedIn";
        linkedin.title = "LinkedIn";
        linkedin.textContent = "LinkedIn";
        linksContainer.appendChild(linkedin);
    }

    const emailValue = normalizeUrl(links.email);
    if (emailValue) {
        const email = document.createElement("a");
        email.className = "social-link social-link-email";
        email.href = emailValue.startsWith("mailto:") ? emailValue : `mailto:${emailValue}`;
        email.ariaLabel = "Email";
        email.title = "Email";
        email.innerHTML = '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><rect x="3" y="5" width="18" height="14" rx="1"/><path d="m3 6 9 7 9-7"/></svg>';
        linksContainer.appendChild(email);
    }
}

async function loadContent() {
    try {
        const response = await fetch("data/content.json", { cache: "no-store" });
        if (!response.ok) {
            throw new Error(`Failed to load content.json (${response.status})`);
        }

        const data = await response.json();

        setText("player-label", data.meta?.playerLabel);
        setText("version-label", data.meta?.versionLabel);
        setText("footer-hint", data.meta?.footerHint);
        setText("footer-copyright", data.meta?.footerCopyright);
        initHapticTycoon(data.meta || {});

        setText("home-header", data.home?.header);
        setText("home-badge", data.home?.badge);
        setText("profile-header", data.profile?.header);
        setText("profile-badge", data.profile?.badge);
        setText("dock-profile-badge", data.profile?.dockBadge || "Profile");
        setText("publications-header", data.publications?.header);
        setText("publications-badge", data.publications?.badge);
        setText("news-header", data.news?.header);
        setText("news-badge", data.news?.badge);

        fillHomePreviews(data);
        fillProfileDock(data);
        fillProfileSections(data);
        fillTimeline("publications-timeline", data.publications?.entries);
        fillTimeline("news-timeline", data.news?.entries);
    } catch (error) {
        const containers = [
            document.getElementById("home-grid"),
            document.getElementById("dock-profile-card"),
            document.getElementById("profile-sections"),
            document.getElementById("publications-timeline"),
            document.getElementById("news-timeline")
        ];

        containers.forEach((container) => {
            if (container) {
                container.innerHTML = "";
                const notice = document.createElement("p");
                notice.className = "loading";
                notice.textContent = "Content file missing. Add data/content.json.";
                container.appendChild(notice);
            }
        });

        console.error(error);
    }
}

tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
        setActivePanel(tab.dataset.panel);
    });
});

document.addEventListener("keydown", (event) => {
    if (event.defaultPrevented || event.target.closest("#meta-playground, input, textarea, select, [contenteditable]")) return;
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") {
        return;
    }

    const currentIndex = tabs.findIndex((tab) => tab.classList.contains("active"));
    const direction = event.key === "ArrowRight" ? 1 : -1;
    const nextIndex = (currentIndex + direction + tabs.length) % tabs.length;
    const nextTab = tabs[nextIndex];

    setActivePanel(nextTab.dataset.panel);
    nextTab.focus();
});

loadContent();
