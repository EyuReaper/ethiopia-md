#!/usr/bin/env node
/**
 * Renames knowledge/<Category>/<chinese-filename>.md files (leftovers from the
 * Taiwan.md fork) to the English slug already used by their paired translation
 * in knowledge/_translations.json, via `git mv` (so history is preserved).
 *
 * Replaces the old rename_am_files.py, which had a hardcoded path that didn't
 * exist in this repo and only covered 55 of ~457 Chinese-named files. This
 * script derives renames mechanically from _translations.json instead of a
 * hand-written term dictionary.
 *
 * Usage:
 *   node scripts/utils/rename-am-files.mjs           # dry run, prints the plan
 *   node scripts/utils/rename-am-files.mjs --apply    # actually renames + updates _translations.json
 */
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { execFileSync } from 'child_process';
import { resolve, dirname, basename } from 'path';

const ROOT = resolve(import.meta.dirname, '../..');
const TRANSLATIONS_PATH = resolve(ROOT, 'knowledge/_translations.json');
const APPLY = process.argv.includes('--apply');

const CJK = /[㐀-鿿]/;

const translations = JSON.parse(readFileSync(TRANSLATIONS_PATH, 'utf-8'));

// am_path (relative to knowledge/) -> best en_path candidate (prefer 'en/')
const amToEn = new Map();
for (const [enOrOtherPath, amPath] of Object.entries(translations)) {
  if (!enOrOtherPath.startsWith('en/')) continue; // only en/ slugs are used for renaming
  const existing = amToEn.get(amPath);
  if (!existing) amToEn.set(amPath, enOrOtherPath);
}

const plan = []; // { from, to }
const skipped = []; // { amPath, reason }
const targetCounts = new Map();

for (const [amPath, enPath] of amToEn) {
  const base = basename(amPath);
  if (!CJK.test(base)) continue; // already has a clean slug

  const enSlug = basename(enPath, '.md');
  const dir = dirname(amPath); // e.g. "About", "resources"
  const newAmPath = `${dir}/${enSlug}.md`;

  targetCounts.set(newAmPath, (targetCounts.get(newAmPath) || 0) + 1);
  plan.push({ from: amPath, to: newAmPath });
}

// Drop any plan entries whose target collides with another planned target
const finalPlan = [];
for (const entry of plan) {
  if (targetCounts.get(entry.to) > 1) {
    skipped.push({
      amPath: entry.from,
      reason: `target collision: ${entry.to}`,
    });
    continue;
  }
  const fromFull = resolve(ROOT, 'knowledge', entry.from);
  const toFull = resolve(ROOT, 'knowledge', entry.to);
  if (!existsSync(fromFull)) {
    skipped.push({ amPath: entry.from, reason: 'source file missing on disk' });
    continue;
  }
  if (existsSync(toFull)) {
    skipped.push({
      amPath: entry.from,
      reason: `target already exists: ${entry.to}`,
    });
    continue;
  }
  finalPlan.push(entry);
}

console.log(`Plan: ${finalPlan.length} renames, ${skipped.length} skipped\n`);

if (!APPLY) {
  for (const { from, to } of finalPlan.slice(0, 20)) {
    console.log(`  ${from}  ->  ${to}`);
  }
  if (finalPlan.length > 20)
    console.log(`  ... and ${finalPlan.length - 20} more`);
  if (skipped.length) {
    console.log('\nSkipped:');
    for (const { amPath, reason } of skipped)
      console.log(`  ${amPath}: ${reason}`);
  }
  console.log('\nDry run only. Re-run with --apply to execute.');
  process.exit(0);
}

let renamed = 0;
for (const { from, to } of finalPlan) {
  const fromFull = resolve(ROOT, 'knowledge', from);
  const toFull = resolve(ROOT, 'knowledge', to);
  execFileSync('git', ['mv', fromFull, toFull], { cwd: ROOT });
  renamed++;
}
console.log(`Renamed ${renamed} files via git mv.`);

// Update _translations.json values to the new filenames
let updated = 0;
for (const [key, amPath] of Object.entries(translations)) {
  const match = finalPlan.find((p) => p.from === amPath);
  if (match) {
    translations[key] = match.to;
    updated++;
  }
}
const sorted = Object.fromEntries(
  Object.entries(translations).sort(([a], [b]) => a.localeCompare(b)),
);
writeFileSync(
  TRANSLATIONS_PATH,
  JSON.stringify(sorted, null, 2) + '\n',
  'utf-8',
);
console.log(`Updated ${updated} _translations.json values.`);

if (skipped.length) {
  console.log(
    `\n${skipped.length} files left with Chinese filenames (no clean 1:1 English pairing):`,
  );
  for (const { amPath, reason } of skipped)
    console.log(`  ${amPath}: ${reason}`);
}
