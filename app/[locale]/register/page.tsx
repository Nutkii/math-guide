"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { GraduationCap, User as UserIcon } from "lucide-react";
import { Link, useRouter } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { registerSchema, type RegisterInput } from "@/lib/validations/auth";

export default function RegisterPage() {
  const t = useTranslations("auth");
  const tn = useTranslations("nav");
  const router = useRouter();
  const searchParams = useSearchParams();
  const wantsAiPro = searchParams.get("plan") === "ai";
  const [step, setStep] = useState<1 | 2>(1);
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    trigger,
    watch,
    setValue,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: { role: "student" },
  });

  const role = watch("role");

  async function goToStep2() {
    const valid = await trigger(["name", "email", "password"]);
    if (!valid) return;
    if (role === "student") {
      handleSubmit(onSubmit)();
      return;
    }
    setStep(2);
  }

  async function onSubmit(data: RegisterInput) {
    setLoading(true);
    setServerError("");
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.status === 409) {
        setServerError(t("errEmailTaken"));
        return;
      }
      if (!res.ok) {
        setServerError(t("errRegistrationFailed"));
        return;
      }

      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (result?.error) {
        router.push("/login");
        return;
      }

      if (wantsAiPro) {
        const checkoutRes = await fetch("/api/payments/flitt/checkout", {
          method: "POST",
        });
        const checkoutData = await checkoutRes.json();
        if (checkoutRes.ok) {
          window.location.href = checkoutData.checkoutUrl;
          return;
        }
        setServerError(checkoutData.error ?? t("errServerError"));
        return;
      }

      router.push("/dashboard");
      router.refresh();
    } catch {
      setServerError(t("errServerError"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container relative flex min-h-[calc(100vh-160px)] items-center justify-center py-12">
      <div
        aria-hidden
        className="bg-grid-paper pointer-events-none absolute inset-0 opacity-[0.03] [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]"
      />
      <Card className="w-full max-w-md ring-glow">
        <CardHeader>
          <CardTitle className="font-serif text-2xl text-gradient-cool">
            {t("registerTitle")}
          </CardTitle>
          {role === "tutor" && (
            <p className="text-xs text-muted-foreground">
              {t("stepOf", { current: step, total: 2 })} ·{" "}
              {step === 1 ? t("stepAccount") : t("stepTutorDetails")}
            </p>
          )}
        </CardHeader>
        <CardContent>
          <form
            className="space-y-4"
            onSubmit={step === 2 ? handleSubmit(onSubmit) : (e) => e.preventDefault()}
          >
            {step === 1 && (
              <>
                <div className="space-y-2">
                  <Label>{t("iAmA")}</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setValue("role", "student")}
                      className={cn(
                        "flex flex-col items-center gap-1.5 rounded-lg border p-3 text-sm transition-colors",
                        role === "student"
                          ? "border-primary bg-primary/10 text-primary ring-1 ring-inset ring-primary/30"
                          : "border-border hover:bg-accent"
                      )}
                    >
                      <UserIcon className="h-5 w-5" />
                      {t("roleStudent")}
                    </button>
                    <button
                      type="button"
                      onClick={() => setValue("role", "tutor")}
                      className={cn(
                        "flex flex-col items-center gap-1.5 rounded-lg border p-3 text-sm transition-colors",
                        role === "tutor"
                          ? "border-primary bg-primary/10 text-primary ring-1 ring-inset ring-primary/30"
                          : "border-border hover:bg-accent"
                      )}
                    >
                      <GraduationCap className="h-5 w-5" />
                      {t("roleTutor")}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="name">{t("name")}</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Your name"
                    {...register("name")}
                  />
                  {errors.name && (
                    <p className="text-sm text-destructive">{errors.name.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">{t("email")}</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    {...register("email")}
                  />
                  {errors.email && (
                    <p className="text-sm text-destructive">{errors.email.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">{t("password")}</Label>
                  <Input id="password" type="password" {...register("password")} />
                  {errors.password && (
                    <p className="text-sm text-destructive">
                      {errors.password.message}
                    </p>
                  )}
                </div>

                {serverError && (
                  <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
                    {serverError}
                  </p>
                )}

                <Button
                  type="button"
                  variant="cool"
                  className="w-full"
                  disabled={loading}
                  onClick={goToStep2}
                >
                  {loading
                    ? "..."
                    : role === "tutor"
                      ? t("continue")
                      : t("submit")}
                </Button>
              </>
            )}

            {step === 2 && (
              <>
                <p className="rounded-md bg-amber-500/10 px-3 py-2 text-xs text-amber-700 dark:text-amber-300">
                  {t("tutorVerificationNotice")}
                </p>
                <div className="space-y-2">
                  <Label htmlFor="subjects">{t("subjects")}</Label>
                  <Input
                    id="subjects"
                    placeholder={t("subjectsPlaceholder")}
                    {...register("subjects", {
                      setValueAs: (v: string) =>
                        typeof v === "string"
                          ? v
                              .split(",")
                              .map((s) => s.trim())
                              .filter(Boolean)
                          : v,
                    })}
                  />
                  {errors.subjects && (
                    <p className="text-sm text-destructive">
                      {errors.subjects.message as string}
                    </p>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="hourlyRateGEL">{t("hourlyRate")}</Label>
                    <Input
                      id="hourlyRateGEL"
                      type="number"
                      min={1}
                      step="0.01"
                      {...register("hourlyRateGEL")}
                    />
                    {errors.hourlyRateGEL && (
                      <p className="text-sm text-destructive">
                        {errors.hourlyRateGEL.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="yearsExperience">{t("yearsExperience")}</Label>
                    <Input
                      id="yearsExperience"
                      type="number"
                      min={0}
                      max={80}
                      step="1"
                      {...register("yearsExperience")}
                    />
                    {errors.yearsExperience && (
                      <p className="text-sm text-destructive">
                        {errors.yearsExperience.message}
                      </p>
                    )}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="experience">{t("experience")}</Label>
                  <Textarea
                    id="experience"
                    rows={3}
                    placeholder={t("experiencePlaceholder")}
                    {...register("experience")}
                  />
                  {errors.experience && (
                    <p className="text-sm text-destructive">
                      {errors.experience.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bio">{t("bio")}</Label>
                  <Textarea id="bio" rows={3} {...register("bio")} />
                </div>

                {serverError && (
                  <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
                    {serverError}
                  </p>
                )}

                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1"
                    onClick={() => setStep(1)}
                  >
                    {t("back")}
                  </Button>
                  <Button
                    type="submit"
                    variant="cool"
                    className="flex-1"
                    disabled={loading}
                  >
                    {loading ? "..." : t("submit")}
                  </Button>
                </div>
              </>
            )}
          </form>

          {step === 1 && (
            <>
              <div className="mt-4 flex items-center gap-3">
                <div className="h-px flex-1 bg-border" />
                <span className="text-xs text-muted-foreground">
                  {t("orContinueWith")}
                </span>
                <div className="h-px flex-1 bg-border" />
              </div>
              <Button
                type="button"
                variant="outline"
                className="mt-4 w-full"
                onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
              >
                <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                {t("signInWithGoogle")}
              </Button>
              <p className="mt-6 text-center text-sm text-muted-foreground">
                {t("hasAccount")}{" "}
                <Link href="/login" className="text-primary hover:underline">
                  {tn("login")}
                </Link>
              </p>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
