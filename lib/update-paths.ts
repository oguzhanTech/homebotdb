import type { Update } from "@/types/update";
import { isNewsUpdate } from "@/types/update";

export function getUpdatePublicPath(
  update: Pick<Update, "slug" | "type">,
): string {
  return isNewsUpdate(update.type)
    ? `/news/${update.slug}`
    : `/updates/${update.slug}`;
}
