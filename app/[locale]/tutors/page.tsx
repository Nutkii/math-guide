import { useTranslations } from "next-intl";
import { TutorCard } from "@/components/tutor/tutor-card";
import { tutors } from "@/lib/mock-data";

export default function TutorsPage() {
  const t = useTranslations("nav");

  return (
    <div className="container py-12">
      <header className="mb-10 space-y-2">
        <h1 className="text-3xl font-bold md:text-4xl">{t("tutors")}</h1>
        <p className="text-muted-foreground">
          Book vetted Georgian math tutors by the hour.
        </p>
      </header>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {tutors.map((tut) => (
          <TutorCard key={tut.id} tutor={tut} />
        ))}
      </div>
    </div>
  );
}
