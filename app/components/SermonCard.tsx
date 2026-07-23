import Link from "next/link";
import type { Sermon } from "@/lib/sermons";

type SermonCardProps = {
  sermon: Sermon;
};

export default function SermonCard({ sermon }: SermonCardProps) {
  return (
    <article className="rounded-lg border border-gray-200 p-6 dark:border-gray-800">
      <p className="text-sm text-gray-500 dark:text-gray-400">
        {sermon.category}
      </p>
      <h2 className="mt-2 text-2xl font-bold">{sermon.title}</h2>
      <p className="mt-1 text-lg">{sermon.subtitle}</p>
      <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
        Scripture: {sermon.primaryScripture}
      </p>
      <p className="mt-4">{sermon.summary}</p>
      <Link
        className="mt-5 inline-block rounded bg-blue-600 px-5 py-2 text-white transition-colors hover:bg-blue-700"
        href={`/sermons/${sermon.slug}`}
      >
        Read Sermon
      </Link>
    </article>
  );
}
