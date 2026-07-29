import type { LucideIcon } from "lucide-react";

const tabColors = [
  "bg-teal-500",
  "bg-cyan-500",
  "bg-emerald-500",
  "bg-redpen",
] as const;

export function FeatureTab({
  icon: Icon,
  title,
  desc,
  index,
}: {
  icon: LucideIcon;
  title: string;
  desc: string;
  index: number;
}) {
  return (
    <div
      className="reveal group relative overflow-hidden rounded-lg border border-border/60 bg-card pl-5 shadow-sm transition-shadow hover:shadow-md"
      style={{ transitionDelay: `${150 + index * 100}ms` }}
    >
      <span
        className={`absolute inset-y-0 left-0 w-1.5 ${tabColors[index % tabColors.length]}`}
      />
      <div className="space-y-2 p-5">
        <Icon className="h-5 w-5 text-primary" />
        <h3 className="font-serif text-base font-semibold">{title}</h3>
        <p className="text-sm text-muted-foreground">{desc}</p>
      </div>
    </div>
  );
}
