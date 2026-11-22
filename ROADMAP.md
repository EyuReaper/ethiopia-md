# Ethiopia.md Roadmap

Ethiopia.md is an open knowledge base about Ethiopia, forked from Taiwan.md and partway through being rebuilt with real Ethiopian content. This roadmap replaces the inherited Taiwan.md phase checklist. It tracks the actual remaining work, ordered by priority (P0–P5), and it states what is live today, because the repo is much larger than the real knowledge base inside it.

Counts below were measured on 2026-11-22 by counting the files under `knowledge/` (every one is `published`). Re-check before relying on them; `node scripts/tools/generate-content-stats.js` writes a `triageStatus` breakdown into `src/data/content-stats.json`.

Status legend: [x] done, [~] in progress (someone is working on it now), [ ] open.

---

## Where things stand

### Content

On 2026-11-21 the whole archived Taiwan.md corpus (874 files), `knowledge/es/`, `knowledge/ja/` and `People/_PEOPLE-ROADMAP.md` were deleted. Git history still holds them.

| Tier                   | Files | Notes                                                                                                        |
| ---------------------- | ----- | ------------------------------------------------------------------------------------------------------------ |
| Amharic (`knowledge/`) | 65    | 13 Hubs, 50 articles, `About/origin-story.md` and `_Home.md`. All published.                                 |
| English (`en/`)        | 64    | The English pairs of everything above except `_Home.md`.                                                     |
| Total                  | 129   | No `draft` or `archived` files remain. Other writers are adding articles, so recount before relying on this. |

There are 13 categories. Language has its Hub and two articles; each of the other twelve has a Hub and four articles. A full build emits about 199 pages.

The site supports exactly two languages, Amharic and English. There are no Spanish or Japanese folders, and `ja`/`es` are not locales in `astro.config.mjs`.

### Leftovers from the fork

| Item                                                               | Status                                                                                                                   |
| ------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------ |
| Taiwan articles, Chinese filenames, archived files in `knowledge/` | None remain (deleted)                                                                                                    |
| `[Amharic translation needed ...]` placeholder string              | Check with `grep -rlI "Amharic translation needed" . --exclude-dir=node_modules --exclude-dir=dist --exclude-dir=.git`   |
| Real photos or maps sourced                                        | Done: 13 category covers, 4 maps, the social image and 32 per-article photos (credited in `src/data/image-credits.json`) |

---

## P0: Wrong, live, or uncommitted

The site chrome no longer presents Taiwan as Ethiopia. Keep it that way.

- [x] Knowledge graph (`src/pages/graph.astro`, `src/pages/en/graph.astro`) reads `knowledge/` and skips `archived`/`draft` (committed in `68506141`).
- [x] Purged Taiwan blocks from `src/i18n/data.ts` (`data.enterprise.*`, `data.timeline.*`, `data.digitalDemocracy.*`, `data.population.*`).
- [x] Removed the Taiwan.md founder links and the `nmth`/`justfont` sponsor cards from `src/i18n/about.ts`.
- [x] Replaced the justfont / Traditional Chinese font pipeline with Google Fonts Noto Sans Ethiopic, Noto Serif Ethiopic and Noto Sans; removed the justfont SDK, footer credit and logo (`534c1ca8`).
- [x] Taiwan keyword grep on `src/` (excluding `src/content/`) is clean. The only hits are comments that explain the cleanup.
- [ ] Rerun the keyword grep after every change to site chrome (command in `EDITORIAL.md`, section 10). The failure mode is fluent text about the wrong country, and grepping for the placeholder string won't catch it.

## P1: Content corpus

The Hubs and the November flagships are the model: topics chosen for Ethiopia, researched from scratch, and published in Amharic and English together. Don't Ethiopia-wash a Taiwan topic.

### Done

- [x] 12 category Hubs rewritten from sourced research and published (AM + EN).
- [x] 24 flagship slots filled with new Ethiopian topics and published in Amharic with English pairs. All 24 Taiwan-topic files the slots used to hold (`228-incident.md`, `beef-noodle-soup.md`, `sunflower-movement.md`, etc.) have been removed:

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

- [x] `knowledge/_Home.md` rewritten for Ethiopia.
- [x] About: `knowledge/About/origin-story.md` (AM + EN) replaced the Taiwan About cluster.
- [x] Language Hub written and Language wired up as a 13th category.

### Open

- [ ] Deepen the thinner flagships. The 20 November flagships run 430–610 English words with a median of 3 distinct sources, against the bar in `EDITORIAL.md` (at least 800 words and 6 sources). The weakest: `addis-ababa-cafe-culture` (no citations), `doro-wat-and-festive-dining` and `habesha-kemis-and-handwoven-textiles` (one source each). Also check the academic citation links. In `battle-of-adwa`, `menelik-ii-and-taytu-betul` and `aksumite-empire`, books by Marcus, Prouty and Phillipson are linked to article-style JSTOR IDs (`217154`, `41965902`, `25732168`), which may be reviews of those books rather than the books themselves.
- [ ] Human review. Every published article has `lastHumanReview: false`. Get a person to check each one against its sources.
- [x] Spanish and Japanese folders (`knowledge/es/`, `knowledge/ja/`) were deleted; the site is Amharic and English only. Adding a language means a locale in `astro.config.mjs`, a `src/i18n` dictionary and a style guide (see `i18n/README.md`).
- [x] Chinese filenames and archived articles: all 874 archived Taiwan articles, including the remaining CJK-named files, were deleted from `knowledge/`.

- [ ] Keep growing the corpus (Language has two articles, every other category four), following `EDITORIAL.md`. Then link the new articles from the relevant Hub sections.

## P2: Contributor-facing docs

The prose in root docs and `docs/` was replaced by the placeholder string during the fork. Code samples, YAML and tables survived. Rewrite in English (with Amharic where it matters) using the real Ethiopia.md rules, not translated Taiwan process lore.

- [x] `EDITORIAL.md` rewritten as a real editorial guide (frontmatter schema matched to the validator and the article page, article structure, sourcing, calendar, transliteration, neutrality, the wrong-country failure mode, plus an Amharic summary).
- [x] `ROADMAP.md` rewritten against the measured repo state (this file).
- [x] `i18n/en/STYLE.md` no longer contains the placeholder string.
- [x] `README.md` and `CONTRIBUTING.md` rewritten and brought in line with the post-deletion repo.
- [ ] `CODE_OF_CONDUCT.md` (33 placeholder occurrences) and `SECURITY.md` (38).
- [~] `docs/` is down to `docs/community/`, `docs/editorial/`, `docs/prompts/` and `docs/README.md`; the Taiwan-specific `pipelines/`, `reports/`, `assets/` and `factory/` docs are gone. Check what is left for placeholder text.
- [x] `i18n/README.md` rewritten.
- [ ] `cli/README.md`: examples still read `ethiopiamd search semiconductor` and "supports Chinese and English".
- [x] `scripts/README.md` rewritten. Comment/echo banners in `scripts//*.sh` may still hold the placeholder string.
- [x] `LICENSE` (MIT, code) and `LICENSE-CONTENT.md` (CC BY-SA 4.0, articles) added. Confirm the copyright holder name and the upstream Taiwan.md license terms.

## P3: Engineering hygiene

- [x] Deleted the dead `src/content/config.ts`. `src/content.config.ts` is the only schema.
- [x] `src/content.config.ts` comments rewritten in plain English; the unused `chineseTitle`/`originalTitle` fields were removed.
- [x] Placeholder comments removed from `src/templates/about.template.astro`.
- [x] Lowered `scripts/core/post-build-check.mjs` thresholds (`MIN_TOTAL_PAGES = 100`, `MIN_ARTICLES_PER_CATEGORY = 2`). Raise them as the corpus grows.
- [x] Repaired `scripts/tools/quality-scan.sh` (v4.0): it flags Taiwan-term leaks, hollow or stock phrases, missing sources and structure problems. `lastHumanReview: false`, thin sections and prose decay are no longer scored. `.quality-baseline.json` was regenerated.
- [x] `sources` is the frontmatter field the article pages render (legacy `source` is still accepted).
- [x] Wikilinks resolve to the same-language published article (`src/utils/wikilinks.ts`).
- [x] Validator coverage: `test-frontmatter.mjs` now validates `_` files (Hubs, `_Home.md`) and `knowledge/Language/`, and a full `npm run test` passes.
- [x] Regenerated `src/data/content-stats.json` with `node scripts/tools/generate-content-stats.js`. Consider adding it to `prebuild`.
- [x] `scripts/core/sync.sh` is a real mirror: it clears `src/content/am` and `src/content/en` before copying, so deleted articles disappear from the collections.
- [ ] CLI index. Confirm the published `ethiopiamd` package searches the current Ethiopia index, not a Taiwan snapshot.
- [ ] The prebuild description in `CLAUDE.md` still lists the removed `generate-map-markers.js`.

## P4: Pictures and cartography

Done on 2026-11-21: 13 category covers (`public/images/categories/{slug}.jpg`), four maps in `public/assets/svg/`, the social image `public/images/ethiopia-social.jpg` and 32 per-article photos in `public/images/articles/`, all real Wikimedia Commons files. Credits are in `src/data/image-credits.json` and `public/images/CREDITS.md` and are shown on `/assets`.

- [ ] More per-article photos. Articles without an `image:` field still use their category photo. Contributions are welcome (see "Picture assets" in `CONTRIBUTING.md`).
- [ ] `ethiopia-location-map.svg` is about 728 KB; consider a lighter version.
- [ ] Add the Language category to the homepage `CategoriesSection`/`TopicsMasonry` layouts, which are tuned for 12 tiles.

## P5: Parked

Don't start these until P0–P2 are honest. Each of them would multiply the existing problem if built on a corpus that is still this small.

- [ ] Real Ethiopian open-data visualizations on `/data` (the Taiwan stock, CPI, housing and population charts were removed; only the stat cards and placeholders remain).
- [ ] Oromo (Afaan Oromoo) and Tigrinya editions. There are no `knowledge/om` or `knowledge/ti` folders and no locales for them.
- [ ] Teaching toolkit (`/toolkit`, a five-minute deck, classroom materials).
- [ ] Community-funded translation pipeline.
- [ ] Community reviewer program and a real `CODEOWNERS` beyond the maintainer.
- [ ] Unit tests for site code (today "test" means frontmatter validation only).
