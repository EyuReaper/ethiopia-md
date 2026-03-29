/**
 * Ethiopia.md Validate Command
 *
 * Quality checker for a single article.
 * Outputs a score card with detailed checks.
 *
 * Usage:
 *   ethiopiamd validate 珍珠奶茶
 *   ethiopiamd validate Ethiopia小吃 --json
 *   ethiopiamd validate 台積電 --fix
 */

import fs from 'fs';
import path from 'path';
import chalk from 'chalk';
import { getArticleFiles, readArticle } from '../lib/knowledge.js';
import { ensureData } from '../lib/ensure-data.js';

// ── AI hollow phrase patterns ────────────────────────────────────────────────
const HOLLOW_PATTERNS = [
  { pattern: /不僅[^，。]{0,20}更是/g, label: '"不僅...更是" 句型' },
  { pattern: /扮演著重要角色/g, label: '"扮演著重要角色"' },
  { pattern: /不可或缺的一環/g, label: '"不可或缺的一環"' },
  { pattern: /具有重要意義/g, label: '"具有重要意義"' },
  { pattern: /發揮著重要作用/g, label: '"發揮著重要作用"' },
  { pattern: /值得我們深思/g, label: '"值得我們深思"' },
  { pattern: /不容忽視/g, label: '"不容忽視"' },
  { pattern: /不斷[^，。]{0,10}進步/g, label: '"不斷...進步" 陳詞' },
];

// Minimum word count to pass
const MIN_WORD_COUNT = 800;
// Minimum ## headings to pass
const MIN_HEADINGS = 3;
// Minimum reference links to pass
const MIN_REFERENCES = 2;
// Ideal description length range
const DESC_MIN = 50;
const DESC_MAX = 200;

/**
 * Count CJK + latin words in text.
 */
function countWords(text) {
  if (!text) return 0;
  const cjkRegex = /[\u4e00-\u9fff\u3400-\u4dbf\uf900-\ufaff]/g;
  const cjkCount = (text.match(cjkRegex) || []).length;
  const withoutCjk = text.replace(cjkRegex, ' ');
  const latinWords = withoutCjk
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 0);
  return cjkCount + latinWords.length;
}

/**
 * Find an article file by slug (searches all article files).
 * @param {string} slug
 * @returns {string|null} Absolute file path or null
 */
function findArticleBySlug(slug) {
  try {
    const files = getArticleFiles();
    // Exact match first
    const exact = files.find((f) => path.basename(f, '.md') === slug);
    if (exact) return exact;

    // Partial match (slug as substring)
    const partial = files.find((f) => path.basename(f, '.md').includes(slug));
    return partial || null;
  } catch {
    return null;
  }
}

/**
 * Run all quality checks on a parsed article.
 * @returns {{ checks: Array, score: number, total: number }}
 */
function runChecks(frontmatter, body) {
  const checks = [];

  // ── 1. Frontmatter completeness ─────────────────────────────────────────
  const fmFields = ['title', 'description', 'date', 'tags', 'category'];
  const fmPresent = fmFields.filter((f) => {
    const val = frontmatter[f];
    if (Array.isArray(val)) return val.length > 0;
    return val !== undefined && val !== null && val !== '';
  });
  const fmScore = fmPresent.length;
  const fmPass = fmScore === fmFields.length;
  checks.push({
    id: 'frontmatter',
    pass: fmPass,
    warn: !fmPass,
    label: 'Frontmatter 完整',
    detail: `${fmScore}/${fmFields.length}`,
    missing: fmFields.filter((f) => !fmPresent.includes(f)),
    points: fmPass ? 20 : Math.floor((fmScore / fmFields.length) * 20),
    maxPoints: 20,
    fix: fmPass
      ? null
      : `補齊缺少的欄位: ${fmFields.filter((f) => !fmPresent.includes(f)).join(', ')}`,
  });

  // ── 2. Word count ────────────────────────────────────────────────────────
  const wordCount = countWords(body);
  const wcPass = wordCount >= MIN_WORD_COUNT;
  checks.push({
    id: 'wordcount',
    pass: wcPass,
    warn: !wcPass,
    label: '字數充足',
    detail: `${wordCount.toLocaleString()} 字`,
    points: wcPass ? 20 : Math.floor((wordCount / MIN_WORD_COUNT) * 20),
    maxPoints: 20,
    fix: wcPass
      ? null
      : `文章目前 ${wordCount} 字，建議至少 ${MIN_WORD_COUNT} 字。請擴充各段落內容。`,
  });

  // ── 3. Headings ──────────────────────────────────────────────────────────
  const headingMatches = body.match(/^##\s+.+/gm) || [];
  const headingCount = headingMatches.length;
  const headingPass = headingCount >= MIN_HEADINGS;
  checks.push({
    id: 'headings',
    pass: headingPass,
    warn: !headingPass,
    label: '標題數充足',
    detail: `${headingCount} 個, 建議 ≥${MIN_HEADINGS}`,
    points: headingPass ? 20 : Math.floor((headingCount / MIN_HEADINGS) * 20),
    maxPoints: 20,
    fix: headingPass
      ? null
      : `增加 ## 二級標題，建議加入: 概述、歷史背景、當代發展、國際比較、參考資料`,
  });

  // ── 4. Reference links ───────────────────────────────────────────────────
  const refMatches = body.match(/\[.+?\]\(https?:\/\/.+?\)/g) || [];
  const refCount = refMatches.length;
  const refPass = refCount >= MIN_REFERENCES;
  checks.push({
    id: 'references',
    pass: refPass,
    warn: !refPass,
    label: '參考資料',
    detail: `${refCount} 個來源`,
    points: refPass ? 20 : Math.floor((refCount / MIN_REFERENCES) * 20),
    maxPoints: 20,
    fix: refPass
      ? null
      : `新增至少 ${MIN_REFERENCES} 個 Markdown 格式的參考連結，例如: [來源名稱](https://example.com)`,
  });

  // ── 5. AI hollow phrases ─────────────────────────────────────────────────
  const foundHollow = [];
  for (const { pattern, label } of HOLLOW_PATTERNS) {
    const matches = body.match(pattern);
    if (matches) {
      foundHollow.push({ label, count: matches.length });
    }
  }
  const hollowTotal = foundHollow.reduce((s, h) => s + h.count, 0);
  const hollowPass = hollowTotal === 0;
  checks.push({
    id: 'hollow',
    pass: hollowPass,
    warn: !hollowPass,
    label: 'AI 空洞句式',
    detail: hollowPass ? '無' : `${hollowTotal} 處`,
    found: foundHollow,
    points: hollowPass ? 10 : Math.max(0, 10 - hollowTotal * 3),
    maxPoints: 10,
    fix: hollowPass
      ? null
      : `移除或改寫以下句式: ${foundHollow.map((h) => h.label).join('、')}`,
  });

  // ── 6. Description length ────────────────────────────────────────────────
  const descLen = (frontmatter.description || '').length;
  const descPass = descLen >= DESC_MIN && descLen <= DESC_MAX;
  const descWarn = descLen > 0 && !descPass;
  checks.push({
    id: 'description',
    pass: descPass,
    warn: descWarn,
    label: '描述長度',
    detail:
      descLen === 0
        ? '缺少描述'
        : `${descLen} 字${descPass ? '，適中' : descLen < DESC_MIN ? '，過短' : '，過長'}`,
    points: descPass ? 10 : descLen === 0 ? 0 : 5,
    maxPoints: 10,
    fix: descPass
      ? null
      : descLen === 0
        ? '新增 description 欄位，建議 50-200 字的摘要'
        : descLen < DESC_MIN
          ? `描述過短 (${descLen} 字)，請擴充至 ${DESC_MIN}-${DESC_MAX} 字`
          : `描述過長 (${descLen} 字)，請精簡至 ${DESC_MAX} 字以內`,
  });

  // Calculate total score
  const score = checks.reduce((s, c) => s + c.points, 0);
  const total = checks.reduce((s, c) => s + c.maxPoints, 0);

  return { checks, score, total };
}

/**
 * Return score tier label + emoji.
 */
function scoreTier(score, total) {
  const pct = (score / total) * 100;
  if (pct >= 90) return { emoji: '🟢', label: '優秀' };
  if (pct >= 70) return { emoji: '🟡', label: '需要改善' };
  return { emoji: '🔴', label: '需要大幅改善' };
}

export function validateCommand(program) {
  program
    .command('validate <slug>')
    .description('Quality-check a single article and output a score card')
    .option('--json', 'Output as JSON')
    .option('--fix', 'Show suggested fixes for failing checks')
    .action(async (slug, opts) => {
      try {
        await ensureData({ quiet: true });

        const filePath = findArticleBySlug(slug);
        if (!filePath) {
          const msg = `找不到文章: "${slug}"。請確認 slug 正確，或先執行 ethiopiamd sync。`;
          if (opts.json) {
            console.log(JSON.stringify({ error: msg }, null, 2));
          } else {
            console.error(chalk.red(`\n❌ ${msg}\n`));
          }
          process.exit(1);
        }

        const article = readArticle(filePath);
        const { frontmatter, body } = article;
        const { checks, score, total } = runChecks(frontmatter, body);
        const tier = scoreTier(score, total);

        // ── JSON output ────────────────────────────────────────────────────
        if (opts.json) {
          console.log(
            JSON.stringify(
              {
                slug,
                title: frontmatter.title,
                filePath,
                score,
                total,
                tier: tier.label,
                checks: checks.map((c) => ({
                  id: c.id,
                  label: c.label,
                  pass: c.pass,
                  detail: c.detail,
                  points: c.points,
                  maxPoints: c.maxPoints,
                  fix: c.fix || null,
                })),
              },
              null,
              2,
            ),
          );
          return;
        }

        // ── Human-readable score card ──────────────────────────────────────
        console.log('');
        console.log(
          chalk.bold(`📋 文章品質檢查: ${frontmatter.title || slug}`),
        );
        console.log('');

        for (const check of checks) {
          const icon = check.pass ? chalk.green('✅') : chalk.yellow('⚠️ ');
          const label = chalk.white(check.label);
          const detail = chalk.gray(`(${check.detail})`);
          console.log(`${icon} ${label} ${detail}`);

          if (opts.fix && check.fix) {
            console.log(chalk.gray(`   💡 ${check.fix}`));
          }
        }

        console.log('');
        const tierStr = `${tier.emoji} ${tier.label}`;
        console.log(chalk.bold(`總分: ${score}/${total} — ${tierStr}`));
        console.log('');

        if (!opts.fix && checks.some((c) => !c.pass)) {
          console.log(chalk.gray('  提示: 使用 --fix 查看改善建議\n'));
        }
      } catch (err) {
        console.error(chalk.red(`\n❌ 驗證失敗: ${err.message}\n`));
        process.exit(1);
      }
    });
}
