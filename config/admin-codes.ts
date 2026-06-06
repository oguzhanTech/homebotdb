import type { EditorId } from "@/types/editor";

/**
 * Map a comment username to a HomeBotRadar editor (admin) profile.
 * Usernames are matched case-insensitively after trim.
 * See README.md for the full list.
 */
export const ADMIN_USERNAME_CODES: Record<string, EditorId> = {
  "oguzhan-aydin26": "oguzhan-aydin",
  "chuck-steward26": "chuck-steward",
  "maya-chen26": "maya-chen",
};
