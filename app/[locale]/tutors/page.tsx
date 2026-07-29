import { useTranslations } from "next-intl";
import { PageHero } from "@/components/layout/page-hero";
import { TutorSubjectFilter } from "@/components/tutor/tutor-subject-filter";
import { tutors } from "@/lib/mock-data";

export default function TutorsPage() {
  const t = useTranslations("tutors");

  return (
    <div className="container py-12">
      <PageHero title={t("title")} subtitle={t("subtitle")} align="left" />
      <TutorSubjectFilter tutors={tutors} />
    </div>
  );
}
