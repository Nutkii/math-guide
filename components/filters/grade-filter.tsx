"use client";

import { useRouter, usePathname } from "@/i18n/routing";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";

export function GradeFilter({ grades }: { grades: number[] }) {
  const t = useTranslations("common");
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const current = searchParams.get("grade");

  function setGrade(grade: number | null) {
    const params = new URLSearchParams(searchParams.toString());
    if (grade === null) {
      params.delete("grade");
    } else {
      params.set("grade", String(grade));
    }
    const qs = params.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname);
  }

  return (
    <div className="flex flex-wrap gap-2">
      <Button
        size="sm"
        variant={!current ? "cool" : "outline"}
        onClick={() => setGrade(null)}
      >
        {t("allGrades")}
      </Button>
      {grades.map((g) => (
        <Button
          key={g}
          size="sm"
          variant={current === String(g) ? "cool" : "outline"}
          onClick={() => setGrade(g)}
        >
          {t("gradeShort", { grade: g })}
        </Button>
      ))}
    </div>
  );
}
