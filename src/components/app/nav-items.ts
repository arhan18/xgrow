import { Lightbulb, NotebookPen, Target } from "lucide-react";

export const NAV_ITEMS = [
  { href: "/app/today", label: "Today", shortLabel: "Today", icon: Target },
  {
    href: "/app/learned",
    label: "What We Learned",
    shortLabel: "Learned",
    icon: Lightbulb,
  },
  {
    href: "/app/diary",
    label: "Growth Diary",
    shortLabel: "Diary",
    icon: NotebookPen,
  },
] as const;

export const SECTION_TITLES: Record<string, string> = {
  "/app/today": "Today's Growth Plan",
  "/app/learned": "What We Learned",
  "/app/diary": "Growth Diary",
  "/app/onboarding": "Set up your system",
};

export function sectionTitle(pathname: string): string {
  return SECTION_TITLES[pathname] ?? "Xgrow";
}
