# Rewrite Pipeline (Cron) — [Amharic translation needed - original Taiwan context]

> [Amharic translation needed - original Taiwan context]（Cron disabled）。[Amharic translation needed - original Taiwan context] Phase 1 [Amharic translation needed - original Taiwan context]。
> [Amharic translation needed - original Taiwan context]：`docs/editorial/REWRITE-PIPELINE.md`（[Amharic translation needed - original Taiwan context]）

---

## [Amharic translation needed - original Taiwan context]

- quality-scan pass rate: **5.8%**（26/451 [Amharic translation needed - original Taiwan context]）
- human_reviewed: **0 [Amharic translation needed - original Taiwan context]**
- featured: 124 [Amharic translation needed - original Taiwan context]（30%，[Amharic translation needed - original Taiwan context]）
- [Amharic translation needed - original Taiwan context] Cron [Amharic translation needed - original Taiwan context] ~50 [Amharic translation needed - original Taiwan context]（v1 + v2）

---

## [Amharic translation needed - original Taiwan context]

```
git pull → [Amharic translation needed - original Taiwan context] → REWRITE-PIPELINE [Amharic translation needed - original Taiwan context] → quality-scan → sync → push
```

### Step 1：[Amharic translation needed - original Taiwan context] + [Amharic translation needed - original Taiwan context]

```bash
cd ~/ethiopia-md && git pull
# [Amharic translation needed - original Taiwan context]，[Amharic translation needed - original Taiwan context]
head -30 scripts/tools/rewrite-queue.txt
git log --oneline --since='2026-03-20' | grep -i 'rewrite:' | head -30
```

### Step 2：[Amharic translation needed - original Taiwan context]

**[Amharic translation needed - original Taiwan context] [`docs/editorial/REWRITE-PIPELINE.md`](../editorial/REWRITE-PIPELINE.md)**。
Pipeline [Amharic translation needed - original Taiwan context] Stage [Amharic translation needed - original Taiwan context]（RESEARCH.md → EDITORIAL.md → QUALITY-CHECKLIST.md）。

### Step 3：Commit

```bash
bash scripts/core/sync.sh
bash scripts/tools/quality-scan.sh knowledge/[Category]/[[Amharic translation needed - original Taiwan context]].md  # ≤ 3 [Amharic translation needed - original Taiwan context] commit
git add knowledge/[Category]/[[Amharic translation needed - original Taiwan context]].md src/content/
git commit -m "rewrite: [[Amharic translation needed - original Taiwan context]] — EDITORIAL v4 + Pipeline v2.3"
git push
```

---

## ⚠️ [Amharic translation needed - original Taiwan context]

### [Amharic translation needed - original Taiwan context] ≠ [Amharic translation needed - original Taiwan context]

> 「AI [Amharic translation needed - original Taiwan context]、[Amharic translation needed - original Taiwan context]、[Amharic translation needed - original Taiwan context]。[Amharic translation needed - original Taiwan context] = [Amharic translation needed - original Taiwan context]。」

**[Amharic translation needed - original Taiwan context]**，Stage 0 [Amharic translation needed - original Taiwan context]。[Amharic translation needed - original Taiwan context] Stage 1 [Amharic translation needed - original Taiwan context]，[Amharic translation needed - original Taiwan context]。

### [Amharic translation needed - original Taiwan context] 1 [Amharic translation needed - original Taiwan context]

v1 [Amharic translation needed - original Taiwan context] 3 [Amharic translation needed - original Taiwan context]，[Amharic translation needed - original Taiwan context]。[Amharic translation needed - original Taiwan context] 1 [Amharic translation needed - original Taiwan context]。

### SSOT [Amharic translation needed - original Taiwan context] knowledge/

[Amharic translation needed - original Taiwan context] `knowledge/`，[Amharic translation needed - original Taiwan context] `scripts/core/sync.sh` [Amharic translation needed - original Taiwan context] `src/content/`。[Amharic translation needed - original Taiwan context] `src/content/`。

### [Amharic translation needed - original Taiwan context] git add -A

[Amharic translation needed - original Taiwan context] add [Amharic translation needed - original Taiwan context] `src/content/` [Amharic translation needed - original Taiwan context]。

### [Amharic translation needed - original Taiwan context] npm run build

Build [Amharic translation needed - original Taiwan context] CI/CD [Amharic translation needed - original Taiwan context]。sub-agent [Amharic translation needed - original Taiwan context] build [Amharic translation needed - original Taiwan context] timeout [Amharic translation needed - original Taiwan context]。

### quality-scan [Amharic translation needed - original Taiwan context] ≤ 3 [Amharic translation needed - original Taiwan context] commit

[Amharic translation needed - original Taiwan context] → [Amharic translation needed - original Taiwan context]，[Amharic translation needed - original Taiwan context] commit。

---

## [Amharic translation needed - original Taiwan context]（7 [Amharic translation needed - original Taiwan context]）

1. **[Amharic translation needed - original Taiwan context]**：[Amharic translation needed - original Taiwan context] sub-agent [Amharic translation needed - original Taiwan context] = [Amharic translation needed - original Taiwan context] + timeout + [Amharic translation needed - original Taiwan context] session
2. **[Amharic translation needed - original Taiwan context] 7 [Amharic translation needed - original Taiwan context]**：[Amharic translation needed - original Taiwan context] 3min + [Amharic translation needed - original Taiwan context] 2min + [Amharic translation needed - original Taiwan context] 2min = [Amharic translation needed - original Taiwan context]
3. **prompt [Amharic translation needed - original Taiwan context]「[Amharic translation needed - original Taiwan context]，[Amharic translation needed - original Taiwan context]」**：[Amharic translation needed - original Taiwan context] AI [Amharic translation needed - original Taiwan context] 30% [Amharic translation needed - original Taiwan context]
4. **[Amharic translation needed - original Taiwan context] pre-filter [Amharic translation needed - original Taiwan context]**：[Amharic translation needed - original Taiwan context]=0 ≠ [Amharic translation needed - original Taiwan context]，[Amharic translation needed - original Taiwan context]
5. **[Amharic translation needed - original Taiwan context]**：AI [Amharic translation needed - original Taiwan context]（"[Amharic translation needed - original Taiwan context]"→"[Amharic translation needed - original Taiwan context]"→"[Amharic translation needed - original Taiwan context]"）
6. **Build [Amharic translation needed - original Taiwan context]**：YAML frontmatter [Amharic translation needed - original Taiwan context]，[Amharic translation needed - original Taiwan context] = [Amharic translation needed - original Taiwan context] category [Amharic translation needed - original Taiwan context]
7. **[Amharic translation needed - original Taiwan context] = [Amharic translation needed - original Taiwan context]**：Pipeline v2 [Amharic translation needed - original Taiwan context]（Stage 2 [Amharic translation needed - original Taiwan context]）

---

## [Amharic translation needed - original Taiwan context]

| [Amharic translation needed - original Taiwan context]                                  | [Amharic translation needed - original Taiwan context]                   |
| ------------------------------------- | ---------------------- |
| `docs/editorial/REWRITE-PIPELINE.md`  | [Amharic translation needed - original Taiwan context]（SSOT） |
| `docs/editorial/RESEARCH.md`          | [Amharic translation needed - original Taiwan context]             |
| `docs/editorial/RESEARCH-TEMPLATE.md` | Stage 1 [Amharic translation needed - original Taiwan context]   |
| `EDITORIAL.md`                        | [Amharic translation needed - original Taiwan context]               |
| `docs/editorial/QUALITY-CHECKLIST.md` | Stage 3 [Amharic translation needed - original Taiwan context]       |
| `scripts/tools/rewrite-queue.txt`     | [Amharic translation needed - original Taiwan context]             |
| `scripts/tools/quality-scan.sh`       | [Amharic translation needed - original Taiwan context]           |

## [Amharic translation needed - original Taiwan context] Cron

| Cron                              | [Amharic translation needed - original Taiwan context]        | [Amharic translation needed - original Taiwan context]                       |
| --------------------------------- | ----------- | -------------------------- |
| Ethiopia.md Article Quality Rewrite | ❌ disabled | [Amharic translation needed - original Taiwan context] 1 [Amharic translation needed - original Taiwan context]，Opus model    |
| ethiopia-md-rewrite (v1)            | ❌ disabled | [Amharic translation needed - original Taiwan context] 3 [Amharic translation needed - original Taiwan context]，[Amharic translation needed - original Taiwan context]    |
| ethiopia-md-content-sprint          | ❌ disabled | [Amharic translation needed - original Taiwan context]（[Amharic translation needed - original Taiwan context]），[Amharic translation needed - original Taiwan context] |

---

## [Amharic translation needed - original Taiwan context]

[Amharic translation needed - original Taiwan context] Phase 1 [Amharic translation needed - original Taiwan context]（[Amharic translation needed - original Taiwan context] 2026-04），[Amharic translation needed - original Taiwan context]：

1. [Amharic translation needed - original Taiwan context] EDITORIAL v4 [Amharic translation needed - original Taiwan context]（[Amharic translation needed - original Taiwan context]、[Amharic translation needed - original Taiwan context]、[Amharic translation needed - original Taiwan context]）[Amharic translation needed - original Taiwan context] prompt
2. [Amharic translation needed - original Taiwan context] featured [Amharic translation needed - original Taiwan context]（124 [Amharic translation needed - original Taiwan context]）
3. [Amharic translation needed - original Taiwan context]：pass rate 5.8% → 30%（3 [Amharic translation needed - original Taiwan context]）

---

_[Amharic translation needed - original Taiwan context]：v1.0 | 2026-03-29_
_[Amharic translation needed - original Taiwan context]：[Amharic translation needed - original Taiwan context]，[Amharic translation needed - original Taiwan context] Phase 1_
