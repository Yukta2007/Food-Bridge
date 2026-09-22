"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/app/lib/supabase/client";

export default function OrganizationRegisterPage() {
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

    const organizationName = String(
      formData.get("organizationName") || ""
    ).trim();

    const organizationType = String(
      formData.get("organizationType") || ""
    ).trim();

    const contactPerson = String(
      formData.get("contactPerson") || ""
    ).trim();

    const email = String(formData.get("email") || "").trim();

    const phone = String(formData.get("phone") || "").trim();

    const address = String(
      formData.get("address") || ""
    ).trim();

    const peopleServed = String(
      formData.get("peopleServed") || ""
    ).trim();

    const foodPreferences = formData.getAll("foodPreferences");

    const password = String(formData.get("password") || "");

    const terms = formData.get("terms");

    if (
      !organizationName ||
      !organizationType ||
      !contactPerson ||
      !email ||
      !phone ||
      !address ||
      !password
    ) {
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
      // 1. Create Supabase auth account
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: contactPerson,
            role: "organization",
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

      // 2. Create profile
      const { error: profileError } = await supabase
        .from("profiles")
        .insert({
          id: data.user.id,
          full_name: contactPerson,
          phone,
          role: "organization",
        });

      if (profileError) {
        throw profileError;
      }

      // 3. Create organization profile
      const { error: organizationError } = await supabase
        .from("organizations")
        .insert({
          id: data.user.id,
          organization_name: organizationName,
          organization_type: organizationType,
          contact_person: contactPerson,
          email,
          phone,
          address,
          people_served: peopleServed
            ? Number(peopleServed)
            : null,
          food_preferences: foodPreferences,
        });

      if (organizationError) {
        throw organizationError;
      }

      setSuccess(
        "Registration successful. Redirecting..."
      );

      setTimeout(() => {
        router.push("/organization/dashboard");
      }, 1000);
    } catch (err) {
  console.error("ORGANIZATION REGISTRATION ERROR:", err);

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
    <main className="min-h-screen bg-black px-6 py-16 text-white">
      <div className="mx-auto max-w-2xl">
        <Link
          href="/get-started"
          className="text-sm text-white/50 transition hover:text-white"
        >
          ← Back
        </Link>

        <div className="mt-12">
          <p className="text-sm uppercase tracking-[0.25em] text-white/40">
            FoodBridge
          </p>

          <h1 className="mt-4 text-4xl font-medium tracking-tight md:text-6xl">
            Register your organization
          </h1>

          <p className="mt-5 max-w-xl text-white/50">
            Tell us about your organization so we can connect you
            with surplus food nearby.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="mt-12 space-y-8"
        >
          <div>
            <label className="mb-2 block text-sm text-white/60">
              Organization name *
            </label>

            <input
              name="organizationName"
              type="text"
              required
              placeholder="Example: Hope Foundation"
              className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-5 py-4 outline-none transition placeholder:text-white/20 focus:border-white/30"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-white/60">
              Organization type *
            </label>

            <select
              name="organizationType"
              required
              defaultValue=""
              className="w-full rounded-xl border border-white/10 bg-[#111] px-5 py-4 outline-none focus:border-white/30"
            >
              <option value="" disabled>
                Select organization type
              </option>

              <option value="ngo">NGO</option>
              <option value="orphanage">Orphanage</option>
              <option value="old_age_home">Old Age Home</option>
              <option value="shelter">Shelter</option>
              <option value="foundation">Foundation</option>
              <option value="community_kitchen">
                Community Kitchen
              </option>
              <option value="food_bank">Food Bank</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm text-white/60">
              Contact person *
            </label>

            <input
              name="contactPerson"
              type="text"
              required
              placeholder="Full name"
              className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-5 py-4 outline-none transition placeholder:text-white/20 focus:border-white/30"
            />
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm text-white/60">
                Email *
              </label>

              <input
                name="email"
                type="email"
                required
                placeholder="you@example.com"
                className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-5 py-4 outline-none transition placeholder:text-white/20 focus:border-white/30"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-white/60">
                Phone *
              </label>

              <input
                name="phone"
                type="tel"
                required
                placeholder="+91 98765 43210"
                className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-5 py-4 outline-none transition placeholder:text-white/20 focus:border-white/30"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm text-white/60">
              Address *
            </label>

            <textarea
              name="address"
              required
              rows={4}
              placeholder="Full organization address"
              className="w-full resize-none rounded-xl border border-white/10 bg-white/[0.04] px-5 py-4 outline-none transition placeholder:text-white/20 focus:border-white/30"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-white/60">
              Approx. number of people served
            </label>

            <input
              name="peopleServed"
              type="number"
              min="1"
              placeholder="Example: 100"
              className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-5 py-4 outline-none transition placeholder:text-white/20 focus:border-white/30"
            />
          </div>

          <div>
            <p className="mb-4 text-sm text-white/60">
              Food preferences
            </p>

            <div className="grid gap-3 sm:grid-cols-3">
              <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-white/10 bg-white/[0.04] p-4">
                <input
                  type="checkbox"
                  name="foodPreferences"
                  value="vegetarian"
                />
                <span className="text-sm">
                  Vegetarian
                </span>
              </label>

              <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-white/10 bg-white/[0.04] p-4">
                <input
                  type="checkbox"
                  name="foodPreferences"
                  value="non_vegetarian"
                />
                <span className="text-sm">
                  Non-vegetarian
                </span>
              </label>

              <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-white/10 bg-white/[0.04] p-4">
                <input
                  type="checkbox"
                  name="foodPreferences"
                  value="both"
                />
                <span className="text-sm">
                  Both
                </span>
              </label>
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm text-white/60">
              Password *
            </label>

            <input
              name="password"
              type="password"
              required
              minLength={6}
              placeholder="At least 6 characters"
              className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-5 py-4 outline-none transition placeholder:text-white/20 focus:border-white/30"
            />
          </div>

          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-5 text-sm text-white/50">
            Your organization may need to be verified by FoodBridge
            before receiving donations.
          </div>

          <label className="flex cursor-pointer items-start gap-3 text-sm text-white/50">
            <input
              name="terms"
              type="checkbox"
              className="mt-1"
            />

            <span>
              I agree to the FoodBridge terms and confirm that the
              information provided is accurate.
            </span>
          </label>

          {error && (
            <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-300">
              {error}
            </div>
          )}

          {success && (
            <div className="rounded-xl border border-green-500/20 bg-green-500/10 p-4 text-sm text-green-300">
              {success}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-white px-7 py-4 text-sm font-medium text-black transition hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading
              ? "Creating account..."
              : "Register organization →"}
          </button>

          <p className="text-center text-sm text-white/40">
            Already registered?{" "}
            <Link
              href="/login"
              className="text-white underline underline-offset-4"
            >
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </main>
  );
}