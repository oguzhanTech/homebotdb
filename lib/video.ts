export function getYouTubeVideoId(url: string): string | null {
  try {
    const parsed = new URL(url.trim());

    if (parsed.hostname.includes("youtube.com")) {
      const id = parsed.searchParams.get("v");
      return id?.length ? id : null;
    }

    if (parsed.hostname.includes("youtu.be")) {
      const id = parsed.pathname.replace("/", "");
      return id.length ? id : null;
    }
  } catch {
    return null;
  }

  return null;
}

export function getYouTubeEmbedUrl(
  url: string,
  options?: { autoplay?: boolean },
): string | null {
  const id = getYouTubeVideoId(url);
  if (!id) return null;

  const params = new URLSearchParams({
    rel: "0",
    modestbranding: "1",
  });

  if (options?.autoplay) {
    params.set("autoplay", "1");
  }

  return `https://www.youtube-nocookie.com/embed/${id}?${params.toString()}`;
}

export function getYouTubeThumbnail(url: string): string | null {
  const id = getYouTubeVideoId(url);
  if (!id) return null;
  // mqdefault is 16:9 — matches the embedded player aspect ratio.
  return `https://img.youtube.com/vi/${id}/mqdefault.jpg`;
}

export function isEmbeddableVideo(url: string): boolean {
  return getYouTubeVideoId(url) !== null;
}

export function getTwitterStatusId(url: string): string | null {
  try {
    const parsed = new URL(url.trim());
    const host = parsed.hostname.replace(/^www\./, "");

    if (host !== "twitter.com" && host !== "x.com") {
      return null;
    }

    const match = parsed.pathname.match(/\/status\/(\d+)/);
    return match?.[1] ?? null;
  } catch {
    return null;
  }
}

export function getTwitterEmbedUrl(url: string): string | null {
  const id = getTwitterStatusId(url);
  if (!id) return null;

  return `https://platform.twitter.com/embed/Tweet.html?id=${id}&theme=light&dnt=true&width=550`;
}

export function isEmbeddableTweet(url: string): boolean {
  return getTwitterStatusId(url) !== null;
}
