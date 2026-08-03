"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

import { authClient } from "@/lib/auth-client";

export default function SignupPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (password !== confirmation) {
      setError("The passwords do not match.");
      return;
    }

    if (password.length < 8) {
      setError("The password must contain at least eight characters.");
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await authClient.signUp.email({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password,
      });

      if (result.error) {
        setError(result.error.message || "The account could not be created.");
        return;
      }

      router.push("/account");
      router.refresh();
    } catch {
      setError("An unexpected error occurred while creating the account.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-stone-50 px-6 py-16 text-slate-900">
      <section className="mx-auto max-w-md rounded-2xl border border-stone-200 bg-white p-8 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-700">
          Treasury of Truth
        </p>

        <h1 className="mt-3 text-3xl font-bold">Create Your Account</h1>

        <p className="mt-3 text-sm leading-6 text-slate-600">
          Create a private account for saving sermons, lessons, notes, and
          future AI-assisted drafts.
        </p>

        <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
          <div>
            <label
              className="mb-2 block text-sm font-semibold"
              htmlFor="name"
            >
              Full Name
            </label>

            <input
              autoComplete="name"
              className="w-full rounded-lg border border-stone-300 px-4 py-3 outline-none transition focus:border-amber-700 focus:ring-2 focus:ring-amber-100"
              id="name"
              name="name"
              onChange={(event) => setName(event.target.value)}
              required
              type="text"
              value={name}
            />
          </div>

          <div>
            <label
              className="mb-2 block text-sm font-semibold"
              htmlFor="email"
            >
              Email Address
            </label>

            <input
              autoComplete="email"
              className="w-full rounded-lg border border-stone-300 px-4 py-3 outline-none transition focus:border-amber-700 focus:ring-2 focus:ring-amber-100"
              id="email"
              name="email"
              onChange={(event) => setEmail(event.target.value)}
              required
              type="email"
              value={email}
            />
          </div>

          <div>
            <label
              className="mb-2 block text-sm font-semibold"
              htmlFor="password"
            >
              Password
            </label>

            <input
              autoComplete="new-password"
              className="w-full rounded-lg border border-stone-300 px-4 py-3 outline-none transition focus:border-amber-700 focus:ring-2 focus:ring-amber-100"
              id="password"
              minLength={8}
              name="password"
              onChange={(event) => setPassword(event.target.value)}
              required
              type="password"
              value={password}
            />
          </div>

          <div>
            <label
              className="mb-2 block text-sm font-semibold"
              htmlFor="confirmation"
            >
              Confirm Password
            </label>

            <input
              autoComplete="new-password"
              className="w-full rounded-lg border border-stone-300 px-4 py-3 outline-none transition focus:border-amber-700 focus:ring-2 focus:ring-amber-100"
              id="confirmation"
              minLength={8}
              name="confirmation"
              onChange={(event) => setConfirmation(event.target.value)}
              required
              type="password"
              value={confirmation}
            />
          </div>

          {error ? (
            <p
              className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
              role="alert"
            >
              {error}
            </p>
          ) : null}

          <button
            className="w-full rounded-lg bg-slate-900 px-5 py-3 font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
            disabled={isSubmitting}
            type="submit"
          >
            {isSubmitting ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-600">
          Already have an account?{" "}
          <Link className="font-semibold text-amber-800 hover:underline" href="/login">
            Sign in
          </Link>
        </p>
      </section>
    </main>
  );
}
