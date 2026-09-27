import Link from "next/link";
import { Logo } from "@/components/ui/logo";
import { buttonVariants } from "@/components/ui/button";
import { Container } from "@/components/ui/container";

const links = [
  { href: "#problem", label: "Why Xgrow" },
  { href: "#how", label: "How it works" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-paper">
      <Container className="flex h-16 items-center justify-between gap-6">
        <Logo />
        <nav
          aria-label="Primary"
          className="hidden items-center gap-8 md:flex"
        >
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-ink-muted transition-colors hover:text-ink"
            >
              {link.label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <Link
            href="/app/onboarding"
            className={buttonVariants({ size: "sm" })}
          >
            Start Growing
          </Link>
        </div>
      </Container>
    </header>
  );
}
