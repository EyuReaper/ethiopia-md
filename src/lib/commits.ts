import type { Lang } from '../types';

export interface Commit {
  hash: string;
  date: string;
  message: string;
}

export async function fetchRecentCommits(perPage = 5): Promise<Commit[]> {
  try {
    const res = await fetch(
      `https://api.github.com/repos/frank890417/ethiopia-md/commits?per_page=${perPage}`,
    );
    if (res.ok) {
      const data = await res.json();
      return data.map((c: any) => ({
        hash: c.sha,
        date: c.commit.author.date,
        message: c.commit.message.split('\n')[0],
      }));
    }
  } catch {
    // silently fail
  }
  return [];
}

export function commitIcon(msg: string): string {
  if (msg.startsWith('feat')) return '✨';
  if (msg.startsWith('fix')) return '🐛';
  if (msg.startsWith('content')) return '📝';
  if (msg.startsWith('docs')) return '📖';
  return '📌';
}

export function timeAgo(dateStr: string, lang: Lang): string {
  const now = new Date();
  const then = new Date(dateStr);
  const diff = Math.floor((now.getTime() - then.getTime()) / 1000);

  if (lang === 'am') {
    if (diff < 3600) return `${Math.floor(diff / 60)} [Amharic translation needed - original Taiwan context]`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} [Amharic translation needed - original Taiwan context]`;
    if (diff < 604800) return `${Math.floor(diff / 86400)} [Amharic translation needed - original Taiwan context]`;
    return then.toLocaleDateString('am', { month: 'short', day: 'numeric' });
  }

  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
  return then.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}
