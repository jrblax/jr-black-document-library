"use client";

import Link from "next/link";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";

import {
  type RestoreVersionActionState,
  restoreSermonVersion,
} from "@/app/account/actions/restore-sermon-version";

export type SermonVersionSummary = {
  id: string;
  authorName: string;
  changeNote: string | null;
  createdAt: string;
  title: string;
  versionNumber: number;
};

type SermonVersionHistoryProps = {
  currentVersionId: string | null;
  hasUnsavedChanges?: boolean;
  historyHref?: string;
  sermonId: string;
  totalVersions: number;
  versions: SermonVersionSummary[];
};

const initialState: RestoreVersionActionState = {
  status: "idle",
  message: "",
};

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  dateStyle: "medium",
  timeStyle: "short",
  timeZone: "America/Chicago",
});

function RestoreVersionButton({ disabled }: { disabled: boolean }) {
  const { pending } = useFormStatus();

  return (
    <button
      className="rounded-lg border border-amber-700 px-4 py-2 text-sm font-semibold text-amber-800 transition hover:bg-amber-50 disabled:cursor-not-allowed disabled:border-stone-300 disabled:text-stone-400"
      disabled={disabled || pending}
      title={disabled ? "Save manuscript changes before restoring" : undefined}
      type="submit"
    >
      {pending ? "Restoring…" : "Restore"}
    </button>
  );
}

export function SermonVersionHistory({
  currentVersionId,
  hasUnsavedChanges = false,
  historyHref,
  sermonId,
  totalVersions,
  versions,
}: SermonVersionHistoryProps) {
  const [state, formAction] = useActionState(
    restoreSermonVersion,
    initialState,
  );

  return (
    <section className="border-t border-stone-200 pt-8">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
        <div>
          <h2 className="text-2xl font-bold">Version History</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Preview earlier snapshots or restore one as a new version. Existing
            history is never overwritten.
          </p>
          {hasUnsavedChanges && (
            <p className="mt-2 text-sm font-semibold text-amber-800">
              Save your manuscript changes before restoring a version.
            </p>
          )}
        </div>

        <p
          aria-live="polite"
          className={
            state.status === "error"
              ? "text-sm text-red-700"
              : "text-sm text-slate-600"
          }
        >
          {state.message}
        </p>
      </div>

      <ol className="mt-6 divide-y divide-stone-200 rounded-xl border border-stone-200">
        {versions.map((version) => {
          const isCurrent = version.id === currentVersionId;

          return (
            <li
              className="flex flex-col justify-between gap-4 p-5 sm:flex-row sm:items-center"
              key={version.id}
            >
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-bold">
                    Version {version.versionNumber}
                  </h3>
                  {isCurrent && (
                    <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-800">
                      Current
                    </span>
                  )}
                </div>

                <p className="mt-1 text-sm text-slate-600">{version.title}</p>
                <p className="mt-1 text-xs text-slate-500">
                  {version.authorName} ·{" "}
                  {dateFormatter.format(new Date(version.createdAt))}
                </p>
                {version.changeNote && (
                  <p className="mt-2 text-sm text-slate-500">
                    {version.changeNote}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-3">
                <Link
                  className="rounded-lg bg-stone-100 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-stone-200"
                  href={`/account/sermons/${sermonId}/versions/${version.id}`}
                >
                  Preview
                </Link>

                {!isCurrent && (
                  <form
                    action={formAction}
                    onSubmit={(event) => {
                      if (
                        !window.confirm(
                          `Restore version ${version.versionNumber}? Your current saved title and manuscript will be preserved in history.`,
                        )
                      ) {
                        event.preventDefault();
                      }
                    }}
                  >
                    <input name="sermonId" type="hidden" value={sermonId} />
                    <input name="versionId" type="hidden" value={version.id} />
                    <RestoreVersionButton disabled={hasUnsavedChanges} />
                  </form>
                )}
              </div>
            </li>
          );
        })}
      </ol>

      {historyHref && totalVersions > versions.length && (
        <Link
          className="mt-5 inline-block text-sm font-semibold text-amber-800 hover:underline"
          href={historyHref}
        >
          View all {totalVersions} versions
        </Link>
      )}
    </section>
  );
}
