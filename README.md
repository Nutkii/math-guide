# Math Guide

Georgian math textbook solutions, AI explanations, and live tutors. **Phase 1 — frontend shell with mock data.**

## Stack (Phase 1)

- Next.js 15 (App Router) + TypeScript
- Tailwind CSS + shadcn/ui primitives
- next-intl (`ka` default, `en` secondary)
- KaTeX (`react-katex`) for inline + block math
- next-themes (dark mode, cool palette)
- sonner for toasts

DB, auth, AI, payments arrive in later phases (see [plan.md](./plan.md)).

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Routes (Phase 1)

| Path | Purpose |
|---|---|
| `/` | Landing — hero, features, books + problems preview |
| `/books` | Book grid |
| `/books/[slug]` | Book detail with chapters |
| `/problems` | Problem list + search |
| `/problems/[id]` | Problem view + mock solutions + "Ask AI" CTA |
| `/problems/new` | Upload form with live KaTeX preview |
| `/pricing` | Free / AI Pro / Tutor plans |
| `/tutors` | Tutor directory |
| `/tutors/[id]` | Tutor profile + mock slot grid |
| `/dashboard` | User shell (uploads, subscription, bookings, chats) |
| `/login`, `/register` | Auth UI (functional in Phase 3) |
| `/chat` | AI chat UI (functional in Phase 4) |

Locale switching: `/ka/...` (default, no prefix) and `/en/...`.

## Theme

Cool blue + teal + emerald palette. CSS variables in [`app/globals.css`](app/globals.css), Tailwind tokens in [`tailwind.config.ts`](tailwind.config.ts). Gradient utility `text-gradient-cool`, mesh background `bg-cool-mesh`.

## Project layout

```
app/
├── layout.tsx              # root shell (passes through to locale layout)
└── [locale]/
    ├── layout.tsx          # html/body, providers, header, footer
    ├── page.tsx            # landing
    ├── books/, problems/, tutors/, pricing/, dashboard/, login/, register/, chat/
components/
├── ui/                     # shadcn primitives
├── layout/, problem/, tutor/, book/, pricing/
i18n/
├── routing.ts
└── request.ts
messages/
├── ka.json
└── en.json
lib/
├── utils.ts
└── mock-data.ts
middleware.ts               # next-intl
```

## Next phases

Tracked in [plan.md](./plan.md): DB+Mongoose → Auth → AI → Payments → Tutor program → Admin → Launch.
