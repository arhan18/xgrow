"use client";

import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ErrorState } from "@/components/ui/state";

export default function AppError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <ErrorState
      title="This screen didn't load"
      description={
        error.message ||
        "Something interrupted the growth system. Try again — your data is safe."
      }
      action={
        <Button onClick={reset}>
          <RefreshCw className="h-4 w-4" aria-hidden />
          Try again
        </Button>
      }
    />
  );
}
