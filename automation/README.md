# Writing the daily briefing

Gaming Pulse publishes three editions a day from one Markdown file:

```text
content/reports/YYYY-MM-DD.md
```

The file format is fixed. Both options below must follow [docs/REPORT_FORMAT.md](../docs/REPORT_FORMAT.md). A push to `main` runs the GitHub Pages workflow and publishes the site. The Pages source in the repository settings has to be **GitHub Actions** or that workflow never deploys.

Use one writer, not both, or the two will race on the same file.

Times are **8:00, 14:00, and 20:00 America/New_York**.

## Option A — an external routine commits with the GitHub API

An agent, cron job, or other runner outside this repo calls the GitHub Contents API and commits straight to `main`. No workflow file in this repo runs the writer. The routine owns the schedule, the model, and the credential.

1. Schedule three runs per day at 08:00, 14:00, and 20:00 in `America/New_York`.
2. Fetch a handful of public gaming RSS feeds (IGN, GameSpot, Polygon, PC Gamer, Eurogamer are the ones Option B uses).
3. Ask the model for one edition in the shape documented in `docs/REPORT_FORMAT.md`: a summary, a description, tags, and the story markdown. It should only use those fetched items.
4. Read today's file:

   `GET /repos/t-el/gaming-pulse/contents/content/reports/YYYY-MM-DD.md?ref=main`

5. If the response is **404**, `PUT` a new file. The body is the full template: frontmatter for that one edition, then the edition section.
6. If the response is **200**, base64-decode `content`, update `updated`, `description`, `tags`, and the `editions` list, and append the edition section (or replace it when that edition's anchor is already present). `PUT` the file back with the returned `sha`, `branch` set to `main`, and a message such as `Add evening edition for 2026-11-27`.
7. The token needs contents write on this repository. Store it in the runner's secret store. Do not commit it.

The Contents API docs: [Create or update file contents](https://docs.github.com/en/rest/repos/contents#create-or-update-file-contents).

## Option B — import the n8n workflow

The importable workflow is [n8n/gaming-pulse-reports.json](n8n/gaming-pulse-reports.json). It does not contain API keys. Credential fields are placeholders you replace after import.

1. In n8n, import `automation/n8n/gaming-pulse-reports.json`.
2. Confirm the workflow timezone is `America/New_York` (Workflow settings → Timezone). The schedule trigger fires at 8:00, 14:00, and 20:00 in that timezone. If the timezone is UTC, the editions will be written at the wrong clock time.
3. Open the **Write edition** node and attach an OpenAI-compatible credential named for your provider.
   - **xAI:** API key from the xAI console. Set the credential base URL to `https://api.x.ai/v1` when the credential form has a base URL field. The node defaults to model id `grok-4`. Change that id if your key serves a different model.
   - **OpenAI:** the same node and credential type. Leave the base URL at `https://api.openai.com/v1` and set the model id to a model that key can call, such as `gpt-4o-mini`.
4. Open **Get today's report**, **Create report on main**, and **Update report on main**. Attach a GitHub access token credential with contents write on `t-el/gaming-pulse`. The nodes are already pointed at owner `t-el`, repository `gaming-pulse`, and branch `main`.
5. Execute the workflow once by hand and read the commit on `main` before you activate it. Then activate the workflow.

What the canvas does:

1. **Schedule trigger** at 08:00, 14:00, and 20:00.
2. **Resolve edition** picks morning, afternoon, or evening from the Eastern hour and builds today's file path.
3. **Read RSS** pulls IGN, GameSpot, Polygon, PC Gamer, and Eurogamer. One failed feed does not stop the others.
4. **Write edition** calls the chat-completions model and asks for JSON: `description`, `summary`, `tags`, and story `markdown`.
5. **Get today's report** loads `content/reports/YYYY-MM-DD.md` from `main`. A 404 continues so the first run of the day can create the file.
6. **Compose report file** turns the model JSON into the format in `docs/REPORT_FORMAT.md`. It creates the file, or appends the edition, or replaces that edition when its anchor is already there.
7. **Create report on main** or **Update report on main** commits the result.

The model is instructed not to invent facts beyond the RSS items. The compose node still only checks shape. Read the commit if a feed was thin.
