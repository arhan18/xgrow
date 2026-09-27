import type { Metadata } from "next";
import Link from "next/link";
import { Lightbulb } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { buttonVariants } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/state";

export const metadata: Metadata = { title: "What We Learned" };

export default function LearnedPage() {
  return (
    <>
      <PageHeader
        eyebrow="Analysis"
        title="What We Learned"
        description="Findings from your account — separated into observed facts, calculated metrics, inferences and recommendations. No invented insights."
      />

      <EmptyState
        eyebrow="Not analyzed yet"
        icon={<Lightbulb className="h-5 w-5" />}
        title="We haven't learned this account yet"
        description="Complete setup and Xgrow studies the account's posts, timing, formats and engagement — then shows exactly what it found, with the evidence behind each finding."
        action={
          <Link href="/app/onboarding" className={buttonVariants()}>
            Run Demo Mode setup
          </Link>
        }
      />
    </>
  );
}
