"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";
import { ContentType, Prisma } from "@/lib/generated/prisma/client";
import { prisma } from "@/lib/prisma";

const MAX_RESTORE_ATTEMPTS = 3;

export type RestoreVersionActionState = {
  status: "idle" | "success" | "error";
  message: string;
};

function isRetryableVersionConflict(error: unknown): boolean {
  return (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    (error.code === "P2002" || error.code === "P2034")
  );
}

async function restoreVersion({
  authorId,
  sermonId,
  versionId,
}: {
  authorId: string;
  sermonId: string;
  versionId: string;
}) {
  for (let attempt = 1; attempt <= MAX_RESTORE_ATTEMPTS; attempt += 1) {
    try {
      return await prisma.$transaction(
        async (transaction) => {
          const sermon = await transaction.content.findFirst({
            where: {
              id: sermonId,
              ownerId: authorId,
              type: ContentType.SERMON,
            },
          });

          if (!sermon) {
            return { status: "not-found" as const };
          }

          const sourceVersion = await transaction.contentVersion.findFirst({
            where: {
              id: versionId,
              contentId: sermon.id,
            },
          });

          if (!sourceVersion) {
            return { status: "version-not-found" as const };
          }

          const currentBody = sermon.currentBody ?? "";
          const currentSubtitle = sermon.subtitle ?? null;

          if (
            sermon.title === sourceVersion.title &&
            currentSubtitle === sourceVersion.subtitle &&
            currentBody === sourceVersion.body
          ) {
            return {
              status: "unchanged" as const,
              versionNumber: sourceVersion.versionNumber,
            };
          }

          const latestVersion = await transaction.contentVersion.findFirst({
            where: {
              contentId: sermon.id,
            },
            orderBy: {
              versionNumber: "desc",
            },
            select: {
              versionNumber: true,
            },
          });

          const nextVersionNumber = (latestVersion?.versionNumber ?? 0) + 1;

          await transaction.content.update({
            where: {
              id: sermon.id,
            },
            data: {
              currentBody: sourceVersion.body,
              subtitle: sourceVersion.subtitle,
              title: sourceVersion.title,
            },
          });

          await transaction.contentVersion.create({
            data: {
              contentId: sermon.id,
              authorId,
              versionNumber: nextVersionNumber,
              title: sourceVersion.title,
              subtitle: sourceVersion.subtitle,
              body: sourceVersion.body,
              changeNote: `Restored from version ${sourceVersion.versionNumber}`,
            },
          });

          return {
            status: "restored" as const,
            sourceVersionNumber: sourceVersion.versionNumber,
            versionNumber: nextVersionNumber,
          };
        },
        {
          isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
        },
      );
    } catch (error) {
      if (!isRetryableVersionConflict(error)) {
        throw error;
      }

      if (attempt === MAX_RESTORE_ATTEMPTS) {
        return { status: "conflict" as const };
      }
    }
  }

  return { status: "conflict" as const };
}

export async function restoreSermonVersion(
  _previousState: RestoreVersionActionState,
  formData: FormData,
): Promise<RestoreVersionActionState> {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }

  const sermonId = formData.get("sermonId");
  const versionId = formData.get("versionId");

  if (typeof sermonId !== "string" || typeof versionId !== "string") {
    return {
      status: "error",
      message: "The version restore request was invalid.",
    };
  }

  const result = await restoreVersion({
    authorId: session.user.id,
    sermonId,
    versionId,
  });

  if (result.status === "not-found") {
    return { status: "error", message: "The sermon could not be found." };
  }

  if (result.status === "version-not-found") {
    return { status: "error", message: "The selected version was not found." };
  }

  if (result.status === "unchanged") {
    return {
      status: "success",
      message: `Version ${result.versionNumber} already matches the current sermon.`,
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
  revalidatePath(`/account/sermons/${sermonId}/versions`);
  revalidatePath("/account");

  return {
    status: "success",
    message: `Version ${result.sourceVersionNumber} was restored as new version ${result.versionNumber}.`,
  };
}
