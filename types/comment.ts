import type { EditorId } from "@/types/editor";

export type CommentTargetType = "robot" | "news";

export interface CommentTarget {
  type: CommentTargetType;
  slug: string;
}

export interface Comment {
  id: string;
  targetType: CommentTargetType;
  targetSlug: string;
  parentId: string | null;
  authorUsername: string;
  authorName: string;
  isAdmin: boolean;
  adminId?: EditorId;
  body: string;
  createdAt: string;
}

export interface CommentAuthorInput {
  username: string;
  displayName: string;
  isAdmin: boolean;
  adminId?: EditorId;
}

export interface CreateCommentInput {
  targetType: CommentTargetType;
  targetSlug: string;
  parentId?: string | null;
  username: string;
  body: string;
}
