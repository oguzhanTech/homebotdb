import { ADMIN_USERNAME_CODES } from "@/config/admin-codes";
import { getEditorById } from "@/lib/editors";
import type { CommentAuthorInput } from "@/types/comment";

const USERNAME_PATTERN = /^[a-z0-9][a-z0-9-]{1,38}[a-z0-9]$/i;

export function normalizeUsername(username: string): string {
  return username.trim().toLowerCase();
}

export function isValidPublicUsername(username: string): boolean {
  const normalized = normalizeUsername(username);
  return normalized.length >= 3 && normalized.length <= 40 && USERNAME_PATTERN.test(normalized);
}

export function resolveCommentAuthor(username: string): CommentAuthorInput {
  const normalized = normalizeUsername(username);
  const adminId = ADMIN_USERNAME_CODES[normalized];

  if (adminId) {
    const editor = getEditorById(adminId);
    return {
      username: normalized,
      displayName: editor.name,
      isAdmin: true,
      adminId,
    };
  }

  return {
    username: normalized,
    displayName: normalized,
    isAdmin: false,
  };
}
