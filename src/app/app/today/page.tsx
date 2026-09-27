import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/page-header";
import { OnboardingGate } from "@/components/app/onboarding-gate";
import { PlanView } from "@/components/today/plan-view";

export const metadata: Metadata = { title: "Today" };

export default function TodayPage() {
  return (
    <>
      <PageHeader
        eyebrow="Daily plan"
        title="Today's Growth Plan"
        description="A short list of actions, sized to the time you actually have — post, engage, run the experiment, double down on what worked, and the one thing to stop. Every action traces back to your own posts."
      />

      <OnboardingGate>
        <PlanView />
      </OnboardingGate>
    </>
  );
}
