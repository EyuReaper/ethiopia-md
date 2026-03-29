# 🗺️ [Amharic translation needed - original Taiwan context] Roadmap

> [Amharic translation needed - original Taiwan context] → [Amharic translation needed - original Taiwan context] → [Amharic translation needed - original Taiwan context]

---

## ✅ Phase 1：[Amharic translation needed - original Taiwan context]（v1.0, 2026-03-28）

- [x] `SPORE-PIPELINE.md` — [Amharic translation needed - original Taiwan context] 6 [Amharic translation needed - original Taiwan context] AI [Amharic translation needed - original Taiwan context]
- [x] `SPORE-TEMPLATES.md` — [Amharic translation needed - original Taiwan context] + [Amharic translation needed - original Taiwan context]
- [x] `SPORE-LOG.md` — [Amharic translation needed - original Taiwan context]
- [x] OG Card [Amharic translation needed - original Taiwan context] — `/og/[category]/[slug]` [Amharic translation needed - original Taiwan context] 1200×630 [Amharic translation needed - original Taiwan context]

## 🔜 Phase 2：[Amharic translation needed - original Taiwan context]

### [Amharic translation needed - original Taiwan context] OG Image

[Amharic translation needed - original Taiwan context] `og:image` [Amharic translation needed - original Taiwan context] `/images/ethiopia-social.jpg`。

**[Amharic translation needed - original Taiwan context]**：[Amharic translation needed - original Taiwan context] OG image，[Amharic translation needed - original Taiwan context]。

**[Amharic translation needed - original Taiwan context]：**

| [Amharic translation needed - original Taiwan context]                     | [Amharic translation needed - original Taiwan context]                                 | [Amharic translation needed - original Taiwan context]                                              | [Amharic translation needed - original Taiwan context] |
| ------------------------ | ------------------------------------ | ------------------------------------------------- | ------ |
| **A. Build time [Amharic translation needed - original Taiwan context]** | [Amharic translation needed - original Taiwan context] runtime [Amharic translation needed - original Taiwan context]、GitHub Pages [Amharic translation needed - original Taiwan context] | [Amharic translation needed - original Taiwan context] build [Amharic translation needed - original Taiwan context]（~400 [Amharic translation needed - original Taiwan context] PNG）、[Amharic translation needed - original Taiwan context] headless browser | ⭐⭐⭐ |
| **B. Edge function**     | [Amharic translation needed - original Taiwan context]、[Amharic translation needed - original Taiwan context]                   | [Amharic translation needed - original Taiwan context] Vercel/Cloudflare Workers、[Amharic translation needed - original Taiwan context] GitHub Pages | ⭐⭐   |
| **C. [Amharic translation needed - original Taiwan context]**      | [Amharic translation needed - original Taiwan context]、[Amharic translation needed - original Taiwan context] CI/CD                     | [Amharic translation needed - original Taiwan context]、[Amharic translation needed - original Taiwan context]                              | ⭐⭐   |

**[Amharic translation needed - original Taiwan context]**：[Amharic translation needed - original Taiwan context] C（cron [Amharic translation needed - original Taiwan context] Playwright [Amharic translation needed - original Taiwan context] `/og/*` [Amharic translation needed - original Taiwan context]），[Amharic translation needed - original Taiwan context] `public/og-images/`。[Amharic translation needed - original Taiwan context] A [Amharic translation needed - original Taiwan context] build。

**[Amharic translation needed - original Taiwan context]（[Amharic translation needed - original Taiwan context] C）：**

```bash
# [Amharic translation needed - original Taiwan context] Playwright [Amharic translation needed - original Taiwan context]
npx playwright screenshot \
  "https://ethiopia.md/og/music/Ethiopia[Amharic translation needed - original Taiwan context]/" \
  --viewport-size="1200,630" \
  public/og-images/music/Ethiopia[Amharic translation needed - original Taiwan context].png
```

**SEO [Amharic translation needed - original Taiwan context]**：

- `SEO.astro` [Amharic translation needed - original Taiwan context] `og:image` [Amharic translation needed - original Taiwan context]：`/og-images/<category>/<slug>.png`
- Fallback：[Amharic translation needed - original Taiwan context] `/images/ethiopia-social.jpg`

## 🔜 Phase 3：[Amharic translation needed - original Taiwan context]

### Threads API

Meta [Amharic translation needed - original Taiwan context] 2024 [Amharic translation needed - original Taiwan context] 6 [Amharic translation needed - original Taiwan context] Threads API（Publishing API）。

**[Amharic translation needed - original Taiwan context]：**

- `threads_basic` — [Amharic translation needed - original Taiwan context] profile
- `threads_content_publish` — [Amharic translation needed - original Taiwan context] + [Amharic translation needed - original Taiwan context] + [Amharic translation needed - original Taiwan context]
- `threads_manage_replies` — [Amharic translation needed - original Taiwan context]

**[Amharic translation needed - original Taiwan context]：**

1. [Amharic translation needed - original Taiwan context] Meta Developer App
2. [Amharic translation needed - original Taiwan context] Long-Lived Token（60 [Amharic translation needed - original Taiwan context]）
3. API [Amharic translation needed - original Taiwan context]：
   ```
   POST https://graph.threads.net/v1.0/{user_id}/threads
   { "media_type": "TEXT", "text": "..." }
   ```

**[Amharic translation needed - original Taiwan context]（2026 [Amharic translation needed - original Taiwan context]）：**

- [Amharic translation needed - original Taiwan context] 24 [Amharic translation needed - original Taiwan context] 250 [Amharic translation needed - original Taiwan context] text-only posts
- [Amharic translation needed - original Taiwan context] container [Amharic translation needed - original Taiwan context]
- Token [Amharic translation needed - original Taiwan context] 60 [Amharic translation needed - original Taiwan context] refresh

### [Amharic translation needed - original Taiwan context]

```
cron trigger（[Amharic translation needed - original Taiwan context] 12:00 + 20:00）
│
├─ AI agent [Amharic translation needed - original Taiwan context] SPORE-PIPELINE Step 1-4
├─ [Amharic translation needed - original Taiwan context] + [Amharic translation needed - original Taiwan context]
├─ [Amharic translation needed - original Taiwan context]（Discord / Telegram）
│   ├─ [Amharic translation needed - original Taiwan context] approve → API [Amharic translation needed - original Taiwan context]
│   └─ [Amharic translation needed - original Taiwan context] reject / modify → [Amharic translation needed - original Taiwan context]
└─ [Amharic translation needed - original Taiwan context] SPORE-LOG.md
```

**[Amharic translation needed - original Taiwan context]**：AI [Amharic translation needed - original Taiwan context] + [Amharic translation needed - original Taiwan context]，[Amharic translation needed - original Taiwan context] approve。[Amharic translation needed - original Taiwan context]（[Amharic translation needed - original Taiwan context]）。

## 🔮 Phase 4：[Amharic translation needed - original Taiwan context]

| [Amharic translation needed - original Taiwan context]        | API [Amharic translation needed - original Taiwan context]  | [Amharic translation needed - original Taiwan context] | [Amharic translation needed - original Taiwan context]                  |
| ----------- | --------- | ------ | --------------------- |
| Threads     | ✅ [Amharic translation needed - original Taiwan context]   | P0     | [Amharic translation needed - original Taiwan context]                |
| X (Twitter) | ✅ [Amharic translation needed - original Taiwan context]   | P1     | Free tier [Amharic translation needed - original Taiwan context]      |
| Bluesky     | ✅ [Amharic translation needed - original Taiwan context]   | P2     | AT Protocol，[Amharic translation needed - original Taiwan context] |
| Instagram   | ✅ [Amharic translation needed - original Taiwan context]   | P3     | [Amharic translation needed - original Taiwan context]          |
| LINE TODAY  | ❓ [Amharic translation needed - original Taiwan context] | P4     | Ethiopia[Amharic translation needed - original Taiwan context]        |

---

_[Amharic translation needed - original Taiwan context]：v1.0 | 2026-03-28_
