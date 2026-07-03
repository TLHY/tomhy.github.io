# tomhy.github.io

## Homepage File Organization

- `index.html`: layout and section placeholders only.
- `assets/css/styles.css`: all visual styles (Game Boy pixel-retro theme).
- `assets/js/app.js`: tab behavior and dynamic rendering from JSON.
- `data/content.json`: all editable homepage content.

## How To Update Content

Edit only `data/content.json` to change text in:

- hero section (`meta`)
- profile cards (`profile.cards`)
- project cards (`projects.cards`)
- publications timeline (`publications.entries`)
- news timeline (`news.entries`)
- life log cards (`life.cards`)

Each card supports:

- `title` + `text`
- or `title` + `list` (array of bullet items)

Each timeline entry supports:

- `date`
- `title`
- `text`