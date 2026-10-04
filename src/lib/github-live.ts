import {
  githubSummary,
  social,
  type GitHubSummary,
} from "@/config/portfolio-data";

/**
 * Live GitHub numbers for the Stats section, fetched on the server and cached
 * by the /api/github-stats route. Every piece falls back to the snapshot in
 * portfolio-data.ts on its own, so a GitHub outage or rate limit never breaks
 * the section. Set GITHUB_TOKEN (any token, no scopes) to raise the rate limit.
 */

const USER = social.githubUsername;
const API = "https://api.github.com";
/** Public mirror of the contribution calendar on github.com/<user>. */
const CONTRIBUTIONS_API = `https://github-contributions-api.jogruber.de/v4/${USER}?y=all`;
export const REVALIDATE_SECONDS = 3600;

/** Colours GitHub uses for languages that show up in these repos. */
const LANGUAGE_COLORS: Record<string, string> = {
  TypeScript: "#3178c6",
  JavaScript: "#f1e05a",
  PHP: "#4F5D95",
  CSS: "#563d7c",
  HTML: "#e34c26",
  Java: "#b07219",
  "C#": "#178600",
  Python: "#3572A5",
  Dart: "#00B4AB",
  SCSS: "#c6538c",
  Shell: "#89e051",
};

type Repo = {
  name: string;
  fork: boolean;
  stargazers_count: number;
  languages_url: string;
};

async function getJson<T>(url: string, auth = true): Promise<T> {
  const token = process.env.GITHUB_TOKEN;
  const res = await fetch(url, {
    headers: {
      Accept: "application/vnd.github+json",
      ...(auth && token ? { Authorization: `Bearer ${token}` } : {}),
    },
    next: { revalidate: REVALIDATE_SECONDS },
  });
  if (!res.ok) throw new Error(`${url} -> ${res.status}`);
  return res.json() as Promise<T>;
}

const searchCount = (q: string) =>
  getJson<{ total_count: number }>(
    `${API}/search/issues?per_page=1&q=${encodeURIComponent(`author:${USER} ${q}`)}`,
  ).then((r) => r.total_count);

/** Resolves to the value, or to `fallback` if the request failed. */
const orFallback = <T>(p: Promise<T>, fallback: T, label: string) =>
  p.catch((err) => {
    console.warn(`GitHub stats: ${label} unavailable, using snapshot`, err);
    return fallback;
  });

export type LiveGitHubStats = {
  summary: GitHubSummary;
  days: Record<string, number>;
  live: boolean;
  fetchedAt: string;
};

export async function fetchLiveGitHubStats(
  snapshotDays: Record<string, number>,
): Promise<LiveGitHubStats> {
  const [user, repos, contributions, prs, issues] = await Promise.all([
    orFallback(
      getJson<{ followers: number; public_repos: number; created_at: string }>(`${API}/users/${USER}`),
      null,
      "profile",
    ),
    orFallback(getJson<Repo[]>(`${API}/users/${USER}/repos?per_page=100&type=owner`), null, "repos"),
    orFallback(
      getJson<{ total: Record<string, number>; contributions: { date: string; count: number }[] }>(
        CONTRIBUTIONS_API,
        false,
      ),
      null,
      "contributions",
    ),
    orFallback(
      Promise.all([
        searchCount("type:pr is:open"),
        searchCount("type:pr is:merged"),
        searchCount("type:pr is:closed is:unmerged"),
      ]),
      null,
      "pull requests",
    ),
    orFallback(
      Promise.all([searchCount("type:issue is:open"), searchCount("type:issue is:closed")]),
      null,
      "issues",
    ),
  ]);

  const languages = repos
    ? await orFallback(topLanguages(repos), null, "languages")
    : null;

  const s: GitHubSummary = structuredClone(githubSummary);
  const days = contributions
    ? Object.fromEntries(
        contributions.contributions.filter((c) => c.count > 0).map((c) => [c.date, c.count]),
      )
    : snapshotDays;

  if (user) {
    s.joinYear = new Date(user.created_at).getUTCFullYear();
    s.followers = user.followers;
    s.totalRepositories = user.public_repos;
  }
  if (repos) {
    const owned = repos.filter((r) => !r.fork).length;
    s.originalRepos = owned;
    s.forkedRepos = repos.length - owned;
    s.totalStars = repos.reduce((sum, r) => sum + r.stargazers_count, 0);
  }
  if (prs) s.pullRequests = { open: prs[0], merged: prs[1], closed: prs[2] };
  if (issues) s.issues = { open: issues[0], closed: issues[1] };
  if (languages) s.topLanguages = languages;
  if (contributions) Object.assign(s, streaks(days));

  return {
    summary: s,
    days,
    live: Boolean(user && repos && contributions),
    fetchedAt: new Date().toISOString(),
  };
}

/** Byte share of each language across the user's own repos, top 5. */
async function topLanguages(repos: Repo[]) {
  const perRepo = await Promise.all(
    repos.filter((r) => !r.fork).map((r) => getJson<Record<string, number>>(r.languages_url)),
  );
  const bytes: Record<string, number> = {};
  for (const langs of perRepo)
    for (const [name, n] of Object.entries(langs)) bytes[name] = (bytes[name] ?? 0) + n;
  const total = Object.values(bytes).reduce((a, b) => a + b, 0) || 1;
  return Object.entries(bytes)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([name, n]) => ({
      name,
      color: LANGUAGE_COLORS[name] ?? "#8b949e",
      percentage: Math.round((n / total) * 1000) / 10,
    }));
}

/** Streaks, best day, last-12-months total and last-7-days delta. */
function streaks(days: Record<string, number>) {
  const dayMs = 86_400_000;
  const today = new Date(new Date().toISOString().slice(0, 10)).getTime();
  const key = (t: number) => new Date(t).toISOString().slice(0, 10);
  const dates = Object.keys(days).sort();

  let longest = 0;
  let run = 0;
  let prev = 0;
  for (const d of dates) {
    const t = new Date(d).getTime();
    run = prev && t - prev === dayMs ? run + 1 : 1;
    longest = Math.max(longest, run);
    prev = t;
  }

  // Current streak counts back from today, or from yesterday if today is empty.
  let current = 0;
  let t = days[key(today)] ? today : today - dayMs;
  while (days[key(t)]) {
    current++;
    t -= dayMs;
  }

  let best = { date: dates.at(-1) ?? key(today), count: 0 };
  for (const d of dates) if (days[d] >= best.count) best = { date: d, count: days[d] };

  const sumSince = (ms: number) =>
    dates.filter((d) => new Date(d).getTime() > today - ms).reduce((n, d) => n + days[d], 0);

  return {
    currentStreak: current,
    longestStreak: longest,
    bestDayCommits: best.count,
    bestDayDate: best.date,
    contributions: sumSince(365 * dayMs),
    weeklyTrends: {
      ...githubSummary.weeklyTrends,
      contributions: sumSince(7 * dayMs),
    },
  };
}
