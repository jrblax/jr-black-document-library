import Link from "next/link";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";

export default async function AccountPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }

  return (
    <main className="min-h-screen bg-stone-50 px-6 py-16 text-slate-900">
      <section className="mx-auto max-w-5xl">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-700">
          Treasury of Truth
        </p>

        <h1 className="mt-3 text-4xl font-bold">
          Welcome, {session.user.name}
        </h1>

        <p className="mt-4 max-w-2xl leading-7 text-slate-600">
          Your private library will contain your sermons, lessons, notes,
          documents, version history, and AI-assisted drafts.
        </p>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          <article className="rounded-xl border border-stone-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold">My Sermons</h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              Create, edit, organize, and preserve your sermon manuscripts.
            </p>
            <Link
              className="mt-5 inline-block font-semibold text-amber-800 hover:underline"
              href="/sermons"
            >
              View Sermons
            </Link>
          </article>

          <article className="rounded-xl border border-stone-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold">My Documents</h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              Maintain lessons, articles, research, notes, and ministry records.
            </p>
            <Link
              className="mt-5 inline-block font-semibold text-amber-800 hover:underline"
              href="/documents"
            >
              View Documents
            </Link>
          </article>

          <article className="rounded-xl border border-stone-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold">Sermon Builder</h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              AI-assisted sermon creation will be added after the private
              library workflow is complete.
            </p>
            <span className="mt-5 inline-block text-sm font-semibold text-slate-500">
              Coming Soon
            </span>
          </article>
        </div>
      </section>
    </main>
  );
}
