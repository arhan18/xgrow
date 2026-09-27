/**
 * Demo Mode account.
 *
 * This is sample data used to demonstrate Xgrow without live X API access.
 * It is NOT a real connected account and must never be presented as one.
 */

import type { XAccount } from "@/lib/types";

export const DEMO_SOURCE_NOTE =
  "Demo Mode — sample data, not a real connected X account.";

export const DEMO_ACCOUNT: XAccount = {
  id: "demo-alexbuilds",
  mode: "demo",
  handle: "@alexbuilds",
  name: "Alex Rivera",
  initials: "AR",
  bio: "Building in public. Shipping small SaaS tools and writing down what actually works — product, distribution, and the occasional strong opinion.",
  followers: 4283,
  following: 612,
  postsCount: 1147,
};

export const DEMO_BUILDING = "a lightweight feedback tool for indie founders";

export interface Option {
  id: string;
  label: string;
  hint: string;
}

export const GROWTH_GOALS: Option[] = [
  {
    id: "audience",
    label: "Grow a real audience",
    hint: "Turn consistent posting into steady follower growth.",
  },
  {
    id: "engagement",
    label: "Deepen engagement",
    hint: "Get more replies, saves and conversations — not just impressions.",
  },
  {
    id: "launch",
    label: "Support a launch",
    hint: "Build demand for what you're shipping, before you ship it.",
  },
  {
    id: "authority",
    label: "Become a go-to voice",
    hint: "Own a niche so people think of you first.",
  },
];

export const NICHES: Option[] = [
  { id: "indie-hacking", label: "Indie hacking", hint: "Building in public" },
  { id: "saas", label: "SaaS", hint: "Products & subscriptions" },
  { id: "ai-tools", label: "AI tools", hint: "Models, agents, workflows" },
  { id: "design", label: "Design", hint: "Product & visual craft" },
  { id: "marketing", label: "Marketing", hint: "Growth & distribution" },
  { id: "dev-tools", label: "Developer tools", hint: "APIs, infra, DX" },
  { id: "productivity", label: "Productivity", hint: "Systems & focus" },
  { id: "content", label: "Content creation", hint: "Writing & audience" },
];

export const TIME_BUDGETS: (Option & { minutes: number })[] = [
  { id: "15", minutes: 15, label: "15 min / day", hint: "A tight daily rhythm" },
  { id: "30", minutes: 30, label: "30 min / day", hint: "Most popular" },
  { id: "45", minutes: 45, label: "45 min / day", hint: "Room to experiment" },
  { id: "60", minutes: 60, label: "60+ min / day", hint: "Full growth session" },
];

export function goalLabel(id: string): string {
  return GROWTH_GOALS.find((goal) => goal.id === id)?.label ?? "—";
}

export function nicheLabel(id: string): string {
  return NICHES.find((niche) => niche.id === id)?.label ?? "—";
}
