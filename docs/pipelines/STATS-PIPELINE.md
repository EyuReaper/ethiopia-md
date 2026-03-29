# Stats Pipeline — [Amharic translation needed - original Taiwan context]

> [Amharic translation needed - original Taiwan context] 00:00 (Asia/Taipei) [Amharic translation needed - original Taiwan context] Cron [Amharic translation needed - original Taiwan context]

---

## [Amharic translation needed - original Taiwan context]

```
git pull → update-stats.sh → git add ([Amharic translation needed - original Taiwan context]) → commit → push
```

## [Amharic translation needed - original Taiwan context]

### 1. [Amharic translation needed - original Taiwan context]

```bash
cd ~/ethiopia-md && git pull
```

### 2. [Amharic translation needed - original Taiwan context]

```bash
bash scripts/tools/update-stats.sh
```

[Amharic translation needed - original Taiwan context]：

1. [Amharic translation needed - original Taiwan context] GitHub API [Amharic translation needed - original Taiwan context] stars / forks / contributors [Amharic translation needed - original Taiwan context]
2. [Amharic translation needed - original Taiwan context] `README.md` [Amharic translation needed - original Taiwan context]
3. [Amharic translation needed - original Taiwan context] `src/i18n/about.ts` [Amharic translation needed - original Taiwan context] About [Amharic translation needed - original Taiwan context]（[Amharic translation needed - original Taiwan context]）
4. **Merge** GitHub [Amharic translation needed - original Taiwan context] `public/api/stats.json`（[Amharic translation needed - original Taiwan context]）
5. [Amharic translation needed - original Taiwan context] `generate-content-stats.js` [Amharic translation needed - original Taiwan context]

### 3. Commit + Push

```bash
git add README.md src/i18n/about.ts public/api/stats.json src/data/content-stats.json
git diff --cached --quiet || (git commit -m "chore: daily stats update" && git push)
```

---

## ⚠️ [Amharic translation needed - original Taiwan context]

### [Amharic translation needed - original Taiwan context] `git add -A`

[Amharic translation needed - original Taiwan context] add [Amharic translation needed - original Taiwan context] 4 [Amharic translation needed - original Taiwan context]。`git add -A` [Amharic translation needed - original Taiwan context] commit。

### [Amharic translation needed - original Taiwan context] `about.template.astro`

Contributors grid [Amharic translation needed - original Taiwan context] Cron（Ethiopia.md Contributors Update）[Amharic translation needed - original Taiwan context]。Stats cron [Amharic translation needed - original Taiwan context] about.template.astro = [Amharic translation needed - original Taiwan context] Sponsors + Contact section。**[Amharic translation needed - original Taiwan context] 3 [Amharic translation needed - original Taiwan context]。**

### `stats.json` [Amharic translation needed - original Taiwan context] merge [Amharic translation needed - original Taiwan context] overwrite

`public/api/stats.json` [Amharic translation needed - original Taiwan context]：

- `generate-content-stats.js`：categories、tags、subcategories [Amharic translation needed - original Taiwan context]（[Amharic translation needed - original Taiwan context]）
- `update-stats.sh`：stars、forks、contributors（GitHub API [Amharic translation needed - original Taiwan context]）

[Amharic translation needed - original Taiwan context] GitHub [Amharic translation needed - original Taiwan context]，**[Amharic translation needed - original Taiwan context]**。[Amharic translation needed - original Taiwan context] = Dashboard [Amharic translation needed - original Taiwan context]。

### `cd` [Amharic translation needed - original Taiwan context]

[Amharic translation needed - original Taiwan context] `scripts/tools/`，[Amharic translation needed - original Taiwan context] `cd "$(dirname "$0")/../.."` [Amharic translation needed - original Taiwan context] repo root。[Amharic translation needed - original Taiwan context] `..`（[Amharic translation needed - original Taiwan context] `scripts/`）。

---

## [Amharic translation needed - original Taiwan context]

| [Amharic translation needed - original Taiwan context]                                      | [Amharic translation needed - original Taiwan context]                                       |
| ----------------------------------------- | ------------------------------------------ |
| `scripts/tools/update-stats.sh`           | [Amharic translation needed - original Taiwan context]                                     |
| `scripts/tools/generate-content-stats.js` | [Amharic translation needed - original Taiwan context]（categories/tags）                |
| `public/api/stats.json`                   | [Amharic translation needed - original Taiwan context] stats API（Dashboard + About [Amharic translation needed - original Taiwan context]） |
| `src/i18n/about.ts`                       | About [Amharic translation needed - original Taiwan context]                         |
| `src/data/content-stats.json`             | Build-time [Amharic translation needed - original Taiwan context]                        |

## [Amharic translation needed - original Taiwan context] Cron

| Cron                          | [Amharic translation needed - original Taiwan context]  | [Amharic translation needed - original Taiwan context]                                |
| ----------------------------- | ----- | ----------------------------------- |
| Ethiopia.md Daily Stats Update  | 00:00 | [Amharic translation needed - original Taiwan context] pipeline                         |
| Ethiopia.md Contributors Update | 03:30 | [Amharic translation needed - original Taiwan context] contributor [Amharic translation needed - original Taiwan context] + README [Amharic translation needed - original Taiwan context] |

---

_[Amharic translation needed - original Taiwan context]：v1.0 | 2026-03-29_
