"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_ITEMS } from "@/components/app/nav-items";
import { DemoBadge } from "@/components/ui/demo-badge";
import { Logo } from "@/components/ui/logo";
import { DEMO_ACCOUNT } from "@/lib/demo/account";
import { cn } from "@/lib/utils";

export function SideNav() {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-60 flex-col border-r border-line bg-surface lg:flex">
      <div className="flex h-16 items-center px-5">
        <Logo href="/app/today" />
      </div>

      <nav className="flex-1 px-3 py-4" aria-label="Xgrow">
        <p className="px-2.5 pb-2 font-mono text-[10px] uppercase tracking-[0.16em] text-ink-muted">
          Growth system
        </p>
        <ul className="space-y-1">
          {NAV_ITEMS.map((item) => {
            const active =
              pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "group flex items-center gap-3 rounded-lg px-2.5 py-2 text-sm transition-colors",
                    active
                      ? "bg-ink/[0.055] font-medium text-ink"
                      : "text-ink-muted hover:bg-ink/[0.03] hover:text-ink",
                  )}
                >
                  <item.icon
                    className={cn(
                      "h-4 w-4 shrink-0 transition-colors",
                      active
                        ? "text-signal-700"
                        : "text-ink-muted group-hover:text-ink-soft",
                    )}
                    aria-hidden
                  />
                  <span className="truncate">{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="border-t border-line p-4">
        <div className="flex items-center gap-3">
          <span
            aria-hidden
            className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-signal-100 text-[12px] font-medium text-signal-800"
          >
            {DEMO_ACCOUNT.initials}
          </span>
          <div className="min-w-0">
            <p className="truncate text-[13px] font-medium text-ink">
              {DEMO_ACCOUNT.name}
            </p>
            <p className="truncate font-mono text-[11px] text-ink-muted">
              {DEMO_ACCOUNT.handle}
            </p>
          </div>
        </div>
        <DemoBadge className="mt-3" />
      </div>
    </aside>
  );
}
