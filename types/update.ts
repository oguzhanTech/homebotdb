import type { EditorId } from "@/types/editor";

export type UpdateType =
  | "data_update"
  | "news"
  | "price_update"
  | "availability_update";

export interface Update {
  id: string;
  title: string;
  slug: string;
  type: UpdateType;
  authorId: EditorId;
  robotSlug?: string;
  summary: string;
  content: string;
  coverImage?: string;
  sourceUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export const UPDATE_TYPE_LABELS: Record<UpdateType, string> = {
  data_update: "Data Update",
  news: "News",
  price_update: "Price Update",
  availability_update: "Availability Update",
};

export function isNewsUpdate(type: UpdateType): boolean {
  return type === "news";
}

export function getEditorAttributionLabel(type: UpdateType): "Written by" | "Updated by" {
  return isNewsUpdate(type) ? "Written by" : "Updated by";
}
