#!/usr/bin/env node
/**
 * One-off (re-runnable) triage pass over knowledge/.
 *
 * Sets `status: archived` in frontmatter on every article NOT in the curated
 * "Tranche 1" core (12 category Hub files + up to 2 flagship articles per
 * category), and `status: draft` on the curated-core articles themselves
 * (until they're rewritten with genuine Ethiopia content and flipped to
 * `published` by hand). This reflects the corpus-triage decision: most of
 * knowledge/ is still Taiwan.md content wearing Ethiopia branding and
 * shouldn't be served as published content until rewritten.
 *
 * Curated-core selection is root/`am` only (Hub files + featured-flagged
 * articles only exist there) — everything under knowledge/en, knowledge/es,
 * knowledge/ja is archived, since none of it corresponds 1:1 to the (not yet
 * written) new Ethiopia topics the curated-core slots will cover.
 *
 * Usage:
 *   node scripts/tools/triage-status.mjs           # dry run, prints counts
 *   node scripts/tools/triage-status.mjs --apply     # writes frontmatter changes
 */
import { readFileSync, writeFileSync } from 'fs';
import { readdirSync, statSync } from 'fs';
import { join, relative } from 'path';

const ROOT = process.cwd();
const KNOWLEDGE = join(ROOT, 'knowledge');
const APPLY = process.argv.includes('--apply');

const CURATED_CORE_PATH = join(ROOT, 'scripts/tools/.curated-core.json');

let curated;
try {
  curated = JSON.parse(readFileSync(CURATED_CORE_PATH, 'utf-8'));
} catch {
  console.error(
    `Missing ${CURATED_CORE_PATH} — run the curated-core selection first.`,
  );
  process.exit(1);
}

// Set of repo-relative knowledge/-prefixed paths that must stay draft/published (never archived)
const keepPaths = new Set();
for (const h of curated.hub_files) keepPaths.add(join(h.category, h.file));
for (const f of curated.flagship_articles)
  keepPaths.add(join(f.category, f.file));

function walk(dir) {
  let out = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const st = statSync(full);
    if (st.isDirectory()) out = out.concat(walk(full));
    else if (entry.endsWith('.md') && !entry.startsWith('_')) out.push(full);
  }
  return out;
}

function setStatus(filePath, newStatus) {
  const raw = readFileSync(filePath, 'utf-8');
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) return { changed: false, reason: 'no frontmatter' };
  let [, fm, body] = match;
  const statusLineRe = /^status:.*$/m;
  let newFm;
  let currentStatus = null;
  const cur = fm.match(statusLineRe);
  if (cur) currentStatus = cur[0].replace(/^status:\s*/, '').trim();
  if (currentStatus === newStatus)
    return { changed: false, reason: 'already set' };
  if (cur) {
    newFm = fm.replace(statusLineRe, `status: ${newStatus}`);
  } else {
    newFm = fm.replace(/\n?$/, `\nstatus: ${newStatus}`);
  }
  const newRaw = `---\n${newFm}\n---\n${body}`;
  if (APPLY) writeFileSync(filePath, newRaw, 'utf-8');
  return { changed: true, from: currentStatus, to: newStatus };
}

const allFiles = walk(KNOWLEDGE);
let archived = 0;
let draftSet = 0;
let alreadyOk = 0;
let noFrontmatter = 0;

for (const full of allFiles) {
  const rel = relative(KNOWLEDGE, full); // e.g. "History/founder.md" or "en/History/x.md"
  const isCurated = keepPaths.has(rel);
  const targetStatus = isCurated ? 'draft' : 'archived';
  const result = setStatus(full, targetStatus);
  if (!result.changed) {
    if (result.reason === 'no frontmatter') noFrontmatter++;
    else alreadyOk++;
    continue;
  }
  if (targetStatus === 'archived') archived++;
  else draftSet++;
}

console.log(`Scanned ${allFiles.length} articles.`);
console.log(`  -> archived: ${archived}`);
console.log(`  -> set to draft (curated core): ${draftSet}`);
console.log(`  -> already correct: ${alreadyOk}`);
console.log(`  -> skipped (no frontmatter): ${noFrontmatter}`);
if (!APPLY)
  console.log('\nDry run only. Re-run with --apply to write changes.');
