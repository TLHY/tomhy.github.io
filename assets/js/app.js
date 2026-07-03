const tabs = Array.from(document.querySelectorAll(".pak-tab"));
const panels = Array.from(document.querySelectorAll(".panel"));

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

    const title = document.createElement("h3");
    title.textContent = card.title || "Untitled";
    article.appendChild(title);

    if (Array.isArray(card.list) && card.list.length > 0) {
        const ul = document.createElement("ul");
        card.list.forEach((item) => {
            const li = document.createElement("li");
            li.textContent = item;
            ul.appendChild(li);
        });
        article.appendChild(ul);
    } else {
        const paragraph = document.createElement("p");
        paragraph.textContent = card.text || "";
        article.appendChild(paragraph);
    }

    return article;
}

function createTimelineEntry(entry) {
    const wrapper = document.createElement("div");
    wrapper.className = "timeline-entry";

    const time = document.createElement("time");
    time.textContent = entry.date || "TBD";

    const card = document.createElement("div");
    card.className = "pixel-card";

    const title = document.createElement("h3");
    title.textContent = entry.title || "Untitled";

    const paragraph = document.createElement("p");
    paragraph.textContent = entry.text || "";

    card.appendChild(title);
    card.appendChild(paragraph);
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

async function loadContent() {
    try {
        const response = await fetch("data/content.json", { cache: "no-store" });
        if (!response.ok) {
            throw new Error(`Failed to load content.json (${response.status})`);
        }

        const data = await response.json();

        setText("site-title", data.meta?.heroTitle);
        setText("site-subtitle", data.meta?.heroSubtitle);
        setText("player-label", data.meta?.playerLabel);
        setText("version-label", data.meta?.versionLabel);
        setText("footer-hint", data.meta?.footerHint);
        setText("footer-copyright", data.meta?.footerCopyright);

        setText("profile-header", data.profile?.header);
        setText("profile-badge", data.profile?.badge);
        setText("projects-header", data.projects?.header);
        setText("projects-badge", data.projects?.badge);
        setText("publications-header", data.publications?.header);
        setText("publications-badge", data.publications?.badge);
        setText("news-header", data.news?.header);
        setText("news-badge", data.news?.badge);
        setText("life-header", data.life?.header);
        setText("life-badge", data.life?.badge);

        fillCards("profile-grid", data.profile?.cards);
        fillCards("projects-grid", data.projects?.cards);
        fillTimeline("publications-timeline", data.publications?.entries);
        fillTimeline("news-timeline", data.news?.entries);
        fillCards("life-grid", data.life?.cards);
    } catch (error) {
        const containers = [
            document.getElementById("profile-grid"),
            document.getElementById("projects-grid"),
            document.getElementById("publications-timeline"),
            document.getElementById("news-timeline"),
            document.getElementById("life-grid")
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
