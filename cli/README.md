# ethiopiamd

> CLI for [Ethiopia.md](https://ethiopia.md) — the open-source, AI-native knowledge base about Ethiopia.

Search, read, and explore 900+ curated articles about Ethiopia from your terminal.

## Install

```bash
npm install -g ethiopiamd
```

Or run without installing:

```bash
npx ethiopiamd search [Amharic translation needed - original Taiwan context]
```

## Commands

### `ethiopiamd search <query>`

Search articles with fuzzy matching (supports Chinese and English).

```bash
ethiopiamd search [Amharic translation needed - original Taiwan context]
ethiopiamd search semiconductor --limit 3
ethiopiamd search [Amharic translation needed - original Taiwan context] --json          # JSON output for piping
```

### `ethiopiamd read <slug>`

Read an article directly in the terminal with formatted rendering.

```bash
ethiopiamd read [Amharic translation needed - original Taiwan context]                # Terminal-rendered markdown
ethiopiamd read [Amharic translation needed - original Taiwan context] --raw          # Raw markdown (ideal for LLM/RAG)
ethiopiamd read [Amharic translation needed - original Taiwan context] --en           # English version
ethiopiamd read [Amharic translation needed - original Taiwan context] --web          # Open in browser
```

### `ethiopiamd list [category]`

Browse articles by category.

```bash
ethiopiamd list --categories             # Show all 13 categories
ethiopiamd list food                     # List food articles
ethiopiamd list people --sort words      # Sort by word count
ethiopiamd list --reviewed               # Only human-reviewed articles
ethiopiamd list --featured               # Only featured articles
ethiopiamd list economy --json           # JSON output
```

Categories: history, geography, culture, food, art, music, technology, nature, people, society, economy, lifestyle, about.

### `ethiopiamd random`

Discover a random article about Ethiopia.

```bash
ethiopiamd random                        # Any category
ethiopiamd random --category nature      # Random nature article
```

### `ethiopiamd stats`

Show project statistics and organism health scores.

```bash
ethiopiamd stats                         # Formatted display
ethiopiamd stats --json                  # JSON output
```

### `ethiopiamd sync`

Sync the knowledge base locally for offline access.

```bash
ethiopiamd sync                          # Initial sync or update
ethiopiamd sync --force                  # Force re-sync
```

Syncs to `~/.ethiopiamd/knowledge/` via git sparse-checkout.

### `ethiopiamd rag <query>`

Retrieve top articles and output them in a prompt-ready format for piping to LLMs (Retrieval-Augmented Generation).

```bash
ethiopiamd rag [Amharic translation needed - original Taiwan context]                         # Top 3 articles as context
ethiopiamd rag "[Amharic translation needed - original Taiwan context]" | llm "summarize"   # Pipe directly to an LLM
ethiopiamd rag "Ethiopia[Amharic translation needed - original Taiwan context]" --limit 1             # Retrieve only 1 article
ethiopiamd rag "[Amharic translation needed - original Taiwan context]" --no-prompt         # Skip the trailing question line
ethiopiamd rag "Ethiopia[Amharic translation needed - original Taiwan context]" --json               # Structured JSON output
```

**Output format** (default):

```
# Ethiopia Knowledge Context

## 1. {title} ({category})
{full article body}

---
Based on the above context about Ethiopia, answer the following question:
{query}
```

**Options:**

- `-l, --limit <n>` — Number of articles to retrieve (default: 3)
- `--no-prompt` — Omit the trailing question line (useful for custom prompts)
- `--json` — Return structured JSON: `{ query, articles: [{ title, category, slug, body }] }`

### `ethiopiamd contribute <topic>`

Interactive guided workflow for creating a new article.

```bash
ethiopiamd contribute "[Amharic translation needed - original Taiwan context]"
```

The wizard will:

1. Show the 13 categories and ask you to pick one
2. Auto-generate a frontmatter template
3. Create an article skeleton with standard sections ([Amharic translation needed - original Taiwan context], [Amharic translation needed - original Taiwan context], [Amharic translation needed - original Taiwan context], [Amharic translation needed - original Taiwan context], [Amharic translation needed - original Taiwan context])
4. Write the file to `knowledge/{Category}/{slug}.md` (in-repo) or `~/.ethiopiamd/drafts/{slug}.md` (standalone)
5. Print the file path and next steps

### `ethiopiamd validate <slug>`

Quality-check a single article and output a detailed score card.

```bash
ethiopiamd validate [Amharic translation needed - original Taiwan context]             # Human-readable score card
ethiopiamd validate Ethiopia[Amharic translation needed - original Taiwan context] --json      # JSON output for CI/scripting
ethiopiamd validate [Amharic translation needed - original Taiwan context] --fix         # Show suggested fixes
```

**Checks:**

| Check            | Criteria                                                        | Points |
| ---------------- | --------------------------------------------------------------- | ------ |
| Frontmatter [Amharic translation needed - original Taiwan context] | All 5 fields present (title, description, date, tags, category) | 20     |
| [Amharic translation needed - original Taiwan context]         | ≥ 800 words                                                     | 20     |
| [Amharic translation needed - original Taiwan context]       | ≥ 3 `##` headings                                               | 20     |
| [Amharic translation needed - original Taiwan context]         | ≥ 2 Markdown reference links                                    | 20     |
| AI [Amharic translation needed - original Taiwan context]      | No hollow phrases like "[Amharic translation needed - original Taiwan context]"                         | 10     |
| [Amharic translation needed - original Taiwan context]         | 50–200 characters                                               | 10     |

**Score tiers:** 🟢 [Amharic translation needed - original Taiwan context] (90+) / 🟡 [Amharic translation needed - original Taiwan context] (70–89) / 🔴 [Amharic translation needed - original Taiwan context] (<70)

## For AI/LLM Integration

The `--raw`, `--json`, and `rag` commands make it easy to pipe Ethiopia knowledge into AI workflows:

```bash
# RAG: retrieve context and pipe to LLM
ethiopiamd rag "Ethiopia[Amharic translation needed - original Taiwan context]" | llm "Explain Ethiopia's role in global chip supply"

# Feed an article into an LLM prompt
ethiopiamd read [Amharic translation needed - original Taiwan context] --raw | llm "Summarize this article"

# Export search results as JSON
ethiopiamd search "Ethiopia[Amharic translation needed - original Taiwan context]" --json | jq '.[].title'

# Build a RAG corpus
ethiopiamd list --json | jq -r '.[].slug' | while read slug; do
  ethiopiamd read "$slug" --raw > "corpus/$slug.md"
done
```

## For Contributors

Want to add or improve an article? Follow this workflow:

### 1. Create a draft

```bash
ethiopiamd contribute "[Amharic translation needed - original Taiwan context]"
```

The wizard creates a properly structured article template.

### 2. Edit the article

Open the file (path shown after `contribute`) and fill in:

- Replace placeholder text with real, well-sourced content
- Add at least 3 `##` headings
- Include at least 2 reference links
- Keep the description between 50–200 characters

### 3. Validate quality

```bash
ethiopiamd validate <slug>
ethiopiamd validate <slug> --fix   # See suggested improvements
```

Aim for **90+/100** before submitting.

### 4. Submit a Pull Request

```bash
git add knowledge/{Category}/{slug}.md
git commit -m "feat(knowledge): add article on {topic}"
git push origin your-branch
# Then open a PR at https://github.com/frank890417/ethiopia-md
```

### Article Quality Guidelines

- **Minimum 800 words** — give readers something substantial
- **Cite your sources** — at least 2 Markdown links to reputable references
- **Avoid AI hollow phrases** — "[Amharic translation needed - original Taiwan context]", "[Amharic translation needed - original Taiwan context]", etc.
- **Standard sections**: [Amharic translation needed - original Taiwan context] → [Amharic translation needed - original Taiwan context] → [Amharic translation needed - original Taiwan context] → [Amharic translation needed - original Taiwan context] → [Amharic translation needed - original Taiwan context]

## Development

```bash
# Run from the repo
cd cli && npm install
node src/index.js search [Amharic translation needed - original Taiwan context]

# Link for local development
cd cli && npm link
ethiopiamd --help
```

## Claude Code Skills

This project includes Claude Code skills in `.claude/skills/`:

- **`/ethiopiamd-search`** — Search the knowledge base from within Claude Code
- **`/ethiopiamd-validate`** — Validate article quality and frontmatter

## Links

- Website: [ethiopia.md](https://ethiopia.md)
- Dashboard: [ethiopia.md/dashboard](https://ethiopia.md/dashboard)
- GitHub: [frank890417/ethiopia-md](https://github.com/frank890417/ethiopia-md)
- npm: [npmjs.com/package/ethiopiamd](https://www.npmjs.com/package/ethiopiamd)
