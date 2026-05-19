"use client";

import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoginPage() {
  const t = useTranslations("auth");

  return (
    <div className="container flex min-h-[calc(100vh-160px)] items-center justify-center py-12">
      <Card className="w-full max-w-md ring-glow">
        <CardHeader>
          <CardTitle className="text-2xl text-gradient-cool">
            {t("loginTitle")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              toast.info("Auth lands in Phase 3");
            }}
          >
            <div className="space-y-2">
              <Label htmlFor="email">{t("email")}</Label>
              <Input id="email" type="email" placeholder="you@example.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">{t("password")}</Label>
              <Input id="password" type="password" />
            </div>
            <Button type="submit" variant="cool" className="w-full">
              {t("submit")}
            </Button>
          </form>
          <p className="mt-6 text-center text-sm text-muted-foreground">
            {t("noAccount")}{" "}
            <Link href="/register" className="text-primary hover:underline">
              {t("submit")}
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
