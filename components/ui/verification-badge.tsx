"use client";

import { useTranslations } from "next-intl";
import { BadgeCheck, Clock, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type VerificationStatus = "verified" | "pending" | "rejected";

export function VerificationBadge({
  status,
  className,
}: {
  status: VerificationStatus | boolean;
  className?: string;
}) {
  const t = useTranslations("tutor");
  const resolved: VerificationStatus =
    typeof status === "boolean" ? (status ? "verified" : "pending") : status;

  const config = {
    verified: {
      label: t("verified"),
      icon: BadgeCheck,
      className:
        "border-transparent bg-gradient-to-r from-teal-500 via-cyan-500 to-emerald-500 text-white shadow-md shadow-emerald-500/30 font-bold",
    },
    pending: {
      label: t("pendingVerification"),
      icon: Clock,
      className:
        "border-transparent bg-amber-500/15 text-amber-700 dark:text-amber-300 ring-1 ring-inset ring-amber-500/30",
    },
    rejected: {
      label: t("rejected"),
      icon: XCircle,
      className:
        "border-transparent bg-destructive/15 text-destructive ring-1 ring-inset ring-destructive/30",
    },
  }[resolved];

  const Icon = config.icon;

  return (
    <Badge className={cn("gap-1", config.className, className)}>
      <Icon className="h-3 w-3" />
      {config.label}
    </Badge>
  );
}
