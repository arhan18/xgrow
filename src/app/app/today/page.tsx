import type { Metadata } from "next";
import Link from "next/link";
import { CalendarCheck, Lightbulb } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { buttonVariants } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/state";
import { AccountStrip } from "@/components/app/account-strip";
import { OnboardingGate } from "@/components/app/onboarding-gate";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Today" };

const todayLabel = new Intl.DateTimeFormat("en-US", {
  weekday: "long",
  month: "long",
  day: "numeric",
}).format(new Date());

export default function TodayPage() {
  return (
    <>
      <PageHeader
        eyebrow={todayLabel}
        title="Today's Growth Plan"
        description="One short list of actions for today — post, engage, experiment, double down, and what to avoid. Sized to the time you actually have."
      />

      <OnboardingGate>
        <AccountStrip />

        <EmptyState
          eyebrow="Plan engine — next build"
          icon={<CalendarCheck className="h-5 w-5" />}
          title="Your daily plan lands here"
          description="The analysis that will drive this plan is ready: Xgrow studied this account's posts, timing, formats and engagement. The step that turns those findings into today's actions is the next build."
          action={
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Link href="/app/learned" className={buttonVariants()}>
                <Lightbulb className="h-4 w-4" aria-hidden />
                See what we learned
              </Link>
              <Link
                href="/app/onboarding"
                className={cn(
                  buttonVariants({ variant: "secondary" }),
                )}
              >
                Review your setup
              </Link>
            </div>
          }
        />
      </OnboardingGate>
    </>
  );
}
