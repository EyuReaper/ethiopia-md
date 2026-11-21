# Scripts

This folder holds the build, validation and maintenance scripts for Ethiopia.md. The npm scripts in `package.json` are the normal entry points. Run the others directly only when the table below says so.

## npm scripts

| Command                                   | What it runs                                                                    |
| ----------------------------------------- | ------------------------------------------------------------------------------- |
| `npm run dev`                             | Starts the Astro dev server on `http://localhost:4321`.                         |
| `npm run build`                           | Runs `prebuild`, then `astro build`, then `postbuild`.                          |
| `npm run test`                            | Validates frontmatter in `knowledge/` with `scripts/core/test-frontmatter.mjs`. |
| `npm run test:ci`                         | The same check with `--ci`, which is used by the GitHub workflow.               |
| `npm run sync`                            | Copies `knowledge/` into `src/content/` with `scripts/core/sync.sh`.            |
| `npm run sync:build`                      | Runs `sync`, then `astro build`.                                                |
| `npm run check-images`                    | Runs `scripts/utils/check-images.mjs`.                                          |
| `npm run check-links`                     | Runs `scripts/utils/check-links.sh`.                                            |
| `npm run format::check` / `format::write` | Prettier check and write across the repository.                                 |

`prebuild` runs three generators in order: `scripts/core/generate-api.js`, `scripts/core/build-search-index.mjs` and `scripts/core/generate-dashboard-data.js`. They read `knowledge/` and write static JSON under `public/`. `postbuild` runs `scripts/core/post-build-check.mjs` against `dist/`.

## `scripts/core/`

Used by the build and by CI.

| File                         | Purpose                                                                                                              |
| ---------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| `test-frontmatter.mjs`       | Frontmatter validator. Flags: `--staged` (used by the pre-commit hook), `--ci`, `--strict` (warnings become errors). |
| `sync.sh`                    | Copies `knowledge/` into `src/content/`. Never edit `src/content/` by hand.                                          |
| `generate-api.js`            | Writes the article and API JSON under `public/api/`.                                                                 |
| `build-search-index.mjs`     | Writes the search index from `knowledge/`. Draft and archived articles are excluded.                                 |
| `generate-dashboard-data.js` | Writes the data used by the dashboard page.                                                                          |
| `post-build-check.mjs`       | Smoke-tests `dist/` after a build. Its page-count thresholds are sized for the current small corpus.                 |

## `scripts/tools/`

Editorial and maintenance helpers. Run them from the repository root.

| File                                                 | Purpose                                                                                                                                                        |
| ---------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `review-pr.sh`                                       | Runs the same checks as the PR review workflow on a pull request number.                                                                                       |
| `quality-scan.sh`                                    | Heuristic quality scan of published articles (Taiwan-term leaks, hollow phrases, missing sources, structure). `--all` also scans drafts and archived articles. |
| `manage-featured.sh`                                 | `list` or `audit` the articles marked `featured: true`.                                                                                                        |
| `generate-content-stats.js`                          | Writes `src/data/content-stats.json`, including counts by status.                                                                                              |
| `assign-subcategory.cjs`                             | Assigns `subcategory` values in frontmatter. Check the diff before committing.                                                                                 |
| `check-freshness.js`                                 | Lists articles not re-verified within N days (default 90). `--days` and `--json` options.                                                                      |
| `translate.sh`                                       | Interactive helper for a contributor who wants to translate an article. Linked from the contribute page.                                                       |
| `rewrite-pipeline.sh`, `update-stats.sh`             | Older helpers. Read them before running.                                                                                                                       |
| `quality-report-2026-03-24.txt`, `rewrite-queue.txt` | Snapshots from earlier work. Not inputs to any script.                                                                                                         |

## `scripts/utils/`

| File                        | Purpose                                                                                                                                 |
| --------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| `check-images.mjs`          | Checks image references. Used by `npm run check-images`.                                                                                |
| `check-links.sh`            | Checks links. Used by `npm run check-links`.                                                                                            |
| `check-references.mjs`      | Checks that each article has a references or further-reading section with at least one URL. `--strict` makes failures fatal.            |
| `check-translation-sync.sh` | Lists recently changed Amharic articles and the English files that may need updating. See `docs/editorial/TRANSLATION-SYNC.md`.         |
| `i18n-status.py`            | Generates the translation progress JSON.                                                                                                |
| `test-wikilinks.mjs`        | Checks that wikilinks resolve.                                                                                                          |
| `publish.sh`                | Runs sync, frontmatter fixes, build and push in one step, then commits with the message you give. It pushes, so read it before running. |

### One-off migration scripts

These were written for the Taiwan.md fork and the rebrand. They change many files at once, and they may no longer match the current content. Do not run them without reading them first.

- `fix-wikilinks.mjs`, `fix-wikilinks-v2.mjs`
- `fix-all-frontmatter.py`, `generate-translation-issues.sh`, `translation-sync-report.sh`

## `scripts/deprecated/`

Kept for reference only. Nothing in the build or the workflows calls these scripts.

## Conventions

- Scripts must not write under `src/content/` directly. Change `knowledge/` and run `npm run sync`.
- Generated files under `public/api/` and `src/data/` are overwritten on each build. Commit them only when the change is intended.
- Keep script comments and output in English so that contributors can read them.
