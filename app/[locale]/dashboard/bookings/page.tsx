import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { auth } from "@/auth";
import { connectDB } from "@/lib/db";
import TutorProfile from "@/models/TutorProfile";
import { getMyBookingsDB } from "@/lib/db-data";
import { BookingCalendar } from "@/components/dashboard/booking-calendar";

export default async function BookingsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "bookings" });
  const tc = await getTranslations({ locale, namespace: "common" });

  const session = await auth();
  const user = session?.user as { id?: string; role?: string } | undefined;
  let bookings: Awaited<ReturnType<typeof getMyBookingsDB>> = [];

  if (user?.id) {
    await connectDB();
    let tutorProfileId: string | undefined;
    if (user.role === "tutor") {
      const profile = await TutorProfile.findOne({ userId: user.id }, { _id: 1 }).lean();
      tutorProfileId = profile ? String(profile._id) : undefined;
    }
    bookings = await getMyBookingsDB(user.id, tutorProfileId);
  }

  const statusLabel: Record<string, string> = {
    pending_payment: t("statusPendingPayment"),
    confirmed: t("statusConfirmed"),
    completed: t("statusCompleted"),
    reviewed: t("statusReviewed"),
    cancelled: t("statusCancelled"),
  };

  return (
    <div className="container max-w-2xl py-12 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{t("title")}</h1>
        <Link href="/dashboard" className="text-sm text-primary hover:underline">
          {tc("backToDashboard")}
        </Link>
      </div>

      {bookings.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-3 py-10 text-center">
            <p className="text-sm text-muted-foreground">{t("empty")}</p>
            <Link href="/tutors" className="text-sm text-primary hover:underline">
              {t("findTutor")}
            </Link>
          </CardContent>
        </Card>
      ) : (
        <>
          <Card>
            <CardHeader className="pb-0">
              <h2 className="text-sm font-semibold">{t("calendarTitle")}</h2>
            </CardHeader>
            <CardContent>
              <BookingCalendar bookings={bookings} />
            </CardContent>
          </Card>
          <div className="space-y-3">
          {bookings.map((b) => (
            <Card key={b.id}>
              <CardContent className="flex items-center justify-between gap-4 p-4">
                <div className="space-y-1">
                  <p className="text-sm font-medium">{b.tutorName}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(b.startAt).toLocaleString(locale === "ka" ? "ka-GE" : "en-US")}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{statusLabel[b.status] ?? b.status}</Badge>
                  <span className="text-sm font-semibold">₾{b.priceGEL}</span>
                </div>
              </CardContent>
            </Card>
          ))}
          </div>
        </>
      )}
    </div>
  );
}
