export type PrimaryTask =
  | "home_assistant"
  | "cleaning"
  | "conversation"
  | "education"
  | "elder_care"
  | "entertainment";

export type RobotType =
  | "humanoid"
  | "zoomorphic"
  | "mobile"
  | "desktop"
  | "specialty";

export type CommercialStatus =
  | "buy_now"
  | "pre_order"
  | "waitlist"
  | "coming_soon"
  | "prototype"
  | "limited"
  | "unknown";

export type AvailabilityStatus =
  | "available"
  | "limited"
  | "waitlist"
  | "coming_soon"
  | "prototype"
  | "unknown";

export type DataStatus = "confirmed" | "unconfirmed" | "coming_soon";

export type PriceStatus =
  | "confirmed"
  | "estimate"
  | "unknown"
  | "coming_soon";

export interface FieldMeta {
  status: DataStatus;
  updatedAt?: string;
  /** Extra context shown on the spec qualifier tooltip (e.g. active vs standby runtime). */
  note?: string;
}

export interface Capability {
  name: string;
  score: number;
}

export interface PriceHistoryEntry {
  date: string;
  price: string;
  status: DataStatus;
  note?: string;
}

export interface RobotReview {
  source: string;
  summary: string;
  url?: string;
}

export interface Robot {
  id: string;
  name: string;
  slug: string;
  brand: string;
  type: RobotType;
  primaryTask: PrimaryTask;
  shortDescription: string;
  longDescription: string;
  price: string;
  priceStatus: PriceStatus;
  batteryLife: string;
  chargeTime: string;
  height: string;
  weight: string;
  speed: string;
  payload: string;
  sensors: string;
  processor: string;
  connectivity: string;
  readinessScore: number;
  realityScore: number;
  dataFreshnessScore: number;
  dataConfidenceScore: number;
  commercialStatus: CommercialStatus;
  availabilityStatus: AvailabilityStatus;
  countriesAvailable: string[];
  firstAnnounced: string;
  lastUpdated: string;
  imageUrl: string;
  imageUrls?: string[];
  videoUrls: string[];
  affiliateUrl: string;
  sourceUrls: string[];
  similarRobotSlugs: string[];
  capabilities: Capability[];
  ecosystem: string[];
  reviews: RobotReview[];
  tags: string[];
  fieldMeta: Record<string, FieldMeta>;
  priceHistory: PriceHistoryEntry[];
  degreesOfFreedom?: string;
  unitId?: string;
}

export const ROBOT_TYPES: { value: RobotType | "all"; label: string }[] = [
  { value: "all", label: "All forms" },
  { value: "humanoid", label: "Humanoid" },
  { value: "zoomorphic", label: "Animal-like" },
  { value: "mobile", label: "Mobile" },
  { value: "desktop", label: "Desktop" },
  { value: "specialty", label: "Other" },
];

export const COMMERCIAL_STATUS_LABELS: Record<CommercialStatus, string> = {
  buy_now: "Buy Now",
  pre_order: "Pre-order",
  waitlist: "Waitlist",
  coming_soon: "Coming Soon",
  prototype: "Prototype",
  limited: "Limited",
  unknown: "Unknown",
};

export const AVAILABILITY_STATUS_LABELS: Record<AvailabilityStatus, string> = {
  available: "Available",
  limited: "Limited",
  waitlist: "Waitlist",
  coming_soon: "Coming Soon",
  prototype: "Prototype",
  unknown: "Unknown",
};

export const ROBOT_TYPE_LABELS: Record<RobotType, string> = {
  humanoid: "Humanoid",
  zoomorphic: "Animal-like",
  mobile: "Mobile",
  desktop: "Desktop",
  specialty: "Other",
};

export const PRIMARY_TASKS: { value: PrimaryTask | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "home_assistant", label: "Home Assistant" },
  { value: "cleaning", label: "Cleaning" },
  { value: "conversation", label: "Conversation" },
  { value: "education", label: "Education" },
  { value: "elder_care", label: "Elder Care" },
  { value: "entertainment", label: "Entertainment" },
];

export const PRIMARY_TASK_LABELS: Record<PrimaryTask, string> = {
  home_assistant: "Home Assistant",
  cleaning: "Cleaning",
  conversation: "Conversation",
  education: "Education",
  elder_care: "Elder Care",
  entertainment: "Entertainment",
};
