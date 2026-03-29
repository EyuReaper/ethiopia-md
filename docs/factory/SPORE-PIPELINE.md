# SPORE-PIPELINE.md — [Amharic translation needed - original Taiwan context]

> **[Amharic translation needed - original Taiwan context] AI [Amharic translation needed - original Taiwan context]。** [Amharic translation needed - original Taiwan context] AI agent [Amharic translation needed - original Taiwan context]，[Amharic translation needed - original Taiwan context]、[Amharic translation needed - original Taiwan context]、[Amharic translation needed - original Taiwan context]、[Amharic translation needed - original Taiwan context]。

---

## [Amharic translation needed - original Taiwan context]

[Amharic translation needed - original Taiwan context]，AI [Amharic translation needed - original Taiwan context]（[Amharic translation needed - original Taiwan context]）：

1. `cat docs/factory/README.md` — [Amharic translation needed - original Taiwan context]
2. `cat docs/factory/SPORE-TEMPLATES.md` — [Amharic translation needed - original Taiwan context] + [Amharic translation needed - original Taiwan context]
3. `cat EDITORIAL.md | head -100` — [Amharic translation needed - original Taiwan context]

---

## Step 1: [Amharic translation needed - original Taiwan context]（PICK）

### [Amharic translation needed - original Taiwan context]

[Amharic translation needed - original Taiwan context] 5-10 [Amharic translation needed - original Taiwan context]，[Amharic translation needed - original Taiwan context]。

### [Amharic translation needed - original Taiwan context]

```bash
# [Amharic translation needed - original Taiwan context] dashboard-articles.json [Amharic translation needed - original Taiwan context] 10 [Amharic translation needed - original Taiwan context]（2000+ [Amharic translation needed - original Taiwan context]、[Amharic translation needed - original Taiwan context] about [Amharic translation needed - original Taiwan context]）
cd /path/to/ethiopia-md
python3 -c "
import json, random
with open('public/api/dashboard-articles.json') as f:
    data = json.load(f)
articles = data if isinstance(data, list) else data.get('articles', [])
good = [a for a in articles if a.get('wordCount', 0) > 2000 and a.get('category') != 'about']
random.shuffle(good)
for i, a in enumerate(good[:10], 1):
    cat = a.get('category','?')
    title = a.get('title','?')
    words = a.get('wordCount', 0)
    featured = '⭐' if a.get('featured') else ''
    date = a.get('date', '?')
    desc = a.get('description','')[:70]
    print(f'{i}. [{cat}] {title} ({words}[Amharic translation needed - original Taiwan context]) {featured}')
    print(f'   [Amharic translation needed - original Taiwan context]：{date} | {desc}...')
    print()
"
```

### [Amharic translation needed - original Taiwan context]

1. **[Amharic translation needed - original Taiwan context]** — [Amharic translation needed - original Taiwan context]，[Amharic translation needed - original Taiwan context]（lastVerified [Amharic translation needed - original Taiwan context] 7 [Amharic translation needed - original Taiwan context]）
2. **GA4 [Amharic translation needed - original Taiwan context]** — [Amharic translation needed - original Taiwan context]
3. **[Amharic translation needed - original Taiwan context]** — [Amharic translation needed - original Taiwan context]（[Amharic translation needed - original Taiwan context]→[Amharic translation needed - original Taiwan context]、[Amharic translation needed - original Taiwan context]→[Amharic translation needed - original Taiwan context]）
4. **[Amharic translation needed - original Taiwan context]** — [Amharic translation needed - original Taiwan context]

### [Amharic translation needed - original Taiwan context]

- [Amharic translation needed - original Taiwan context] **[Amharic translation needed - original Taiwan context] ≥ 2 [Amharic translation needed - original Taiwan context]** [Amharic translation needed - original Taiwan context]（[Amharic translation needed - original Taiwan context] `SPORE-LOG.md`）
- `about` [Amharic translation needed - original Taiwan context]

---

## Step 2: [Amharic translation needed - original Taiwan context]（QUALITY GATE）

> ⚠️ **[Amharic translation needed - original Taiwan context]。[Amharic translation needed - original Taiwan context]。**

### [Amharic translation needed - original Taiwan context]

[Amharic translation needed - original Taiwan context]：

```bash
# 1. CLI [Amharic translation needed - original Taiwan context]
cd cli && node src/index.js validate <slug>

# 2. AI [Amharic translation needed - original Taiwan context]
bash scripts/tools/quality-scan.sh knowledge/<Category>/<slug>.md
```

### [Amharic translation needed - original Taiwan context]

| [Amharic translation needed - original Taiwan context]              | [Amharic translation needed - original Taiwan context]                     | [Amharic translation needed - original Taiwan context]                      |
| ----------------- | ---------------------------- | ----------------------------- |
| **validate [Amharic translation needed - original Taiwan context]** | ≥ 80/100                     | CLI `ethiopiamd validate`       |
| **AI [Amharic translation needed - original Taiwan context]**   | ≤ 3 [Amharic translation needed - original Taiwan context]                       | `quality-scan.sh`             |
| **[Amharic translation needed - original Taiwan context]**  | lastVerified [Amharic translation needed - original Taiwan context] 90 [Amharic translation needed - original Taiwan context]      | [Amharic translation needed - original Taiwan context] frontmatter `lastVerified` |
| **[Amharic translation needed - original Taiwan context]/[Amharic translation needed - original Taiwan context]**   | [Amharic translation needed - original Taiwan context] 30 [Amharic translation needed - original Taiwan context]         | [Amharic translation needed - original Taiwan context] 30 [Amharic translation needed - original Taiwan context]                |
| **[Amharic translation needed - original Taiwan context]**    | [Amharic translation needed - original Taiwan context] 1 [Amharic translation needed - original Taiwan context]      | [Amharic translation needed - original Taiwan context]                    |
| **[Amharic translation needed - original Taiwan context]**    | [Amharic translation needed - original Taiwan context] 40% [Amharic translation needed - original Taiwan context]/[Amharic translation needed - original Taiwan context] | [Amharic translation needed - original Taiwan context]（[Amharic translation needed - original Taiwan context] 60% [Amharic translation needed - original Taiwan context]） |

### [Amharic translation needed - original Taiwan context]

```
validate ≥ 80 [Amharic translation needed - original Taiwan context] hollow ≤ 3 [Amharic translation needed - original Taiwan context] lastVerified ≤ 90 [Amharic translation needed - original Taiwan context]？
  ├── YES → [Amharic translation needed - original Taiwan context] Step 3（[Amharic translation needed - original Taiwan context]+[Amharic translation needed - original Taiwan context]）
  └── NO → [Amharic translation needed - original Taiwan context]：
        ├── validate < 80 [Amharic translation needed - original Taiwan context] hollow > 3 → [Amharic translation needed - original Taiwan context] rewrite-pipeline
        │     [Amharic translation needed - original Taiwan context] docs/editorial/REWRITE-PIPELINE.md，[Amharic translation needed - original Taiwan context] Stage 1-3
        │     [Amharic translation needed - original Taiwan context] Step 2
        ├── lastVerified > 90 [Amharic translation needed - original Taiwan context] → [Amharic translation needed - original Taiwan context] frontmatter + [Amharic translation needed - original Taiwan context]
        │     [Amharic translation needed - original Taiwan context]，[Amharic translation needed - original Taiwan context]，[Amharic translation needed - original Taiwan context] lastVerified
        │     [Amharic translation needed - original Taiwan context] validate
        └── [Amharic translation needed - original Taiwan context]/[Amharic translation needed - original Taiwan context]/[Amharic translation needed - original Taiwan context] → [Amharic translation needed - original Taiwan context]：
              ├── [Amharic translation needed - original Taiwan context]（< 10 [Amharic translation needed - original Taiwan context]）→ [Amharic translation needed - original Taiwan context]，[Amharic translation needed - original Taiwan context] Step 3
              └── [Amharic translation needed - original Taiwan context] → [Amharic translation needed - original Taiwan context] rewrite-pipeline
```

### [Amharic translation needed - original Taiwan context]（rewrite-pipeline）

[Amharic translation needed - original Taiwan context]：

```bash
# [Amharic translation needed - original Taiwan context] rewrite-pipeline [Amharic translation needed - original Taiwan context]
cat docs/editorial/REWRITE-PIPELINE.md
cat docs/editorial/RESEARCH-TEMPLATE.md
cat EDITORIAL.md
```

[Amharic translation needed - original Taiwan context]：RESEARCH → WRITE → VERIFY。[Amharic translation needed - original Taiwan context] Step 2。

---

## Step 3: [Amharic translation needed - original Taiwan context] + [Amharic translation needed - original Taiwan context]（WRITE）

### 3a. [Amharic translation needed - original Taiwan context]

[Amharic translation needed - original Taiwan context]（`knowledge/<Category>/<slug>.md`），[Amharic translation needed - original Taiwan context]：

| [Amharic translation needed - original Taiwan context]   | [Amharic translation needed - original Taiwan context]                         | [Amharic translation needed - original Taiwan context]   |
| ---------- | -------------------------------- | ------ |
| [Amharic translation needed - original Taiwan context] | [Amharic translation needed - original Taiwan context] A，[Amharic translation needed - original Taiwan context] B             | 1-2 [Amharic translation needed - original Taiwan context] |
| [Amharic translation needed - original Taiwan context]   | [Amharic translation needed - original Taiwan context]（[Amharic translation needed - original Taiwan context]/[Amharic translation needed - original Taiwan context]/[Amharic translation needed - original Taiwan context]） | 1-2 [Amharic translation needed - original Taiwan context] |
| [Amharic translation needed - original Taiwan context]   | [Amharic translation needed - original Taiwan context]、[Amharic translation needed - original Taiwan context]、[Amharic translation needed - original Taiwan context]     | 2-3 [Amharic translation needed - original Taiwan context] |
| [Amharic translation needed - original Taiwan context]   | [Amharic translation needed - original Taiwan context]，[Amharic translation needed - original Taiwan context]       | 0-1 [Amharic translation needed - original Taiwan context] |
| [Amharic translation needed - original Taiwan context]   | [Amharic translation needed - original Taiwan context]       | 1 [Amharic translation needed - original Taiwan context]   |

### 3b. [Amharic translation needed - original Taiwan context]

[Amharic translation needed - original Taiwan context]（[Amharic translation needed - original Taiwan context] `SPORE-TEMPLATES.md`）：

| [Amharic translation needed - original Taiwan context]                 | [Amharic translation needed - original Taiwan context]        |
| -------------------------- | ------------- |
| [Amharic translation needed - original Taiwan context]     | A. [Amharic translation needed - original Taiwan context]     |
| [Amharic translation needed - original Taiwan context]「[Amharic translation needed - original Taiwan context]？」[Amharic translation needed - original Taiwan context] | B. [Amharic translation needed - original Taiwan context]   |
| [Amharic translation needed - original Taiwan context]             | C. [Amharic translation needed - original Taiwan context] |
| [Amharic translation needed - original Taiwan context]           | D. [Amharic translation needed - original Taiwan context]   |

### 3c. [Amharic translation needed - original Taiwan context]

[Amharic translation needed - original Taiwan context]。**[Amharic translation needed - original Taiwan context]：**

1. **[Amharic translation needed - original Taiwan context]** — [Amharic translation needed - original Taiwan context]「X [Amharic translation needed - original Taiwan context]Ethiopia[Amharic translation needed - original Taiwan context]...」[Amharic translation needed - original Taiwan context]
2. **[Amharic translation needed - original Taiwan context]** — [Amharic translation needed - original Taiwan context]「[Amharic translation needed - original Taiwan context]」
3. **[Amharic translation needed - original Taiwan context]** — [Amharic translation needed - original Taiwan context]
4. **[Amharic translation needed - original Taiwan context]，[Amharic translation needed - original Taiwan context]** — [Amharic translation needed - original Taiwan context]「[Amharic translation needed - original Taiwan context]」
5. **[Amharic translation needed - original Taiwan context]** — [Amharic translation needed - original Taiwan context]

### 3d. URL [Amharic translation needed - original Taiwan context]

**[Amharic translation needed - original Taiwan context]：[Amharic translation needed - original Taiwan context] slug [Amharic translation needed - original Taiwan context] URL encode。**

```bash
# [Amharic translation needed - original Taiwan context] encoded URL
python3 -c "import urllib.parse; print('https://ethiopia.md/<category>/' + urllib.parse.quote('<slug>') + '/')"
```

[Amharic translation needed - original Taiwan context]：`[Amharic translation needed - original Taiwan context] 👉 https://ethiopia.md/<category>/<encoded-slug>/`

- ✅ `https://ethiopia.md/music/%E5%8F%B0%E7%81%A3%E6%B0%91%E6%AD%8C%E9%81%8B%E5%8B%95/`
- ❌ `ethiopia.md/music/Ethiopia[Amharic translation needed - original Taiwan context]/`（Threads [Amharic translation needed - original Taiwan context]）
- ❌ `ethiopia.md/peopl…`（[Amharic translation needed - original Taiwan context] = [Amharic translation needed - original Taiwan context]）

### 3e. [Amharic translation needed - original Taiwan context]：OG Card [Amharic translation needed - original Taiwan context]

[Amharic translation needed - original Taiwan context] OG card [Amharic translation needed - original Taiwan context]，[Amharic translation needed - original Taiwan context] 1200×630 [Amharic translation needed - original Taiwan context]：

```
https://ethiopia.md/og/<category>/<slug>/
```

[Amharic translation needed - original Taiwan context]：`https://ethiopia.md/og/music/Ethiopia[Amharic translation needed - original Taiwan context]/`

**[Amharic translation needed - original Taiwan context]（[Amharic translation needed - original Taiwan context]）：**

1. [Amharic translation needed - original Taiwan context] OG card [Amharic translation needed - original Taiwan context]
2. [Amharic translation needed - original Taiwan context]（macOS: `Cmd+Shift+4` [Amharic translation needed - original Taiwan context] / [Amharic translation needed - original Taiwan context] DevTools screenshot）
3. [Amharic translation needed - original Taiwan context]

**[Amharic translation needed - original Taiwan context]：**

- [Amharic translation needed - original Taiwan context]：1200×630px
- [Amharic translation needed - original Taiwan context] + Noto Serif TC [Amharic translation needed - original Taiwan context]
- [Amharic translation needed - original Taiwan context]：[Amharic translation needed - original Taiwan context]、[Amharic translation needed - original Taiwan context]、[Amharic translation needed - original Taiwan context]、[Amharic translation needed - original Taiwan context]（[Amharic translation needed - original Taiwan context] 4 [Amharic translation needed - original Taiwan context]）、Ethiopia.md footer
- `noindex` [Amharic translation needed - original Taiwan context] SEO

---

## Step 4: [Amharic translation needed - original Taiwan context] + [Amharic translation needed - original Taiwan context]（QA + SHIP）

### [Amharic translation needed - original Taiwan context]

[Amharic translation needed - original Taiwan context]：

- [ ] **[Amharic translation needed - original Taiwan context]**：[Amharic translation needed - original Taiwan context]？
- [ ] **[Amharic translation needed - original Taiwan context]**：[Amharic translation needed - original Taiwan context]「[Amharic translation needed - original Taiwan context]」（[Amharic translation needed - original Taiwan context]）？
- [ ] **[Amharic translation needed - original Taiwan context]**：[Amharic translation needed - original Taiwan context]？[Amharic translation needed - original Taiwan context]？
- [ ] **[Amharic translation needed - original Taiwan context]**：[Amharic translation needed - original Taiwan context]「[Amharic translation needed - original Taiwan context]...[Amharic translation needed - original Taiwan context]」「[Amharic translation needed - original Taiwan context]...[Amharic translation needed - original Taiwan context]」「[Amharic translation needed - original Taiwan context]」？
- [ ] **[Amharic translation needed - original Taiwan context]**：[Amharic translation needed - original Taiwan context]，[Amharic translation needed - original Taiwan context]？
- [ ] **[Amharic translation needed - original Taiwan context]**：[Amharic translation needed - original Taiwan context]「[Amharic translation needed - original Taiwan context]」[Amharic translation needed - original Taiwan context]「[Amharic translation needed - original Taiwan context]」？
- [ ] **[Amharic translation needed - original Taiwan context]**：150-300 [Amharic translation needed - original Taiwan context]（Threads [Amharic translation needed - original Taiwan context]）
- [ ] **URL [Amharic translation needed - original Taiwan context]**：[Amharic translation needed - original Taiwan context]、[Amharic translation needed - original Taiwan context] encode、[Amharic translation needed - original Taiwan context] `/`
- [ ] **[Amharic translation needed - original Taiwan context]**：[Amharic translation needed - original Taiwan context] SPORE-LOG.md [Amharic translation needed - original Taiwan context] ≥ 2 [Amharic translation needed - original Taiwan context]

### [Amharic translation needed - original Taiwan context]

1. [Amharic translation needed - original Taiwan context]（[Amharic translation needed - original Taiwan context]）
2. [Amharic translation needed - original Taiwan context]
3. [Amharic translation needed - original Taiwan context] `SPORE-LOG.md`

### [Amharic translation needed - original Taiwan context]

- **[Amharic translation needed - original Taiwan context]**：[Amharic translation needed - original Taiwan context] 1-2 [Amharic translation needed - original Taiwan context]，[Amharic translation needed - original Taiwan context]
- **[Amharic translation needed - original Taiwan context]**：[Amharic translation needed - original Taiwan context] 12:00-13:00 [Amharic translation needed - original Taiwan context] 20:00-22:00（Ethiopia[Amharic translation needed - original Taiwan context]）
- **[Amharic translation needed - original Taiwan context]**：[Amharic translation needed - original Taiwan context] Threads + X，[Amharic translation needed - original Taiwan context]（X [Amharic translation needed - original Taiwan context]、[Amharic translation needed - original Taiwan context] hashtag）

---

## [Amharic translation needed - original Taiwan context]（AI [Amharic translation needed - original Taiwan context]）

```
[Amharic translation needed - original Taiwan context]「[Amharic translation needed - original Taiwan context]」[Amharic translation needed - original Taiwan context] cron [Amharic translation needed - original Taiwan context]
│
├─ Step 1: [Amharic translation needed - original Taiwan context]
│   ├─ [Amharic translation needed - original Taiwan context] dashboard-articles.json
│   ├─ [Amharic translation needed - original Taiwan context] 10 [Amharic translation needed - original Taiwan context]（2000+[Amharic translation needed - original Taiwan context]、[Amharic translation needed - original Taiwan context]about）
│   ├─ [Amharic translation needed - original Taiwan context] SPORE-LOG.md [Amharic translation needed - original Taiwan context] 2 [Amharic translation needed - original Taiwan context]
│   └─ [Amharic translation needed - original Taiwan context]
│
├─ Step 2: [Amharic translation needed - original Taiwan context]
│   ├─ [Amharic translation needed - original Taiwan context] `ethiopiamd validate <slug>`
│   ├─ [Amharic translation needed - original Taiwan context] `quality-scan.sh`
│   ├─ [Amharic translation needed - original Taiwan context] frontmatter lastVerified
│   ├─ [Amharic translation needed - original Taiwan context] → Step 3
│   └─ [Amharic translation needed - original Taiwan context] → rewrite-pipeline → [Amharic translation needed - original Taiwan context] Step 2
│
├─ Step 3: [Amharic translation needed - original Taiwan context] + [Amharic translation needed - original Taiwan context]
│   ├─ [Amharic translation needed - original Taiwan context]，[Amharic translation needed - original Taiwan context]
│   ├─ [Amharic translation needed - original Taiwan context]（[Amharic translation needed - original Taiwan context]/[Amharic translation needed - original Taiwan context]/[Amharic translation needed - original Taiwan context]/[Amharic translation needed - original Taiwan context]）
│   ├─ [Amharic translation needed - original Taiwan context]
│   └─ URL encode
│
└─ Step 4: [Amharic translation needed - original Taiwan context] + [Amharic translation needed - original Taiwan context]
    ├─ [Amharic translation needed - original Taiwan context]
    ├─ [Amharic translation needed - original Taiwan context]
    ├─ [Amharic translation needed - original Taiwan context]
    └─ [Amharic translation needed - original Taiwan context] SPORE-LOG.md
```

---

## [Amharic translation needed - original Taiwan context]

| [Amharic translation needed - original Taiwan context]       | [Amharic translation needed - original Taiwan context]                    | [Amharic translation needed - original Taiwan context]                         |
| ---------- | ----------------------- | ---------------------------- |
| [Amharic translation needed - original Taiwan context] | [Amharic translation needed - original Taiwan context]        | [Amharic translation needed - original Taiwan context]，[Amharic translation needed - original Taiwan context]   |
| URL [Amharic translation needed - original Taiwan context] | `ethiopia.md/peopl…`      | [Amharic translation needed - original Taiwan context] slug [Amharic translation needed - original Taiwan context] URL encode    |
| [Amharic translation needed - original Taiwan context] | 300+ [Amharic translation needed - original Taiwan context]、[Amharic translation needed - original Taiwan context]     | [Amharic translation needed - original Taiwan context]，[Amharic translation needed - original Taiwan context] |
| [Amharic translation needed - original Taiwan context] | 「Ethiopia[Amharic translation needed - original Taiwan context] X [Amharic translation needed - original Taiwan context]…」        | [Amharic translation needed - original Taiwan context]/[Amharic translation needed - original Taiwan context]/[Amharic translation needed - original Taiwan context]         |
| [Amharic translation needed - original Taiwan context]   | 「[Amharic translation needed - original Taiwan context]」        | [Amharic translation needed - original Taiwan context]               |
| hashtag [Amharic translation needed - original Taiwan context] | #Ethiopia #[Amharic translation needed - original Taiwan context] #[Amharic translation needed - original Taiwan context] #[Amharic translation needed - original Taiwan context] | [Amharic translation needed - original Taiwan context] 2-3 [Amharic translation needed - original Taiwan context]            |

---

_[Amharic translation needed - original Taiwan context]：v1.0 | 2026-03-28_
_[Amharic translation needed - original Taiwan context]：AI [Amharic translation needed - original Taiwan context]、[Amharic translation needed - original Taiwan context]、[Amharic translation needed - original Taiwan context]_
