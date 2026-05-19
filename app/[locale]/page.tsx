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
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BookCover } from "@/components/book/book-cover";
import { ProblemCard } from "@/components/problem/problem-card";
import { books, problems } from "@/lib/mock-data";

const featureIcons = [Library, Sparkles, GraduationCap, Users];
const featureKeys = ["library", "ai", "tutors", "community"] as const;

export default function HomePage() {
  const t = useTranslations("landing");
  const tc = useTranslations("common");

  return (
    <div className="space-y-24 pb-24">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="container relative pt-20 pb-16 md:pt-28 md:pb-24">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-background/60 px-3 py-1 text-xs font-medium backdrop-blur">
              <Sparkles className="h-3 w-3 text-primary" />
              AI + tutors + community
            </div>
            <h1 className="text-balance text-4xl font-bold tracking-tight md:text-6xl">
              <span className="text-gradient-cool">{t("heroTitle")}</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-balance text-lg text-muted-foreground">
              {t("heroSubtitle")}
            </p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
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
        </div>
      </section>

      {/* Features */}
      <section className="container">
        <h2 className="mb-10 text-center text-2xl font-bold md:text-3xl">
          {t("features.title")}
        </h2>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {featureKeys.map((k, i) => {
            const Icon = featureIcons[i];
            return (
              <Card key={k} className="overflow-hidden">
                <CardHeader>
                  <div className="mb-3 grid h-11 w-11 place-items-center rounded-lg bg-gradient-to-br from-teal-500/15 to-emerald-500/15 text-primary">
                    <Icon className="h-5 w-5" />
                  </div>
                  <CardTitle>{t(`features.${k}.title`)}</CardTitle>
                  <CardDescription>{t(`features.${k}.desc`)}</CardDescription>
                </CardHeader>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Books preview */}
      <section className="container">
        <div className="mb-8 flex items-end justify-between">
          <h2 className="text-2xl font-bold md:text-3xl">Books</h2>
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
          <h2 className="text-2xl font-bold md:text-3xl">Recent problems</h2>
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
    </div>
  );
}
