/**
 * ethiopiamd explore — 互動模糊搜尋 TUI
 *
 * Uses ONLY readline + ANSI escape codes.
 * No blessed, no ink, no extra deps.
 */

import readline from 'readline';
import chalk from 'chalk';
import { readFileSync } from 'fs';
import { join } from 'path';
import { getApiPath, getArticleFiles, readArticle } from '../lib/knowledge.js';
import {
  categoryEmoji,
  categoryLabel,
  renderArticleHeader,
  renderMarkdown,
} from '../lib/render.js';
import { searchArticles } from '../lib/search.js';
import { ensureData } from '../lib/ensure-data.js';

// ANSI helpers
const ESC = '\x1b';
const HIDE_CURSOR = '\x1b[?25l';
const SHOW_CURSOR = '\x1b[?25h';
const CLEAR_LINE = '\x1b[K';
const CURSOR_UP = (n) => `\x1b[${n}A`;
const CLEAR_SCREEN_BELOW = '\x1b[J';

const MAX_RESULTS = 10;

/**
 * Load all articles for quick substring fallback.
 */
function loadArticles() {
  const apiPath = getApiPath();
  const filePath = join(apiPath, 'dashboard-articles.json');
  try {
    const raw = readFileSync(filePath, 'utf-8');
    const data = JSON.parse(raw);
    return Array.isArray(data) ? data : data.articles || [];
  } catch {
    return [];
  }
}

/**
 * Simple local substring search (fast, synchronous).
 */
function localSearch(articles, query, limit) {
  if (!query.trim()) return articles.slice(0, limit);
  const q = query.toLowerCase();
  return articles
    .filter((a) => {
      const title = (a.title || '').toLowerCase();
      const desc = (a.description || '').toLowerCase();
      return title.includes(q) || desc.includes(q);
    })
    .slice(0, limit);
}

/**
 * Render the results list into lines (array of strings).
 */
function renderResults(results, selectedIdx, query) {
  const lines = [];

  if (results.length === 0) {
    if (query.trim()) {
      lines.push(chalk.gray('  找不到相關文章'));
    } else {
      lines.push(chalk.gray('  輸入關鍵字搜尋…'));
    }
    return lines;
  }

  for (let i = 0; i < results.length; i++) {
    const a = results[i];
    const cat = (a.category || 'misc').toLowerCase();
    const emoji = categoryEmoji[cat] || '📄';
    const title = a.title || '';
    const desc = a.description || a.excerpt || '';
    const preview = desc.length > 45 ? desc.slice(0, 45) + '…' : desc;

    const isSelected = i === selectedIdx;
    const prefix = isSelected ? chalk.cyan('▶ ') : '  ';
    const titleStr = isSelected ? chalk.bold.cyan(title) : chalk.white(title);
    const descStr = chalk.gray(preview);
    const catStr = chalk.dim(`[${categoryLabel[cat] || cat}]`);

    lines.push(`${prefix}${emoji} ${titleStr} ${catStr}`);
    if (preview) {
      lines.push(`    ${descStr}`);
    }
  }

  return lines;
}

/**
 * Find and render an article by slug or title.
 */
async function openArticle(articleData) {
  // Clear screen for article view
  process.stdout.write('\x1b[2J\x1b[H');
  process.stdout.write(SHOW_CURSOR);

  const slug = articleData.slug || articleData.id || '';
  const files = getArticleFiles();

  // Find the file
  const q = (slug || articleData.title || '').toLowerCase();
  let filePath = null;

  for (const fp of files) {
    const base = fp.split('/').pop().replace(/\.md$/i, '').toLowerCase();
    if (base === q || base.includes(q) || q.includes(base)) {
      filePath = fp;
      break;
    }
  }

  if (!filePath) {
    console.log(chalk.yellow('\n  找不到文章。\n'));
    console.log(chalk.gray('  按任意鍵返回…'));
    await waitAnyKey();
    return;
  }

  try {
    const article = readArticle(filePath);
    if (!article) {
      console.log(chalk.red('\n  無法讀取文章。\n'));
      await waitAnyKey();
      return;
    }
    const fm = article.frontmatter;
    console.log('');
    console.log(
      renderArticleHeader({
        title: fm.title,
        category: fm.category,
        date: fm.date,
        wordCount: fm.wordCount,
        tags: fm.tags,
        description: fm.description,
      }),
    );
    console.log('');
    console.log(renderMarkdown(article.body || ''));
  } catch {
    console.log(chalk.red('\n  讀取文章時發生錯誤。\n'));
  }

  console.log(chalk.gray('\n  ─────────────────────────'));
  console.log(chalk.gray('  按任意鍵返回搜尋…'));
  await waitAnyKey();
}

function waitAnyKey() {
  return new Promise((resolve) => {
    process.stdin.setRawMode(true);
    process.stdin.resume();
    process.stdin.once('data', () => {
      process.stdin.setRawMode(false);
      process.stdin.pause();
      resolve();
    });
  });
}

export function exploreCommand(program) {
  program
    .command('explore')
    .description('互動搜尋 TUI — 即時模糊搜尋文章')
    .action(async () => {
      try {
        await ensureData();
        const allArticles = loadArticles();

        if (!allArticles || allArticles.length === 0) {
          console.log(chalk.yellow('\n  找不到文章，請先執行 ethiopiamd sync\n'));
          return;
        }

        // Initial results (top 10)
        let results = allArticles.slice(0, MAX_RESULTS);
        let query = '';
        let selectedIdx = 0;
        let debounceTimer = null;
        let lastRenderedLines = 0;

        // ── Draw ──────────────────────────────────────────────
        function draw(isFirstDraw) {
          if (!isFirstDraw) {
            // Move cursor up to erase previous render
            const moveUp = lastRenderedLines + 2; // +2 for header lines
            if (moveUp > 0) {
              process.stdout.write(CURSOR_UP(moveUp));
            }
            process.stdout.write(CLEAR_SCREEN_BELOW);
          }

          // Header
          process.stdout.write(
            chalk.bold.cyan('  🔍 探索Ethiopia知識庫') +
              chalk.gray('  (↑↓ 選擇  Enter 閱讀  Esc 離開)\n'),
          );
          process.stdout.write(
            chalk.white('  搜尋：') +
              chalk.bold.yellow(query || '') +
              chalk.dim('█') +
              CLEAR_LINE +
              '\n',
          );

          // Results
          const resultLines = renderResults(results, selectedIdx, query);
          for (const line of resultLines) {
            process.stdout.write('  ' + line + CLEAR_LINE + '\n');
          }

          // Status line
          const countStr =
            results.length > 0
              ? chalk.gray(`  共 ${results.length} 篇結果`)
              : '';
          process.stdout.write(countStr + CLEAR_LINE + '\n');

          lastRenderedLines = resultLines.length + 1; // +1 for status line
        }

        // ── Search ────────────────────────────────────────────
        function updateResults() {
          if (!query.trim()) {
            results = allArticles.slice(0, MAX_RESULTS);
          } else {
            results = localSearch(allArticles, query, MAX_RESULTS);
          }
          selectedIdx = 0;
          draw(false);
        }

        // ── Setup stdin ───────────────────────────────────────
        process.stdout.write(HIDE_CURSOR);

        // Initial draw
        draw(true);

        process.stdin.setRawMode(true);
        process.stdin.resume();
        process.stdin.setEncoding('utf8');

        function cleanup() {
          process.stdout.write(SHOW_CURSOR);
          process.stdin.setRawMode(false);
          process.stdin.pause();
          process.stdin.setEncoding(null);
          if (debounceTimer) clearTimeout(debounceTimer);
        }

        // ── Key handler ───────────────────────────────────────
        const onKey = async (ch) => {
          // Ctrl+C or Esc
          if (ch === '\x03' || ch === '\x1b') {
            cleanup();
            process.stdout.write('\n');
            console.log(chalk.gray('  再見！\n'));
            process.exit(0);
          }

          // Arrow up
          if (ch === '\x1b[A' || ch === '\x1B[A') {
            selectedIdx = Math.max(0, selectedIdx - 1);
            draw(false);
            return;
          }

          // Arrow down
          if (ch === '\x1b[B' || ch === '\x1B[B') {
            selectedIdx = Math.min(results.length - 1, selectedIdx + 1);
            draw(false);
            return;
          }

          // Enter
          if (ch === '\r' || ch === '\n') {
            if (results.length > 0 && selectedIdx < results.length) {
              cleanup();
              await openArticle(results[selectedIdx]);
              // Re-enter explore mode
              process.stdout.write(HIDE_CURSOR);
              draw(true);
              process.stdin.setRawMode(true);
              process.stdin.resume();
              process.stdin.setEncoding('utf8');
              process.stdin.on('data', onKey);
            }
            return;
          }

          // Backspace
          if (ch === '\x7f' || ch === '\b') {
            if (query.length > 0) {
              query = query.slice(0, -1);
              if (debounceTimer) clearTimeout(debounceTimer);
              debounceTimer = setTimeout(updateResults, 200);
              draw(false);
            }
            return;
          }

          // Printable characters
          if (ch && ch.length === 1 && ch >= ' ') {
            query += ch;
            draw(false); // immediate visual feedback
            if (debounceTimer) clearTimeout(debounceTimer);
            debounceTimer = setTimeout(updateResults, 200);
          }
        };

        process.stdin.on('data', onKey);
      } catch (err) {
        process.stdout.write(SHOW_CURSOR);
        console.error(chalk.red(`探索模式失敗: ${err.message}`));
        try {
          process.stdin.setRawMode(false);
        } catch {}
        process.stdin.pause();
        process.exit(1);
      }
    });
}
