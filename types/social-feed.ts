export interface SocialFeedItem {
  id: string;
  tweetUrl: string;
  handle: string;
  brandLabel: string;
  summary: string;
  publishedAt: string;
  robotSlug?: string;
  newsSlug?: string;
  compareSlugs?: [string, string];
}
