import { useSyncExternalStore } from "react";
import type { GrowthGoalId, NicheId, OnboardingProfile } from "@/lib/types";
import {
  DEMO_BUILDING,
  GROWTH_GOALS,
  NICHES,
  TIME_BUDGETS,
} from "@/lib/demo/account";

/**
 * Persisted onboarding profile (Demo Mode).
 *
 * The store is read by the client shell (Today, Learn, onboarding) and must
 * survive reloads without hydration mismatches: SSR always renders the
 * default profile, then the client swaps in the stored one after hydration.
 */

export const PROFILE_STORAGE_KEY = "xgrow.profile.v1";

export const DEFAULT_PROFILE: OnboardingProfile = {
  mode: "demo",
  goalId: "audience",
  nicheId: "indie-hacking",
  buildingOrSelling: DEMO_BUILDING,
  timePerDay: 30,
};

export interface ProfileState {
  profile: OnboardingProfile;
  onboarded: boolean;
}

const DEFAULT_STATE: ProfileState = {
  profile: DEFAULT_PROFILE,
  onboarded: false,
};

let state: ProfileState = DEFAULT_STATE;
const listeners = new Set<() => void>();

function sanitizeProfile(value: unknown): OnboardingProfile | null {
  if (typeof value !== "object" || value === null) return null;
  const raw = value as Record<string, unknown>;
  const { goalId, nicheId, buildingOrSelling, timePerDay } = raw;
  if (typeof goalId !== "string" || !GROWTH_GOALS.some((g) => g.id === goalId)) {
    return null;
  }
  if (typeof nicheId !== "string" || !NICHES.some((n) => n.id === nicheId)) {
    return null;
  }
  if (
    typeof timePerDay !== "number" ||
    !TIME_BUDGETS.some((b) => b.minutes === timePerDay)
  ) {
    return null;
  }
  if (typeof buildingOrSelling !== "string") return null;
  return {
    mode: "demo",
    goalId: goalId as GrowthGoalId,
    nicheId: nicheId as NicheId,
    buildingOrSelling: buildingOrSelling.slice(0, 500),
    timePerDay,
  };
}

function loadState(): ProfileState {
  if (typeof window === "undefined") return DEFAULT_STATE;
  try {
    const raw = window.localStorage.getItem(PROFILE_STORAGE_KEY);
    if (!raw) return DEFAULT_STATE;
    const record = JSON.parse(raw) as { onboarded?: unknown; profile?: unknown };
    const profile = sanitizeProfile(record?.profile);
    if (!profile) return DEFAULT_STATE;
    return { profile, onboarded: record.onboarded === true };
  } catch {
    return DEFAULT_STATE;
  }
}

function persist(next: ProfileState): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(
      PROFILE_STORAGE_KEY,
      JSON.stringify({
        version: 1,
        onboarded: next.onboarded,
        profile: next.profile,
      }),
    );
  } catch {
    // Storage blocked or full — this session still runs on in-memory state.
  }
}

function emit(): void {
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function getSnapshot(): ProfileState {
  return state;
}

function getServerSnapshot(): ProfileState {
  return DEFAULT_STATE;
}

if (typeof window !== "undefined") {
  state = loadState();
  window.addEventListener("storage", (event) => {
    if (event.key !== null && event.key !== PROFILE_STORAGE_KEY) return;
    state = loadState();
    emit();
  });
}

export function useProfileState(): ProfileState {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

export function useProfile(): OnboardingProfile {
  return useProfileState().profile;
}

export function getProfileState(): ProfileState {
  return state;
}

export function updateProfile(patch: Partial<OnboardingProfile>): void {
  const merged = sanitizeProfile({ ...state.profile, ...patch });
  if (!merged) return;
  state = { profile: merged, onboarded: state.onboarded };
  persist(state);
  emit();
}

export function completeOnboarding(profile: OnboardingProfile): void {
  state = { profile: sanitizeProfile(profile) ?? DEFAULT_PROFILE, onboarded: true };
  persist(state);
  emit();
}
