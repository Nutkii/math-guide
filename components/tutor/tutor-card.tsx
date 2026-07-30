import { Star } from "lucide-react";
import { Link } from "@/i18n/routing";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { VerificationBadge } from "@/components/ui/verification-badge";
import { formatGEL } from "@/lib/utils";
import type { Tutor } from "@/lib/mock-data";

export function TutorCard({ tutor }: { tutor: Tutor }) {
  const initials = tutor.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2);

  return (
    <Link href={`/tutors/${tutor.id}`} className="group block">
      <Card className="h-full transition-all group-hover:border-primary/40 group-hover:ring-glow">
        <CardContent className="space-y-4 p-5">
          <div className="flex items-start gap-3">
            <Avatar className="h-12 w-12">
              <AvatarFallback className="text-base">{initials}</AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-1.5">
                <h3 className="font-semibold leading-tight">{tutor.name}</h3>
                <VerificationBadge status={tutor.approved ?? true} className="text-[10px]" />
              </div>
              <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                <span className="font-medium text-foreground">
                  {tutor.rating.toFixed(2)}
                </span>
                <span>({tutor.reviewCount})</span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-bold text-primary">
                {formatGEL(tutor.hourlyRateGEL)}
              </p>
              <p className="text-[10px] uppercase tracking-wide text-muted-foreground">
                / hr
              </p>
            </div>
          </div>
          <p className="line-clamp-2 text-xs text-muted-foreground">
            {tutor.bio}
          </p>
          <div className="flex flex-wrap gap-1.5">
            {tutor.subjects.map((s) => (
              <Badge key={s} variant="cool" className="text-[10px]">
                {s}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
