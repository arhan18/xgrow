import type {
  AnalysisResult,
  ContentTopic,
  DailyPlan,
  OnboardingProfile,
  PlanItem,
  PlanKind,
  XPost,
} from "@/lib/types";
import { formatLabel, formatPhrase, topicLabel, WEEKDAY_FULL } from "@/lib/labels";
import {
  formatDate,
  formatCount,
  formatPercent,
  formatReach,
  formatRatio,
  pluralize,
} from "@/lib/format";
import {
  CONFIDENCE_RULES,
  confidenceFor,
  engagementRate,
  relative,
  sampleCaveat,
  utcDayLabel,
} from "@/lib/analysis/metrics";

export interface PlanInput {
  analysis: AnalysisResult;
  posts: XPost[];
  profile: OnboardingProfile;
}

/**
 * The rules that turn analysis into a day of actions. Defined once, quoted
 * verbatim by the TODAY page's methodology — never restated as literals.
 */
export const PLAN_RULES = {
  /** Share of the daily time budget per kind; stop always costs 0. */
  timeWeights: {
    post: 0.45,
    engage: 0.25,
    experiment: 0.15,
    "double-down": 0.15,
    stop: 0,
  } as const,
  /** A sequel is only suggested when the outlier beat the median this hard. */
  outlierReachRatio: 5,
  /** Experiment size: posts × weeks. */
  experimentPosts: 2,
  experimentWeeks: 2,
} as const;

/** Play order — the same order the plan UI renders in. */
export const PLAN_KIND_ORDER: PlanKind[] = [
  "post",
  "engage",
  "experiment",
  "double-down",
  "stop",
];

function postsOf(posts: XPost[], topic: ContentTopic): string[] {
  return posts.filter((post) => post.topic === topic).map((post) => post.id);
}

function fullDay(short: string): string {
  return WEEKDAY_FULL[short] ?? short;
}

function postItem({ analysis, posts }: PlanInput): Omit<PlanItem, "minutes"> | null {
  const { summary, topTopics, topFormats, dayPatterns } = analysis;
  const best = topTopics[0];
  if (!best) return null;

  const label = topicLabel(best.topic);
  const bestFormat = topFormats[0];
  const phrase = bestFormat ? formatPhrase(bestFormat.format) : "a post";
  const confidence = confidenceFor(best.postCount, best.engagementVsAccount);
  const scheduleDay = dayPatterns.find(
    (day) => day.postCount >= CONFIDENCE_RULES.minDayPosts,
  );
  const scheduleClause = scheduleDay
    ? ` and schedule it for ${fullDay(scheduleDay.day)} — ${fullDay(scheduleDay.day)} posts run ${formatRatio(relative(scheduleDay.medianEngagementRate, summary.medianEngagementRate))} your baseline across ${pluralize(scheduleDay.postCount, "post")}`
    : "";

  return {
    id: "plan-post",
    kind: "post",
    title: `Draft ${phrase} on ${label.toLowerCase()}`,
    statement: sampleCaveat(
      `One post today: ${phrase} on ${label.toLowerCase()}${scheduleClause}. The topic sits at ${formatPercent(best.medianEngagementRate)} median engagement — ${formatRatio(best.engagementVsAccount)} the ${formatPercent(summary.medianEngagementRate)} account baseline.`,
      confidence,
      best.postCount,
    ),
    evidence: `Topic ranking (${pluralize(best.postCount, "post")} at ${formatPercent(best.medianEngagementRate)}) and format ranking (${bestFormat ? `${pluralize(bestFormat.postCount, "post")} at ${formatPercent(bestFormat.medianEngagementRate)}` : "sample too small to rank formats"}) from all ${summary.postCount} posts. The schedule clause needs a day with ${CONFIDENCE_RULES.minDayPosts}+ posts — ${scheduleDay ? `${scheduleDay.day} qualifies with ${scheduleDay.postCount}` : "no day qualifies yet, so no day is named"}.`,
    confidence,
    supportingPostIds: postsOf(posts, best.topic),
    metric: {
      value: formatRatio(best.engagementVsAccount),
      label: "topic vs baseline",
    },
  };
}

function engageItem({ analysis }: PlanInput): Omit<PlanItem, "minutes"> | null {
  const conversational = analysis.topPosts.filter(
    (entry) => entry.post.metrics.replies > 0,
  );
  const [first, second] = conversational;
  if (!first || !second) return null;

  const totalReplies =
    first.post.metrics.replies + second.post.metrics.replies;

  return {
    id: "plan-engage",
    kind: "engage",
    title: "Answer the conversations on your best posts",
    statement: `The most conversation in this sample sits on ${first.post.id} (${pluralize(first.post.metrics.replies, "reply")}) and ${second.post.id} (${pluralize(second.post.metrics.replies, "reply")}). Put your engagement block there first — reply to the strongest answers with real follow-ups.`,
    evidence: `Reply counts read straight from the two highest-engagement posts in the sample (${formatPercent(first.engagementRate)} and ${formatPercent(second.engagementRate)} engagement rate). Exact counts on posts you already published — no modelling involved.`,
    confidence: "strong",
    supportingPostIds: [first.post.id, second.post.id],
    metric: {
      value: formatCount(totalReplies),
      label: "replies across top 2",
    },
  };
}

function doubleDownItem({ analysis, posts }: PlanInput): Omit<PlanItem, "minutes"> | null {
  const { summary } = analysis;
  if (posts.length < 2) return null;

  const outlier = [...posts].sort(
    (a, b) => b.metrics.impressions - a.metrics.impressions,
  )[0];
  const reachRatio = relative(outlier.metrics.impressions, summary.medianImpressions);
  if (reachRatio < PLAN_RULES.outlierReachRatio) return null;

  const share = relative(outlier.metrics.impressions, summary.totalImpressions);

  return {
    id: "plan-double-down",
    kind: "double-down",
    title: `Write the sequel to your ${formatDate(outlier.publishedAt)} post`,
    statement: `${outlier.id} alone pulled ${formatReach(outlier.metrics.impressions)} impressions — ${formatRatio(reachRatio)} your median post and ${formatPercent(share, 0)} of every impression in the sample. Draft a follow-up in the same vein: this audience has already proven it is looking.`,
    evidence: `Post ${outlier.id}: ${formatCount(outlier.metrics.impressions)} ÷ ${formatCount(summary.medianImpressions)} median impressions = ${formatRatio(reachRatio)}, and ÷ ${formatCount(summary.totalImpressions)} total = ${formatPercent(share, 0)}. Sequels are only suggested at ${PLAN_RULES.outlierReachRatio}× the median or above. What is being doubled down on is reach — the original's engagement rate (${formatPercent(engagementRate(outlier))}) is ${engagementRate(outlier) >= summary.medianEngagementRate ? "at or above" : "below"} the ${formatPercent(summary.medianEngagementRate)} account median.`,
    confidence: "strong",
    supportingPostIds: [outlier.id],
    metric: {
      value: formatReach(outlier.metrics.impressions),
      label: "impressions earned",
    },
  };
}

function experimentItem({ analysis, posts }: PlanInput): Omit<PlanItem, "minutes"> | null {
  const { summary, topTopics, topFormats } = analysis;
  const worst = topTopics[topTopics.length - 1];
  const bestFormat = topFormats[0];
  if (!worst || topTopics.length < 2 || !bestFormat) return null;
  if (worst.engagementVsAccount >= 1) return null;

  const label = topicLabel(worst.topic);
  const phrase = formatPhrase(bestFormat.format);
  const confidence = confidenceFor(worst.postCount, worst.engagementVsAccount);

  return {
    id: "plan-experiment",
    kind: "experiment",
    title: `Test ${label.toLowerCase()} as ${phrase}`,
    statement: sampleCaveat(
      `Run ${PLAN_RULES.experimentPosts} ${label.toLowerCase()} posts as ${phrase} over ${PLAN_RULES.experimentWeeks} weeks. Success = both clearing the ${formatPercent(summary.medianEngagementRate)} account median; today the topic sits at ${formatPercent(worst.medianEngagementRate)} (${formatRatio(worst.engagementVsAccount)}).`,
      confidence,
      worst.postCount,
    ),
    evidence: `Controlled swap: same topic, format changed to ${formatLabel(bestFormat.format).toLowerCase()} — ${PLAN_RULES.experimentPosts} posts over ${PLAN_RULES.experimentWeeks} weeks against a fixed ${formatPercent(summary.medianEngagementRate)} median from all ${summary.postCount} sampled posts. The baseline cannot move during the test.`,
    confidence,
    supportingPostIds: postsOf(posts, worst.topic),
    metric: {
      value: formatPercent(summary.medianEngagementRate),
      label: "rate to beat",
    },
  };
}

function stopItem(
  { analysis, posts }: PlanInput,
  hasExperiment: boolean,
): Omit<PlanItem, "minutes"> | null {
  const { summary, topTopics, dayPatterns } = analysis;

  // Rule 1: a weekday that is both well-sampled and strongly below baseline.
  const weakDay = [...dayPatterns]
    .reverse()
    .find(
      (day) =>
        day.postCount >= CONFIDENCE_RULES.minDayPosts &&
        relative(day.medianEngagementRate, summary.medianEngagementRate) <=
          CONFIDENCE_RULES.strongRatioLow,
    );
  if (weakDay) {
    const ratio = relative(weakDay.medianEngagementRate, summary.medianEngagementRate);
    const dayName = fullDay(weakDay.day);
    const bestDay = fullDay(dayPatterns[0].day);
    return {
      id: "plan-stop",
      kind: "stop",
      title: `Stop publishing on ${dayName}s`,
      statement: `${dayName} posts median ${formatPercent(weakDay.medianEngagementRate)} across ${pluralize(weakDay.postCount, "post")} — ${formatRatio(ratio)} the account baseline, past the ${formatRatio(CONFIDENCE_RULES.strongRatioLow)} line. Move that slot to ${bestDay}s instead.`,
      evidence: `Weekday rule, checked first: needs ${CONFIDENCE_RULES.minDayPosts}+ posts and ≤ ${formatRatio(CONFIDENCE_RULES.strongRatioLow)} the baseline. ${weakDay.day} qualifies at ${formatRatio(ratio)}. Days below the sample size were skipped rather than judged.`,
      confidence: confidenceFor(weakDay.postCount, ratio),
      supportingPostIds: posts
        .filter((post) => utcDayLabel(post) === weakDay.day)
        .map((post) => post.id),
      metric: { value: formatRatio(ratio), label: "vs baseline" },
    };
  }

  // Rule 2: fall through to topics — the worst one, strongly below baseline.
  const weakTopics = topTopics.filter(
    (topic) =>
      topic.engagementVsAccount <= CONFIDENCE_RULES.strongRatioLow &&
      confidenceFor(topic.postCount, topic.engagementVsAccount) === "strong",
  );
  const worst = weakTopics[weakTopics.length - 1];
  if (!worst) return null;

  const label = topicLabel(worst.topic);
  const returnClause = hasExperiment
    ? ` It only comes back through the experiment above.`
    : "";
  const confidence = confidenceFor(worst.postCount, worst.engagementVsAccount);

  return {
    id: "plan-stop",
    kind: "stop",
    title: `Pause ${label.toLowerCase()} posts`,
    statement: `${label} posts median ${formatPercent(worst.medianEngagementRate)} across ${pluralize(worst.postCount, "post")} — ${formatRatio(worst.engagementVsAccount)} the ${formatPercent(summary.medianEngagementRate)} baseline, and none of them clear it.${returnClause}`,
    evidence: `No weekday met the stop rule (${CONFIDENCE_RULES.minDayPosts}+ posts at ≤ ${formatRatio(CONFIDENCE_RULES.strongRatioLow)} baseline), so it fell through to topics: ${worst.topic} is ${pluralize(worst.postCount, "post")} at ${formatRatio(worst.engagementVsAccount)} — strong confidence by the shared rules (${CONFIDENCE_RULES.minSample}+ posts, ≤ ${formatRatio(CONFIDENCE_RULES.strongRatioLow)} baseline).`,
    confidence,
    supportingPostIds: postsOf(posts, worst.topic),
    metric: {
      value: formatRatio(worst.engagementVsAccount),
      label: "vs baseline",
    },
  };
}

/**
 * Largest-remainder split of the daily budget across the actions present,
 * so the day always adds up exactly to `timeBudget` regardless of which
 * rules fired.
 */
function allocateMinutes(
  items: Array<Pick<PlanItem, "id" | "kind">>,
  budget: number,
): Map<string, number> {
  const active = items.filter((item) => item.kind !== "stop");
  const weights: number[] = active.map(
    (item) => PLAN_RULES.timeWeights[item.kind],
  );
  const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);
  if (active.length === 0 || totalWeight === 0 || budget <= 0) {
    return new Map(items.map((item) => [item.id, 0]));
  }

  const raw = weights.map((weight) => (budget * weight) / totalWeight);
  const minutes = raw.map((value) => Math.floor(value));
  let remainder = budget - minutes.reduce((sum, value) => sum + value, 0);
  const byFraction = raw
    .map((value, index) => ({ index, fraction: value - Math.floor(value) }))
    .sort((a, b) => b.fraction - a.fraction || a.index - b.index);
  for (const { index } of byFraction) {
    if (remainder <= 0) break;
    minutes[index] += 1;
    remainder -= 1;
  }

  return new Map(active.map((item, index) => [item.id, minutes[index]]));
}

/**
 * Deterministic daily plan: the same analysis, sample and setup always
 * produce the same actions, in the same order, with the same minutes.
 * Pure arithmetic — no clock, no randomness, no model.
 */
export function buildPlan(input: PlanInput): DailyPlan {
  const experiment = experimentItem(input);
  const candidates = [
    postItem(input),
    engageItem(input),
    experiment,
    doubleDownItem(input),
    stopItem(input, experiment !== null),
  ].filter((item): item is Omit<PlanItem, "minutes"> => item !== null);

  const minutes = allocateMinutes(candidates, input.profile.timePerDay);
  const items: PlanItem[] = candidates.map((item) => ({
    ...item,
    minutes: minutes.get(item.id) ?? 0,
  }));

  return {
    items: PLAN_KIND_ORDER.flatMap((kind) =>
      items.filter((item) => item.kind === kind),
    ),
    timeBudget: input.profile.timePerDay,
    totalMinutes: items.reduce((sum, item) => sum + item.minutes, 0),
  };
}
