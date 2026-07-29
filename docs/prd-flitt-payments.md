# PRD — Flitt Payments (Phase 5, replaces TBC/BOG plan)

## Goal

One product: AI chat subscription, **5 GEL/month, first month free**, auto-renewing. Implement via Flitt hosted checkout (Scheme B: host-to-host `checkout_url` creation) + `subscription=Y` recurring billing.

## Why Flitt (not TBC/BOG)

CLAUDE.md Phase 5 originally scoped TBC + BOG. User has now obtained Flitt merchant credentials and wants Flitt instead. This PRD supersedes that section; CLAUDE.md will be updated once implemented.

## Credentials

User-supplied (real merchant account, not the public `1549901`/`test` sandbox pair):

| Env var | Value role |
|---|---|
| `FLITT_MERCHANT_ID` | `merchant_id` on every request |
| `FLITT_PAYMENT_KEY` | purchase secret — signs/verifies checkout, subscription, callback requests |
| `FLITT_CREDIT_KEY` | payout/credit secret — **not used** by the subscription flow; stored for future refund/payout work only |

Stored server-side only in `.env.local` (gitignored) — never sent to client, never logged, never committed. Added to CLAUDE.md's env var list.

**Open question for user:** are these live production credentials, or a merchant-specific sandbox? Recommend running the full flow once against Flitt's public test pair (`merchant_id=1549901`, secret `test`) to validate signature/callback plumbing before pointing at the real merchant_id, since a bug in production could charge real cards.

## Data model

Extend `models/Subscription.ts`:
- `provider` enum: add `"flitt"` → `["tbc", "bog", "flitt"]`
- Add `flittOrderId` (string) — the merchant `order_id` sent to Flitt, used as the idempotency/lookup key for callbacks and for `/api/subscription` start/stop.
- Existing `status` (`active|cancelled|expired|trialing`) and `currentPeriodEnd` reused as-is.

## Flow

1. **User clicks "Subscribe"** (`/dashboard` or `/chat` paywall) → `POST /api/payments/flitt/checkout`.
   - Server generates `order_id` (e.g. `sub_<userId>_<timestamp-ish counter>` — no `Date.now()` inside signature helper itself, but this is a normal route handler so real timestamps are fine here).
   - Builds signed request: `merchant_id`, `order_id`, `currency=GEL`, `amount=500` (5 GEL in tetri), `order_desc`, `subscription=Y`, `recurring_data: { period: "month", every: 1, amount: 500, trial_period: "month", trial_quantity: 1, quantity omitted / state: "hidden" }`, `response_url`, `server_callback_url`.
   - POSTs to `https://pay.flitt.com/api/checkout/url/`, receives `checkout_url`.
   - Persists local `Subscription` doc: `status: "trialing"`, `provider: "flitt"`, `flittOrderId`.
   - Returns `checkout_url` to client; client redirects browser there.
2. **Customer pays on Flitt hosted page** (or approves trial setup, since amount charged today may be 0 during trial — confirm with Flitt sandbox test).
3. **Flitt redirects customer** to `response_url` (e.g. `/dashboard?flitt=return`) — display-only, not trusted for state.
4. **Flitt calls `server_callback_url`** (`POST /api/payments/flitt/callback`) — the source of truth:
   - Verify signature (SHA1, sorted non-empty flat params, exclude `signature`/`response_signature_string`).
   - Look up `Subscription` by `flittOrderId`.
   - Idempotent update: on `order_status: "approved"` → `status: "active"`, set `currentPeriodEnd`; on decline/failure → leave `trialing`/log, do not activate.
   - Return `200 OK` fast; no slow synchronous work.
5. **Cancel** — `POST /api/payments/flitt/cancel` (user-initiated from dashboard) → signed `POST /api/subscription` with `action=stop`, `order_id=flittOrderId` → on success set local `status: "cancelled"`.

## New files

- `lib/payments/flitt.ts` — `signParams()`, `verifySignature()`, `createSubscriptionCheckout()`, `startStopSubscription()`. SHA1 signing exactly per `references/signature.md` (flat params only; `recurring_data` nested object is NOT part of the flat signature set per Flitt docs — verify this empirically against a real response before trusting for production).
- `app/api/payments/flitt/checkout/route.ts` — session-gated, creates order + checkout_url.
- `app/api/payments/flitt/callback/route.ts` — public, signature-verified, idempotent.
- `app/api/payments/flitt/cancel/route.ts` — session-gated, stops subscription.

## Out of scope (this PRD)

- Refunds/reversals, captures, saved-card `/api/recurring` direct charges, Apple/Google Pay specifics, direct card entry (PCI). Payout key unused until payouts are needed.
- Upstash rate limiting, conversation history — separate Phase 4 items already tracked in CLAUDE.md.

## Testing plan — results (2026-07-28)

Ran directly against the live sandbox merchant `4057744` (user confirmed this is a sandbox/test merchant, safe to hit directly):

1. **Plain checkout create** (no `recurring_data`), flat-signed — ✅ real `checkout_url` + `payment_id` returned. Confirms `signFlat()` is correct for every flat-only endpoint.
2. **`/api/subscription` start/stop**, flat-signed — ✅ `{"ok":true}` end to end through the app's own `/api/payments/flitt/cancel` route.
3. **Callback signature verification** — ✅ hand-built a correctly-signed fake callback matching `references/callbacks.md`'s payload shape, POSTed to `/api/payments/flitt/callback`, confirmed `Subscription.status` flips to `active` with `currentPeriodEnd` set.
4. **Idempotency** — ✅ replaying the identical `payment_id` is a true no-op (verified via `updatedAt` unchanged); a callback with a new `payment_id` (simulating a monthly renewal) correctly advances `currentPeriodEnd` and updates `flittLastPaymentId`.
5. **Subscription checkout create** (`subscription: "Y"` + `recurring_data`) — ❌ **`"Invalid signature"` (`error_code: 1014`)** on every attempt. Tried: JSON-stringify insertion order, JSON-stringify sorted keys, base64(JSON) in both orderings, dot-prefixed flatten merged with top-level params, duplicate-key flatten (both `amount`s kept), and excluding `recurring_data` from the signature entirely while still sending it in the payload. None produced a valid signature against the live API. This is a hard blocker — not a guessable encoding bug — and needs either a Flitt support ticket or a look at Flitt's official SDK source (not available to this session) to get the real nested-object canonicalization.
6. Not yet run: end-to-end browser checkout (blocked by #5 — there's no valid subscription-create request to redirect the customer to yet).

Also found and fixed during this pass: the callback handler's original `active`-transition guard (`status !== "active"`) meant renewal callbacks after the first approval were silently ignored and `currentPeriodEnd` would never advance in production. Fixed to dedupe on `payment_id` instead (new `flittLastPaymentId` field on `Subscription`).

## Risks / things confirmed with user before writing code

- 5 GEL = `amount: 500` (tetri) — confirmed.
- Trial modeling: Flitt-native `trial_period: month, trial_quantity: 1` — confirmed, chosen over app-side trial.
- `response_url` → `/dashboard?flitt=return` — confirmed.

## Open blocker

Subscription checkout-create signing (item 5 above) needs to be resolved before this feature can go live. Suggested next steps, in order:
1. Ask Flitt support directly for a worked signature example for a `recurring_data`-bearing request against merchant `4057744` (their own docs don't specify it, and blind guessing against the live API has been exhausted for the obvious encodings).
2. Check if Flitt publishes an official server-side SDK (PHP/Node/Python) — reading its signature-building code would settle this in minutes instead of more guessing.
3. As a fallback, ask whether Flitt's dashboard/merchant portal supports creating recurring/subscription products through a UI flow that sidesteps raw API signing.
