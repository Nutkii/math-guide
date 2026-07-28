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
  const resolved: VerificationStatus =
    typeof status === "boolean" ? (status ? "verified" : "pending") : status;

  const config = {
    verified: {
      label: "Verified",
      icon: BadgeCheck,
      className:
        "border-transparent bg-gradient-to-r from-teal-500/15 to-emerald-500/15 text-teal-700 dark:text-teal-300 ring-1 ring-inset ring-teal-500/30",
    },
    pending: {
      label: "Pending verification",
      icon: Clock,
      className:
        "border-transparent bg-amber-500/15 text-amber-700 dark:text-amber-300 ring-1 ring-inset ring-amber-500/30",
    },
    rejected: {
      label: "Rejected",
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
