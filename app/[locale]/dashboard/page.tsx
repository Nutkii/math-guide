import { getTranslations } from "next-intl/server";
import { FileText, CreditCard, CalendarCheck, MessageSquare } from "lucide-react";
import { Link } from "@/i18n/routing";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { VerificationBadge } from "@/components/ui/verification-badge";
import { auth } from "@/auth";
import { connectDB } from "@/lib/db";
import TutorProfile from "@/models/TutorProfile";
import Subscription from "@/models/Subscription";
import { SubscriptionCard } from "@/components/dashboard/subscription-card";

export default async function DashboardPage() {
  const t = await getTranslations("dashboard");
  const session = await auth();
  const role = (session?.user as { role?: string })?.role;
  const name = session?.user?.name ?? "";
  const initial = name ? name[0].toUpperCase() : "?";

  let tutorProfile: { approved: boolean; rejectionReason?: string } | null = null;
  let subscriptionStatus: "active" | "trialing" | "cancelled" | "expired" | null = null;
  if (session?.user) {
    await connectDB();
    const userId = (session.user as { id: string }).id;
    if (role === "tutor") {
      tutorProfile = await TutorProfile.findOne(
        { userId },
        { approved: 1, rejectionReason: 1 }
      ).lean();
    }
    const subscription = await Subscription.findOne({ userId }, { status: 1 }).lean();
    subscriptionStatus =
      (subscription?.status as typeof subscriptionStatus) ?? null;
  }

  const tiles = [
    {
      key: "myUploads",
      icon: FileText,
      desc: "Track problems you submitted.",
      href: "/dashboard/uploads",
    },
    {
      key: "subscription",
      icon: CreditCard,
      desc: "Manage your AI plan.",
      href: "/dashboard/subscription",
    },
    {
      key: "bookings",
      icon: CalendarCheck,
      desc: "Upcoming tutor sessions.",
      href: "/dashboard/bookings",
    },
    {
      key: "chats",
      icon: MessageSquare,
      desc: "Recent AI conversations.",
      href: "/dashboard/chats",
    },
  ] as const;

  return (
    <div className="container max-w-5xl py-12 space-y-10">
      <header className="flex items-center gap-4">
        <Avatar className="h-14 w-14">
          <AvatarFallback className="text-lg">{initial}</AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-2xl font-bold">{t("title")}</h1>
          <div className="mt-1 flex flex-wrap items-center gap-2 text-sm">
            <SubscriptionCard status={subscriptionStatus} />
            {tutorProfile && (
              <VerificationBadge status={tutorProfile.approved} />
            )}
          </div>
        </div>
      </header>

      {tutorProfile && !tutorProfile.approved && (
        <Card className="border-amber-500/30 bg-amber-500/5">
          <CardContent className="py-4 text-sm text-amber-700 dark:text-amber-300">
            {t("tutorPendingNotice")}
          </CardContent>
        </Card>
      )}
      {tutorProfile?.rejectionReason && (
        <Card className="border-destructive/30 bg-destructive/5">
          <CardContent className="py-4 text-sm text-destructive">
            {t("tutorRejectedNotice")}: {tutorProfile.rejectionReason}
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        {tiles.map((tile) => {
          const Icon = tile.icon;
          return (
            <Link key={tile.key} href={tile.href} className="group">
              <Card className="h-full transition-all group-hover:border-primary/40 group-hover:ring-glow">
                <CardHeader>
                  <div className="mb-2 grid h-10 w-10 place-items-center rounded-lg bg-gradient-to-br from-teal-500/15 to-emerald-500/15 text-primary">
                    <Icon className="h-5 w-5" />
                  </div>
                  <CardTitle>{t(tile.key)}</CardTitle>
                  <CardDescription>{tile.desc}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-muted-foreground">
                    Empty — start using the app
                  </p>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
