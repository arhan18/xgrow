/**
 * Shared domain types for Xgrow.
 *
 * Everything the analysis engine, demo data and UI agree on lives here so
 * business logic never has to reach into presentation code (or vice versa).
 */

/* ------------------------------------------------------------------ *
 * Account + posts
 * ------------------------------------------------------------------ */

export type AccountMode = "demo" | "live";

export interface XAccount {
  id: string;
  mode: AccountMode;
  handle: string;
  name: string;
  initials: string;
  bio: string;
  followers: number;
  following: number;
  /** Lifetime posts on the account (not the size of a given sample). */
  postsCount: number;
}

export type ContentFormat = "text" | "thread" | "poll" | "image" | "video";

export type ContentTopic =
  | "developer-tooling"
  | "build-in-public"
  | "growth-distribution"
  | "product-build"
  | "founder-lessons";

export interface PostMetrics {
  impressions: number;
  likes: number;
  replies: number;
  reposts: number;
  bookmarks: number;
  profileVisits: number;
}

export interface XPost {
  id: string;
  text: string;
  /** ISO 8601 timestamp. */
  publishedAt: string;
  format: ContentFormat;
  topic: ContentTopic;
  metrics: PostMetrics;
}

/* ------------------------------------------------------------------ *
 * Onboarding profile
 * ------------------------------------------------------------------ */

export type GrowthGoalId = "audience" | "engagement" | "launch" | "authority";

export type NicheId =
  | "indie-hacking"
  | "saas"
  | "ai-tools"
  | "design"
  | "marketing"
  | "dev-tools"
  | "productivity"
  | "content";

export interface OnboardingProfile {
  mode: "demo";
  goalId: GrowthGoalId;
  nicheId: NicheId;
  buildingOrSelling: string;
  /** Minutes available per day. */
  timePerDay: number;
}

/* ------------------------------------------------------------------ *
 * Insights
 * ------------------------------------------------------------------ */

export type InsightType =
  | "observed"
  | "calculated"
  | "inference"
  | "recommendation"
  | "experiment";

export type InsightConfidence = "early-signal" | "moderate" | "strong";

/**
 * Every insight is traceable: the numbers come from `supportingPostIds`,
 * and `evidence` restates how the conclusion was calculated.
 */
export interface GrowthInsight {
  id: string;
  type: InsightType;
  title: string;
  statement: string;
  evidence: string;
  confidence: InsightConfidence;
  supportingPostIds: string[];
  /** Optional headline figure for the UI (e.g. "1.9×"). */
  metric?: { value: string; label: string };
  /** The "so what" — what to do next. */
  recommendation?: string;
}

/* ------------------------------------------------------------------ *
 * Daily plan
 * ------------------------------------------------------------------ */

/**
 * The five actions the TODAY loop can hand out: create, engage, test,
 * amplify what worked, and avoid what didn't. "stop" never spends time.
 */
export type PlanKind =
  | "post"
  | "engage"
  | "experiment"
  | "double-down"
  | "stop";

/**
 * Same traceability contract as GrowthInsight: `evidence` explains how the
 * action was derived and `supportingPostIds` points at the posts behind it.
 * `minutes` is filled in by the budget allocator, not by the rule that
 * proposes the action.
 */
export interface PlanItem {
  id: string;
  kind: PlanKind;
  title: string;
  statement: string;
  evidence: string;
  confidence: InsightConfidence;
  supportingPostIds: string[];
  /** Slice of the daily time budget this action gets (0 for "stop"). */
  minutes: number;
  metric?: { value: string; label: string };
}

export interface DailyPlan {
  /** Sorted in play order: post → engage → experiment → double-down → stop. */
  items: PlanItem[];
  /** Minutes the user said they have (profile.timePerDay). */
  timeBudget: number;
  /** Sum of item minutes — never above timeBudget. */
  totalMinutes: number;
}

/* ------------------------------------------------------------------ *
 * Analysis result
 * ------------------------------------------------------------------ */

export interface PerformanceSummary {
  postCount: number;
  from: string;
  to: string;
  windowDays: number;
  postsPerWeek: number;
  avgImpressions: number;
  medianImpressions: number;
  totalImpressions: number;
  avgLikes: number;
  avgReplies: number;
  avgReposts: number;
  medianEngagementRate: number;
  avgEngagementRate: number;
}

export interface TopicPerformance {
  topic: ContentTopic;
  postCount: number;
  medianImpressions: number;
  medianEngagementRate: number;
  medianReplies: number;
  medianBookmarkRate: number;
  /** Ratio vs the account median (1 = parity). */
  engagementVsAccount: number;
  reachVsAccount: number;
  topPostId: string;
}

export interface FormatPerformance {
  format: ContentFormat;
  postCount: number;
  medianImpressions: number;
  medianEngagementRate: number;
  medianReplies: number;
  engagementVsAccount: number;
  reachVsAccount: number;
  topPostId: string;
}

export interface TopPost {
  post: XPost;
  engagementRate: number;
}

export interface DayPerformance {
  /** "Mon" … "Sun" */
  day: string;
  postCount: number;
  medianEngagementRate: number;
  medianImpressions: number;
}

export interface AnalysisResult {
  account: XAccount;
  summary: PerformanceSummary;
  topTopics: TopicPerformance[];
  topFormats: FormatPerformance[];
  topPosts: TopPost[];
  dayPatterns: DayPerformance[];
  /** The single most decision-relevant finding. */
  primarySignal: GrowthInsight;
  insights: GrowthInsight[];
  /** Ready for the TODAY engine: what to do about what we learned. */
  recommendations: GrowthInsight[];
}
