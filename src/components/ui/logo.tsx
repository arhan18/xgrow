import Link from "next/link";
import { cn } from "@/lib/utils";

export function Logo({
  href = "/",
  className,
  markOnly = false,
}: {
  href?: string;
  className?: string;
  markOnly?: boolean;
}) {
  return (
    <Link
      href={href}
      aria-label="Xgrow home"
      className={cn(
        "group inline-flex items-center gap-2.5 rounded-md",
        className,
      )}
    >
      <span className="grid h-7 w-7 shrink-0 place-items-center rounded-[7px] bg-ink font-display text-[15px] leading-none text-paper transition-transform duration-150 group-hover:-translate-y-px">
        X
      </span>
      {!markOnly && (
        <span className="font-display text-[19px] leading-none tracking-[-0.01em] text-ink">
          Xgrow
        </span>
      )}
    </Link>
  );
}
