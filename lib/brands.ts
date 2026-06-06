import { brands, type Brand } from "@/data/brands";

const brandByKey = new Map<string, Brand>();

for (const brand of brands) {
  brandByKey.set(brand.name.toLowerCase(), brand);
  brandByKey.set(brand.id.toLowerCase(), brand);
  for (const alias of brand.aliases) {
    brandByKey.set(alias.toLowerCase(), brand);
  }
}

export function resolveBrand(brandName: string): Brand | undefined {
  return brandByKey.get(brandName.trim().toLowerCase());
}

export function getBrandLogo(brandName: string): string | undefined {
  return resolveBrand(brandName)?.logo;
}

export function getBrandInitials(brandName: string): string {
  const parts = brandName.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
}
