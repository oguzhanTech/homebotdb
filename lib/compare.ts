export function buildCompareSlug(slugs: string[]): string {
  if (slugs.length < 2 || slugs.length > 3) {
    throw new Error("Compare requires 2 or 3 robot slugs");
  }
  return [...slugs].sort().join("-vs-");
}

export function parseCompareSlug(slug: string): string[] {
  return slug.split("-vs-").filter(Boolean);
}

export function isValidCompareSlug(slug: string): boolean {
  const parts = parseCompareSlug(slug);
  return parts.length >= 2 && parts.length <= 3;
}

export function buildComparePath(slugs: string[]): string {
  return `/compare/${buildCompareSlug(slugs)}`;
}
