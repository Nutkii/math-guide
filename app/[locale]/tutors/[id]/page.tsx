import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { Star, CalendarDays } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { VerificationBadge } from "@/components/ui/verification-badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { BookingSchedule } from "@/components/tutor/booking-schedule";
import { formatGEL } from "@/lib/utils";
import { subjectKey } from "@/lib/subject-labels";
import { getTutorByIdDB } from "@/lib/db-data";

export default async function TutorPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  const tutor = await getTutorByIdDB(id);
  if (!tutor) notFound();

  const t = await getTranslations({ locale, namespace: "tutor" });
  const ts = await getTranslations({ locale, namespace: "subjects" });

  const initials = tutor.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2);

  return (
    <div className="container max-w-4xl py-12 space-y-8">
      <header className="flex flex-col gap-6 md:flex-row md:items-center">
        <Avatar className="h-24 w-24">
          <AvatarFallback className="text-2xl">{initials}</AvatarFallback>
        </Avatar>
        <div className="flex-1 space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="font-serif text-3xl font-bold">{tutor.name}</h1>
            <VerificationBadge status={tutor.approved ?? true} />
          </div>
          <div className="flex flex-wrap items-center gap-3 text-sm">
            <span className="inline-flex items-center gap-1">
              <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
              <strong>{tutor.rating.toFixed(2)}</strong>
              <span className="text-muted-foreground">
                ({tutor.reviewCount} {t("reviews")})
              </span>
            </span>
            <span className="text-muted-foreground">·</span>
            <span className="font-semibold text-primary">
              {formatGEL(tutor.hourlyRateGEL)} {t("perHour")}
            </span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {tutor.subjects.map((s) => (
              <Badge key={s} variant="cool">
                {ts(subjectKey(s))}
              </Badge>
            ))}
          </div>
        </div>
      </header>

      <Card>
        <CardHeader>
          <h2 className="font-semibold">{t("about")}</h2>
        </CardHeader>
        <CardContent>
          <p className="text-sm leading-relaxed text-muted-foreground">
            {tutor.bio}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <h2 className="flex items-center gap-2 font-semibold">
            <CalendarDays className="h-4 w-4 text-primary" />
            {t("availableSlots")}
          </h2>
        </CardHeader>
        <CardContent>
          <BookingSchedule
            tutorId={tutor.id}
            durationMin={60}
            upcomingDays={tutor.upcomingSlots}
          />
        </CardContent>
      </Card>
    </div>
  );
}
