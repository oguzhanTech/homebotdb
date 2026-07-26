# Radar Feed update cover images

Hero images for `/updates/{slug}` Robot Signal posts. Always set `coverImage` in `data/updates.ts` when adding a post:

```ts
coverImage: "/images/updates/{slug}.jpg",
```

Path `{slug}` must match the update `slug`. Agent declares the filename; editor adds the binary under this folder.

Examples:

- `mirumi-added-to-catalog.jpg`
- `optimus-gen2-price-estimate-musk-target.jpg`
- `realbotix-melody-quote-only-not-buy-now.jpg`
- `realbotix-melody-added-to-catalog.jpg`

Recommended: 1200×630 px or 16:9.
