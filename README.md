# Ethiopia.md

> An AI-native, open knowledge base about Ethiopia — በኢትዮጵያ ላይ ያተኮረ፣ ለሰው ሰራሽ አስተውሎት ምቹ የሆነ ክፍት የእውቀት ማህደር።

Ethiopia.md is an [Astro](https://astro.build) static site built from a corpus of Markdown articles in `knowledge/`, plus a companion command-line tool in `cli/`. Amharic is the single source of truth (SSOT); English is the only translation layer. The site supports exactly two languages, Amharic and English.

Site URL (configured in `astro.config.mjs`): <https://ethiopia.md>

## Project status: forked from Taiwan.md, now Ethiopia-only content

This repository started as a fork of Taiwan.md, an open knowledge base about Taiwan. The inherited Taiwan article corpus has been deleted from `knowledge/`, and everything in `knowledge/` today is new Ethiopia content. Some site code and docs may still carry fork leftovers. Expect the following:

- **The corpus is small.** `knowledge/` holds only new Ethiopia articles (Amharic with English pairs). Git history still contains the deleted Taiwan articles.
- **The live content is small, and all of it is new.** See [What's live](#whats-live) below.
- **Some contributor docs and script comments may still be rough.** If you find the literal string `[Amharic translation needed - original Taiwan context]` anywhere, it is a fork leftover, not content.
- **No real Ethiopia photography or cartography has been sourced yet.** Category covers, the social share image and the map SVGs are clearly labeled placeholders.

If you find something on the site that is fluent but about the wrong country (a Taiwan fact, place, person or URL presented as Ethiopia's), please open an issue. That has been the most common bug in this repo.

## What's live

Counts below were taken by grepping `status:` in `knowledge/` frontmatter.

| Language                          | Published | Notes                                                                                                |
| --------------------------------- | --------- | ---------------------------------------------------------------------------------------------------- |
| Amharic (`knowledge/{Category}/`) | 38        | 12 category Hubs, 24 flagship articles (2 per category), plus `_Home.md` and `About/origin-story.md` |
| English (`knowledge/en/`)         | 37        | English pairs of the 12 Hubs, 24 flagships and the About origin story                                |

The 12 categories are History, Geography, Culture, Food, Art, Music, Technology, Nature, People, Society, Economy and Lifestyle. Every live article was written from scratch with cited sources. These numbers change as work lands; recount with `grep -rl "^status: published" knowledge`.

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

| Command                 | What it does                                                   |
| ----------------------- | -------------------------------------------------------------- |
| `npm run dev`           | Start the Astro dev server                                     |
| `npm run build`         | Run `prebuild`, then `astro build`, then `postbuild`           |
| `npm run preview`       | Serve the built `dist/` locally                                |
| `npm run test`          | Validate frontmatter for every article in `knowledge/`         |
| `npm run test:ci`       | Same, but only for files changed since `HEAD~1` (used in CI)   |
| `npm run sync`          | Copy `knowledge/` into `src/content/` (`scripts/core/sync.sh`) |
| `npm run sync:build`    | Sync, then `astro build`                                       |
| `npm run check-images`  | Check image references (`scripts/utils/check-images.mjs`)      |
| `npm run check-links`   | Check links (`scripts/utils/check-links.sh`)                   |
| `npm run format::check` | `prettier --check .`                                           |
| `npm run format::write` | `prettier --write .`                                           |

The `prebuild` step runs three scripts, all reading from `knowledge/`, and writes static JSON to `public/api/`:

1. `scripts/core/generate-api.js`
2. `scripts/core/build-search-index.mjs`
3. `scripts/core/generate-dashboard-data.js`

`postbuild` runs `scripts/core/post-build-check.mjs` against `dist/`. Its page-count thresholds are sized for the current, small corpus; raise them as the corpus grows.

A Husky pre-commit hook runs Prettier on staged files (`lint-staged`) and validates frontmatter on staged articles (`node scripts/core/test-frontmatter.mjs --staged`). There is no ESLint and no unit test suite; "tests" here means content and schema validation.

## How the repo is organized

```
knowledge/              Source articles (SSOT). Edit these.
  {Category}/           Amharic articles, one folder per category
  en/{Category}/        English translations
  _translations.json    Maps translated files to their Amharic originals
src/content/            Generated by `npm run sync`. Do not edit.
src/pages/              Astro routes. Amharic is unprefixed; English lives under /en/
src/i18n/               UI strings
plugins/                remark plugin that turns [[wikilinks]] into links
scripts/                Build, validation and maintenance scripts
cli/                    The `ethiopiamd` command-line tool (separate package)
```

Article frontmatter is validated by `scripts/core/test-frontmatter.mjs` and typed by the content collection schema in `src/content.config.ts`. See [CONTRIBUTING.md](CONTRIBUTING.md) for the details.

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

- New, sourced Ethiopia articles in Amharic, each with an English pair
- Real, properly licensed Ethiopia photos and maps to replace the placeholders
- Reports of anything on the site that is still about Taiwan

## Tech stack

- Astro 6 with TypeScript, static output deployed to GitHub Pages (`.github/workflows/deploy.yml`)
- D3.js for the knowledge graph page (`/graph`)
- MiniSearch for client-side search
- Markdown content with a custom wikilink remark plugin

## License

- Content (`knowledge/`): [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/), see [`LICENSE-CONTENT.md`](LICENSE-CONTENT.md)
- Code: MIT, see [`LICENSE`](LICENSE)
