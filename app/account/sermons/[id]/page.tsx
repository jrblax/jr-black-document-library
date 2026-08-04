import Link from "next/link";
import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";

import { updateSermonTitle } from "@/app/account/actions/update-sermon-title";
import { SermonEditorWorkspace } from "@/app/account/components/SermonEditorWorkspace";
import { auth } from "@/lib/auth";
import { ContentType } from "@/lib/generated/prisma/client";
import { prisma } from "@/lib/prisma";

type SermonEditorPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function SermonEditorPage({
  params,
}: SermonEditorPageProps) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }

  const { id } = await params;

  const sermon = await prisma.content.findFirst({
    where: {
      id,
      ownerId: session.user.id,
      type: ContentType.SERMON,
    },
    include: {
      versions: {
        orderBy: {
          versionNumber: "desc",
        },
        select: {
          id: true,
          changeNote: true,
          createdAt: true,
          title: true,
          versionNumber: true,
          author: {
            select: {
              name: true,
            },
          },
        },
        take: 25,
      },
      _count: {
        select: {
          versions: true,
        },
      },
    },
  });

  if (!sermon) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-stone-50 px-6 py-12 text-slate-900">
      <section className="mx-auto max-w-5xl">
        <Link
          className="text-sm font-semibold text-amber-800 hover:underline"
          href="/account"
        >
          ← Back to My Library
        </Link>

        <div className="mt-6 rounded-2xl border border-stone-200 bg-white p-8 shadow-sm">
          <div className="flex flex-col justify-between gap-4 border-b border-stone-200 pb-6 sm:flex-row sm:items-start">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-700">
                Sermon Draft
              </p>

              <h1 className="mt-3 text-3xl font-bold">{sermon.title}</h1>

              <p className="mt-2 text-sm text-slate-500">
                {sermon.sermonLength?.replace("_", "-") || "Custom Length"}
              </p>
            </div>

            <span className="self-start rounded-full bg-amber-50 px-4 py-2 text-sm font-semibold text-amber-800">
              {sermon.status.replaceAll("_", " ")}
            </span>
          </div>

          <div className="mt-8 grid gap-8">
            <form action={updateSermonTitle}>
              <input name="sermonId" type="hidden" value={sermon.id} />

              <label
                className="block text-sm font-semibold text-slate-600"
                htmlFor="title"
              >
                Title
              </label>

              <div className="mt-2 flex flex-col gap-3 sm:flex-row">
                <input
                  className="w-full rounded-lg border border-stone-300 px-4 py-3 text-lg outline-none transition focus:border-amber-700 focus:ring-2 focus:ring-amber-100"
                  defaultValue={sermon.title}
                  id="title"
                  maxLength={200}
                  name="title"
                  required
                  type="text"
                />

                <button
                  className="rounded-lg bg-slate-900 px-6 py-3 font-semibold text-white transition hover:bg-slate-700"
                  type="submit"
                >
                  Save Title
                </button>
              </div>
            </form>

            <div>
              <p className="text-sm font-semibold text-slate-500">
                Primary Scripture
              </p>

              <p className="mt-2">
                {sermon.primaryScripture || "Not selected"}
              </p>
            </div>

            <SermonEditorWorkspace
              currentVersionId={sermon.versions[0]?.id ?? null}
              initialBody={sermon.currentBody ?? ""}
              sermonId={sermon.id}
              totalVersions={sermon._count.versions}
              versions={sermon.versions.map((version) => ({
                id: version.id,
                authorName: version.author.name,
                changeNote: version.changeNote,
                createdAt: version.createdAt.toISOString(),
                title: version.title,
                versionNumber: version.versionNumber,
              }))}
            />
          </div>
        </div>
      </section>
    </main>
  );
}
