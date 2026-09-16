/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  EDIT THIS FILE — everything personal on the site lives here.
 * ─────────────────────────────────────────────────────────────────────────────
 *
 *  Nothing in this project calls an external API any more. Every number, name,
 *  link and paragraph the site renders is read from this file, so changing the
 *  values below is all it takes to update the portfolio.
 *
 *  Anything marked TODO is a placeholder — I did not have that detail.
 */

import type { GitHubStatsResponse } from "@/types/github";
import type { Song } from "@/types";

/* ── Identity ─────────────────────────────────────────────────────────────── */

export const profile = {
  name: "Indragith N S",
  /** Names the hero and console type out, in order. */
  typedNames: ["Indragith", "a Full Stack Dev"],
  username: "@Indragith-dev",
  role: "Full Stack Developer",
  /** Shown in the hero badge — the sharper positioning line. */
  specialisation: ".NET | React",
  tagline:
    "Full Stack Developer with 4+ years building enterprise applications end to end — React and TypeScript on the front, C# and ASP.NET Core on the back, with SQL, Docker and AWS holding it together.",
  availableForWork: true,
  /** TODO: drop your CV at public/resume.pdf — the download button expects it. */
  resumeUrl: "/resume.pdf",
  /** TODO: replace with your own photo in /public and update this path. */
  avatar: "/profile.svg",
  asciiArt: "/ascii-art-profile.svg",
  yearsOfExperience: 4,
  location: "Trivandrum, India",
} as const;

/* ── Site metadata ────────────────────────────────────────────────────────── */

export const siteMeta = {
  /** TODO: set this to your live domain before deploying. */
  url: "http://localhost:3000",
  title: "Indragith N S",
  description:
    "Full Stack Developer specialising in React, TypeScript, C# and ASP.NET Core. Enterprise applications across frontend, backend, databases, cloud deployment and CI/CD.",
  keywords: [
    "Indragith N S",
    "full stack developer",
    "dotnet developer",
    "react developer",
    "aspnet core",
    "typescript",
    "portfolio",
  ],
  /** TODO: swap for a 1200x630 PNG — most social platforms ignore SVG. */
  ogImage: "/og-image.svg",
} as const;

/* ── Social links ─────────────────────────────────────────────────────────── */

export const social = {
  githubUsername: "Indragith-dev",
  github: "https://github.com/Indragith-dev",
  linkedin: "https://www.linkedin.com/in/nsindragith",
  /** TODO: your email — the contact form opens a mailto: to this address. */
  email: "you@example.com",
  /** TODO: X/Twitter handle, or remove the link from the footer and home screen. */
  twitter: "https://x.com/",
  /** TODO: chat link used by the floating robot. */
  telegram: "https://t.me/",
  /** TODO */
  discord: "",
} as const;

/* ── Hero counters ────────────────────────────────────────────────────────── */

export const heroStats = [
  { label: "Years of Experience", value: profile.yearsOfExperience },
  { label: "Projects Delivered", value: 10 },
  { label: "Enterprise Clients", value: 6 },
  { label: "Technologies Used", value: 20 },
];

/* ── About section ────────────────────────────────────────────────────────── */

export const aboutHeading = ["Meet the Developer,", "Not Just the Code"];

/** Each paragraph wraps an inline GIF. Swap the files in /public/gifs freely. */
export const aboutParagraphs = [
  {
    before:
      "I started out in frontend and kept walking down the stack until I could own a feature end to end",
    gif: "/gifs/cate%20coding.gif",
    gifAlt: "cat intensely coding",
    after:
      "— React and TypeScript on top, C# and ASP.NET Core underneath.",
  },
  {
    before:
      "Most of my work is enterprise software: document management, HR portals, multi-tenant operations platforms",
    gif: "/gifs/kawaii%20cat%20GIF.gif",
    gifAlt: "kawaii cat cheering",
    after: "— the kind with real workflows, real approvals and real users.",
  },
  {
    before:
      "I like the architectural side of backend work: Clean Architecture, modular monoliths, CQRS, EF Core",
    gif: "/gifs/happy%20one%20piece%20GIF.gif",
    gifAlt: "happy One Piece vibe",
    after: "and event-driven messaging with RabbitMQ and Wolverine.",
  },
  {
    before:
      "I have shipped past the repo too — Docker, AWS and CI/CD, including an on-site deployment into an air-gapped environment in Abu Dhabi",
    gif: "/gifs/One%20Piece%20GIF%20by%20TOEI%20Animation%20UK.gif",
    gifAlt: "One Piece crew teamwork",
    after: "that I handled independently.",
  },
  {
    before: "Got a messy brief or a half-baked idea?",
    gif: "/gifs/kirby%20confused.gif",
    gifAlt: "kirby confused but ready",
    after: "Let's turn it into something real.",
  },
];

/** Small pills on the about card, next to the availability badge. */
export const aboutBadges = [
  `${profile.yearsOfExperience}+ Years`,
  ".NET + React",
];

/* ── Projects ─────────────────────────────────────────────────────────────── */

export const projects = [
  {
    title: "Document Management System",
    description:
      "Enterprise DMS pairing a React vendor portal with a SharePoint internal portal over an ASP.NET Core and SQL Server backend. Multi-stage document review and approval workflows, JWT authentication and Hangfire background jobs. Deployed on-site into an air-gapped environment in Abu Dhabi.",
    tags: ["Enterprise", ".NET", "React", "SharePoint"],
    github: null as string | null,
    live: null as string | null,
    /** TODO: add a real screenshot to /public/projects and update this path. */
    image: "/projects/placeholder-1.svg",
    date: "2024",
    status: "completed",
  },
  {
    title: "ISOP — Integrated Strategy & Operations Platform",
    description:
      "Multi-tenant modular monolith on .NET 9 with CQRS and event-driven messaging over RabbitMQ and Wolverine. I own the Project Management module — meetings, phases, risks, issues and vendors — and build Task Management features across workspaces, dashboards and tasks.",
    tags: ["Architecture", ".NET", "PostgreSQL", "CQRS"],
    github: null as string | null,
    live: null as string | null,
    image: "/projects/placeholder-2.svg",
    date: "2025",
    status: "in progress",
  },
  {
    title: "Employee Portal & HRMS",
    description:
      "A production employee platform delivered as both a React web app and a Flutter mobile app — responsive employee portal, activity feeds, real-time messaging and an AI chatbot, with BLoC state management, Hive local storage and go_router on mobile.",
    tags: ["React", "Flutter", "Mobile", "Enterprise"],
    github: null as string | null,
    live: null as string | null,
    image: "/projects/placeholder-3.svg",
    date: "2024",
    status: "completed",
  },
];

/** Colours are looked up by tag name; add an entry when you add a new tag. */
export const tagColors: Record<string, string> = {
  Enterprise: "bg-blue-500/10 text-blue-600 border-blue-500/30",
  ".NET": "bg-purple-500/10 text-purple-600 border-purple-500/30",
  React: "bg-cyan-500/10 text-cyan-600 border-cyan-500/30",
  SharePoint: "bg-teal-500/10 text-teal-600 border-teal-500/30",
  Architecture: "bg-orange-500/10 text-orange-600 border-orange-500/30",
  PostgreSQL: "bg-indigo-500/10 text-indigo-600 border-indigo-500/30",
  CQRS: "bg-emerald-500/10 text-emerald-600 border-emerald-500/30",
  Flutter: "bg-sky-500/10 text-sky-600 border-sky-500/30",
  Mobile: "bg-pink-500/10 text-pink-600 border-pink-500/30",
};

/* ── Tech stack ───────────────────────────────────────────────────────────── */

export const techStack = {
  Frontend: [
    { name: "React", icon: "/icons/react.svg" },
    { name: "TypeScript", icon: "/icons/typescript.svg" },
    { name: "JavaScript", icon: "/icons/javascript.svg" },
    { name: "Next.js", icon: "/icons/nextjs.svg" },
    { name: "Redux Toolkit", icon: "/icons/redux.svg" },
    { name: "Tailwind", icon: "/icons/tailwind.svg" },
    { name: "HTML", icon: "/icons/html.svg" },
    { name: "CSS", icon: "/icons/css.svg" },
  ],
  Backend: [
    { name: "C#", icon: "/icons/csharp.svg" },
    { name: ".NET", icon: "/icons/dotnet.svg" },
    { name: "ASP.NET Core", icon: "/icons/aspnet.svg" },
    { name: "EF Core", icon: "/icons/efcore.svg" },
    { name: "RabbitMQ", icon: "/icons/rabbitmq.svg" },
    { name: "Node.js", icon: "/icons/nodejs.svg" },
  ],
  Databases: [
    { name: "SQL Server", icon: "/icons/sqlserver.svg" },
    { name: "PostgreSQL", icon: "/icons/postgresql.svg" },
    { name: "MySQL", icon: "/icons/mysql.svg" },
    { name: "MongoDB", icon: "/icons/mongodb.svg" },
  ],
  "Cloud & Tools": [
    { name: "AWS", icon: "/icons/aws.svg" },
    { name: "Docker", icon: "/icons/docker.svg" },
    { name: "GitHub Actions", icon: "/icons/github-actions.svg" },
    { name: "Git", icon: "/icons/git.svg" },
    { name: "SharePoint", icon: "/icons/sharepoint.svg" },
    { name: "Flutter", icon: "/icons/flutter.svg" },
    { name: "VS Code", icon: "/icons/vscode.svg" },
    { name: "Figma", icon: "/icons/figma.svg" },
  ],
};

/* ── Stats section ────────────────────────────────────────────────────────── */

/**
 * The GitHub GraphQL API integration was removed, so these are plain numbers
 * you type in yourself.
 *
 * TODO: these are placeholders — open github.com/Indragith-dev and put your
 * real counts in. Every value below feeds the three Stats tabs.
 */
export const githubSummary = {
  joinYear: 2021,
  totalRepositories: 0,
  totalStars: 0,
  contributions: 0,
  followers: 0,
  currentStreak: 0,
  longestStreak: 0,
  bestDayCommits: 0,
  originalRepos: 0,
  forkedRepos: 0,
  pullRequests: { open: 0, closed: 0, merged: 0 },
  issues: { open: 0, closed: 0 },
  /** Weekly deltas shown as the small green "+n" next to each counter. */
  weeklyTrends: { repositories: 0, stars: 0, contributions: 0, pullRequests: 0 },
  topLanguages: [
    { name: "TypeScript", color: "#3178c6", percentage: 40 },
    { name: "C#", color: "#178600", percentage: 35 },
    { name: "JavaScript", color: "#f1e05a", percentage: 25 },
  ],
} as const;

/**
 * Builds a contribution calendar for `year` so the heatmap and the 30-day chart
 * have a real shape to render. Replace the zeros with your own counts if you
 * want the grid to show activity.
 */
export function buildContributionCalendar(year: number) {
  const colors = ["#161b22", "#0e4429", "#006d32", "#26a641", "#39d353"];
  const start = new Date(Date.UTC(year, 0, 1));
  // Back up to the Sunday on or before Jan 1, the way GitHub lays the grid out.
  start.setUTCDate(start.getUTCDate() - start.getUTCDay());

  const weeks = [];
  const cursor = new Date(start);

  while (cursor.getUTCFullYear() <= year) {
    const contributionDays = [];
    const firstDay = cursor.toISOString().slice(0, 10);

    for (let d = 0; d < 7; d++) {
      contributionDays.push({
        color: colors[0],
        contributionCount: 0,
        date: cursor.toISOString().slice(0, 10),
      });
      cursor.setUTCDate(cursor.getUTCDate() + 1);
    }

    weeks.push({ contributionDays, firstDay });
    if (cursor.getUTCFullYear() > year) break;
  }

  const months = Array.from({ length: 12 }, (_, m) => ({
    firstDay: new Date(Date.UTC(year, m, 1)).toISOString().slice(0, 10),
    name: new Date(Date.UTC(year, m, 1)).toLocaleString("en", { month: "short" }),
    totalWeeks: 4,
  }));

  return { colors, totalContributions: githubSummary.contributions, months, weeks };
}

/** Assembled once and handed to the Stats section in place of the old API call. */
export function getGitHubStats(year: number): GitHubStatsResponse {
  const s = githubSummary;
  const totalPRs = s.pullRequests.open + s.pullRequests.closed + s.pullRequests.merged;
  const totalIssues = s.issues.open + s.issues.closed;

  const trend = (value: number, total: number) => ({
    value,
    percentage: total > 0 ? Math.round((value / total) * 100) : 0,
    isPositive: value > 0,
  });

  return {
    contributionsCollection: { contributionCalendar: buildContributionCalendar(year) },
    totalRepositories: s.totalRepositories,
    totalStars: s.totalStars,
    followers: { totalCount: s.followers, nodes: [] },
    topLanguages: [...s.topLanguages],
    contributions: s.contributions,
    pullRequests: { total: totalPRs, ...s.pullRequests },
    issues: { total: totalIssues, ...s.issues },
    currentStreak: s.currentStreak,
    longestStreak: s.longestStreak,
    highestCommitDay: {
      date: new Date().toISOString().slice(0, 10),
      count: s.bestDayCommits,
    },
    repositories: {
      total: s.totalRepositories,
      original: s.originalRepos,
      forked: s.forkedRepos,
    },
    weeklyTrends: {
      repositories: trend(s.weeklyTrends.repositories, s.totalRepositories),
      stars: trend(s.weeklyTrends.stars, s.totalStars),
      contributions: trend(s.weeklyTrends.contributions, s.contributions),
      pullRequests: trend(s.weeklyTrends.pullRequests, totalPRs),
    },
  };
}

/* ── Testimonials ─────────────────────────────────────────────────────────── */

/**
 * TODO: these are placeholder quotes — you did not give me any real ones.
 * Replace them with genuine quotes, or delete the <Testimonials /> line in
 * src/components/pages/portfolio.tsx to drop the section entirely.
 * Do not publish these as if they were real endorsements.
 */
export const testimonials = [
  { testimonial: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.", by: "Placeholder Name, Role at Company" },
  { testimonial: "Sed do eiusmod tempor incididunt ut labore et dolore magna.", by: "Placeholder Name, Role at Company" },
  { testimonial: "Ut enim ad minim veniam, quis nostrud exercitation ullamco.", by: "Placeholder Name, Role at Company" },
  { testimonial: "Duis aute irure dolor in reprehenderit in voluptate velit esse.", by: "Placeholder Name, Role at Company" },
  { testimonial: "Excepteur sint occaecat cupidatat non proident, sunt in culpa.", by: "Placeholder Name, Role at Company" },
  { testimonial: "Nemo enim ipsam voluptatem quia voluptas sit aspernatur.", by: "Placeholder Name, Role at Company" },
  { testimonial: "Neque porro quisquam est qui dolorem ipsum quia dolor sit.", by: "Placeholder Name, Role at Company" },
  { testimonial: "At vero eos et accusamus et iusto odio dignissimos ducimus.", by: "Placeholder Name, Role at Company" },
].map((t, i) => ({ ...t, tempId: i, imgSrc: "/profile.svg" }));

/* ── Music player ─────────────────────────────────────────────────────────── */

/**
 * The playlist used to be fetched from /data/playlist.json — it is a plain
 * import now. TODO: point `url` at your own tracks, or at any audio file
 * you drop in /public.
 */
export const playlist: Song[] = [
  {
    url: "/sfx/snake-background.mp3",
    cover: "/data/track-cover.svg",
    title: "Placeholder Track One",
    channel: "Add your own",
  },
  {
    url: "/sfx/snake-background.mp3",
    cover: "/data/track-cover.svg",
    title: "Placeholder Track Two",
    channel: "Add your own",
  },
];
