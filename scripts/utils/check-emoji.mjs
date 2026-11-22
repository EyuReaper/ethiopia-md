#!/usr/bin/env node
/**
 * Emoji consistency check.
 *
 * The canonical emoji for each category is the `icon:` in src/utils/categoryConfig.ts.
 * This script scans src/ (not src/content/) for places that pair a category with an
 * emoji and reports any that differ from the canonical one, plus emojis that read as
 * East Asian rather than Ethiopian (a leftover of the Taiwan fork).
 *
 * Checked patterns:
 *   1. object entries         `food: '🫓 Food'`
 *   2. i18n form labels       `'contribute.form.category.food': '🫓 Food'`
 *   3. category links         `<a href="/food" ...>🫓 Food</a>`
 *   4. nav/config objects     `path: translatePath('/food'), ... emoji: '🫓'`
 *
 * Usage: node scripts/utils/check-emoji.mjs      (exit code 1 if anything is wrong)
 */
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const CATEGORIES = [
  'history',
  'geography',
  'culture',
  'food',
  'art',
  'music',
  'technology',
  'nature',
  'people',
  'society',
  'economy',
  'lifestyle',
  'language',
];

// Emojis that read as East Asian / Taiwan-coded; not used for anything here.
const OFF_THEME = [
  '🍜',
  '🧋',
  '🏮',
  '🥢',
  '🍱',
  '🥟',
  '🏯',
  '🎎',
  '🎋',
  '🐉',
  '🍥',
  '🍙',
];

const EMOJI = /\p{Extended_Pictographic}️?/u;
const norm = (e) => e.replace(/️/g, '');

// ── canonical map from categoryConfig.ts ────────────────────────────────────
const cfg = readFileSync('src/utils/categoryConfig.ts', 'utf8');
const canonical = {};
for (const key of CATEGORIES) {
  const m = cfg.match(
    new RegExp(`^  ${key}: \\{[\\s\\S]*?icon:\\s*'([^']+)'`, 'm'),
  );
  if (!m) {
    console.error(`No icon for "${key}" in src/utils/categoryConfig.ts`);
    process.exit(2);
  }
  canonical[key] = m[1];
}

function walk(dir) {
  return readdirSync(dir).flatMap((name) => {
    const p = join(dir, name);
    if (p === 'src/content') return [];
    return statSync(p).isDirectory()
      ? walk(p)
      : /\.(ts|astro)$/.test(p)
        ? [p]
        : [];
  });
}

const problems = [];
const bad = (file, line, msg) => problems.push(`${file}:${line}: ${msg}`);
const keyRe = CATEGORIES.join('|');

for (const file of walk('src')) {
  const lines = readFileSync(file, 'utf8').split('\n');
  lines.forEach((text, i) => {
    const n = i + 1;
    // off-theme emojis anywhere
    for (const e of OFF_THEME) {
      if (text.includes(e)) bad(file, n, `off-theme emoji ${e}`);
    }
    // 1. object entries and 2. i18n form labels
    let m = text.match(
      new RegExp(
        `(?:^|[\\s'"])(?:contribute\\.form\\.category\\.)?(${keyRe})'?:\\s*'(${EMOJI.source})`,
        'u',
      ),
    );
    if (m && norm(m[2]) !== norm(canonical[m[1]])) {
      bad(file, n, `${m[1]} uses ${m[2]}, expected ${canonical[m[1]]}`);
    }
    // 3. category links
    m = text.match(
      new RegExp(`href="/(?:en/)?(${keyRe})"[^>]*>\\s*(${EMOJI.source})`, 'u'),
    );
    if (m && norm(m[2]) !== norm(canonical[m[1]])) {
      bad(
        file,
        n,
        `link to /${m[1]} uses ${m[2]}, expected ${canonical[m[1]]}`,
      );
    }
    // 3b. category links whose emoji sits on a following line (e.g. a footer icon span)
    m = text.match(new RegExp(`<a href="/(?:en/)?(${keyRe})"[^>]*>\\s*$`));
    if (m) {
      for (let j = i + 1; j < Math.min(i + 4, lines.length); j++) {
        const em = lines[j].match(
          new RegExp(`>\\s*(${EMOJI.source})\\s*<`, 'u'),
        );
        if (em) {
          if (norm(em[1]) !== norm(canonical[m[1]])) {
            bad(
              file,
              j + 1,
              `link to /${m[1]} uses ${em[1]}, expected ${canonical[m[1]]}`,
            );
          }
          break;
        }
      }
    }
    // 4. nav/config objects: path ... emoji within the next 4 lines
    m = text.match(new RegExp(`translatePath\\('/(${keyRe})'\\)`));
    if (m) {
      for (let j = i; j < Math.min(i + 5, lines.length); j++) {
        const em = lines[j].match(
          new RegExp(`emoji:\\s*'(${EMOJI.source})'`, 'u'),
        );
        if (em) {
          if (norm(em[1]) !== norm(canonical[m[1]])) {
            bad(
              file,
              j + 1,
              `${m[1]} nav entry uses ${em[1]}, expected ${canonical[m[1]]}`,
            );
          }
          break;
        }
      }
    }
  });
}

console.log('Canonical emojis (src/utils/categoryConfig.ts):');
console.log('  ' + CATEGORIES.map((k) => `${k} ${canonical[k]}`).join('  '));
if (problems.length) {
  console.log(`\n${problems.length} problem(s):`);
  for (const p of problems) console.log('  ' + p);
  process.exit(1);
}
console.log('\nAll category emojis are consistent.');
