import Link from "next/link";
import type { LibraryDocument } from "@/lib/documents";

type DocumentCardProps = {
  document: LibraryDocument;
};

export default function DocumentCard({ document }: DocumentCardProps) {
  return (
    <article className="border rounded-lg p-6">
      <p className="text-sm text-gray-400">{document.category}</p>

      <h2 className="text-2xl font-bold mt-2">{document.title}</h2>

      <p className="text-lg mt-1">{document.subtitle}</p>

      <p className="text-sm text-gray-400 mt-2">
        Scripture: {document.scripture}
      </p>

      <p className="mt-4">{document.summary}</p>

      <Link
        className="mt-5 inline-block rounded bg-blue-600 px-5 py-2 text-white transition-colors hover:bg-blue-700"
        href={`/documents/${document.slug}`}
      >
        Read More
      </Link>
    </article>
  );
}
