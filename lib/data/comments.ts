import { promises as fs } from "node:fs";
import path from "node:path";
import {
  isValidPublicUsername,
  resolveCommentAuthor,
} from "@/lib/comments-admin";
import {
  COMMENT_MAX_LENGTH,
  COMMENT_MIN_LENGTH,
} from "@/lib/comments-constants";
import type {
  Comment,
  CommentTargetType,
  CreateCommentInput,
} from "@/types/comment";

const COMMENTS_PATH = path.join(process.cwd(), "data", "comments.json");

async function readAllComments(): Promise<Comment[]> {
  try {
    const raw = await fs.readFile(COMMENTS_PATH, "utf8");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as Comment[]) : [];
  } catch {
    return [];
  }
}

async function writeAllComments(comments: Comment[]): Promise<void> {
  await fs.writeFile(COMMENTS_PATH, `${JSON.stringify(comments, null, 2)}\n`, "utf8");
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
  const comments = await readAllComments();
  return getCommentsForTarget(targetType, targetSlug, comments);
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
      message: "Username must be 3–40 characters (letters, numbers, hyphens).",
    };
  }

  if (body.length < COMMENT_MIN_LENGTH || body.length > COMMENT_MAX_LENGTH) {
    return {
      ok: false,
      message: `Comment must be ${COMMENT_MIN_LENGTH}–${COMMENT_MAX_LENGTH} characters.`,
    };
  }

  const comments = await readAllComments();
  const targetComments = getCommentsForTarget(
    input.targetType,
    input.targetSlug,
    comments,
  );

  let parentId: string | null = null;

  if (input.parentId) {
    const parent = targetComments.find((comment) => comment.id === input.parentId);

    if (!parent || parent.parentId) {
      return {
        ok: false,
        message: "You can only reply to a top-level comment.",
      };
    }

    parentId = parent.id;
  }

  const author = resolveCommentAuthor(username);
  const comment: Comment = {
    id: createCommentId(),
    targetType: input.targetType,
    targetSlug: input.targetSlug,
    parentId,
    authorUsername: author.username,
    authorName: author.displayName,
    isAdmin: author.isAdmin,
    adminId: author.adminId,
    body,
    createdAt: new Date().toISOString(),
  };

  comments.push(comment);
  await writeAllComments(comments);

  return { ok: true, comment };
}

export function countCommentsForTarget(
  targetType: CommentTargetType,
  targetSlug: string,
  comments: Comment[],
): number {
  return getCommentsForTarget(targetType, targetSlug, comments).length;
}
