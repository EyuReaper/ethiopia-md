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

Ethiopia.md started as a fork of a Taiwan-focused project (Taiwan.md). The old Taiwan articles have been deleted from `knowledge/`; everything there is new Ethiopia content. That shapes how you contribute:

- Fork leftovers may still turn up in site code, docs or script comments, such as the placeholder string `[Amharic translation needed - original Taiwan context]`. Treat them as bugs, not guidance, and report or fix them.
- Never restore deleted Taiwan articles from git history or use them as a model.
- The best models for tone, structure and citation density are the published articles, especially the 12 category Hubs (`knowledge/{Category}/_{Category} Hub.md` and their English pairs in `knowledge/en/`).

Editorial standards live in [EDITORIAL.md](EDITORIAL.md). Planned work lives in [ROADMAP.md](ROADMAP.md).

## Ways to contribute

- **Write** a new Ethiopia article in Amharic, with an English pair.
- **Translate** published articles into English, or help review the Amharic (see [Translations](#translations)).
- **Fact-check** live articles and fix errors through an issue or PR.
- **Report wrong-country content.** If anything on the site is about Taiwan but presented as Ethiopia (a fact, place, person, number, URL or image), open an issue. The `.github/ISSUE_TEMPLATE/` folder has a fact-correction template.
- **Source pictures and maps** (see [Picture assets](#picture-assets)).
- **Improve the code**: the Astro site, the scripts, or the `ethiopiamd` CLI in `cli/`.

## Writing an article

### 1. Pick a genuinely Ethiopian topic

**Don't Ethiopia-wash a Taiwan topic.** The fork's find-and-replace once turned Taiwan articles into text that said "Ethiopia" but described Taiwan (night markets, convenience stores, the MRT, Taiwanese politicians and athletes). Never adapt a topic from the deleted corpus by swapping place names.

Choose a topic that really matters to Ethiopia in its category, research it from scratch, and give it a new English slug. The published flagships show the approach: the History flagships are `aksumite-empire.md` and `battle-of-adwa.md`, and the Food flagships are `injera-and-teff.md` and `doro-wat-and-festive-dining.md`.

### 2. Put the files in the right place

```
knowledge/History/battle-of-adwa.md      ← Amharic original (SSOT)
knowledge/en/History/battle-of-adwa.md   ← English pair, same filename
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

| Field                             | Required    | Notes                                                                             |
| --------------------------------- | ----------- | --------------------------------------------------------------------------------- |
| `title`                           | Yes         | String. Amharic in the root folder, the target language in translations.          |
| `description`                     | Yes         | String. Used for listings, search and SEO.                                        |
| `date`                            | Yes         | Valid date, Gregorian `YYYY-MM-DD`.                                               |
| `tags`                            | Yes         | An array of strings, not a single comma-separated string.                         |
| `status`                          | Recommended | `draft`, `published` or `archived`. See below. Defaults to `published`.           |
| `featured`                        | No          | Leave it `false` or omit it. Maintainers set `featured`; the PR bot fails `true`. |
| `author`                          | No          | Defaults to `Ethiopia.md Contributors`.                                           |
| `difficulty`                      | No          | `beginner`, `intermediate` or `advanced`.                                         |
| `readingTime`                     | No          | Number of minutes.                                                                |
| `lastUpdated`                     | No          | Date.                                                                             |
| `relatedTopics`, `sources`        | No          | Arrays of strings.                                                                |
| `subcategory`                     | No          | String.                                                                           |
| `image`                           | No          | Path to a hero image under `public/`, e.g. `/images/articles/adwa.jpg`.           |
| `lastVerified`, `lastHumanReview` | No          | Editorial tracking fields used by the published articles (see EDITORIAL.md).      |
| `alternativeNames`                | No          | Amharic collection only.                                                          |
| `translationStatus`               | No          | English collection only: `complete`, `partial` or `planned`.                      |

### 4. The `status` lifecycle

| Status      | Meaning                             | On the site?                                                                                     |
| ----------- | ----------------------------------- | ------------------------------------------------------------------------------------------------ |
| `draft`     | Work in progress                    | No. Excluded from listings, search, feeds, the API and the wikilink map.                         |
| `published` | Reviewed, sourced Ethiopia content  | Yes.                                                                                             |
| `archived`  | Retired article kept for the record | Hidden from listings, search, feeds and wikilinks, but the page still builds if linked directly. |

New articles start as `draft` and change to `published` once they're written, sourced and reviewed. Use `archived` only to retire an article that is no longer accurate or wanted; never set it on new work. No archived files exist at the moment.

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

Translations are very welcome. Translate from the published Amharic article (or its published English pair). The site supports exactly two languages, Amharic and English; there are no Spanish or Japanese folders.

- **English:** every new Amharic article needs an English pair at the same path under `knowledge/en/`.
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

| Type          | When                                                                              | What happens                                                                     |
| ------------- | --------------------------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| `content`     | Only `.md` files under `knowledge/` or `src/content/`, at least one outside `en/` | Runs `scripts/tools/review-pr.sh`, posts one bot comment and adds a status label |
| `translation` | Only `.md` files under `en/` subfolders                                           | Content review is skipped                                                        |
| `mixed`       | Content files plus anything else                                                  | Same content review as `content`, plus a `mixed-pr` label                        |
| `engineering` | No content files                                                                  | Content review is skipped                                                        |

Separately, `.github/workflows/translation-check.yml` runs structural checks (frontmatter present, minimum length, known language folder) on any PR that touches `knowledge/en/`.

The status label is `ready-for-review` (pass), `needs-review` (warnings) or `needs-work` (fail). The bot updates its single comment on each push. Its output is advisory: a maintainer still reviews every PR, and some of the script's quality heuristics haven't been rewritten since the fork yet.

## Code of conduct

Be respectful, especially when writing about contested history, religion or ethnicity. See [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md). Report security issues as described in [SECURITY.md](SECURITY.md).

## License

By contributing, you agree that article content is shared under [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/) and code under the MIT license.
