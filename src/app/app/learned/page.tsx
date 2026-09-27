import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/page-header";
import { OnboardingGate } from "@/components/app/onboarding-gate";
import { LearnedView } from "@/components/learned/learned-view";

export const metadata: Metadata = { title: "What We Learned" };

export default function LearnedPage() {
  return (
    <>
      <PageHeader
        eyebrow="Analysis"
        title="What We Learned"
        description="Findings from your account — separated into observed facts, calculated metrics, inferences and recommendations. Every number traces back to the posts it came from."
      />

      <OnboardingGate>
        <LearnedView />
      </OnboardingGate>
    </>
  );
}
