import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  color: "green" | "blue" | "orange" | "purple";
}

const colorVariants = {
  green: {
    bg: "bg-primary/10",
    icon: "text-primary",
    border: "border-primary/20",
  },
  blue: {
    bg: "bg-chart-2/10",
    icon: "text-chart-2",
    border: "border-chart-2/20",
  },
  orange: {
    bg: "bg-chart-3/10",
    icon: "text-chart-3",
    border: "border-chart-3/20",
  },
  purple: {
    bg: "bg-chart-4/10",
    icon: "text-chart-4",
    border: "border-chart-4/20",
  },
};

export function StatCard({ title, value, icon: Icon, color }: StatCardProps) {
  const variant = colorVariants[color];

  return (
    <div
      className={cn(
        "flex items-center gap-4 rounded-xl border bg-card p-5 shadow-sm transition-shadow hover:shadow-md",
        variant.border
      )}
    >
      <div className={cn("rounded-lg p-3", variant.bg)}>
        <Icon className={cn("h-6 w-6", variant.icon)} />
      </div>
      <div>
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
        <p className="text-3xl font-bold text-card-foreground">{value}</p>
      </div>
    </div>
  );
}
