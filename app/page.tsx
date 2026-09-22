import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-6 py-6 md:px-12">
        <div className="text-2xl font-semibold tracking-tight">
          Food<span className="text-white/50">Bridge</span>
        </div>

        <div className="hidden items-center gap-8 text-sm text-white/70 md:flex">
          <a href="#how-it-works" className="transition hover:text-white">
            How it works
          </a>
          <a href="#about" className="transition hover:text-white">
            About
          </a>
          <a href="#contact" className="transition hover:text-white">
            Contact
          </a>
        </div>

        <button className="rounded-full border border-white/20 px-5 py-2.5 text-sm transition hover:bg-white hover:text-black">
          Sign in
        </button>
      </nav>

      {/* Hero */}
      <section className="relative flex min-h-[calc(100vh-96px)] items-center overflow-hidden px-6 py-20 md:px-12">
        {/* Background glow */}
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/[0.04] blur-3xl" />

        <div className="relative mx-auto w-full max-w-7xl">
          <p className="mb-6 text-sm uppercase tracking-[0.35em] text-white/40">
            Food redistribution platform
          </p>

          <h1 className="max-w-5xl text-5xl font-light leading-[0.95] tracking-[-0.04em] sm:text-7xl md:text-8xl lg:text-[9rem]">
            Food should
            <br />
            <span className="text-white/40">never go to waste.</span>
          </h1>

          <div className="mt-12 flex max-w-2xl flex-col gap-8 md:flex-row md:items-end md:justify-between">
            <p className="max-w-md text-base leading-7 text-white/60 md:text-lg">
              FoodBridge connects event organizers with nearby NGOs,
              orphanages, old-age homes and foundations so surplus food can
              reach people who need it.
            </p>

            <Link
  href="/get-started"
  className="group flex w-fit items-center gap-4 rounded-full bg-white px-7 py-4 text-sm font-medium text-black transition hover:bg-white/90"
>
  I have leftover food
  <span className="transition-transform group-hover:translate-x-1">
    →
  </span>
</Link>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section
        id="how-it-works"
        className="border-t border-white/10 px-6 py-24 md:px-12 md:py-32"
      >
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-16 md:grid-cols-2">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-white/40">
                How it works
              </p>

              <h2 className="mt-6 max-w-xl text-4xl font-light leading-tight tracking-tight md:text-6xl">
                From surplus food to someone&apos;s table.
              </h2>
            </div>

            <div className="space-y-10">
              <Step
                number="01"
                title="Post the food"
                description="Tell us about the surplus food, quantity and where it is available."
              />

              <Step
                number="02"
                title="Find nearby organizations"
                description="FoodBridge helps connect your event with nearby verified organizations."
              />

              <Step
                number="03"
                title="Arrange pickup"
                description="The organization accepts the donation and arranges a pickup."
              />

              <Step
                number="04"
                title="Food reaches people"
                description="The surplus food is redistributed instead of becoming waste."
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section
        id="start"
        className="border-t border-white/10 px-6 py-28 md:px-12 md:py-40"
      >
        <div className="mx-auto max-w-7xl text-center">
          <p className="text-sm uppercase tracking-[0.3em] text-white/40">
            Start making a difference
          </p>

          <h2 className="mx-auto mt-6 max-w-4xl text-5xl font-light leading-[0.95] tracking-tight md:text-7xl">
            Have surplus food?
            <br />
            <span className="text-white/40">Let&apos;s share it.</span>
          </h2>

          <button className="mt-10 rounded-full bg-white px-8 py-4 text-sm font-medium text-black transition hover:bg-white/90">
            Create a donation
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer
        id="contact"
        className="border-t border-white/10 px-6 py-8 md:px-12"
      >
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-4 text-sm text-white/40 md:flex-row">
          <p>© 2026 FoodBridge</p>
          <p>Connecting surplus food with communities.</p>
        </div>
      </footer>
    </main>
  );
}

function Step({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <div className="border-b border-white/10 pb-8">
      <div className="flex gap-6">
        <span className="text-sm text-white/30">{number}</span>

        <div>
          <h3 className="text-xl font-medium">{title}</h3>
          <p className="mt-3 max-w-md leading-7 text-white/50">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}