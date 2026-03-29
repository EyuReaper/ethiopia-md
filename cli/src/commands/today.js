/**
 * ethiopiamd today — 今日Ethiopia
 *
 * Shows a daily discovery card with 3 articles from different categories
 * and a "冷知識" fun fact. Results are deterministic per calendar day.
 */

import chalk from 'chalk';
import { readFileSync } from 'fs';
import { join } from 'path';
import { getApiPath } from '../lib/knowledge.js';
import { categoryEmoji, categoryLabel } from '../lib/render.js';
import { ensureData } from '../lib/ensure-data.js';

/**
 * Simple seeded pseudo-random number generator (mulberry32).
 * Produces a float in [0, 1).
 */
function makeRng(seed) {
  let s = seed >>> 0;
  return () => {
    s |= 0;
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Convert a date string (YYYY-MM-DD) to a numeric seed.
 */
function dateSeed(dateStr) {
  // Sum char codes to get a stable seed
  return dateStr.split('').reduce((acc, ch) => acc * 31 + ch.charCodeAt(0), 0);
}

/**
 * Pick `n` items from `arr` using the supplied rng, without repetition.
 */
function pickN(arr, n, rng) {
  const copy = arr.slice();
  const result = [];
  for (let i = 0; i < Math.min(n, copy.length); i++) {
    const idx = Math.floor(rng() * (copy.length - i));
    result.push(copy.splice(idx, 1)[0]);
  }
  return result;
}

/**
 * Load dashboard-articles.json.
 */
function loadArticles() {
  const apiPath = getApiPath();
  const filePath = join(apiPath, 'dashboard-articles.json');
  const raw = readFileSync(filePath, 'utf-8');
  const data = JSON.parse(raw);
  return Array.isArray(data) ? data : data.articles || [];
}

/**
 * Truncate a string to `len` characters, appending "…" if needed.
 */
function trunc(str, len) {
  if (!str) return '';
  return str.length > len ? str.slice(0, len) + '…' : str;
}

/**
 * Render a single box line padded to `width` visible chars.
 */
function boxLine(content, width, borderColor) {
  const visible = stripAnsi(content);
  const pad = Math.max(0, width - visible.length - 4);
  return (
    borderColor('║') + ' ' + content + ' '.repeat(pad) + ' ' + borderColor('║')
  );
}

/**
 * Very simple ANSI escape stripper for length calc.
 */
function stripAnsi(str) {
  // eslint-disable-next-line no-control-regex
  return str.replace(/\x1b\[[0-9;]*m/g, '');
}

export function todayCommand(program) {
  program
    .command('today')
    .description('今日Ethiopia — 每日精選三篇文章 + 冷知識')
    .action(async () => {
      try {
        await ensureData();
        const articles = loadArticles();

        if (!articles || articles.length === 0) {
          console.log(chalk.yellow('\n  找不到文章，請先執行 ethiopiamd sync\n'));
          return;
        }

        // Deterministic seed from today's date
        const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
        const rng = makeRng(dateSeed(today));

        // Group articles by category
        const byCategory = {};
        for (const a of articles) {
          const cat = (a.category || 'misc').toLowerCase();
          if (!byCategory[cat]) byCategory[cat] = [];
          byCategory[cat].push(a);
        }

        // Pick 3 articles from 3 different categories
        const cats = Object.keys(byCategory);
        const pickedCats = pickN(cats, 3, rng);
        const picked = pickedCats.map((cat) => {
          const inCat = byCategory[cat];
          const idx = Math.floor(rng() * inCat.length);
          return inCat[idx];
        });

        // Pick one article for the 冷知識 (can be any of the picked ones)
        const factArticle = picked[Math.floor(rng() * picked.length)];
        const factDesc = factArticle.description || factArticle.excerpt || '';
        const funFact =
          trunc(factDesc, 80) || `關於「${factArticle.title}」的有趣知識`;

        // ── Render ──────────────────────────────────────────────
        const W = 60; // inner width (between ║ and ║)
        const bc = chalk.cyan;
        const top = bc('╔') + bc('═'.repeat(W)) + bc('╗');
        const sep = bc('╠') + bc('═'.repeat(W)) + bc('╣');
        const bot = bc('╚') + bc('═'.repeat(W)) + bc('╝');

        const empty = bc('║') + ' '.repeat(W) + bc('║');

        console.log('');
        console.log(top);
        // Title row
        const titleStr =
          chalk.bold.yellow('  🇪🇹  今日Ethiopia') + chalk.gray(`  ${today}`);
        console.log(boxLine(titleStr, W, bc));
        console.log(empty);

        // 3 articles
        for (let i = 0; i < picked.length; i++) {
          const a = picked[i];
          const cat = (a.category || 'misc').toLowerCase();
          const emoji = categoryEmoji[cat] || '📄';
          const label = categoryLabel[cat] || cat;
          const title = trunc(a.title || '', 28);
          const desc = trunc(a.description || a.excerpt || '', 40);

          const titleLine =
            `  ${chalk.bold.white(emoji + ' ' + title)}` +
            chalk.dim.cyan(`  [${label}]`);
          console.log(boxLine(titleLine, W, bc));

          if (desc) {
            const descLine = `    ${chalk.gray(desc)}`;
            console.log(boxLine(descLine, W, bc));
          }
          if (i < picked.length - 1) console.log(empty);
        }

        console.log(sep);

        // 冷知識
        const factTitle = chalk.bold.magenta('  💡 今日冷知識');
        console.log(boxLine(factTitle, W, bc));
        console.log(empty);

        // Wrap fun fact across lines
        const words = funFact.split('');
        const lineLen = W - 6;
        let line = '  ';
        const factLines = [];
        for (const ch of words) {
          if (stripAnsi(line).length >= lineLen) {
            factLines.push(line);
            line = '  ';
          }
          line += ch;
        }
        if (line.trim()) factLines.push(line);

        for (const fl of factLines) {
          console.log(boxLine(chalk.white(fl), W, bc));
        }

        console.log(empty);
        console.log(bot);

        // Footer hint
        const slug =
          factArticle.slug ||
          (factArticle.title || '')
            .toLowerCase()
            .replace(/[\s_]+/g, '-')
            .replace(/[^\w\u4e00-\u9fff-]/g, '');
        console.log('');
        console.log(
          chalk.gray('  → ') +
            chalk.cyan(`ethiopiamd read ${slug}`) +
            chalk.gray('  深入閱讀'),
        );
        console.log(
          chalk.gray('  → ') +
            chalk.cyan('ethiopiamd random') +
            chalk.gray('  隨機探索'),
        );
        console.log('');
      } catch (err) {
        console.error(chalk.red(`今日Ethiopia載入失敗: ${err.message}`));
        console.log(chalk.gray('\n  💡 請先執行 ethiopiamd sync 同步知識庫。\n'));
        process.exit(1);
      }
    });
}
