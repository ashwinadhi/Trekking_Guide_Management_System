import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface AdminPageHeaderProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export function AdminPageHeader({ title, description, action, className }: AdminPageHeaderProps) {
  return (
    <div className={cn("flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between", className)}>
      <div>
        <h1 className="font-display text-2xl tracking-tight text-ivory sm:text-3xl">
          {title}
        </h1>
        {description && (
          <p className="mt-1 text-sm text-stone">{description}</p>
        )}
      </div>
      {action && <div className="flex shrink-0 items-center gap-2">{action}</div>}
    </div>
  );
}

interface AdminStatCardProps {
  label: string;
  value: string | number;
  hint?: string;
  icon: LucideIcon;
  accent?: "gold" | "amber" | "rose";
}

const accentStyles = {
  gold: "bg-gold/10 text-gold",
  amber: "bg-amber-500/10 text-amber-500",
  rose: "bg-rose-500/10 text-rose-400",
};

export function AdminStatCard({ label, value, hint, icon: Icon, accent = "gold" }: AdminStatCardProps) {
  return (
    <div className="border border-gold/20 bg-card p-5">
      <div className="flex items-start justify-between gap-3">
        <div className={cn("rounded-xl p-2.5", accentStyles[accent])}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
      <p className="mt-4 font-display text-3xl text-ivory">{value}</p>
      <p className="mt-1 text-sm font-medium text-stone">{label}</p>
      {hint && <p className="mt-1 text-xs text-stone">{hint}</p>}
    </div>
  );
}

export function AdminPanel({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        "border border-gold/20 bg-card",
        className
      )}
    >
      {children}
    </div>
  );
}

export function AdminPanelHeader({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2 border-b border-gold/15 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h2 className="font-display text-lg text-ivory">{title}</h2>
        {description && <p className="text-sm text-stone">{description}</p>}
      </div>
      {action}
    </div>
  );
}
