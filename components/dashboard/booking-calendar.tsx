"use client";

import { useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { formatMonthYear, formatTime, getWeekdayShortLabels } from "@/lib/date-format";
import type { Booking } from "@/lib/db-data";

function dayKey(d: Date) {
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
}

export function BookingCalendar({ bookings }: { bookings: Booking[] }) {
  const t = useTranslations("bookings");
  const locale = useLocale();
  const [monthOffset, setMonthOffset] = useState(0);
  const [selectedDay, setSelectedDay] = useState<string | null>(null);

  const byDay = useMemo(() => {
    const map = new Map<string, Booking[]>();
    for (const b of bookings) {
      if (!b.startAt) continue;
      const key = dayKey(new Date(b.startAt));
      const list = map.get(key) ?? [];
      list.push(b);
      map.set(key, list);
    }
    return map;
  }, [bookings]);

  const viewDate = new Date();
  viewDate.setDate(1);
  viewDate.setMonth(viewDate.getMonth() + monthOffset);

  const monthLabel = formatMonthYear(viewDate, locale);

  const weekdayLabels = useMemo(() => getWeekdayShortLabels(locale), [locale]);

  const firstOfMonth = new Date(viewDate.getFullYear(), viewDate.getMonth(), 1);
  const daysInMonth = new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 0).getDate();
  const leadingBlanks = (firstOfMonth.getDay() + 6) % 7; // Monday-first grid

  const cells: (Date | null)[] = [
    ...Array(leadingBlanks).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => new Date(viewDate.getFullYear(), viewDate.getMonth(), i + 1)),
  ];

  const selectedBookings = selectedDay ? (byDay.get(selectedDay) ?? []) : [];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="icon" onClick={() => setMonthOffset((m) => m - 1)}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <p className="text-sm font-semibold capitalize">{monthLabel}</p>
        <Button variant="ghost" size="icon" onClick={() => setMonthOffset((m) => m + 1)}>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center">
        {weekdayLabels.map((w) => (
          <div key={w} className="text-[10px] font-medium uppercase text-muted-foreground">
            {w}
          </div>
        ))}
        {cells.map((date, i) => {
          if (!date) return <div key={`b${i}`} />;
          const key = dayKey(date);
          const hasBooking = byDay.has(key);
          const isSelected = selectedDay === key;
          const isToday = dayKey(new Date()) === key;
          return (
            <button
              key={key}
              type="button"
              onClick={() => setSelectedDay(isSelected ? null : key)}
              className={cn(
                "relative aspect-square rounded-md text-xs transition-colors",
                isSelected
                  ? "bg-gradient-to-br from-teal-500 to-emerald-500 text-white"
                  : isToday
                    ? "ring-1 ring-inset ring-primary/50"
                    : "hover:bg-accent",
              )}
            >
              {date.getDate()}
              {hasBooking && (
                <span
                  className={cn(
                    "absolute bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full",
                    isSelected ? "bg-white" : "bg-emerald-500",
                  )}
                />
              )}
            </button>
          );
        })}
      </div>

      {selectedDay && (
        <div className="space-y-2 border-t border-border/50 pt-3">
          {selectedBookings.length === 0 ? (
            <p className="text-xs text-muted-foreground">{t("empty")}</p>
          ) : (
            selectedBookings.map((b) => (
              <div key={b.id} className="flex items-center justify-between text-sm">
                <span>{b.tutorName}</span>
                <span className="text-muted-foreground">
                  {formatTime(new Date(b.startAt), locale)}
                </span>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
