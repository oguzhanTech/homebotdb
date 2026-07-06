import {
  isValidPublicUsername,
  resolveCommentAuthor,
} from "@/lib/comments-admin";
import {
  COMMENT_MAX_LENGTH,
  COMMENT_MIN_LENGTH,
} from "@/lib/comments-constants";
import { getSupabase, getSupabaseAdmin } from "@/lib/supabase/server";
import type { EditorId } from "@/types/editor";
import type {
  Comment,
  CommentTargetType,
  CreateCommentInput,
} from "@/types/comment";

interface CommentRow {
  id: string;
  target_type: CommentTargetType;
  target_slug: string;
  parent_id: string | null;
  author_username: string;
  author_name: string;
  is_admin: boolean;
  admin_id: string | null;
  body: string;
  created_at: string;
}

function rowToComment(row: CommentRow): Comment {
  return {
    id: row.id,
    targetType: row.target_type,
    targetSlug: row.target_slug,
    parentId: row.parent_id,
    authorUsername: row.author_username,
    authorName: row.author_name,
    isAdmin: row.is_admin,
    ...(row.admin_id ? { adminId: row.admin_id as EditorId } : {}),
    body: row.body,
    createdAt: row.created_at,
  };
}

function createCommentId(): string {
  return `c_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

function sortComments(comments: Comment[]): Comment[] {
  return [...comments].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
  );
}

export function getCommentsForTarget(
  targetType: CommentTargetType,
  targetSlug: string,
  comments: Comment[],
): Comment[] {
  return sortComments(
    comments.filter(
      (comment) =>
        comment.targetType === targetType && comment.targetSlug === targetSlug,
    ),
  );
}

export async function listComments(
  targetType: CommentTargetType,
  targetSlug: string,
): Promise<Comment[]> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("comments")
    .select("*")
    .eq("target_type", targetType)
    .eq("target_slug", targetSlug)
    .order("created_at", { ascending: true });

  if (error) {
    throw new Error(`Failed to load comments: ${error.message}`);
  }

  return (data as CommentRow[]).map(rowToComment);
}

export async function listAllComments(): Promise<Comment[]> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("comments")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(`Failed to load comments: ${error.message}`);
  }

  return (data as CommentRow[]).map(rowToComment);
}

export async function listRecentComments(limit = 5): Promise<Comment[]> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("comments")
    .select("*")
    .is("parent_id", null)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    throw new Error(`Failed to load recent comments: ${error.message}`);
  }

  return (data as CommentRow[]).map(rowToComment);
}

export async function deleteComment(id: string): Promise<Comment | null> {
  const supabase = getSupabaseAdmin();

  const { data: existing, error: fetchError } = await supabase
    .from("comments")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (fetchError) {
    throw new Error(`Failed to load comment: ${fetchError.message}`);
  }

  if (!existing) return null;

  const { error: deleteError } = await supabase
    .from("comments")
    .delete()
    .eq("id", id);

  if (deleteError) {
    throw new Error(`Failed to delete comment: ${deleteError.message}`);
  }

  return rowToComment(existing as CommentRow);
}

export function getCommentPublicPath(
  targetType: CommentTargetType,
  targetSlug: string,
): string {
  if (targetType === "robot") return `/robots/${targetSlug}/`;
  return `/news/${targetSlug}/`;
}

export function groupCommentsByThread(comments: Comment[]): {
  topLevel: Comment[];
  repliesByParent: Map<string, Comment[]>;
} {
  const topLevel: Comment[] = [];
  const repliesByParent = new Map<string, Comment[]>();

  for (const comment of comments) {
    if (!comment.parentId) {
      topLevel.push(comment);
      continue;
    }

    const siblings = repliesByParent.get(comment.parentId) ?? [];
    siblings.push(comment);
    repliesByParent.set(comment.parentId, siblings);
  }

  for (const [parentId, replies] of repliesByParent) {
    repliesByParent.set(parentId, sortComments(replies));
  }

  return { topLevel, repliesByParent };
}

export interface CommentValidationError {
  ok: false;
  message: string;
}

export type CreateCommentResult =
  | { ok: true; comment: Comment }
  | CommentValidationError;

export async function createComment(
  input: CreateCommentInput,
): Promise<CreateCommentResult> {
  const username = input.username.trim();
  const body = input.body.trim();

  if (!isValidPublicUsername(username)) {
    return {
      ok: false,
      message: "Username must be 3–40 characters (letters, numbers, hyphens, underscores).",
    };
  }

  if (body.length < COMMENT_MIN_LENGTH || body.length > COMMENT_MAX_LENGTH) {
    return {
      ok: false,
      message: `Comment must be ${COMMENT_MIN_LENGTH}–${COMMENT_MAX_LENGTH} characters.`,
    };
  }

  const supabase = getSupabaseAdmin();
  let parentId: string | null = null;

  if (input.parentId) {
    const { data: parent, error } = await supabase
      .from("comments")
      .select("id")
      .eq("id", input.parentId)
      .eq("target_type", input.targetType)
      .eq("target_slug", input.targetSlug)
      .is("parent_id", null)
      .maybeSingle();

    if (error) {
      throw new Error(`Failed to verify parent comment: ${error.message}`);
    }

    if (!parent) {
      return {
        ok: false,
        message: "Could not find the comment you are replying to.",
      };
    }

    parentId = parent.id;
  }

  const author = resolveCommentAuthor(username);
  const id = createCommentId();

  const { data, error } = await supabase
    .from("comments")
    .insert({
      id,
      target_type: input.targetType,
      target_slug: input.targetSlug,
      parent_id: parentId,
      author_username: author.username,
      author_name: author.displayName,
      is_admin: author.isAdmin,
      admin_id: author.adminId ?? null,
      body,
    })
    .select("*")
    .single();

  if (error) {
    throw new Error(`Failed to save comment: ${error.message}`);
  }

  return { ok: true, comment: rowToComment(data as CommentRow) };
}

export function countCommentsForTarget(
  targetType: CommentTargetType,
  targetSlug: string,
  comments: Comment[],
): number {
  return getCommentsForTarget(targetType, targetSlug, comments).length;
}
