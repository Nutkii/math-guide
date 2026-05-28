# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # dev server (localhost:3000)
npm run build     # production build
npm run lint      # ESLint
npm run seed      # seed MongoDB (requires MONGODB_URI in .env.local)
```

Run seed: `npm run seed` invokes `tsx --env-file=.env.local scripts/seed.ts`.

## Architecture

### Route Structure
All pages live under `app/[locale]/` — next-intl wraps every route in a locale segment. `localePrefix: "as-needed"` means `ka` (default) has no URL prefix (`/books`), `en` uses `/en/books`.

### Middleware Split (Edge-safe pattern)
`auth.config.ts` — Edge-safe config (no Mongoose/bcrypt imports). Used in `middleware.ts`.
`auth.ts` — Full NextAuth config with Credentials provider + MongoDB user lookup. Import in server components and API routes only.

`middleware.ts` composes both: NextAuth auth check runs first (via `authConfig`), then next-intl handles locale routing.

The `authorized()` callback in `auth.config.ts` strips locale prefix before checking protected paths (`/dashboard`, `/chat`, `/problems/new`).

### Path Alias
`@/` maps to project root. Use for all internal imports.

### Mongoose Singleton
`lib/db.ts` caches connection in `global._mongoose` to survive Next.js hot-reload. Always call `await connectDB()` before any model query in API routes.

### Session + Types
`types/next-auth.d.ts` augments `Session`, `User`, and `JWT` with `role: "student" | "tutor" | "admin"`. JWT stores `id` + `role`; session callback copies them to `session.user`.

### i18n
Translation files: `messages/ka.json` + `messages/en.json`. Config: `i18n/routing.ts` (locales/defaultLocale) and `i18n/request.ts` (loads message file per request).

### Validation
Zod schemas in `lib/validations/` — `auth.ts` exports `loginSchema`, `problem.ts` exports problem schema. API routes + auth use these for input parsing.

### Utilities
`lib/utils.ts` exports `cn()` — Tailwind class merge helper (`clsx` + `tailwind-merge`). Use for all conditional className logic.

### Providers
`components/layout/providers.tsx` wraps the app with `SessionProvider` (NextAuth). Rendered inside `app/[locale]/layout.tsx`.

### Adding shadcn Components
```bash
npx shadcn@latest add <component>
```
Config in `components.json`. Outputs to `components/ui/`.

### Adding Protected Routes
Update the path list in `auth.config.ts` → `authorized()` callback. That function strips locale prefix before matching, so use bare paths (e.g. `/admin`, not `/en/admin`).

---

## Stack

- Next.js 15 + React 19 (App Router) + TypeScript
- Tailwind CSS v3 + shadcn/ui (manual primitives)
- MongoDB Atlas + Mongoose (Phase 2+)
- NextAuth.js v5 beta — `next-auth@beta`
- Groq API — Llama 3.3 70B (Phase 4)
- TBC + BOG payments (Phase 5)
- next-intl v4 — `ka` default, `en` secondary
- KaTeX for math rendering
- Deployed to Vercel

## Phase Progress

### ✅ Phase 1 — Frontend Shell
**Status: COMPLETE**

All pages built with mock data. Cool teal/cyan/emerald theme, dark mode, ka/en i18n, KaTeX math render.

**Delivered:**
- 13 routes: `/`, `/books`, `/books/[slug]`, `/problems`, `/problems/[id]`, `/problems/new`, `/pricing`, `/tutors`, `/tutors/[id]`, `/dashboard`, `/login`, `/register`, `/chat`
- shadcn primitives: button (+ `cool` gradient variant), card, input, textarea, label, badge, avatar, separator, dropdown-menu, tabs
- Components: Header, Footer, LocaleSwitcher, ThemeToggle, MathRender, MixedText, ProblemCard, SolutionBlock, TutorCard, BookCover, PriceTable
- Mock data layer: `lib/mock-data.ts` (4 books, 6 problems, 3 solutions, 4 tutors)
- Security: Next.js upgraded 15.1.3 → 15.5.18 (CVE-2025-66478), next-intl 3.x → 4.x (GHSA-8f24)

---

### 🔶 Phase 2 — Backend + Mongoose
**Status: IN PROGRESS**

- [x] MongoDB Atlas cluster + `lib/db.ts` singleton
- [x] Models: User, Book, Chapter, Problem, Solution, TutorProfile, Subscription, Booking, Payment (`models/`)
- [x] API routes: `/api/books`, `/api/problems`, `/api/solutions`, `/api/tutors`
- [x] Shared zod schemas in `lib/validations/`
- [x] Seed script `scripts/seed.ts`
- [ ] File uploads (UploadThing or R2 presigned)
- [ ] Wire all pages to real data (replace `lib/mock-data.ts` imports)

---

### 🔶 Phase 3 — Auth Module
**Status: IN PROGRESS**

- [x] `next-auth@beta` + `bcryptjs`
- [x] Credentials provider (`auth.ts`)
- [x] JWT session with role + locale (`auth.config.ts`, `types/next-auth.d.ts`)
- [x] `middleware.ts` protects `/dashboard`, `/chat`, `/problems/new`
- [x] Register API route (`/api/auth/register`)
- [ ] Google OAuth provider
- [ ] `@auth/mongodb-adapter` wired
- [ ] Role guards in UI (`student | tutor | admin`)
- [ ] Problem uploads default `status: pending` → admin approves
- [ ] Email verification (Resend free tier)

---

### ⬜ Phase 4 — AI Integration (Groq)
**Status: NOT STARTED**

Goal: $5/mo subscribers chat with Llama 3.3 70B.

- [ ] `groq-sdk` + `ai` + `@ai-sdk/groq`
- [ ] Subscription gate on `/api/chat`
- [ ] Streaming chat API with problem context injection
- [ ] System prompt: Georgian-first tutor persona, step-by-step, LaTeX
- [ ] Conversation + Message Mongoose models
- [ ] Rate limiting: Upstash Redis, 50 msg/day
- [ ] `/dashboard/chats` conversation history

---

### ⬜ Phase 5 — Payments (TBC + BOG)
**Status: NOT STARTED**

Goal: $5/mo subscription + tutor hourly payments in GEL.

- [ ] TBC E-commerce + BOG Acquiring merchant accounts
- [ ] `lib/payments/tbc.ts` — auth, order, 3DS redirect, callback, token, recurring
- [ ] `lib/payments/bog.ts` — same
- [ ] Provider selector at checkout
- [ ] `/api/billing/subscribe`, `/api/billing/callback/[provider]`
- [ ] Daily cron (Vercel Cron) for recurring charges
- [ ] HMAC webhook verification + idempotency
- [ ] Tutor booking one-time charge
- [ ] NBG daily FX rate for $→GEL conversion
- [ ] Resend email receipts

---

### ⬜ Phase 6 — Tutor Program
**Status: NOT STARTED**

Goal: tutor onboarding, availability, booking flow.

- [ ] `/become-tutor` application → admin approval → role upgrade
- [ ] Availability editor (weekly recurring slots)
- [ ] Booking calendar on `/tutors/[id]` (next 14 days)
- [ ] Booking + payment flow (reuses Phase 5)
- [ ] External meet link (tutor pastes Zoom/Meet)
- [ ] Resend reminder emails 24h + 1h before
- [ ] Session lifecycle: `pending_payment → confirmed → completed → reviewed`
- [ ] Reviews + star ratings
- [ ] Admin tutor payout ledger

---

### ⬜ Phase 7 — Admin + Moderation
**Status: NOT STARTED**

- [ ] `/admin` dashboard: problem queue, user list, tutor applications, payments log
- [ ] Approve/reject problems with reason
- [ ] Ban users, flag content
- [ ] Metrics: DAU, signups, MRR, problem count, AI volume

---

### ⬜ Phase 8 — Polish + Launch
**Status: NOT STARTED**

- [ ] SEO: sitemap, OG images, hreflang, structured data
- [ ] ISR on book + problem pages
- [ ] MongoDB Atlas Search or Meilisearch
- [ ] Plausible analytics
- [ ] Sentry error tracking
- [ ] Legal pages (Terms, Privacy, Refund) ka + en
- [ ] Atlas automated backups
- [ ] Production Vercel deploy

---

## Key Decisions

| Topic | Decision | Reason |
|---|---|---|
| AI | Groq API (Llama 3.3 70B) | Free tier, fast, good math reasoning |
| Payments | TBC + BOG | GE market — local cards required |
| Auth | NextAuth.js v5 | Free, MongoDB adapter, email + Google |
| i18n | Georgian default, English secondary | Target market is GE |
| Upload | Image + LaTeX/Markdown | Most flexible for math content |
| Tutor sessions | Booking + external video link | MVP-friendly, no infra |

## Environment Variables

```
# Phase 2
MONGODB_URI=

# Phase 3
NEXTAUTH_SECRET=
NEXTAUTH_URL=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
RESEND_API_KEY=

# Phase 4
GROQ_API_KEY=
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=

# Phase 4 file uploads
UPLOADTHING_TOKEN=

# Phase 5
TBC_CLIENT_ID=
TBC_CLIENT_SECRET=
TBC_MERCHANT_ID=
BOG_CLIENT_ID=
BOG_CLIENT_SECRET=
```

## Notes

- Default locale `ka` uses no URL prefix (`/books` = Georgian). English uses `/en/books`.
- Tailwind cool palette: CSS vars in `app/globals.css`. Primary = teal-600, accent = cyan, emerald for success/checks.
- `components/ui/button.tsx` has a `cool` variant (gradient teal→cyan→emerald) used for all CTAs.
- Math render: `<MixedText text="..." />` auto-splits `$...$` inline LaTeX. `<MathRender inline>` or block.
- `lib/mock-data.ts` is the data source for all Phase 1 pages — replace with DB calls in Phase 2.
