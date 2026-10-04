# AIRA integration: frontend setup (for Claude Code)

## Context

This repo is my portfolio site (React + Three.js, deployed on Vercel). I'm adding **AIRA**, an AI assistant chat, and a **contact form**. The backend is a SEPARATE Vercel project (`aira-api`) that is already written. Do NOT create or edit backend code in this repo and do NOT put any API keys in the frontend.

Backend base URL goes in an env var: `VITE_AIRA_URL` (e.g. `https://aira-api.vercel.app`, no trailing slash). If this repo uses Next.js instead of Vite, use `NEXT_PUBLIC_AIRA_URL` and `process.env` instead of `import.meta.env`.

## Backend contract

### POST `${BASE}/api/chat`

- Request JSON: `{ "messages": [{ "role": "user" | "assistant", "content": string }] }` (send history without the greeting message; the server keeps only the last 12 messages and 500 chars each).
- Response: **NDJSON stream** (`application/x-ndjson`), one JSON object per line:
  - `{ "type": "text", "text": "..." }`: append to the assistant message
  - `{ "type": "action", "name": "focus_project" | "highlight_skill", "args": {...} }`: run in the 3D scene
  - `{ "type": "error", "message": "..." }`: show to the user
- Non-2xx (429, 400, 403): JSON `{ "error": "..." }`. Show that message.
- `focus_project` args: `{ id: "grn" | "axiom" }`. `highlight_skill` args: `{ name: string }`.

### POST `${BASE}/api/contact`

- Request JSON: `{ "name": string, "email": string, "message": string, "website": "" }`. `website` is a hidden honeypot and must be sent EMPTY.
- Success: `200 { "ok": true }`. Failure: non-2xx `{ "error": "..." }`. Show that message.

## Tasks

1. **Env**
   - Add `VITE_AIRA_URL` to `.env.local` (placeholder value) and `.env.example`. Add it to `src/vite-env.d.ts` typings if the project uses TypeScript.
   - Remind me to add the same variable in Vercel (Project Settings, Environment Variables) for Production and Preview.

2. **Hook: create `src/aira/useAira.ts`** with exactly this behavior:

```ts
import { useCallback, useRef, useState } from "react";

const BASE = import.meta.env.VITE_AIRA_URL as string;

export type AiraMessage = { role: "user" | "assistant"; content: string };
export type AiraAction = { name: string; args: Record<string, unknown> };

export function useAira(onAction: (action: AiraAction) => void) {
  const [messages, setMessages] = useState<AiraMessage[]>([
    {
      role: "assistant",
      content:
        "Hi, I'm AIRA, Indran's AI assistant. Ask me about his projects, skills or experience.",
    },
  ]);
  const [loading, setLoading] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  const send = useCallback(
    async (text: string) => {
      const userMsg: AiraMessage = {
        role: "user",
        content: text.slice(0, 500),
      };
      const history = [...messages, userMsg];
      setMessages([...history, { role: "assistant", content: "" }]);
      setLoading(true);

      const append = (chunk: string) =>
        setMessages((prev) => {
          const copy = [...prev];
          const last = copy[copy.length - 1];
          copy[copy.length - 1] = { ...last, content: last.content + chunk };
          return copy;
        });

      try {
        abortRef.current = new AbortController();
        const res = await fetch(`${BASE}/api/chat`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages: history.slice(1) }), // skip the greeting
          signal: abortRef.current.signal,
        });

        if (!res.ok || !res.body) {
          const data = await res.json().catch(() => null);
          append(data?.error || "Something went wrong. Please try again.");
          return;
        }

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";
        for (;;) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() ?? "";
          for (const line of lines) {
            if (!line.trim()) continue;
            const evt = JSON.parse(line);
            if (evt.type === "text") append(evt.text);
            else if (evt.type === "action")
              onAction({ name: evt.name, args: evt.args ?? {} });
            else if (evt.type === "error") append(evt.message);
          }
        }
      } catch (e) {
        if ((e as Error).name !== "AbortError")
          append("Connection problem. Please try again.");
      } finally {
        setLoading(false);
      }
    },
    [messages, onAction],
  );

  return { messages, loading, send };
}
```

3. **Chat UI: create `src/aira/AiraChat.tsx`**
   - Props: `{ onAction: (a: AiraAction) => void }`. Uses `useAira`.
   - Floating button (bottom-right, label "AIRA") that opens/closes a chat panel overlaying the 3D scene. Panel: header "AIRA, Indran's AI assistant", scrollable message list (user right, assistant left), input (maxLength 500) and Send button, auto-scroll to newest message, show "..." while an empty assistant message is streaming, disable Send while loading.
   - Must work at phone width (panel `width: min(360px, calc(100vw - 32px))`) and match the site's existing visual style (look at current CSS/theme before choosing colors; do not hard-code a clashing palette).
   - Must not block mouse/touch events on the Three.js canvas outside of its own button and panel.
   - Accessible: `aria-label` on the toggle, labelled input, Enter submits.

4. **Wire into the 3D scene**
   - Mount `<AiraChat onAction={handleAction} />` once at the app root next to the canvas.
   - Implement `handleAction`:
     - `focus_project`: animate the camera to the project object whose id matches `args.id` ("grn", "axiom"). Look at how project objects are defined in this repo and map ids to them; if ids differ, tell me and map them in ONE place (a constant), not scattered.
     - `highlight_skill`: highlight the matching skill/tech object by name (case-insensitive). If nothing matches, do nothing silently.
   - Reuse existing camera helpers/animation code (GSAP, drei, etc.) if present; do not add new animation libraries.

5. **Contact form: create `src/components/ContactForm.tsx`** (or extend my existing contact section if one exists, and reuse its styling)
   - Fields: name, email, message (textarea, maxLength 3000), plus a visually hidden honeypot input named `website` (`tabIndex={-1}`, `autoComplete="off"`, `aria-hidden`) that is sent in the body and must stay empty.
   - POST to `${BASE}/api/contact`. States: idle, sending ("Sending..."), success (thank-you message, clear the form), error (show the server's `error` text). Disable the button while sending. Basic client-side validation (required fields, email format).

6. **Docs**: add a short "AIRA" section to the README covering the env var and how to run locally.

## Constraints

- No API keys or secrets in this repo. Only `VITE_AIRA_URL`.
- Do not add new dependencies unless unavoidable; if you must, tell me why first.
- Keep the 3D scene's performance intact: no re-renders of the canvas caused by chat state (keep chat state inside `AiraChat`/`useAira`).
- Match the existing code style, folder structure and TypeScript strictness.

## Acceptance checks (run these and report results)

1. `npm run build` passes with no type errors.
2. With `VITE_AIRA_URL` pointing at the deployed backend, a message to AIRA streams a reply token by token.
3. Asking "show me the GRN project" moves the camera to GRN.
4. Sending 11 chat messages quickly shows the friendly rate-limit message instead of breaking the UI.
5. The contact form shows success on a valid submit and the server's error text on a bad one.
6. Layout is usable at 375px width.

If the backend returns CORS errors, do NOT change frontend code to work around it. Tell me the exact origin the browser is sending so I can add it to the backend's allowlist.
