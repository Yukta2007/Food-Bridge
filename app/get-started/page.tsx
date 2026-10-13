import Link from "next/link";

export default function GetStartedPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#050505] text-white">
      {/* Ambient background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[-10%] top-[15%] h-[500px] w-[500px] rounded-full bg-white/[0.025] blur-[120px]" />
        <div className="absolute bottom-[-15%] right-[-5%] h-[500px] w-[500px] rounded-full bg-white/[0.02] blur-[120px]" />

        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
            backgroundSize: "80px 80px",
          }}
        />
      </div>

      {/* Navbar */}
      <nav className="relative z-10 flex items-center justify-between px-6 py-7 md:px-12 lg:px-16">
        <Link
          href="/"
          className="group text-2xl font-semibold tracking-[-0.04em]"
        >
          Food
          <span className="text-white/35 transition-colors duration-300 group-hover:text-white/60">
            Bridge
          </span>
        </Link>

        <Link
          href="/"
          className="group flex items-center gap-3 text-sm text-white/40 transition-colors duration-300 hover:text-white"
        >
          <span className="transition-transform duration-300 group-hover:-translate-x-1">
            ←
          </span>
          Back
        </Link>
      </nav>

      {/* Main */}
      <section className="relative z-10 flex min-h-[calc(100vh-96px)] items-center px-6 py-14 md:px-12 md:py-20 lg:px-16">
        <div className="mx-auto w-full max-w-7xl">
          {/* Heading */}
          <div className="mb-14 max-w-4xl md:mb-20">
            <div className="mb-7 flex items-center gap-4">
              <span className="h-px w-10 bg-white/30" />

              <p className="text-[11px] font-medium uppercase tracking-[0.35em] text-white/40">
                Get started
              </p>
            </div>

            <h1 className="text-[clamp(3.5rem,7vw,7rem)] font-light leading-[0.88] tracking-[-0.055em]">
              What brings you
              <br />
              <span className="text-white/25">to FoodBridge?</span>
            </h1>

            <p className="mt-8 max-w-lg text-sm leading-7 text-white/40 md:text-base">
              FoodBridge connects surplus food with organizations that can
              put it to meaningful use. Choose where you fit in.
            </p>
          </div>

          {/* Cards */}
          <div className="grid gap-4 md:grid-cols-2">
            {/* Organizer */}
            <Link
              href="/organizer/register"
              className="group relative min-h-[380px] overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.025] p-7 transition-all duration-500 hover:-translate-y-1 hover:border-white/25 hover:bg-white/[0.05] md:p-10"
            >
              {/* Hover glow */}
              <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-white/[0.04] blur-3xl transition-all duration-700 group-hover:bg-white/[0.08]" />

              <div className="relative flex h-full flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between">
                    <span className="text-xs tracking-[0.2em] text-white/25">
                      01
                    </span>

                    <span className="rounded-full border border-white/10 px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-white/30">
                      Give
                    </span>
                  </div>

                  <h2 className="mt-12 text-4xl font-light leading-[0.95] tracking-[-0.04em] md:text-5xl">
                    I have
                    <br />
                    <span className="text-white/35">surplus food.</span>
                  </h2>

                  <p className="mt-6 max-w-md text-sm leading-7 text-white/40">
                    For weddings, events, hotels, restaurants, ceremonies and
                    other occasions where good food is left over.
                  </p>
                </div>

                <div className="mt-12 flex items-center justify-between border-t border-white/10 pt-6">
                  <span className="text-sm text-white/60">
                    Continue as organizer
                  </span>

                  <span className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-lg text-white/50 transition-all duration-300 group-hover:border-white/30 group-hover:bg-white group-hover:text-black">
                    →
                  </span>
                </div>
              </div>
            </Link>

            {/* Organization */}
            <Link
              href="/organization/register"
              className="group relative min-h-[380px] overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.025] p-7 transition-all duration-500 hover:-translate-y-1 hover:border-white/25 hover:bg-white/[0.05] md:p-10"
            >
              {/* Hover glow */}
              <div className="pointer-events-none absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-white/[0.04] blur-3xl transition-all duration-700 group-hover:bg-white/[0.08]" />

              <div className="relative flex h-full flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between">
                    <span className="text-xs tracking-[0.2em] text-white/25">
                      02
                    </span>

                    <span className="rounded-full border border-white/10 px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-white/30">
                      Receive
                    </span>
                  </div>

                  <h2 className="mt-12 text-4xl font-light leading-[0.95] tracking-[-0.04em] md:text-5xl">
                    I can
                    <br />
                    <span className="text-white/35">receive food.</span>
                  </h2>

                  <p className="mt-6 max-w-md text-sm leading-7 text-white/40">
                    For NGOs, orphanages, old-age homes, shelters, foundations
                    and community kitchens serving people in need.
                  </p>
                </div>

                <div className="mt-12 flex items-center justify-between border-t border-white/10 pt-6">
                  <span className="text-sm text-white/60">
                    Continue as organization
                  </span>

                  <span className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-lg text-white/50 transition-all duration-300 group-hover:border-white/30 group-hover:bg-white group-hover:text-black">
                    →
                  </span>
                </div>
              </div>
            </Link>
          </div>

          {/* Bottom note */}
          <div className="mt-8 flex items-center gap-3 text-xs text-white/20">
            <span className="h-1.5 w-1.5 rounded-full bg-white/30" />
            You can change your role later from your account.
          </div>
        </div>
      </section>
    </main>
  );
}
