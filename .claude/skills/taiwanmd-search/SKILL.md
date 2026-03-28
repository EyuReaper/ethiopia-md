---
name: taiwanmd-search
description: |
  Search Taiwan.md knowledge base (900+ articles about Taiwan).
  Use when the user asks about Taiwan, needs Taiwan-related context,
  wants to find specific Taiwan knowledge articles, or references
  台灣/Taiwan topics. Returns top matches with title, category, and
  description. Can then read full articles for deeper context.
  TRIGGER when: user mentions Taiwan, 台灣, or asks about Taiwanese
  history, culture, food, technology, people, geography, etc.
allowed-tools:
  - Bash
  - Read
  - Grep
  - Glob
---

# taiwanmd-search: Search Taiwan.md Knowledge Base

Search 900+ curated articles about Taiwan across 13 categories:
history, geography, culture, food, art, music, technology, nature,
people, society, economy, lifestyle, about.

## How to search

### Quick search (via CLI)

```bash
cd "$(git rev-parse --show-toplevel)" && node cli/src/index.js search "<QUERY>" --limit 5
```

Replace `<QUERY>` with the user's search terms. Works with Chinese and English.

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

1. **User asks about Taiwan** — search for relevant articles, read the top match, use it to inform your answer
2. **User is writing Taiwan-related content** — search for reference articles to ensure accuracy
3. **User references a specific topic** (e.g., "珍珠奶茶", "TSMC", "228 incident") — find the authoritative article
4. **User wants to explore** — use `random` or `list` commands

## Available commands

| Command             | Description                                  |
| ------------------- | -------------------------------------------- |
| `search <query>`    | Fuzzy search (中英雙語)                      |
| `read <slug>`       | Read full article (--raw for plain markdown) |
| `list [category]`   | List articles by category                    |
| `list --categories` | Show all 13 categories with counts           |
| `random`            | Random article discovery                     |
| `stats`             | Project statistics + organism health         |

## Example workflow

```bash
# 1. Search for relevant articles
node cli/src/index.js search "半導體" --json --limit 3

# 2. Read the most relevant one
node cli/src/index.js read "半導體產業" --raw

# 3. Use the content to answer the user's question
```

## Notes

- The knowledge base is in `knowledge/` (SSOT) — always prefer reading from there
- Articles are in Traditional Chinese (zh-TW) as the source of truth
- English translations are in `knowledge/en/`
- Each article has structured YAML frontmatter with title, description, date, tags
