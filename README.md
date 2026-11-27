# Gaming Pulse

A static daily briefing for people who play games. Three editions share one file per day: morning around 8:00 AM Eastern, afternoon around 2:00 PM, and evening around 8:00 PM.

The site is [Astro](https://astro.build/) with static output. Reports live in `content/reports/YYYY-MM-DD.md` and are loaded by a content collection. The published site is [https://t-el.github.io/gaming-pulse/](https://t-el.github.io/gaming-pulse/).

## Develop

```bash
npm install
npm run dev
```

```bash
npm run build
```

`npm run build` writes the site to `dist/`.

## Pages

| URL | What it is |
| --- | --- |
| `/` | Latest briefing, with edition jump links, plus older days |
| `/reports/YYYY-MM-DD/` | One day, with anchors for each edition |
| `/archive/` | Months that have a briefing |
| `/archive/YYYY/MM/` | Briefings in that month |
| `/tags/` and `/tags/:tag/` | Tags from frontmatter |
| `/rss.xml` | One feed item per edition |
| `sitemap-index.xml` | Generated at build time |

## Reports

The writer contract is [docs/REPORT_FORMAT.md](docs/REPORT_FORMAT.md). Frontmatter is `title`, `date`, `description`, `tags`, optional `cover`, `updated`, `sample`, and an `editions` list. The first run of a day creates the file. Later runs append a `## Evening Edition` section (or morning / afternoon) and update the frontmatter. The schema allows a partial day, and it keeps extra keys.

`content/reports/2026-11-27.md` is **sample content** so the build has a page to render. It is marked `sample: true` and with a banner on the page. A real writer should replace that day or start the next one.

How a writer commits the file is [automation/README.md](automation/README.md): Option A is an external routine using the GitHub API, Option B is an n8n workflow you import.

## GitHub Pages

[`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) builds the site and deploys it with `actions/deploy-pages` on every push to `main`.

In the repository settings, set **Settings → Pages → Build and deployment → Source** to **GitHub Actions**. Until that source is selected, the workflow can succeed and the site will not update.

`astro.config.mjs` sets `site` to `https://t-el.github.io` and `base` to `/gaming-pulse` so asset and page URLs match the project site.
