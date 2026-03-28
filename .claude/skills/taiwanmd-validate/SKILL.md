---
name: taiwanmd-validate
description: |
  Validate Taiwan.md articles for editorial quality, frontmatter
  correctness, and content standards. Use when reviewing PRs that
  touch knowledge/ or src/content/, writing new articles, or when
  the user asks to check article quality. Runs frontmatter validation,
  word count check, and reports issues.
  TRIGGER when: user says "validate", "check article", "review quality",
  or when editing .md files in knowledge/ or src/content/.
allowed-tools:
  - Bash
  - Read
  - Grep
  - Glob
---

# taiwanmd-validate: Article Quality Validation

Validate Taiwan.md articles against editorial standards, frontmatter schema,
and content quality requirements.

## Validation steps

### 1. Frontmatter validation

```bash
cd "$(git rev-parse --show-toplevel)" && node scripts/test-frontmatter.mjs
```

Checks all articles for:

- Required fields: title, description, date, tags
- Valid date format
- Tags is an array
- No duplicate slugs
- Valid file naming

### 2. Check a specific article

Read the article and verify manually:

```bash
# Read the article
cat "knowledge/<Category>/<filename>.md" | head -30
```

Check:

- [ ] `title` — present and descriptive
- [ ] `description` — 1-2 sentences, contains the "counter-intuitive core insight"
- [ ] `date` — valid ISO date
- [ ] `tags` — array with 3-8 relevant tags
- [ ] `featured` — boolean (optional)
- [ ] `lastHumanReview` — set to `true` if human-reviewed
- [ ] `lastVerified` — date of last fact-check

### 3. Content quality check (detect-ai-hollow)

```bash
cd "$(git rev-parse --show-toplevel)" && bash tools/detect-ai-hollow.sh "knowledge/<Category>/<filename>.md"
```

Scores articles 0-10 for AI-generated "hollow" content. Score > 4 = needs rewrite.

Checks for:

- Bullet list padding (lazy structure)
- Missing specific dates/years
- Hollow modifiers ("非常", "極其", "值得注意的是")
- Excessive em-dashes (> 4 per article = AI signal)
- Textbook-style openings
- Missing source references

### 4. Reference check

```bash
cd "$(git rev-parse --show-toplevel)" && node scripts/check-references.mjs
```

Verifies articles have "參考資料" or "延伸閱讀" sections with URLs.

### 5. Wikilink check

```bash
cd "$(git rev-parse --show-toplevel)" && node scripts/test-wikilinks.mjs
```

Validates all `[[wikilink]]` cross-references resolve to existing articles.

## Quality standards (EDITORIAL v4)

Every article should:

1. **Open with a named person** — not an institution or abstract concept
2. **Have a counter-intuitive core insight** in the description
3. **Include specific dates and numbers** — not vague references
4. **Cite sources** — 參考資料 section with URLs
5. **Word count ≥ 1,500** for full articles
6. **Use wikilinks** `[[Article Name]]` for cross-references
7. **Multi-perspective** for sensitive topics (politics, identity)

## When to use

- After writing or editing an article
- When reviewing a PR that modifies `knowledge/` files
- When the user asks "is this article good enough?"
- Before marking `lastHumanReview: true`
