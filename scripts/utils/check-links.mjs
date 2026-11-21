#!/usr/bin/env node
/**
 * Link checker for knowledge/ articles.
 *
 * Extracts every http(s) URL from the Markdown files under knowledge/ (body
 * text and the `sources:` frontmatter list), de-duplicates them, and requests
 * each one once. It identifies itself honestly in the User-Agent and does not
 * try to get around bot blocking.
 *
 * Result classes:
 *   OK       2xx, or a 3xx that resolves to a 2xx
 *   BLOCKED  401 / 403 / 429 / 999: the site refuses automated clients, so the
 *            link may be fine in a browser; check these by hand
 *   DEAD     404 / 410
 *   ERROR    DNS failure, timeout, TLS error, 5xx, anything else
 *
 * Usage: node scripts/utils/check-links.mjs [--out report.md] [--dir knowledge]
 * Exit code: 1 if any DEAD or ERROR link is found, otherwise 0.
 */
import { readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { join, relative } from 'node:path';

const args = process.argv.slice(2);
const opt = (name, fallback) => {
  const i = args.indexOf(name);
  return i >= 0 && args[i + 1] ? args[i + 1] : fallback;
};
const ROOT = opt('--dir', 'knowledge');
const OUT = opt('--out', '');
const TIMEOUT_MS = 15000;
const CONCURRENCY = 8;
const PER_HOST_DELAY_MS = 400;
const USER_AGENT = 'Ethiopia.md-LinkChecker/1.0 (+https://ethiopia.md)';

// Hosts that never answer automated checks usefully; skipped, not judged.
const SKIP = [
  /^https?:\/\/(www\.)?(linkedin|facebook|instagram|x|twitter)\.com\//,
];

function walk(dir) {
  return readdirSync(dir).flatMap((name) => {
    const p = join(dir, name);
    return statSync(p).isDirectory() ? walk(p) : p.endsWith('.md') ? [p] : [];
  });
}

function clean(url) {
  let u = url.replace(/[.,;:!?'"]+$/, '');
  // Drop an unbalanced trailing ")" (Markdown link close) but keep balanced ones.
  while (
    u.endsWith(')') &&
    (u.match(/\(/g) || []).length < (u.match(/\)/g) || []).length
  ) {
    u = u.slice(0, -1);
  }
  return u;
}

const found = new Map(); // url -> Set of files
for (const file of walk(ROOT)) {
  const text = readFileSync(file, 'utf8');
  for (const m of text.matchAll(/https?:\/\/[^\s<>"'\]\[\u1360-\u137C]+/g)) {
    const url = clean(m[0]);
    if (!found.has(url)) found.set(url, new Set());
    found.get(url).add(relative('.', file));
  }
}

const urls = [...found.keys()].filter((u) => !SKIP.some((re) => re.test(u)));
console.log(
  `Checking ${urls.length} unique URLs from ${ROOT}/ (concurrency ${CONCURRENCY})\n`,
);

const lastHit = new Map();
async function politeWait(host) {
  const now = Date.now();
  const next = Math.max(now, (lastHit.get(host) || 0) + PER_HOST_DELAY_MS);
  lastHit.set(host, next);
  if (next > now) await new Promise((r) => setTimeout(r, next - now));
}

async function request(url, method) {
  const ctl = new AbortController();
  const t = setTimeout(() => ctl.abort(), TIMEOUT_MS);
  try {
    return await fetch(url, {
      method,
      redirect: 'follow',
      signal: ctl.signal,
      headers: { 'User-Agent': USER_AGENT, Accept: 'text/html,*/*' },
    });
  } finally {
    clearTimeout(t);
  }
}

async function check(url) {
  let r = await checkOnce(url);
  // One retry for transient failures (timeouts, resets, 5xx).
  if (r.cls === 'ERROR') {
    await new Promise((res) => setTimeout(res, 1500));
    r = await checkOnce(url);
  }
  return r;
}

async function checkOnce(url) {
  const host = new URL(url).host;
  await politeWait(host);
  try {
    let res = await request(url, 'HEAD');
    // Some servers reject HEAD; retry once with GET before judging.
    if ([403, 404, 405, 501].includes(res.status)) {
      await politeWait(host);
      res = await request(url, 'GET');
    }
    const s = res.status;
    if (s >= 200 && s < 400) return { url, cls: 'OK', detail: `HTTP ${s}` };
    if ([401, 403, 429, 999].includes(s))
      return { url, cls: 'BLOCKED', detail: `HTTP ${s}` };
    if (s === 404 || s === 410)
      return { url, cls: 'DEAD', detail: `HTTP ${s}` };
    return { url, cls: 'ERROR', detail: `HTTP ${s}` };
  } catch (e) {
    const why = e?.cause?.code || e?.name || String(e);
    return { url, cls: 'ERROR', detail: why };
  }
}

const results = [];
let next = 0;
async function worker() {
  while (next < urls.length) {
    const i = next++;
    const r = await check(urls[i]);
    results.push(r);
    if (r.cls !== 'OK')
      console.log(`${r.cls.padEnd(7)} ${r.detail.padEnd(14)} ${r.url}`);
  }
}
await Promise.all(Array.from({ length: CONCURRENCY }, worker));

const by = (c) => results.filter((r) => r.cls === c);
const lines = [];
lines.push(
  '# Link check report',
  '',
  `Checked ${results.length} unique URLs on ${new Date().toISOString()}.`,
  '',
);
lines.push(
  `- OK: ${by('OK').length}`,
  `- BLOCKED (check by hand in a browser): ${by('BLOCKED').length}`,
  `- DEAD: ${by('DEAD').length}`,
  `- ERROR: ${by('ERROR').length}`,
  '',
);
for (const c of ['DEAD', 'ERROR', 'BLOCKED']) {
  if (!by(c).length) continue;
  lines.push(`## ${c}`, '');
  for (const r of by(c).sort((a, b) => a.url.localeCompare(b.url))) {
    lines.push(`- ${r.url} (${r.detail})`);
    for (const f of [...found.get(r.url)].sort()) lines.push(`  - ${f}`);
  }
  lines.push('');
}
const report = lines.join('\n');
console.log(
  `\nOK ${by('OK').length}  BLOCKED ${by('BLOCKED').length}  DEAD ${by('DEAD').length}  ERROR ${by('ERROR').length}`,
);
if (OUT) {
  writeFileSync(OUT, report);
  console.log(`Report written to ${OUT}`);
}
process.exit(by('DEAD').length || by('ERROR').length ? 1 : 0);
