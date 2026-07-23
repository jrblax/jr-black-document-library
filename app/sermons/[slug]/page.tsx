import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getSermonBySlug, sermons } from "@/lib/sermons";

type SermonPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return sermons.map((sermon) => ({ slug: sermon.slug }));
}

export async function generateMetadata({
  params,
}: SermonPageProps): Promise<Metadata> {
  const { slug } = await params;
  const sermon = getSermonBySlug(slug);

  if (!sermon) {
    return { title: "Sermon Not Found" };
  }

  return {
    title: `${sermon.title} | J. R. Black Document Library`,
    description: sermon.summary,
  };
}

export default async function SermonPage({ params }: SermonPageProps) {
  const { slug } = await params;
  const sermon = getSermonBySlug(slug);

  if (!sermon) {
    notFound();
  }

  return (
    <main className="mx-auto w-full max-w-3xl p-8">
      <article>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {sermon.category}
        </p>
        <h1 className="mt-2 text-4xl font-bold">{sermon.title}</h1>
        <p className="mt-3 text-xl">{sermon.subtitle}</p>

        <section className="mt-8 rounded-lg border border-gray-200 p-6 dark:border-gray-800">
          <h2 className="text-xl font-semibold">
            {sermon.primaryScripture}
          </h2>
          <p className="mt-4">{sermon.summary}</p>
        </section>

        <section className="mt-8">
          <h2 className="text-2xl font-semibold">Message Objective</h2>
          <p className="mt-3">{sermon.objective}</p>
        </section>

        <section className="mt-8">
          <h2 className="text-2xl font-semibold">Topics</h2>
          <ul className="mt-3 flex flex-wrap gap-2">
            {sermon.topics.map((topic) => (
              <li
                className="rounded-full bg-gray-100 px-3 py-1 text-sm dark:bg-gray-800"
                key={topic}
              >
                {topic}
              </li>
            ))}
          </ul>
        </section>
      </article>
    </main>
  );
}
