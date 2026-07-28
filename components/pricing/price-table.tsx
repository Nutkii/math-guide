"use client";

import { useTranslations } from "next-intl";
import { Check, Sparkles, GraduationCap, Library } from "lucide-react";
import { Link } from "@/i18n/routing";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

type Plan = {
  key: "free" | "ai" | "tutor";
  price: string;
  unitKey: "monthly" | "hourly";
  highlight?: boolean;
  trialNote?: boolean;
  icon: React.ReactNode;
  href: string;
};

const plans: Plan[] = [
  {
    key: "free",
    price: "₾0",
    unitKey: "monthly",
    icon: <Library className="h-5 w-5" />,
    href: "/register",
  },
  {
    key: "ai",
    price: "₾5",
    unitKey: "monthly",
    highlight: true,
    trialNote: true,
    icon: <Sparkles className="h-5 w-5" />,
    href: "/register?plan=ai",
  },
  {
    key: "tutor",
    price: "₾50+",
    unitKey: "hourly",
    icon: <GraduationCap className="h-5 w-5" />,
    href: "/tutors",
  },
];

export function PriceTable() {
  const t = useTranslations("pricing");

  return (
    <div className="grid gap-6 md:grid-cols-3">
      {plans.map((plan) => {
        const features = t.raw(
          `plans.${plan.key}.features`,
        ) as readonly string[];
        return (
          <Card
            key={plan.key}
            className={
              plan.highlight
                ? "relative overflow-hidden border-primary/50 ring-glow"
                : "relative overflow-hidden"
            }
          >
            {plan.highlight && (
              <>
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-teal-500/10 via-cyan-500/5 to-emerald-500/10" />
                <div className="absolute right-4 top-4">
                  <Badge variant="cool">★</Badge>
                </div>
              </>
            )}
            <CardHeader>
              <div className="mb-3 grid h-10 w-10 place-items-center rounded-lg bg-gradient-to-br from-teal-500/15 to-emerald-500/15 text-primary">
                {plan.icon}
              </div>
              <CardTitle>{t(`plans.${plan.key}.name`)}</CardTitle>
              <CardDescription>{t(`plans.${plan.key}.desc`)}</CardDescription>
              <div className="pt-3">
                <span className="text-4xl font-bold tracking-tight">
                  {plan.price}
                </span>
                <span className="ml-1 text-sm text-muted-foreground">
                  {t(plan.unitKey)}
                </span>
              </div>
              {plan.trialNote && (
                <Badge variant="cool" className="mt-2 w-fit">
                  {t("firstMonthFree")}
                </Badge>
              )}
            </CardHeader>
            <CardContent>
              <ul className="space-y-2.5 text-sm">
                {features.map((f) => (
                  <li key={f} className="flex items-start gap-2">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button
                asChild
                variant={plan.highlight ? "cool" : "outline"}
                className="w-full"
              >
                <Link href={plan.href}>{t("cta")}</Link>
              </Button>
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
}
