/**
 * ethiopiamd today — የዛሬዋ ኢትዮጵያ
 *
 *
 * Shows a daily discovery card with 3 articles from different categories
 * and a fun fact. Results are deterministic per calendar day.
 */

import chalk from 'chalk';
import { readFileSync } from 'fs';
import { join } from 'path';
import { getApiPath } from '../lib/knowledge.js';
import { categoryEmoji, categoryLabel } from '../lib/render.js';
import { ensureData } from '../lib/ensure-data.js';

function makeRng(seed) {
  let s = seed >>> 0;
  return () => {
    s |= 0; s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function dateSeed(dateStr) {
  return dateStr.split('').reduce((acc, ch) => acc * 31 + ch.charCodeAt(0), 0);
}

function pickN(arr, n, rng) {
  const copy = arr.slice();
  const result = [];
  for (let i = 0; i < Math.min(n, copy.length); i++) {
    const idx = Math.floor(rng() * (copy.length - i));
    result.push(copy.splice(idx, 1)[0]);
  }
  return result;
}

function loadArticles() {
  const apiPath = getApiPath();
  const filePath = join(apiPath, 'dashboard-articles.json');
  const raw = readFileSync(filePath, 'utf-8');
  return JSON.parse(raw);
}

function trunc(str, len) {
  if (!str) return '';
  return str.length > len ? str.slice(0, len) + '…' : str;
}

function stripAnsi(str) {
  return str.replace(/\x1b\[[0-9;]*m/g, '');
}

function boxLine(content, width, borderColor) {
  const visible = stripAnsi(content);
  const pad = Math.max(0, width - visible.length - 4);
  return borderColor('║') + ' ' + content + ' '.repeat(pad) + ' ' + borderColor('║');
}

export function todayCommand(program) {
  program
    .command('today')
    .description('የዕለቱ የጽሁፍ ምርጫዎች እና እውነታዎች')
    .action(async () => {
      try {
        await ensureData();
        const data = loadArticles();
        const articles = Array.isArray(data) ? data : data.articles || [];

        if (!articles || articles.length === 0) {
          console.log(chalk.yellow('\n  ምንም ጽሁፎች አልተገኙም። Run ethiopiamd sync first.\n'));
          return;
        }

        const today = new Date().toISOString().slice(0, 10);
        const rng = makeRng(dateSeed(today));

        const byCategory = {};
        for (const a of articles) {
          const cat = (a.category || 'misc').toLowerCase();
          if (!byCategory[cat]) byCategory[cat] = [];
          byCategory[cat].push(a);
        }

        const pickedCats = pickN(Object.keys(byCategory), 3, rng);
        const picked = pickedCats.map(cat => {
          const inCat = byCategory[cat];
          return inCat[Math.floor(rng() * inCat.length)];
        });

        const factArticle = picked[Math.floor(rng() * picked.length)];
        const funFact = trunc(factArticle.description || factArticle.excerpt || '', 80) || `Facts about "${factArticle.title}"`;

        const W = 60, bc = chalk.cyan;
        console.log('\n' + bc('╔') + bc('═'.repeat(W)) + bc('╗'));
        console.log(boxLine(chalk.bold.yellow('  🇪🇹  የዛሬዋ ኢትዮጵ') + chalk.gray(`  ${today}`), W, bc));
        console.log(bc('║') + ' '.repeat(W) + bc('║'));

        picked.forEach((a, i) => {
          const cat = (a.category || 'misc').toLowerCase();
          const emoji = categoryEmoji[cat] || '📄';
          const label = categoryLabel[cat] || cat;
          console.log(boxLine(`  ${chalk.bold.white(emoji + ' ' + trunc(a.title, 28))}  ${chalk.dim.cyan('[' + label + ']')}`, W, bc));
          console.log(boxLine(`    ${chalk.gray(trunc(a.description || a.excerpt || '', 40))}`, W, bc));
          if (i < picked.length - 1) console.log(bc('║') + ' '.repeat(W) + bc('║'));
        });

        console.log(bc('╠') + bc('═'.repeat(W)) + bc('╣'));
        console.log(boxLine(chalk.bold.magenta('  💡 የዛሬው እውነታ'), W, bc));
        console.log(bc('║') + ' '.repeat(W) + bc('║'));

        const factWords = funFact.split(' ');
        let currentLine = '  ';
        factWords.forEach(word => {
          if (stripAnsi(currentLine + word).length > W - 6) {
            console.log(boxLine(chalk.white(currentLine), W, bc));
            currentLine = '  ';
          }
          currentLine += word + ' ';
        });
        if (currentLine.trim()) console.log(boxLine(chalk.white(currentLine), W, bc));

        console.log(bc('║') + ' '.repeat(W) + bc('║'));
        console.log(bc('╚') + bc('═'.repeat(W)) + bc('╝'));

        const slug = factArticle.slug || (factArticle.title || '').toLowerCase().replace(/[\s_]+/g, '-').replace(/[^\w\u1200-\u137F-]/g, '');
        console.log(`\n  → ${chalk.cyan('ethiopiamd read ' + slug)} ${chalk.gray(' ሙሉውን ያንብቡ')}`);
        console.log(`  → ${chalk.cyan('ethiopiamd random')} ${chalk.gray('  ሌላ ይሞክሩ')}\n`);
      } catch (err) {
        console.error(chalk.red(`የዛሬው አልተሳካም: ${err.message}`));
        process.exit(1);
      }
    });
}
