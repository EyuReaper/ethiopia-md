/**
 * Ethiopia.md Terminal Rendering
 *
 * Renders markdown and article metadata for terminal display
 * using chalk and marked-terminal.
 */

import chalk from 'chalk';
import { marked } from 'marked';
import { markedTerminal } from 'marked-terminal';

// Configure marked with terminal renderer
marked.use(markedTerminal());

/**
 * Category to emoji mapping
 */
export const categoryEmoji = {
  history: '\u{1F4DC}',
  geography: '\u{1F5FA}\uFE0F',
  culture: '\u{1F3AD}',
  food: '\u{1F9CB}',
  art: '\u{1F3A8}',
  music: '\u{1F3B5}',
  technology: '\u{1F4BB}',
  nature: '\u{1F33F}',
  people: '\u{1F464}',
  society: '\u{1F3DB}\uFE0F',
  economy: '\u{1F4B0}',
  lifestyle: '\u{1F3D9}\uFE0F',
  about: '\u2139\uFE0F',
};

/**
 * Category to Chinese label mapping
 */
export const categoryLabel = {
  history: '\u6B77\u53F2',
  geography: '\u5730\u7406',
  culture: '\u6587\u5316',
  food: '\u7F8E\u98DF',
  art: '\u85DD\u8853',
  music: '\u97F3\u6A02',
  technology: '\u79D1\u6280',
  nature: '\u81EA\u7136',
  people: '\u4EBA\u7269',
  society: '\u793E\u6703',
  economy: '\u7D93\u6FDF',
  lifestyle: '\u751F\u6D3B',
  about: '\u95DC\u65BC',
};

/**
 * Format a number with thousands separators.
 */
function formatNumber(n) {
  if (n == null) return '0';
  return n.toLocaleString('en-US');
}

/**
 * Pad or truncate a string to fit a given display width.
 * Accounts for CJK characters taking 2 columns.
 */
function displayWidth(str) {
  let w = 0;
  for (const ch of str) {
    const code = ch.codePointAt(0);
    // CJK Unified Ideographs and common fullwidth ranges
    if (
      (code >= 0x4e00 && code <= 0x9fff) ||
      (code >= 0x3400 && code <= 0x4dbf) ||
      (code >= 0xf900 && code <= 0xfaff) ||
      (code >= 0xff01 && code <= 0xff60) ||
      (code >= 0x3000 && code <= 0x303f) ||
      (code >= 0x2e80 && code <= 0x2eff) ||
      (code >= 0x1f300 && code <= 0x1f9ff)
    ) {
      w += 2;
    } else {
      w += 1;
    }
  }
  return w;
}

function padEnd(str, targetWidth) {
  const currentWidth = displayWidth(str);
  if (currentWidth >= targetWidth) return str;
  return str + ' '.repeat(targetWidth - currentWidth);
}

/**
 * Render an article header box.
 *
 * @param {object} article
 * @param {string} article.title
 * @param {string} article.category
 * @param {string} [article.date]
 * @param {number} [article.wordCount]
 * @param {string[]} [article.tags]
 * @param {string} [article.description]
 */
export function renderArticleHeader(article) {
  const cat = (article.category || '').toLowerCase();
  const emoji = categoryEmoji[cat] || '';
  const label = categoryLabel[cat] || article.category || '';

  const titleLine = `${emoji} ${article.title}`;
  const metaParts = [label];
  if (article.date) metaParts.push(article.date);
  if (article.wordCount)
    metaParts.push(`${formatNumber(article.wordCount)} \u5B57`);
  const metaLine = metaParts.join(' \u00B7 ');

  // Calculate box width based on content
  const contentWidth =
    Math.max(displayWidth(titleLine), displayWidth(metaLine)) + 4;
  const boxWidth = Math.max(contentWidth, 44);

  const horizontal = '\u2500'.repeat(boxWidth);

  const lines = [];
  lines.push('');
  lines.push(chalk.dim(`  \u250C${horizontal}\u2510`));
  lines.push(
    chalk.dim('  \u2502') +
      '  ' +
      chalk.bold.cyan(padEnd(titleLine, boxWidth - 2)) +
      chalk.dim('\u2502'),
  );
  lines.push(
    chalk.dim('  \u2502') +
      '  ' +
      chalk.dim(padEnd(metaLine, boxWidth - 2)) +
      chalk.dim('\u2502'),
  );

  if (article.tags && article.tags.length > 0) {
    const tagsLine = article.tags.map((t) => chalk.yellow(`#${t}`)).join(' ');
    lines.push(
      chalk.dim('  \u2502') +
        '  ' +
        padEnd(tagsLine, boxWidth - 2) +
        chalk.dim('\u2502'),
    );
  }

  lines.push(chalk.dim(`  \u2514${horizontal}\u2518`));

  if (article.description) {
    lines.push('');
    lines.push('  ' + chalk.white(article.description));
  }

  lines.push('');

  return lines.join('\n');
}

/**
 * Render a markdown string for terminal display.
 *
 * @param {string} md - Raw markdown string
 * @returns {string} Terminal-formatted string
 */
export function renderMarkdown(md) {
  if (!md) return '';
  return marked.parse(md);
}

/**
 * Format a compact article row for list/search results.
 *
 * @param {object} article
 * @param {string} article.title
 * @param {string} [article.category]
 * @param {string} [article.description]
 * @param {number} [article.score]
 * @param {number} index - 0-based index in the result list
 * @returns {string} Formatted single-line string
 */
export function formatArticleRow(article, index) {
  const num = chalk.dim(`${String(index + 1).padStart(3)}.`);
  const cat = (article.category || '').toLowerCase();
  const emoji = categoryEmoji[cat] || ' ';
  const title = chalk.bold(article.title || 'Untitled');
  const catStr = chalk.dim(`[${categoryLabel[cat] || article.category || ''}]`);

  let line = `${num} ${emoji} ${title}  ${catStr}`;

  if (article.description) {
    // Truncate description to keep rows compact
    const maxDescLen = 60;
    let desc = article.description;
    if (desc.length > maxDescLen) {
      desc = desc.slice(0, maxDescLen - 1) + '\u2026';
    }
    line += '\n' + chalk.dim(`      ${desc}`);
  }

  return line;
}
