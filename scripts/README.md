# ⚙️ scripts/ — [Amharic translation needed - original Taiwan context]

> AI agent [Amharic translation needed - original Taiwan context]，[Amharic translation needed - original Taiwan context]。

---

## [Amharic translation needed - original Taiwan context]

```
scripts/
├── core/          Build pipeline（prebuild [Amharic translation needed - original Taiwan context]）
├── tools/         [Amharic translation needed - original Taiwan context]
├── utils/         [Amharic translation needed - original Taiwan context]/[Amharic translation needed - original Taiwan context]
└── deprecated/    [Amharic translation needed - original Taiwan context]
```

---

## 🔴 core/ — Build Pipeline（npm run build [Amharic translation needed - original Taiwan context]）

| [Amharic translation needed - original Taiwan context]                          | [Amharic translation needed - original Taiwan context] | [Amharic translation needed - original Taiwan context]                                           |
| ----------------------------- | ---- | ---------------------------------------------- |
| `sync.sh`                     | bash | [Amharic translation needed - original Taiwan context] knowledge/ → src/content/（SSOT [Amharic translation needed - original Taiwan context]）    |
| `generate-api.js`             | node | [Amharic translation needed - original Taiwan context] `public/api/*.json`（[Amharic translation needed - original Taiwan context]、[Amharic translation needed - original Taiwan context]） |
| `generate-dashboard-data.js`  | node | [Amharic translation needed - original Taiwan context] Dashboard 4 [Amharic translation needed - original Taiwan context] JSON API                   |
| `generate-map-markers.js`     | node | [Amharic translation needed - original Taiwan context]                               |
| `generate-content-stats.js`\* | node | [Amharic translation needed - original Taiwan context] generate-api [Amharic translation needed - original Taiwan context]，[Amharic translation needed - original Taiwan context]         |
| `build-search-index.mjs`      | node | [Amharic translation needed - original Taiwan context]                               |
| `post-build-check.mjs`        | node | Build [Amharic translation needed - original Taiwan context]（[Amharic translation needed - original Taiwan context]、[Amharic translation needed - original Taiwan context]）     |
| `test-frontmatter.mjs`        | node | Pre-commit hook：[Amharic translation needed - original Taiwan context] frontmatter [Amharic translation needed - original Taiwan context]         |

**[Amharic translation needed - original Taiwan context]**：`sync.sh` → `generate-*.js` → Astro build → `post-build-check.mjs`

## 🟡 tools/ — [Amharic translation needed - original Taiwan context]

| [Amharic translation needed - original Taiwan context]                     | [Amharic translation needed - original Taiwan context] | [Amharic translation needed - original Taiwan context]                                                             |
| ------------------------ | ---- | ---------------------------------------------------------------- |
| `quality-scan.sh`        | bash | **[Amharic translation needed - original Taiwan context] v3.0** — 14 [Amharic translation needed - original Taiwan context]（[Amharic translation needed - original Taiwan context]/[Amharic translation needed - original Taiwan context]/[Amharic translation needed - original Taiwan context]/[Amharic translation needed - original Taiwan context]） |
| `review-pr.sh`           | bash | PR [Amharic translation needed - original Taiwan context]（frontmatter + [Amharic translation needed - original Taiwan context] + [Amharic translation needed - original Taiwan context] 4 [Amharic translation needed - original Taiwan context]）                |
| `rewrite-pipeline.sh`    | bash | [Amharic translation needed - original Taiwan context]（Stage 1-5 [Amharic translation needed - original Taiwan context]）                           |
| `translate.sh`           | bash | [Amharic translation needed - original Taiwan context]（[Amharic translation needed - original Taiwan context] AI + [Amharic translation needed - original Taiwan context]）                                   |
| `update-stats.sh`        | bash | [Amharic translation needed - original Taiwan context] README [Amharic translation needed - original Taiwan context]（[Amharic translation needed - original Taiwan context]/[Amharic translation needed - original Taiwan context]）                        |
| `manage-featured.sh`     | bash | [Amharic translation needed - original Taiwan context] featured [Amharic translation needed - original Taiwan context]                                           |
| `assign-subcategory.cjs` | node | [Amharic translation needed - original Taiwan context]（[Amharic translation needed - original Taiwan context] taxonomy → [Amharic translation needed - original Taiwan context] frontmatter）                   |
| `check-freshness.js`     | node | [Amharic translation needed - original Taiwan context]（lastVerified [Amharic translation needed - original Taiwan context]）                          |

**[Amharic translation needed - original Taiwan context]**：

```bash
bash scripts/tools/quality-scan.sh                    # [Amharic translation needed - original Taiwan context]
bash scripts/tools/quality-scan.sh knowledge/Art/X.md  # [Amharic translation needed - original Taiwan context]
bash scripts/tools/quality-scan.sh --sort --diff       # [Amharic translation needed - original Taiwan context] + [Amharic translation needed - original Taiwan context]
bash scripts/tools/review-pr.sh 123                    # [Amharic translation needed - original Taiwan context] PR #123
```

## 🟢 utils/ — [Amharic translation needed - original Taiwan context]（[Amharic translation needed - original Taiwan context]）

| [Amharic translation needed - original Taiwan context]                             | [Amharic translation needed - original Taiwan context]   | [Amharic translation needed - original Taiwan context]                             |
| -------------------------------- | ------ | -------------------------------- |
| `check-links.sh`                 | bash   | [Amharic translation needed - original Taiwan context]         |
| `check-references.mjs`           | node   | [Amharic translation needed - original Taiwan context] wikilink [Amharic translation needed - original Taiwan context]         |
| `check-translation-sync.sh`      | bash   | [Amharic translation needed - original Taiwan context] SSOT [Amharic translation needed - original Taiwan context] |
| `check-images.mjs`               | node   | [Amharic translation needed - original Taiwan context]/[Amharic translation needed - original Taiwan context]            |
| `fix-wikilinks.mjs`              | node   | [Amharic translation needed - original Taiwan context] wikilink [Amharic translation needed - original Taiwan context]           |
| `fix-wikilinks-v2.mjs`           | node   | [Amharic translation needed - original Taiwan context] wikilink [Amharic translation needed - original Taiwan context]（[Amharic translation needed - original Taiwan context] rename）  |
| `fix-all-frontmatter.py`         | python | [Amharic translation needed - original Taiwan context] frontmatter [Amharic translation needed - original Taiwan context]    |
| `cache-images.sh`                | bash   | [Amharic translation needed - original Taiwan context]               |
| `cache-images-v2.sh`             | bash   | [Amharic translation needed - original Taiwan context] v2（[Amharic translation needed - original Taiwan context] Wikimedia Commons）  |
| `cache-and-replace.py`           | python | [Amharic translation needed - original Taiwan context] + [Amharic translation needed - original Taiwan context] markdown [Amharic translation needed - original Taiwan context]    |
| `download-wiki-images.mjs`       | node   | [Amharic translation needed - original Taiwan context]                 |
| `replace-wiki-urls.py`           | python | [Amharic translation needed - original Taiwan context] URL [Amharic translation needed - original Taiwan context]      |
| `replace-wiki-urls.sh`           | bash   | Shell [Amharic translation needed - original Taiwan context] URL [Amharic translation needed - original Taiwan context]            |
| `i18n-status.py`                 | python | [Amharic translation needed - original Taiwan context]             |
| `translation-sync-report.sh`     | bash   | [Amharic translation needed - original Taiwan context]                     |
| `generate-translation-issues.sh` | bash   | [Amharic translation needed - original Taiwan context] GitHub issues     |
| `publish.sh`                     | bash   | [Amharic translation needed - original Taiwan context]                         |
| `test-wikilinks.mjs`             | node   | Wikilink [Amharic translation needed - original Taiwan context]                |

## ⚫ deprecated/ — [Amharic translation needed - original Taiwan context]

| [Amharic translation needed - original Taiwan context]                     | [Amharic translation needed - original Taiwan context]                         |
| ------------------------ | ---------------------------- |
| `fix-all-frontmatter.py` | [Amharic translation needed - original Taiwan context] test-frontmatter.mjs [Amharic translation needed - original Taiwan context] |
| `fix-hub-frontmatter.sh` | [Amharic translation needed - original Taiwan context]，[Amharic translation needed - original Taiwan context]           |
| `quick-fix-hubs.py`      | [Amharic translation needed - original Taiwan context]                         |
| `sync-knowledge.sh`      | [Amharic translation needed - original Taiwan context] core/sync.sh [Amharic translation needed - original Taiwan context]         |

## 📄 [Amharic translation needed - original Taiwan context]

| [Amharic translation needed - original Taiwan context]                | [Amharic translation needed - original Taiwan context]                          |
| ------------------- | ----------------------------- |
| `i18n-mapping.json` | [Amharic translation needed - original Taiwan context]→[Amharic translation needed - original Taiwan context]（[Amharic translation needed - original Taiwan context]） |

---

_[Amharic translation needed - original Taiwan context]：2026-03-28_
