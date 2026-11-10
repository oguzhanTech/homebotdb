import knowledgeAnswers from "@/data/knowledge.generated.json";

export const KNOWLEDGE_CATEGORIES = [
  {
    slug: "buying",
    label: "Buying",
    description: "Cart, pre-order, discontinued, and not for sale.",
  },
  {
    slug: "price",
    label: "Price",
    description: "Sticker price, lease, subscription, and what you pay after the hardware.",
  },
  {
    slug: "shipping",
    label: "Shipping",
    description: "Countries, dates, and backorder.",
  },
  {
    slug: "capabilities",
    label: "Capabilities",
    description: "Stairs, chores, and what a robot does in a home.",
  },
  {
    slug: "safety",
    label: "Safety",
    description: "Privacy, kids, and supervision.",
  },
] as const;

export type KnowledgeCategorySlug = (typeof KNOWLEDGE_CATEGORIES)[number]["slug"];

export interface KnowledgeSource {
  label: string;
  url: string;
}

export interface KnowledgeAnswer {
  title: string;
  slug: string;
  description: string;
  summary: string;
  shortAnswer: string;
  category: KnowledgeCategorySlug;
  publishedAt: string;
  updatedAt: string;
  robotSlugs: string[];
  compareSlug: string;
  rankingSlug: string;
  sources: KnowledgeSource[];
  content: string;
}

const answers = knowledgeAnswers as KnowledgeAnswer[];

const categoryBySlug = new Map(
  KNOWLEDGE_CATEGORIES.map((category) => [category.slug, category]),
);

export function isKnowledgeCategorySlug(slug: string): slug is KnowledgeCategorySlug {
  return categoryBySlug.has(slug as KnowledgeCategorySlug);
}

export function getKnowledgeCategory(slug: string) {
  return categoryBySlug.get(slug as KnowledgeCategorySlug);
}

export function getKnowledgeAnswers(): KnowledgeAnswer[] {
  return [...answers].sort((a, b) => a.publishedAt.localeCompare(b.publishedAt));
}

export function getKnowledgeBySlug(slug: string): KnowledgeAnswer | undefined {
  return answers.find((answer) => answer.slug === slug);
}

export function getAnswersByCategory(category: KnowledgeCategorySlug): KnowledgeAnswer[] {
  return getKnowledgeAnswers().filter((answer) => answer.category === category);
}

export function getKnowledgeCategoriesWithAnswers() {
  return KNOWLEDGE_CATEGORIES.filter(
    (category) => getAnswersByCategory(category.slug).length > 0,
  );
}
