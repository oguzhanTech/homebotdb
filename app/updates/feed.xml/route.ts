import { siteConfig } from "@/config/site";
import { uiCopy } from "@/config/ui-copy";
import { getDataUpdates } from "@/lib/data/repository";
import { getEditorById } from "@/lib/editors";

export async function GET() {
  const updates = getDataUpdates();
  const items = updates
    .map((update) => {
      const author = getEditorById(update.authorId);
      return `
    <item>
      <title><![CDATA[${update.title}]]></title>
      <link>${siteConfig.url}/updates/${update.slug}</link>
      <guid>${siteConfig.url}/updates/${update.slug}</guid>
      <pubDate>${new Date(update.createdAt).toUTCString()}</pubDate>
      <description><![CDATA[${update.summary}]]></description>
      <author>${author.name}</author>
    </item>`;
    })
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>${siteConfig.name} ${uiCopy.nav.radarFeed}</title>
    <link>${siteConfig.url}/updates</link>
    <description>Spec, score, price, and availability changes on ${siteConfig.name}.</description>
    ${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
    },
  });
}
