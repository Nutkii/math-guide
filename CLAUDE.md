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
- [x] API routes: `/api/books`, `/api/problems`, `/api/solutions`, `/api/tutors`
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

### ⬜ Phase 4 — AI (Groq)
`groq-sdk` + `@ai-sdk/groq`, streaming chat, subscription gate, rate limiting (Upstash Redis 50 msg/day), conversation history.

### ⬜ Phase 5 — Payments (TBC + BOG)
$5/mo subscription + tutor hourly in GEL. `lib/payments/tbc.ts` + `lib/payments/bog.ts`, Vercel Cron for recurring, HMAC webhook, NBG FX rate.

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
GROQ_API_KEY=
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=
UPLOADTHING_TOKEN=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
TBC_CLIENT_ID=
TBC_CLIENT_SECRET=
TBC_MERCHANT_ID=
BOG_CLIENT_ID=
BOG_CLIENT_SECRET=
```

## Notes

- `ka` locale = no URL prefix. `en` = `/en/...`.
- Tailwind cool palette in `app/globals.css`. Primary = teal-600, accent = cyan, emerald = success.
- Button `cool` variant = gradient teal→cyan→emerald (all CTAs).
- `<MixedText text="..." />` auto-splits `$...$` inline LaTeX.
- `lib/mock-data.ts` = Phase 1 data source — replace with DB calls in Phase 2.
