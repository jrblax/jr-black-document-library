import type {
  ContentType,
  DocumentFormat,
  ISODateString,
  ISODateTimeString,
  MessageLength,
  PublicationStatus,
  Testament,
  VisibilityLevel,
} from "./content-types";

export interface ScriptureReference {
  reference: string;
  book: string;
  chapter?: number;
  verseStart?: number;
  verseEnd?: number;
  testament: Testament;
  isPrimary?: boolean;
  quotation?: string;
  translation?: "KJV" | "NASB" | "other";
}

export interface SeriesReference {
  id: string;
  title: string;
  slug: string;
  sequence?: number;
}

export interface TopicReference {
  id: string;
  name: string;
  slug: string;
}

export interface DoctrinalTheme {
  id: string;
  name: string;
  slug: string;
  summary?: string;
}

export interface PreachingRecord {
  date: ISODateString;
  location?: string;
  congregation?: string;
  event?: string;
  notes?: string;
}

export interface RelatedDocument {
  id: string;
  relationship:
    | "companion"
    | "continuation"
    | "previous"
    | "next"
    | "same-series"
    | "same-topic"
    | "other";
  note?: string;
}

export interface DocumentVersion {
  version: string;
  createdAt: ISODateTimeString;
  createdBy?: string;
  summary?: string;
}

export interface DownloadOptions {
  allowPrint: boolean;
  allowPdf: boolean;
  allowMarkdown: boolean;
}

export interface LibraryDocument {
  id: string;
  slug: string;

  title: string;
  subtitle?: string;
  author: string;

  contentType: ContentType;
  messageLength: MessageLength;
  format: DocumentFormat;

  primaryScripture: ScriptureReference;
  scriptureReferences: ScriptureReference[];

  testament: Testament;
  bibleBooks: string[];
  chapters: number[];

  topics: TopicReference[];
  doctrinalThemes: DoctrinalTheme[];
  series?: SeriesReference;

  objective: string;
  summary: string;
  manuscript: string;

  keywords: string[];
  relatedDocuments: RelatedDocument[];

  status: PublicationStatus;
  visibility: VisibilityLevel;
  featured: boolean;

  createdAt: ISODateTimeString;
  updatedAt: ISODateTimeString;
  publishedAt?: ISODateTimeString;

  firstPreachedAt?: ISODateString;
  lastPreachedAt?: ISODateString;
  preachingHistory: PreachingRecord[];

  version: string;
  versionHistory: DocumentVersion[];

  downloads: DownloadOptions;
}

export type LibraryDocumentInput = Omit<
  LibraryDocument,
  | "createdAt"
  | "updatedAt"
  | "preachingHistory"
  | "relatedDocuments"
  | "versionHistory"
> & {
  createdAt?: ISODateTimeString;
  updatedAt?: ISODateTimeString;
  preachingHistory?: PreachingRecord[];
  relatedDocuments?: RelatedDocument[];
  versionHistory?: DocumentVersion[];
};
