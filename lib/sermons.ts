import { createLibraryDocument } from "./content";
import type { LibraryDocument } from "./content-schema";

export type Sermon = LibraryDocument;

export const sermons: Sermon[] = [
  createLibraryDocument({
    id: "sermon-faithful-over-a-few-things",
    slug: "faithful-over-a-few-things",

    title: "Faithful Over a Few Things",
    subtitle:
      "Small Responsibilities Prepare Us for Greater Things",
    author: "J. R. Black",

    contentType: "sermon",
    messageLength: "black-30",
    format: "plain-text",

    primaryScripture: {
      reference: "Matthew 25:21",
      book: "Matthew",
      chapter: 25,
      verseStart: 21,
      verseEnd: 21,
      testament: "new",
      isPrimary: true,
      translation: "KJV",
    },

    scriptureReferences: [
      {
        reference: "Matthew 25:21",
        book: "Matthew",
        chapter: 25,
        verseStart: 21,
        verseEnd: 21,
        testament: "new",
        isPrimary: true,
        translation: "KJV",
      },
    ],

    testament: "new",
    bibleBooks: ["Matthew"],
    chapters: [25],

    topics: [
      {
        id: "topic-faithfulness",
        name: "Faithfulness",
        slug: "faithfulness",
      },
      {
        id: "topic-stewardship",
        name: "Stewardship",
        slug: "stewardship",
      },
      {
        id: "topic-service",
        name: "Service",
        slug: "service",
      },
    ],

    doctrinalThemes: [
      {
        id: "doctrine-christian-stewardship",
        name: "Christian Stewardship",
        slug: "christian-stewardship",
        summary:
          "The believer’s responsibility to faithfully manage every trust, opportunity, and ability received from God.",
      },
      {
        id: "doctrine-faithful-service",
        name: "Faithful Service",
        slug: "faithful-service",
        summary:
          "Consistent obedience and service to Jesus Christ in both small and great responsibilities.",
      },
    ],

    objective:
      "To encourage believers to remain faithful in small responsibilities, knowing that God values consistency, stewardship, and obedience.",

    summary:
      "A sermon on stewardship, faithfulness, and the reward of serving God well in small responsibilities.",

    /*
     * The complete sermon manuscript will be inserted during
     * manuscript migration. The document remains a draft until
     * that work is completed.
     */
    manuscript: "",

    keywords: [
      "faithful over a few things",
      "faithfulness",
      "stewardship",
      "service",
      "responsibility",
      "obedience",
      "reward",
      "Matthew 25",
      "Matthew 25:21",
    ],

    relatedDocuments: [],

    status: "draft",
    visibility: "private",
    featured: false,

    createdAt: "2026-08-03T16:00:00.000Z",
    updatedAt: "2026-08-03T16:00:00.000Z",

    preachingHistory: [],

    version: "1.0.0",

        versionHistory: [
      {
        version: "1.0.0",
        createdAt: "2026-08-03T16:00:00.000Z",
        createdBy: "J. R. Black",
        summary:
          "Initial migration from the original sermon record into the Treasury of Truth master content schema.",
      },
    ],

    downloads: {
      allowPrint: true,
      allowPdf: true,
      allowMarkdown: false,
    },
  }),
];

export function getSermonBySlug(
  slug: string,
): Sermon | undefined {
  return sermons.find((sermon) => sermon.slug === slug);
}