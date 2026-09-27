import type { InsightConfidence, PostMetrics, XPost } from "@/lib/types";
import { WEEKDAY_LABELS } from "@/lib/labels";

/** Per-post engagement: likes + replies + reposts + bookmarks. */
export function engagementOf(metrics: PostMetrics): number {
  return metrics.likes + metrics.replies + metrics.reposts + metrics.bookmarks;
}

export function engagementRate(post: XPost): number {
  const { impressions } = post.metrics;
  return impressions > 0 ? engagementOf(post.metrics) / impressions : 0;
}

export function bookmarkRate(post: XPost): number {
  const { impressions } = post.metrics;
  return impressions > 0 ? post.metrics.bookmarks / impressions : 0;
}

export function median(values: number[]): number {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 1
    ? sorted[middle]
    : (sorted[middle - 1] + sorted[middle]) / 2;
}

export function mean(values: number[]): number {
  if (values.length === 0) return 0;
  return values.reduce((total, value) => total + value, 0) / values.length;
}

/** Ratio of a value against a baseline; guards against division by zero. */
export function relative(value: number, baseline: number): number {
  return baseline > 0 ? value / baseline : 0;
}

export function medianRate(posts: XPost[]): number {
  return median(posts.map(engagementRate));
}

export function medianReach(posts: XPost[]): number {
  return median(posts.map((post) => post.metrics.impressions));
}

export function medianReplies(posts: XPost[]): number {
  return median(posts.map((post) => post.metrics.replies));
}

export function totalImpressions(posts: XPost[]): number {
  return posts.reduce((total, post) => total + post.metrics.impressions, 0);
}

/** UTC so analysis results never depend on the machine's timezone. */
export function utcDate(post: XPost): Date {
  return new Date(post.publishedAt);
}

export function utcDayLabel(post: XPost): string {
  return WEEKDAY_LABELS[utcDate(post).getUTCDay()];
}

export function utcDayKey(post: XPost): string {
  return post.publishedAt.slice(0, 10);
}

const DAY_MS = 86_400_000;

export function windowDays(from: string, to: string): number {
  const start = Date.parse(`${from}T00:00:00.000Z`);
  const end = Date.parse(`${to}T00:00:00.000Z`);
  if (Number.isNaN(start) || Number.isNaN(end)) return 0;
  return Math.max(1, Math.round((end - start) / DAY_MS) + 1);
}

/**
 * Confidence rules, applied consistently everywhere (the Learn page quotes
 * these exact numbers in its methodology section):
 * - fewer than `minSample` posts in a group → early signal (the sample can't
 *   carry it)
 * - `minSample`+ posts with a sharp effect (≥ `strongRatioHigh` or
 *   ≤ `strongRatioLow` the baseline) → strong
 * - everything else with `minSample`+ posts → moderate
 */
export const CONFIDENCE_RULES = {
  minSample: 5,
  strongRatioHigh: 1.75,
  strongRatioLow: 0.57,
  minDayPosts: 3,
  minFormatPosts: 2,
} as const;

export function confidenceFor(
  postCount: number,
  ratio: number,
): InsightConfidence {
  if (postCount < CONFIDENCE_RULES.minSample) return "early-signal";
  if (
    ratio >= CONFIDENCE_RULES.strongRatioHigh ||
    ratio <= CONFIDENCE_RULES.strongRatioLow
  ) {
    return "strong";
  }
  return "moderate";
}

/** Small samples must always say so, in the statement itself. */
export function sampleCaveat(
  statement: string,
  confidence: InsightConfidence,
  postCount: number,
): string {
  if (confidence !== "early-signal") return statement;
  const suffix =
    postCount === 1
      ? "Early signal — this rests on a single post."
      : `Early signal — this rests on ${postCount} posts.`;
  return `${statement} ${suffix}`;
}
