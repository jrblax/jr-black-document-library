import Link from "next/link";
import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";

import { SermonVersionHistory } from "@/app/account/components/SermonVersionHistory";
import { auth } from "@/lib/auth";
import { ContentType } from "@/lib/generated/prisma/client";
import { prisma } from "@/lib/prisma";

const VERSION_PAGE_SIZE = 25;

type FullVersionHistoryPageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ page?: string }>;
};

export default async function FullVersionHistoryPage({
  params,
  searchParams,
}: FullVersionHistoryPageProps) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }

  const { id } = await params;
  const requestedPage = Number.parseInt((await searchParams).page ?? "1", 10);
  const page =
    Number.isSafeInteger(requestedPage) && requestedPage > 0
      ? requestedPage
      : 1;

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
        skip: (page - 1) * VERSION_PAGE_SIZE,
        take: VERSION_PAGE_SIZE,
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

  const totalPages = Math.max(
    1,
    Math.ceil(sermon._count.versions / VERSION_PAGE_SIZE),
  );

  if (page > totalPages) {
    redirect(`/account/sermons/${sermon.id}/versions?page=${totalPages}`);
  }

  const currentVersion = await prisma.contentVersion.findFirst({
    where: {
      contentId: sermon.id,
    },
    orderBy: {
      versionNumber: "desc",
    },
    select: {
      id: true,
    },
  });

  return (
    <main className="min-h-screen bg-stone-50 px-6 py-12 text-slate-900">
      <section className="mx-auto max-w-5xl">
        <Link
          className="text-sm font-semibold text-amber-800 hover:underline"
          href={`/account/sermons/${sermon.id}`}
        >
          ← Back to Sermon Editor
        </Link>

        <div className="mt-6 rounded-2xl border border-stone-200 bg-white p-8 shadow-sm">
          <SermonVersionHistory
            currentVersionId={currentVersion?.id ?? null}
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

          <nav
            aria-label="Version history pages"
            className="mt-8 flex items-center justify-between border-t border-stone-200 pt-6"
          >
            {page > 1 ? (
              <Link
                className="font-semibold text-amber-800 hover:underline"
                href={`/account/sermons/${sermon.id}/versions?page=${page - 1}`}
              >
                ← Newer versions
              </Link>
            ) : (
              <span />
            )}

            <span className="text-sm text-slate-500">
              Page {page} of {totalPages}
            </span>

            {page < totalPages ? (
              <Link
                className="font-semibold text-amber-800 hover:underline"
                href={`/account/sermons/${sermon.id}/versions?page=${page + 1}`}
              >
                Older versions →
              </Link>
            ) : (
              <span />
            )}
          </nav>
        </div>
      </section>
    </main>
  );
}
