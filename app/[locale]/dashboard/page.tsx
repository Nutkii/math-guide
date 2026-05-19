import { useTranslations } from "next-intl";
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
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function DashboardPage() {
  const t = useTranslations("dashboard");

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
          <AvatarFallback className="text-lg">N</AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-2xl font-bold">{t("title")}</h1>
          <div className="mt-1 flex items-center gap-2 text-sm">
            <Badge variant="cool">Free plan</Badge>
            <Button asChild variant="link" size="sm" className="h-auto p-0">
              <Link href="/pricing">Upgrade to AI Pro →</Link>
            </Button>
          </div>
        </div>
      </header>

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
