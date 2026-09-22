import Link from "next/link";

export default function OrganizationDonationsPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <nav className="border-b border-white/10 px-6 py-5 md:px-10">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <Link
            href="/"
            className="text-lg font-semibold"
          >
            FoodBridge
          </Link>

          <Link
            href="/organization/dashboard"
            className="text-sm text-white/50 hover:text-white"
          >
            Dashboard
          </Link>
        </div>
      </nav>

      <section className="mx-auto max-w-6xl px-6 py-16 md:px-10">
        <p className="text-sm uppercase tracking-[0.25em] text-white/40">
          Food available nearby
        </p>

        <h1 className="mt-4 text-4xl font-medium md:text-6xl">
          Available donations
        </h1>

        <p className="mt-5 max-w-xl text-white/50">
          Surplus food posted by verified FoodBridge organizers
          will appear here.
        </p>

        <div className="mt-12 rounded-2xl border border-dashed border-white/10 p-12 text-center">
          <p className="text-lg text-white/60">
            No donations available yet.
          </p>

          <p className="mt-2 text-sm text-white/30">
            New surplus food will appear here when organizers
            post it.
          </p>
        </div>
      </section>
    </main>
  );
}