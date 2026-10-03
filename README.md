# portfolio-indran

## AIRA chatbot and contact form

AIRA (the robot in the bottom-right corner) answers visitors' questions about Indran, and the contact section sends messages by email. Both are served by a separate backend project, [aira-api](https://github.com/Indragith-dev/AI-Portfolio-chatbot), deployed at https://aira-api.vercel.app. No API keys live in this repo.

**Env var:** `NEXT_PUBLIC_AIRA_URL` = backend URL, no trailing slash. Copy `.env.example` to `.env.local` for local work, and add the same variable in Vercel (Project Settings, Environment Variables) for Production and Preview.

**Run locally:** `npm run dev`, then open http://localhost:3000. The backend must list `http://localhost:3000` in its `ALLOWED_ORIGINS`.

**Where things are:**
- `src/components/aira-chat.tsx`: the floating chat button and panel
- `src/hooks/use-aira.ts`: streams replies from `/api/chat`
- `src/lib/aira.ts`: backend URL, plus the page actions AIRA triggers (scroll to a project, highlight a skill). Project ids map to `id` in `src/config/portfolio-data.ts`.
- `src/components/pages/sections/contact.tsx`: posts to `/api/contact`

AIRA's knowledge about Indran is in the backend, in `api/_lib/profile.ts`.
