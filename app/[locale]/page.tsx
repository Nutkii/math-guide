import { useTranslations } from "next-intl";
import {
  ArrowRight,
  Library,
  Sparkles,
  GraduationCap,
  Users,
} from "lucide-react";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { BookCover } from "@/components/book/book-cover";
import { ProblemCard } from "@/components/problem/problem-card";
import { NotebookDemo } from "@/components/landing/notebook-demo";
import { FeatureTab } from "@/components/landing/feature-tab";
import { TrustStrip } from "@/components/landing/trust-strip";
import { books, problems } from "@/lib/mock-data";

const featureIcons = [Library, Sparkles, GraduationCap, Users];
const featureKeys = ["library", "ai", "tutors", "community"] as const;

export default function HomePage() {
  const t = useTranslations("landing");
  const tc = useTranslations("common");

  return (
    <div className="space-y-28 pb-28">
      {/* Hero */}
      <section className="container pt-16 md:pt-24">
        <div className="grid items-center gap-14 lg:grid-cols-[1.1fr_1fr] lg:gap-10">
          <div className="text-center lg:text-left">
            <div className="mb-6 inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-background/60 px-3 py-1 font-mono text-xs font-semibold uppercase tracking-wide text-primary backdrop-blur">
              <Sparkles className="h-3 w-3" />
              {t("eyebrow")}
            </div>
            <h1 className="text-balance font-serif text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
              <span className="text-gradient-cool">{t("heroTitle")}</span>
            </h1>
            <p className="mx-auto mt-6 max-w-xl text-balance text-lg text-muted-foreground lg:mx-0">
              {t("heroSubtitle")}
            </p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-3 lg:justify-start">
              <Button asChild size="xl" variant="cool">
                <Link href="/register">
                  {t("ctaPrimary")} <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="xl" variant="outline">
                <Link href="/pricing">{t("ctaSecondary")}</Link>
              </Button>
            </div>
          </div>

          <NotebookDemo />
        </div>
      </section>

      <TrustStrip />

      {/* Features as binder tabs */}
      <section className="container">
        <h2 className="mb-10 text-center font-serif text-2xl font-bold md:text-3xl">
          {t("features.title")}
        </h2>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {featureKeys.map((k, i) => (
            <FeatureTab
              key={k}
              index={i}
              icon={featureIcons[i]}
              title={t(`features.${k}.title`)}
              desc={t(`features.${k}.desc`)}
            />
          ))}
        </div>
      </section>

      {/* Books preview */}
      <section className="container">
        <div className="mb-8 flex items-end justify-between">
          <h2 className="font-serif text-2xl font-bold md:text-3xl">
            {t("sections.books")}
          </h2>
          <Button asChild variant="ghost" size="sm">
            <Link href="/books">
              {tc("viewAll")} <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
        <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
          {books.map((b) => (
            <BookCover key={b.slug} book={b} />
          ))}
        </div>
      </section>

      {/* Problems preview */}
      <section className="container">
        <div className="mb-8 flex items-end justify-between">
          <h2 className="font-serif text-2xl font-bold md:text-3xl">
            {t("sections.problems")}
          </h2>
          <Button asChild variant="ghost" size="sm">
            <Link href="/problems">
              {tc("viewAll")} <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {problems.slice(0, 6).map((p) => (
            <ProblemCard key={p.id} problem={p} />
          ))}
        </div>
      </section>

      {/* Closing CTA */}
      <section className="container">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-teal-600 via-cyan-600 to-emerald-600 px-8 py-14 text-center shadow-xl shadow-cyan-500/20 sm:px-14">
          <div className="bg-grid-paper absolute inset-0 opacity-20" />
          <div className="relative">
            <h2 className="text-balance font-serif text-2xl font-bold text-white md:text-3xl">
              {t("closing.title")}
            </h2>
            <p className="mx-auto mt-3 max-w-md text-balance text-teal-50/90">
              {t("closing.subtitle")}
            </p>
            <Button
              asChild
              size="xl"
              className="mt-8 bg-white text-teal-700 shadow-lg hover:bg-teal-50"
            >
              <Link href="/register">
                {t("closing.cta")} <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
