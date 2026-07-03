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