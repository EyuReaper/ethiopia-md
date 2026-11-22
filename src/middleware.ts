import { defineMiddleware } from 'astro:middleware';
import { replaceEmojiInHtml } from './utils/emoji-core.mjs';

/**
 * Shows every emoji in the page text as its SVG (public/emoji/*.svg).
 *
 * Runs on each HTML response, in `astro dev` and while the static site is
 * built, so components, translated strings and rendered Markdown are all
 * covered with no flash and no JavaScript. Emoji in <title>, <option>, meta
 * tags, scripts and other places that cannot hold an image stay as text.
 */
export const onRequest = defineMiddleware(async (_context, next) => {
  const response = await next();
  if (!response.headers.get('content-type')?.includes('text/html')) {
    return response;
  }
  const html = await response.text();
  return new Response(replaceEmojiInHtml(html), {
    status: response.status,
    statusText: response.statusText,
    headers: response.headers,
  });
});
