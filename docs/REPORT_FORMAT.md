# Gaming Pulse report format

Automated writers commit one Markdown file per calendar day:

```text
content/reports/YYYY-MM-DD.md
```

The filename is the Eastern-time calendar date. The first run of the day **creates** the file. Later runs **update the frontmatter** and **append or replace** one edition section in the body. Do not create a second file for the same day.

The Astro collection loads `content/reports` with a glob loader and validates this shape. A file with only the morning edition is valid. Afternoon and evening sections are appended later. Unknown frontmatter keys are kept, so a writer can add fields without breaking the build.

## Frontmatter

```yaml
---
title: "Gaming Pulse — November 27, 2026"
date: 2026-11-27
description: "Single line, ideally under 160 characters."
tags:
  - pc
  - industry
cover: /images/covers/2026-11-27.jpg
updated: 2026-11-27T20:05:12-05:00
sample: false
editions:
  - id: morning
    title: Morning Edition
    publishedAt: 2026-11-27T08:00:00-05:00
    summary: "One sentence lead for this edition."
  - id: afternoon
    title: Afternoon Edition
    publishedAt: 2026-11-27T14:00:00-05:00
    summary: "One sentence lead for this edition."
  - id: evening
    title: Evening Edition
    publishedAt: 2026-11-27T20:00:00-05:00
    summary: "One sentence lead for this edition."
---
```

| Field | Required | Notes |
| --- | --- | --- |
| `title` | yes | Day headline. Keep it stable across editions. |
| `date` | yes | `YYYY-MM-DD`. An unquoted YAML date or a quoted string both validate. |
| `description` | yes | Single line. The homepage and meta description use it. Refresh it to the latest edition's lead when you append. |
| `tags` | no | Array of strings. Defaults to `[]`. Lowercase, hyphenated if needed (`black-friday`). |
| `cover` | no | Site path (`/images/...`) or absolute `https` URL. Omit the key when there is no image. |
| `updated` | yes | ISO 8601 timestamp with the America/New_York offset (`-05:00` or `-04:00`). Set this on every run. |
| `sample` | no | `true` only for demonstration files. Automated runs write `false`. Defaults to `false`. |
| `editions` | yes | One or more edition objects, in morning → afternoon → evening order. |

### Edition object

| Field | Required | Notes |
| --- | --- | --- |
| `id` | yes | `morning`, `afternoon`, or `evening`. Any non-empty id still builds; these three are the ones the schedule produces. The id is the in-page anchor. |
| `title` | yes | `Morning Edition`, `Afternoon Edition`, or `Evening Edition`. |
| `publishedAt` | yes | Slot time for that edition on the file's date: `08:00:00`, `14:00:00`, or `20:00:00` with the Eastern offset. |
| `summary` | no | One sentence. Shown on the edition jump links and in the RSS item. |

Extra keys on the document or on an edition (for example `sources` or `model`) are preserved and do not fail validation.

## Body

Start the body with an optional note only when `sample: true`. Live files go straight to the first edition.

Each edition is a span anchor, then a level-2 heading, then an italic time label, then level-3 story headings. The anchor id **must** equal the edition `id`.

```markdown
<span id="morning"></span>

## Morning Edition

_8:00 AM ET_

Opening paragraph for the edition.

### Story headline

Two to four sentences. Name the outlet and link it. Do not invent quotes, prices, or numbers that were not in the source.

- [Outlet](https://example.com/story)
```

Time labels:

| Edition | Heading | Anchor | Italic label |
| --- | --- | --- | --- |
| Morning | `## Morning Edition` | `<span id="morning"></span>` | `_8:00 AM ET_` |
| Afternoon | `## Afternoon Edition` | `<span id="afternoon"></span>` | `_2:00 PM ET_` |
| Evening | `## Evening Edition` | `<span id="evening"></span>` | `_8:00 PM ET_` |

The site's edition nav links to `#morning`, `#afternoon`, and `#evening`.

## Create (first run of the day)

Write the full file: frontmatter with a single edition object, then that edition's section. `updated` is the run time. `sample` is `false`. `title` is `Gaming Pulse — {Month D, YYYY}`.

## Append (later runs the same day)

This is the exact block to add when the evening edition is new. Afternoon and morning use the same shape with their own id, heading, and time label. Put a blank line between the previous edition and this block.

```markdown
<span id="evening"></span>

## Evening Edition

_8:00 PM ET_

Opening paragraph for the edition.

### Story headline

Paragraph with a named outlet and a markdown link. Only include facts that are in the source list.

- [Outlet](https://example.com/story)
```

On the same commit, update the frontmatter:

1. Set `updated` to the run time, Eastern offset included.
2. Append this object under `editions` (keep earlier editions):

```yaml
  - id: evening
    title: Evening Edition
    publishedAt: 2026-11-27T20:00:00-05:00
    summary: "One sentence lead."
```

3. Refresh `description` to a single line for the latest edition.
4. Merge new tags onto the existing list. Do not drop tags from earlier editions.
5. Leave `title`, `date`, `cover`, and `sample` as they are.

If that edition's `<span id="evening"></span>` is already in the file, replace from that span through the character before the next `<span id="...">` (or end of file). Do not add a second copy of the same edition.

## Schedule

| Edition | America/New_York |
| --- | --- |
| Morning | 8:00 |
| Afternoon | 14:00 |
| Evening | 20:00 |

A run before noon writes `morning`. A run from noon until before 6:00 PM writes `afternoon`. A run from 6:00 PM on writes `evening`.
