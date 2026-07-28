import NextAuth from "next-auth";
import { NextResponse } from "next/server";
import { authConfig } from "./auth.config";
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import type { NextRequest } from "next/server";

const { auth } = NextAuth(authConfig);
const intl = createMiddleware(routing);

const ADMIN_PATHS = ["/admin"];
const PROTECTED_PATHS = ["/dashboard", "/chat", "/problems/new"];

export default auth((req) => {
  const { nextUrl } = req;
  const localeMatch = nextUrl.pathname.match(/^\/(ka|en)(?=\/|$)/);
  const locale = localeMatch?.[1];
  const pathname = localeMatch
    ? nextUrl.pathname.slice(localeMatch[0].length) || "/"
    : nextUrl.pathname;

  const isLoggedIn = !!req.auth?.user;
  const role = (req.auth?.user as { role?: string } | undefined)?.role;
  const needsAdmin = ADMIN_PATHS.some((p) => pathname.startsWith(p));
  const needsAuth = needsAdmin || PROTECTED_PATHS.some((p) => pathname.startsWith(p));

  if (needsAuth && (!isLoggedIn || (needsAdmin && role !== "admin"))) {
    const loginUrl = new URL(locale === "en" ? "/en/login" : "/login", nextUrl);
    loginUrl.searchParams.set("callbackUrl", nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  return intl(req as unknown as NextRequest);
});

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
