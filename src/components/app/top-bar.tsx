"use client";

import { usePathname } from "next/navigation";
import { sectionTitle } from "@/components/app/nav-items";
import { DemoBadge } from "@/components/ui/demo-badge";
import { Logo } from "@/components/ui/logo";
import { DEMO_ACCOUNT } from "@/lib/demo/account";

const todayLabel = new Intl.DateTimeFormat("en-US", {
  weekday: "short",
  month: "short",
  day: "numeric",
}).format(new Date());

export function TopBar() {
  const pathname = usePathname();
  const title = sectionTitle(pathname);

  return (
    <header className="sticky top-0 z-20 border-b border-line bg-paper">
      <div className="mx-auto flex h-14 w-full max-w-5xl items-center justify-between gap-4 px-5 sm:px-8 lg:h-16">
        <div className="flex min-w-0 items-center gap-3">
          <Logo href="/app/today" markOnly className="lg:hidden" />
          <span className="hidden truncate font-mono text-[11px] uppercase tracking-[0.18em] text-ink-muted lg:inline">
            {title}
          </span>
          <span className="truncate text-sm font-medium text-ink lg:hidden">
            {title}
          </span>
        </div>

        <div className="flex shrink-0 items-center gap-3">
          <span className="hidden font-mono text-[11px] text-ink-muted sm:inline">
            {todayLabel}
          </span>
          <DemoBadge />
          <span
            aria-hidden
            className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-signal-100 text-[11px] font-medium text-signal-800 lg:hidden"
          >
            {DEMO_ACCOUNT.initials}
          </span>
        </div>
      </div>
    </header>
  );
}
