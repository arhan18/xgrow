import type { AnalysisResult } from "@/lib/types";
import { analyzeAccount } from "@/lib/analysis/analyze";
import { DEMO_ACCOUNT } from "@/lib/demo/account";
import { DEMO_POSTS } from "@/lib/demo/posts";

let cached: AnalysisResult | null = null;

/**
 * Analysis of the Demo Mode sample account. Computed once per session and
 * identical every run — the same numbers power Today, Learn and the landing.
 */
export function analyzeDemoAccount(): AnalysisResult {
  cached ??= analyzeAccount(DEMO_ACCOUNT, DEMO_POSTS);
  return cached;
}
