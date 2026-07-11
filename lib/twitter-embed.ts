export const TWITTER_EMBED_ORIGIN = "https://platform.twitter.com";

export function readTwitterEmbedHeight(data: unknown): number | null {
  if (!data || typeof data !== "object") return null;

  const payload = data as Record<string, unknown>;

  if (payload.event === "resize" && typeof payload.height === "number") {
    return payload.height;
  }

  const twttr = payload.twttr;
  if (
    twttr &&
    typeof twttr === "object" &&
    (twttr as { event?: string }).event === "resize" &&
    typeof (twttr as { height?: number }).height === "number"
  ) {
    return (twttr as { height: number }).height;
  }

  const embed = payload["twttr.embed"];
  if (
    embed &&
    typeof embed === "object" &&
    (embed as { method?: string }).method === "twttr.private.resize"
  ) {
    const params = (embed as { params?: Array<{ height?: number }> }).params;
    const height = params?.[0]?.height;
    if (typeof height === "number") return height;
  }

  return null;
}
