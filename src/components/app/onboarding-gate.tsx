"use client";

import { useEffect } from "react";
import type { ReactNode } from "react";
import { useRouter } from "next/navigation";
import { LoadingState } from "@/components/ui/state";
import { getProfileState, useProfileState } from "@/lib/store/onboarding";

/**
 * Gates pages that only make sense after CONNECT: renders a neutral loading
 * state during SSR, then swaps to content (or sends a first-time visitor to
 * onboarding) once the stored profile is known.
 *
 * The redirect decision reads the store directly: the reactive value is still
 * the SSR default in the first post-hydration effect, which would otherwise
 * bounce already-onboarded visitors back to onboarding.
 */
export function OnboardingGate({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { onboarded } = useProfileState();

  useEffect(() => {
    if (!getProfileState().onboarded) router.replace("/app/onboarding");
  }, [onboarded, router]);

  if (!onboarded) {
    return <LoadingState label="Checking your setup" />;
  }

  return <>{children}</>;
}
