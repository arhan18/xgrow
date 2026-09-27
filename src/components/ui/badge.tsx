import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export type BadgeVariant = "neutral" | "signal" | "demo" | "outline";

const variants: Record<BadgeVariant, string> = {
  neutral: "border-line bg-sunken text-ink-muted",
  signal: "border-signal-200 bg-signal-50 text-signal-700",
  demo: "border-demo-line bg-demo text-demo-ink",
  outline: "border-line-strong bg-surface text-ink-soft",
};

export function Badge({
  variant = "neutral",
  icon,
  children,
  className,
}: {
  variant?: BadgeVariant;
  icon?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-[3px] text-[11px] font-medium leading-none tracking-[0.02em]",
        variants[variant],
        className,
      )}
    >
      {icon}
      {children}
    </span>
  );
}
