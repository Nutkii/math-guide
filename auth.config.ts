import type { NextAuthConfig } from "next-auth";

export const authConfig: NextAuthConfig = {
  pages: {
    signIn: "/login",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      let pathname = nextUrl.pathname;

      // Strip locale prefix for path check
      pathname = pathname.replace(/^\/(ka|en)(?=\/|$)/, "") || "/";

      const protectedPaths = ["/dashboard", "/chat", "/problems/new"];
      if (protectedPaths.some((p) => pathname.startsWith(p))) {
        return isLoggedIn;
      }
      return true;
    },
    jwt({ token, user }) {
      if (user) {
        token.id = user.id!;
        token.role = (user as { role?: string }).role ?? "student";
      }
      return token;
    },
    session({ session, token }) {
      if (session.user && token) {
        (session.user as { id: string }).id = token.id as string;
        (session.user as { role: string }).role = token.role as string;
      }
      return session;
    },
  },
  providers: [],
};
