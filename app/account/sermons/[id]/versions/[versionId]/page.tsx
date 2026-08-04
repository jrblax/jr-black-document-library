import Link from "next/link";
import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";

import { auth } from "@/lib/auth";
import { ContentType } from "@/lib/generated/prisma/client";
import { prisma } from "@/lib/prisma";

type VersionPreviewPageProps = {
  params: Promise<{
    id: string;
    versionId: string;
  }>;
};

export default async function VersionPreviewPage({
  params,
}: VersionPreviewPageProps) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }

  const { id, versionId } = await params;

  const sermon = await prisma.content.findFirst({
    where: {
      id,
      ownerId: session.user.id,
      type: ContentType.SERMON,
    },
    select: {
      id: true,
    },
  });

  if (!sermon) {
    notFound();
  }

  const version = await prisma.contentVersion.findFirst({
    where: {
      id: versionId,
      contentId: sermon.id,
    },
    include: {
      author: {
        select: {
          name: true,
        },
      },
    },
  });

  if (!version) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-stone-50 px-6 py-12 text-slate-900">
      <article className="mx-auto max-w-4xl">
        <Link
          className="text-sm font-semibold text-amber-800 hover:underline"
          href={`/account/sermons/${sermon.id}`}
        >
          ← Back to Sermon Editor
        </Link>

        <div className="mt-6 rounded-2xl border border-stone-200 bg-white p-8 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-700">
            Version {version.versionNumber} Preview
          </p>
          <h1 className="mt-3 text-3xl font-bold">{version.title}</h1>
          {version.subtitle && (
            <p className="mt-2 text-lg text-slate-600">{version.subtitle}</p>
          )}

          <p className="mt-4 text-sm text-slate-500">
            Saved by {version.author.name} on {version.createdAt.toLocaleString()}
          </p>
          {version.changeNote && (
            <p className="mt-2 text-sm text-slate-500">
              {version.changeNote}
            </p>
          )}

          <div className="mt-8 whitespace-pre-wrap rounded-xl border border-stone-200 bg-stone-50 p-6 leading-7">
            {version.body || "This version contains an empty manuscript."}
          </div>
        </div>
      </article>
    </main>
  );
}
