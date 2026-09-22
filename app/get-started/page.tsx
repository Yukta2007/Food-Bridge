import Link from "next/link";

export default function GetStartedPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-6 py-6 md:px-12">
        <Link
          href="/"
          className="text-2xl font-semibold tracking-tight"
        >
          Food<span className="text-white/40">Bridge</span>
        </Link>

        <Link
          href="/"
          className="text-sm text-white/50 transition hover:text-white"
        >
          ← Back
        </Link>
      </nav>

      {/* Main */}
      <section className="flex min-h-[calc(100vh-96px)] items-center px-6 py-16 md:px-12">
        <div className="mx-auto w-full max-w-6xl">
          <div className="mb-16">
            <p className="text-sm uppercase tracking-[0.3em] text-white/40">
              Get started
            </p>

            <h1 className="mt-6 max-w-4xl text-5xl font-light leading-[0.95] tracking-tight md:text-7xl">
              What brings you
              <br />
              <span className="text-white/40">to FoodBridge?</span>
            </h1>

            <p className="mt-8 max-w-xl text-base leading-7 text-white/50">
              Choose how you want to use FoodBridge. You can change this later
              from your account.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            {/* Organizer */}
            <Link
              href="/organizer/register"
              className="group min-h-[320px] rounded-2xl border border-white/10 p-8 transition duration-300 hover:border-white/30 hover:bg-white/[0.04] md:p-10"
            >
              <div className="flex h-full flex-col justify-between">
                <div>
                  <span className="text-sm text-white/30">01</span>

                  <h2 className="mt-8 text-3xl font-light md:text-4xl">
                    I have
                    <br />
                    <span className="text-white/40">surplus food</span>
                  </h2>

                  <p className="mt-5 max-w-sm leading-7 text-white/50">
                    I&apos;m organizing a wedding, event, hotel function,
                    restaurant service or ceremony and have food that can be
                    donated.
                  </p>
                </div>

                <div className="mt-10 flex items-center justify-between">
                  <span className="text-sm text-white/60">
                    Continue as organizer
                  </span>

                  <span className="text-xl transition-transform duration-300 group-hover:translate-x-2">
                    →
                  </span>
                </div>
              </div>
            </Link>

            {/* Organization */}
            <Link
              href="/organization/register"
              className="group min-h-[320px] rounded-2xl border border-white/10 p-8 transition duration-300 hover:border-white/30 hover:bg-white/[0.04] md:p-10"
            >
              <div className="flex h-full flex-col justify-between">
                <div>
                  <span className="text-sm text-white/30">02</span>

                  <h2 className="mt-8 text-3xl font-light md:text-4xl">
                    I can
                    <br />
                    <span className="text-white/40">receive food</span>
                  </h2>

                  <p className="mt-5 max-w-sm leading-7 text-white/50">
                    I represent an NGO, orphanage, old-age home, shelter,
                    foundation or community kitchen.
                  </p>
                </div>

                <div className="mt-10 flex items-center justify-between">
                  <span className="text-sm text-white/60">
                    Continue as organization
                  </span>

                  <span className="text-xl transition-transform duration-300 group-hover:translate-x-2">
                    →
                  </span>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}