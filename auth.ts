import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import { authConfig } from "./auth.config";
import { connectDB } from "./lib/db";
import User from "./models/User";
import { loginSchema } from "./lib/validations/auth";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  session: { strategy: "jwt" },
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    Credentials({
      async authorize(credentials) {
        const parsed = loginSchema.safeParse(credentials);
        if (!parsed.success) return null;

        await connectDB();
        const user = await User.findOne({ email: parsed.data.email }).lean();
        if (!user || !user.passwordHash) return null;

        const valid = await bcrypt.compare(parsed.data.password, user.passwordHash);
        if (!valid) return null;

        return {
          id: (user._id as { toString(): string }).toString(),
          email: user.email,
          name: user.name,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    session: authConfig.callbacks!.session!,
    async jwt({ token, user, account }) {
      // Credentials sign-in: user object already has id + role from authorize()
      if (user && account?.provider === "credentials") {
        token.id = user.id!;
        token.role = (user as { role?: string }).role ?? "student";
      }

      // Google sign-in: account only present on first sign-in, not token refreshes
      if (account?.provider === "google") {
        try {
          await connectDB();
          let dbUser = await User.findOne({ email: token.email }).lean();
          if (!dbUser) {
            dbUser = await User.create({
              name: token.name ?? token.email,
              email: token.email,
              role: "student",
              emailVerified: new Date(),
            });
          }
          token.id = (dbUser._id as { toString(): string }).toString();
          token.role = dbUser.role;
        } catch (err) {
          console.error("[auth] Google jwt DB error:", err);
        }
      }

      return token;
    },
  },
});
