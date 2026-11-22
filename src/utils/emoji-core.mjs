/**
 * Shared emoji logic: used by the build script (which copies the SVGs), the
 * server-side HTML rewriter (src/middleware.ts) and the browser runtime
 * (src/scripts/emoji-runtime.ts), so all three agree on what an emoji is and
 * which SVG file represents it.
 *
 * Rules:
 *  - An emoji is replaced when it is shown as a picture: it has the emoji
 *    variation selector (U+FE0F), it is emoji-presentation by default, or it
 *    sits in the supplementary pictograph planes. Plain text symbols such as
 *    (c), (r), arrows and a bare check mark are left alone.
 *  - Flags (regional-indicator pairs, e.g. the Ethiopian flag) are kept as
 *    native emoji on purpose.
 *  - File names follow Twemoji: lowercase code points joined by "-", with
 *    U+FE0F removed unless the sequence contains a zero-width joiner.
 */

const UNIT = '\\p{Extended_Pictographic}[\\u{1F3FB}-\\u{1F3FF}]?\\uFE0F?';
const PATTERN = `(\\p{Regional_Indicator}{2})|(${UNIT}(?:\\u200D${UNIT})*)`;

/** A fresh global regex (regexes with the g flag keep state, so never share one). */
export function createEmojiRegex() {
  return new RegExp(PATTERN, 'gu');
}

/** Twemoji file name (without extension) for an emoji string. */
export function emojiFile(str) {
  const hasZwj = str.includes('‍');
  return [...str]
    .map((c) => c.codePointAt(0).toString(16))
    .filter((cp) => hasZwj || cp !== 'fe0f')
    .join('-');
}

/**
 * Decide whether a regex match should be shown as an SVG.
 * @param {RegExpMatchArray} m a match from createEmojiRegex()
 * @returns {string | null} the emoji to replace, or null to leave it as text
 */
export function replaceable(m) {
  if (m[1]) return null; // flag: keep native
  const str = m[2];
  const first = str.codePointAt(0);
  if (str.includes('️')) return str;
  if (first >= 0x1f000) return str;
  if (/\p{Emoji_Presentation}/u.test(String.fromCodePoint(first))) return str;
  return null;
}

/** All replaceable emoji in a piece of text. */
export function findEmoji(text) {
  const out = [];
  for (const m of text.matchAll(createEmojiRegex())) {
    const e = replaceable(m);
    if (e) out.push(e);
  }
  return out;
}

const escapeAttr = (s) =>
  s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');

/** The markup that stands in for one emoji. */
export function emojiImg(str) {
  return `<img class="emoji" src="/emoji/${emojiFile(str)}.svg" alt="${escapeAttr(str)}" width="20" height="20" decoding="async" draggable="false">`;
}

/** Replace emoji in plain text (a text node's content) with <img> markup. */
export function replaceEmojiInText(text) {
  return text.replace(createEmojiRegex(), (match, flag, seq) => {
    const e = replaceable([match, flag, seq]);
    return e ? emojiImg(e) : match;
  });
}

// Elements whose text must stay plain text: an image cannot go inside them.
const RAW = 'script|style|textarea|title';
const SKIP = new Set(['option', 'svg', 'noscript', 'code', 'pre']);
const TOKEN = new RegExp(
  `<!--[\\s\\S]*?-->|<(${RAW})\\b(?:[^>"']|"[^"]*"|'[^']*')*>[\\s\\S]*?<\\/\\1\\s*>|<(?:[^>"']|"[^"]*"|'[^']*')*>|[^<]+|<`,
  'gi',
);

/**
 * Replace emoji in the text nodes of an HTML document. Tags, attributes,
 * comments, scripts, styles, <title>, <option> and similar are never touched.
 */
export function replaceEmojiInHtml(html) {
  let depth = 0;
  const open = [];
  return html.replace(TOKEN, (tok) => {
    if (tok[0] !== '<') return depth ? tok : replaceEmojiInText(tok);
    if (tok.startsWith('<!--')) return tok;
    const tag = /^<(\/?)([a-zA-Z][a-zA-Z0-9-]*)/.exec(tok);
    if (!tag) return tok;
    const [, closing, nameRaw] = tag;
    const name = nameRaw.toLowerCase();
    if (SKIP.has(name)) {
      if (closing) {
        const i = open.lastIndexOf(name);
        if (i >= 0) {
          open.splice(i, 1);
          depth = open.length;
        }
      } else if (!tok.endsWith('/>')) {
        open.push(name);
        depth = open.length;
      }
    }
    return tok;
  });
}
