# Contributing to Ethiopia.md

## አጭር ማጠቃለያ (Amharic summary)

ለ Ethiopia.md አስተዋጽኦ ለማድረግ ስለፈለጉ እናመሰግናለን። ዋና ዋና ደንቦቹ እነዚህ ናቸው፦

- **ጽሑፎችን በመጀመሪያ በአማርኛ ይጻፉ** — በ `knowledge/{Category}/` ውስጥ። አማርኛ የእውነት ምንጭ (SSOT) ነው።
- **የእንግሊዝኛ ትርጉሙን** በ `knowledge/en/{Category}/` ውስጥ በተመሳሳይ የፋይል ስም ያክሉ።
- **`src/content/` ን በፍጹም አያርትዑ** — በራስ-ሰር ይፈጠራል፣ ለውጦችዎም ይጠፋሉ።
- **ምንጭ ይጥቀሱ።** እያንዳንዱ ዋና ማስረጃ ሊረጋገጥ የሚችል አገናኝ ሊኖረው ይገባል።
- **የታይዋን ርዕስን «ኢትዮጵያዊ» አታድርጉ።** ይህ ማከማቻ ከታይዋን ፕሮጀክት የተቀዳ ነው። የድሮ የታይዋን ጽሑፍ ካገኙ፣ ስሙን ቀይረው አያስቀምጡት፤ በእውነተኛ የኢትዮጵያ ርዕስ ይተኩት።
- ከመላክዎ በፊት **`npm run test`** ን ያሂዱ፣ ከዚያ Pull Request ይክፈቱ።
- **ትርጉሞች፣ እውነታ ማረጋገጥ እና ፎቶዎች** በጣም ያስፈልጋሉ፤ በተለይ የ12ቱ ማዕከላዊ (Hub) ጽሑፎች የስፓኒሽ ትርጉም።

ሙሉ መመሪያው ከታች በእንግሊዝኛ ቀርቧል።

---

## Before you start

Ethiopia.md is a fork of a Taiwan-focused project (Taiwan.md) and is partway through migrating to genuine Ethiopia content. That shapes how you contribute:

- Most of `knowledge/` is still old Taiwan content, marked `status: archived` and hidden from the site. Don't use it as a model.
- Many files in `docs/` still contain the placeholder string `[Amharic translation needed - original Taiwan context]` where prose was stripped. Their YAML and code samples are usable; their prose is not. Don't treat it as guidance.
- The best models for tone, structure and citation density are the published articles, especially the 12 category Hubs (`knowledge/{Category}/_{Category} Hub.md` and their English pairs in `knowledge/en/`).

Editorial standards live in [EDITORIAL.md](EDITORIAL.md). Planned work lives in [ROADMAP.md](ROADMAP.md).

## Ways to contribute

- **Write** a new Ethiopia article in Amharic, with an English pair.
- **Translate** published articles. Spanish translations of the 12 Hubs are the most needed (see [Translations](#translations)).
- **Fact-check** live articles and fix errors through an issue or PR.
- **Report wrong-country content.** If anything on the site is about Taiwan but presented as Ethiopia (a fact, place, person, number, URL or image), open an issue. The `.github/ISSUE_TEMPLATE/` folder has a fact-correction template.
- **Source pictures and maps** (see [Picture assets](#picture-assets)).
- **Improve the code**: the Astro site, the scripts, or the `ethiopiamd` CLI in `cli/`.

## Writing an article

### 1. Pick a genuinely Ethiopian topic

**Don't Ethiopia-wash a Taiwan topic.** The fork's find-and-replace turned many Taiwan articles into text that says "Ethiopia" but describes Taiwan (night markets, convenience stores, the MRT, Taiwanese politicians and athletes). Never fix one of these by swapping place names or loosely adapting the topic.

If you're rewriting an old file, treat its category and slot as a priority signal only. Choose a topic that really matters to Ethiopia in that category, research it from scratch, and give it a new English slug. The published flagships show how this went: the old History slots became `aksumite-empire.md` and `battle-of-adwa.md`, and the old Food slots became `injera-and-teff.md` and `doro-wat-and-festive-dining.md`.

### 2. Put the files in the right place

```
knowledge/History/battle-of-adwa.md      ← Amharic original (SSOT)
knowledge/en/History/battle-of-adwa.md   ← English pair, same filename
knowledge/es/History/battle-of-adwa.md   ← optional Spanish translation
```

- Write the Amharic version first. It is the source of truth; translations follow it.
- Use the same lowercase, hyphenated English slug in every language. The validator warns on uppercase letters in English slugs.
- Category folders are PascalCase: `History`, `Geography`, `Culture`, `Food`, `Art`, `Music`, `Technology`, `Nature`, `People`, `Society`, `Economy`, `Lifestyle` (plus `About`).
- Add an entry for each translation to `knowledge/_translations.json`, mapping the translated file to its Amharic original:

  ```json
  "en/History/battle-of-adwa.md": "History/battle-of-adwa.md"
  ```

  The site's language switcher (`src/utils/getLangSwitchPath.ts`) uses this file. Without an entry, switching languages on your article lands on the category page instead of the matching article.

**Never edit anything under `src/content/`.** It is generated from `knowledge/` by `scripts/core/sync.sh` (run by `npm run sync`), and the next sync silently overwrites manual edits.

### 3. Frontmatter

Two things check frontmatter:

- `scripts/core/test-frontmatter.mjs` (run by `npm run test` and the pre-commit hook) requires valid YAML plus `title`, `description`, `date` and `tags`. YAML parse errors, invalid dates, non-string `tags` and duplicate slugs within a category are hard errors. Missing fields are warnings unless you pass `--strict`.
- `src/content.config.ts` defines the Astro schema the site builds with. Unknown values, such as a `status` other than `draft`, `published` or `archived`, break the build.

A typical article:

```yaml
---
title: 'የአድዋ ጦርነት'
description: 'One or two sentences that summarize the article.'
date: '2026-08-24'
tags:
  - History
  - Adwa
status: draft
lastVerified: '2026-08-24'
lastHumanReview: false
---
```

| Field                               | Required    | Notes                                                                             |
| ----------------------------------- | ----------- | --------------------------------------------------------------------------------- |
| `title`                             | Yes         | String. Amharic in the root folder, the target language in translations.          |
| `description`                       | Yes         | String. Used for listings, search and SEO.                                        |
| `date`                              | Yes         | Valid date, Gregorian `YYYY-MM-DD`.                                               |
| `tags`                              | Yes         | An array of strings, not a single comma-separated string.                         |
| `status`                            | Recommended | `draft`, `published` or `archived`. See below. Defaults to `published`.           |
| `featured`                          | No          | Leave it `false` or omit it. Maintainers set `featured`; the PR bot fails `true`. |
| `author`                            | No          | Defaults to `Ethiopia.md Contributors`.                                           |
| `difficulty`                        | No          | `beginner`, `intermediate` or `advanced`.                                         |
| `readingTime`                       | No          | Number of minutes.                                                                |
| `lastUpdated`                       | No          | Date.                                                                             |
| `relatedTopics`, `sources`          | No          | Arrays of strings.                                                                |
| `subcategory`                       | No          | String.                                                                           |
| `image`                             | No          | Path to a hero image under `public/`, e.g. `/images/articles/adwa.jpg`.           |
| `lastVerified`, `lastHumanReview`   | No          | Editorial tracking fields used by the published articles (see EDITORIAL.md).      |
| `originalTitle`, `alternativeNames` | No          | Amharic collection only.                                                          |
| `translationStatus`                 | No          | English collection only: `complete`, `partial` or `planned`.                      |

Don't add `chineseTitle`. It survives in the schema only so archived fork files still build.

### 4. The `status` lifecycle

| Status      | Meaning                                       | On the site?                                                                                                            |
| ----------- | --------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| `draft`     | Work in progress                              | No. Excluded from listings, search, feeds, the API and the wikilink map.                                                |
| `published` | Reviewed, sourced Ethiopia content            | Yes.                                                                                                                    |
| `archived`  | Legacy Taiwan content left over from the fork | Hidden from listings, search and feeds, but the page still builds if linked directly and wikilinks still resolve to it. |

New articles start as `draft` and change to `published` once they're written, sourced and reviewed. Never set `archived` on new work, and never flip an archived Taiwan article to `published`. Replace it with a new article instead.

### 5. Structure and sourcing

Model your article on the published Hubs:

- Start with a short overview paragraph that tells the reader what the article covers.
- Use `##` sections, each covering one real aspect of the topic.
- Aim for substance. The Hubs run to roughly 800 words or more.
- **Cite as you go.** Link each key claim (dates, numbers, names, superlatives) inline to a source someone can check, e.g. `[Britannica: Battle of Adwa](https://www.britannica.com/event/Battle-of-Adwa)`. The published Hubs carry about 4 to 12 such links each, and some also end with a `## Sources` section.
- Prefer authoritative sources: academic works, encyclopedias, UNESCO, Ethiopian government and institutional sites, and established news outlets. Use Wikipedia as a starting point, not your only source.
- Where sources disagree (casualty figures, dates, contested history), say so rather than picking one number silently.
- Dates shown to readers in Amharic text may use the Ethiopian calendar (e.g. 1888 ዓ.ም.). Frontmatter dates stay Gregorian.
- Link related articles with wikilinks, e.g. `[[aksumite-empire]]`. They resolve only to Amharic-root articles, and a wikilink that doesn't resolve becomes plain text.
- Don't invent facts, quotes or statistics, and don't let an AI tool do it for you. If you use AI to help draft, check every claim against a real source before you submit.

## Translations

Translations are very welcome. Translate from the published Amharic article (or its published English pair), not from any old Taiwan copy.

- **Spanish:** the 12 Hub files in `knowledge/es/{Category}/` are `status: draft` stubs. Replace each one with a real translation of the published Hub and set it to `published` when it's reviewed.
- **English:** every new Amharic article needs an English pair at the same path under `knowledge/en/`.
- **Japanese:** the 13 files in `knowledge/ja/` are archived Taiwan content. A new Japanese set should start from the published Hubs.
- Keep citations and links intact, and add a `_translations.json` entry (see above).
- Oromo, Tigrinya and other Ethiopian languages aren't wired into the site yet (there is no locale for them in `astro.config.mjs`). If you'd like to help add one, open an issue first.

## Picture assets

No real Ethiopia photography or cartography has been sourced yet. Every image slot currently holds a clearly labeled placeholder. Contributions here are welcome, as long as the file is real and properly licensed.

Needed:

- **12 category cover photos.** Save as `public/images/categories/{slug}.jpg` (or `.webp`), e.g. `history.jpg`, and update that category's `cover:` path in `src/utils/categoryConfig.ts`.
- **Social share image** at `public/images/ethiopia-social.jpg`, 1200×630. It's used on every page.
- **Four map SVGs** in `public/assets/svg/`: `ethiopia-simplemaps.svg`, `ethiopia-location-map.svg`, `ethiopia-political-division.svg` and `ethiopia-icon-wiki.svg`. Use real, licensed geographic data (for example Wikimedia Commons' "Ethiopia location map.svg", CC BY-SA 3.0). Don't hand-draw a country outline.

Rules for images:

- Include the source URL, author and license in your PR. Wikimedia Commons and other CC-licensed sources are good places to look.
- Open every image and check that it really shows Ethiopia. Several files in this repo had Ethiopia filenames but showed Taiwan.
- When you replace a map SVG, also update its attribution text (both `en` and `am`) in `src/i18n/assets.ts` and `src/i18n/data.ts`.

## Checking your work

```bash
npm run test                                       # validate frontmatter across knowledge/
node scripts/core/test-frontmatter.mjs --strict    # treat missing fields as errors too
bash scripts/tools/quality-scan.sh knowledge/History/battle-of-adwa.md   # content quality scan
bash scripts/tools/review-pr.sh knowledge/History/battle-of-adwa.md      # the PR bot's checks, locally
npm run format::check                              # Prettier
npm run dev                                        # preview at http://localhost:4321
```

After `npm install`, Husky sets up a pre-commit hook that:

1. runs Prettier on staged files (`lint-staged`), and
2. runs `node scripts/core/test-frontmatter.mjs --staged` on staged articles in `knowledge/`.

If the hook fails, fix the reported problem rather than skipping it with `--no-verify`.

## Pull requests

1. Fork the repo and create a branch from `main`.
2. Make your changes in `knowledge/` (and code, if needed). Keep content PRs and engineering PRs separate where you can.
3. Run `npm run test` and preview the article locally.
4. Open a PR against `main` and fill in the PR template. List your sources and, for images, their licenses.

The **PR Content Review** workflow (`.github/workflows/pr-review.yml`) classifies every PR by the files it changes:

| Type          | When                                                                                              | What happens                                                                     |
| ------------- | ------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| `content`     | Only `.md` files under `knowledge/` or `src/content/`, at least one outside `en/`, `es/` or `ja/` | Runs `scripts/tools/review-pr.sh`, posts one bot comment and adds a status label |
| `translation` | Only `.md` files under `en/`, `ja/` or `es/` subfolders                                           | Content review is skipped                                                        |
| `mixed`       | Content files plus anything else                                                                  | Same content review as `content`, plus a `mixed-pr` label                        |
| `engineering` | No content files                                                                                  | Content review is skipped                                                        |

Separately, `.github/workflows/translation-check.yml` runs structural checks (frontmatter present, minimum length, known language folder) on any PR that touches `knowledge/en/`, `knowledge/es/` or `knowledge/ja/`.

The status label is `ready-for-review` (pass), `needs-review` (warnings) or `needs-work` (fail). The bot updates its single comment on each push. Its output is advisory: a maintainer still reviews every PR, and some of the script's quality heuristics haven't been rewritten since the fork yet.

## Code of conduct

Be respectful, especially when writing about contested history, religion or ethnicity. See [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md). Report security issues as described in [SECURITY.md](SECURITY.md).

## License

By contributing, you agree that article content is shared under [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/) and code under the MIT license.
