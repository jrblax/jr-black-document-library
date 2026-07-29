export type ResourceType =
  | "sermon"
  | "bible-study"
  | "article"
  | "leadership-lesson"
  | "missionary-training"
  | "book"
  | "devotional"
  | "conference-notes"
  | "study-guide";

export type ResourceStatus =
  | "draft"
  | "reviewed"
  | "published"
  | "archived";

export interface Resource {
  id: string;
  type: ResourceType;

  title: string;
  subtitle?: string;
  author: string;
  slug: string;

  primaryScripture?: string;
  supportingScriptures: string[];

  categories: string[];
  topics: string[];
  series?: string;
  collection?: string;

  summary: string;
  objective?: string;
  keywords: string[];

  format?: "Black-30" | "Black-40" | "Black-60" | "Other";

  status: ResourceStatus;
  featured: boolean;

  dateWritten?: string;
  datePublished?: string;

  content: string;
}

const RESOURCE_ID_PATTERN = /^RES-\d{6}$/;

/**
 * Returns true only when a Resource ID uses the permanent Treasury of Truth
 * format: `RES-` followed by exactly six decimal digits.
 */
export function isValidResourceId(resourceId: string): boolean {
  return RESOURCE_ID_PATTERN.test(resourceId);
}

/**
 * Version 1 example mapped from the existing sermon record. The full sermon
 * manuscript has not been added to the current data, so `content` remains
 * empty until that source material is available.
 */
export const faithfulOverAFewThingsResource: Resource = {
  id: "RES-000001",
  type: "sermon",
  title: "Faithful Over A Few Things",
  subtitle: "Small Responsibilities Prepare Us For Greater Things",
  author: "J. R. Black",
  slug: "faithful-over-a-few-things",
  primaryScripture: "Matthew 25:21",
  supportingScriptures: [],
  categories: ["Sermon"],
  topics: ["Faithfulness", "Stewardship", "Service"],
  collection: "Treasury of Truth",
  summary:
    "A sermon on stewardship, faithfulness, and the reward of serving God well in small responsibilities.",
  objective:
    "To encourage believers to remain faithful in small responsibilities, knowing that God values consistency, stewardship, and obedience.",
  keywords: ["faithfulness", "stewardship", "service"],
  status: "published",
  featured: true,
  content: "",
};
