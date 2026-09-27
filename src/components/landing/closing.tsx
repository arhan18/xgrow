import Link from "next/link";
import { ArrowRight, FlaskConical } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Logo } from "@/components/ui/logo";
import { cn } from "@/lib/utils";

export function Closing() {
  return (
    <>
      <section className="border-t border-line bg-ink">
        <Container className="flex flex-col items-center py-20 text-center md:py-24">
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-paper/50">
            Ready when you are
          </p>
          <h2 className="mt-5 font-display text-4xl leading-tight text-paper sm:text-5xl">
            Learn. Grow. Repeat.
          </h2>
          <p className="mt-4 max-w-lg text-[15px] leading-relaxed text-paper/70">
            Start in Demo Mode and see what Xgrow finds when it actually reads
            an account — then run the same loop on yours.
          </p>
          <Link
            href="/app/onboarding"
            className={cn(buttonVariants({ size: "lg", variant: "light" }), "mt-8")}
          >
            Start Growing
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </Container>
      </section>

      <footer className="border-t border-line bg-surface">
        <Container className="flex flex-col gap-5 py-8 sm:flex-row sm:items-center sm:justify-between">
          <Logo href="/" />
          <p className="text-[13px] text-ink-muted">
            © 2026 Xgrow — Your Personal X Growth System
          </p>
          <p className="flex items-center gap-2 text-[13px] text-demo-ink">
            <FlaskConical className="h-3.5 w-3.5" aria-hidden />
            Demo Mode — sample data, never a live account
          </p>
        </Container>
      </footer>
    </>
  );
}
