import Link from "next/link";

export default function OrganizerDashboard() {
  return (
    <main className="min-h-screen bg-black text-white">
      <nav className="flex items-center justify-between border-b border-white/10 px-6 py-6 md:px-12">
        <Link
          href="/"
          className="text-2xl font-semibold tracking-tight"
        >
          Food<span className="text-white/40">Bridge</span>
        </Link>

        <span className="text-sm text-white/40">
          Organizer
        </span>
      </nav>

      <section className="px-6 py-16 md:px-12 md:py-24">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm uppercase tracking-[0.3em] text-white/40">
            Organizer dashboard
          </p>

          <h1 className="mt-5 text-5xl font-light tracking-tight md:text-7xl">
            Welcome to
            <br />
            <span className="text-white/40">FoodBridge.</span>
          </h1>

          <div className="mt-16 grid gap-5 md:grid-cols-3">
            <Link
              href="/organizer/donation/new"
              className="group rounded-2xl border border-white/10 p-8 transition hover:border-white/30 hover:bg-white/[0.04]"
            >
              <span className="text-3xl">+</span>

              <h2 className="mt-10 text-2xl font-light">
                Post food
              </h2>

              <p className="mt-3 text-sm leading-6 text-white/40">
                Tell nearby organizations about your surplus food.
              </p>

              <span className="mt-8 block text-sm text-white/50">
                Create donation →
              </span>
            </Link>

            <div className="rounded-2xl border border-white/10 p-8">
              <span className="text-sm text-white/30">
                01
              </span>

              <h2 className="mt-10 text-2xl font-light">
                Active donations
              </h2>

              <p className="mt-3 text-4xl font-light">
                0
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 p-8">
              <span className="text-sm text-white/30">
                02
              </span>

              <h2 className="mt-10 text-2xl font-light">
                Meals redistributed
              </h2>

              <p className="mt-3 text-4xl font-light">
                0
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}