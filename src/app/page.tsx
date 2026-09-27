import type { Metadata } from "next";
import { SiteHeader } from "@/components/landing/site-header";
import { Hero } from "@/components/landing/hero";
import { HowItWorks } from "@/components/landing/how-it-works";
import { Closing } from "@/components/landing/closing";

export const metadata: Metadata = {
  title: "Xgrow — Your Personal X Growth System",
  description:
    "Your X account already knows what works. Xgrow helps you learn it — and turns it into a personalized daily growth system. Learn. Grow. Repeat.",
};

export default function LandingPage() {
  return (
    <div className="flex min-h-dvh flex-col bg-paper">
      <SiteHeader />
      <main className="flex-1">
        <Hero />
        <HowItWorks />
        <Closing />
      </main>
    </div>
  );
}
