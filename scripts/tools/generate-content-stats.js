import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';
import matter from 'gray-matter';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const knowledgeDir = path.join(__dirname, '../..', 'knowledge');

// 分類統計 (root/am only — unchanged from before)
const categories = {};
function scan(dir, cat = '') {
  for (const f of fs.readdirSync(dir)) {
    const full = path.join(dir, f);
    if (fs.statSync(full).isDirectory()) {
      if (!f.startsWith('_') && f !== 'en' && f !== 'about') scan(full, f);
    } else if (f.endsWith('.md') && !f.startsWith('_')) {
      const c = cat || 'root';
      categories[c] = (categories[c] || 0) + 1;
    }
  }
}
scan(knowledgeDir);

// Triage status breakdown (published/draft/archived), overall and per
// top-level tier (am = root SSOT, en, es, ja). Separate pass from the
// category counter above so it doesn't change that counter's existing
// root-only semantics.
const triageStatus = { published: 0, draft: 0, archived: 0, unspecified: 0 };
const triageStatusByTier = {};

function bumpTriage(tier, status) {
  const key =
    status === 'draft' || status === 'archived'
      ? status
      : status === 'published' || !status
        ? 'published'
        : 'unspecified';
  triageStatus[key]++;
  triageStatusByTier[tier] ??= {
    published: 0,
    draft: 0,
    archived: 0,
    unspecified: 0,
  };
  triageStatusByTier[tier][key]++;
}

function scanTriage(dir, tier) {
  for (const f of fs.readdirSync(dir)) {
    const full = path.join(dir, f);
    if (fs.statSync(full).isDirectory()) {
      if (f === 'en' || f === 'es' || f === 'ja') scanTriage(full, f);
      else if (!f.startsWith('_') && f !== 'about') scanTriage(full, tier);
    } else if (f.endsWith('.md') && !f.startsWith('_')) {
      try {
        const { data } = matter(fs.readFileSync(full, 'utf-8'));
        bumpTriage(tier, data.status);
      } catch {
        bumpTriage(tier, undefined);
      }
    }
  }
}
scanTriage(knowledgeDir, 'am');

// 每日新增（從 git log）
let dailyGrowth = [];
try {
  const log = execSync(
    'git log --format="%ai" --diff-filter=A -- "knowledge/*.md" "knowledge/**/*.md" | cut -d" " -f1 | sort | uniq -c | sort -k2',
    { cwd: path.join(__dirname, '../..'), encoding: 'utf-8' },
  );
  dailyGrowth = log
    .trim()
    .split('\n')
    .filter(Boolean)
    .map((line) => {
      const [count, date] = line.trim().split(/\s+/);
      return { date, count: parseInt(count) };
    });
} catch (e) {
  console.error('Git log failed:', e.message);
}

const stats = {
  categories,
  triageStatus,
  triageStatusByTier,
  dailyGrowth,
  updated: new Date().toISOString().slice(0, 10),
};
// NOTE: previously wrote to scripts/src/data/ (a path bug — nothing reads
// that location). The template that actually renders this data imports
// from src/data/content-stats.json, so that's the real output path.
const out = path.join(__dirname, '../..', 'src', 'data', 'content-stats.json');
fs.writeFileSync(out, JSON.stringify(stats, null, 2));
console.log('✅ content-stats.json generated (with triage status breakdown)');
