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

    if (!Array.isArray(items) || items.length === 0) {
        const empty = document.createElement("p");
        empty.className = "profile-empty";
        empty.textContent = "Add entries in content.json.";
        block.appendChild(empty);
        return block;
    }

    const list = document.createElement("ul");
    items.forEach((item) => {
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
        linkedin.textContent = "in";
        linksContainer.appendChild(linkedin);
    }

    const emailValue = normalizeUrl(links.email);
    if (emailValue) {
        const email = document.createElement("a");
        email.className = "social-link social-link-email";
        email.href = emailValue.startsWith("mailto:") ? emailValue : `mailto:${emailValue}`;
        email.ariaLabel = "Email";
        email.title = "Email";
        email.textContent = "@";
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
        initSlimePlayground(data.meta || {});

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
