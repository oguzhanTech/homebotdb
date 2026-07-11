import Link from "next/link";
import type { SocialFeedItem } from "@/types/social-feed";
import { uiCopy } from "@/config/ui-copy";
import { SocialFeedHomePreview } from "@/components/home/SocialFeedHomePreview";

function buildSocialFeedJsonLd(items: SocialFeedItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: uiCopy.homepage.socialFeed.heading,
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: item.tweetUrl,
      name: item.summary,
    })),
  };
}

export function SocialSignalSection({
  items,
  viewAllHref = "/feeds",
}: {
  items: SocialFeedItem[];
  viewAllHref?: string;
}) {
  if (items.length === 0) return null;

  const jsonLd = buildSocialFeedJsonLd(items);

  return (
    <section className="mt-10" aria-labelledby="social-signal-heading">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="mb-4 flex items-end justify-between gap-3">
        <div>
          <div className="text-[11px] font-bold uppercase tracking-[0.14em] text-muted">
            {uiCopy.homepage.socialFeed.eyebrow}
          </div>
          <h2
            id="social-signal-heading"
            className="mt-1 text-xl font-semibold tracking-tight"
          >
            {uiCopy.homepage.socialFeed.heading}
          </h2>
        </div>
        <Link
          href={viewAllHref}
          className="cursor-pointer shrink-0 text-xs font-bold uppercase tracking-wider text-blue"
        >
          {uiCopy.homepage.socialFeed.viewAll}
        </Link>
      </div>

      <SocialFeedHomePreview items={items} />

      <p className="mt-3 text-[11px] text-muted">
        {uiCopy.homepage.socialFeed.footerNote}
      </p>
    </section>
  );
}
