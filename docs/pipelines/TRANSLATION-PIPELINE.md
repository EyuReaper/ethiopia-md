# Translation Pipeline — [Amharic translation needed - original Taiwan context]

> [Amharic translation needed - original Taiwan context]（Cron disabled）。Issue #229 [Amharic translation needed - original Taiwan context]。
> [Amharic translation needed - original Taiwan context] v2 [Amharic translation needed - original Taiwan context]。

---

## [Amharic translation needed - original Taiwan context]

- [Amharic translation needed - original Taiwan context] 479 [Amharic translation needed - original Taiwan context] > [Amharic translation needed - original Taiwan context] 420 [Amharic translation needed - original Taiwan context]（[Amharic translation needed - original Taiwan context]，[Amharic translation needed - original Taiwan context]）
- [Amharic translation needed - original Taiwan context] v1 [Amharic translation needed - original Taiwan context]，[Amharic translation needed - original Taiwan context]
- Issue #229：[Amharic translation needed - original Taiwan context]，[Amharic translation needed - original Taiwan context]

---

## [Amharic translation needed - original Taiwan context]（v1，[Amharic translation needed - original Taiwan context]）

```
git pull → [Amharic translation needed - original Taiwan context] → [Amharic translation needed - original Taiwan context]（3[Amharic translation needed - original Taiwan context]/[Amharic translation needed - original Taiwan context]）→ [Amharic translation needed - original Taiwan context] _translations.json → build → push
```

### Step 1：[Amharic translation needed - original Taiwan context]

```bash
cd ~/ethiopia-md
# [Amharic translation needed - original Taiwan context]
find knowledge/ -maxdepth 2 -name '*.md' ! -path '*/en/*' ! -path '*/about/*' ! -name '_*' | sort > /tmp/zh-articles.txt
# [Amharic translation needed - original Taiwan context]
find knowledge/en/ -name '*.md' ! -name '_*' | sort > /tmp/en-articles.txt
# [Amharic translation needed - original Taiwan context]
cat knowledge/_translations.json | head -20
```

### Step 2：[Amharic translation needed - original Taiwan context]（[Amharic translation needed - original Taiwan context]，[Amharic translation needed - original Taiwan context]）

[Amharic translation needed - original Taiwan context]：

1. [Amharic translation needed - original Taiwan context]
2. **[Amharic translation needed - original Taiwan context]**——[Amharic translation needed - original Taiwan context]
3. Ethiopia[Amharic translation needed - original Taiwan context] + [Amharic translation needed - original Taiwan context]
4. [Amharic translation needed - original Taiwan context]
5. [Amharic translation needed - original Taiwan context] frontmatter [Amharic translation needed - original Taiwan context]，[Amharic translation needed - original Taiwan context] title/description
6. [Amharic translation needed - original Taiwan context]——[Amharic translation needed - original Taiwan context]、[Amharic translation needed - original Taiwan context]
7. [Amharic translation needed - original Taiwan context]（[Amharic translation needed - original Taiwan context]），[Amharic translation needed - original Taiwan context] 120%
8. [Amharic translation needed - original Taiwan context] URL
9. 「📝 [Amharic translation needed - original Taiwan context]」「⚠️ [Amharic translation needed - original Taiwan context]」[Amharic translation needed - original Taiwan context] emoji [Amharic translation needed - original Taiwan context]，[Amharic translation needed - original Taiwan context]
10. [Amharic translation needed - original Taiwan context] `knowledge/en/{Category}/{english-slug}.md`

### Step 3：[Amharic translation needed - original Taiwan context] + Push

```bash
cd ~/ethiopia-md
# [Amharic translation needed - original Taiwan context] _translations.json
git add knowledge/en/ knowledge/_translations.json
git commit -m "feat(en): translate X articles — [[Amharic translation needed - original Taiwan context]]"
git push
```

---

## ⚠️ [Amharic translation needed - original Taiwan context]

### [Amharic translation needed - original Taiwan context] ≠ [Amharic translation needed - original Taiwan context]

[Amharic translation needed - original Taiwan context] Google Translate。[Amharic translation needed - original Taiwan context] = [Amharic translation needed - original Taiwan context]。

### Ethiopia[Amharic translation needed - original Taiwan context]

- ❌ [Amharic translation needed - original Taiwan context]Ethiopia[Amharic translation needed - original Taiwan context]
- ✅ [Amharic translation needed - original Taiwan context] "Indigenous peoples" [Amharic translation needed - original Taiwan context] "aborigines"
- ✅ Ethiopia[Amharic translation needed - original Taiwan context] + [Amharic translation needed - original Taiwan context]（[Amharic translation needed - original Taiwan context] "night market ([Amharic translation needed - original Taiwan context])"）

### [Amharic translation needed - original Taiwan context] git add -A

[Amharic translation needed - original Taiwan context] add `knowledge/en/` [Amharic translation needed - original Taiwan context] `_translations.json`。

### [Amharic translation needed - original Taiwan context] 3 [Amharic translation needed - original Taiwan context]

[Amharic translation needed - original Taiwan context]。[Amharic translation needed - original Taiwan context] = [Amharic translation needed - original Taiwan context]。

### [Amharic translation needed - original Taiwan context]

Food > Culture > History > Nature > Art > Technology > Economy > Music > Society > Geography > Lifestyle > People

（People [Amharic translation needed - original Taiwan context]，[Amharic translation needed - original Taiwan context]）

---

## [Amharic translation needed - original Taiwan context]（v2 [Amharic translation needed - original Taiwan context]）

1. **[Amharic translation needed - original Taiwan context]**：v1（[Amharic translation needed - original Taiwan context]）→ v2（[Amharic translation needed - original Taiwan context]）→ v3（[Amharic translation needed - original Taiwan context]）
2. **[Amharic translation needed - original Taiwan context]**：[Amharic translation needed - original Taiwan context] GA4 [Amharic translation needed - original Taiwan context]，[Amharic translation needed - original Taiwan context]
3. **[Amharic translation needed - original Taiwan context] revision [Amharic translation needed - original Taiwan context]**：[Amharic translation needed - original Taiwan context] revision 5 [Amharic translation needed - original Taiwan context] revision 1 → [Amharic translation needed - original Taiwan context]
4. **[Amharic translation needed - original Taiwan context] quality-scan**：[Amharic translation needed - original Taiwan context]

---

## [Amharic translation needed - original Taiwan context]

| [Amharic translation needed - original Taiwan context]                            | [Amharic translation needed - original Taiwan context]                 |
| ------------------------------- | -------------------- |
| `knowledge/en/`                 | [Amharic translation needed - original Taiwan context]         |
| `knowledge/_translations.json`  | [Amharic translation needed - original Taiwan context]         |
| `EDITORIAL.md`                  | [Amharic translation needed - original Taiwan context]（[Amharic translation needed - original Taiwan context]） |
| `docs/editorial/TERMINOLOGY.md` | [Amharic translation needed - original Taiwan context]             |

## [Amharic translation needed - original Taiwan context] Cron

| Cron                     | [Amharic translation needed - original Taiwan context]        | [Amharic translation needed - original Taiwan context]                      |
| ------------------------ | ----------- | ------------------------- |
| ethiopia-md-en-translation | ❌ disabled | [Amharic translation needed - original Taiwan context] 3 [Amharic translation needed - original Taiwan context]，[Amharic translation needed - original Taiwan context] |

## [Amharic translation needed - original Taiwan context] Issue

- #229：[Amharic translation needed - original Taiwan context]

---

_[Amharic translation needed - original Taiwan context]：v1.0 | 2026-03-29_
_[Amharic translation needed - original Taiwan context]：[Amharic translation needed - original Taiwan context]，[Amharic translation needed - original Taiwan context] v2 [Amharic translation needed - original Taiwan context]_
