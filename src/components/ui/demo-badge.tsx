import { FlaskConical, Info } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { DEMO_SOURCE_NOTE } from "@/lib/demo/account";
import { cn } from "@/lib/utils";

export function DemoBadge({ className }: { className?: string }) {
  return (
    <Badge
      variant="demo"
      className={cn("uppercase tracking-[0.08em]", className)}
      icon={<FlaskConical className="h-3 w-3" aria-hidden />}
    >
      Demo Mode
    </Badge>
  );
}

export function DemoNote({ className }: { className?: string }) {
  return (
    <p
      className={cn(
        "flex items-start gap-2 text-[13px] leading-relaxed text-demo-ink",
        className,
      )}
    >
      <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden />
      <span>{DEMO_SOURCE_NOTE}</span>
    </p>
  );
}
