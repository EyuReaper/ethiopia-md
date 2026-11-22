/**
 * Browser side of the emoji replacement.
 *
 * The server already swaps emoji for SVGs in the page HTML. This handles text
 * that scripts add later (dashboard panels, filters, search results): it
 * converts new text nodes the same way, using the same rules.
 */
import {
  createEmojiRegex,
  emojiFile,
  replaceable,
} from '../utils/emoji-core.mjs';

const SKIP = new Set([
  'SCRIPT',
  'STYLE',
  'TEXTAREA',
  'OPTION',
  'TITLE',
  'NOSCRIPT',
  'CODE',
  'PRE',
]);

function skipped(node: Node): boolean {
  for (let el = node.parentElement; el; el = el.parentElement) {
    if (SKIP.has(el.tagName) || el.namespaceURI?.endsWith('/svg')) return true;
  }
  return false;
}

function convertTextNode(node: Text): void {
  const text = node.nodeValue ?? '';
  const re = createEmojiRegex();
  const parts: (string | HTMLImageElement)[] = [];
  let last = 0;
  let changed = false;
  for (const m of text.matchAll(re)) {
    const emoji = replaceable(m as unknown as RegExpMatchArray);
    if (!emoji) continue;
    parts.push(text.slice(last, m.index));
    const img = document.createElement('img');
    img.className = 'emoji';
    img.src = `/emoji/${emojiFile(emoji)}.svg`;
    img.alt = emoji;
    img.width = 20;
    img.height = 20;
    img.decoding = 'async';
    img.draggable = false;
    parts.push(img);
    last = (m.index ?? 0) + m[0].length;
    changed = true;
  }
  if (!changed) return;
  parts.push(text.slice(last));
  const frag = document.createDocumentFragment();
  for (const p of parts) {
    if (typeof p === 'string') {
      if (p) frag.append(document.createTextNode(p));
    } else {
      frag.append(p);
    }
  }
  node.replaceWith(frag);
}

function convert(root: Node): void {
  if (root.nodeType === Node.TEXT_NODE) {
    if (!skipped(root)) convertTextNode(root as Text);
    return;
  }
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  const nodes: Text[] = [];
  for (let n = walker.nextNode(); n; n = walker.nextNode()) {
    nodes.push(n as Text);
  }
  for (const n of nodes) if (!skipped(n)) convertTextNode(n);
}

function start(): void {
  convert(document.body);
  new MutationObserver((records) => {
    for (const r of records) r.addedNodes.forEach((n) => convert(n));
  }).observe(document.body, { childList: true, subtree: true });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', start);
} else {
  start();
}
