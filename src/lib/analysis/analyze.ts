import type {
  AnalysisResult,
  ContentFormat,
  ContentTopic,
  DayPerformance,
  FormatPerformance,
  PerformanceSummary,
  TopicPerformance,
  TopPost,
  XAccount,
  XPost,
} from "@/lib/types";
import { WEEKDAY_LABELS } from "@/lib/labels";
import {
  bookmarkRate,
  engagementRate,
  mean,
  median,
  medianRate,
  medianReach,
  medianReplies,
  relative,
  totalImpressions,
  utcDayKey,
  utcDayLabel,
  windowDays,
} from "@/lib/analysis/metrics";
import { buildInsights } from "@/lib/analysis/insights";
import { CONFIDENCE_RULES } from "@/lib/analysis/metrics";

function summarize(posts: XPost[]): PerformanceSummary {
  const sorted = [...posts].sort((a, b) =>
    a.publishedAt.localeCompare(b.publishedAt),
  );
  const first = sorted[0];
  const last = sorted[sorted.length - 1];
  const from = utcDayKey(first);
  const to = utcDayKey(last);
  const days = windowDays(from, to);
  const rates = sorted.map(engagementRate);

  return {
    postCount: sorted.length,
    from,
    to,
    windowDays: days,
    postsPerWeek:
      days > 0 ? Math.round((sorted.length / (days / 7)) * 10) / 10 : 0,
    avgImpressions: Math.round(mean(sorted.map((p) => p.metrics.impressions))),
    medianImpressions: Math.round(medianReach(sorted)),
    totalImpressions: totalImpressions(sorted),
    avgLikes: Math.round(mean(sorted.map((p) => p.metrics.likes))),
    avgReplies: Math.round(mean(sorted.map((p) => p.metrics.replies))),
    avgReposts: Math.round(mean(sorted.map((p) => p.metrics.reposts))),
    medianEngagementRate: median(rates),
    avgEngagementRate: mean(rates),
  };
}

function rankTopics(
  posts: XPost[],
  summary: PerformanceSummary,
): TopicPerformance[] {
  const topics = [...new Set(posts.map((post) => post.topic))];
  const ranked = topics.map((topic: ContentTopic) => {
    const group = posts.filter((post) => post.topic === topic);
    const topPost = [...group].sort(
      (a, b) => engagementRate(b) - engagementRate(a),
    )[0];
    const medianEngagement = medianRate(group);

    return {
      topic,
      postCount: group.length,
      medianImpressions: Math.round(medianReach(group)),
      medianEngagementRate: medianEngagement,
      medianReplies: medianReplies(group),
      medianBookmarkRate: median(group.map(bookmarkRate)),
      engagementVsAccount: relative(
        medianEngagement,
        summary.medianEngagementRate,
      ),
      reachVsAccount: relative(
        medianReach(group),
        summary.medianImpressions,
      ),
      topPostId: topPost.id,
    } satisfies TopicPerformance;
  });

  return ranked.sort((a, b) => b.medianEngagementRate - a.medianEngagementRate);
}

function rankFormats(
  posts: XPost[],
  summary: PerformanceSummary,
): FormatPerformance[] {
  const formats = [...new Set(posts.map((post) => post.format))];
  const ranked = formats
    .map((format: ContentFormat) => {
      const group = posts.filter((post) => post.format === format);
      const topPost = [...group].sort(
        (a, b) => engagementRate(b) - engagementRate(a),
      )[0];
      const medianEngagement = medianRate(group);

      return {
        format,
        postCount: group.length,
        medianImpressions: Math.round(medianReach(group)),
        medianEngagementRate: medianEngagement,
        medianReplies: medianReplies(group),
        engagementVsAccount: relative(
          medianEngagement,
          summary.medianEngagementRate,
        ),
        reachVsAccount: relative(
          medianReach(group),
          summary.medianImpressions,
        ),
        topPostId: topPost.id,
      } satisfies FormatPerformance;
    })
    .filter((entry) => entry.postCount >= CONFIDENCE_RULES.minFormatPosts);

  return ranked.sort((a, b) => b.medianEngagementRate - a.medianEngagementRate);
}

function rankPosts(posts: XPost[]): TopPost[] {
  return [...posts]
    .sort((a, b) => engagementRate(b) - engagementRate(a))
    .slice(0, 5)
    .map((post) => ({ post, engagementRate: engagementRate(post) }));
}

function rankDays(posts: XPost[]): DayPerformance[] {
  const days = WEEKDAY_LABELS.map((label) => ({
    label,
    group: posts.filter((post) => utcDayLabel(post) === label),
  })).filter((entry) => entry.group.length > 0);

  return days
    .map((entry) => ({
      day: entry.label,
      postCount: entry.group.length,
      medianEngagementRate: medianRate(entry.group),
      medianImpressions: Math.round(medianReach(entry.group)),
    }))
    .sort((a, b) => b.medianEngagementRate - a.medianEngagementRate);
}

/**
 * Deterministic analysis: the same account and posts always produce
 * byte-identical results. Pure arithmetic over the sample — no LLM,
 * no randomness, no clock.
 */
export function analyzeAccount(
  account: XAccount,
  posts: XPost[],
): AnalysisResult {
  if (posts.length === 0) {
    throw new Error("analyzeAccount requires at least one post");
  }

  const summary = summarize(posts);
  const topTopics = rankTopics(posts, summary);
  const topFormats = rankFormats(posts, summary);
  const topPosts = rankPosts(posts);
  const dayPatterns = rankDays(posts);

  const { primarySignal, insights, recommendations } = buildInsights({
    account,
    posts,
    summary,
    topTopics,
    topFormats,
    topPosts,
    dayPatterns,
  });

  return {
    account,
    summary,
    topTopics,
    topFormats,
    topPosts,
    dayPatterns,
    primarySignal,
    insights,
    recommendations,
  };
}
