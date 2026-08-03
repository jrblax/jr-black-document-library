import { notFound } from "next/navigation";
import { bibleBooks } from "../../../lib/bible";

type PageProps = {
  params: Promise<{
    book: string;
  }>;
};

export default async function BookPage({ params }: PageProps) {
  const { book } = await params;

  const bibleBook = bibleBooks.find(
    (b) => b.id.toLowerCase() === book.toLowerCase()
  );

  if (!bibleBook) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-white px-6 py-12">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-5xl font-bold">
          {bibleBook.name}
        </h1>

        <p className="mt-4 text-xl text-slate-700">
          {bibleBook.testament}
        </p>

        <p className="mt-2 text-lg text-slate-600">
          {bibleBook.chapters} Chapters
        </p>
      </div>
    </main>
  );
}