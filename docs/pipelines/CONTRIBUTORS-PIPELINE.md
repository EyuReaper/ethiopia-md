# Contributors Pipeline — [Amharic translation needed - original Taiwan context]

> [Amharic translation needed - original Taiwan context] 03:30 (Asia/Taipei) [Amharic translation needed - original Taiwan context] Cron [Amharic translation needed - original Taiwan context]

---

## [Amharic translation needed - original Taiwan context]

```
git pull → [Amharic translation needed - original Taiwan context] merged PR authors → [Amharic translation needed - original Taiwan context] → [Amharic translation needed - original Taiwan context] → [Amharic translation needed - original Taiwan context] README [Amharic translation needed - original Taiwan context] → push
```

### Step 1：[Amharic translation needed - original Taiwan context]

```bash
cd ~/ethiopia-md && git pull
```

### Step 2：[Amharic translation needed - original Taiwan context] contributor

```bash
gh pr list --repo frank890417/ethiopia-md --state merged --limit 200 --json author --jq '.[].author.login' | sort -u > /tmp/pr-authors.txt
cat .all-contributorsrc | python3 -c "import sys,json; [print(c['login']) for c in json.load(sys.stdin)['contributors']]" | sort -u > /tmp/existing-contributors.txt
comm -23 /tmp/pr-authors.txt /tmp/existing-contributors.txt > /tmp/new-contributors.txt
```

### Step 3：[Amharic translation needed - original Taiwan context] contributor

[Amharic translation needed - original Taiwan context]：

1. `gh api users/{login}` [Amharic translation needed - original Taiwan context] profile
2. `gh pr list --author {login} --state merged --json title,labels` [Amharic translation needed - original Taiwan context]
3. [Amharic translation needed - original Taiwan context] emoji：🖋️ content / 🌍 translation / 🐛 bug / 💻 code / 🤔 ideas / 📖 doc
4. [Amharic translation needed - original Taiwan context] `.all-contributorsrc`

### Step 4：[Amharic translation needed - original Taiwan context] README [Amharic translation needed - original Taiwan context]

[Amharic translation needed - original Taiwan context] `<!-- ALL-CONTRIBUTORS-LIST:START -->` [Amharic translation needed - original Taiwan context] `<!-- ALL-CONTRIBUTORS-LIST:END -->` [Amharic translation needed - original Taiwan context]。[Amharic translation needed - original Taiwan context] 7 [Amharic translation needed - original Taiwan context]。

### Step 5：Push

```bash
git add .all-contributorsrc README.md
git diff --cached --quiet || (git commit -m "chore: auto-update contributors" && git push)
```

---

## ⚠️ [Amharic translation needed - original Taiwan context]

### [Amharic translation needed - original Taiwan context] `about.template.astro`

Sponsors + Contact sections [Amharic translation needed - original Taiwan context] **3 [Amharic translation needed - original Taiwan context]**。Contributors grid [Amharic translation needed - original Taiwan context] template [Amharic translation needed - original Taiwan context]。

### [Amharic translation needed - original Taiwan context] `git add` [Amharic translation needed - original Taiwan context]

`.all-contributorsrc` [Amharic translation needed - original Taiwan context] `README.md`。[Amharic translation needed - original Taiwan context] `git add -A`。

### [Amharic translation needed - original Taiwan context] = [Amharic translation needed - original Taiwan context]

[Amharic translation needed - original Taiwan context]「[Amharic translation needed - original Taiwan context] contributor」。

---

## [Amharic translation needed - original Taiwan context]

| [Amharic translation needed - original Taiwan context]                                 | [Amharic translation needed - original Taiwan context]                |
| ------------------------------------ | ------------------- |
| `.all-contributorsrc`                | [Amharic translation needed - original Taiwan context]（JSON）  |
| `README.md`                          | [Amharic translation needed - original Taiwan context] contributor [Amharic translation needed - original Taiwan context] |
| `src/templates/about.template.astro` | ⚠️ [Amharic translation needed - original Taiwan context]           |

---

_[Amharic translation needed - original Taiwan context]：v1.0 | 2026-03-29_
