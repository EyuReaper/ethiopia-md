# Daily Report Pipeline — [Amharic translation needed - original Taiwan context]

> [Amharic translation needed - original Taiwan context] 09:00 (Asia/Taipei) [Amharic translation needed - original Taiwan context] Cron [Amharic translation needed - original Taiwan context]

---

## [Amharic translation needed - original Taiwan context]

```
GA4 [Amharic translation needed - original Taiwan context] → GitHub stats → Open PRs/Issues → [Amharic translation needed - original Taiwan context] → [Amharic translation needed - original Taiwan context] → i18n → [Amharic translation needed - original Taiwan context] → [Amharic translation needed - original Taiwan context] Discord
```

### Step 1：GA4 [Amharic translation needed - original Taiwan context]

[Amharic translation needed - original Taiwan context] Python + Google Analytics Data API [Amharic translation needed - original Taiwan context]（Property ID [Amharic translation needed - original Taiwan context] TOOLS.md）：

- [Amharic translation needed - original Taiwan context]、[Amharic translation needed - original Taiwan context]
- [Amharic translation needed - original Taiwan context] Top 5
- [Amharic translation needed - original Taiwan context] Top 5

Service account JSON [Amharic translation needed - original Taiwan context]。

### Step 2：GitHub Stats

```bash
gh api repos/frank890417/ethiopia-md --jq '.stargazers_count,.forks_count,.open_issues_count'
```

### Step 3：Open PRs + Issues

```bash
gh pr list --repo frank890417/ethiopia-md --state open
gh issue list --repo frank890417/ethiopia-md --state open
```

[Amharic translation needed - original Taiwan context] PR：diff [Amharic translation needed - original Taiwan context]、[Amharic translation needed - original Taiwan context]、[Amharic translation needed - original Taiwan context]。

### Step 4：[Amharic translation needed - original Taiwan context]

```bash
curl -s -o /dev/null -w '%{http_code}' https://ethiopia.md
```

### Step 5：[Amharic translation needed - original Taiwan context]

```bash
# [Amharic translation needed - original Taiwan context]
find ~/ethiopia-md/knowledge -name '*.md' ! -name '_*' ! -path '*/en/*' | wc -l
# [Amharic translation needed - original Taiwan context]
find ~/ethiopia-md/knowledge/en -name '*.md' ! -name '_*' | wc -l
```

### Step 6：i18n [Amharic translation needed - original Taiwan context]

```bash
cd ~/ethiopia-md && python3 scripts/utils/i18n-status.py 2>&1 | head -8
```

### Step 7：[Amharic translation needed - original Taiwan context]

[Amharic translation needed - original Taiwan context] message tool [Amharic translation needed - original Taiwan context] Discord #ethiopia-md (channel: `1483379411179933759`)。
[Amharic translation needed - original Taiwan context]：[Amharic translation needed - original Taiwan context] emoji [Amharic translation needed - original Taiwan context]，[Amharic translation needed - original Taiwan context]。

---

## ⚠️ [Amharic translation needed - original Taiwan context]

### GA4 API [Amharic translation needed - original Taiwan context]

- Service account [Amharic translation needed - original Taiwan context] property [Amharic translation needed - original Taiwan context] Viewer [Amharic translation needed - original Taiwan context]
- Python [Amharic translation needed - original Taiwan context]：`google-analytics-data`（[Amharic translation needed - original Taiwan context] pip）
- Rate limit：[Amharic translation needed - original Taiwan context] 50,000 requests（[Amharic translation needed - original Taiwan context]）

### [Amharic translation needed - original Taiwan context]

[Amharic translation needed - original Taiwan context] message tool [Amharic translation needed - original Taiwan context]（[Amharic translation needed - original Taiwan context] consecutiveErrors: 3）：

- [Amharic translation needed - original Taiwan context] Discord channel ID [Amharic translation needed - original Taiwan context]：`1483379411179933759`
- [Amharic translation needed - original Taiwan context] OpenClaw Discord [Amharic translation needed - original Taiwan context]
- [Amharic translation needed - original Taiwan context]：[Amharic translation needed - original Taiwan context]，[Amharic translation needed - original Taiwan context]

---

## [Amharic translation needed - original Taiwan context] Cron

| Cron                        | [Amharic translation needed - original Taiwan context]       | [Amharic translation needed - original Taiwan context]           |
| --------------------------- | ---------- | -------------- |
| Ethiopia.md Daily Report      | 09:00      | [Amharic translation needed - original Taiwan context] pipeline    |
| Ethiopia.md AI Citation Check | [Amharic translation needed - original Taiwan context] 10:00 | SEO [Amharic translation needed - original Taiwan context] |

---

_[Amharic translation needed - original Taiwan context]：v1.0 | 2026-03-29_
