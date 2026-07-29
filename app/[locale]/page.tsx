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
import { TutorCard } from "@/components/tutor/tutor-card";
import { NotebookDemo } from "@/components/landing/notebook-demo";
import { FeatureTab } from "@/components/landing/feature-tab";
import { TrustStrip } from "@/components/landing/trust-strip";
import { SlideDeck } from "@/components/landing/slide-deck";
import { Slide } from "@/components/landing/slide";
import { books, problems, tutors } from "@/lib/mock-data";

const featureIcons = [Library, Sparkles, GraduationCap, Users];
const featureKeys = ["library", "ai", "tutors", "community"] as const;

export default function HomePage() {
  const t = useTranslations("landing");
  const tc = useTranslations("common");

  const deckSlides = [
    { id: "slide-hero", label: t("deck.hero") },
    { id: "slide-trust", label: t("deck.trust") },
    { id: "slide-features", label: t("deck.features") },
    { id: "slide-books", label: t("deck.books") },
    { id: "slide-problems", label: t("deck.problems") },
    { id: "slide-tutors", label: t("deck.tutors") },
    { id: "slide-closing", label: t("deck.closing") },
  ];
  const total = deckSlides.length;

  return (
    <SlideDeck slides={deckSlides}>
      {/* Slide 1 — Hero */}
      <Slide id="slide-hero" index={0} total={total} eyebrow={t("deck.hero")} first>
        <div className="grid items-center gap-14 lg:grid-cols-[1.1fr_1fr] lg:gap-10">
          <div className="text-center lg:text-left">
            <div className="reveal mb-6 inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-background/60 px-3 py-1 font-mono text-xs font-semibold uppercase tracking-wide text-primary backdrop-blur">
              <Sparkles className="h-3 w-3" />
              {t("eyebrow")}
            </div>
            <h1 className="reveal text-balance font-serif text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
              <span className="text-gradient-cool">{t("heroTitle")}</span>
            </h1>
            <p
              className="reveal mx-auto mt-6 max-w-xl text-balance text-lg text-muted-foreground lg:mx-0"
              style={{ transitionDelay: "100ms" }}
            >
              {t("heroSubtitle")}
            </p>
            <div
              className="reveal mt-10 flex flex-wrap items-center justify-center gap-3 lg:justify-start"
              style={{ transitionDelay: "200ms" }}
            >
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

          <div className="hidden md:block">
            <NotebookDemo />
          </div>
        </div>
      </Slide>

      {/* Slide 2 — Why us */}
      <Slide id="slide-trust" index={1} total={total} eyebrow={t("deck.trust")}>
        <TrustStrip />
      </Slide>

      {/* Slide 3 — Features as binder tabs */}
      <Slide id="slide-features" index={2} total={total} eyebrow={t("deck.features")}>
        <h2 className="reveal mb-10 text-center font-serif text-3xl font-bold md:text-4xl">
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
      </Slide>

      {/* Slide 4 — Books preview */}
      <Slide id="slide-books" index={3} total={total} eyebrow={t("deck.books")}>
        <div className="reveal mb-8 flex items-end justify-between">
          <h2 className="font-serif text-3xl font-bold md:text-4xl">
            {t("sections.books")}
          </h2>
          <Button asChild variant="ghost" size="sm">
            <Link href="/books">
              {tc("viewAll")} <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
        <div
          className="reveal grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4"
          style={{ transitionDelay: "150ms" }}
        >
          {books.map((b) => (
            <BookCover key={b.slug} book={b} />
          ))}
        </div>
      </Slide>

      {/* Slide 5 — Problems preview */}
      <Slide id="slide-problems" index={4} total={total} eyebrow={t("deck.problems")}>
        <div className="reveal mb-8 flex items-end justify-between">
          <h2 className="font-serif text-3xl font-bold md:text-4xl">
            {t("sections.problems")}
          </h2>
          <Button asChild variant="ghost" size="sm">
            <Link href="/problems">
              {tc("viewAll")} <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
        <div
          className="reveal grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
          style={{ transitionDelay: "150ms" }}
        >
          {problems.slice(0, 6).map((p) => (
            <ProblemCard key={p.id} problem={p} />
          ))}
        </div>
      </Slide>

      {/* Slide 6 — Tutors preview */}
      <Slide id="slide-tutors" index={5} total={total} eyebrow={t("deck.tutors")}>
        <div className="reveal mb-8 flex items-end justify-between gap-4">
          <div>
            <h2 className="font-serif text-3xl font-bold md:text-4xl">
              {t("sections.tutors")}
            </h2>
            <p className="mt-2 max-w-md text-balance text-muted-foreground">
              {t("sections.tutorsSubtitle")}
            </p>
          </div>
          <Button asChild variant="ghost" size="sm" className="shrink-0">
            <Link href="/tutors">
              {tc("viewAll")} <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
        <div
          className="reveal grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
          style={{ transitionDelay: "150ms" }}
        >
          {tutors.slice(0, 3).map((tutor) => (
            <TutorCard key={tutor.id} tutor={tutor} />
          ))}
        </div>
      </Slide>

      {/* Slide 7 — Closing CTA */}
      <Slide
        id="slide-closing"
        index={6}
        total={total}
        eyebrow={t("deck.closing")}
        ink
        className="bg-gradient-to-br from-teal-600 via-cyan-600 to-emerald-600"
        contentClassName="max-w-2xl text-center"
        overlay={
          <div className="bg-grid-paper pointer-events-none absolute inset-0 opacity-20" />
        }
      >
        <div className="reveal">
          <h2 className="text-balance font-serif text-3xl font-bold text-white md:text-5xl">
            {t("closing.title")}
          </h2>
          <p className="mx-auto mt-4 max-w-md text-balance text-lg text-teal-50/90">
            {t("closing.subtitle")}
          </p>
          <Button
            asChild
            size="xl"
            className="mt-10 bg-white text-teal-700 shadow-lg hover:bg-teal-50"
          >
            <Link href="/register">
              {t("closing.cta")} <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </Slide>
    </SlideDeck>
  );
}
