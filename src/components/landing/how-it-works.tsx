import { Check, CircleDashed } from "lucide-react";
import { Container } from "@/components/ui/container";

const guessing = [
  "What to post tomorrow",
  "Who is worth engaging with",
  "What actually moved your account",
];

const system = [
  "It reads your real posting history and results",
  "It separates repeatable patterns from noise",
  "It turns them into one plan you can run today",
];

const steps = [
  {
    n: "01",
    title: "Learn your account",
    body: "Connect an account and Xgrow studies its history, goals and results.",
  },
  {
    n: "02",
    title: "Discover what works",
    body: "Themes, formats, timing and engagement patterns — calculated, not guessed.",
  },
  {
    n: "03",
    title: "Get today's plan",
    body: "A short list of actions sized to the time you actually have.",
  },
  {
    n: "04",
    title: "Act and measure",
    body: "Post, engage and run experiments — then record what happened.",
  },
  {
    n: "05",
    title: "Build your Growth Diary",
    body: "Every result updates what the system believes about your account.",
  },
];

function Eyebrow({ children }: { children: string }) {
  return (
    <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-muted">
      {children}
    </p>
  );
}

export function HowItWorks() {
  return (
    <>
      <section id="problem" className="border-t border-line bg-surface">
        <Container className="grid gap-12 py-20 md:grid-cols-2 md:gap-0 md:py-24">
          <div className="md:pr-14">
            <Eyebrow>The problem</Eyebrow>
            <h2 className="mt-4 font-display text-3xl leading-tight text-ink md:text-4xl">
              Most creators are guessing.
            </h2>
            <p className="mt-4 max-w-md text-[15px] leading-relaxed text-ink-soft">
              Every week the same three questions come back — and the answers
              are usually vibes, not evidence.
            </p>
            <ul className="mt-7 space-y-3.5">
              {guessing.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <CircleDashed
                    className="mt-0.5 h-4 w-4 shrink-0 text-ink-muted"
                    aria-hidden
                  />
                  <span className="text-[15px] text-ink-soft">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:border-l md:border-line md:pl-14">
            <Eyebrow>The system</Eyebrow>
            <h2 className="mt-4 font-display text-3xl leading-tight text-ink md:text-4xl">
              Your account already has the answers.
            </h2>
            <p className="mt-4 max-w-md text-[15px] leading-relaxed text-ink-soft">
              Xgrow turns what your account has already proven into a system you
              repeat daily.
            </p>
            <ul className="mt-7 space-y-3.5">
              {system.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <Check
                    className="mt-0.5 h-4 w-4 shrink-0 text-signal-600"
                    aria-hidden
                  />
                  <span className="text-[15px] text-ink-soft">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </section>

      <section id="how" className="border-t border-line">
        <Container className="py-20 md:py-24">
          <div className="max-w-2xl">
            <Eyebrow>How it works</Eyebrow>
            <h2 className="mt-4 font-display text-3xl leading-tight text-ink md:text-4xl">
              One loop, run daily.
            </h2>
            <p className="mt-4 text-[15px] leading-relaxed text-ink-soft">
              Connect, learn, plan, act, measure, diary, improve. Each pass makes
              the next one sharper.
            </p>
          </div>

          <ol className="mt-10 grid gap-px overflow-hidden rounded-xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-5">
            {steps.map((step) => (
              <li key={step.n} className="bg-surface p-5">
                <p className="font-mono text-[11px] tracking-[0.14em] text-signal-700">
                  {step.n}
                </p>
                <h3 className="mt-3 text-[15px] font-medium text-ink">
                  {step.title}
                </h3>
                <p className="mt-2 text-[13px] leading-relaxed text-ink-muted">
                  {step.body}
                </p>
              </li>
            ))}
          </ol>
        </Container>
      </section>
    </>
  );
}
