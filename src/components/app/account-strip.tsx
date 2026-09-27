"use client";

import { Panel } from "@/components/ui/panel";
import { DemoNote } from "@/components/ui/demo-badge";
import { DEMO_ACCOUNT, GROWTH_GOALS, TIME_BUDGETS } from "@/lib/demo/account";
import { analyzeDemoAccount } from "@/lib/demo/analysis";
import { formatCount } from "@/lib/format";
import { useProfile } from "@/lib/store/onboarding";

export function AccountStrip() {
  const profile = useProfile();
  const { summary } = analyzeDemoAccount();
  const goal = GROWTH_GOALS.find((item) => item.id === profile.goalId);
  const budget = TIME_BUDGETS.find(
    (item) => item.minutes === profile.timePerDay,
  );

  const facts = [
    { label: "Followers", value: formatCount(DEMO_ACCOUNT.followers) },
    { label: "Posts analyzed", value: formatCount(summary.postCount) },
    { label: "Goal", value: goal?.label ?? "—" },
    { label: "Daily budget", value: budget?.label ?? "—" },
  ];

  return (
    <Panel className="mb-8">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-line px-5 py-3.5">
        <div className="flex items-center gap-3">
          <span
            aria-hidden
            className="grid h-8 w-8 place-items-center rounded-full bg-signal-100 text-[11px] font-medium text-signal-800"
          >
            {DEMO_ACCOUNT.initials}
          </span>
          <div>
            <p className="text-sm font-medium text-ink">
              {DEMO_ACCOUNT.name}
            </p>
            <p className="font-mono text-[11px] text-ink-muted">
              {DEMO_ACCOUNT.handle}
            </p>
          </div>
        </div>
        <DemoNote />
      </div>
      <dl className="grid grid-cols-2 gap-px bg-line sm:grid-cols-4">
        {facts.map((fact) => (
          <div key={fact.label} className="bg-surface px-5 py-4">
            <dt className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink-muted">
              {fact.label}
            </dt>
            <dd className="mt-1.5 text-sm font-medium text-ink">{fact.value}</dd>
          </div>
        ))}
      </dl>
    </Panel>
  );
}
