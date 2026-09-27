import type { Metadata } from "next";
import Link from "next/link";
import { NotebookPen } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { buttonVariants } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/state";

export const metadata: Metadata = { title: "Growth Diary" };

export default function DiaryPage() {
  return (
    <>
      <PageHeader
        eyebrow="Memory"
        title="Growth Diary"
        description="The memory layer of Xgrow — what the system learned, what you did, what happened, and what changed because of it."
      />

      <EmptyState
        eyebrow="Nothing recorded yet"
        icon={<NotebookPen className="h-5 w-5" />}
        title="Your diary is empty"
        description="Every experiment, result and updated learning lands here — so progress compounds instead of disappearing into the feed."
        action={
          <Link href="/app/today" className={buttonVariants()}>
            Go to Today
          </Link>
        }
      />
    </>
  );
}
