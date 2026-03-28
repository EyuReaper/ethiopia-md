# taiwanmd

> CLI for [Taiwan.md](https://taiwan.md) — the open-source, AI-native knowledge base about Taiwan.

Search, read, and explore 900+ curated articles about Taiwan from your terminal.

## Install

```bash
npm install -g taiwanmd
```

Or run without installing:

```bash
npx taiwanmd search 珍珠奶茶
```

## Commands

### `taiwanmd search <query>`

Search articles with fuzzy matching (supports Chinese and English).

```bash
taiwanmd search 珍珠奶茶
taiwanmd search semiconductor --limit 3
taiwanmd search 原住民 --json          # JSON output for piping
```

### `taiwanmd read <slug>`

Read an article directly in the terminal with formatted rendering.

```bash
taiwanmd read 珍珠奶茶                # Terminal-rendered markdown
taiwanmd read 珍珠奶茶 --raw          # Raw markdown (ideal for LLM/RAG)
taiwanmd read 珍珠奶茶 --en           # English version
taiwanmd read 珍珠奶茶 --web          # Open in browser
```

### `taiwanmd list [category]`

Browse articles by category.

```bash
taiwanmd list --categories             # Show all 13 categories
taiwanmd list food                     # List food articles
taiwanmd list people --sort words      # Sort by word count
taiwanmd list --reviewed               # Only human-reviewed articles
taiwanmd list --featured               # Only featured articles
taiwanmd list economy --json           # JSON output
```

Categories: history, geography, culture, food, art, music, technology, nature, people, society, economy, lifestyle, about.

### `taiwanmd random`

Discover a random article about Taiwan.

```bash
taiwanmd random                        # Any category
taiwanmd random --category nature      # Random nature article
```

### `taiwanmd stats`

Show project statistics and organism health scores.

```bash
taiwanmd stats                         # Formatted display
taiwanmd stats --json                  # JSON output
```

### `taiwanmd sync`

Sync the knowledge base locally for offline access.

```bash
taiwanmd sync                          # Initial sync or update
taiwanmd sync --force                  # Force re-sync
```

Syncs to `~/.taiwanmd/knowledge/` via git sparse-checkout.

## For AI/LLM Integration

The `--raw` and `--json` flags make it easy to pipe Taiwan knowledge into AI workflows:

```bash
# Feed an article into an LLM prompt
taiwanmd read 半導體產業 --raw | llm "Summarize this article"

# Export search results as JSON
taiwanmd search "台灣經濟" --json | jq '.[].title'

# Build a RAG corpus
taiwanmd list --json | jq -r '.[].slug' | while read slug; do
  taiwanmd read "$slug" --raw > "corpus/$slug.md"
done
```

## Development

```bash
# Run from the repo
cd cli && npm install
node src/index.js search 珍珠奶茶

# Link for local development
cd cli && npm link
taiwanmd --help
```

## Claude Code Skills

This project includes Claude Code skills in `.claude/skills/`:

- **`/taiwanmd-search`** — Search the knowledge base from within Claude Code
- **`/taiwanmd-validate`** — Validate article quality and frontmatter

## Links

- Website: [taiwan.md](https://taiwan.md)
- Dashboard: [taiwan.md/dashboard](https://taiwan.md/dashboard)
- GitHub: [frank890417/taiwan-md](https://github.com/frank890417/taiwan-md)
- npm: [npmjs.com/package/taiwanmd](https://www.npmjs.com/package/taiwanmd)
