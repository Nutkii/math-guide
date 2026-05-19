# Math Guide — Claude Progress Tracker

Georgian math textbook solutions platform. Full plan in [plan.md](./plan.md).

## Stack

- Next.js 15 (App Router) + TypeScript
- Tailwind CSS v3 + shadcn/ui (manual primitives)
- MongoDB Atlas + Mongoose (Phase 2+)
- NextAuth.js v5 (Phase 3)
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

### ⬜ Phase 2 — Backend + Mongoose
**Status: NOT STARTED**

Goal: real data layer, CRUD APIs, file uploads.

- [ ] MongoDB Atlas cluster + `lib/db.ts` singleton
- [ ] Models: User, Book, Chapter, Problem, Solution, TutorProfile, Subscription, Booking, Payment
- [ ] API routes: `/api/books`, `/api/problems`, `/api/solutions`, `/api/tutors`
- [ ] File uploads (UploadThing or R2 presigned)
- [ ] Shared zod schemas in `lib/validations/`
- [ ] Seed script `scripts/seed.ts`
- [ ] Wire all pages to real data (replace mock imports)

---

### ⬜ Phase 3 — Auth Module
**Status: NOT STARTED**

Goal: real users, role gating.

- [ ] `next-auth@beta` + `@auth/mongodb-adapter` + `bcryptjs`
- [ ] Credentials provider + Google OAuth
- [ ] JWT session with role + locale
- [ ] `middleware.ts` protect `/dashboard`, `/chat`, `/problems/new`
- [ ] Register API route
- [ ] Role guards: `student | tutor | admin`
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

## Environment Variables (needed per phase)

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
