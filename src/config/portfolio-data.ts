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
    "Full Stack Developer with 4+ years and 25+ projects delivered — React and TypeScript on the front, C# and ASP.NET Core on the back, with SQL, Docker and AWS taking it all the way to production.",
  availableForWork: true,
  resumeUrl: "/resume/Indragith_Resume.pdf",
  avatar: "/indran-sketch.jpg",
  asciiArt: "/indran-sketch.jpg",
  yearsOfExperience: 4,
  location: "Trivandrum, India",
} as const;

/* ── Site metadata ────────────────────────────────────────────────────────── */

export const siteMeta = {
  url: "https://portfolio-indran.vercel.app",
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
  /** Shown as the Mail link in the footer. */
  email: "nsindragith@gmail.com",
  /** WhatsApp chat link, shown in the footer. */
  whatsapp: "https://wa.me/919747770467",
  /** TODO */
  discord: "",
} as const;

/* ── Hero counters ────────────────────────────────────────────────────────── */

export const heroStats = [
  { label: "Years of Experience", value: profile.yearsOfExperience },
  { label: "Projects Delivered", value: 25 },
  { label: "Enterprise Clients", value: 6 },
  { label: "Technologies Used", value: 20 },
];

/* ── About section ────────────────────────────────────────────────────────── */

export const aboutHeading = ["Meet the Developer,", "Not Just the Code"];

/** Each paragraph wraps an inline GIF. Swap the files in /public/gifs freely. */
export const aboutParagraphs = [
  {
    before:
      "I started in frontend at K2web, went full stack at KodNest, and now own features end to end at MAV-S Innovations",
    gif: "/gifs/cate%20coding.gif",
    gifAlt: "cat intensely coding",
    after:
      "— React and TypeScript on top, C# and ASP.NET Core underneath.",
  },
  {
    before:
      "25+ projects in, most of my work is enterprise software: document management, invoice automation, HR portals and multi-tenant platforms",
    gif: "/gifs/kawaii%20cat%20GIF.gif",
    gifAlt: "kawaii cat cheering",
    after: "— the kind with real workflows, real approvals and real users.",
  },
  {
    before:
      "I like the architectural side of backend work: Clean Architecture, modular monoliths, CQRS, EF Core",
    gif: "/gifs/happy%20one%20piece%20GIF.gif",
    gifAlt: "happy One Piece vibe",
    after:
      "and event-driven messaging with RabbitMQ and Wolverine — planned together with the team, Agile style.",
  },
  {
    before:
      "I ship past the repo too — Docker, AWS and CI/CD, and an on-site deployment inside a secure data centre vault in Abu Dhabi",
    gif: "/gifs/One%20Piece%20GIF%20by%20TOEI%20Animation%20UK.gif",
    gifAlt: "One Piece crew teamwork",
    after: "that I set up end to end, servers and all.",
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
  "25+ Projects",
  ".NET + React",
];

/* ── Projects ─────────────────────────────────────────────────────────────── */

/**
 * Each card links to its own page at /portfolio/projects/<id> with the details
 * below. Work projects were built at or for companies, so they have no public
 * code or demo; set `github` only for projects with a public repo.
 */
export type Project = {
  /** URL slug, and the id AIRA uses to scroll to the card (see src/lib/aira.ts). */
  id: string;
  title: string;
  /** One or two sentences for the card. */
  summary: string;
  /** Opening paragraph on the project page. */
  overview: string;
  /** What Indragith did on it. */
  role: string;
  highlights: string[];
  stack: string[];
  tags: string[];
  /** Cover image; projects are private, so these are illustrated covers. */
  image: string;
  /** Extra photos for the project page. */
  gallery?: { src: string; caption: string }[];
  company?: string;
  /** Public repo; shows a "View code" button. */
  github?: string;
  /** Leave empty when unknown; the card then shows only the status. */
  date?: string;
  status: "completed" | "in progress";
};

export const projects: Project[] = [
  {
    id: "aira",
    title: "AIRA — AI Portfolio Assistant",
    summary:
      "The AI assistant on this portfolio. It answers questions about my work from a curated profile, streams its replies, moves the page to what it's talking about, and powers the contact form.",
    overview:
      "AIRA is the chatbot built into this site. Visitors ask about my projects, skills or experience and get answers streamed in real time from Google Gemini, grounded strictly in my profile; anything off-topic gets a polite, fixed reply. It can also act on the page, scrolling to a project, highlighting a skill or opening a section, and the same backend delivers the contact form by email.",
    role:
      "Designed and built it end to end: the serverless API on Vercel, the prompt and guardrails, and the animated robot chat in Next.js.",
    highlights: [
      "Serverless API on Vercel that streams Gemini replies to the browser as they're written",
      "Answers only from a curated profile, with a fixed reply for off-topic questions and prompt-injection attempts",
      "Function calling to scroll to projects, highlight skills and open sections of the page",
      "Falls back to a second Gemini model when the first is busy or out of quota",
      "Per-visitor rate limiting and an allowlist of sites that may call the API",
      "Contact form delivered by email through Resend, with a hidden field to catch bots",
      "Animated robot cut from layered artwork: it peeks in, waves, thinks, talks and walks, with sound effects",
    ],
    stack: ["TypeScript", "Google Gemini", "Vercel Functions", "Next.js", "React", "Motion", "Tailwind CSS", "Resend"],
    tags: ["AI", "TypeScript", "Next.js", "Serverless"],
    image: "/projects/aira.svg",
    github: "https://github.com/Indragith-dev/AI-Portfolio-chatbot",
    date: "2026",
    status: "completed",
  },
  {
    id: "dms",
    title: "Document Management System",
    summary:
      "Enterprise DMS pairing a React vendor portal with an internal SharePoint portal for multi-stage document review and approval, deployed on-site in a secure data centre in Abu Dhabi.",
    overview:
      "A full stack document management platform for an enterprise client. External vendors submit and track documents through a React portal, while internal teams review and approve them in a SharePoint portal through multi-stage workflows.",
    role:
      "Built the platform end to end, from the React vendor portal and SharePoint portal to the ASP.NET Core API, then travelled to Abu Dhabi and deployed it on the client's air-gapped servers on my own.",
    highlights: [
      "React vendor portal with JWT authentication",
      "Internal SharePoint (SPFx) portal driving multi-stage review and approval workflows",
      "Clean Architecture backend on ASP.NET Core, EF Core and SQL Server",
      "SharePoint integration through PnP, with Hangfire for background jobs",
      "Set up and deployed on-site on an air-gapped, on-premise server inside a secure data centre vault in Abu Dhabi, handling the full server configuration in person",
    ],
    stack: ["React", "TypeScript", "ASP.NET Core", "EF Core", "SQL Server", "SharePoint SPFx", "PnP", "Hangfire", "JWT"],
    tags: ["Enterprise", ".NET", "React", "SharePoint"],
    image: "/projects/dms.svg",
    gallery: [
      { src: "/gallery/linkedin-abudhabi.jpg", caption: "On site at the data centre in Abu Dhabi for the deployment" },
    ],
    company: "MAV-S Innovations",
    date: "2024",
    status: "completed",
  },
  {
    id: "isop",
    title: "ISOP — Integrated Strategy & Operations Platform",
    summary:
      "Multi-tenant modular monolith on .NET 9 that unifies strategic planning, project management and task management, built with CQRS and event-driven messaging.",
    overview:
      "ISOP brings an organisation's strategic planning, project management and task management into a single multi-tenant platform. It is a modular monolith on .NET 9 and PostgreSQL, with modules talking to each other through events over Wolverine and RabbitMQ.",
    role:
      "Leading backend development. I own the Project Management module and have built major parts of Task Management.",
    highlights: [
      "Multi-tenant modular monolith on .NET 9 and PostgreSQL",
      "CQRS with event-driven messaging over Wolverine and RabbitMQ",
      "Owns the Project Management module: meetings, phases, risks, issues and vendors",
      "Built major parts of Task Management: workspaces, dashboards and tasks",
    ],
    stack: [".NET 9", "C#", "PostgreSQL", "EF Core", "Wolverine", "RabbitMQ", "CQRS"],
    tags: ["Architecture", ".NET", "PostgreSQL", "CQRS"],
    image: "/projects/isop.svg",
    company: "MAV-S Innovations",
    date: "2025",
    status: "in progress",
  },
  {
    id: "axiom",
    title: "AXIOM — Product Subscription Platform",
    summary:
      "Subscription platform for the company's product suite, with SSO sign-in and tenant-based setup for multi-product access. Built independently.",
    overview:
      "AXIOM is the subscription platform that showcases MAV-S Innovations' product suite, including ISOP and MyHR. Customers sign in once and get access to the products set up for their tenant.",
    role: "Built it independently, from the modular monolith backend to the React frontend.",
    highlights: [
      "Subscription-based platform for the company's product suite (ISOP, MyHR and others)",
      "Modular monolith backend on .NET with PostgreSQL",
      "Single sign-on (SSO) across products",
      "Tenant-based setup for multi-product access",
    ],
    stack: [".NET", "C#", "React", "PostgreSQL"],
    tags: ["SaaS", ".NET", "React", "PostgreSQL"],
    image: "/projects/axiom.svg",
    company: "MAV-S Innovations",
    status: "completed",
  },
  {
    id: "grn",
    title: "GRN — Invoice Management System",
    summary:
      "Pulls invoices from email, parses and analyses them, cross-verifies the data against Oracle and routes them through approval to payment. Built independently.",
    overview:
      "GRN automates invoice handling. Invoices that arrive by email are picked up, parsed and analysed, then checked against data in Oracle before an approval workflow routes them through to payment.",
    role: "Built it independently on .NET and React using Clean Architecture.",
    highlights: [
      "Pulls invoices straight from email",
      "Parses and analyses invoice data automatically",
      "Cross-verifies invoice data against Oracle",
      "Approval workflow that routes verified invoices through to payment",
      "Clean Architecture on .NET with PostgreSQL",
    ],
    stack: [".NET", "C#", "React", "PostgreSQL", "Oracle", "Clean Architecture"],
    tags: ["Automation", ".NET", "React", "PostgreSQL"],
    image: "/projects/grn.svg",
    company: "MAV-S Innovations",
    status: "completed",
  },
  {
    id: "hrms",
    title: "Employee Portal & HRMS",
    summary:
      "A production employee platform delivered as both a React web app and a Flutter mobile app, with activity feeds, real-time messaging and an AI chatbot.",
    overview:
      "A production employee platform delivered on two fronts: a responsive React web portal and a Flutter mobile app, covering the employee portal, activity feeds, real-time messaging and an AI chatbot.",
    role: "Worked across both the React web app and the Flutter mobile app.",
    highlights: [
      "Responsive employee portal in React",
      "Activity feeds and real-time messaging",
      "AI chatbot built into the platform",
      "Flutter mobile app with BLoC state management, Hive local storage and go_router",
    ],
    stack: ["React", "Flutter", "Dart", "BLoC", "Hive", "go_router"],
    tags: ["React", "Flutter", "Mobile", "Enterprise"],
    image: "/projects/hrms.svg",
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
  SaaS: "bg-violet-500/10 text-violet-600 border-violet-500/30",
  Automation: "bg-amber-500/10 text-amber-600 border-amber-500/30",
  AI: "bg-fuchsia-500/10 text-fuchsia-600 border-fuchsia-500/30",
  TypeScript: "bg-blue-500/10 text-blue-500 border-blue-500/30",
  "Next.js": "bg-zinc-500/10 text-zinc-500 border-zinc-500/30",
  Serverless: "bg-lime-500/10 text-lime-600 border-lime-500/30",
};

/* ── Awards ───────────────────────────────────────────────────────────────── */

/** Shown in the Awards section; the featured award gets the photo. */
export const awards = {
  featured: {
    title: "High Achiever Award",
    organisation: "MAV-S Innovations",
    year: "2025",
    description:
      "Recognised by MAV-S Innovations for delivering production-ready software across its enterprise projects.",
    image: "/gallery/achieveraward.jpg",
    imageAlt: "Indragith receiving the High Achiever Award cheque at MAV-S Innovations",
  },
  /** Other recognitions and roles from the resume. */
  others: [
    { title: "IT Support Head", organisation: "MAV-S Innovations" },
    { title: "Best Event Coordinator", organisation: "Office Event Coordinator Head" },
    { title: "Executive Member", organisation: "Skill Development Committee" },
    { title: "Member", organisation: "Technopark AWS Community" },
  ],
};

/* ── LinkedIn posts ──────────────────────────────────────────────────────── */

/**
 * Shown as theme-aware cards in the LinkedIn section (LinkedIn's own embeds
 * are always white and can't follow the site theme). Copy the text from the
 * post, save its image to /public/gallery, and link the post's URL.
 */
export const linkedinProfile = {
  headline:
    "Software Developer @ MAV-S Innovations | React.js | ASP.NET Core | TypeScript | Full Stack Development",
};

/** Newest first. */
export const linkedinPosts = [
  {
    url: "https://www.linkedin.com/feed/update/urn:li:ugcPost:7512478507734855680/",
    date: "Oct 2026",
    text: `Glad to have attended the AWS User Group Trivandrum – September Community Meetup!

It was a great opportunity to connect with people from the cloud and technology community, exchange ideas, and learn more about the AWS ecosystem.

The session on AWS Bedrock Agent Core was especially interesting, particularly in understanding how AI agents can move beyond experimentation and towards more production-ready systems.

I also found the session on Databases on AWS very useful, as it gave me a better understanding of the different database options available in AWS and their role in building scalable applications.

As I continue exploring AWS, cloud technologies, AI, and Gen AI, meetups like these are a great way to gain practical insights and learn from the wider technology community.

The networking and conversations with fellow developers and technology enthusiasts made the experience even more valuable.

Looking forward to attending more community meetups and continuing to learn.`,
    tags: ["AWS", "AWSUserGroup", "AWSBedrock", "GenAI"],
    image: "/gallery/linkedin-aws-meetup.jpg",
    imageAlt: "Indragith at the AWS User Group Trivandrum September community meetup",
  },
  {
    url: "https://www.linkedin.com/feed/update/urn:li:ugcPost:7480694445533745152/",
    date: "Jul 2026",
    text: `Grateful for an incredible milestone in my professional journey!

I recently had the opportunity to visit Abu Dhabi, UAE, to deploy a project that our team built for a client inside a highly secure Data Center Vault.

It was a great experience setting up the production environment, configuring the required servers, and successfully deploying the solution. This opportunity gave me valuable hands-on exposure to enterprise deployment in a secure data center environment.

A heartfelt thank you to the founders of MAV-S Innovations for placing their trust in me and giving me this incredible opportunity. I'm truly grateful for the confidence, support, and exposure that made this experience possible.

A special thanks to my manager, Ajesh Anand, for his constant guidance, encouragement, and trust throughout this journey. Your mentorship and support played a significant role in making this experience both successful and memorable.

Proud to have been part of this milestone and thankful to everyone who contributed to making it a success.`,
    tags: ["AbuDhabi", "DataCenter", "ProductionDeployment", "SQLServer"],
    image: "/gallery/linkedin-abudhabi.jpg",
    imageAlt: "Data Center Vault reception in Abu Dhabi during the deployment",
  },
  {
    url: "https://www.linkedin.com/feed/update/urn:li:share:7477022126328242176/",
    date: "Jun 2026",
    text: `Planning, Collaboration & Delivery - The Agile Mindset

Building successful software starts long before writing code-it begins with collaboration, clear communication, and shared understanding.

Working in an Agile environment has reinforced that Planning Poker is more than estimating story points. It's an opportunity for the team to discuss requirements, uncover complexities, identify potential risks, and align on the best approach before development begins.

As a Full Stack Developer, I enjoy contributing throughout the entire development lifecycle-from understanding business requirements and participating in sprint planning to developing scalable backend services, building intuitive frontend experiences, and delivering value incrementally.

Being part of Agile teams has strengthened my ability to:

- Collaborate effectively with cross-functional teams
- Participate in sprint planning, estimation, and backlog discussions
- Break down complex requirements into deliverable tasks
- Adapt to changing priorities while maintaining quality
- Continuously learn, improve, and deliver value in every sprint

One of the biggest lessons Agile has taught me is that great software is built through collaboration - not in isolation. Strong communication, shared ownership, and continuous improvement are what turn ideas into successful products.

Always learning, always improving, and always looking forward to building impactful solutions.`,
    tags: ["Agile", "Scrum", "PlanningPoker", "FullStackDeveloper"],
    image: "/gallery/linkedin-agile.jpg",
    imageAlt: "Agile Planning Poker cards held up in front of the MAV-S Innovations sign",
  },
  {
    url: "https://www.linkedin.com/feed/update/urn:li:share:7414028215641518080/",
    date: "Jan 2026",
    text: `I’m happy to share that I’ve received the High Achiever Award from MAV-S Innovations.

This recognition truly means a lot to me and motivates me to continue pushing my limits as a Software Engineer.
I would like to extend my sincere thanks to our Founder & Lead, Minhaj Raheem, for his constant guidance, trust, and support. Working under such leadership has been a great learning experience and has helped me grow both professionally and personally. I’m also grateful to my Manager, Ajesh Anand, for his continuous support, mentorship, and encouragement, which have played a key role in this achievement.

A big thank you to my team as well—this wouldn’t have been possible without the collaborative and supportive environment at MAV-S Innovations.

Looking forward to achieving many more milestones together.`,
    tags: ["HighAchieverAward", "MAVSInnovations", "SoftwareEngineer", "TeamWork"],
    image: "/gallery/linkedin-award.jpg",
    imageAlt: "Indragith receiving the High Achiever Award at MAV-S Innovations",
  },
];

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
    { name: "SQL Server", icon: "/icons/sqlserver.svg" },
    { name: "PostgreSQL", icon: "/icons/postgresql.svg" },
    { name: "MySQL", icon: "/icons/mysql.svg" },
    { name: "MongoDB", icon: "/icons/mongodb.svg" },
  ],
  Tools: [
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
 * Repos/stars/forks/followers/languages below are pulled from the public
 * GitHub REST API for Indragith-dev (api.github.com/users/Indragith-dev and
 * .../repos, language bytes summed per repo).
 *
 * TODO: contributions, streaks, best-day commits, PR and issue counts aren't
 * available from the public REST API — they need GitHub's authenticated
 * GraphQL API (contributionsCollection). Fill these in from your GitHub
 * profile's contribution graph, or wire up a GraphQL call with a personal
 * access token if you want them to stay live.
 */
export const githubSummary = {
  joinYear: 2023,
  totalRepositories: 15,
  totalStars: 0,
  contributions: 0,
  followers: 2,
  currentStreak: 0,
  longestStreak: 0,
  bestDayCommits: 0,
  originalRepos: 15,
  forkedRepos: 0,
  pullRequests: { open: 0, closed: 0, merged: 0 },
  issues: { open: 0, closed: 0 },
  /** Weekly deltas shown as the small green "+n" next to each counter. */
  weeklyTrends: { repositories: 0, stars: 0, contributions: 0, pullRequests: 0 },
  topLanguages: [
    { name: "TypeScript", color: "#3178c6", percentage: 49.4 },
    { name: "JavaScript", color: "#f1e05a", percentage: 33.4 },
    { name: "PHP", color: "#4F5D95", percentage: 10.5 },
    { name: "CSS", color: "#563d7c", percentage: 4.2 },
    { name: "Java", color: "#b07219", percentage: 1.8 },
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
 * import now.
 */
export const playlist: Song[] = [
  {
    url: "/music/Sunflower.mp3",
    cover: "/data/track-cover.svg",
    title: "Sunflower",
    channel: "Post Malone, Swae Lee",
  },
];
