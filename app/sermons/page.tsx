import SermonCard from "@/app/components/SermonCard";
import { sermons } from "@/lib/sermons";

export default function SermonsPage() {
  return (
    <main className="mx-auto w-full max-w-5xl p-8">
      <section className="py-8 text-center">
        <h1 className="text-4xl font-bold">Sermon Library</h1>
        <p className="mt-4 text-gray-500 dark:text-gray-400">
          Browse messages from J. R. Black Ministries.
        </p>
      </section>
      <section className="grid gap-6">
        {sermons.map((sermon) => (
          <SermonCard key={sermon.slug} sermon={sermon} />
        ))}
      </section>
    </main>
  );
}
