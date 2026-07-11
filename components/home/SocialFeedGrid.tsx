import type { SocialFeedItem } from "@/types/social-feed";
import { SocialFeedCard } from "@/components/home/SocialFeedCard";

/** All feed posts in a wrapping grid (~400px columns). No horizontal scroll. */
export function SocialFeedGrid({ items }: { items: SocialFeedItem[] }) {
  return (
    <div className="grid items-stretch gap-3 [grid-template-columns:repeat(auto-fill,minmax(min(100%,400px),1fr))]">
      {items.map((item) => (
        <SocialFeedCard key={item.id} item={item} />
      ))}
    </div>
  );
}
