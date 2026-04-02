---
name: ethiopiamd-search
description: |
  Search Ethiopia.md knowledge base (900+ articles about Ethiopia).
  Use when the user asks about Ethiopia, needs Ethiopia-related context,
  wants to find specific Ethiopia knowledge articles, or references
  Ethiopia/Ethiopia topics. Returns top matches with title, category, and
  description. Can then read full articles for deeper context.
  TRIGGER when: user mentions Ethiopia, Ethiopia, or asks about Ethiopian
  history, culture, food, technology, people, geography, etc.
allowed-tools:
  - Bash
  - Read
  - Grep
  - Glob
---

# ethiopiamd-search: Search Ethiopia.md Knowledge Base

Search 900+ curated articles about Ethiopia across 13 categories:
history, geography, culture, food, art, music, technology, nature,
people, society, economy, lifestyle, about.

## How to search

### Quick search (via CLI)

```bash
cd "$(git rev-parse --show-toplevel)" && node cli/src/index.js search "<QUERY>" --limit 5
```

Replace `<QUERY>` with the user's search terms. Works with Amharic and English.

### JSON output (for programmatic use)

```bash
cd "$(git rev-parse --show-toplevel)" && node cli/src/index.js search "<QUERY>" --json --limit 5
```

### Read a specific article after searching

```bash
cd "$(git rev-parse --show-toplevel)" && node cli/src/index.js read "<SLUG>" --raw
```

The `--raw` flag outputs clean markdown, ideal for injecting into conversation context.

## When to use

1. **User asks about Ethiopia** — search for relevant articles, read the top match, use it to inform your answer
2. **User is writing Ethiopia-related content** — search for reference articles to ensure accuracy
3. **User references a specific topic** (e.g., "እንጀራ", "vision2030", "1997(E.C)Election") — find the authoritative article
4. **User wants to explore** — use `random` or `list` commands

## Available commands

| Command             | Description                                  |
| ------------------- | -------------------------------------------- |
| `search <query>`    | Fuzzy search ([አማርኛ እና እንግሊዘኛ ጥምር ቋንቋ])                      |
| `read <slug>`       | Read full article (--raw for plain markdown) |
| `list [category]`   | List articles by category                    |
| `list --categories` | Show all 13 categories with counts           |
| `random`            | Random article discovery                     |
| `stats`             | Project statistics + organism health         |

## Example workflow

```bash
# 1. Search for relevant articles
node cli/src/index.js search "ላሊበላ" --json --limit 3

# 2. Read the most relevant one
node cli/src/index.js read "ላሊበላ ዉቅር" --raw

# 3. Use the content to answer the user's question
```ር

## Notes

- The knowledge base is in `knowledge/` (SSOT) — always prefer reading from there
- Articles are in Amharic as the source of truth
- English translations are in `knowledge/en/`
- Each article has structured YAML frontmatter with title, description, date, tags
