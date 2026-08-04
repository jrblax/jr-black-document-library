"use client";

import { useFormStatus } from "react-dom";

type CreateSermonButtonProps = {
  idleLabel: string;
};

export function CreateSermonButton({
  idleLabel,
}: CreateSermonButtonProps) {
  const { pending } = useFormStatus();

  return (
    <button
      aria-disabled={pending}
      className="rounded-lg bg-slate-900 px-6 py-3 font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:bg-slate-500"
      disabled={pending}
      type="submit"
    >
      {pending ? "Creating Sermon…" : idleLabel}
    </button>
  );
}
