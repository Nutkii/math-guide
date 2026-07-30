const KA_WEEKDAYS_SHORT = ["კვ", "ორშ", "სამ", "ოთხ", "ხუთ", "პარ", "შაბ"];
const KA_MONTHS_SHORT = [
  "იან",
  "თებ",
  "მარ",
  "აპრ",
  "მაი",
  "ივნ",
  "ივლ",
  "აგვ",
  "სექ",
  "ოქტ",
  "ნოე",
  "დეკ",
];
const KA_MONTHS_LONG = [
  "იანვარი",
  "თებერვალი",
  "მარტი",
  "აპრილი",
  "მაისი",
  "ივნისი",
  "ივლისი",
  "აგვისტო",
  "სექტემბერი",
  "ოქტომბერი",
  "ნოემბერი",
  "დეკემბერი",
];

function pad(n: number) {
  return String(n).padStart(2, "0");
}

export function formatShortDayLabel(date: Date, locale: string): string {
  if (locale === "ka") {
    return `${KA_WEEKDAYS_SHORT[date.getDay()]}, ${date.getDate()} ${KA_MONTHS_SHORT[date.getMonth()]}`;
  }
  return new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    day: "numeric",
    month: "short",
  }).format(date);
}

export function formatShortDateTime(date: Date, locale: string): string {
  if (locale === "ka") {
    return `${formatShortDayLabel(date, locale)}, ${pad(date.getHours())}:${pad(date.getMinutes())}`;
  }
  return new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export function formatMonthYear(date: Date, locale: string): string {
  if (locale === "ka") {
    return `${KA_MONTHS_LONG[date.getMonth()]} ${date.getFullYear()}`;
  }
  return new Intl.DateTimeFormat("en-US", { month: "long", year: "numeric" }).format(date);
}

export function formatTime(date: Date, locale: string): string {
  if (locale === "ka") {
    return `${pad(date.getHours())}:${pad(date.getMinutes())}`;
  }
  return new Intl.DateTimeFormat("en-US", { hour: "2-digit", minute: "2-digit" }).format(date);
}

export function getWeekdayShortLabels(locale: string): string[] {
  // Monday-first, matching the Monday-first calendar grid
  if (locale === "ka") {
    return [
      KA_WEEKDAYS_SHORT[1],
      KA_WEEKDAYS_SHORT[2],
      KA_WEEKDAYS_SHORT[3],
      KA_WEEKDAYS_SHORT[4],
      KA_WEEKDAYS_SHORT[5],
      KA_WEEKDAYS_SHORT[6],
      KA_WEEKDAYS_SHORT[0],
    ];
  }
  const base = new Date(2024, 0, 1); // a Monday
  const fmt = new Intl.DateTimeFormat("en-US", { weekday: "short" });
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(base);
    d.setDate(base.getDate() + i);
    return fmt.format(d);
  });
}
