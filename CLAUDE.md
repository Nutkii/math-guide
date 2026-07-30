# CLAUDE.md

## Commands

```bash
npm run dev       # dev server (localhost:3000)
npm run build     # production build
npm run lint      # ESLint
npm run seed      # seed MongoDB (requires MONGODB_URI in .env.local)
```

## Architecture

**Routes:** All pages under `app/[locale]/`. `localePrefix: "as-needed"` — `ka` (default) has no prefix (`/books`), `en` uses `/en/books`.

**Middleware split:**
- `auth.config.ts` — Edge-safe (no Mongoose/bcrypt). Used in `middleware.ts`. Guards `/admin` (role=admin), `/dashboard`, `/chat`, `/problems/new`.
- `auth.ts` — Full NextAuth config. Import only in server components + API routes.
- `middleware.ts` — NextAuth check first, then next-intl locale routing.

**Key patterns:**
- `@/` maps to project root.
- `lib/db.ts` — Mongoose singleton via `global._mongoose`. Always `await connectDB()` before model queries.
- `types/next-auth.d.ts` — augments Session/JWT with `role: "student" | "tutor" | "admin"` and `id`.
- `lib/utils.ts` — exports `cn()` (clsx + tailwind-merge).
- `components/layout/providers.tsx` — wraps app with `SessionProvider`.
- Zod schemas in `lib/validations/`.
- shadcn: `npx shadcn@latest add <component>` → `components/ui/`.

## Stack

Next.js 15 + React 19 (App Router) + TypeScript · Tailwind v3 + shadcn/ui · MongoDB Atlas + Mongoose · NextAuth v5 beta · next-intl v4 (`ka` default) · KaTeX · Vercel

## Phase Progress

### ✅ Phase 1 — Frontend Shell
13 routes, shadcn primitives, mock data layer (`lib/mock-data.ts`), teal/cyan/emerald theme, ka/en i18n, KaTeX. Security: Next.js 15.5.18, next-intl 4.x.

### 🔶 Phase 2 — Backend + Mongoose
- [x] `lib/db.ts` singleton, models: User, Book, Chapter, Problem, Solution, TutorProfile, Subscription, Booking, Payment
- [x] API routes: `/api/problems`, `/api/solutions`, `/api/tutors`
- [x] Zod schemas in `lib/validations/`, seed script `scripts/seed.ts`
- [ ] File uploads (Cloudinary wired in `lib/cloudinary.ts`, upload route at `app/api/upload/`)
- [ ] Wire pages to real data (replace `lib/mock-data.ts`)

### 🔶 Phase 3 — Auth Module
- [x] NextAuth v5 beta + bcryptjs, Credentials provider, JWT role+id, register API
- [x] Middleware protects `/dashboard`, `/chat`, `/problems/new`, `/admin`
- [ ] Google OAuth, `@auth/mongodb-adapter`, role guards in UI, email verification (Resend)

### 🔶 Phase 7 — Admin Panel
- [x] `/admin` page with tabs: Metrics, Users, Tutors, Problems
- [x] User list: view all, change role (student/tutor/admin), delete
- [x] Tutor tab: view tutor profiles, approve/revoke `TutorProfile.approved`, demote to student
- [x] Problems queue: approve/reject pending problems with optional rejection reason
- [x] Metrics: total users, tutors, pending problems, total problems
- [x] Admin nav link in header (role-gated, teal)
- [ ] Ban/flag users, payments log, DAU/MRR metrics

### 🔶 Phase 4 — AI (OpenRouter)
`ai` + `@ai-sdk/react` + `@openrouter/ai-sdk-provider` (pivoted from the originally planned Groq stack). System prompt in `lib/ai/system-prompt.ts`, streaming route at `app/api/chat/route.ts` (session-gated via `auth()`), `/chat` page wired to `useChat`.
- [x] Streaming chat (`openai/gpt-4o-mini` via OpenRouter, single call, no draft/translate step needed — see history below)
- [x] Math-tutor system prompt (approved sources, step-by-step teaching style)
- [x] Route-level auth guard (401 if not logged in, backed by the now-fixed middleware guard)
- [ ] Subscription gate, rate limiting (Upstash Redis 50 msg/day), conversation history/persistence

History: originally shipped on `nvidia/nemotron-3-nano-30b-a3b:free`, with a draft-in-English-then-translate-to-Georgian path (`lib/ai/system-prompt.ts` had `ENGLISH_DRAFT_SYSTEM_PROMPT` + `GEORGIAN_TRANSLATION_SYSTEM_PROMPT`) to work around that model's Georgian output. That model turned out to be a reasoning model whose chain-of-thought regularly leaked into (or replaced) the visible answer once the task got harder than a one-liner — confirmed via raw `generateText` probes, independent of `reasoning: { effort }` caps; one translation-stage call burned 25,850 reasoning tokens and took 123s before returning a mostly-untranslated answer. Switched to `openai/gpt-4o-mini`, which produces clean, correct Georgian directly in a single call (verified: correct math, proper structure, zero reasoning-token overhead) — so the draft/translate machinery was removed as unneeded complexity. If cost becomes a concern, cheaper alternatives tested well in the OpenRouter catalog at the time: `meta-llama/llama-3.3-70b-instruct` ($0.13/$0.40 per M tokens) and `mistralai/mistral-small-3.2-24b-instruct` ($0.10/$0.30 per M) — not yet verified for Georgian quality specifically.

Known fragility: `components/problem/math-render.tsx`'s `MixedText` splits on a naive `/(\$[^$]+\$)/g` regex — no real LaTeX parsing. It only recognizes single `$...$`, not `$$...$$` (the system prompt now tells the model to never use `$$`, and to avoid Markdown `**`/`##` syntax it can't render). But if the model ever emits an odd number of `$` in one response (rare but not eliminated — observed once with `gpt-4o-mini`), the regex treats everything up to the *next* `$` as one giant math expression, which can swallow whole paragraphs (including Georgian prose) into KaTeX and render garbled, duplicated-looking text. Not touched further here since `MixedText` is shared with the problems/solutions pages — a real fix (e.g. a proper Markdown+KaTeX renderer) is a bigger change than this session's scope.

### 🔶 Phase 5 — Payments (Flitt)
5 GEL/mo AI-chat subscription (first month free via Flitt-native `recurring_data.trial_period/trial_quantity`, see `Subscription.status: "trialing"`). Pivoted from the originally planned TBC+BOG stack to Flitt (`lib/payments/flitt.ts`) — see `docs/prd-flitt-payments.md` for the full design and open risks.
- [x] `lib/payments/flitt.ts` — SHA1 request signing, callback verification, `createSubscriptionCheckout()` (Scheme B `/api/checkout/url/`), `startStopSubscription()`
- [x] `app/api/payments/flitt/checkout`, `/callback`, `/cancel` routes
- [x] `Subscription` model: `provider: "flitt"`, `flittOrderId`
- [x] Dashboard subscribe/cancel UI (`components/dashboard/subscription-card.tsx`)
- [x] Live-tested against the real sandbox merchant `4057744` (2026-07-28): plain flat-signed checkout create (`/api/checkout/url/`, no `recurring_data`) succeeds and returns a real `checkout_url`; `/api/subscription` start/stop (flat-only) succeeds; callback signature verification, idempotency-by-`payment_id`, and monthly `currentPeriodEnd` renewal-advance all verified with hand-signed fake callbacks
- [ ] **Blocked:** subscription-create (`recurring_data` present) still returns `"Invalid signature"` (`error_code: 1014`) — tried ~10 encodings of the nested object (JSON insertion/sorted order, base64, dot-prefixed flatten, merged/duplicate-key flatten, excluded entirely) against the live sandbox, none matched. This is the one remaining blocker before the AI subscription can actually be sold — needs Flitt support or their official SDK source to get the real algorithm; see `docs/prd-flitt-payments.md`
- [ ] Tutor hourly payments in GEL (separate flow, not yet designed)

Known risk (confirmed, not just theoretical): Flitt's public docs don't specify how the nested `recurring_data` object is folded into the SHA1 signature for subscription-create requests — only flat top-level params are unambiguous per `references/signature.md`/`references/subscriptions.md` from the `flitt-payments-skill` repo, and this was confirmed against the live API, not just inferred from docs. `signFlat()` in `lib/payments/flitt.ts` JSON-stringifies nested objects as a placeholder — known wrong, not just unverified. Everything else in the integration (plain checkout, callback, start/stop) uses flat-only signing and is confirmed correct live.

Bug fixed during this testing pass: the callback handler originally gated the `active` transition on `subscription.status !== "active"`, which meant a subscription would only ever pick up its *first* approval — subsequent monthly renewal callbacks (same `order_id`, new `payment_id`) would no-op and `currentPeriodEnd` would never advance. Fixed to dedupe on `flittLastPaymentId` instead (new model field), so renewals now correctly extend the period while true duplicate deliveries (Flitt's retry policy) remain a no-op.

### ⬜ Phase 6 — Tutor Program
`/become-tutor` → admin approval, availability editor, booking calendar, session lifecycle, reviews, payout ledger.

### ⬜ Phase 8 — Polish + Launch
SEO, ISR, search (Atlas/Meilisearch), Plausible, Sentry, legal pages, production deploy.

## Environment Variables

```
MONGODB_URI=
NEXTAUTH_SECRET=
NEXTAUTH_URL=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
RESEND_API_KEY=
OPENROUTER_API_KEY=
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=
UPLOADTHING_TOKEN=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
FLITT_MERCHANT_ID=
FLITT_PAYMENT_KEY=
FLITT_CREDIT_KEY=
```

## Notes

- `ka` locale = no URL prefix. `en` = `/en/...`.
- Tailwind cool palette in `app/globals.css`. Primary = teal-600, accent = cyan, emerald = success.
- Button `cool` variant = gradient teal→cyan→emerald (all CTAs).
- `<MixedText text="..." />` auto-splits `$...$` inline LaTeX.
- `lib/mock-data.ts` = Phase 1 data source — replace with DB calls in Phase 2.
- `middleware.ts` gates `/admin` (role=admin), `/dashboard`, `/chat`, `/problems/new` directly off `req.auth` inside the wrapped callback — `authConfig.callbacks.authorized` is intentionally unused (NextAuth v5 only auto-enforces it when `auth` itself is the default export, not when wrapped with a custom callback like this repo does to compose with next-intl).
- Public "Books" feature removed (nav link, `/books` pages, `/api/books`, `BookCover`/`BookGradeFilter`, mock `books` data) — the seeded books had fictional publishers (Klett/Intelekti/Bakur Sulakauri) implying real licensed textbooks, which was misleading. `Book`/`Chapter` Mongoose models and DB data are untouched (Problems are still organized by `bookSlug`/`chapterId` internally, and `getChaptersOverviewDB` still uses `BookModel` for grade-based sort order) — only the public-facing browsing UI is gone. Problem pages now show a chapter/topic breadcrumb (linking to `/problems?chapterId=...`) instead of a book link.
