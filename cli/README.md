# ethiopiamd

> Command-line tool for [Ethiopia.md](https://ethiopia.md), the open-source, AI-native knowledge base about Ethiopia.

Search and read published Ethiopia.md articles from your terminal. Articles are written in Amharic first, with English translations. Only articles marked `published` are shown; drafts and archived pages are never listed, searched or read.

The package is not yet published to npm, so run it from a clone of this repository.

## Install and run

Requires Node.js 18 or later.

```bash
cd cli
npm install
node src/index.js --help
```

To get an `ethiopiamd` command on your PATH from the local clone:

```bash
cd cli
npm link
ethiopiamd --help
```

When run inside the repository, the CLI reads `knowledge/` directly, so it always reflects your checkout. Outside the repository, it syncs the knowledge base to `~/.ethiopiamd/knowledge/` on first use (see `sync`).

## Languages

- `am` (Amharic) is the default and the source of truth.
- `en` (English) is available with `--en` or `--lang en`.

No other language codes are supported.

## Commands

Examples below use commands that return results from the current published corpus.

### `ethiopiamd search <query>`

Search published articles by title, tags and description.

```bash
node src/index.js search adwa                 # Amharic results (default)
node src/index.js search adwa --en            # English results
node src/index.js search adwa --json          # JSON output
node src/index.js search injera --limit 3     # Limit the number of results
```

### `ethiopiamd read <slug>`

Render an article in the terminal. The slug is the file name without `.md`.

```bash
node src/index.js read battle-of-adwa              # Amharic
node src/index.js read injera-and-teff --en        # English
node src/index.js read battle-of-adwa --raw        # Raw Markdown, for scripts and LLMs
node src/index.js read battle-of-adwa --web        # Open on ethiopia.md (macOS `open`)
```

If an English version does not exist, `read --en` shows the Amharic original and says so.

### `ethiopiamd list [category]`

Browse published articles by category.

```bash
node src/index.js list --categories           # Categories with article counts
node src/index.js list history                # Articles in one category
node src/index.js list history --sort title   # Sort by date (default), words or title
node src/index.js list --featured --json      # Only featured articles, as JSON
```

### `ethiopiamd random`

```bash
node src/index.js random
node src/index.js random --category food
```

### `ethiopiamd today`

Shows a daily pick of published articles and facts.

### `ethiopiamd rag <query>`

Retrieve the top matching articles as prompt-ready context for an LLM.

```bash
node src/index.js rag "Adwa" --limit 1 --no-prompt
node src/index.js rag "Ethiopian coffee ceremony" | llm "Summarize this"
```

Options: `-l, --limit <n>` (default 3), `--no-prompt`, `--json`.

### `ethiopiamd graph <slug>`

Show the `[[wikilink]]` relationships around one article.

### `ethiopiamd validate <slug>`

Score one article for editorial quality: frontmatter fields, length, `##` headings, reference links, and common AI filler phrases. Use `--json` for CI and `--fix` for suggested changes.

### `ethiopiamd stats`

Project statistics and dashboard health scores. `--json` for machine-readable output.

### `ethiopiamd sync`

Clone or update the knowledge base into `~/.ethiopiamd/knowledge/` (git sparse checkout). Use `--force` to re-clone.

### `ethiopiamd quiz`, `explore`, `diff`, `contribute`

- `quiz`: five true/false questions about Ethiopia.
- `explore`: interactive terminal search.
- `diff`: article changes over recent days (`--days <n>`).
- `contribute <topic>`: guided creation of a new article skeleton.

## For AI and scripting

```bash
# Pipe an article into an LLM
node src/index.js read battle-of-adwa --raw | llm "Summarize this article"

# Export search results as JSON
node src/index.js search "Ethiopia" --json | jq '.[].title'
```

## Development

```bash
cd cli
npm install
node src/index.js --help
node --check src/index.js        # quick syntax check
```

Visibility rules live in `src/lib/knowledge.js` (`isVisibleArticle`):

- `status: published` articles are shown, including `_`-prefixed Hub files.
- `status: draft` and `status: archived` articles are hidden everywhere.
- Files without a `status` are shown unless their name starts with `_`.

## Links

- Website: [ethiopia.md](https://ethiopia.md)
- GitHub: [EyuReaper/ethiopia-md](https://github.com/EyuReaper/ethiopia-md)
- Claude Code skills: `/ethiopiamd-search` and `/ethiopiamd-validate` in `.claude/skills/`
