export type EditorId = "oguzhan-aydin" | "chuck-steward" | "maya-chen";

export interface Editor {
  id: EditorId;
  name: string;
  role: string;
  bio: string;
  avatar: string;
}

export const EDITOR_IDS: EditorId[] = [
  "oguzhan-aydin",
  "chuck-steward",
  "maya-chen",
];
