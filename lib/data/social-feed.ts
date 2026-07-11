import { socialFeedItems } from "@/data/social-feed";
import type { SocialFeedItem } from "@/types/social-feed";

export function getSocialFeedItems(limit?: number): SocialFeedItem[] {
  const sorted = [...socialFeedItems].sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
  );

  return typeof limit === "number" ? sorted.slice(0, limit) : sorted;
}
