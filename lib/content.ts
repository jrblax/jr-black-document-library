import {
  CONTENT_TYPES,
  DOCUMENT_FORMATS,
  MESSAGE_LENGTHS,
  PUBLICATION_STATUSES,
  TESTAMENTS,
  VISIBILITY_LEVELS,
} from "./content-types";
import type {
  LibraryDocument,
  LibraryDocumentInput,
} from "./content-schema";

const includesValue = <T extends readonly string[]>(
  values: T,
  value: string,
): value is T[number] => values.includes(value as T[number]);

export function createLibraryDocument(
  input: LibraryDocumentInput,
): LibraryDocument {
  const now = new Date().toISOString();

  return {
    ...input,
    createdAt: input.createdAt ?? now,
    updatedAt: input.updatedAt ?? now,
    preachingHistory: input.preachingHistory ?? [],
    relatedDocuments: input.relatedDocuments ?? [],
    versionHistory: input.versionHistory ?? [],
  };
}

export function validateLibraryDocument(
  document: LibraryDocument,
): string[] {
  const errors: string[] = [];

  if (!document.id.trim()) errors.push("Document id is required.");
  if (!document.slug.trim()) errors.push("Document slug is required.");
  if (!document.title.trim()) errors.push("Document title is required.");
  if (!document.author.trim()) errors.push("Document author is required.");
  if (!document.objective.trim()) {
    errors.push("Document objective is required.");
  }
  if (!document.summary.trim()) {
    errors.push("Document summary is required.");
  }
  if (!document.manuscript.trim()) {
    errors.push("Document manuscript is required.");
  }

  if (!includesValue(CONTENT_TYPES, document.contentType)) {
    errors.push(`Invalid content type: ${document.contentType}`);
  }

  if (!includesValue(MESSAGE_LENGTHS, document.messageLength)) {
    errors.push(`Invalid message length: ${document.messageLength}`);
  }

  if (!includesValue(DOCUMENT_FORMATS, document.format)) {
    errors.push(`Invalid document format: ${document.format}`);
  }

  if (!includesValue(PUBLICATION_STATUSES, document.status)) {
    errors.push(`Invalid publication status: ${document.status}`);
  }

  if (!includesValue(VISIBILITY_LEVELS, document.visibility)) {
    errors.push(`Invalid visibility level: ${document.visibility}`);
  }

  if (!includesValue(TESTAMENTS, document.testament)) {
    errors.push(`Invalid testament: ${document.testament}`);
  }

  if (!document.primaryScripture.reference.trim()) {
    errors.push("Primary Scripture reference is required.");
  }

  if (
    !document.scriptureReferences.some(
      (reference) =>
        reference.reference ===
        document.primaryScripture.reference,
    )
  ) {
    errors.push(
      "The primary Scripture must also appear in scriptureReferences.",
    );
  }

  return errors;
}

export function isLibraryDocument(
  value: unknown,
): value is LibraryDocument {
  if (!value || typeof value !== "object") return false;

  const candidate = value as Partial<LibraryDocument>;

  return (
    typeof candidate.id === "string" &&
    typeof candidate.slug === "string" &&
    typeof candidate.title === "string" &&
    typeof candidate.author === "string" &&
    typeof candidate.manuscript === "string" &&
    Array.isArray(candidate.scriptureReferences) &&
    Array.isArray(candidate.topics) &&
    Array.isArray(candidate.keywords)
  );
}

export function assertValidLibraryDocument(
  document: LibraryDocument,
): void {
  const errors = validateLibraryDocument(document);

  if (errors.length > 0) {
    throw new Error(
      `Invalid library document:\n- ${errors.join("\n- ")}`,
    );
  }
}
