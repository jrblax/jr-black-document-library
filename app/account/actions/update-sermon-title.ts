"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";
import { ContentType } from "@/lib/generated/prisma/client";
import { prisma } from "@/lib/prisma";

export async function updateSermonTitle(formData: FormData) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }

  const sermonId = formData.get("sermonId");
  const title = formData.get("title");

  if (typeof sermonId !== "string" || typeof title !== "string") {
    throw new Error("Invalid sermon title submission.");
  }

  const cleanTitle = title.trim();

  if (!cleanTitle) {
    throw new Error("The sermon title cannot be empty.");
  }

  if (cleanTitle.length > 200) {
    throw new Error("The sermon title must be 200 characters or fewer.");
  }

  const sermon = await prisma.$transaction(async (transaction) => {
    const existingSermon = await transaction.content.findFirst({
      where: {
        id: sermonId,
        ownerId: session.user.id,
        type: ContentType.SERMON,
      },
    });

    if (!existingSermon) {
      throw new Error("Sermon not found.");
    }

    if (existingSermon.title === cleanTitle) {
      return existingSermon;
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

    const updatedSermon = await transaction.content.update({
      where: {
        id: existingSermon.id,
      },
      data: {
        title: cleanTitle,
      },
    });

    await transaction.contentVersion.create({
      data: {
        contentId: existingSermon.id,
        authorId: session.user.id,
        versionNumber: (latestVersion?.versionNumber ?? 0) + 1,
        title: cleanTitle,
        subtitle: existingSermon.subtitle,
        body: existingSermon.currentBody ?? "",
        changeNote: "Updated sermon title",
      },
    });

    return updatedSermon;
  });

  revalidatePath(`/account/sermons/${sermon.id}`);
  revalidatePath("/account");
}
