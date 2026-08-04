import Link from "next/link";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { createSermon } from "@/app/account/actions/create-sermon";
import { CreateSermonButton } from "@/app/account/components/CreateSermonButton";
import { auth } from "@/lib/auth";
import {
  ContentStatus,
  ContentType,
} from "@/lib/generated/prisma/client";
import { prisma } from "@/lib/prisma";

export default async function AccountPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }

  const [recentSermons, totalSermons, draftCount, publishedCount] =
    await Promise.all([
      prisma.content.findMany({
        where: {
          ownerId: session.user.id,
          type: ContentType.SERMON,
        },
        orderBy: {
          updatedAt: "desc",
        },
        take: 8,
      }),
      prisma.content.count({
        where: {
          ownerId: session.user.id,
          type: ContentType.SERMON,
        },
      }),
      prisma.content.count({
        where: {
          ownerId: session.user.id,
          type: ContentType.SERMON,
          status: ContentStatus.DRAFT,
        },
      }),
      prisma.content.count({
        where: {
          ownerId: session.user.id,
          type: ContentType.SERMON,
          status: ContentStatus.PUBLISHED,
        },
      }),
    ]);

  return (
    <main className="min-h-screen bg-stone-50 px-6 py-14 text-slate-900">
      <section className="mx-auto max-w-6xl">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-700">
              Treasury of Truth
            </p>

            <h1 className="mt-3 text-4xl font-bold">
              Welcome, {session.user.name}
            </h1>

            <p className="mt-3 max-w-2xl leading-7 text-slate-600">
              Create, preserve, organize, and develop your ministry materials
              in your private library.
            </p>
          </div>

          <form action={createSermon}>
            <CreateSermonButton idleLabel="+ New Sermon" />
          </form>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-3">
          <article className="rounded-xl border border-stone-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
              Sermons
            </p>
            <p className="mt-3 text-4xl font-bold">{totalSermons}</p>
          </article>

          <article className="rounded-xl border border-stone-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
              Drafts
            </p>
            <p className="mt-3 text-4xl font-bold">{draftCount}</p>
          </article>

          <article className="rounded-xl border border-stone-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
              Published
            </p>
            <p className="mt-3 text-4xl font-bold">{publishedCount}</p>
          </article>
        </div>

        <section className="mt-12">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Recent Content</h2>

            <Link
              className="text-sm font-semibold text-amber-800 hover:underline"
              href="/sermons"
            >
              View Public Sermons
            </Link>
          </div>

          {recentSermons.length === 0 ? (
            <div className="mt-6 rounded-xl border border-dashed border-stone-300 bg-white px-6 py-14 text-center">
              <h3 className="text-xl font-bold">Your library is empty</h3>

              <p className="mx-auto mt-3 max-w-xl leading-7 text-slate-600">
                Create your first private sermon draft. It will be stored in
                PostgreSQL and associated with your account.
              </p>

              <form action={createSermon} className="mt-6">
                <CreateSermonButton idleLabel="Create First Sermon" />
              </form>
            </div>
          ) : (
            <div className="mt-6 overflow-hidden rounded-xl border border-stone-200 bg-white shadow-sm">
              <ul className="divide-y divide-stone-200">
                {recentSermons.map((item) => (
                  <li key={item.id}>
                    <Link
                      className="flex flex-col justify-between gap-3 px-6 py-5 transition hover:bg-stone-50 sm:flex-row sm:items-center"
                      href={`/account/sermons/${item.id}`}
                    >
                      <div>
                        <h3 className="font-bold">{item.title}</h3>

                        <p className="mt-1 text-sm text-slate-500">
                          {item.primaryScripture || "No Scripture selected"}
                        </p>
                      </div>

                      <div className="flex items-center gap-4 text-sm">
                        <span className="rounded-full bg-stone-100 px-3 py-1 font-semibold text-slate-600">
                          {item.status.replaceAll("_", " ")}
                        </span>

                        <span className="text-slate-500">
                          {item.updatedAt.toLocaleDateString()}
                        </span>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>
      </section>
    </main>
  );
}
