import { notFound } from "next/navigation";
import { Star, CalendarDays } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { VerificationBadge } from "@/components/ui/verification-badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { formatGEL } from "@/lib/utils";
import { getTutorById } from "@/lib/mock-data";

const mockSlots = [
  "Mon · 18:00",
  "Tue · 17:00",
  "Tue · 19:00",
  "Thu · 16:00",
  "Fri · 18:30",
  "Sat · 11:00",
];

export default async function TutorPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { id } = await params;
  const tutor = getTutorById(id);
  if (!tutor) notFound();

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
            <h1 className="text-3xl font-bold">{tutor.name}</h1>
            <VerificationBadge status={tutor.approved ?? true} />
          </div>
          <div className="flex flex-wrap items-center gap-3 text-sm">
            <span className="inline-flex items-center gap-1">
              <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
              <strong>{tutor.rating.toFixed(2)}</strong>
              <span className="text-muted-foreground">
                ({tutor.reviewCount} reviews)
              </span>
            </span>
            <span className="text-muted-foreground">·</span>
            <span className="font-semibold text-primary">
              {formatGEL(tutor.hourlyRateGEL)} / hr
            </span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {tutor.subjects.map((s) => (
              <Badge key={s} variant="cool">
                {s}
              </Badge>
            ))}
          </div>
        </div>
      </header>

      <Card>
        <CardHeader>
          <h2 className="font-semibold">About</h2>
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
            Available slots (next 7 days)
          </h2>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {mockSlots.map((s) => (
              <Button key={s} variant="outline" className="justify-center">
                {s}
              </Button>
            ))}
          </div>
          <div className="mt-6 flex justify-end">
            <Button variant="cool" size="lg">
              Book session
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
