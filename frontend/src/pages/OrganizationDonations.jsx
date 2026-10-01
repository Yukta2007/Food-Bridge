import { Link } from "react-router-dom";

export default function OrganizationDonations() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#050505] text-white">
      {/* Background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[-15%] top-[10%] h-[500px] w-[500px] rounded-full bg-white/[0.025] blur-[130px]" />
        <div className="absolute bottom-[-20%] right-[-10%] h-[500px] w-[500px] rounded-full bg-white/[0.02] blur-[130px]" />

        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
            backgroundSize: "80px 80px",
          }}
        />
      </div>

      {/* Navbar */}
      <nav className="relative z-10 border-b border-white/[0.08]">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6 md:px-10 lg:px-16">
          <Link
            to="/"
            className="group text-xl font-semibold tracking-[-0.04em]"
          >
            Food
            <span className="text-white/35 transition group-hover:text-white/60">
              Bridge
            </span>
          </Link>

          <div className="flex items-center gap-6">
            <span className="hidden text-xs uppercase tracking-[0.2em] text-white/25 sm:block">
              Organization
            </span>

            <Link
              to="/organization/dashboard"
              className="group flex items-center gap-2 text-sm text-white/45 transition hover:text-white"
            >
              Dashboard
              <span className="transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>
            </Link>
          </div>
        </div>
      </nav>

      {/* Main */}
      <section className="relative z-10 mx-auto max-w-7xl px-6 py-16 md:px-10 md:py-24 lg:px-16">
        {/* Header */}
        <div className="flex flex-col justify-between gap-10 md:flex-row md:items-end">
          <div>
            <div className="mb-6 flex items-center gap-3">
              <span className="h-px w-8 bg-white/30" />

              <p className="text-[11px] font-medium uppercase tracking-[0.35em] text-white/35">
                Food available nearby
              </p>
            </div>

            <h1 className="text-5xl font-light leading-[0.9] tracking-[-0.055em] md:text-7xl">
              Available
              <br />
              <span className="text-white/25">donations.</span>
            </h1>

            <p className="mt-7 max-w-xl text-sm leading-7 text-white/40 md:text-base">
              Discover surplus food posted by verified FoodBridge organizers
              and help redirect it where it is needed.
            </p>
          </div>

          {/* Status */}
          <div className="flex items-center gap-3 self-start rounded-full border border-white/10 bg-white/[0.025] px-4 py-2.5 md:self-auto">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white/30" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-white/50" />
            </span>

            <span className="text-xs text-white/40">
              Checking for new donations
            </span>
          </div>
        </div>

        {/* Filters / Search */}
        <div className="mt-14 flex flex-col gap-3 border-y border-white/[0.08] py-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2 text-xs text-white/30">
            <span className="rounded-full bg-white/[0.06] px-3 py-1.5 text-white/50">
              All
            </span>

            <span className="px-3 py-1.5">Nearby</span>
            <span className="px-3 py-1.5">Today</span>
          </div>

          <div className="flex items-center gap-2 text-xs text-white/25">
            <span>Location</span>
            <span className="text-white/50">Your area</span>
            <span>⌄</span>
          </div>
        </div>

        {/* Empty State */}
        <div className="mt-10 overflow-hidden rounded-[28px] border border-white/[0.08] bg-white/[0.02]">
          <div className="relative flex min-h-[430px] flex-col items-center justify-center px-6 py-16 text-center">
            {/* Decorative circle */}
            <div className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/[0.035]" />

            <div className="relative">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-white/10 bg-white/[0.035]">
                <span className="text-2xl text-white/40">＋</span>
              </div>

              <h2 className="mt-7 text-2xl font-light tracking-tight md:text-3xl">
                Nothing available right now.
              </h2>

              <p className="mx-auto mt-4 max-w-md text-sm leading-7 text-white/35">
                There are currently no surplus food donations matching your
                area. New listings will appear here as organizers post them.
              </p>

              <Link
                to="/organization/dashboard"
                className="group mt-8 inline-flex items-center gap-3 rounded-full border border-white/10 px-5 py-3 text-sm text-white/60 transition-all duration-300 hover:border-white/25 hover:bg-white hover:text-black"
              >
                Return to dashboard
                <span className="transition-transform duration-300 group-hover:translate-x-1">
                  →
                </span>
              </Link>
            </div>
          </div>

          {/* Bottom information */}
          <div className="grid border-t border-white/[0.08] sm:grid-cols-3">
            <div className="border-b border-white/[0.08] p-6 sm:border-b-0 sm:border-r">
              <p className="text-[10px] uppercase tracking-[0.25em] text-white/20">
                Listings
              </p>
              <p className="mt-2 text-sm text-white/40">
                Updated automatically
              </p>
            </div>

            <div className="border-b border-white/[0.08] p-6 sm:border-b-0 sm:border-r">
              <p className="text-[10px] uppercase tracking-[0.25em] text-white/20">
                Verification
              </p>
              <p className="mt-2 text-sm text-white/40">
                Verified organizers only
              </p>
            </div>

            <div className="p-6">
              <p className="text-[10px] uppercase tracking-[0.25em] text-white/20">
                Purpose
              </p>
              <p className="mt-2 text-sm text-white/40">
                Reduce avoidable food waste
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}