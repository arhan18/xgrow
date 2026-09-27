"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Check, FlaskConical, Plug } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DemoNote } from "@/components/ui/demo-badge";
import { cn } from "@/lib/utils";
import {
  DEMO_ACCOUNT,
  GROWTH_GOALS,
  NICHES,
  TIME_BUDGETS,
} from "@/lib/demo/account";

const STEPS = [
  { key: "connect", label: "Connect", title: "Connect your X account" },
  { key: "goal", label: "Goal", title: "What are you growing for?" },
  { key: "niche", label: "Niche", title: "What do you post about?" },
  { key: "time", label: "Time", title: "How much time do you have?" },
] as const;

function StepHeader({
  step,
  title,
  description,
}: {
  step: number;
  title: string;
  description: string;
}) {
  const progress = ((step + 1) / STEPS.length) * 100;

  return (
    <div className="mb-9">
      <div className="flex items-center justify-between gap-4">
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-muted">
          Step {step + 1} of {STEPS.length} · {STEPS[step].label}
        </p>
        <p className="font-mono text-[11px] text-ink-muted">
          {Math.round(progress)}%
        </p>
      </div>
      <div className="mt-3 h-1 w-full overflow-hidden rounded-full bg-sunken">
        <div
          className="h-full rounded-full bg-signal-600 transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
      <h1 className="mt-7 font-display text-3xl leading-tight tracking-[-0.01em] text-ink sm:text-4xl">
        {title}
      </h1>
      <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-ink-soft">
        {description}
      </p>
    </div>
  );
}

function OptionCard({
  selected,
  disabled,
  onClick,
  title,
  hint,
  icon,
  badge,
}: {
  selected: boolean;
  disabled?: boolean;
  onClick: () => void;
  title: string;
  hint: string;
  icon?: React.ReactNode;
  badge?: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "flex w-full items-start gap-3 rounded-xl border p-4 text-left transition-colors",
        disabled
          ? "cursor-not-allowed border-line bg-sunken/60 opacity-75"
          : selected
            ? "border-signal-600 bg-signal-50"
            : "border-line bg-surface hover:border-line-strong hover:bg-paper",
      )}
    >
      {icon ? (
        <span
          className={cn(
            "mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg border",
            selected
              ? "border-signal-200 bg-surface text-signal-700"
              : "border-line bg-paper text-ink-muted",
          )}
        >
          {icon}
        </span>
      ) : null}
      <span className="min-w-0 flex-1">
        <span className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-medium text-ink">{title}</span>
          {badge}
        </span>
        <span className="mt-1 block text-[13px] leading-relaxed text-ink-muted">
          {hint}
        </span>
      </span>
      {!disabled ? (
        <Check
          className={cn(
            "mt-1 h-4 w-4 shrink-0",
            selected ? "text-signal-700" : "text-line-strong",
          )}
          aria-hidden
        />
      ) : null}
    </button>
  );
}

export function OnboardingFlow() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [goalId, setGoalId] = useState<string>(DEMO_ACCOUNT.goalId);
  const [nicheId, setNicheId] = useState<string>(DEMO_ACCOUNT.nicheId);
  const [building, setBuilding] = useState(DEMO_ACCOUNT.building);
  const [minutes, setMinutes] = useState(DEMO_ACCOUNT.dailyMinutes);

  const current = STEPS[step];

  function back() {
    setStep((value) => Math.max(0, value - 1));
  }

  function next() {
    if (step === STEPS.length - 1) {
      router.push("/app/today");
      return;
    }
    setStep((value) => Math.min(STEPS.length - 1, value + 1));
  }

  return (
    <div className="mx-auto w-full max-w-3xl px-5 py-12 sm:px-8 lg:py-16">
      <StepHeader
        step={step}
        title={current.title}
        description={
          step === 0
            ? "Xgrow needs your account's history to learn anything real. For this build, explore the whole system in Demo Mode with a realistic sample account."
            : step === 1
              ? "Your goal decides which patterns Xgrow prioritizes and what your daily plan optimizes for."
              : step === 2
                ? "Topic and product context shape the themes and post ideas Xgrow recommends."
                : "Every plan is sized to fit the time you actually have — no 90-minute fantasy routines."
        }
      />

      {step === 0 ? (
        <div className="space-y-4">
          <OptionCard
            selected
            onClick={() => undefined}
            title="Continue in Demo Mode"
            hint={`${DEMO_ACCOUNT.handle} — a realistic sample account with ${DEMO_ACCOUNT.stats.posts} posts of history. Nothing here is a live X account.`}
            icon={<FlaskConical className="h-4 w-4" />}
            badge={<Badge variant="demo">Recommended</Badge>}
          />
          <OptionCard
            selected={false}
            disabled
            onClick={() => undefined}
            title="Connect with X"
            hint="Live X API access arrives after this build — connect your real account then."
            icon={<Plug className="h-4 w-4" />}
            badge={<Badge variant="neutral">Coming soon</Badge>}
          />
          <div className="rounded-xl border border-demo-line bg-demo px-4 py-3.5">
            <DemoNote />
          </div>
        </div>
      ) : null}

      {step === 1 ? (
        <div className="grid gap-3 sm:grid-cols-2">
          {GROWTH_GOALS.map((goal) => (
            <OptionCard
              key={goal.id}
              selected={goalId === goal.id}
              onClick={() => setGoalId(goal.id)}
              title={goal.label}
              hint={goal.hint}
            />
          ))}
        </div>
      ) : null}

      {step === 2 ? (
        <div className="space-y-8">
          <div className="flex flex-wrap gap-2">
            {NICHES.map((niche) => (
              <button
                key={niche.id}
                type="button"
                aria-pressed={nicheId === niche.id}
                onClick={() => setNicheId(niche.id)}
                className={cn(
                  "rounded-full border px-3.5 py-1.5 text-[13px] transition-colors",
                  nicheId === niche.id
                    ? "border-signal-600 bg-signal-50 font-medium text-signal-800"
                    : "border-line-strong bg-surface text-ink-soft hover:border-ink/25",
                )}
              >
                {niche.label}
              </button>
            ))}
          </div>

          <div>
            <label
              htmlFor="building"
              className="block text-sm font-medium text-ink"
            >
              What are you building or selling?
            </label>
            <p className="mt-1 text-[13px] text-ink-muted">
              Optional — but Xgrow uses it to sharpen post ideas.
            </p>
            <textarea
              id="building"
              rows={3}
              value={building}
              onChange={(event) => setBuilding(event.target.value)}
              placeholder="e.g. a lightweight feedback tool for indie founders"
              className="mt-3 w-full resize-y rounded-xl border border-line bg-surface px-4 py-3 text-sm text-ink placeholder:text-ink-muted focus:border-signal-600 focus:outline-none"
            />
          </div>
        </div>
      ) : null}

      {step === 3 ? (
        <div className="grid gap-3 sm:grid-cols-2">
          {TIME_BUDGETS.map((budget) => (
            <OptionCard
              key={budget.id}
              selected={minutes === budget.minutes}
              onClick={() => setMinutes(budget.minutes)}
              title={budget.label}
              hint={budget.hint}
            />
          ))}
        </div>
      ) : null}

      <div className="mt-10 flex items-center justify-between gap-4 border-t border-line pt-6">
        <Button
          variant="ghost"
          onClick={back}
          disabled={step === 0}
          className={cn(step === 0 && "invisible")}
        >
          <ArrowLeft className="h-4 w-4" aria-hidden />
          Back
        </Button>

        <div className="flex items-center gap-3">
          {step === STEPS.length - 1 ? (
            <span className="hidden font-mono text-[11px] text-ink-muted sm:inline">
              Plan sized for {minutes} min / day
            </span>
          ) : null}
          <Button onClick={next}>
            {step === STEPS.length - 1 ? "Build my system" : "Continue"}
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Button>
        </div>
      </div>
    </div>
  );
}
