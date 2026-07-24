import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { documents, getDocumentBySlug } from "@/lib/documents";

type DocumentPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return documents.map((document) => ({ slug: document.slug }));
}

export async function generateMetadata({
  params,
}: DocumentPageProps): Promise<Metadata> {
  const { slug } = await params;
  const document = getDocumentBySlug(slug);

  if (!document) {
    return { title: "Document Not Found" };
  }

  return {
    title: `${document.title} | J. R. Black Document Library`,
    description: document.summary,
  };
}

export default async function DocumentPage({ params }: DocumentPageProps) {
  const { slug } = await params;
  const document = getDocumentBySlug(slug);

  if (!document) {
    notFound();
  }

  return (
    <main className="mx-auto w-full max-w-3xl p-8">
      <Link
        className="text-sm text-blue-600 hover:underline"
        href="/documents"
      >
        ← Back to Document Library
      </Link>

      <article className="mt-8">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {document.category}
        </p>
        <h1 className="mt-2 text-4xl font-bold">{document.title}</h1>
        <p className="mt-3 text-xl">{document.subtitle}</p>

        <section className="mt-8 rounded-lg border border-gray-200 p-6 dark:border-gray-800">
          <h2 className="text-xl font-semibold">{document.scripture}</h2>
          <p className="mt-4">{document.summary}</p>
        </section>
      </article>
    </main>
  );
}
