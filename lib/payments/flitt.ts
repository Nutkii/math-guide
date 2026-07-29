import crypto from "crypto";

const FLITT_BASE_URL = "https://pay.flitt.com";

function getFlittConfig() {
  const merchantId = process.env.FLITT_MERCHANT_ID;
  const paymentKey = process.env.FLITT_PAYMENT_KEY;
  if (!merchantId || !paymentKey) {
    throw new Error("FLITT_MERCHANT_ID / FLITT_PAYMENT_KEY not set");
  }
  return { merchantId: Number(merchantId), paymentKey };
}

type FlatParams = Record<string, string | number | boolean | undefined | null>;

// SHA1 over secret|sorted-nonempty-values, per references/signature.md.
// Nested objects (only recurring_data, on subscription-create requests) are
// JSON.stringify'd with an explicit key order by the caller — Flitt's public
// docs don't fully specify nested-object signing, so this path is unverified
// against a live sandbox response (see docs/prd-flitt-payments.md "Testing
// plan" step 1 — confirm before trusting in production).
function signFlat(secret: string, params: Record<string, unknown>): string {
  const keys = Object.keys(params)
    .filter((k) => k !== "signature" && k !== "response_signature_string")
    .filter((k) => params[k] !== "" && params[k] !== null && params[k] !== undefined)
    .sort();
  const values = keys.map((k) => {
    const v = params[k];
    return typeof v === "object" ? JSON.stringify(v) : String(v);
  });
  const raw = [secret, ...values].join("|");
  return crypto.createHash("sha1").update(raw, "utf8").digest("hex");
}

export function signRequest(params: FlatParams, secret = getFlittConfig().paymentKey): string {
  return signFlat(secret, params);
}

export function verifyCallbackSignature(
  payload: Record<string, unknown>,
  secret = getFlittConfig().paymentKey
): boolean {
  const { signature } = payload as { signature?: string };
  if (!signature) return false;
  const expected = signFlat(secret, payload);
  return expected === signature;
}

async function postFlitt<T>(path: string, request: Record<string, unknown>): Promise<T> {
  const res = await fetch(`${FLITT_BASE_URL}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ request }),
  });
  const json = await res.json();
  return (json.response ?? json) as T;
}

export interface CreateSubscriptionCheckoutParams {
  orderId: string;
  amountTetri: number;
  orderDesc: string;
  responseUrl: string;
  callbackUrl: string;
}

export interface FlittCheckoutUrlResponse {
  response_status: string;
  checkout_url?: string;
  order_id?: string;
  error_message?: string;
}

export async function createSubscriptionCheckout(
  params: CreateSubscriptionCheckoutParams
): Promise<FlittCheckoutUrlResponse> {
  const { merchantId, paymentKey } = getFlittConfig();

  const recurringData = {
    every: 1,
    period: "month",
    amount: params.amountTetri,
    state: "hidden",
    trial_period: "month",
    trial_quantity: 1,
  };

  const request: Record<string, unknown> = {
    order_id: params.orderId,
    merchant_id: merchantId,
    currency: "GEL",
    amount: params.amountTetri,
    order_desc: params.orderDesc,
    subscription: "Y",
    recurring_data: recurringData,
    response_url: params.responseUrl,
    server_callback_url: params.callbackUrl,
  };
  request.signature = signFlat(paymentKey, request);

  return postFlitt<FlittCheckoutUrlResponse>("/api/checkout/url/", request);
}

export interface SubscriptionActionResponse {
  response_status: string;
  status?: "active" | "disabled";
  order_id?: string;
  error_message?: string;
}

export async function startStopSubscription(
  orderId: string,
  action: "start" | "stop"
): Promise<SubscriptionActionResponse> {
  const { merchantId, paymentKey } = getFlittConfig();
  const request: Record<string, unknown> = {
    order_id: orderId,
    merchant_id: merchantId,
    action,
  };
  request.signature = signFlat(paymentKey, request);

  return postFlitt<SubscriptionActionResponse>("/api/subscription", request);
}
