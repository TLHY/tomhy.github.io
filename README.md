# tomhy.github.io

## Homepage File Organization

- index.html: layout and section placeholders only.
- assets/css/styles.css: all visual styles (Game Boy pixel-retro theme).
- assets/js/app.js: tab behavior, slime animation, and dynamic rendering from JSON.
- data/content.json: all editable homepage content.

## How To Update Content

Edit only data/content.json to change content in:

- meta labels and slime playground settings (meta)
- home preview behavior and card titles (home)
- profile cards (profile.cards)
- publications timeline (publications.entries)
- news timeline (news.entries)

## Home Preview Settings

The Home tab automatically shows recent highlights from each section.

- home.previewSettings.topCount: number of items shown per section (currently 5).
- home.previewSettings.orderMode:
	- as-listed: uses the exact order from content.json.
	- date-desc: optional auto-sort by date text (publications/news).
- home.cardTitles: custom title for each Home preview card.

## Slime Playground Settings

Configure the interactive slimes under meta.playground:

- title, hint
- slimeCount
- minSize, maxSize
- speed
- reactionRadius
- colors (array of hex color values)

Each card supports:

- title + text
- or title + list (array of bullet items)
- optional image + imageAlt

Each timeline entry supports:

- date
- title
- text
- optional text2 (additional information line)
- optional link (shows page-link icon)
- optional image + imageAlt

## Text Formatting

Use double asterisks for bold text inside text/list fields:

- Example: `I am a **PhD student** in KAIST.`

Line breaks are also supported by using new lines in the text value.


## Local development

Serve this checkout with Python; no package installation or build step is needed:

```sh
python3 -m http.server 8000 --bind 127.0.0.1
```

The homepage uses `assets/css/readability.css` for its reading layout and pixel-park backdrop. The former kiosk has been replaced by Mochi’s Lab; the older playground settings above describe the legacy mini-game.

## Research Game — Sensory Spire

Open `haptic-lab.html`, use the homepage sidebar, or click Mochi and choose **Research Game**. The English deck-building roguelike includes seven branching floors, normal/elite encounters, camps, treasure, events, and a final boss. Choose a Vibration (multi-hit/Amplify), Thermal (Heat/defense), or Multimodal (draw/Vulnerable) starter deck. Card rewards guarantee at least one matching card while allowing mixed decks.

HP, cards, upgrades, and relics persist between encounters. Runs save in browser storage when available. On mobile, swipe the hand horizontally. Mochi shares artwork with the homepage companion and has idle, attack, block, hit, healing, and victory animations. Game rules are inspired by haptics research, not a simulation of real perceptual responses. No audio or device vibration is used.

- `assets/js/haptic-run-engine.js`: deterministic rules, cards, encounters, routes, and save validation.
- `assets/js/haptic-run.js` and `assets/css/haptic-run.css`: game interface and monster artwork.
- `assets/js/mochi-art.js`: artwork shared by the companion and research-game hero.

## Writing Game — Draft After Dark

Open `writing-game.html`, use the sidebar, or click Mochi and choose **Writing Game**. This separate survivor / bullet-hell game has three 35-second survival chapters alternating with 14-second proofreading patterns, followed by a final boss with a 50-second deadline.

- WASD/arrows or the mobile stick moves the player; the pen auto-targets enemies.
- Collect ink to level up and choose pen damage/rate, extra shots, orbiting commas, revision waves, movement, pickup radius, or healing upgrades.
- Space / DASH gives a brief invulnerable burst with a three-second cooldown.
- White bullets always hurt; blue hurts while moving; orange hurts while stationary. B/O markers accompany their colors.
- The final Inner Editor confines movement to a correction box. Its script alternates moving margins, warned deletion beams, gravity underlines, and blue/orange walls. In gravity mode, Up/W/Space or the JUMP button jumps; holding jumps higher. Below half HP, barriers accelerate from 225 to 300 pixels/second and the pattern cycle shortens from 20 to 16 seconds.
- P/Esc pauses. Switching tabs/windows automatically pauses and requires explicit resume. Level-up choices also stop game time.
- Best ink-cleared and level results save locally when storage is available. Runs themselves do not survive a reload. No sound or vibration is used.

Rules and rendering are separated into `assets/js/writing-game-engine.js` and `assets/js/writing-game.js`.

## Mochi’s Lab and shared progression

Mochi starts at home on each page load. Click the bed, berry bowl, desk, or toy to nap, feed, study, or play. Use **Take a walk / Call home**, or hold and carry Mochi to another border. A profile shortcut jumps to the lab on mobile.

Lab Gold is separate from Sensory Spire’s Run Gold:

- Research Game: normal fight 10, elite 20, cache 8, final boss 60.
- Writing Game: `floor(kills / 4) + 3 * (level - 1)`, plus 50 for a victory, paid when the run ends.

Stable per-room/run receipts prevent repeated claims after reload. The local wallet uses Web Locks when available and storage events to sync tabs. Same-origin navigation waits for pending wallet transactions.

Furniture upgrades affect room visuals and care: Cloud Mattress (30), Berry Garden (25), Research Desk (45), Firefly Lamp (20), Archive Shelf (60), and Window Extension (90). Currency and ownership persist in this browser; there is no account/backend. If storage is unavailable, the room displays a page-only progress notice.

- `assets/js/mochi-economy.js`: pure wallet/reward rules and browser storage adapter.
- `assets/js/mochi-lab.js` and `assets/css/mochi-lab.css`: room, furniture, and shop.
- `assets/js/slime-companion.js`: care, home, dragging, and exploration behavior.

## Validation

Run the deterministic rules tests without installing dependencies:

```sh
node tests/haptic-run.test.cjs
node tests/writing-game.test.cjs
node tests/mochi-economy.test.cjs
node tests/pulse-course.test.cjs
```
