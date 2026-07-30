"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

type SubStatus = "active" | "trialing" | "cancelled" | "expired" | null;

export function SubscriptionCard({ status }: { status: SubStatus }) {
  const router = useRouter();
  const t = useTranslations("subscription");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const STATUS_LABEL: Record<Exclude<SubStatus, null>, string> = {
    active: t("statusActive"),
    trialing: t("statusTrialing"),
    cancelled: t("statusCancelled"),
    expired: t("statusExpired"),
  };

  const isSubscribed = status === "active" || status === "trialing";

  async function handleSubscribe() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/payments/flitt/checkout", { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? t("checkoutFailed"));
      window.location.href = data.checkoutUrl;
    } catch (e) {
      setError(e instanceof Error ? e.message : t("genericError"));
      setLoading(false);
    }
  }

  async function handleCancel() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/payments/flitt/cancel", { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? t("cancelFailed"));
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : t("genericError"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-2 text-sm">
      <Badge variant="cool">{status ? STATUS_LABEL[status] : t("freePlan")}</Badge>
      {isSubscribed ? (
        <Button
          variant="link"
          size="sm"
          className="h-auto p-0"
          onClick={handleCancel}
          disabled={loading}
        >
          {t("cancelBtn")}
        </Button>
      ) : (
        <Button
          variant="link"
          size="sm"
          className="h-auto p-0"
          onClick={handleSubscribe}
          disabled={loading}
        >
          {t("subscribeBtn")}
        </Button>
      )}
      {error && <span className="text-xs text-destructive">{error}</span>}
    </div>
  );
}
