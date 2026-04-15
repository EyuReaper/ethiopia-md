/**
 * Ethiopia.md Validate Command
 *
 * Quality checker for a single article.
 * Outputs a score card with detailed checks.
 *
 * Usage:
 *   ethiopiamd validate ቡና
 *   ethiopiamd validate Ethiopiaእንጀራ --json
 *   ethiopiamd validate አድዋ --fix
 */

import fs from 'fs';
import path from 'path';
import chalk from 'chalk';
import { getArticleFiles, readArticle } from '../lib/knowledge.js';
import { ensureData } from '../lib/ensure-data.js';

// ── AI hollow phrase patterns ────────────────────────────────────────────────
// These are common filler phrases that often appear in AI-generated content.
// Updated for English context; Amharic patterns can be added later.
const HOLLOW_PATTERNS = [
  { pattern: /it is important to note/gi, label: '"it is important to note"' },
  { pattern: /plays a crucial role/gi, label: '"plays a crucial role"' },
  { pattern: /an indispensable part/gi, label: '"an indispensable part"' },
  { pattern: /is of great significance/gi, label: '"is of great significance"' },
  { pattern: /a multi-faceted approach/gi, label: '"a multi-faceted approach"' },
  { pattern: /in the grand scheme of things/gi, label: '"in the grand scheme of things"' },
  { pattern: /it is worth considering/gi, label: '"it is worth considering"' },
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
 * Count Amharic characters + latin words in text.
 */
function countWords(text) {
  if (!text) return 0;
  // Match Amharic and CJK characters
  const nonLatinRegex = /[\u1200-\u137F\u4e00-\u9fff\u3400-\u4dbf\uf900-\ufaff]/g;
  const nonLatinCount = (text.match(nonLatinRegex) || []).length;
  const withoutNonLatin = text.replace(nonLatinRegex, ' ');
  const latinWords = withoutNonLatin
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 0);
  return nonLatinCount + latinWords.length;
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
    label: 'Frontmatter ተሟልቷል  ',
    detail: `${fmScore}/${fmFields.length}`,
    missing: fmFields.filter((f) => !fmPresent.includes(f)),
    points: fmPass ? 20 : Math.floor((fmScore / fmFields.length) * 20),
    maxPoints: 20,
    fix: fmPass
      ? null
        `የጎደሉ መስኮችን ያሟሉ: ${fmFields.filter((f) => !fmPresent.includes(f)).join(', ')}`,
  });

  // ── 2. Word count ────────────────────────────────────────────────────────
  const wordCount = countWords(body);
  const wcPass = wordCount >= MIN_WORD_COUNT;
  checks.push({
    id: 'wordcount',
    pass: wcPass,
    warn: !wcPass,
    label: 'በቂ የቃላት ብዛት',
    detail: `${wordCount.toLocaleString()} words`,
    points: wcPass ? 20 : Math.floor((wordCount / MIN_WORD_COUNT) * 20),
    maxPoints: 20,
    fix: wcPass
      ? null
        `በአሁኑ ጽሁፉ ብዛት: ${wordCount} ቃላት አሉት ። የሚመከረው: ቢያንስ ${MIN_WORD_COUNT}. እባኮትን ይዘቱን ያስፉ ።`,
  });

  // ── 3. Headings ──────────────────────────────────────────────────────────
  const headingMatches = body.match(/^##\s+.+/gm) || [];
  const headingCount = headingMatches.length;
  const headingPass = headingCount >= MIN_HEADINGS;
  checks.push({
    id: 'headings',
    pass: headingPass,
    warn: !headingPass,
    label: 'በቂ አርዕስት',
    detail: `${headingCount}, suggested ≥${MIN_HEADINGS}`,
    points: headingPass ? 20 : Math.floor((headingCount / MIN_HEADINGS) * 20),
    maxPoints: 20,
    fix: headingPass
      ? null
        `## የሁለተኛ ደረጃ አርዕስት ይጨምሩ ። ሚመከረው: Overview, History, Modern Context, References.`,
  });

  // ── 4. Reference links ───────────────────────────────────────────────────
  const refMatches = body.match(/\[.+?\]\(https?:\/\/.+?\)/g) || [];
  const refCount = refMatches.length;
  const refPass = refCount >= MIN_REFERENCES;
  checks.push({
    id: 'references',
    pass: refPass,
    warn: !refPass,
    label: 'ዋቢ ምንጮች',
    detail: `${refCount} ምንጮች`,
    points: refPass ? 20 : Math.floor((refCount / MIN_REFERENCES) * 20),
    maxPoints: 20,
    fix: refPass
      ? null
      :
        `ቢያንስ ${MIN_REFERENCES} ዋቢ ምንጮችን ይጨምሩ ። markdown-formatted links, e.g., [Source Name](https://example.com)`,
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
    label: 'የ AI ባዶ አገላለጾች',
    detail: hollowPass ? 'None' : `${hollowTotal} found`,
    found: foundHollow,
    points: hollowPass ? 10 : Math.max(0, 10 - hollowTotal * 3),
    maxPoints: 10,
    fix: hollowPass
      ? null
      :
        `የሚከተሉትን አገላለጾች ያስወግዱ ወይም ይለዉጡ: ${foundHollow.map((h) => h.label).join(', ')}`,
  });

  // ── 6. Description length ────────────────────────────────────────────────
  const descLen = (frontmatter.description || '').length;
  const descPass = descLen >= DESC_MIN && descLen <= DESC_MAX;
  const descWarn = descLen > 0 && !descPass;
  checks.push({
    id: 'description',
    pass: descPass,
    warn: descWarn,
    label: 'የገለጻ ርዝመት',
    detail:
      descLen === 0
        ?
          'ገለጻ የለም'
        :
          `${descLen} ቃላት (${descPass ? 'በጣም ጥሩ' : descLen < DESC_MIN ? 'በጣም አነሰ' : 'በጣም ረዘመ'})`,
          points: descPass ? 10 : descLen === 0 ? 0 : 5,
          maxPoints: 10,
          fix: descPass
      ? null
      : descLen === 0
        ?
          'የ ገለጻ መስክ ይጨምሩ (50-200 ቃላት ይመከራል)'
        : descLen < DESC_MIN
          ?
            `ገለጻው በጣም አጭር ነው (${descLen} ቃላት) ፤ ወደ ${DESC_MIN}-${DESC_MAX} ይስፋ`
          :
            `ገለጻው በጣም ረጅም ነው (${descLen} ቃላት), ወደ ${DESC_MAX} ይጠር`,
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
  if (pct >= 90) return { emoji: '🟢', label: 'ምርጥ' };
  if (pct >= 70) return { emoji: '🟡', label: 'መሻሻል አለበት' };
  return { emoji: '🔴', label: 'ከፍተኛ ማሻሻያ ያስፈልገዋል' };
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
         const msg = `ጽሁፉ አልተገኘም: "${slug}". Check the slug or run ethiopiamd sync.`;
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
          chalk.bold(`📋 የጽሁፍ ጥራት ምርመራ: ${frontmatter.title || slug}`),
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
        console.log(chalk.bold(`ጠቅላላ ውጤት: ${score}/${total} — ${tierStr}`));
        console.log('');

        if (!opts.fix && checks.some((c) => !c.pass)) {
          console.log(chalk.gray('  ፍንጭ:  የማሻሻያ ሃሳቦችን ለማየት --fix ይጠቀሙ\n'));
        }
      } catch (err) {
        console.error(chalk.red(`\n❌ ምርመራው አልተሳካም: ${err.message}\n`));
        process.exit(1);
      }
    });
}
