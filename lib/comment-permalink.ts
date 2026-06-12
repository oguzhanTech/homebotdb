import { siteConfig } from "@/config/site";

export function commentPermalink(pagePath: string, commentId: string): string {
  return `${siteConfig.url}${pagePath}#comment-${commentId}`;
}
