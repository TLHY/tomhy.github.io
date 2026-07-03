const tabs = Array.from(document.querySelectorAll(".pak-tab"));
const panels = Array.from(document.querySelectorAll(".panel"));
let slimeEngine = null;

function normalizeUrl(value) {
    if (typeof value !== "string") {
        return "";
    }

    const trimmed = value.trim();
    if (!trimmed) {
        return "";
    }

    if (trimmed.startsWith("[") && trimmed.endsWith("]")) {
        return trimmed.slice(1, -1).trim();
    }

    return trimmed;
}

function appendFormattedText(container, text) {
    const content = typeof text === "string" ? text : "";
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

                const titleText = document.createElement("span");
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
    time.textContent = entry.date || "TBD";

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
        element.textContent = value;
    }
}

function randomBetween(min, max) {
    return Math.random() * (max - min) + min;
}

function initSlimePlayground(meta = {}) {
    const playground = document.getElementById("meta-playground");
    const slimeLayer = document.getElementById("slime-layer");
    const zoneTitle = document.getElementById("meta-zone-title");
    const zoneHint = document.getElementById("meta-zone-hint");

    if (!playground || !slimeLayer) {
        return;
    }

    if (slimeEngine && typeof slimeEngine.stop === "function") {
        slimeEngine.stop();
    }

    const config = meta.playground || {};
    const count = Math.max(2, Math.min(Number(config.slimeCount) || 6, 16));
    const minSize = Math.max(22, Number(config.minSize) || 30);
    const maxSize = Math.max(minSize, Number(config.maxSize) || 44);
    const speed = Math.max(12, Number(config.speed) || 42);
    const reactionRadius = Math.max(50, Number(config.reactionRadius) || 90);
    const colors = Array.isArray(config.colors) && config.colors.length > 0
        ? config.colors
        : ["#94d66a", "#73c66d", "#6ab88a", "#b4e36f", "#79d499"];

    setText("meta-zone-title", config.title || "Slime Meadow");
    setText("meta-zone-hint", config.hint || "Move your cursor to play");

    slimeLayer.innerHTML = "";

    const slimes = [];
    let rafId = 0;
    let lastTime = performance.now();
    const cursor = {
        x: -9999,
        y: -9999,
        active: false
    };

    function getBounds() {
        const layerRect = slimeLayer.getBoundingClientRect();
        return {
            width: Math.max(80, layerRect.width),
            height: Math.max(60, layerRect.height)
        };
    }

    function placeSlime(slime, bounds) {
        slime.x = randomBetween(0, Math.max(1, bounds.width - slime.size));
        slime.y = randomBetween(0, Math.max(1, bounds.height - slime.size));
    }

    for (let i = 0; i < count; i += 1) {
        const slime = document.createElement("div");
        slime.className = "slime";
        const size = randomBetween(minSize, maxSize);
        slime.style.setProperty("--slime-size", `${Math.round(size)}px`);
        slime.style.setProperty("--slime-color", colors[i % colors.length]);

        slime.addEventListener("mouseenter", () => {
            slime.classList.add("is-alert", "is-bop");
            setTimeout(() => slime.classList.remove("is-bop"), 230);
        });

        slime.addEventListener("mouseleave", () => {
            slime.classList.remove("is-alert");
        });

        slimeLayer.appendChild(slime);

        slimes.push({
            el: slime,
            size,
            x: 0,
            y: 0,
            vx: randomBetween(-1, 1) * speed,
            vy: randomBetween(-1, 1) * speed,
            wobbleOffset: randomBetween(0, Math.PI * 2),
            alertUntil: 0
        });
    }

    const initialBounds = getBounds();
    slimes.forEach((slime) => placeSlime(slime, initialBounds));

    function updateVisual(slime, now) {
        const wobble = Math.sin(now * 0.006 + slime.wobbleOffset) * 0.08;
        slime.el.style.transform = `translate(${slime.x}px, ${slime.y}px) scale(${1 + wobble}, ${1 - wobble})`;
    }

    function tick(now) {
        const dt = Math.min((now - lastTime) / 1000, 0.05);
        lastTime = now;
        const bounds = getBounds();

        slimes.forEach((slime) => {
            let ax = 0;
            let ay = 0;

            if (cursor.active) {
                const slimeCenterX = slime.x + slime.size / 2;
                const slimeCenterY = slime.y + slime.size / 2;
                const dx = slimeCenterX - cursor.x;
                const dy = slimeCenterY - cursor.y;
                const dist = Math.sqrt(dx * dx + dy * dy) || 1;

                if (dist < reactionRadius) {
                    const force = (reactionRadius - dist) / reactionRadius;
                    ax += (dx / dist) * force * 220;
                    ay += (dy / dist) * force * 220;
                    slime.alertUntil = now + 140;
                }
            }

            slime.vx += ax * dt;
            slime.vy += ay * dt;

            const maxVelocity = speed * 1.8;
            slime.vx = Math.max(-maxVelocity, Math.min(maxVelocity, slime.vx));
            slime.vy = Math.max(-maxVelocity, Math.min(maxVelocity, slime.vy));

            slime.x += slime.vx * dt;
            slime.y += slime.vy * dt;

            if (slime.x <= 0 || slime.x >= bounds.width - slime.size) {
                slime.vx *= -1;
                slime.x = Math.max(0, Math.min(bounds.width - slime.size, slime.x));
            }

            if (slime.y <= 0 || slime.y >= bounds.height - slime.size) {
                slime.vy *= -1;
                slime.y = Math.max(0, Math.min(bounds.height - slime.size, slime.y));
            }

            slime.vx *= 0.994;
            slime.vy *= 0.994;

            if (now < slime.alertUntil) {
                slime.el.classList.add("is-alert");
            } else if (!slime.el.matches(":hover")) {
                slime.el.classList.remove("is-alert");
            }

            updateVisual(slime, now);
        });

        rafId = requestAnimationFrame(tick);
    }

    function onPointerMove(event) {
        const rect = slimeLayer.getBoundingClientRect();
        cursor.x = event.clientX - rect.left;
        cursor.y = event.clientY - rect.top;
        cursor.active = true;
    }

    function onPointerLeave() {
        cursor.active = false;
        cursor.x = -9999;
        cursor.y = -9999;
    }

    slimeLayer.addEventListener("pointermove", onPointerMove);
    slimeLayer.addEventListener("pointerleave", onPointerLeave);

    const onResize = () => {
        const bounds = getBounds();
        slimes.forEach((slime) => {
            slime.x = Math.max(0, Math.min(bounds.width - slime.size, slime.x));
            slime.y = Math.max(0, Math.min(bounds.height - slime.size, slime.y));
        });
    };

    window.addEventListener("resize", onResize);

    rafId = requestAnimationFrame(tick);

    slimeEngine = {
        stop() {
            cancelAnimationFrame(rafId);
            slimeLayer.removeEventListener("pointermove", onPointerMove);
            slimeLayer.removeEventListener("pointerleave", onPointerLeave);
            window.removeEventListener("resize", onResize);
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
    const text = typeof value === "string" ? value.trim() : "";
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
            const label = [item.period, item.title].filter(Boolean).join(" - ");

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
                    title: `${entry.date || "TBD"} - ${trimText(entry.title || "Publication", 120)}`,
                    text: entry.text || "",
                    text2: entry.text2 || "",
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
                ? newsRecent.map((entry) => `${entry.date || "Soon"} - ${trimText(entry.title || "Update", 64)}`)
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
