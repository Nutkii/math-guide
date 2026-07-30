"use client";

import { useState } from "react";
import { CalendarCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const;

export function BookingSchedule({ slots }: { slots: string[] }) {
  const [selected, setSelected] = useState<string | null>(null);

  const byDay = new Map<string, string[]>(DAYS.map((d) => [d, []]));
  for (const slot of slots) {
    const [day, time] = slot.split(" · ");
    byDay.get(day)?.push(time);
  }

  return (
    <div>
      <div className="grid grid-cols-7 gap-1.5 rounded-lg bg-rule-paper p-3 sm:gap-2">
        {DAYS.map((day) => {
          const times = byDay.get(day) ?? [];
          return (
            <div key={day} className="space-y-1.5">
              <p className="text-center font-mono text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                {day}
              </p>
              <div className="space-y-1.5">
                {times.length === 0 && (
                  <div className="h-8 rounded-md border border-dashed border-border/50" />
                )}
                {times.map((time) => {
                  const key = `${day} · ${time}`;
                  const active = selected === key;
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setSelected(key)}
                      className={cn(
                        "w-full rounded-md border px-1.5 py-1.5 text-center text-[11px] font-medium transition-all sm:text-xs",
                        active
                          ? "border-transparent bg-gradient-to-r from-teal-500 via-cyan-500 to-emerald-500 text-white shadow-md shadow-cyan-500/25"
                          : "border-border bg-background/70 hover:border-primary/40 hover:bg-accent",
                      )}
                    >
                      {time}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <CalendarCheck className="h-4 w-4 text-primary" />
          {selected ? (
            <>
              Selected: <span className="font-medium text-foreground">{selected}</span>
            </>
          ) : (
            "Pick a slot above"
          )}
        </p>
        <Button variant="cool" size="lg" disabled={!selected}>
          Book session
        </Button>
      </div>
    </div>
  );
}
