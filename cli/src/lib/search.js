/**
 * Ethiopia.md Search
 *
 * Searches the visible (published) articles. When the knowledge base is
 * available locally, articles are scanned directly from knowledge/ so the
 * draft/archived filter always applies. Otherwise falls back to the remote
 * articles.json published by ethiopia.md.
 */

import {
  getArticleFilesForLang,
  isKnowledgeAvailable,
  readArticle,
  isSupportedLang,
} from './knowledge.js';

// In-memory cache for remote article list
let _remoteArticlesCache = null;

/**
 * Score articles by case-insensitive substring match across title, tags and description.
 */
function scoreArticles(articles, query, limit) {
  const q = query.toLowerCase();
  const terms = q.split(/\s+/).filter(Boolean);

  const scored = articles
    .map((article) => {
      const title = (article.title || '').toLowerCase();
      const description = (article.description || '').toLowerCase();
      const tags = (article.tags || []).join(' ').toLowerCase();

      let score = 0;

      // Exact phrase in title is strongest
      if (title.includes(q)) score += 10;

      // Per-term matching
      for (const term of terms) {
        if (title.includes(term)) score += 5;
        if (description.includes(term)) score += 2;
        if (tags.includes(term)) score += 3;
      }

      return { ...article, score };
    })
    .filter((a) => a.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);

  return scored.map((a) => ({
    title: a.title,
    slug: a.slug || '',
    category: a.category || '',
    description: a.description || '',
    score: a.score,
  }));
}

/**
 * Load every visible article for a language from the local knowledge base.
 * Returns lightweight records (no body) for scoring.
 */
function loadLocalArticles(lang) {
  const files = getArticleFilesForLang(lang);
  const articles = [];
  for (const filePath of files) {
    try {
      const { frontmatter } = readArticle(filePath);
      articles.push({
        title: frontmatter.title,
        slug: frontmatter.slug,
        category: frontmatter.category,
        description: frontmatter.description,
        tags: frontmatter.tags,
      });
    } catch {
      // skip unreadable files
    }
  }
  return articles;
}

/**
 * Fetch articles.json from the ethiopia.md API (published articles only).
 * Caches result in memory for the lifetime of the process.
 *
 * @returns {Promise<Array|null>}
 */
async function fetchRemoteArticles() {
  if (_remoteArticlesCache) return _remoteArticlesCache;

  try {
    const response = await fetch('https://ethiopia.md/api/articles.json', {
      headers: { Accept: 'application/json' },
      signal: AbortSignal.timeout(10_000),
    });

    if (!response.ok) return null;

    const data = await response.json();
    const articles = Array.isArray(data) ? data : data.articles || null;
    if (articles) _remoteArticlesCache = articles;
    return articles;
  } catch {
    return null;
  }
}

/**
 * Search the remote articles.json API.
 *
 * @param {string} query
 * @param {number} limit
 * @returns {Promise<Array>}
 */
export async function searchRemote(query, limit = 10) {
  const articles = await fetchRemoteArticles();
  if (!articles) return [];
  return scoreArticles(articles, query, limit);
}

/**
 * Search visible articles.
 *
 * @param {string} query - Search query string
 * @param {object} options
 * @param {number} [options.limit=10] - Maximum results to return
 * @param {string} [options.lang='am'] - 'am' (Amharic, default) or 'en'
 * @returns {Promise<Array<{title: string, slug: string, category: string, description: string, score: number}>>}
 */
export async function searchArticles(query, { limit = 10, lang = 'am' } = {}) {
  if (!query || !query.trim()) return [];
  if (!isSupportedLang(lang)) {
    throw new Error(`Unsupported language "${lang}". Use "am" or "en".`);
  }

  const trimmedQuery = query.trim();

  if (isKnowledgeAvailable()) {
    return scoreArticles(loadLocalArticles(lang), trimmedQuery, limit);
  }

  // No local knowledge base: use the published remote index (Amharic-only)
  return searchRemote(trimmedQuery, limit);
}
