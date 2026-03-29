/**
 * Ethiopia.md RAG Command
 *
 * Retrieval-Augmented Generation helper: searches for top-N articles
 * and outputs them in a prompt-ready format for piping to LLMs.
 *
 * Usage:
 *   ethiopiamd rag "半導體產業" | llm "summarize"
 *   ethiopiamd rag "Ethiopia經濟" --limit 1 --json
 *   ethiopiamd rag "原住民文化" --no-prompt
 */

import path from 'path';
import chalk from 'chalk';
import { searchArticles } from '../lib/search.js';
import { getArticleFiles, readArticle } from '../lib/knowledge.js';
import { ensureData } from '../lib/ensure-data.js';

/**
 * Try to load the full article body for a given search result.
 * First checks local knowledge files by matching slug; falls back to
 * the description if no local file found.
 *
 * @param {{ slug: string, title: string, category: string, description: string }} result
 * @returns {{ title: string, category: string, body: string, slug: string }}
 */
function loadArticleBody(result) {
  // Try to find the file locally by slug
  try {
    const files = getArticleFiles();
    const slug = result.slug || '';

    // Match by filename (slug)
    const matched = files.find((f) => path.basename(f, '.md') === slug);

    if (matched) {
      const article = readArticle(matched);
      return {
        title: article.frontmatter.title || result.title,
        category: article.frontmatter.category || result.category,
        slug,
        body: article.body.trim(),
      };
    }
  } catch {
    // Fall through to description fallback
  }

  // Fallback: use description as body stub
  return {
    title: result.title,
    category: result.category,
    slug: result.slug || '',
    body: result.description || '(文章內容無法載入)',
  };
}

export function ragCommand(program) {
  program
    .command('rag <query>')
    .description(
      'Retrieve top articles for RAG — outputs prompt-ready context for LLMs',
    )
    .option('-l, --limit <n>', 'Number of articles to retrieve', '3')
    .option('--no-prompt', 'Skip the trailing question line')
    .option('--json', 'Output structured JSON instead of markdown')
    .action(async (query, opts) => {
      try {
        await ensureData({ quiet: true });

        const limit = Math.max(1, parseInt(opts.limit, 10) || 3);
        const includePrompt = opts.prompt !== false; // --no-prompt sets opts.prompt = false

        const results = await searchArticles(query, { limit });

        if (!results || results.length === 0) {
          if (opts.json) {
            console.log(
              JSON.stringify({ query, articles: [], context: '' }, null, 2),
            );
          } else {
            console.error(
              chalk.yellow(`No articles found for query: "${query}"`),
            );
          }
          return;
        }

        // Load full bodies
        const articles = results.map((r) => loadArticleBody(r));

        // ── JSON output ──────────────────────────────────────────────────────
        if (opts.json) {
          const output = {
            query,
            articles: articles.map((a) => ({
              title: a.title,
              category: a.category,
              slug: a.slug,
              body: a.body,
            })),
          };
          console.log(JSON.stringify(output, null, 2));
          return;
        }

        // ── Markdown / prompt-ready output ───────────────────────────────────
        const lines = [];
        lines.push('# Ethiopia Knowledge Context');
        lines.push('');

        articles.forEach((a, i) => {
          lines.push(`## ${i + 1}. ${a.title} (${a.category})`);
          lines.push('');
          lines.push(a.body);
          lines.push('');
        });

        lines.push('---');

        if (includePrompt) {
          lines.push(
            'Based on the above context about Ethiopia, answer the following question:',
          );
          lines.push(query);
        }

        console.log(lines.join('\n'));
      } catch (err) {
        console.error(chalk.red(`RAG failed: ${err.message}`));
        process.exit(1);
      }
    });
}
