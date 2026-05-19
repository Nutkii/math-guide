# Math Guide GE — Technical Plan

Georgian math books solutions platform. Users browse, upload problems + solutions, chat with AI, book tutors.

## Stack

- **Framework**: Next.js 15 (App Router) + TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **Database**: MongoDB Atlas + Mongoose
- **Auth**: NextAuth.js (Auth.js v5) + MongoDB adapter
- **AI**: Groq API (Llama 3.3 70B, free tier)
- **Payments**: TBC + BOG (Georgian acquirers)
- **i18n**: next-intl, locales `ka` (default) + `en`
- **Math render**: KaTeX
- **File storage**: UploadThing or Cloudflare R2
- **Deploy**: Vercel + Atlas + Upstash Redis + R2

---

## Phase 1 — Frontend Shell (no data)

Goal: clickable UI with mock data. No DB, no auth.

1. **Bootstrap**
   - `npx create-next-app@latest math-guide --typescript --tailwind --app --eslint`
   - `npx shadcn@latest init`
   - Install components: `button card input dialog dropdown-menu form sheet tabs avatar badge toast sonner select textarea label separator`
2. **i18n**
   - `npm i next-intl`
   - Routing `/[locale]/...`, locales `["ka","en"]`, default `ka`
   - `messages/ka.json` + `messages/en.json`
3. **Layout + theme**
   - Root layout: header (logo, nav, locale switcher, login slot), footer
   - `next-themes` for dark mode
   - Georgian font (Noto Sans Georgian / FiraGO) in Tailwind config
4. **Math rendering**
   - `npm i katex react-katex`
   - `<MathRender>` component for inline + block LaTeX
5. **Pages (static, mock data)**
   - `/` landing (hero, features, pricing)
   - `/books` grid + `/books/[slug]` detail with chapters
   - `/problems/[id]` problem view + solutions list
   - `/problems/new` upload form (image dropzone + textarea + live KaTeX preview)
   - `/pricing` (Free / $5 AI / Tutor)
   - `/tutors` directory + `/tutors/[id]` profile
   - `/dashboard` user shell (profile, my uploads, subscription, sessions)
   - `/login`, `/register` UI only
   - `/chat` AI chat UI (visually gated)
6. **Components**
   - `ProblemCard`, `SolutionBlock`, `MathRender`, `BookCover`, `TutorCard`, `PriceTable`, `LocaleSwitcher`
7. **Forms**
   - `react-hook-form` + `zod` client-side validation
8. **Deliverable**: deploy to Vercel preview. All flows navigable. No persistence.

---

## Phase 2 — Backend + Mongoose

Goal: real data, CRUD APIs.

1. **MongoDB**
   - MongoDB Atlas free cluster
   - `npm i mongoose`
   - `lib/db.ts` cached singleton (hot-reload safe)
2. **Models** (`models/`)
   - `User` — email, name, role (`student|tutor|admin`), passwordHash, locale, createdAt
   - `Book` — title (ka/en), grade, publisher, coverUrl, slug
   - `Chapter` — bookId, number, title (ka/en)
   - `Problem` — bookId, chapterId, number, statementMd, statementImages[], authorId, status (`pending|approved|rejected`), createdAt
   - `Solution` — problemId, authorId, contentMd, images[], upvotes, createdAt
   - `TutorProfile` — userId, bio, subjects[], hourlyRateGEL, availability (weekly slots), rating
   - `Subscription` — userId, plan, status, provider, providerSubId, cardToken, currentPeriodEnd
   - `Booking` — studentId, tutorId, startAt, durationMin, status, externalMeetUrl, priceGEL, paymentId
   - `Payment` — userId, provider (`tbc|bog`), providerTxnId, amount, currency, type (`subscription|booking`), status
3. **API routes** (`app/api/*`)
   - `/api/books`, `/api/books/[slug]`
   - `/api/problems`, `/api/problems/[id]`
   - `/api/solutions`
   - `/api/tutors`
   - Pagination `?page=&limit=`, filtering by book/chapter/grade
4. **File uploads**
   - UploadThing or R2 + presigned URLs
   - `/api/upload` → signed URL → client PUT → store final URL on doc
5. **Validation**
   - Shared `zod` schemas in `lib/validations/`
6. **Seed**
   - `scripts/seed.ts` — sample books + chapters + problems
7. **Wire frontend** — swap mock data for real fetch / server components
8. **Deliverable**: full CRUD works (still unauthenticated). Admin endpoints stubbed.

---

## Phase 3 — Auth Module (NextAuth.js)

Goal: real users, role gating.

1. **Install** `next-auth@beta` + `@auth/mongodb-adapter` + `bcryptjs`
2. **Providers**
   - Credentials (email + password, bcrypt hash)
   - Google OAuth (one-click)
3. **Session**: JWT strategy, role + locale injected in token
4. **Files**
   - `auth.config.ts` — providers, `jwt` + `session` callbacks
   - `auth.ts` — `NextAuth(authConfig)` export
   - `middleware.ts` — protect `/dashboard`, `/chat`, `/problems/new`, `/api/protected/*`
5. **Register**
   - `/api/auth/register` — zod validate → bcrypt hash → `User.create` → auto sign-in
6. **Role guards**
   - `lib/auth/guards.ts` → `requireRole(role)` helper
   - Tutor routes: `role === "tutor"`
   - Admin routes: `role === "admin"`
7. **Problem moderation**
   - Uploads default `status: pending` → admin approves
8. **Email verification** (optional MVP)
   - Resend free tier + magic-link or token
9. **Deliverable**: register/login works, protected routes enforced.

---

## Phase 4 — AI Integration (Groq)

Goal: $5/mo subscribers chat with Llama for problem help.

1. **SDK**
   - `npm i groq-sdk ai @ai-sdk/groq`
   - Env `GROQ_API_KEY`
2. **Subscription gate** (stub flag for now)
   - Middleware checks `user.subscription.status === "active"` before `/api/chat`
3. **Chat API** `/api/chat/route.ts`
   - POST `{ messages, problemId? }` → if `problemId`, fetch problem statement + approved solutions, inject into system context
   - System prompt: tutor persona, explain step by step in user locale (ka/en), inline LaTeX `$...$`, guide not give final answer
   - Stream via Vercel AI SDK SSE
   - Model: `llama-3.3-70b-versatile`
4. **Persistence**
   - `Conversation` + `Message` Mongoose models
   - `/dashboard/chats` lists past chats
5. **Rate limit**
   - Upstash Redis free tier, 50 msg/day on $5 plan
6. **Frontend**
   - `/chat` standalone
   - `/problems/[id]` "Ask AI" button preloads problem context
   - KaTeX render assistant messages
7. **Deliverable**: gated streaming chat works end-to-end, math renders.

---

## Phase 5 — Payments (TBC + BOG)

Goal: real $5/mo subscription + tutor hourly payments. GEL primary currency.

1. **Merchant accounts**
   - Apply TBC E-commerce + BOG Acquiring (requires GE legal entity / sole proprietor)
2. **TBC integration** `lib/payments/tbc.ts`
   - Auth → register order → 3DS redirect URL → callback → save card token → recurring charge
3. **BOG integration** `lib/payments/bog.ts`
   - Order → callback → store token → recurring
4. **Provider selector** at checkout (user picks TBC or BOG)
5. **Subscription flow**
   - `/api/billing/subscribe` → create order → redirect to bank 3DS → `/api/billing/callback/[provider]` → mark `Subscription` active + store token
   - Daily cron (Vercel Cron) charges users whose `currentPeriodEnd <= today` via stored token
6. **Webhooks/callbacks**
   - Verify HMAC signature per provider docs
   - Idempotency via `providerTxnId` dedupe
7. **Tutor booking payment**
   - Hourly × duration → one-time charge before slot confirmed
   - Hold until session done; refund on tutor no-show via admin tool
8. **FX**
   - $5 → GEL using daily NBG rate API, or fixed 13 GEL MVP
9. **Receipts** — Resend email + optional PDF
10. **Deliverable**: live money flow, subscription auto-renews, bookings paid.

---

## Phase 6 — Tutor Program

Goal: tutor onboarding + booking flow.

1. **Application** `/become-tutor` → form → admin approves → role upgrade to `tutor`
2. **Availability editor** `/dashboard/tutor/availability` — weekly recurring slots (day, start, end, durationMin)
3. **Booking calendar** on `/tutors/[id]`
   - Show next 14 days of free slots (availability − existing bookings)
   - Click slot → confirm + pay (Phase 5 flow)
4. **External meet link**
   - Tutor pastes Zoom/Meet link on confirmed booking
   - Later: auto-generate via Google Calendar API
   - Email reminders 24h + 1h before via Resend
5. **Session lifecycle**
   - `pending_payment → confirmed → completed → reviewed`
   - Auto-mark `completed` 30min after end time
6. **Reviews + ratings** on completed bookings (1-5 stars + text)
7. **Tutor payout** — manual transfer monthly MVP, admin dashboard tracks owed amount
8. **Deliverable**: full booking loop with payment.

---

## Phase 7 — Admin + Moderation

1. `/admin` dashboard
   - Pending problems queue (approve/reject with reason)
   - User list (ban, role change)
   - Tutor applications
   - Payments log
   - Tutor payout ledger
2. Content flags from users
3. Metrics: DAU, signups, MRR, problem count, AI msg volume

---

## Phase 8 — Polish + Launch

1. **SEO** — sitemap, OG images per problem, `ka`/`en` hreflang, structured data for problems
2. **Performance** — Next/Image, ISR on book + problem pages, edge runtime where viable
3. **Search** — MongoDB Atlas Search or Meilisearch (problem text, book, grade, chapter)
4. **Analytics** — Plausible (privacy-friendly)
5. **Errors** — Sentry free tier
6. **Legal** — Terms, Privacy, refund policy in ka + en
7. **Backups** — Atlas automated snapshots
8. **Production deploy** — Vercel + Atlas + Upstash + R2 + Resend

---

## Folder Layout

```
math-guide/
├── app/
│   ├── [locale]/
│   │   ├── (marketing)/        # landing, pricing
│   │   ├── (app)/              # books, problems, chat, dashboard, tutors
│   │   ├── (auth)/             # login, register
│   │   └── admin/
│   └── api/
│       ├── auth/[...nextauth]/
│       ├── books/, problems/, solutions/, tutors/
│       ├── chat/, upload/
│       └── billing/{subscribe,callback,webhook}/
├── components/
│   ├── ui/                     # shadcn primitives
│   ├── problem/, tutor/, chat/, layout/
├── lib/
│   ├── db.ts
│   ├── auth/
│   ├── payments/{tbc,bog,common}.ts
│   ├── ai/groq.ts
│   └── validations/
├── models/                     # mongoose schemas
├── messages/{ka,en}.json
├── scripts/seed.ts
├── middleware.ts
└── plan.md
```

---

## Environment Variables

```
MONGODB_URI=
NEXTAUTH_SECRET=
NEXTAUTH_URL=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GROQ_API_KEY=
UPLOADTHING_TOKEN=                # or R2_ACCESS_KEY_ID / R2_SECRET / R2_BUCKET / R2_ENDPOINT
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=
TBC_CLIENT_ID=
TBC_CLIENT_SECRET=
TBC_MERCHANT_ID=
BOG_CLIENT_ID=
BOG_CLIENT_SECRET=
RESEND_API_KEY=
SENTRY_DSN=
```

---

## Order of Operations

P1 frontend shell → P2 DB + CRUD → P3 auth → P4 AI (gated by stub flag) → P5 real payments unlock flag → P6 tutor booking reuses P5 → P7 admin → P8 polish + launch.

## Phase Acceptance Checklist

- [ ] P1: every page renders, locale switcher works, math previews, deployed to Vercel
- [ ] P2: seed loads, CRUD via API works, uploads land in storage
- [ ] P3: register/login + Google works, role guards block protected routes
- [ ] P4: subscriber chat streams Llama responses with problem context, rate limited
- [ ] P5: TBC + BOG sandbox charges succeed, recurring cron renews, callbacks idempotent
- [ ] P6: tutor application → approval → availability → booking → payment → meet link → review
- [ ] P7: admin moderates uploads, sees payments, tracks tutor payouts
- [ ] P8: SEO audit pass, Sentry wired, legal pages live, production go
