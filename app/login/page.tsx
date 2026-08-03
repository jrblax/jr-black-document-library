"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

import { authClient } from "@/lib/auth-client";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const result = await authClient.signIn.email({
        email: email.trim().toLowerCase(),
        password,
        rememberMe,
      });

      if (result.error) {
        setError(result.error.message || "The email or password was not accepted.");
        return;
      }

      router.push("/account");
      router.refresh();
    } catch {
      setError("An unexpected error occurred while signing in.");
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

        <h1 className="mt-3 text-3xl font-bold">Sign In</h1>

        <p className="mt-3 text-sm leading-6 text-slate-600">
          Access your private document library and saved sermon drafts.
        </p>

        <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
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
              autoComplete="current-password"
              className="w-full rounded-lg border border-stone-300 px-4 py-3 outline-none transition focus:border-amber-700 focus:ring-2 focus:ring-amber-100"
              id="password"
              name="password"
              onChange={(event) => setPassword(event.target.value)}
              required
              type="password"
              value={password}
            />
          </div>

          <label className="flex items-center gap-3 text-sm text-slate-700">
            <input
              checked={rememberMe}
              className="h-4 w-4 rounded border-stone-300"
              onChange={(event) => setRememberMe(event.target.checked)}
              type="checkbox"
            />
            Keep me signed in
          </label>

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
            {isSubmitting ? "Signing In..." : "Sign In"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-600">
          Need an account?{" "}
          <Link className="font-semibold text-amber-800 hover:underline" href="/signup">
            Create one
          </Link>
        </p>
      </section>
    </main>
  );
}
