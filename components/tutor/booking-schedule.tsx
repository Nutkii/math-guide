"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useSession } from "next-auth/react";
import { CalendarCheck, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import { formatShortDayLabel, formatShortDateTime } from "@/lib/date-format";
import type { UpcomingSlotDay } from "@/lib/db-data";

export function BookingSchedule({
  tutorId,
  durationMin,
  upcomingDays,
}: {
  tutorId: string;
  durationMin: number;
  upcomingDays: UpcomingSlotDay[];
}) {
  const t = useTranslations("tutor");
  const locale = useLocale();
  const { data: session } = useSession();
  const [selected, setSelected] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [booked, setBooked] = useState(false);

  async function handleBook() {
    if (!selected) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tutorId, startAt: selected, durationMin }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? t("bookingFailed"));
      setBooked(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : t("bookingFailed"));
    } finally {
      setLoading(false);
    }
  }

  if (booked) {
    return (
      <div className="flex flex-col items-center gap-3 py-8 text-center">
        <div className="grid h-12 w-12 place-items-center rounded-full bg-gradient-to-br from-teal-500 to-emerald-500 text-white shadow-md shadow-emerald-500/30">
          <Check className="h-6 w-6" />
        </div>
        <p className="font-semibold text-foreground">{t("bookingSuccess")}</p>
        <Button asChild variant="cool" size="sm">
          <Link href="/dashboard/bookings">{t("viewBookings")}</Link>
        </Button>
      </div>
    );
  }

  if (!session?.user) {
    return (
      <div className="flex flex-col items-center gap-3 py-8 text-center">
        <p className="text-sm text-muted-foreground">{t("loginToBook")}</p>
        <Button asChild variant="cool" size="sm">
          <Link href="/login">{t("bookSession")}</Link>
        </Button>
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-4 lg:grid-cols-7 sm:gap-2">
        {upcomingDays.map((day) => (
          <div key={day.date} className="space-y-1.5">
            <p className="text-center font-mono text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
              {formatShortDayLabel(new Date(day.date), locale)}
            </p>
            <div className="space-y-1.5">
              {day.times.length === 0 && (
                <div className="h-8 rounded-md border border-dashed border-border/50" />
              )}
              {day.times.map((time) => {
                const active = selected === time.iso;
                return (
                  <button
                    key={time.iso}
                    type="button"
                    onClick={() => setSelected(time.iso)}
                    className={cn(
                      "w-full rounded-md border px-1.5 py-1.5 text-center text-[11px] font-medium transition-all sm:text-xs",
                      active
                        ? "border-transparent bg-gradient-to-r from-teal-500 via-cyan-500 to-emerald-500 text-white shadow-md shadow-cyan-500/25"
                        : "border-border bg-background/70 hover:border-primary/40 hover:bg-accent",
                    )}
                  >
                    {String(time.hour).padStart(2, "0")}:{String(time.minute).padStart(2, "0")}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <CalendarCheck className="h-4 w-4 text-primary" />
          {selected ? (
            <>
              {t("selected")}{" "}
              <span className="font-medium text-foreground">
                {formatShortDateTime(new Date(selected), locale)}
              </span>
            </>
          ) : (
            t("pickSlot")
          )}
        </p>
        <Button variant="cool" size="lg" disabled={!selected || loading} onClick={handleBook}>
          {loading ? t("booking") : t("bookSession")}
        </Button>
      </div>
      {error && <p className="mt-2 text-xs text-destructive">{error}</p>}
    </div>
  );
}
