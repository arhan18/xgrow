"use client";

import { useSyncExternalStore } from "react";
import type { ComponentType } from "react";
import Link from "next/link";
import {
  Ban,
  Calculator,
  FlaskConical,
  Lightbulb,
  MessageSquare,
  PenLine,
  TrendingUp,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { BadgeVariant } from "@/components/ui/badge";
import { Panel, PanelHeader } from "@/components/ui/panel";
import { EmptyState } from "@/components/ui/state";
import { AccountStrip } from "@/components/app/account-strip";
import {
  CONFIDENCE_RULES,
} from "@/lib/analysis/metrics";
import { PLAN_RULES, buildPlan } from "@/lib/analysis/plan";
import { analyzeDemoAccount } from "@/lib/demo/analysis";
import { DEMO_POSTS } from "@/lib/demo/posts";
import {
  formatRatio,
  pluralize,
} from "@/lib/format";
import { useProfile } from "@/lib/store/onboarding";
import type { InsightConfidence, PlanItem, PlanKind } from "@/lib/types";
import { cn } from "@/lib/utils";

const KIND_META: Record<
  PlanKind,
  {
    label: string;
    icon: ComponentType<{ className?: string; "aria-hidden"?: true }>;
    chip: string;
    card: string;
  }
> = {
  post: {
    label: "Post",
    icon: PenLine,
    chip: "border-signal-200 bg-signal-50 text-signal-700",
    card: "border-signal-200 bg-signal-50/40",
  },
  engage: {
    label: "Engage",
    icon: MessageSquare,
    chip: "border-line bg-sunken text-ink-muted",
    card: "",
  },
  experiment: {
    label: "Experiment",
    icon: FlaskConical,
    chip: "border-signal-200 bg-signal-50 text-signal-700",
    card: "border-signal-200 bg-signal-50/40",
  },
  "double-down": {
    label: "Double down",
    icon: TrendingUp,
    chip: "border-signal-200 bg-signal-50 text-signal-700",
    card: "border-signal-200 bg-signal-50/40",
  },
  stop: {
    label: "Stop",
    icon: Ban,
    chip: "border-line-strong bg-surface text-ink-soft",
    card: "border-dashed border-line-strong bg-sunken/60",
  },
};

const CONFIDENCE_LABELS: Record<InsightConfidence, string> = {
  "early-signal": "Early signal",
  moderate: "Moderate",
  strong: "Strong",
};

const POST_TEXT = new Map(DEMO_POSTS.map((post) => [post.id, post.text]));

function confidenceVariant(confidence: InsightConfidence): BadgeVariant {
  if (confidence === "early-signal") return "demo";
  if (confidence === "strong") return "signal";
  return "neutral";
}

const TODAY_FORMATTER = new Intl.DateTimeFormat("en-US", {
  weekday: "long",
  month: "long",
  day: "numeric",
});

function subscribeToday(): () => void {
  return () => {};
}

/**
 * Current date, client-side only: the static build renders "Today" and the
 * real date appears after hydration (same swap the profile store does).
 */
function useTodayLabel(): string | null {
  return useSyncExternalStore(
    subscribeToday,
    () => TODAY_FORMATTER.format(new Date()),
    () => null,
  );
}

function PostChips({ ids }: { ids: string[] }) {
  if (ids.length === 0) return null;
  const shown = ids.slice(0, 12);
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {shown.map((id) => (
        <span
          key={id}
          title={POST_TEXT.get(id)}
          className="rounded border border-line bg-paper px-1.5 py-0.5 font-mono text-[10px] text-ink-muted"
        >
          {id}
        </span>
      ))}
      {ids.length > shown.length ? (
        <span className="font-mono text-[10px] text-ink-muted">
          +{ids.length - shown.length}
        </span>
      ) : null}
    </div>
  );
}

function PlanCard({ item, index }: { item: PlanItem; index: number }) {
  const meta = KIND_META[item.kind];
  const Icon = meta.icon;
  const isStop = item.kind === "stop";

  return (
    <Panel className={cn("p-5 sm:p-6", meta.card)}>
      <div className="flex flex-wrap items-center gap-2">
        <span
          className={cn(
            "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-[3px] text-[11px] font-medium leading-none tracking-[0.02em]",
            meta.chip,
          )}
        >
          <Icon className="h-3.5 w-3.5" aria-hidden />
          {meta.label}
        </span>
        <Badge variant="outline">
          {isStop ? "0 min · avoid" : `~${item.minutes} min`}
        </Badge>
        <Badge variant={confidenceVariant(item.confidence)}>
          {CONFIDENCE_LABELS[item.confidence]}
        </Badge>
        {item.metric ? (
          <span className="ml-auto flex items-baseline gap-2">
            <span className="font-display text-2xl leading-none text-ink">
              {item.metric.value}
            </span>
            <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink-muted">
              {item.metric.label}
            </span>
          </span>
        ) : null}
      </div>

      <h3 className="mt-3.5 flex items-baseline gap-3 font-display text-xl leading-snug text-ink">
        <span className="font-mono text-[11px] text-ink-muted">
          {String(index + 1).padStart(2, "0")}
        </span>
        {item.title}
      </h3>
      <p className="mt-2 max-w-3xl pl-0 text-[15px] leading-relaxed text-ink-soft sm:pl-7">
        {item.statement}
      </p>

      <div className="mt-4 rounded-lg border border-line bg-paper px-4 py-3 sm:ml-7">
        <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink-muted">
          Evidence
        </p>
        <p className="mt-1.5 font-mono text-[12px] leading-relaxed text-ink-soft">
          {item.evidence}
        </p>
      </div>

      {item.supportingPostIds.length > 0 ? (
        <div className="mt-3.5 flex flex-wrap items-center gap-2 sm:ml-7">
          <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink-muted">
            Posts
          </span>
          <PostChips ids={item.supportingPostIds} />
        </div>
      ) : null}
    </Panel>
  );
}

function SectionHeading({
  eyebrow,
  title,
  hint,
}: {
  eyebrow: string;
  title: string;
  hint: string;
}) {
  return (
    <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
      <div>
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-muted">
          {eyebrow}
        </p>
        <h2 className="mt-1.5 font-display text-2xl leading-tight text-ink">
          {title}
        </h2>
      </div>
      <p className="max-w-md text-[13px] leading-relaxed text-ink-muted">
        {hint}
      </p>
    </div>
  );
}

export function PlanView() {
  const profile = useProfile();
  const analysis = analyzeDemoAccount();
  const plan = buildPlan({ analysis, posts: DEMO_POSTS, profile });
  const todayLabel = useTodayLabel();

  const method = [
    `Every action lists the post IDs behind it — hover an ID to read the post. Nothing here is guessed: the numbers come from the same ${analysis.summary.postCount}-post sample the Learn page shows.`,
    `Your ${plan.timeBudget}-minute budget is split Post ${Math.round(PLAN_RULES.timeWeights.post * 100)}%, Engage ${Math.round(PLAN_RULES.timeWeights.engage * 100)}%, Experiment ${Math.round(PLAN_RULES.timeWeights.experiment * 100)}% and Double down ${Math.round(PLAN_RULES.timeWeights["double-down"] * 100)}%, rounded so the day adds up to exactly ${plan.timeBudget} minutes. Stop actions cost nothing.`,
    `Gates: a schedule day needs ${CONFIDENCE_RULES.minDayPosts}+ posts, a sequel needs ≥ ${PLAN_RULES.outlierReachRatio}× median reach, and the stop rule needs ≤ ${formatRatio(CONFIDENCE_RULES.strongRatioLow)} baseline with ${CONFIDENCE_RULES.minSample}+ posts — weekdays are checked before topics.`,
    `Confidence labels are the Learn page's rules: under ${CONFIDENCE_RULES.minSample} posts is an early signal, ${CONFIDENCE_RULES.minSample}+ with a ${formatRatio(CONFIDENCE_RULES.strongRatioHigh)} jump or ${formatRatio(CONFIDENCE_RULES.strongRatioLow)} drop is strong, everything else moderate.`,
    `Same sample and same setup produce the same plan, every time — deterministic arithmetic, no live X API and no model writing these numbers.`,
  ];

  return (
    <div className="space-y-10">
      <AccountStrip />

      <section>
        <SectionHeading
          eyebrow={todayLabel ?? "Today"}
          title={`${pluralize(plan.items.length, "action")} for your ${plan.timeBudget} minutes`}
          hint={`${plan.totalMinutes} of ${plan.timeBudget} min scheduled · derived from what your own posts already proved.`}
        />
        {plan.items.length === 0 ? (
          <EmptyState
            eyebrow="No actions cleared the rules"
            title="Nothing is safe to recommend yet"
            description="The plan only fires when the sample backs it. Publish a few posts, then come back — the rules here are the same ones the analysis uses."
          />
        ) : (
          <div className="space-y-4">
            {plan.items.map((item, index) => (
              <PlanCard key={item.id} item={item} index={index} />
            ))}
          </div>
        )}
      </section>

      <Panel>
        <PanelHeader
          title="How this plan was built"
          meta={<Calculator className="h-4 w-4 text-ink-muted" aria-hidden />}
        />
        <ul className="space-y-3.5 px-5 py-4">
          {method.map((line, index) => (
            <li key={line} className="flex gap-3.5">
              <span className="mt-px shrink-0 font-mono text-[11px] text-ink-muted">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="text-[13px] leading-relaxed text-ink-soft">
                {line}
              </span>
            </li>
          ))}
        </ul>
      </Panel>

      <p className="flex items-start gap-2 text-[13px] leading-relaxed text-ink-muted">
        <Lightbulb className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
        <span>
          Finished the loop?{" "}
          <Link href="/app/learned" className="text-ink underline underline-offset-2 hover:text-signal-700">
            The Learn page
          </Link>{" "}
          holds the full evidence behind every number cited above.
        </span>
      </p>
    </div>
  );
}
