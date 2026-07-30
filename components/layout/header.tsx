import { getTranslations } from "next-intl/server";
import { Sigma } from "lucide-react";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { LocaleSwitcher } from "./locale-switcher";
import { ThemeToggle } from "./theme-toggle";
import { auth, signOut } from "@/auth";

export async function Header() {
  const t = await getTranslations("nav");
  const session = await auth();

  const links = [
    { href: "/problems", label: t("problems") },
    { href: "/topics", label: t("topics") },
    { href: "/tutors", label: t("tutors") },
    { href: "/pricing", label: t("pricing") },
  ] as const;

  async function handleSignOut() {
    "use server";
    await signOut({ redirectTo: "/" });
  }

  return (
    <header className="sticky top-0 z-40 border-b border-border/40 bg-background/70 backdrop-blur-xl">
      <div className="container flex h-16 items-center gap-6">
        <Link
          href="/"
          className="flex items-center gap-2 font-bold tracking-tight"
        >
          <span className="relative grid h-9 w-9 place-items-center rounded-lg bg-gradient-to-br from-teal-500 to-emerald-500 text-white shadow-md shadow-cyan-500/30">
            <Sigma className="h-5 w-5" />
          </span>
          <span className="text-gradient-cool text-lg">Math Guide</span>
        </Link>

        <nav className="hidden gap-1 md:flex">
          {links.map((l) => (
            <Button key={l.href} asChild variant="ghost" size="sm">
              <Link href={l.href}>{l.label}</Link>
            </Button>
          ))}
          {(session?.user as { role?: string })?.role === "admin" && (
            <Button asChild variant="ghost" size="sm" className="text-teal-500">
              <Link href="/admin">{t("admin")}</Link>
            </Button>
          )}
        </nav>

        <div className="ml-auto flex items-center gap-1.5">
          <LocaleSwitcher />
          <ThemeToggle />
          {session?.user ? (
            <>
              <Button asChild variant="ghost" size="sm" className="hidden sm:flex">
                <Link href="/dashboard">{session.user.name ?? t("dashboard")}</Link>
              </Button>
              <form action={handleSignOut}>
                <Button type="submit" variant="ghost" size="sm">
                  {t("logout")}
                </Button>
              </form>
            </>
          ) : (
            <>
              <Button asChild variant="ghost" size="sm" className="hidden sm:flex">
                <Link href="/login">{t("login")}</Link>
              </Button>
              <Button asChild variant="cool" size="sm">
                <Link href="/register">{t("register")}</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
