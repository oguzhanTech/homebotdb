import { siteConfig } from "@/config/site";
import { getUpdates } from "@/lib/data/repository";

export async function GET() {
  const updates = getUpdates();
  const items = updates
    .map(
      (update) => `
    <item>
      <title><![CDATA[${update.title}]]></title>
      <link>${siteConfig.url}/updates/${update.slug}</link>
      <guid>${siteConfig.url}/updates/${update.slug}</guid>
      <pubDate>${new Date(update.createdAt).toUTCString()}</pubDate>
      <description><![CDATA[${update.summary}]]></description>
    </item>`,
    )
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>${siteConfig.name} Updates</title>
    <link>${siteConfig.url}/updates</link>
    <description>${siteConfig.description}</description>
    ${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
    },
  });
}
