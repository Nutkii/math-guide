import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import type { NextRequest } from "next/server";

const { auth } = NextAuth(authConfig);
const intl = createMiddleware(routing);

export default auth((req) => intl(req as unknown as NextRequest));

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
