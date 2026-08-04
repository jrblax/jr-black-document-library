"use client";

import { useState } from "react";

import { SermonManuscriptForm } from "@/app/account/components/SermonManuscriptForm";
import {
  type SermonVersionSummary,
  SermonVersionHistory,
} from "@/app/account/components/SermonVersionHistory";

type SermonEditorWorkspaceProps = {
  currentVersionId: string | null;
  initialBody: string;
  sermonId: string;
  totalVersions: number;
  versions: SermonVersionSummary[];
};

export function SermonEditorWorkspace({
  currentVersionId,
  initialBody,
  sermonId,
  totalVersions,
  versions,
}: SermonEditorWorkspaceProps) {
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  return (
    <>
      <SermonManuscriptForm
        initialBody={initialBody}
        onDirtyChange={setHasUnsavedChanges}
        sermonId={sermonId}
      />

      <SermonVersionHistory
        currentVersionId={currentVersionId}
        hasUnsavedChanges={hasUnsavedChanges}
        historyHref={`/account/sermons/${sermonId}/versions`}
        sermonId={sermonId}
        totalVersions={totalVersions}
        versions={versions}
      />
    </>
  );
}
