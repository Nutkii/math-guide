"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { TutorCard } from "@/components/tutor/tutor-card";
import { subjectKey } from "@/lib/subject-labels";
import type { Tutor } from "@/lib/mock-data";

export function TutorSubjectFilter({ tutors }: { tutors: Tutor[] }) {
  const t = useTranslations("tutors");
  const ts = useTranslations("subjects");
  const [selected, setSelected] = useState<string[]>([]);

  const subjects = useMemo(
    () => Array.from(new Set(tutors.flatMap((tu) => tu.subjects))).sort(),
    [tutors],
  );

  const filtered =
    selected.length === 0
      ? tutors
      : tutors.filter((tu) => tu.subjects.some((s) => selected.includes(s)));

  function toggle(subject: string) {
    setSelected((prev) =>
      prev.includes(subject) ? prev.filter((s) => s !== subject) : [...prev, subject],
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        <Button
          size="sm"
          variant={selected.length === 0 ? "cool" : "outline"}
          onClick={() => setSelected([])}
        >
          {t("filterAll")}
        </Button>
        {subjects.map((s) => (
          <Button
            key={s}
            size="sm"
            variant={selected.includes(s) ? "cool" : "outline"}
            onClick={() => toggle(s)}
          >
            {ts(subjectKey(s))}
          </Button>
        ))}
      </div>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((tu) => (
          <TutorCard key={tu.id} tutor={tu} />
        ))}
      </div>
    </div>
  );
}
