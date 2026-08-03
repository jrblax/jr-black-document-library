export const CONTENT_TYPES = [
  "sermon",
  "lesson",
  "devotional",
  "article",
  "book",
  "note",
] as const;

export type ContentType = (typeof CONTENT_TYPES)[number];

export const MESSAGE_LENGTHS = [
  "black-30",
  "black-40",
  "black-60",
  "custom",
  "not-applicable",
] as const;

export type MessageLength = (typeof MESSAGE_LENGTHS)[number];

export const PUBLICATION_STATUSES = [
  "draft",
  "reviewed",
  "published",
  "archived",
] as const;

export type PublicationStatus =
  (typeof PUBLICATION_STATUSES)[number];

export const VISIBILITY_LEVELS = [
  "public",
  "private",
  "unlisted",
] as const;

export type VisibilityLevel =
  (typeof VISIBILITY_LEVELS)[number];

export const TESTAMENTS = [
  "old",
  "new",
  "multiple",
  "not-applicable",
] as const;

export type Testament = (typeof TESTAMENTS)[number];

export const DOCUMENT_FORMATS = [
  "markdown",
  "mdx",
  "html",
  "plain-text",
] as const;

export type DocumentFormat =
  (typeof DOCUMENT_FORMATS)[number];

export type ISODateString = string;
export type ISODateTimeString = string;
