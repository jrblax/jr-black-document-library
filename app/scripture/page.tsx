import Link from "next/link";
import { bibleBooks } from "../../lib/bible";

export default function ScripturePage() {
  const oldTestament = bibleBooks.filter(
    (book) => book.testament === "Old Testament"
  );

  const newTestament = bibleBooks.filter(
    (book) => book.testament === "New Testament"
  );

  return (
    <main className="min-h-screen bg-stone-50 px-6 py-12">
      <div className="mx-auto max-w-6xl">

        <header className="mb-12 text-center">
          <h1 className="text-5xl font-bold">
            Open the Scriptures
          </h1>

          <p className="mt-4 text-lg text-slate-600">
            Treasury of Truth
          </p>
        </header>

        <div className="grid gap-10 md:grid-cols-2">

          <section>
            <h2 className="mb-4 text-2xl font-semibold">
              Old Testament
            </h2>

            <div className="space-y-2">
              {oldTestament.map((book) => (
                <Link
                  key={book.id}
                  href="#"
                  className="block rounded border p-3 hover:bg-stone-100"
                >
                  {book.name}
                </Link>
              ))}
            </div>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold">
              New Testament
            </h2>

            <div className="space-y-2">
              {newTestament.map((book) => (
                <Link
                  key={book.id}
                  href="#"
                  className="block rounded border p-3 hover:bg-stone-100"
                >
                  {book.name}
                </Link>
              ))}
            </div>
          </section>

        </div>
      </div>
    </main>
  );
}