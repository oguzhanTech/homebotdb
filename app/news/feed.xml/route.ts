import { siteConfig } from "@/config/site";
import { getNewsUpdates } from "@/lib/data/repository";
import { getEditorById } from "@/lib/editors";
import { getUpdatePublicPath } from "@/lib/update-paths";

export async function GET() {
  const news = getNewsUpdates();
  const items = news
    .map((update) => {
      const author = getEditorById(update.authorId);
      const link = `${siteConfig.url}${getUpdatePublicPath(update)}`;
      return `
    <item>
      <title><![CDATA[${update.title}]]></title>
      <link>${link}</link>
      <guid>${link}</guid>
      <pubDate>${new Date(update.createdAt).toUTCString()}</pubDate>
      <description><![CDATA[${update.summary}]]></description>
      <author>${author.name}</author>
    </item>`;
    })
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>${siteConfig.name} Robot News</title>
    <link>${siteConfig.url}/news</link>
    <description>Home robot news and market roundups on ${siteConfig.name}.</description>
    ${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
    },
  });
}
