# Radar Feed update cover images

Hero images for `/updates/{slug}` Robot Signal posts. Always set `coverImage` in `data/updates.ts` when adding a post:

```ts
coverImage: "/images/updates/{slug}.jpg",
```

Path `{slug}` must match the update `slug`. Agent declares the filename; editor adds the binary under this folder.

Examples:

- `mirumi-added-to-catalog.jpg`
- `optimus-gen2-price-estimate-musk-target.jpg`
- `figure-02-price-unknown-figure-03-focus.jpg`
- `unitree-g1-price-13500-official.jpg`
- `vector-2-price-history-aligned-199.jpg`
- `lg-q9-added-to-catalog.jpg`
- `mirokai-connectivity-commercial-deployments.jpg`
- `corleo-added-to-catalog.jpg`

Recommended: 1200×630 px or 16:9.
