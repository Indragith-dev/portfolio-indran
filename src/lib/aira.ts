/**
 * AIRA client config and the page actions AIRA can trigger.
 *
 * The backend lives in a separate project (aira-api). Set its URL in
 * NEXT_PUBLIC_AIRA_URL, e.g. https://aira-api.vercel.app (no trailing slash).
 */

export const AIRA_URL = (process.env.NEXT_PUBLIC_AIRA_URL ?? "").replace(
  /\/$/,
  "",
);

export type AiraAction = { name: string; args: Record<string, unknown> };

const HIGHLIGHT_MS = 2500;

/**
 * Project ids the backend can send, mapped to the `id` of a project in
 * portfolio-data.ts. Projects that aren't on the page (grn, axiom) fall back
 * to the Projects section.
 */
const PROJECT_TARGETS: Record<string, string | null> = {
  dms: "dms",
  isop: "isop",
  hrms: "hrms",
  grn: null,
  axiom: null,
};

export function handleAiraAction({ name, args }: AiraAction) {
  if (name === "focus_project") focusProject(String(args.id ?? ""));
  else if (name === "highlight_skill") highlightSkill(String(args.name ?? ""));
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
