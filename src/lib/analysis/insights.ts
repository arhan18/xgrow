import type {
  ContentFormat,
  GrowthInsight,
  PerformanceSummary,
  TopPost,
  TopicPerformance,
  FormatPerformance,
  DayPerformance,
  XAccount,
  XPost,
} from "@/lib/types";
import { formatLabel, formatPhrase, topicLabel } from "@/lib/labels";
import {
  formatCount,
  formatPercent,
  formatReach,
  formatDate,
  formatRatio,
  pluralize,
} from "@/lib/format";
import {
  CONFIDENCE_RULES,
  confidenceFor,
  engagementRate,
  medianReplies,
  relative,
  sampleCaveat,
  utcDayLabel,
} from "@/lib/analysis/metrics";

export interface InsightsInput {
  account: XAccount;
  posts: XPost[];
  summary: PerformanceSummary;
  topTopics: TopicPerformance[];
  topFormats: FormatPerformance[];
  topPosts: TopPost[];
  dayPatterns: DayPerformance[];
}

function postIds(
  posts: XPost[],
  predicate: (post: XPost) => boolean,
): string[] {
  return posts.filter(predicate).map((post) => post.id);
}

function capFirst(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function pluralFormatLabel(format: ContentFormat): string {
  const label = formatLabel(format);
  return label.endsWith("s") ? label : `${label}s`;
}

function primaryTopicInsight(input: InsightsInput): GrowthInsight {
  const { posts, summary, topTopics } = input;
  const best = topTopics[0];
  const label = topicLabel(best.topic);
  const ids = postIds(posts, (post) => post.topic === best.topic);
  const confidence = confidenceFor(best.postCount, best.engagementVsAccount);
  const weeklyShare = Math.max(
    1,
    Math.round(summary.postsPerWeek * (best.postCount / summary.postCount)),
  );

  return {
    id: "primary-topic",
    type: "calculated",
    title: `${label} is your strongest topic`,
    statement: sampleCaveat(
      `${label} posts earn a median engagement rate of ${formatPercent(best.medianEngagementRate)} — ${formatRatio(best.engagementVsAccount)} your account median of ${formatPercent(summary.medianEngagementRate)}.`,
      confidence,
      ids.length,
    ),
    evidence: `Median of ${pluralize(best.postCount, "post")} tagged ${label.toLowerCase()} against the median of all ${summary.postCount} posts in this sample. Engagement rate = (likes + replies + reposts + bookmarks) ÷ impressions, computed per post first — so one viral outlier cannot drag a median around.`,
    confidence,
    supportingPostIds: ids,
    metric: {
      value: formatRatio(best.engagementVsAccount),
      label: "vs account median",
    },
    recommendation: `Keep ${label.toLowerCase()} in your weekly rotation: roughly ${weeklyShare} of every ~${Math.max(1, Math.round(summary.postsPerWeek))} posts, which is the share this sample already supports.`,
  };
}

function bestFormatInsight(input: InsightsInput): GrowthInsight | null {
  const { posts, summary, topFormats, topTopics } = input;
  const best = topFormats[0];
  if (!best) return null;
  const phrase = formatPhrase(best.format);
  const ids = postIds(posts, (post) => post.format === best.format);
  const confidence = confidenceFor(best.postCount, best.engagementVsAccount);
  const leadTopic = topTopics[0]
    ? topicLabel(topTopics[0].topic).toLowerCase()
    : "your best";

  return {
    id: "best-format",
    type: "calculated",
    title: `${pluralFormatLabel(best.format)} are your strongest format`,
    statement: sampleCaveat(
      `${capFirst(phrase)} earns a median engagement rate of ${formatPercent(best.medianEngagementRate)} — ${formatRatio(best.engagementVsAccount)} the account median of ${formatPercent(summary.medianEngagementRate)}, across ${pluralize(best.postCount, "post")}.`,
      confidence,
      best.postCount,
    ),
    evidence: `Median engagement rate of the ${pluralize(best.postCount, "post")} tagged ${formatLabel(best.format)} in this sample, against the median across all ${summary.postCount}. Same per-post formula, medians instead of averages.`,
    confidence,
    supportingPostIds: ids,
    metric: {
      value: formatRatio(best.engagementVsAccount),
      label: "vs account median",
    },
    recommendation: `Default to ${phrase} when a post matters — starting with your ${leadTopic} ideas.`,
  };
}

function underperformInsight(input: InsightsInput): GrowthInsight | null {
  const { posts, summary, topTopics, topFormats } = input;
  const worst = topTopics[topTopics.length - 1];
  if (!worst || topTopics.length < 2) return null;
  const label = topicLabel(worst.topic);
  const ids = postIds(posts, (post) => post.topic === worst.topic);
  const confidence = confidenceFor(worst.postCount, worst.engagementVsAccount);
  const bestFormat = topFormats[0];

  return {
    id: "underperforming-topic",
    type: "inference",
    title: `${label} posts underperform`,
    statement: sampleCaveat(
      `${label} posts show a median engagement rate of ${formatPercent(worst.medianEngagementRate)} — ${formatRatio(worst.engagementVsAccount)} the account median of ${formatPercent(summary.medianEngagementRate)}, across ${pluralize(worst.postCount, "post")}.`,
      confidence,
      worst.postCount,
    ),
    evidence: `Lowest-ranked of ${pluralize(topTopics.length, "topic")} by median engagement rate, using the identical per-post formula and median comparison as the top-topic finding.`,
    confidence,
    supportingPostIds: ids,
    recommendation: `Before cutting the topic, rework it: publish these as ${bestFormat ? formatPhrase(bestFormat.format) : "stronger hooks"} and aim past the ${formatPercent(summary.medianEngagementRate)} account median.`,
  };
}

function outlierInsight(input: InsightsInput): GrowthInsight | null {
  const { posts, summary } = input;
  if (posts.length < 2) return null;
  const byReach = [...posts].sort(
    (a, b) => b.metrics.impressions - a.metrics.impressions,
  );
  const outlier = byReach[0];
  const share = relative(outlier.metrics.impressions, summary.totalImpressions);
  const reachRatio = relative(
    outlier.metrics.impressions,
    summary.medianImpressions,
  );
  const rate = engagementRate(outlier);
  const delta = summary.medianEngagementRate - rate;
  const position =
    delta >= 0
      ? `${formatPercent(delta)} below`
      : `${formatPercent(Math.abs(delta))} above`;

  return {
    id: "reach-outlier",
    type: "observed",
    title: "One post carries your reach",
    statement: `Your ${formatDate(outlier.publishedAt)} post pulled ${formatReach(outlier.metrics.impressions)} impressions — ${formatRatio(reachRatio)} your median post — and ${formatPercent(share, 0)} of every impression in this sample. Its engagement rate (${formatPercent(rate)}) lands ${position} the account median (${formatPercent(summary.medianEngagementRate)}).`,
    evidence: `Post ${outlier.id}: ${formatCount(outlier.metrics.impressions)} ÷ ${formatCount(summary.totalImpressions)} total impressions = ${formatPercent(share, 0)}, and ÷ median impressions (${formatCount(summary.medianImpressions)}) = ${formatRatio(reachRatio)}. Engagement rate uses the same formula as every other post.`,
    confidence: "strong",
    supportingPostIds: [outlier.id],
    metric: {
      value: formatPercent(share, 0),
      label: "of all impressions",
    },
  };
}

function conversationInsight(input: InsightsInput): GrowthInsight | null {
  const { posts, summary } = input;
  const polls = posts.filter((post) => post.format === "poll");
  if (polls.length === 0) return null;
  const accountReplies = medianReplies(posts);
  const pollReplies = medianReplies(polls);
  const ratio = relative(pollReplies, accountReplies);
  const confidence = confidenceFor(polls.length, ratio);

  return {
    id: "poll-replies",
    type: "calculated",
    title: "Polls open conversations",
    statement: sampleCaveat(
      `Polls draw a median ${formatCount(pollReplies)} replies per post — ${formatRatio(ratio)} the ${formatCount(accountReplies)} replies your typical post gets.`,
      confidence,
      polls.length,
    ),
    evidence: `Median replies across ${pluralize(polls.length, "poll")} against median replies across all ${summary.postCount} posts, counted directly from the sample — no modelling.`,
    confidence,
    supportingPostIds: polls.map((post) => post.id),
    metric: {
      value: formatCount(pollReplies),
      label: "median replies",
    },
  };
}

function weekdayInsight(input: InsightsInput): GrowthInsight | null {
  const { posts, summary, dayPatterns } = input;
  const eligible = dayPatterns.filter(
    (day) => day.postCount >= CONFIDENCE_RULES.minDayPosts,
  );
  if (eligible.length === 0) return null;
  const best = eligible[0];
  const ratio = relative(best.medianEngagementRate, summary.medianEngagementRate);
  const confidence = confidenceFor(best.postCount, ratio);
  const excluded = dayPatterns.filter((day) => day.postCount < 3);
  const excludedLabel =
    excluded.length > 0
      ? excluded.map((day) => `${day.day} (${day.postCount})`).join(", ")
      : "none";

  return {
    id: "best-weekday",
    type: "observed",
    title: `${best.day} is your strongest day`,
    statement: sampleCaveat(
      `Posts published on ${best.day} show a median engagement rate of ${formatPercent(best.medianEngagementRate)} — ${formatRatio(ratio)} your account median of ${formatPercent(summary.medianEngagementRate)}, across ${pluralize(best.postCount, "post")}.`,
      confidence,
      best.postCount,
    ),
    evidence: `Grouped by UTC publish day, then median engagement rate per group. Days with fewer than ${CONFIDENCE_RULES.minDayPosts} posts are excluded from this finding and listed here anyway: ${excludedLabel}.`,
    confidence,
    supportingPostIds: postIds(
      posts,
      (post) => utcDayLabel(post) === best.day,
    ),
    metric: {
      value: formatRatio(ratio),
      label: "vs account median",
    },
  };
}

function untestedFormatInsight(input: InsightsInput): GrowthInsight | null {
  const { posts, summary } = input;
  const groups = new Map<ContentFormat, XPost[]>();
  for (const post of posts) {
    const bucket = groups.get(post.format);
    if (bucket) bucket.push(post);
    else groups.set(post.format, [post]);
  }
  const singles = [...groups.entries()]
    .filter(([, bucket]) => bucket.length === 1)
    .sort(([a], [b]) => a.localeCompare(b));
  if (singles.length === 0) return null;
  const [format, bucket] = singles[0];
  const noun = formatPhrase(format).replace(/^(a|an) /, "");

  return {
    id: "untested-format",
    type: "observed",
    title: `${formatLabel(format)} is untested`,
    statement: `The sample holds a single ${noun}, which cannot support a conclusion. Post ${CONFIDENCE_RULES.minSample - bucket.length} more to clear the ${CONFIDENCE_RULES.minSample}-post early-signal threshold.`,
    evidence: `Exactly ${pluralize(bucket.length, "post")} tagged ${formatLabel(format)} out of ${summary.postCount}; single-post groups are excluded from the format ranking (it requires ${CONFIDENCE_RULES.minFormatPosts}+).`,
    confidence: "early-signal",
    supportingPostIds: bucket.map((post) => post.id),
  };
}

function topicSlotRecommendation(input: InsightsInput): GrowthInsight {
  const { posts, summary, topTopics } = input;
  const best = topTopics[0];
  const label = topicLabel(best.topic);
  const share = best.postCount / summary.postCount;
  const weeklySlots = Math.max(1, Math.round(summary.postsPerWeek * share));
  const confidence = confidenceFor(best.postCount, best.engagementVsAccount);

  return {
    id: "rec-topic-slot",
    type: "recommendation",
    title: `Protect a weekly ${label.toLowerCase()} slot`,
    statement: `Keep ${weeklySlots} ${label.toLowerCase()} ${weeklySlots === 1 ? "post" : "posts"} in every ~${Math.max(1, Math.round(summary.postsPerWeek))} you publish — that cadence produced ${formatRatio(best.engagementVsAccount)} baseline across ${pluralize(best.postCount, "post")}.`,
    evidence: `Sample share (${best.postCount}/${summary.postCount}) × posting cadence (${summary.postsPerWeek.toFixed(1)}/week); performance taken from the topic ranking.`,
    confidence,
    supportingPostIds: postIds(
      posts,
      (post) => post.topic === best.topic,
    ),
    metric: {
      value: formatRatio(best.engagementVsAccount),
      label: "topic vs baseline",
    },
  };
}

function defaultFormatRecommendation(input: InsightsInput): GrowthInsight | null {
  const { summary, topFormats } = input;
  const best = topFormats[0];
  if (!best) return null;
  const next = topFormats[1];
  const phrase = formatPhrase(best.format);
  const confidence = confidenceFor(best.postCount, best.engagementVsAccount);
  const nextClause = next
    ? `When an idea cannot carry ${phrase}, ${pluralFormatLabel(next.format).toLowerCase()} are your next-best shape at ${formatPercent(next.medianEngagementRate)}.`
    : "";

  return {
    id: "rec-default-format",
    type: "recommendation",
    title: `Draft in ${formatLabel(best.format).toLowerCase()} by default`,
    statement: `Start your next ${Math.max(3, best.postCount)} posts as ${phrase}: they show a median of ${formatPercent(best.medianEngagementRate)}, ${formatRatio(best.engagementVsAccount)} the account baseline of ${formatPercent(summary.medianEngagementRate)}. ${nextClause}`.trim(),
    evidence: `Format ranking from this sample — ${topFormats
      .map(
        (entry) =>
          `${formatLabel(entry.format)} ${formatPercent(entry.medianEngagementRate)} (${entry.postCount})`,
      )
      .join(", ")}.`,
    confidence,
    supportingPostIds: topFormats
      .slice(0, 2)
      .flatMap((entry) =>
        input.posts
          .filter((post) => post.format === entry.format)
          .map((post) => post.id),
      ),
    metric: {
      value: formatRatio(best.engagementVsAccount),
      label: "vs account median",
    },
  };
}

function reworkExperiment(input: InsightsInput): GrowthInsight | null {
  const { posts, summary, topTopics, topFormats } = input;
  const worst = topTopics[topTopics.length - 1];
  const bestFormat = topFormats[0];
  if (!worst || topTopics.length < 2 || !bestFormat) return null;
  const label = topicLabel(worst.topic);
  const phrase = formatPhrase(bestFormat.format);
  const confidence = confidenceFor(worst.postCount, worst.engagementVsAccount);
  const testCount = 2;

  return {
    id: "exp-rework-lagging",
    type: "experiment",
    title: `Experiment: rework ${label.toLowerCase()}`,
    statement: `Take ${testCount} of your ${label} ideas and publish them as ${phrase} over the next 2 weeks. Success = both posts beating the ${formatPercent(summary.medianEngagementRate)} account median on engagement rate.`,
    evidence: `Test design: ${testCount} posts, 2 weeks, same topic, format swapped — compared against the median engagement rate of all ${summary.postCount} sampled posts. Baseline never moves during the test.`,
    confidence,
    supportingPostIds: postIds(
      posts,
      (post) => post.topic === worst.topic,
    ),
    metric: {
      value: formatPercent(summary.medianEngagementRate),
      label: "rate to beat",
    },
  };
}

export function buildInsights(input: InsightsInput): {
  primarySignal: GrowthInsight;
  insights: GrowthInsight[];
  recommendations: GrowthInsight[];
} {
  const optional = [
    outlierInsight(input),
    bestFormatInsight(input),
    underperformInsight(input),
    conversationInsight(input),
    weekdayInsight(input),
    untestedFormatInsight(input),
  ];
  const next = [
    topicSlotRecommendation(input),
    defaultFormatRecommendation(input),
    reworkExperiment(input),
  ];

  return {
    primarySignal: primaryTopicInsight(input),
    insights: optional.filter(
      (insight): insight is GrowthInsight => insight !== null,
    ),
    recommendations: next.filter(
      (insight): insight is GrowthInsight => insight !== null,
    ),
  };
}
