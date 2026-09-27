"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { X } from "lucide-react";
import { MobileNav } from "@/components/app/mobile-nav";
import { SideNav } from "@/components/app/side-nav";
import { TopBar } from "@/components/app/top-bar";
import { buttonVariants } from "@/components/ui/button";
import { DemoBadge } from "@/components/ui/demo-badge";
import { Logo } from "@/components/ui/logo";

function OnboardingChrome({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col bg-paper">
      <header className="border-b border-line bg-paper">
        <div className="mx-auto flex h-16 w-full max-w-3xl items-center justify-between gap-4 px-5 sm:px-8">
          <Logo href="/" />
          <div className="flex items-center gap-3">
            <DemoBadge />
            <Link
              href="/"
              className={buttonVariants({ variant: "ghost", size: "sm" })}
            >
              <X className="h-4 w-4" aria-hidden />
              Exit
            </Link>
          </div>
        </div>
      </header>
      <main className="flex-1">{children}</main>
    </div>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  if (pathname.startsWith("/app/onboarding")) {
    return <OnboardingChrome>{children}</OnboardingChrome>;
  }

  return (
    <div className="min-h-dvh bg-paper">
      <SideNav />
      <div className="lg:pl-60">
        <TopBar />
        <main className="mx-auto w-full max-w-5xl px-5 pb-28 pt-8 sm:px-8 lg:pb-20 lg:pt-10">
          {children}
        </main>
      </div>
      <MobileNav />
    </div>
  );
}
