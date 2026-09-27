import type { Metadata } from "next";
import Link from "next/link";
import { CalendarCheck } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { buttonVariants } from "@/components/ui/button";
import { DemoNote } from "@/components/ui/demo-badge";
import { EmptyState } from "@/components/ui/state";
import { Panel } from "@/components/ui/panel";
import { DEMO_ACCOUNT, formatCount, GROWTH_GOALS, TIME_BUDGETS } from "@/lib/demo/account";

export const metadata: Metadata = { title: "Today" };

const todayLabel = new Intl.DateTimeFormat("en-US", {
  weekday: "long",
  month: "long",
  day: "numeric",
}).format(new Date());

function AccountStrip() {
  const goal = GROWTH_GOALS.find((item) => item.id === DEMO_ACCOUNT.goalId);
  const budget = TIME_BUDGETS.find(
    (item) => item.minutes === DEMO_ACCOUNT.dailyMinutes,
  );

  const facts = [
    { label: "Followers", value: formatCount(DEMO_ACCOUNT.stats.followers) },
    { label: "Posts analyzed", value: formatCount(DEMO_ACCOUNT.stats.posts) },
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

export default function TodayPage() {
  return (
    <>
      <PageHeader
        eyebrow={todayLabel}
        title="Today's Growth Plan"
        description="One short list of actions for today — post, engage, experiment, double down, and what to avoid. Sized to the time you actually have."
      />

      <AccountStrip />

      <EmptyState
        eyebrow="Waiting for analysis"
        icon={<CalendarCheck className="h-5 w-5" />}
        title="Your plan will appear here"
        description="Once Xgrow finishes learning this account, TODAY becomes the only screen you need: the exact posts, replies and experiments worth your time today."
        action={
          <Link href="/app/onboarding" className={buttonVariants()}>
            Review your setup
          </Link>
        }
      />
    </>
  );
}
