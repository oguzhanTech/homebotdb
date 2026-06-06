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

Everything below the frontmatter is the article body. Use normal Markdown: headings, links, lists, bold, etc.

## Output

`scripts/build-news.mjs` writes `data/news.generated.json`. Do not edit that file by hand.
