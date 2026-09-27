import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Panel({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={cn(
        "rounded-xl border border-line bg-surface shadow-xs",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function PanelHeader({
  title,
  meta,
  className,
}: {
  title: ReactNode;
  meta?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex items-center justify-between gap-4 border-b border-line px-5 py-3.5",
        className,
      )}
    >
      <h2 className="text-sm font-medium text-ink">{title}</h2>
      {meta ? <div className="flex items-center gap-2">{meta}</div> : null}
    </div>
  );
}
