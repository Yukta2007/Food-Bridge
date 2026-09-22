"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/app/lib/supabase/client";

export default function OrganizerRegisterPage() {
  const router = useRouter();
  const supabase = createClient();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setLoading(true);
    setError("");
    setSuccess("");

    const formData = new FormData(event.currentTarget);

    const fullName = String(formData.get("name") || "").trim();
    const email = String(formData.get("email") || "").trim();
    const phone = String(formData.get("phone") || "").trim();
    const eventCompany = String(
      formData.get("organization") || ""
    ).trim();
    const password = String(formData.get("password") || "");
    const terms = formData.get("terms");

    if (!fullName || !email || !phone || !password) {
      setError("Please fill in all required fields.");
      setLoading(false);
      return;
    }

    if (!terms) {
      setError("Please agree to the terms before continuing.");
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      setLoading(false);
      return;
    }

    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            role: "organizer",
            phone,
          },
        },
      });

      if (signUpError) {
        throw signUpError;
      }

      if (!data.user) {
        throw new Error("Could not create your account.");
      }

      const { error: profileError } = await supabase
        .from("profiles")
        .insert({
          id: data.user.id,
          full_name: fullName,
          phone,
          role: "organizer",
        });

      if (profileError) {
        throw profileError;
      }

      const { error: organizerError } = await supabase
        .from("organizer_profiles")
        .insert({
          id: data.user.id,
          event_company: eventCompany || null,
        });

      if (organizerError) {
        throw organizerError;
      }

      setSuccess(
        "Account created successfully. Redirecting to your dashboard..."
      );

      setTimeout(() => {
        router.push("/organizer/dashboard");
      }, 1000);
    } catch (err) {
  console.error("ORGANIZER REGISTRATION ERROR:", err);

  let message = "Something went wrong. Please try again.";

  if (err && typeof err === "object") {
    const errorObject = err as {
      message?: string;
      details?: string;
      hint?: string;
      code?: string;
    };

    message =
      errorObject.message ||
      errorObject.details ||
      errorObject.hint ||
      message;

    if (errorObject.code) {
      message += ` (Code: ${errorObject.code})`;
    }
  } else if (err instanceof Error) {
    message = err.message;
  }

  setError(message);
}
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <nav className="flex items-center justify-between px-6 py-6 md:px-12">
        <Link
          href="/"
          className="text-2xl font-semibold tracking-tight"
        >
          Food<span className="text-white/40">Bridge</span>
        </Link>

        <Link
          href="/get-started"
          className="text-sm text-white/50 transition hover:text-white"
        >
          ← Back
        </Link>
      </nav>

      <section className="px-6 py-16 md:px-12 md:py-24">
        <div className="mx-auto max-w-3xl">
          <div className="mb-14">
            <p className="text-sm uppercase tracking-[0.3em] text-white/40">
              Organizer account
            </p>

            <h1 className="mt-6 text-5xl font-light leading-[0.95] tracking-tight md:text-7xl">
              Let&apos;s stop
              <br />
              <span className="text-white/40">food waste.</span>
            </h1>

            <p className="mt-7 max-w-xl text-base leading-7 text-white/50">
              Create an organizer account to post surplus food from your
              weddings, ceremonies, events, restaurants or other gatherings.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div>
              <label
                htmlFor="name"
                className="mb-3 block text-sm text-white/50"
              >
                Full name
              </label>

              <input
                id="name"
                name="name"
                type="text"
                required
                placeholder="Your full name"
                className="w-full border-b border-white/20 bg-transparent px-0 py-4 text-lg outline-none transition placeholder:text-white/20 focus:border-white"
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="mb-3 block text-sm text-white/50"
              >
                Email address
              </label>

              <input
                id="email"
                name="email"
                type="email"
                required
                placeholder="you@example.com"
                className="w-full border-b border-white/20 bg-transparent px-0 py-4 text-lg outline-none transition placeholder:text-white/20 focus:border-white"
              />
            </div>

            <div>
              <label
                htmlFor="phone"
                className="mb-3 block text-sm text-white/50"
              >
                Phone number
              </label>

              <input
                id="phone"
                name="phone"
                type="tel"
                required
                placeholder="+91 XXXXX XXXXX"
                className="w-full border-b border-white/20 bg-transparent px-0 py-4 text-lg outline-none transition placeholder:text-white/20 focus:border-white"
              />
            </div>

            <div>
              <label
                htmlFor="organization"
                className="mb-3 block text-sm text-white/50"
              >
                Event company / organization
                <span className="ml-2 text-white/20">(optional)</span>
              </label>

              <input
                id="organization"
                name="organization"
                type="text"
                placeholder="Wedding planner, catering company, hotel..."
                className="w-full border-b border-white/20 bg-transparent px-0 py-4 text-lg outline-none transition placeholder:text-white/20 focus:border-white"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-3 block text-sm text-white/50"
              >
                Password
              </label>

              <input
                id="password"
                name="password"
                type="password"
                required
                minLength={6}
                placeholder="Create a secure password"
                className="w-full border-b border-white/20 bg-transparent px-0 py-4 text-lg outline-none transition placeholder:text-white/20 focus:border-white"
              />
            </div>

            {error && (
              <div className="rounded-xl border border-red-400/20 bg-red-400/5 p-4 text-sm text-red-300">
                {error}
              </div>
            )}

            {success && (
              <div className="rounded-xl border border-green-400/20 bg-green-400/5 p-4 text-sm text-green-300">
                {success}
              </div>
            )}

            <div className="flex items-start gap-3 pt-2">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                className="mt-1 h-4 w-4 accent-white"
              />

              <label
                htmlFor="terms"
                className="text-sm leading-6 text-white/40"
              >
                I agree to use FoodBridge responsibly and provide accurate
                information about food donations.
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="group mt-6 flex w-full items-center justify-center gap-4 rounded-full bg-white px-8 py-5 text-sm font-medium text-black transition hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Creating account..." : "Create organizer account"}

              {!loading && (
                <span className="text-lg transition-transform duration-300 group-hover:translate-x-1">
                  →
                </span>
              )}
            </button>
          </form>

          <p className="mt-10 text-center text-sm text-white/40">
            Already have an account?{" "}
            <Link
              href="/organizer/login"
              className="text-white underline underline-offset-4"
            >
              Sign in
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}