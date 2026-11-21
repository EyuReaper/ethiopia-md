# Article quality checklist

Use this list before opening a pull request that adds or changes an article in `knowledge/`. The rules behind each item are in [`EDITORIAL.md`](../../EDITORIAL.md).

## 1. Frontmatter

- [ ] `title`, `description`, `date`, and `tags` are present. Quote dates as strings, for example `'2026-11-03'`.
- [ ] `date` is a Gregorian `YYYY-MM-DD` value, even in Amharic files.
- [ ] `tags` is a YAML block list. The first tag is the category name in English.
- [ ] `status` is set explicitly. New articles start as `draft`.
- [ ] `featured` is `false`. Featured articles are chosen by maintainers.
- [ ] The slug is lowercase ASCII with hyphens and is not already used in the same category.
- [ ] `node scripts/core/test-frontmatter.mjs` passes. Use `--strict` to treat warnings as errors.

## 2. Substance

- [ ] The article covers one topic, and the description contains a concrete fact.
- [ ] Every factual claim (dates, figures, names, quotations) can be traced to a source listed in the article.
- [ ] Sources are real and were checked. Links were opened, and the cited passage supports the claim.
- [ ] Figures carry a year and a unit, and the source is named close to the number.
- [ ] Contested or disputed points are presented with the main positions, not a single view.
- [ ] The article is about Ethiopia. Check that no fact, name or place has been carried over from another country's article.

## 3. Language and names

- [ ] Amharic is written first, or the Amharic and English versions are submitted together.
- [ ] Names follow the transliteration conventions in `EDITORIAL.md`, with the Amharic script given once where useful.
- [ ] Ethiopian calendar dates are explained for English readers.
- [ ] Wikilinks point to articles that exist and are `published`. Drafts and archived articles do not resolve.

## 4. Structure

- [ ] The article follows the layers in `EDITORIAL.md` section 4: short overview, a readable body, related topics, and sources.
- [ ] Headings are descriptive and the first heading matches `title`.
- [ ] Lists are used only for genuinely list-shaped material.

## 5. Build checks

- [ ] `npm run test` passes.
- [ ] `npm run sync` has been run, so `src/content/` matches `knowledge/`. Do not commit hand edits under `src/content/`.
- [ ] `npx prettier --check` passes on changed Markdown.
- [ ] `npm run build` completes, or the reason it cannot be run is stated in the pull request.
