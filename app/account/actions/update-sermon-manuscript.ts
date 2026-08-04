"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";
import { ContentType, Prisma } from "@/lib/generated/prisma/client";
import { prisma } from "@/lib/prisma";

const MAX_MANUSCRIPT_LENGTH = 100_000;
const MAX_VERSION_SAVE_ATTEMPTS = 3;

export type ManuscriptActionState = {
  status: "idle" | "success" | "error";
  message: string;
};

function isRetryableVersionConflict(error: unknown): boolean {
  return (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    (error.code === "P2002" || error.code === "P2034")
  );
}

async function saveManuscriptVersion({
  authorId,
  manuscript,
  sermonId,
}: {
  authorId: string;
  manuscript: string;
  sermonId: string;
}) {
  for (let attempt = 1; attempt <= MAX_VERSION_SAVE_ATTEMPTS; attempt += 1) {
    try {
      return await prisma.$transaction(
        async (transaction) => {
          const existingSermon = await transaction.content.findFirst({
            where: {
              id: sermonId,
              ownerId: authorId,
              type: ContentType.SERMON,
            },
          });

          if (!existingSermon) {
            return { status: "not-found" as const };
          }

          if ((existingSermon.currentBody ?? "") === manuscript) {
            return { status: "unchanged" as const };
          }

          const latestVersion = await transaction.contentVersion.findFirst({
            where: {
              contentId: existingSermon.id,
            },
            orderBy: {
              versionNumber: "desc",
            },
            select: {
              versionNumber: true,
            },
          });

          await transaction.content.update({
            where: {
              id: existingSermon.id,
            },
            data: {
              currentBody: manuscript,
            },
          });

          await transaction.contentVersion.create({
            data: {
              contentId: existingSermon.id,
              authorId,
              versionNumber: (latestVersion?.versionNumber ?? 0) + 1,
              title: existingSermon.title,
              subtitle: existingSermon.subtitle,
              body: manuscript,
              changeNote: "Updated sermon manuscript",
            },
          });

          return { status: "saved" as const };
        },
        {
          isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
        },
      );
    } catch (error) {
      if (!isRetryableVersionConflict(error)) {
        throw error;
      }

      if (attempt === MAX_VERSION_SAVE_ATTEMPTS) {
        return { status: "conflict" as const };
      }
    }
  }

  return { status: "conflict" as const };
}

export async function updateSermonManuscript(
  _previousState: ManuscriptActionState,
  formData: FormData,
): Promise<ManuscriptActionState> {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }

  const sermonId = formData.get("sermonId");
  const manuscript = formData.get("manuscript");

  if (typeof sermonId !== "string" || typeof manuscript !== "string") {
    return {
      status: "error",
      message: "The manuscript submission was invalid.",
    };
  }

  if (manuscript.length > MAX_MANUSCRIPT_LENGTH) {
    return {
      status: "error",
      message: `The manuscript must be ${MAX_MANUSCRIPT_LENGTH.toLocaleString()} characters or fewer.`,
    };
  }

  const result = await saveManuscriptVersion({
    authorId: session.user.id,
    manuscript,
    sermonId,
  });

  if (result.status === "not-found") {
    return {
      status: "error",
      message: "The sermon could not be found.",
    };
  }

  if (result.status === "unchanged") {
    return {
      status: "success",
      message: "The manuscript is already up to date.",
    };
  }

  if (result.status === "conflict") {
    return {
      status: "error",
      message:
        "Another edit was saved at the same time. Please reload and try again.",
    };
  }

  revalidatePath(`/account/sermons/${sermonId}`);
  revalidatePath("/account");

  return {
    status: "success",
    message: "Manuscript saved as a new version.",
  };
}
