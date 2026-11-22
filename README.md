# Ethiopia.md

> An AI-native, open knowledge base about Ethiopia, በኢትዮጵያ ላይ ያተኮረ፣ ለሰው ሰራሽ አስተውሎት ምቹ የሆነ ክፍት የእውቀት ማህደር።

Ethiopia.md is an [Astro](https://astro.build) static site built from a corpus of Markdown articles in `knowledge/`, plus a companion command-line tool in `cli/`. Amharic is the single source of truth (SSOT); English is the only translation layer. The site supports exactly two languages, Amharic and English.

Site URL (configured in `astro.config.mjs`): <https://ethiopia.md>

## Project status: forked from Taiwan.md, now Ethiopia-only content

This repository started as a fork of [Taiwan.md](https://github.com/frank890417/taiwan-md), an open knowledge base about Taiwan (code MIT, content CC BY-SA 4.0 per its README). The inherited Taiwan article corpus, images, sounds and one-off scripts have been deleted, and everything in `knowledge/` today is new Ethiopia content written with cited sources. Git history still contains the old material. A few things to know:

- The corpus is small but complete in structure. Every category has a Hub plus several articles, each in Amharic with an English pair. See [What's live](#whats-live) below.
- The Amharic text was drafted with AI assistance and has not yet had a native-speaker review. Every article carries `lastHumanReview: false` until it has.
- Images and maps are real and credited. Category covers, the social share image and the maps come from Wikimedia Commons under CC licenses; credits are in [`public/images/CREDITS.md`](public/images/CREDITS.md), `src/data/image-credits.json` and on the `/assets` page.
- A few fork leftovers may remain in old script comments. If you find the literal string `[Amharic translation needed - original Taiwan context]` anywhere, it is a leftover, not content.

If you find something on the site that is fluent but about the wrong country (a Taiwan fact, place, person or URL presented as Ethiopia's), please open an issue. That has been the most common bug in this repo.

## What's live

Counts below were taken by grepping `status:` in `knowledge/` frontmatter.

| Language                          | Published | Notes                                                                                                 |
| --------------------------------- | --------- | ----------------------------------------------------------------------------------------------------- |
| Amharic (`knowledge/{Category}/`) | 65        | 13 category Hubs, 50 articles, `About/origin-story.md` and `_Home.md`                                 |
| English (`knowledge/en/`)         | 64        | English pairs of the 13 Hubs, the 50 articles and the About origin story (`_Home.md` is Amharic only) |

The 13 categories are History, Geography, Culture, Food, Art, Music, Technology, Nature, People, Society, Economy, Lifestyle and Language. Language has its Hub and two articles; the other twelve each have their Hub and four articles. Every live article lists its verified sources in a `sources:` frontmatter field, which the article page shows as a Sources list. These numbers change as work lands; recount with `grep -rlE "^status: *published" knowledge`.

Oromo, Tigrinya and other Ethiopian languages are not supported yet. There are no `knowledge/om` or `knowledge/ti` directories and no matching locale in `astro.config.mjs`. Adding them is planned for after the core content is in place.

## Quick start

Requires Node.js 22.12 or newer (`engines` in `package.json`). Bun or npm both work.

```bash
git clone https://github.com/EyuReaper/ethiopia-md.git
cd ethiopia-md
bun install        # or: npm install
bun run dev        # http://localhost:4321
```

### Commands

All of these are defined in `package.json`:

| Command                 | What it does                                                      |
| ----------------------- | ----------------------------------------------------------------- |
| `npm run dev`           | Start the Astro dev server                                        |
| `npm run build`         | Run `prebuild`, then `astro build`, then `postbuild`              |
| `npm run preview`       | Serve the built `dist/` locally                                   |
| `npm run test`          | Validate frontmatter for every article in `knowledge/`            |
| `npm run test:ci`       | Same, but only for files changed since `HEAD~1` (used in CI)      |
| `npm run sync`          | Copy `knowledge/` into `src/content/` (`scripts/core/sync.sh`)    |
| `npm run sync:build`    | Sync, then `astro build`                                          |
| `npm run check-images`  | Check image references (`scripts/utils/check-images.mjs`)         |
| `npm run check-links`   | Check every URL in `knowledge/` (`scripts/utils/check-links.mjs`) |
| `npm run format::check` | `prettier --check .`                                              |
| `npm run format::write` | `prettier --write .`                                              |

The `prebuild` step runs three scripts, all reading from `knowledge/`, and writes static JSON to `public/api/`:

1. `scripts/core/generate-api.js`
2. `scripts/core/build-search-index.mjs`
3. `scripts/core/generate-dashboard-data.js`

`postbuild` runs `scripts/core/post-build-check.mjs` against `dist/`. A full build takes about two minutes and emits roughly 200 pages. The check's floors (150 pages in total, at least 2 articles per category) are sized for the current corpus; raise them as it grows.

`npm run check-links -- --out report.md` requests each URL once and reports OK, BLOCKED (sites such as Britannica and UNESCO's World Heritage pages that refuse automated clients, so check those in a browser), DEAD and ERROR.

A Husky pre-commit hook runs Prettier on staged files (`lint-staged`) and validates frontmatter on staged articles (`node scripts/core/test-frontmatter.mjs --staged`). There is no ESLint and no unit test suite; "tests" here means content and schema validation.

## How the repo is organized

```
knowledge/              Source articles (SSOT). Edit these.
  {Category}/           Amharic articles, one folder per category
  en/{Category}/        English translations
  _translations.json    Maps translated files to their Amharic originals
  _Home.md              Landing note for the corpus
src/content/            Generated by `npm run sync`. Do not edit.
src/pages/              Astro routes. Amharic is unprefixed; English lives under /en/
src/i18n/               UI strings
src/data/               Generated and hand-kept data, including image-credits.json
public/images/          Real, credited photos (see CREDITS.md)
plugins/                remark plugin that turns [[wikilinks]] into links
scripts/                Build, validation and maintenance scripts
cli/                    The `ethiopiamd` command-line tool (separate package)
```

Article frontmatter is validated by `scripts/core/test-frontmatter.mjs` and typed by the content collection schema in `src/content.config.ts`. See [CONTRIBUTING.md](CONTRIBUTING.md) for the details.

### Emoji as SVG

Every emoji on the website is shown as an SVG (Twemoji) so it looks the same on every device. Just type the emoji in a template, translation or article. `npm run build` (and `npm run build-emoji`) copies the SVGs that are used into `public/emoji/`, and `src/middleware.ts` swaps them into the page. The Ethiopian flag is kept as a native emoji on purpose. Emoji in `<title>`, `<option>`, meta tags and the terminal CLI stay as text. `npm run check-emoji` checks the category emojis; the postbuild step fails if any emoji is left as text.

## The `ethiopiamd` CLI

`cli/` is a separate npm package with its own `package.json`. It is not published to npm yet, so run it from the repo:

```bash
cd cli
npm install
node src/index.js --help
node src/index.js search "Adwa"
# or link it globally for development:
npm link && ethiopiamd --help
```

Commands include `search`, `read`, `list`, `random`, `stats`, `today`, `quiz`, `explore`, `graph`, `rag`, `diff`, `sync`, `contribute` and `validate`. Inside the repo it reads `knowledge/` directly. It lists only published articles, in Amharic and English.

## Contributing

Writers, translators, fact-checkers, photographers and developers are all welcome. Start with [CONTRIBUTING.md](CONTRIBUTING.md). The editorial rules are in [EDITORIAL.md](EDITORIAL.md) and planned work is in [ROADMAP.md](ROADMAP.md).

The most useful contributions right now:

- A native-speaker read of the Amharic articles, with fixes as pull requests
- New, sourced Ethiopia articles in Amharic, each with an English pair (Language has the fewest)
- Checking citations that automated tools could not read, in a browser (Britannica, UNESCO and DOI links)
- More properly licensed Ethiopia photos for individual articles, with credits added to `src/data/image-credits.json`
- Reports of anything on the site that is still about Taiwan

## Tech stack

- Astro 6 with TypeScript, static output deployed to GitHub Pages (`.github/workflows/deploy.yml`)
- D3.js for the knowledge graph page (`/graph`)
- MiniSearch for client-side search
- Markdown content with a custom wikilink remark plugin

## License

- Content (`knowledge/`): [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/), see [`LICENSE-CONTENT.md`](LICENSE-CONTENT.md)
- Code: MIT, see [`LICENSE`](LICENSE)
