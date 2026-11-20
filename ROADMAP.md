# Ethiopia.md Roadmap

Ethiopia.md is an open knowledge base about Ethiopia, forked from Taiwan.md and partway through being rebuilt with real Ethiopian content. This roadmap replaces the inherited Taiwan.md phase checklist. It tracks the actual remaining work, ordered by priority (P0–P5), and it states what is live today, so nobody mistakes the size of the repo for the size of the real knowledge base.

Counts below were measured on 2026-11-20 by parsing the frontmatter of every file under `knowledge/` (grep for `status:` lines, plus a `gray-matter` pass). Re-check before relying on them; `node scripts/tools/generate-content-stats.js` writes a `triageStatus` breakdown into `src/data/content-stats.json`.

Status legend: **[x] done**, **[~] in progress** (someone is working on it now), **[ ] open**.

---

## Where things stand

### Content

| Tier                   | Published                        | Draft                                                                     | Archived | Notes                                                                                  |
| ---------------------- | -------------------------------- | ------------------------------------------------------------------------- | -------- | -------------------------------------------------------------------------------------- |
| Amharic (`knowledge/`) | **36**: 12 Hubs + 24 articles    | 0                                                                         | 393      | `_Home.md` and `People/_PEOPLE-ROADMAP.md` have no `status` (so default to published). |
| English (`en/`)        | **36**: 12 Hubs + 24 articles    | 0                                                                         | 484      | Every published Amharic article has an English pair with the same slug.                |
| Spanish (`es/`)        | 0                                | **12** Hubs, each a short "being rewritten, see the Amharic edition" stub | 34       | No real Spanish article text yet.                                                      |
| Japanese (`ja/`)       | 0                                | 0                                                                         | **13**   | `ja` is not a locale in `astro.config.mjs` (only `am`, `en`).                          |
| **Total**              | **72 files** (36 topics × AM/EN) | 12                                                                        | **924**  | 1,010 Markdown files in `knowledge/`.                                                  |

The live site therefore has **36 genuine Ethiopia topics, in Amharic and English**: the 12 category Hubs plus 24 articles (two per category). Everything else in `knowledge/` is either hidden (`draft`/`archived`) or leftover Taiwan.md material.

### Leftovers from the fork

| Item                                                                             | Count                                                |
| -------------------------------------------------------------------------------- | ---------------------------------------------------- |
| Archived Taiwan.md articles (`status: archived`)                                 | 924                                                  |
| Files with Chinese (CJK) filenames                                               | 88                                                   |
| `knowledge/` files containing the `[Amharic translation needed ...]` placeholder | 729                                                  |
| `docs/**` files containing the placeholder string                                | 41                                                   |
| Root docs still corrupted (`CODE_OF_CONDUCT.md`, `SECURITY.md`)                  | 2 (`CONTRIBUTING.md` is being rewritten)             |
| Other corrupted docs: `cli/README.md`, `scripts/README.md`, `i18n/README.md`     | 3                                                    |
| `scripts/**/*.sh` files with the placeholder in comments or echo strings         | 14                                                   |
| Archived files whose YAML no longer parses                                       | 38 (part of the 138 errors in a full `npm run test`) |
| Real photos or maps sourced                                                      | 0 of 17 slots (all slots hold honest placeholders)   |

---

## P0: Wrong, live, or uncommitted

The site chrome no longer presents Taiwan as Ethiopia. Keep it that way.

- [x] Knowledge graph (`src/pages/graph.astro`, `src/pages/en/graph.astro`) reads `knowledge/` and skips `archived`/`draft` (committed in `68506141`).
- [x] Purged Taiwan blocks from `src/i18n/data.ts` (`data.enterprise.*`, `data.timeline.*`, `data.digitalDemocracy.*`, `data.population.*`).
- [x] Removed the Taiwan.md founder links and the `nmth`/`justfont` sponsor cards from `src/i18n/about.ts`.
- [x] **Replaced the justfont / Traditional Chinese font pipeline** with Google Fonts Noto Sans Ethiopic, Noto Serif Ethiopic and Noto Sans; removed the justfont SDK, footer credit and logo (`534c1ca8`).
- [x] Taiwan keyword grep on `src/` (excluding `src/content/`) is clean. The only hits are comments that explain the cleanup.
- [ ] Rerun the keyword grep after every change to site chrome (command in `EDITORIAL.md`, section 10). The failure mode is fluent text about the wrong country, and grepping for the placeholder string won't catch it.

## P1: Content corpus

The Hubs and the November flagships are the model: topics chosen for Ethiopia, researched from scratch, and published in Amharic and English together. Don't Ethiopia-wash a Taiwan topic.

### Done

- [x] **12 category Hubs** rewritten from sourced research and published (AM + EN).
- [x] **24 flagship slots** filled with new Ethiopian topics and published in Amharic with English pairs. All 24 Taiwan-topic files the slots used to hold (`228-incident.md`, `beef-noodle-soup.md`, `sunflower-movement.md`, etc.) have been removed:

  | Category   | Articles                                                             |
  | ---------- | -------------------------------------------------------------------- |
  | Art        | `lalibela-rock-hewn-churches`, `ethiopian-illuminations-modern-art`  |
  | Culture    | `ethiopian-coffee-culture`, `ethiopian-religious-festivals`          |
  | Economy    | `ethiopian-airlines-aviation-hub`, `grand-ethiopian-renaissance-dam` |
  | Food       | `injera-and-teff`, `doro-wat-and-festive-dining`                     |
  | Geography  | `great-rift-valley`, `simien-mountains`                              |
  | History    | `battle-of-adwa`, `aksumite-empire`                                  |
  | Lifestyle  | `habesha-kemis-and-handwoven-textiles`, `addis-ababa-cafe-culture`   |
  | Music      | `ethio-jazz-mulatu-astatke`, `traditional-instruments-krar-masenqo`  |
  | Nature     | `ethiopian-endemic-wildlife`, `bale-mountains-ecosystem`             |
  | People     | `menelik-ii-and-taytu-betul`, `abebe-bikila-marathon-legacy`         |
  | Society    | `gadaa-system`, `iddir-and-iqub-mutual-aid`                          |
  | Technology | `telebirr-digital-payments`, `ai-development`                        |

- [x] English translations of all 24 flagships.
- [x] Wikilinks no longer resolve to archived articles (`plugins/remark-wikilinks.mjs` skips `archived` as well as `draft`).

### In progress (other contributors are on these now)

- [~] **`knowledge/_Home.md`**: rewrite of the corpus landing note.
- [~] **About**: a real Ethiopia.md about/origin page (`knowledge/About/origin-story.md`), replacing the Taiwan About cluster (`founder.md`, `seeing-taiwan-quotes.md`, `why-taiwan-needs-its-own-knowledge-base.md` and the official-websites files, AM and EN), which is being deleted in the working tree.
- [~] **Language Hub**: a real Languages of Ethiopia hub to replace the `knowledge/Language/測試文章.md` test file.

### Open

- [ ] **Deepen the thinner flagships.** The 20 November flagships run 430–610 English words with a median of 3 distinct sources, against the bar in `EDITORIAL.md` (at least 800 words and 6 sources). The weakest: `addis-ababa-cafe-culture` (no citations), `doro-wat-and-festive-dining` and `habesha-kemis-and-handwoven-textiles` (one source each). Also check the academic citation links. In `battle-of-adwa`, `menelik-ii-and-taytu-betul` and `aksumite-empire`, books by Marcus, Prouty and Phillipson are linked to article-style JSTOR IDs (`217154`, `41965902`, `25732168`), which may be reviews of those books rather than the books themselves.
- [ ] **Human review.** Every published article has `lastHumanReview: false`. Get a person to check each one against its sources.
- [ ] **Spanish Hubs**: translate the 12 published Hubs into the existing `knowledge/es/{Category}/_… Hub.md` stubs, then publish. Don't revive the 34 archived Taiwan Spanish files.
- [ ] **Japanese**: either start a real `ja` Hub set from the published AM/EN Hubs (and add `ja` to `astro.config.mjs`), or remove Japanese from navigation and docs until there is something to show.
- [ ] **Rename or delete the remaining 88 CJK filenames** (`find knowledge -name '*.md' | grep -P '\p{Han}'`). The mechanical rename has already handled every file with a clean English pair in `_translations.json`. What's left needs a decision per file: a new Ethiopia slug, or deletion along with its archived Taiwan body.
- [ ] **Decide the fate of the 924 archived articles**: keep them as a hidden archive, bulk-delete, or replace category by category. Archived pages still build and render if someone has the direct URL. Deleting them would also clear most of the 138 full-run validator errors.
- [ ] **Grow each category past two articles**, following `EDITORIAL.md`. Then link the new articles from the relevant Hub sections; Hubs currently contain no links.

## P2: Contributor-facing docs

The prose in root docs and `docs/` was replaced by the placeholder string during the fork. Code samples, YAML and tables survived. Rewrite in English (with Amharic where it matters) using the real Ethiopia.md rules, not translated Taiwan process lore.

- [x] **`EDITORIAL.md`** rewritten as a real editorial guide (frontmatter schema matched to the validator and the article page, article structure, sourcing, calendar, transliteration, neutrality, the wrong-country failure mode, plus an Amharic summary).
- [x] **`ROADMAP.md`** rewritten against the measured repo state (this file).
- [x] `i18n/en/STYLE.md` and `i18n/ja/STYLE.md` no longer contain the placeholder string.
- [~] **`README.md`**: being rewritten. It already says Oromo/Tigrinya are not supported.
- [~] **`CONTRIBUTING.md`**: being rewritten (348 placeholder lines before the rewrite).
- [ ] `CODE_OF_CONDUCT.md` (33 placeholder occurrences) and `SECURITY.md` (38).
- [ ] `docs/**`: 41 files, mainly `docs/editorial/` (8), `docs/pipelines/` (7), `docs/reports/` (6), `docs/assets/` (5), `docs/factory/` (5), `docs/community/` (3). Many describe Taiwan.md-specific pipelines, so deleting a doc is often better than translating it.
- [ ] `i18n/README.md` (32 placeholder occurrences).
- [ ] `cli/README.md`: examples still read `ethiopiamd search semiconductor` and "supports Chinese and English".
- [ ] `scripts/README.md`, plus comment/echo banners in 14 `scripts/**/*.sh` files.

## P3: Engineering hygiene

- [x] Deleted the dead `src/content/config.ts`. `src/content.config.ts` is the only schema.
- [x] `src/content.config.ts` comments rewritten. `chineseTitle` is kept only for archived fork files.
- [x] Placeholder comments removed from `src/templates/about.template.astro`.
- [~] **Lower `scripts/core/post-build-check.mjs` thresholds** (`MIN_TOTAL_PAGES = 300`, `MIN_ARTICLES_PER_CATEGORY = 3` were set for the old fully published Taiwan corpus). Being fixed now. Set the new floors from a real `dist/` count so they still catch a `getStaticPaths` collapse.
- [ ] **Repair `scripts/tools/quality-scan.sh`.** Its "hollow phrase" regex was corrupted into the placeholder string, which `grep -E` treats as a character class, so it flags good articles (thousands of matches on `battle-of-adwa.md`). Rewrite its patterns for English and Amharic before using it as a gate.
- [ ] **Reconcile `source` vs `sources`.** The article pages render the frontmatter field `source` (singular) as a Sources list. The zod schema defines `sources` (plural), which nothing renders. Pick one.
- [ ] **Make wikilinks language-aware.** `[[slug]]` always resolves to the Amharic URL and shows the raw slug as link text, even inside English articles. Until this is fixed, `EDITORIAL.md` tells English writers to use normal `/en/...` Markdown links.
- [ ] **Validator coverage.** `test-frontmatter.mjs` skips `_` files (all Hubs) and doesn't scan `knowledge/Language/`. A full run fails on 138 errors, all in archived files.
- [ ] **Regenerate `src/data/content-stats.json`.** The file on disk is from 2026-08-11 and has no `triageStatus`. Consider adding `generate-content-stats.js` to `prebuild`.
- [ ] **Make sync a real mirror.** `scripts/core/sync.sh` copies `knowledge/` to `src/content/` but never deletes orphans, so removed Taiwan files can reappear in collections.
- [ ] **CLI index.** Confirm the published `ethiopiamd` package searches the current Ethiopia index, not a Taiwan snapshot.
- [ ] The prebuild description in `CLAUDE.md` still lists the removed `generate-map-markers.js`.

## P4: Pictures and cartography

None of these assets have been sourced. Every slot holds an honest generated placeholder (never a guessed Ethiopia outline). Paths and suggested sources are listed under "Picture Assets Needed" in `CLAUDE.md`.

- [ ] 12 category cover photos (`public/images/categories/{slug}.jpg`; the `.svg` placeholders are in place, and `cover:` in `src/utils/categoryConfig.ts` must be updated when a photo lands).
- [ ] Social share image `public/images/ethiopia-social.jpg` (currently a typographic placeholder).
- [ ] 4 geographic SVGs in `public/assets/svg/` (`ethiopia-simplemaps`, `ethiopia-location-map`, `ethiopia-political-division`, `ethiopia-icon-wiki`) from licensed sources such as Wikimedia Commons.
- [ ] Update the attribution copy in `src/i18n/assets.ts` and `src/i18n/data.ts` as each real file lands.
- [ ] Per-article hero images: the `image` field works, but nothing is queued.

## P5: Parked

Don't start these until P0–P2 are honest. Each of them would multiply the existing problem if built on a corpus that is still mostly archived Taiwan material.

- [ ] Real Ethiopian open-data visualizations on `/data` (the Taiwan stock, CPI, housing and population charts were removed; only the stat cards and placeholders remain).
- [ ] Oromo (Afaan Oromoo) and Tigrinya editions. There are no `knowledge/om` or `knowledge/ti` folders and no locales for them.
- [ ] Teaching toolkit (`/toolkit`, a five-minute deck, classroom materials).
- [ ] Community-funded translation pipeline.
- [ ] Community reviewer program and a real `CODEOWNERS` beyond the maintainer.
- [ ] Unit tests for site code (today "test" means frontmatter validation only).
