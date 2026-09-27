import type { ContentFormat, ContentTopic } from "@/lib/types";

/** Shared vocabulary so analysis statements and UI labels never diverge. */

export const TOPIC_LABELS: Record<ContentTopic, string> = {
  "developer-tooling": "Developer tooling",
  "build-in-public": "Build in public",
  "growth-distribution": "Growth & distribution",
  "product-build": "Product build",
  "founder-lessons": "Founder lessons",
};

export const FORMAT_LABELS: Record<ContentFormat, string> = {
  text: "Text post",
  thread: "Thread",
  poll: "Poll",
  image: "Image post",
  video: "Video",
};

const FORMAT_PHRASES: Record<ContentFormat, string> = {
  text: "a plain text post",
  thread: "a thread",
  poll: "a poll",
  image: "an image post",
  video: "a short video",
};

export function topicLabel(topic: ContentTopic): string {
  return TOPIC_LABELS[topic];
}

export function formatLabel(format: ContentFormat): string {
  return FORMAT_LABELS[format];
}

export function formatPhrase(format: ContentFormat): string {
  return FORMAT_PHRASES[format];
}

export const WEEKDAY_LABELS = [
  "Sun",
  "Mon",
  "Tue",
  "Wed",
  "Thu",
  "Fri",
  "Sat",
] as const;
