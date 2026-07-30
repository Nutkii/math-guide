import { getTranslations } from "next-intl/server";
import { PageHero } from "@/components/layout/page-hero";
import { TutorSubjectFilter } from "@/components/tutor/tutor-subject-filter";
import { getTutorsDB } from "@/lib/db-data";

export default async function TutorsPage() {
  const t = await getTranslations("tutors");
  const tutors = await getTutorsDB();

  return (
    <div className="container py-12">
      <PageHero title={t("title")} subtitle={t("subtitle")} align="left" />
      <TutorSubjectFilter tutors={tutors} />
    </div>
  );
}
