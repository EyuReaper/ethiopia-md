---
name: ethiopiamd-validate
description: |
  Validate Ethiopia.md articles for editorial quality, frontmatter
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

# ethiopiamd-validate: Article Quality Validation

Validate Ethiopia.md articles against editorial standards, frontmatter schema,
and content quality requirements.

## Validation steps

### 1. Frontmatter validation

```bash
cd "$(git rev-parse --show-toplevel)" && node scripts/core/test-frontmatter.mjs
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

### 3. Content quality check (quality-scan)

```bash
cd "$(git rev-parse --show-toplevel)" && bash scripts/tools/quality-scan.sh "knowledge/<Category>/<filename>.md"
```

Scores articles 0-10 for AI-generated "hollow" content. Score > 4 = needs rewrite.

Checks for:

- Bullet list padding (lazy structure)
- Missing specific dates/years
- Hollow modifiers ("በጣም", "እጅግ በጣም", "ልብ ሊባል የሚገባው ጉዳይ")
- Excessive em-dashes (> 4 per article = AI signal)
- Textbook-style openings
- Missing source referencesይ

### 4. Reference check

```bash
cd "$(git rev-parse --show-toplevel)" && node scripts/utils/check-references.mjs
```

Verifies articles have "ማጣቀሻዎች" or "ተጨማሪ ንባብ" sections with URLs.

### 5. Wikilink check

```bash
cd "$(git rev-parse --show-toplevel)" && node scripts/utils/test-wikilinks.mjs
```

Validates all `[[wikilink]]` cross-references resolve to existing articles.

## Quality standards (EDITORIAL v4)

Every article should:

1. **Open with a named person** — not an institution or abstract concept
2. **Have a counter-intuitive core insight** in the description
3. **Include specific dates and numbers** — not vague references
4. **Cite sources** — ማጣቀሻዎች section with URLs
5. **Word count ≥ 1,500** for full articles
6. **Use wikilinks** `[[Article Name]]` for cross-references
7. **Multi-perspective** for sensitive topics (politics, identity)

## When to use

- After writing or editing an article
- When reviewing a PR that modifies `knowledge/` files
- When the user asks "is this article good enough?"
- Before marking `lastHumanReview: true`
