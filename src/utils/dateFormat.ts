import type { Lang } from '../types';

/**
 * Formats a date, using the Ethiopian calendar (native Intl `ethiopic`
 * calendar — real month names, correct Meskerem/Pagume year rollover at the
 * Ethiopian New Year) when lang is 'am', Gregorian otherwise.
 *
 * Do not use this for machine-readable dates (RSS pubDate, JSON-LD
 * datePublished, sitemap lastmod, etc.) — those must stay Gregorian/ISO
 * regardless of site language.
 */
export function formatDate(
  date: Date | string | number,
  lang: Lang,
  options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  },
): string {
  const d = date instanceof Date ? date : new Date(date);
  const locale = lang === 'am' ? 'am-ET-u-ca-ethiopic' : 'en-US';
  return d.toLocaleDateString(locale, options);
}

/** Same as formatDate, but includes a time-of-day (hour/minute). */
export function formatDateTime(
  date: Date | string | number,
  lang: Lang,
  options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  },
): string {
  const d = date instanceof Date ? date : new Date(date);
  const locale = lang === 'am' ? 'am-ET-u-ca-ethiopic' : 'en-US';
  return d.toLocaleString(locale, options);
}

/** Time-of-day only (calendar system doesn't affect this, but keep locale consistent). */
export function formatTime(
  date: Date | string | number,
  lang: Lang,
  options: Intl.DateTimeFormatOptions = { hour: '2-digit', minute: '2-digit' },
): string {
  const d = date instanceof Date ? date : new Date(date);
  const locale = lang === 'am' ? 'am-ET' : 'en-US';
  return d.toLocaleTimeString(locale, options);
}
