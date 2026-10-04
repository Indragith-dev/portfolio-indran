/**
 * AIRA client config and the page actions AIRA can trigger.
 *
 * The backend lives in a separate project (aira-api). NEXT_PUBLIC_AIRA_URL
 * overrides its URL (no trailing slash). It is read at build time, so when it
 * is missing from a deploy we fall back to the production backend instead of
 * calling /api/chat on the portfolio itself, which doesn't exist.
 */

const DEFAULT_AIRA_URL = "https://aira-api.vercel.app";

export const AIRA_URL = (
  process.env.NEXT_PUBLIC_AIRA_URL || DEFAULT_AIRA_URL
).replace(/\/$/, "");

export type AiraAction = { name: string; args: Record<string, unknown> };

const HIGHLIGHT_MS = 2500;

/**
 * Project ids the backend can send, mapped to the `id` of a project in
 * portfolio-data.ts. A null target falls back to the Projects section.
 */
const PROJECT_TARGETS: Record<string, string | null> = {
  aira: "aira",
  dms: "dms",
  isop: "isop",
  axiom: "axiom",
  hrms: "hrms",
};

/** Section ids the backend can send with show_section (element ids on the page). */
const SECTIONS = ["projects", "awards", "linkedin", "about", "stats", "testimonials", "contact"];

export function handleAiraAction({ name, args }: AiraAction) {
  if (name === "focus_project") focusProject(String(args.id ?? ""));
  else if (name === "highlight_skill") highlightSkill(String(args.name ?? ""));
  else if (name === "show_section") showSection(String(args.section ?? ""));
}

function showSection(id: string) {
  if (!SECTIONS.includes(id)) return;
  const el = document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({ behavior: "smooth", block: "start" });
}

function focusProject(id: string) {
  if (!(id in PROJECT_TARGETS)) return;
  const target = PROJECT_TARGETS[id];
  const el =
    (target && document.querySelector<HTMLElement>(`[data-project-id="${target}"]`)) ||
    document.getElementById("projects");
  if (!el) return;

  el.scrollIntoView({ behavior: "smooth", block: "start" });
  flash([el]);
}

/** "React.js", "react" and "REACT" all match; so do ".NET" and "dotnet". */
const normalize = (s: string) =>
  s
    .toLowerCase()
    .replace(/dotnet/g, "net")
    .replace(/[^a-z0-9#+]/g, "")
    .replace(/js$/, "");

function highlightSkill(name: string) {
  const wanted = normalize(name);
  if (!wanted) return;

  const matches = Array.from(
    document.querySelectorAll<HTMLElement>("[data-skill]"),
  ).filter((el) => normalize(el.dataset.skill ?? "") === wanted);
  if (!matches.length) return;

  const card = matches[0].closest<HTMLElement>("#tech-stack") ?? matches[0];
  card.scrollIntoView({ behavior: "smooth", block: "center" });
  flash(matches);
}

function flash(elements: HTMLElement[]) {
  for (const el of elements) el.setAttribute("data-aira-highlight", "");
  setTimeout(() => {
    for (const el of elements) el.removeAttribute("data-aira-highlight");
  }, HIGHLIGHT_MS);
}
