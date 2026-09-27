import type { ReactNode } from "react";
import {
  CircleCheck,
  Inbox,
  LoaderCircle,
  TriangleAlert,
} from "lucide-react";
import { cn } from "@/lib/utils";

function Frame({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-xl border border-dashed border-line-strong bg-surface/70 px-6 py-14 text-center",
        className,
      )}
    >
      <div className="mx-auto flex max-w-md flex-col items-center">{children}</div>
    </div>
  );
}

function IconBubble({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "mb-4 grid h-10 w-10 place-items-center rounded-full border border-line bg-surface text-ink-muted",
        className,
      )}
    >
      {children}
    </span>
  );
}

export function LoadingState({
  label = "Loading",
  className,
}: {
  label?: string;
  className?: string;
}) {
  return (
    <Frame className={cn("border-solid", className)}>
      <IconBubble>
        <LoaderCircle className="h-5 w-5 animate-spin" />
      </IconBubble>
      <p className="text-sm text-ink-soft">{label}</p>
    </Frame>
  );
}

export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn("animate-pulse rounded-md bg-sunken", className)}
    />
  );
}

export function EmptyState({
  eyebrow,
  icon,
  title,
  description,
  action,
}: {
  eyebrow?: string;
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <Frame>
      <IconBubble>{icon ?? <Inbox className="h-5 w-5" />}</IconBubble>
      {eyebrow ? (
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-muted">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="mt-1.5 font-display text-2xl leading-tight text-ink">
        {title}
      </h2>
      {description ? (
        <p className="mt-2.5 text-sm leading-relaxed text-ink-soft">
          {description}
        </p>
      ) : null}
      {action ? <div className="mt-6">{action}</div> : null}
    </Frame>
  );
}

export function ErrorState({
  title = "Something went wrong",
  description,
  action,
}: {
  title?: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <Frame className="border-alert/35 bg-alert-soft/60">
      <IconBubble className="border-alert/25 text-alert">
        <TriangleAlert className="h-5 w-5" />
      </IconBubble>
      <h2 className="font-display text-2xl leading-tight text-ink">{title}</h2>
      {description ? (
        <p className="mt-2.5 text-sm leading-relaxed text-ink-soft">
          {description}
        </p>
      ) : null}
      {action ? <div className="mt-6">{action}</div> : null}
    </Frame>
  );
}

export function SuccessState({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <Frame className="border-solid border-signal-200 bg-signal-50/70">
      <IconBubble className="border-signal-200 text-signal-700">
        <CircleCheck className="h-5 w-5" />
      </IconBubble>
      <h2 className="font-display text-2xl leading-tight text-ink">{title}</h2>
      {description ? (
        <p className="mt-2.5 text-sm leading-relaxed text-ink-soft">
          {description}
        </p>
      ) : null}
      {action ? <div className="mt-6">{action}</div> : null}
    </Frame>
  );
}
