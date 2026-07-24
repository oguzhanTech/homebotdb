import { TWITTER_EMBED_MAX_WIDTH } from "@/lib/twitter-embed";

/** Matches Tailwind gap-3 used by feed grids. */
export const SOCIAL_FEED_GAP_PX = 12;

/**
 * Fewest columns so each card is ≤ maxWidth and the row can fill the container.
 * Example: 1200px → 3 cols (~392px) instead of 2×550 with empty space on the right.
 */
export function getSocialFeedColumnCount(
  containerWidth: number,
  maxCardWidth: number = TWITTER_EMBED_MAX_WIDTH,
  gapPx: number = SOCIAL_FEED_GAP_PX,
): number {
  if (containerWidth <= 0) return 1;
  return Math.max(
    1,
    Math.ceil((containerWidth + gapPx) / (maxCardWidth + gapPx)),
  );
}
