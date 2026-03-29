# Dashboard Update Pipeline

> Ethiopia.md [Amharic translation needed - original Taiwan context]

---

## [Amharic translation needed - original Taiwan context]

```
knowledge/*.md (SSOT)
       │
       ▼
scripts/generate-dashboard-data.js    ← prebuild [Amharic translation needed - original Taiwan context]
       │
       ├── public/api/dashboard-articles.json      ([Amharic translation needed - original Taiwan context] + healthScore + subcategory)
       ├── public/api/dashboard-vitals.json         ([Amharic translation needed - original Taiwan context] + [Amharic translation needed - original Taiwan context])
       ├── public/api/dashboard-organism.json       (8 [Amharic translation needed - original Taiwan context])
       └── public/api/dashboard-translations.json   ([Amharic translation needed - original Taiwan context])

public/api/dashboard-analytics.json   ← [Amharic translation needed - original Taiwan context]/cron [Amharic translation needed - original Taiwan context] GA4 API [Amharic translation needed - original Taiwan context]（[Amharic translation needed - original Taiwan context]）

src/templates/dashboard.template.astro (2800+ [Amharic translation needed - original Taiwan context] single-file template)
       │
       ├── <script define:vars={{ lang }}>   ← fetch 5 JSON + render 11 sections
       └── <style is:global>                 ← ⚠️ [Amharic translation needed - original Taiwan context] is:global（JS innerHTML [Amharic translation needed - original Taiwan context]）

src/pages/dashboard.astro              ← [Amharic translation needed - original Taiwan context]
src/pages/en/dashboard.astro           ← [Amharic translation needed - original Taiwan context]
src/i18n/dashboard.ts                  ← section [Amharic translation needed - original Taiwan context]
src/components/Header.astro            ← nav dropdown（8 section anchors）
```

---

## [Amharic translation needed - original Taiwan context]

### Layer 1: Build-Time（[Amharic translation needed - original Taiwan context]）

[Amharic translation needed - original Taiwan context] `npm run build` [Amharic translation needed - original Taiwan context] `prebuild`：

```bash
node scripts/generate-dashboard-data.js
```

[Amharic translation needed - original Taiwan context] `knowledge/` [Amharic translation needed - original Taiwan context] `.md` [Amharic translation needed - original Taiwan context]，[Amharic translation needed - original Taiwan context] 4 [Amharic translation needed - original Taiwan context] JSON：

| JSON                          | [Amharic translation needed - original Taiwan context]                                  | [Amharic translation needed - original Taiwan context]                                                                                                    |
| ----------------------------- | ------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| `dashboard-articles.json`     | knowledge/\*.md frontmatter + git log | title, category, subcategory, slug, date, healthScore, wordCount, tags, humanReview, featured, revision |
| `dashboard-vitals.json`       | articles [Amharic translation needed - original Taiwan context] + git shortlog          | totalArticles, contributors, articlesLast7/30Days, humanReviewedPercent, languageCoverage               |
| `dashboard-organism.json`     | [Amharic translation needed - original Taiwan context]                            | 8 organs: heart/immune/dna/skeleton/breath/reproduce/senses/translation + metrics                       |
| `dashboard-translations.json` | src/content/{en,es,ja}/ [Amharic translation needed - original Taiwan context]          | [Amharic translation needed - original Taiwan context]                                                                              |

### Layer 2: GA4 Analytics（[Amharic translation needed - original Taiwan context]/Cron）

GA4 [Amharic translation needed - original Taiwan context] build-time [Amharic translation needed - original Taiwan context]（[Amharic translation needed - original Taiwan context] API credentials），[Amharic translation needed - original Taiwan context]：

```bash
# [Amharic translation needed - original Taiwan context] GA4 [Amharic translation needed - original Taiwan context]
cd ~/clawd/skills/ga4-analytics-search-indexing-skill/scripts
GA4_PROPERTY_ID=<your-property-id> npx tsx ga4-ethiopia-fetch.ts

# [Amharic translation needed - original Taiwan context] repo
cp /tmp/ga4-clean.json ~/ethiopia-md/public/api/dashboard-analytics.json
```

**GA4 Property:** [Amharic translation needed - original Taiwan context] TOOLS.md（Property ID + Measurement ID）
**Service Account:** [Amharic translation needed - original Taiwan context] `~/.config/gcloud/` [Amharic translation needed - original Taiwan context]

📌 **[Amharic translation needed - original Taiwan context]：** GitHub Actions cron [Amharic translation needed - original Taiwan context] UTC 06:00 [Amharic translation needed - original Taiwan context] + commit

### Layer 3: Template Rendering（Client-Side）

Dashboard [Amharic translation needed - original Taiwan context]，client JS fetch 5 [Amharic translation needed - original Taiwan context] JSON [Amharic translation needed - original Taiwan context] 11 [Amharic translation needed - original Taiwan context] section：

```
fetch → dashboard-articles.json ──┐
fetch → dashboard-vitals.json ────┤
fetch → dashboard-organism.json ──┤ Promise.all()
fetch → dashboard-translations.json ┤
fetch → dashboard-analytics.json ──┘ (.catch → null, GA4 [Amharic translation needed - original Taiwan context])
                                    │
                                    ▼
renderVitals()              → #vitals (6 cards)
renderActivityFeed()        → #activity-feed (10 items, links + date)
renderRegistry()            → #registry (sortable table, cat colors, subcategory)
renderHealthDistribution()  → #health-chart (SVG histogram)
renderOrganism()            → #organ-grid (8 cards + GitHub links)
renderTranslations()        → #translation-bars (4 donut charts)
renderImmune()              → #immune-queue (collapsible list)
renderGrowth()              → #growth-chart (SVG area chart + milestones)
renderContentAnalysis()     → #ca-category-chart (bar chart + stats)
renderAnalytics()           → #analytics (GA4 totals + sources + pages + countries)
renderNextSteps()           → #nextsteps-grid (3 recommendation cards)
renderFooter()              → timestamp
```

---

## [Amharic translation needed - original Taiwan context] Section [Amharic translation needed - original Taiwan context] SOP

### 1. [Amharic translation needed - original Taiwan context]

[Amharic translation needed - original Taiwan context] section [Amharic translation needed - original Taiwan context]：

- **[Amharic translation needed - original Taiwan context] knowledge/ [Amharic translation needed - original Taiwan context]** → [Amharic translation needed - original Taiwan context] `generate-dashboard-data.js`，[Amharic translation needed - original Taiwan context] JSON
- **[Amharic translation needed - original Taiwan context] API** → [Amharic translation needed - original Taiwan context]（[Amharic translation needed - original Taiwan context] `ga4-ethiopia-fetch.ts`），[Amharic translation needed - original Taiwan context] `public/api/dashboard-*.json`
- **[Amharic translation needed - original Taiwan context]** → [Amharic translation needed - original Taiwan context] render function [Amharic translation needed - original Taiwan context] JSON [Amharic translation needed - original Taiwan context]

### 2. Template [Amharic translation needed - original Taiwan context]

```
1. HTML section     → [Amharic translation needed - original Taiwan context] <main> [Amharic translation needed - original Taiwan context]，[Amharic translation needed - original Taiwan context] id
2. JS render()      → [Amharic translation needed - original Taiwan context] <script> block，[Amharic translation needed - original Taiwan context] pattern [Amharic translation needed - original Taiwan context] render function
3. CSS              → [Amharic translation needed - original Taiwan context] <style is:global> block ⚠️ [Amharic translation needed - original Taiwan context] is:global
4. Promise.all()    → [Amharic translation needed - original Taiwan context] fetch（[Amharic translation needed - original Taiwan context] JSON）+ [Amharic translation needed - original Taiwan context] .then() [Amharic translation needed - original Taiwan context] render
5. i18n             → [Amharic translation needed - original Taiwan context] src/i18n/dashboard.ts
6. Nav dropdown     → [Amharic translation needed - original Taiwan context] Header.astro dashboard dropdown
```

### 3. [Amharic translation needed - original Taiwan context]

```bash
npm run dev             # [Amharic translation needed - original Taiwan context] dev server [Amharic translation needed - original Taiwan context]
npx astro build         # [Amharic translation needed - original Taiwan context] build（~80-90s, 939 pages）
git add -A && git push  # push [Amharic translation needed - original Taiwan context] GitHub Pages [Amharic translation needed - original Taiwan context]
```

---

## ⚠️ [Amharic translation needed - original Taiwan context]

### `<style is:global>` [Amharic translation needed - original Taiwan context]

Astro scoped CSS [Amharic translation needed - original Taiwan context] `[data-astro-cid-xxx]` attribute selector。
JS `innerHTML` [Amharic translation needed - original Taiwan context] DOM [Amharic translation needed - original Taiwan context] attribute → CSS [Amharic translation needed - original Taiwan context]。
**[Amharic translation needed - original Taiwan context] dashboard CSS [Amharic translation needed - original Taiwan context] `<style is:global>` [Amharic translation needed - original Taiwan context]。[Amharic translation needed - original Taiwan context]。**

### [Amharic translation needed - original Taiwan context] 2800+ [Amharic translation needed - original Taiwan context]

Dashboard [Amharic translation needed - original Taiwan context] single-file template。[Amharic translation needed - original Taiwan context]——Astro [Amharic translation needed - original Taiwan context] `define:vars` + `is:global` [Amharic translation needed - original Taiwan context]。
[Amharic translation needed - original Taiwan context]，[Amharic translation needed - original Taiwan context] section [Amharic translation needed - original Taiwan context] `// ── Section Name ──` [Amharic translation needed - original Taiwan context]。

### healthScore [Amharic translation needed - original Taiwan context]

```
score = wordCount/3000 * 25     // [Amharic translation needed - original Taiwan context]（[Amharic translation needed - original Taiwan context] 3000 [Amharic translation needed - original Taiwan context] = [Amharic translation needed - original Taiwan context]）
      + humanReview * 25        // [Amharic translation needed - original Taiwan context]（boolean）
      + revision/5 * 15         // [Amharic translation needed - original Taiwan context]（[Amharic translation needed - original Taiwan context] 5 [Amharic translation needed - original Taiwan context]）
      + freshness * 15          // [Amharic translation needed - original Taiwan context]（30 [Amharic translation needed - original Taiwan context] = 1）
      + tags/5 * 10             // [Amharic translation needed - original Taiwan context]（[Amharic translation needed - original Taiwan context] 5 [Amharic translation needed - original Taiwan context]）
      + featured * 10           // [Amharic translation needed - original Taiwan context]（boolean）
```

### Organ Score [Amharic translation needed - original Taiwan context]

| Organ          | ID          | [Amharic translation needed - original Taiwan context]                     |
| -------------- | ----------- | ---------------------------- |
| 🫀 Heart       | heart       | [Amharic translation needed - original Taiwan context] 7 [Amharic translation needed - original Taiwan context]            |
| 🛡️ Immune      | immune      | humanReviewed / total \* 100 |
| 🧬 DNA         | dna         | EDITORIAL.md [Amharic translation needed - original Taiwan context]    |
| 🦴 Skeleton    | skeleton    | [Amharic translation needed - original Taiwan context] 90（Astro [Amharic translation needed - original Taiwan context]）    |
| 🫁 Breath      | breath      | .github/workflows/ yml [Amharic translation needed - original Taiwan context]  |
| 🧫 Reproduce   | reproduce   | [Amharic translation needed - original Taiwan context] 30 [Amharic translation needed - original Taiwan context] contributors [Amharic translation needed - original Taiwan context]     |
| 👁️ Senses      | senses      | GA4 + Issue templates [Amharic translation needed - original Taiwan context]   |
| 🌐 Translation | translation | en [Amharic translation needed - original Taiwan context]                |

### Organ → GitHub File [Amharic translation needed - original Taiwan context]

| Organ       | [Amharic translation needed - original Taiwan context]                  |
| ----------- | ------------------------- |
| heart       | `knowledge/`              |
| immune      | `EDITORIAL.md`            |
| dna         | `EDITORIAL.md`            |
| skeleton    | `astro.config.mjs`        |
| breath      | `.github/workflows/`      |
| reproduce   | `CONTRIBUTING.md`         |
| senses      | `.github/ISSUE_TEMPLATE/` |
| translation | `src/content/`            |

---

## [Amharic translation needed - original Taiwan context]

```
ethiopia-md/
├── scripts/
│   └── generate-dashboard-data.js        ← prebuild [Amharic translation needed - original Taiwan context]
├── public/api/
│   ├── dashboard-articles.json           ← [Amharic translation needed - original Taiwan context]（build-time）
│   ├── dashboard-vitals.json             ← [Amharic translation needed - original Taiwan context]（build-time）
│   ├── dashboard-organism.json           ← [Amharic translation needed - original Taiwan context]（build-time）
│   ├── dashboard-translations.json       ← [Amharic translation needed - original Taiwan context]（build-time）
│   └── dashboard-analytics.json          ← GA4 [Amharic translation needed - original Taiwan context]（[Amharic translation needed - original Taiwan context]/cron）
├── src/
│   ├── templates/
│   │   └── dashboard.template.astro      ← [Amharic translation needed - original Taiwan context]（2800+ [Amharic translation needed - original Taiwan context]）
│   ├── pages/
│   │   ├── dashboard.astro               ← [Amharic translation needed - original Taiwan context]
│   │   └── en/dashboard.astro            ← [Amharic translation needed - original Taiwan context]
│   ├── i18n/
│   │   └── dashboard.ts                  ← [Amharic translation needed - original Taiwan context] key
│   └── components/
│       └── Header.astro                  ← nav dropdown
└── docs/
    └── DASHBOARD-PIPELINE.md             ← [Amharic translation needed - original Taiwan context]
```

---

## [Amharic translation needed - original Taiwan context]（from Dashboard [Amharic translation needed - original Taiwan context] v2）

- [x] Phase 1: [Amharic translation needed - original Taiwan context] + [Amharic translation needed - original Taiwan context]（V2.1-V2.6）
- [x] Phase 1.5: GA4 [Amharic translation needed - original Taiwan context]（[Amharic translation needed - original Taiwan context] JSON）
- [ ] Phase 2: GA4 Actions cron [Amharic translation needed - original Taiwan context]
- [ ] Phase 2: [Amharic translation needed - original Taiwan context] 7 [Amharic translation needed - original Taiwan context] sparkline
- [ ] Phase 3: Contributor Wall（GitHub API）
- [ ] Phase 3: Canvas [Amharic translation needed - original Taiwan context]（>1000 nodes [Amharic translation needed - original Taiwan context]）

---

_Created: 2026-03-28 | Based on Dashboard V2 build experience_
