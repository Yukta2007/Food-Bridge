import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#f5f1e8] text-[#171717]">

      {/* ================= NAVBAR ================= */}
      <nav className="relative z-20 flex items-center justify-between px-6 py-6 md:px-12 lg:px-16">
        <Link
          href="/"
          className="text-2xl font-semibold tracking-[-0.04em]"
        >
          Food<span className="text-[#8b6f47]">Bridge</span>
        </Link>

        <div className="hidden items-center gap-10 text-sm text-[#171717]/60 md:flex">
          <a
            href="#how-it-works"
            className="transition hover:text-[#171717]"
          >
            How it works
          </a>

          <a
            href="#about"
            className="transition hover:text-[#171717]"
          >
            About
          </a>

          <a
            href="#contact"
            className="transition hover:text-[#171717]"
          >
            Contact
          </a>
        </div>

        <Link
          href="/login"
          className="rounded-full border border-[#171717]/15 px-5 py-2.5 text-sm transition hover:bg-[#171717] hover:text-white"
        >
          Sign in
        </Link>
      </nav>

      {/* ================= HERO ================= */}
      <section className="relative px-6 pb-20 pt-12 md:px-12 md:pb-28 md:pt-16 lg:px-16">
        {/* Decorative circles */}
        <div className="pointer-events-none absolute -right-32 top-0 h-[420px] w-[420px] rounded-full bg-[#d7c5a4]/40 blur-3xl" />

        <div className="pointer-events-none absolute -left-40 bottom-0 h-[300px] w-[300px] rounded-full bg-[#e4b9a8]/30 blur-3xl" />

        <div className="relative mx-auto max-w-[1500px]">

          {/* Small badge */}
          <div className="mb-10 flex items-center gap-3">
            <span className="flex h-2.5 w-2.5 rounded-full bg-[#78845c]" />

            <p className="text-xs font-medium uppercase tracking-[0.25em] text-[#171717]/50">
              Food redistribution platform
            </p>
          </div>

          {/* Main heading */}
          <h1 className="max-w-[1100px] text-[clamp(4rem,9vw,9rem)] font-light leading-[0.86] tracking-[-0.07em]">
            Good food
            <br />
            <span className="text-[#8b6f47]">
              deserves another
            </span>
            <br />
            table.
          </h1>

          {/* Hero bottom */}
          <div className="mt-16 grid gap-10 border-t border-[#171717]/10 pt-8 md:grid-cols-[1fr_auto] md:items-end">

            <div className="max-w-xl">
              <p className="text-lg leading-8 text-[#171717]/60 md:text-xl">
                FoodBridge connects event organizers with nearby
                NGOs, orphanages, old-age homes and foundations
                so surplus food can reach people who need it.
              </p>
            </div>

            <Link
              href="/get-started"
              className="group flex w-fit items-center gap-6 rounded-full bg-[#171717] px-7 py-4 text-sm font-medium text-white transition hover:-translate-y-1"
            >
              I have leftover food

              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 transition group-hover:translate-x-1">
                →
              </span>
            </Link>
          </div>

          {/* Hero stats */}
          <div className="mt-20 grid grid-cols-2 border-t border-[#171717]/10 md:grid-cols-4">

            <Stat
              number="01"
              text="Post surplus food"
            />

            <Stat
              number="02"
              text="Find nearby NGOs"
            />

            <Stat
              number="03"
              text="Arrange pickup"
            />

            <Stat
              number="04"
              text="Feed communities"
            />

          </div>
        </div>
      </section>

      {/* ================= ABOUT STRIP ================= */}
      <section
        id="about"
        className="bg-[#171717] px-6 py-24 text-[#f5f1e8] md:px-12 md:py-32 lg:px-16"
      >
        <div className="mx-auto grid max-w-[1500px] gap-16 md:grid-cols-[0.8fr_1.2fr]">

          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-white/40">
              Why FoodBridge
            </p>

            <h2 className="mt-6 text-4xl font-light leading-tight tracking-[-0.04em] md:text-6xl">
              A simple bridge between
              <span className="text-white/40">
                {" "}surplus and need.
              </span>
            </h2>
          </div>

          <div className="flex items-end">
            <p className="max-w-2xl text-xl leading-9 text-white/55 md:text-2xl">
              Every event can have more food than it needs.
              Every community has people who could use it.
              FoodBridge makes the connection easier, faster
              and more meaningful.
            </p>
          </div>

        </div>
      </section>

      {/* ================= HOW IT WORKS ================= */}
      <section
        id="how-it-works"
        className="px-6 py-24 md:px-12 md:py-32 lg:px-16"
      >
        <div className="mx-auto max-w-[1500px]">

          <div className="mb-16 flex flex-col justify-between gap-8 md:flex-row md:items-end">

            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-[#171717]/40">
                How it works
              </p>

              <h2 className="mt-5 max-w-3xl text-5xl font-light leading-[0.95] tracking-[-0.05em] md:text-7xl">
                From surplus
                <br />
                to someone&apos;s table.
              </h2>
            </div>

            <p className="max-w-sm text-sm leading-7 text-[#171717]/50">
              Four simple steps turn food that might have
              gone to waste into a meaningful contribution.
            </p>

          </div>

          {/* Steps */}
          <div className="grid gap-px overflow-hidden rounded-3xl border border-[#171717]/10 bg-[#171717]/10 md:grid-cols-2 lg:grid-cols-4">

            <Step
              number="01"
              title="Post the food"
              description="Tell us what food is available, how much you have and where it can be collected."
            />

            <Step
              number="02"
              title="Find organizations"
              description="Discover nearby NGOs, orphanages, shelters and other organizations."
            />

            <Step
              number="03"
              title="Arrange pickup"
              description="The organization accepts the donation and coordinates a convenient pickup."
            />

            <Step
              number="04"
              title="Make an impact"
              description="Your surplus food reaches people instead of becoming unnecessary waste."
            />

          </div>
        </div>
      </section>

      {/* ================= IMPACT CTA ================= */}
      <section className="px-6 pb-24 md:px-12 md:pb-32 lg:px-16">
        <div className="relative mx-auto max-w-[1500px] overflow-hidden rounded-[2rem] bg-[#d8c6a7] px-8 py-16 md:px-16 md:py-24">

          {/* Decorative circle */}
          <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full border-[40px] border-[#f5f1e8]/20" />

          <div className="relative max-w-4xl">

            <p className="text-xs uppercase tracking-[0.3em] text-[#171717]/50">
              Start making a difference
            </p>

            <h2 className="mt-6 text-5xl font-light leading-[0.92] tracking-[-0.06em] md:text-8xl">
              Have surplus food?
              <br />
              <span className="text-[#171717]/45">
                Let&apos;s share it.
              </span>
            </h2>

            <div className="mt-10 flex flex-col gap-5 sm:flex-row">

              <Link
                href="/get-started"
                className="group flex w-fit items-center gap-5 rounded-full bg-[#171717] px-7 py-4 text-sm font-medium text-white transition hover:-translate-y-1"
              >
                Create a donation

                <span className="transition-transform group-hover:translate-x-1">
                  →
                </span>
              </Link>

              <Link
                href="/organization/register"
                className="flex w-fit items-center rounded-full border border-[#171717]/20 px-7 py-4 text-sm transition hover:bg-[#171717]/5"
              >
                Register your organization
              </Link>

            </div>
          </div>
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer
        id="contact"
        className="border-t border-[#171717]/10 px-6 py-10 md:px-12 lg:px-16"
      >
        <div className="mx-auto flex max-w-[1500px] flex-col justify-between gap-8 md:flex-row md:items-end">

          <div>
            <div className="text-2xl font-semibold tracking-[-0.04em]">
              Food<span className="text-[#8b6f47]">Bridge</span>
            </div>

            <p className="mt-3 text-sm text-[#171717]/45">
              Connecting surplus food with communities.
            </p>
          </div>

          <div className="flex gap-8 text-sm text-[#171717]/45">
            <a
              href="#how-it-works"
              className="transition hover:text-[#171717]"
            >
              How it works
            </a>

            <a
              href="#about"
              className="transition hover:text-[#171717]"
            >
              About
            </a>

            <a
              href="#contact"
              className="transition hover:text-[#171717]"
            >
              Contact
            </a>
          </div>

          <p className="text-xs text-[#171717]/35">
            © 2026 FoodBridge
          </p>

        </div>
      </footer>

    </main>
  );
}

/* ================= STAT ================= */

function Stat({
  number,
  text,
}: {
  number: string;
  text: string;
}) {
  return (
    <div className="border-r border-[#171717]/10 px-4 py-7 first:pl-0 last:border-r-0 md:px-7">
      <p className="text-xs text-[#171717]/35">{number}</p>

      <p className="mt-3 text-sm font-medium">
        {text}
      </p>
    </div>
  );
}

/* ================= STEP ================= */

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
    <div className="group min-h-[330px] bg-[#f5f1e8] p-8 transition hover:bg-[#e9e1d2] md:p-10">

      <div className="flex h-full flex-col justify-between">

        <div className="flex items-center justify-between">

          <span className="text-sm text-[#171717]/35">
            {number}
          </span>

          <span className="flex h-9 w-9 items-center justify-center rounded-full border border-[#171717]/10 text-sm transition group-hover:translate-x-1">
            →
          </span>

        </div>

        <div>
          <h3 className="text-2xl font-medium tracking-[-0.03em]">
            {title}
          </h3>

          <p className="mt-4 max-w-xs text-sm leading-7 text-[#171717]/50">
            {description}
          </p>
        </div>

      </div>
    </div>
  );
}