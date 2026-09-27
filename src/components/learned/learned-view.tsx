"use client";

import { Calculator, Lightbulb } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { BadgeVariant } from "@/components/ui/badge";
import { DemoNote } from "@/components/ui/demo-badge";
import { Panel, PanelHeader } from "@/components/ui/panel";
import { CONFIDENCE_RULES } from "@/lib/analysis/metrics";
import { DEMO_ACCOUNT, TIME_BUDGETS, goalLabel, nicheLabel } from "@/lib/demo/account";
import { analyzeDemoAccount } from "@/lib/demo/analysis";
import { DEMO_POSTS } from "@/lib/demo/posts";
import {
  formatDate,
  formatDateRange,
  formatCount,
  formatPercent,
  formatReach,
  formatRatio,
  pluralize,
} from "@/lib/format";
import { formatLabel, topicLabel } from "@/lib/labels";
import { useProfile } from "@/lib/store/onboarding";
import type {
  GrowthInsight,
  InsightConfidence,
  InsightType,
} from "@/lib/types";
import { cn } from "@/lib/utils";

const TYPE_LABELS: Record<InsightType, string> = {
  observed: "Observed",
  calculated: "Calculated",
  inference: "Inference",
  recommendation: "Recommendation",
  experiment: "Experiment",
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

function RatioBadge({
  ratio,
  postCount,
}: {
  ratio: number;
  postCount: number;
}) {
  const variant: BadgeVariant =
    ratio >= CONFIDENCE_RULES.strongRatioHigh
      ? "signal"
      : ratio <= CONFIDENCE_RULES.strongRatioLow
        ? "outline"
        : "neutral";

  return (
    <span className="flex shrink-0 flex-wrap items-center justify-end gap-1.5">
      <Badge variant={variant}>{formatRatio(ratio)}</Badge>
      {postCount < CONFIDENCE_RULES.minSample ? (
        <Badge variant="demo">Early signal</Badge>
      ) : null}
    </span>
  );
}

function RankRow({
  index,
  name,
  meta,
  rate,
  ratio,
  postCount,
}: {
  index: number;
  name: string;
  meta: string;
  rate: string;
  ratio: number;
  postCount: number;
}) {
  return (
    <li className="flex items-center gap-3 py-3.5">
      <span className="w-4 shrink-0 font-mono text-[11px] text-ink-muted">
        {index}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-medium text-ink">
          {name}
        </span>
        <span className="block font-mono text-[11px] text-ink-muted">
          {meta}
        </span>
      </span>
      <span className="flex shrink-0 flex-col items-end gap-1.5 sm:flex-row sm:items-center sm:gap-2.5">
        <span className="font-mono text-sm tabular-nums text-ink">
          {rate}
        </span>
        <RatioBadge ratio={ratio} postCount={postCount} />
      </span>
    </li>
  );
}

function InsightCard({ insight }: { insight: GrowthInsight }) {
  const isAction =
    insight.type === "recommendation" || insight.type === "experiment";

  return (
    <Panel
      className={cn("p-5 sm:p-6", isAction && "border-signal-200 bg-signal-50/40")}
    >
      <div className="flex flex-wrap items-center gap-2">
        <Badge variant="outline">{TYPE_LABELS[insight.type]}</Badge>
        <Badge variant={confidenceVariant(insight.confidence)}>
          {CONFIDENCE_LABELS[insight.confidence]}
        </Badge>
        {insight.metric ? (
          <span className="ml-auto flex items-baseline gap-2">
            <span className="font-display text-2xl leading-none text-ink">
              {insight.metric.value}
            </span>
            <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink-muted">
              {insight.metric.label}
            </span>
          </span>
        ) : null}
      </div>

      <h3 className="mt-3.5 font-display text-xl leading-snug text-ink">
        {insight.title}
      </h3>
      <p className="mt-2 max-w-3xl text-[15px] leading-relaxed text-ink-soft">
        {insight.statement}
      </p>

      {insight.recommendation ? (
        <p className="mt-3 flex max-w-3xl items-start gap-2 text-[14px] leading-relaxed text-ink">
          <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-signal-700" aria-hidden />
          <span>{insight.recommendation}</span>
        </p>
      ) : null}

      <div className="mt-4 rounded-lg border border-line bg-paper px-4 py-3">
        <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink-muted">
          Evidence
        </p>
        <p className="mt-1.5 font-mono text-[12px] leading-relaxed text-ink-soft">
          {insight.evidence}
        </p>
      </div>

      {insight.supportingPostIds.length > 0 ? (
        <div className="mt-3.5 flex flex-wrap items-center gap-2">
          <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink-muted">
            Posts
          </span>
          <PostChips ids={insight.supportingPostIds} />
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

export function LearnedView() {
  const profile = useProfile();
  const analysis = analyzeDemoAccount();
  const { summary, primarySignal, insights, recommendations } = analysis;
  const budget = TIME_BUDGETS.find(
    (item) => item.minutes === profile.timePerDay,
  );
  const maxReach = Math.max(
    ...DEMO_POSTS.map((post) => post.metrics.impressions),
  );

  const sampleStats = [
    { label: "Posts analyzed", value: formatCount(summary.postCount) },
    { label: "Window", value: `${summary.windowDays} days` },
    { label: "Cadence", value: `${summary.postsPerWeek} / week` },
    { label: "Median reach", value: formatCount(summary.medianImpressions) },
    {
      label: "Median engagement",
      value: formatPercent(summary.medianEngagementRate),
    },
    { label: "Total reach", value: formatReach(summary.totalImpressions) },
  ];

  const method = [
    `Engagement rate = (likes + replies + reposts + bookmarks) ÷ impressions, computed per post before anything is aggregated.`,
    `Everything below is a median, not an average. Mean reach here is ${formatReach(summary.avgImpressions)} against a ${formatCount(summary.medianImpressions)} median — one post of ${formatReach(maxReach)} would drag any average.`,
    `Confidence: a group under ${CONFIDENCE_RULES.minSample} posts is labelled "Early signal". ${CONFIDENCE_RULES.minSample}+ posts with a ${formatRatio(CONFIDENCE_RULES.strongRatioHigh)} jump or ${formatRatio(CONFIDENCE_RULES.strongRatioLow)} drop versus the baseline is "Strong"; everything else is "Moderate".`,
    `Rankings: formats need ${CONFIDENCE_RULES.minFormatPosts}+ posts to appear, weekday claims need ${CONFIDENCE_RULES.minDayPosts}+ posts per day, and single-post groups are flagged as untested instead of ranked.`,
    `Traceability: every finding lists the post IDs behind it — hover an ID to read that post's text.`,
    `All of it is plain arithmetic over the sample above. No live X API, no model guessing at the numbers.`,
  ];

  return (
    <div className="space-y-10">
      <Panel>
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-line px-5 py-3.5">
          <div className="flex items-center gap-3">
            <span
              aria-hidden
              className="grid h-9 w-9 place-items-center rounded-full bg-signal-100 text-[12px] font-medium text-signal-800"
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
        <div className="flex flex-wrap items-center gap-2 px-5 py-4">
          <Badge variant="outline">Goal: {goalLabel(profile.goalId)}</Badge>
          <Badge variant="outline">Niche: {nicheLabel(profile.nicheId)}</Badge>
          <Badge variant="outline">
            {budget?.label ?? `${profile.timePerDay} min / day`}
          </Badge>
          <span className="ml-auto font-mono text-[11px] text-ink-muted">
            {formatDateRange(summary.from, summary.to)}
          </span>
        </div>
      </Panel>

      <Panel className="border-signal-600/30 bg-signal-50/50 p-6 sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-5">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-signal-700">
              Primary finding
            </p>
            <h2 className="mt-3 max-w-xl font-display text-2xl leading-tight text-ink sm:text-3xl">
              {primarySignal.title}
            </h2>
          </div>
          {primarySignal.metric ? (
            <div className="flex items-baseline gap-3">
              <span className="font-display text-5xl leading-none text-signal-700 sm:text-6xl">
                {primarySignal.metric.value}
              </span>
              <span className="max-w-[7rem] font-mono text-[11px] uppercase leading-tight tracking-[0.14em] text-ink-muted">
                {primarySignal.metric.label}
              </span>
            </div>
          ) : null}
        </div>

        <p className="mt-5 max-w-3xl text-[15px] leading-relaxed text-ink-soft">
          {primarySignal.statement}
        </p>

        {primarySignal.recommendation ? (
          <p className="mt-4 flex max-w-3xl items-start gap-2 text-[14px] leading-relaxed text-ink">
            <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-signal-700" aria-hidden />
            <span>{primarySignal.recommendation}</span>
          </p>
        ) : null}

        <div className="mt-5 rounded-lg border border-signal-200 bg-surface px-4 py-3">
          <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink-muted">
            Evidence
          </p>
          <p className="mt-1.5 font-mono text-[12px] leading-relaxed text-ink-soft">
            {primarySignal.evidence}
          </p>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <Badge variant="outline">{TYPE_LABELS[primarySignal.type]}</Badge>
          <Badge variant={confidenceVariant(primarySignal.confidence)}>
            {CONFIDENCE_LABELS[primarySignal.confidence]}
          </Badge>
          <span className="hidden font-mono text-[10px] uppercase tracking-[0.14em] text-ink-muted sm:inline">
            Posts
          </span>
          <PostChips ids={primarySignal.supportingPostIds} />
        </div>
      </Panel>

      <Panel>
        <PanelHeader
          title="The sample"
          meta={
            <span className="font-mono text-[11px] text-ink-muted">
              {formatDateRange(summary.from, summary.to)}
            </span>
          }
        />
        <dl className="grid grid-cols-2 gap-px bg-line sm:grid-cols-3 lg:grid-cols-6">
          {sampleStats.map((stat) => (
            <div key={stat.label} className="bg-surface px-5 py-4">
              <dt className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink-muted">
                {stat.label}
              </dt>
              <dd className="mt-1.5 font-mono text-sm tabular-nums text-ink">
                {stat.value}
              </dd>
            </div>
          ))}
        </dl>
      </Panel>

      <div className="grid gap-6 lg:grid-cols-2">
        <Panel>
          <PanelHeader title="Topics, ranked" meta="median engagement rate" />
          <ul className="divide-y divide-line px-5">
            {analysis.topTopics.map((topic, index) => (
              <RankRow
                key={topic.topic}
                index={index + 1}
                name={topicLabel(topic.topic)}
                meta={`${pluralize(topic.postCount, "post")} · reach ${formatCount(topic.medianImpressions)}`}
                rate={formatPercent(topic.medianEngagementRate)}
                ratio={topic.engagementVsAccount}
                postCount={topic.postCount}
              />
            ))}
          </ul>
        </Panel>

        <Panel>
          <PanelHeader
            title="Formats, ranked"
            meta={`${CONFIDENCE_RULES.minFormatPosts}+ posts to rank`}
          />
          <ul className="divide-y divide-line px-5">
            {analysis.topFormats.map((format, index) => (
              <RankRow
                key={format.format}
                index={index + 1}
                name={formatLabel(format.format)}
                meta={`${pluralize(format.postCount, "post")} · ${formatCount(format.medianReplies)} median replies`}
                rate={formatPercent(format.medianEngagementRate)}
                ratio={format.engagementVsAccount}
                postCount={format.postCount}
              />
            ))}
          </ul>
        </Panel>
      </div>

      <Panel>
        <PanelHeader
          title="Day patterns"
          meta="UTC publish day · median engagement rate"
        />
        <ul className="grid grid-cols-2 gap-px bg-line sm:grid-cols-4 lg:grid-cols-7">
          {analysis.dayPatterns.map((day) => (
            <li key={day.day} className="bg-surface px-4 py-4">
              <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink-muted">
                {day.day}
              </p>
              <p className="mt-1.5 font-mono text-lg tabular-nums text-ink">
                {formatPercent(day.medianEngagementRate)}
              </p>
              <p className="mt-0.5 font-mono text-[10px] text-ink-muted">
                {pluralize(day.postCount, "post")}
              </p>
              {day.postCount < CONFIDENCE_RULES.minDayPosts ? (
                <Badge variant="demo" className="mt-2">
                  Early signal
                </Badge>
              ) : null}
            </li>
          ))}
        </ul>
      </Panel>

      <Panel>
        <PanelHeader
          title="Posts that earned their reach"
          meta="ranked by engagement rate"
        />
        <ul className="divide-y divide-line px-5">
          {analysis.topPosts.map(({ post, engagementRate }) => (
            <li key={post.id} className="flex items-start gap-4 py-4">
              <div className="min-w-0 flex-1">
                <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink-muted">
                  {formatDate(post.publishedAt)} · {formatLabel(post.format)} ·{" "}
                  {topicLabel(post.topic)} · {post.id}
                </p>
                <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-ink">
                  {post.text}
                </p>
                <p className="mt-1.5 font-mono text-[11px] text-ink-muted">
                  {formatReach(post.metrics.impressions)} impressions ·{" "}
                  {formatCount(post.metrics.replies)} replies
                </p>
              </div>
              <div className="shrink-0 text-right">
                <p className="font-mono text-sm font-medium tabular-nums text-signal-700">
                  {formatPercent(engagementRate)}
                </p>
                <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-ink-muted">
                  engagement
                </p>
              </div>
            </li>
          ))}
        </ul>
      </Panel>

      <section>
        <SectionHeading
          eyebrow="Findings"
          title="What the numbers say"
          hint="Observed facts, calculated metrics and inferences kept apart — each one traceable to the posts it came from."
        />
        <div className="space-y-4">
          {insights.map((insight) => (
            <InsightCard key={insight.id} insight={insight} />
          ))}
        </div>
      </section>

      <section>
        <SectionHeading
          eyebrow="Next steps"
          title="What to do about it"
          hint="Recommendations and one experiment, sized for the cadence and time budget you set up."
        />
        <div className="space-y-4">
          {recommendations.map((recommendation) => (
            <InsightCard key={recommendation.id} insight={recommendation} />
          ))}
        </div>
      </section>

      <Panel>
        <PanelHeader
          title="How we calculated this"
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
    </div>
  );
}
