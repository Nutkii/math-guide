"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { TutorCard } from "@/components/tutor/tutor-card";
import type { Tutor } from "@/lib/mock-data";

export function TutorSubjectFilter({ tutors }: { tutors: Tutor[] }) {
  const t = useTranslations("tutors");
  const [subject, setSubject] = useState<string | null>(null);

  const subjects = useMemo(
    () => Array.from(new Set(tutors.flatMap((tu) => tu.subjects))).sort(),
    [tutors],
  );

  const filtered =
    subject === null ? tutors : tutors.filter((tu) => tu.subjects.includes(subject));

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        <Button
          size="sm"
          variant={subject === null ? "cool" : "outline"}
          onClick={() => setSubject(null)}
        >
          {t("filterAll")}
        </Button>
        {subjects.map((s) => (
          <Button
            key={s}
            size="sm"
            variant={subject === s ? "cool" : "outline"}
            onClick={() => setSubject(s)}
          >
            {s}
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
