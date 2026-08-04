"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";
import {
  ContentStatus,
  ContentType,
  LibraryScope,
  SermonLength,
} from "@/lib/generated/prisma/client";
import { prisma } from "@/lib/prisma";

export async function createSermon() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }

  const timestamp = Date.now();
  const title = "Untitled Sermon";
  const slug = `untitled-sermon-${timestamp}`;

  const sermon = await prisma.$transaction(async (transaction) => {
    const content = await transaction.content.create({
      data: {
        title,
        slug,
        type: ContentType.SERMON,
        status: ContentStatus.DRAFT,
        scope: LibraryScope.PRIVATE,
        sermonLength: SermonLength.BLACK_30,
        primaryScripture: "",
        currentBody: "",
        ownerId: session.user.id,
      },
    });

    await transaction.contentVersion.create({
      data: {
        contentId: content.id,
        authorId: session.user.id,
        versionNumber: 1,
        title,
        body: "",
        changeNote: "Initial sermon draft",
      },
    });

    return content;
  });

  redirect(`/account/sermons/${sermon.id}`);
}
