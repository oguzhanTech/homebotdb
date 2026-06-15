# News articles

Each `.md` file in this folder becomes one news item on `/news` and `/news/{slug}`.

After editing, run **`npm run news:build`** (or restart `npm run dev` — it runs automatically).

The site reads `data/news.generated.json`, not the `.md` files directly. If your cover image or text does not update, rebuild first.

## Frontmatter

```yaml
---
title: Article headline
slug: url-slug-here          # optional — defaults to filename without .md
authorId: oguzhan-aydin      # oguzhan-aydin | chuck-steward | maya-chen
robotSlug: figure-02         # optional — links to a robot page
summary: One-line card teaser for /news and homepage widgets.
coverImage: /images/news/your-cover.jpg   # optional
sourceUrl: https://example.com/source     # optional
createdAt: 2026-05-01T18:30:00Z
updatedAt: 2026-05-01T18:30:00Z            # optional — defaults to createdAt
---
```

Everything below the frontmatter is the article body. Use normal Markdown: headings, links, lists, bold, **inline images**, etc.

## Article length and SEO

- **Do not ship ultra-thin news** (under ~250 words). Google and readers both need enough substance to index and trust the page.
- **Target 320–480 words** when the source has real detail (field tests, specs, quotes, context). Shorter is fine only for genuinely thin announcements with little to add honestly.
- **Expand with facts**, not filler: who, where, when, hardware changes, limits, and what HomeBotRadar readers should take away.
- If the source is thin, say what is **unknown** instead of padding with hype.

## Images

- **`coverImage`** in frontmatter: card hero + social preview (1200×630 or 16:9). Path under `public/images/news/`.
- **Inline body images:** use standard Markdown after the lead paragraph when it helps the story:

  ```markdown
  ![Caption shown under the photo](/images/news/your-inline.jpg)
  ```

- Credit the source in the caption or nearby prose when not your own photo (e.g. "DEEP Robotics / YouTube still").
- Rebuild after adding files: `npm run news:build`.

## Catalog policy

- **Industrial or enterprise-only robots** (factory quadrupeds, lab reference rigs) usually get a **news article only**, not a new row in `data/robots.ts`, unless the team explicitly wants them in the home catalog.
- Say clearly in **What this means for HomeBotRadar** when a robot is **not** being added.

## Output

`scripts/build-news.mjs` writes `data/news.generated.json`. Do not edit that file by hand.
