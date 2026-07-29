"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

type SubStatus = "active" | "trialing" | "cancelled" | "expired" | null;

const STATUS_LABEL: Record<Exclude<SubStatus, null>, string> = {
  active: "AI Pro",
  trialing: "AI Pro (trial)",
  cancelled: "Cancelled",
  expired: "Expired",
};

export function SubscriptionCard({ status }: { status: SubStatus }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isSubscribed = status === "active" || status === "trialing";

  async function handleSubscribe() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/payments/flitt/checkout", { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to start checkout");
      window.location.href = data.checkoutUrl;
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
      setLoading(false);
    }
  }

  async function handleCancel() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/payments/flitt/cancel", { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to cancel subscription");
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-2 text-sm">
      <Badge variant="cool">{status ? STATUS_LABEL[status] : "Free plan"}</Badge>
      {isSubscribed ? (
        <Button
          variant="link"
          size="sm"
          className="h-auto p-0"
          onClick={handleCancel}
          disabled={loading}
        >
          Cancel subscription
        </Button>
      ) : (
        <Button
          variant="link"
          size="sm"
          className="h-auto p-0"
          onClick={handleSubscribe}
          disabled={loading}
        >
          Subscribe — 5 GEL/mo (first month free) →
        </Button>
      )}
      {error && <span className="text-xs text-destructive">{error}</span>}
    </div>
  );
}
