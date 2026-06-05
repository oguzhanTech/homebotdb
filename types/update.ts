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
  robotSlug?: string;
  summary: string;
  content: string;
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
