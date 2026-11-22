#!/usr/bin/env node
/**
 * Post-build check for the emoji -> SVG replacement.
 *
 * Fails if, in the built site (dist/):
 *   1. a page still has an emoji in its text that should have become an SVG, or
 *   2. a page references /emoji/<file>.svg and that file is missing from dist/.
 *
 * Emoji in <title>, <option>, meta tags, scripts, code and similar places stay
 * as text on purpose (an image cannot go there), and flags are kept native.
 * Usage: node scripts/utils/check-emoji-svg.mjs   (run by "postbuild")
 */
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { findEmoji, replaceEmojiInHtml } from '../../src/utils/emoji-core.mjs';

const DIST = 'dist';
if (!existsSync(DIST)) {
  console.error('No dist/ folder. Run "npm run build" first.');
  process.exit(1);
}

function pages(dir) {
  return readdirSync(dir).flatMap((n) => {
    const p = join(dir, n);
    return statSync(p).isDirectory()
      ? pages(p)
      : p.endsWith('.html')
        ? [p]
        : [];
  });
}

const leftovers = [];
const missing = new Set();
let imgs = 0;
for (const file of pages(DIST)) {
  const html = readFileSync(file, 'utf8');
  // The same rewriter the site uses: if it would still change the page, some
  // replaceable emoji is left in the text.
  const again = replaceEmojiInHtml(html);
  if (again !== html) {
    const left = findEmoji(html.replace(/<[^>]*>/g, ' ')).slice(0, 3);
    leftovers.push(`${file.replace(`${DIST}/`, '')}: ${left.join(' ')}`);
  }
  for (const m of html.matchAll(/\/emoji\/([0-9a-f-]+)\.svg/g)) {
    imgs++;
    if (!existsSync(join(DIST, 'emoji', `${m[1]}.svg`))) missing.add(m[1]);
  }
}

console.log(
  `Emoji SVGs: ${imgs} image references across ${pages(DIST).length} pages.`,
);
let failed = false;
if (leftovers.length) {
  failed = true;
  console.error(`\n${leftovers.length} page(s) still show an emoji as text:`);
  for (const l of leftovers.slice(0, 15)) console.error('  ' + l);
}
if (missing.size) {
  failed = true;
  console.error(
    `\nMissing SVG files in dist/emoji: ${[...missing].join(', ')}`,
  );
}
if (failed) process.exit(1);
console.log('All website emoji are shown as SVG.');
