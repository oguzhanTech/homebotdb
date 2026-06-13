import { revalidatePath } from "next/cache";
import type { Comment } from "@/types/comment";
import { getCommentPublicPath } from "@/lib/data/comments";

export function revalidateCommentTarget(
  targetType: Comment["targetType"],
  targetSlug: string,
): void {
  revalidatePath(getCommentPublicPath(targetType, targetSlug));
}
