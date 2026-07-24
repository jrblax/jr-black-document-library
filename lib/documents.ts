export type LibraryDocument = {
  slug: string;
  title: string;
  subtitle: string;
  category: string;
  scripture: string;
  summary: string;
};

export const documents: LibraryDocument[] = [
  {
    slug: "philippians-4-11-13",
    title: "Philippians 4:11-13",
    subtitle: "Learning Contentment in Every Season",
    category: "Black-30",
    scripture: "Philippians 4:11-13",
    summary:
      "A message about finding strength in Christ regardless of circumstances.",
  },
  {
    slug: "the-prince-of-persia",
    title: "The Prince of Persia",
    subtitle: "Spiritual Resistance and Prayer",
    category: "Black-30",
    scripture: "Daniel 10",
    summary:
      "A lesson on unseen spiritual conflict and the importance of persistent prayer.",
  },
  {
    slug: "a-father-to-the-fatherless",
    title: "A Father to the Fatherless",
    subtitle: "God's Care for the Forgotten",
    category: "Black-30",
    scripture: "Psalm 68:5",
    summary:
      "A message declaring God's compassion toward the lonely, wounded, and overlooked.",
  },
];

export function getDocumentBySlug(slug: string) {
  return documents.find((document) => document.slug === slug);
}
