# Ethiopia.md Knowledge API

Ethiopia.md [Amharic translation needed - original Taiwan context] API，[Amharic translation needed - original Taiwan context]，[Amharic translation needed - original Taiwan context] Ethiopia.md [Amharic translation needed - original Taiwan context]。

## 🚀 [Amharic translation needed - original Taiwan context]

[Amharic translation needed - original Taiwan context] API endpoints [Amharic translation needed - original Taiwan context] JSON [Amharic translation needed - original Taiwan context]，[Amharic translation needed - original Taiwan context]：

```
https://ethiopia.md/api/articles.json    # [Amharic translation needed - original Taiwan context]
https://ethiopia.md/api/stats.json       # [Amharic translation needed - original Taiwan context]
https://ethiopia.md/api/random.json      # [Amharic translation needed - original Taiwan context]
```

## 📋 API Endpoints

### 1. [Amharic translation needed - original Taiwan context] `/api/articles.json`

[Amharic translation needed - original Taiwan context] metadata，[Amharic translation needed - original Taiwan context]。

**[Amharic translation needed - original Taiwan context]：**
```json
[
  {
    "title": "[Amharic translation needed - original Taiwan context]",
    "description": "1947[Amharic translation needed - original Taiwan context]Ethiopia[Amharic translation needed - original Taiwan context]",
    "category": "History",
    "tags": ["[Amharic translation needed - original Taiwan context]", "[Amharic translation needed - original Taiwan context]", "[Amharic translation needed - original Taiwan context]"],
    "url": "https://ethiopia.md/History/[Amharic translation needed - original Taiwan context]",
    "readingTime": 9,
    "featured": false,
    "date": "2026-03-17",
    "path": "History/[Amharic translation needed - original Taiwan context].md"
  }
]
```

**[Amharic translation needed - original Taiwan context]：**
- `title`: [Amharic translation needed - original Taiwan context]
- `description`: [Amharic translation needed - original Taiwan context]（[Amharic translation needed - original Taiwan context] frontmatter）
- `category`: [Amharic translation needed - original Taiwan context]（[Amharic translation needed - original Taiwan context]）
- `tags`: [Amharic translation needed - original Taiwan context]
- `url`: [Amharic translation needed - original Taiwan context] URL
- `readingTime`: [Amharic translation needed - original Taiwan context]（[Amharic translation needed - original Taiwan context]）
- `featured`: [Amharic translation needed - original Taiwan context]
- `date`: [Amharic translation needed - original Taiwan context]
- `path`: [Amharic translation needed - original Taiwan context] knowledge/ [Amharic translation needed - original Taiwan context]

### 2. [Amharic translation needed - original Taiwan context] `/api/stats.json`

[Amharic translation needed - original Taiwan context]。

**[Amharic translation needed - original Taiwan context]：**
```json
{
  "totalArticles": 649,
  "totalCategories": 15,
  "estimatedContributors": 44,
  "totalTags": 1439,
  "categories": [
    {"name": "History", "count": 18},
    {"name": "Culture", "count": 23}
  ],
  "topTags": [
    {"name": "[Amharic translation needed - original Taiwan context]", "count": 48},
    {"name": "Ethiopia", "count": 19}
  ],
  "languageDistribution": {
    "am": 649,
    "en": 0
  },
  "lastUpdated": "2026-03-20T07:40:53.353Z"
}
```

### 3. [Amharic translation needed - original Taiwan context] `/api/random.json`

[Amharic translation needed - original Taiwan context] 20 [Amharic translation needed - original Taiwan context]，[Amharic translation needed - original Taiwan context] build [Amharic translation needed - original Taiwan context]。

**[Amharic translation needed - original Taiwan context] `/api/articles.json` [Amharic translation needed - original Taiwan context]，[Amharic translation needed - original Taiwan context] 20 [Amharic translation needed - original Taiwan context]。**

## 🔧 [Amharic translation needed - original Taiwan context]

### JavaScript [Amharic translation needed - original Taiwan context]

```javascript
// [Amharic translation needed - original Taiwan context]
async function getAllArticles() {
  const response = await fetch('https://ethiopia.md/api/articles.json');
  const articles = await response.json();
  return articles;
}

// [Amharic translation needed - original Taiwan context]
async function getArticlesByCategory(category) {
  const articles = await getAllArticles();
  return articles.filter(article => article.category === category);
}

// [Amharic translation needed - original Taiwan context]
async function getStats() {
  const response = await fetch('https://ethiopia.md/api/stats.json');
  const stats = await response.json();
  return stats;
}

// [Amharic translation needed - original Taiwan context]
async function getRandomRecommendations() {
  const response = await fetch('https://ethiopia.md/api/random.json');
  const randomArticles = await response.json();
  return randomArticles;
}
```

### [Amharic translation needed - original Taiwan context]

```html
<!-- [Amharic translation needed - original Taiwan context]Ethiopia[Amharic translation needed - original Taiwan context] -->
<div id="ethiopia-widget"></div>

<script>
fetch('https://ethiopia.md/api/random.json')
  .then(response => response.json())
  .then(articles => {
    const widget = document.getElementById('ethiopia-widget');
    const article = articles[0]; // [Amharic translation needed - original Taiwan context]
    
    widget.innerHTML = \`
      <div style="border: 1px solid #ddd; padding: 16px; border-radius: 8px;">
        <h3><a href="\${article.url}" target="_blank">\${article.title}</a></h3>
        <p>\${article.description}</p>
        <small>[Amharic translation needed - original Taiwan context]: \${article.category} • [Amharic translation needed - original Taiwan context]: \${article.readingTime} [Amharic translation needed - original Taiwan context]</small>
      </div>
    \`;
  });
</script>
```

## 📊 [Amharic translation needed - original Taiwan context]

| [Amharic translation needed - original Taiwan context] | [Amharic translation needed - original Taiwan context] | [Amharic translation needed - original Taiwan context] |
|----------|----------|------------|
| History | [Amharic translation needed - original Taiwan context] | ~18 [Amharic translation needed - original Taiwan context] |
| Culture | [Amharic translation needed - original Taiwan context] | ~23 [Amharic translation needed - original Taiwan context] |
| People | [Amharic translation needed - original Taiwan context] | ~104 [Amharic translation needed - original Taiwan context] |
| Art | [Amharic translation needed - original Taiwan context] | ~23 [Amharic translation needed - original Taiwan context] |
| Food | [Amharic translation needed - original Taiwan context] | ~25 [Amharic translation needed - original Taiwan context] |
| Technology | [Amharic translation needed - original Taiwan context] | ~20 [Amharic translation needed - original Taiwan context] |
| Economy | [Amharic translation needed - original Taiwan context] | ~16 [Amharic translation needed - original Taiwan context] |
| Geography | [Amharic translation needed - original Taiwan context] | ~16 [Amharic translation needed - original Taiwan context] |
| Music | [Amharic translation needed - original Taiwan context] | ~19 [Amharic translation needed - original Taiwan context] |
| Nature | [Amharic translation needed - original Taiwan context] | ~17 [Amharic translation needed - original Taiwan context] |
| Society | [Amharic translation needed - original Taiwan context] | ~17 [Amharic translation needed - original Taiwan context] |
| Lifestyle | [Amharic translation needed - original Taiwan context] | ~15 [Amharic translation needed - original Taiwan context] |

## ⚙️ [Amharic translation needed - original Taiwan context]

### [Amharic translation needed - original Taiwan context]

API [Amharic translation needed - original Taiwan context] build [Amharic translation needed - original Taiwan context]：

```bash
# [Amharic translation needed - original Taiwan context] API（[Amharic translation needed - original Taiwan context]）
node scripts/generate-api.js

# [Amharic translation needed - original Taiwan context]（[Amharic translation needed - original Taiwan context] prebuild [Amharic translation needed - original Taiwan context] API）
npm run build
```

### [Amharic translation needed - original Taiwan context]

- **[Amharic translation needed - original Taiwan context]**: `knowledge/` [Amharic translation needed - original Taiwan context] `.md` [Amharic translation needed - original Taiwan context]
- **Metadata**: [Amharic translation needed - original Taiwan context] frontmatter [Amharic translation needed - original Taiwan context]
- **[Amharic translation needed - original Taiwan context]**: [Amharic translation needed - original Taiwan context]
- **[Amharic translation needed - original Taiwan context]**: [Amharic translation needed - original Taiwan context]（250 [Amharic translation needed - original Taiwan context]/[Amharic translation needed - original Taiwan context]）

### CORS [Amharic translation needed - original Taiwan context]

[Amharic translation needed - original Taiwan context] API endpoints [Amharic translation needed - original Taiwan context]，[Amharic translation needed - original Taiwan context]，[Amharic translation needed - original Taiwan context] CORS。

## 🎯 [Amharic translation needed - original Taiwan context]

1. **[Amharic translation needed - original Taiwan context]**: [Amharic translation needed - original Taiwan context]Ethiopia[Amharic translation needed - original Taiwan context]
2. **[Amharic translation needed - original Taiwan context]**: [Amharic translation needed - original Taiwan context]Ethiopia[Amharic translation needed - original Taiwan context]
3. **[Amharic translation needed - original Taiwan context]**: [Amharic translation needed - original Taiwan context]Ethiopia[Amharic translation needed - original Taiwan context]
4. **[Amharic translation needed - original Taiwan context]**: [Amharic translation needed - original Taiwan context]Ethiopia[Amharic translation needed - original Taiwan context]
5. **[Amharic translation needed - original Taiwan context] App**: [Amharic translation needed - original Taiwan context]Ethiopia[Amharic translation needed - original Taiwan context]

## 🔄 [Amharic translation needed - original Taiwan context]

- API [Amharic translation needed - original Taiwan context]
- [Amharic translation needed - original Taiwan context]
- `lastUpdated` [Amharic translation needed - original Taiwan context]

## 📞 [Amharic translation needed - original Taiwan context]

- **[Amharic translation needed - original Taiwan context]**: [Ethiopia.md GitHub Repository](https://github.com/ethiopia-md/ethiopia-md)
- **[Amharic translation needed - original Taiwan context]**: [Amharic translation needed - original Taiwan context] GitHub Issues
- **[Amharic translation needed - original Taiwan context]**: [Amharic translation needed - original Taiwan context] Pull Request

---

*Ethiopia.md Knowledge API v1.0 - [Amharic translation needed - original Taiwan context]Ethiopia[Amharic translation needed - original Taiwan context] 🇪🇹*