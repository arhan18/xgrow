import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Logo } from "@/components/ui/logo";
import { EmptyState } from "@/components/ui/state";

export default function NotFound() {
  return (
    <div className="flex min-h-dvh flex-col bg-paper">
      <header className="border-b border-line">
        <Container className="flex h-16 items-center">
          <Logo />
        </Container>
      </header>
      <main className="flex flex-1 items-center justify-center px-5 py-16">
        <div className="w-full max-w-xl">
          <EmptyState
            eyebrow="404"
            title="This page doesn't exist"
            description="The link may be old, or the page moved while Xgrow was being rebuilt."
            action={
              <Link href="/" className={buttonVariants()}>
                <ArrowLeft className="h-4 w-4" aria-hidden />
                Back to home
              </Link>
            }
          />
        </div>
      </main>
    </div>
  );
}
