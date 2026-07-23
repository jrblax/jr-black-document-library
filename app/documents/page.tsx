import { documents } from "../../lib/documents";
import DocumentCard from "../components/DocumentCard";
export default function DocumentsPage() {
  return (
    <main className="max-w-5xl mx-auto p-8">
      <section className="text-center py-8">
        <h1 className="text-4xl font-bold">Document Library</h1>
        <p className="mt-4 text-gray-400">
          Browse sermons, lessons, Bible studies, and ministry resources.
        </p>
      </section>
      <section className="grid gap-6">
        {documents.map((document) => (
          <DocumentCard key={document.title} document={document} />
        ))}
      </section>
    </main>
  );
}