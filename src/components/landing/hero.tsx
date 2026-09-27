import Link from "next/link";
import {
  ArrowRight,
  FlaskConical,
  Lightbulb,
  MessagesSquare,
  PenLine,
  TrendingUp,
} from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { DemoBadge } from "@/components/ui/demo-badge";
import { Container } from "@/components/ui/container";
import { Panel } from "@/components/ui/panel";
import { analyzeDemoAccount } from "@/lib/demo/analysis";
import { formatRatio } from "@/lib/format";
import { topicLabel } from "@/lib/labels";

const leadTopic = analyzeDemoAccount().topTopics[0];

const planRows = [
  {
    icon: PenLine,
    kind: "Post",
    title: "Publish your teardown: 5 onboarding mistakes",
    time: "8m",
  },
  {
    icon: MessagesSquare,
    kind: "Engage",
    title: "Reply to 5 builders talking about launch day",
    time: "12m",
  },
  {
    icon: TrendingUp,
    kind: "Double down",
    title: "Turn your pricing thread into a standalone post",
    time: "10m",
  },
];

function PlanPreview() {
  return (
    <figure className="relative">
      <div className="mb-4 inline-flex max-w-full items-start gap-2 rounded-lg border border-signal-200 bg-signal-50 px-3 py-2 text-[12px] leading-snug text-signal-800">
        <Lightbulb className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden />
        <span>
          We learned: {topicLabel(leadTopic.topic)} posts earn{" "}
          <span className="font-medium">
            {formatRatio(leadTopic.engagementVsAccount)}
          </span>{" "}
          the engagement of your account median.
        </span>
      </div>

      <Panel className="shadow-md">
        <div className="flex items-center justify-between gap-3 border-b border-line px-5 py-3.5">
          <div className="flex items-baseline gap-2">
            <h2 className="text-sm font-medium text-ink">Today</h2>
            <span className="font-mono text-[11px] text-ink-muted">
              30 min plan
            </span>
          </div>
          <DemoBadge />
        </div>

        <ul className="divide-y divide-line px-5">
          {planRows.map((row) => (
            <li key={row.kind} className="flex items-start gap-3.5 py-4">
              <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg border border-line bg-paper text-ink-soft">
                <row.icon className="h-4 w-4" aria-hidden />
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-signal-700">
                  {row.kind}
                </p>
                <p className="mt-1 text-sm leading-snug text-ink">
                  {row.title}
                </p>
              </div>
              <span className="shrink-0 rounded-full border border-line bg-sunken px-2 py-1 font-mono text-[11px] text-ink-muted">
                {row.time}
              </span>
            </li>
          ))}
        </ul>

        <div className="flex items-center justify-between gap-3 border-t border-line px-5 py-3.5">
          <span className="text-[13px] text-ink-muted">
            Sized to your daily time budget
          </span>
          <span className="inline-flex items-center gap-1.5 text-[13px] font-medium text-signal-700">
            <span className="h-1.5 w-1.5 rounded-full bg-signal-500" aria-hidden />
            Ready
          </span>
        </div>
      </Panel>

      <figcaption className="mt-3 text-center text-[12px] text-ink-muted">
        Sample plan shown in Demo Mode.
      </figcaption>
    </figure>
  );
}

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <Container className="grid items-center gap-14 py-20 md:py-28 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-signal-700">
            Xgrow
          </p>

          <h1 className="mt-5 font-display text-[2.75rem] leading-[1.03] tracking-[-0.015em] text-ink sm:text-6xl lg:text-[4.25rem]">
            Your Personal <span className="italic">X</span> Growth System
          </h1>

          <div className="mt-6 flex items-center gap-4">
            <span className="h-px w-10 bg-line-strong" aria-hidden />
            <p className="font-mono text-[12px] uppercase tracking-[0.2em] text-ink-muted">
              Learn. Grow. Repeat.
            </p>
          </div>

          <p className="mt-8 max-w-xl text-lg leading-relaxed text-ink-soft sm:text-xl">
            <span className="font-medium text-ink">
              Your X account already knows what works.
            </span>{" "}
            Xgrow helps you learn it.
          </p>

          <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-ink-muted">
            Xgrow reads your account history, goals, content and results, then
            turns them into a personalized daily growth system — so you stop
            guessing what to post, who to engage with, and what actually moves
            your account.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-3">
            <Link href="/app/onboarding" className={buttonVariants({ size: "lg" })}>
              Start Growing
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
            <a
              href="#how"
              className={buttonVariants({ variant: "secondary", size: "lg" })}
            >
              See How It Works
            </a>
          </div>

          <p className="mt-5 flex items-center gap-2 text-[13px] text-demo-ink">
            <FlaskConical className="h-3.5 w-3.5" aria-hidden />
            Demo Mode included — no X API credentials required.
          </p>
        </div>

        <div className="lg:pl-4">
          <PlanPreview />
        </div>
      </Container>
    </section>
  );
}
