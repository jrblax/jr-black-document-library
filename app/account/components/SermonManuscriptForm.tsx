"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";

import {
  type ManuscriptActionState,
  updateSermonManuscript,
} from "@/app/account/actions/update-sermon-manuscript";

type SermonManuscriptFormProps = {
  initialBody: string;
  sermonId: string;
};

const initialState: ManuscriptActionState = {
  status: "idle",
  message: "",
};

function SaveManuscriptButton() {
  const { pending } = useFormStatus();

  return (
    <button
      className="rounded-lg bg-slate-900 px-6 py-3 font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:bg-slate-500"
      disabled={pending}
      type="submit"
    >
      {pending ? "Saving Manuscript…" : "Save Manuscript"}
    </button>
  );
}

export function SermonManuscriptForm({
  initialBody,
  sermonId,
}: SermonManuscriptFormProps) {
  const [state, formAction] = useActionState(
    updateSermonManuscript,
    initialState,
  );
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  function handleSubmit(formData: FormData) {
    setHasUnsavedChanges(false);
    formAction(formData);
  }

  return (
    <form action={handleSubmit}>
      <input name="sermonId" type="hidden" value={sermonId} />

      <label
        className="block text-sm font-semibold text-slate-500"
        htmlFor="manuscript"
      >
        Sermon Manuscript
      </label>

      <textarea
        className="mt-3 min-h-96 w-full rounded-xl border border-stone-300 bg-stone-50 p-6 leading-7 text-slate-900 outline-none transition focus:border-amber-700 focus:bg-white focus:ring-2 focus:ring-amber-100"
        defaultValue={initialBody}
        id="manuscript"
        maxLength={100_000}
        name="manuscript"
        onChange={() => setHasUnsavedChanges(true)}
        placeholder="Begin writing your sermon manuscript…"
      />

      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        <SaveManuscriptButton />

        <p
          aria-live="polite"
          className={
            state.status === "error" ? "text-sm text-red-700" : "text-sm text-slate-600"
          }
        >
          {hasUnsavedChanges ? "Unsaved changes" : state.message}
        </p>
      </div>
    </form>
  );
}
