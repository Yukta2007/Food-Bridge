import { Link } from "react-router-dom";

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#f5f1e8] text-[#171717]">

      {/* ================= NAVBAR ================= */}

      <nav className="relative z-20 flex items-center justify-between px-6 py-6 md:px-12 lg:px-16">

        <Link
          to="/"
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
            href="#roles"
            className="transition hover:text-[#171717]"
          >
            Get involved
          </a>
        </div>

        <Link
          to="/auth"
          className="rounded-full border border-[#171717]/15 px-5 py-2.5 text-sm transition hover:bg-[#171717] hover:text-white"
        >
          Sign in
        </Link>

      </nav>


      {/* ================= HERO ================= */}

      <section className="relative px-6 pb-20 pt-12 md:px-12 md:pb-28 md:pt-16 lg:px-16">

        <div className="pointer-events-none absolute -right-32 top-0 h-[420px] w-[420px] rounded-full bg-[#d7c5a4]/40 blur-3xl" />

        <div className="pointer-events-none absolute -left-40 bottom-0 h-[300px] w-[300px] rounded-full bg-[#e4b9a8]/30 blur-3xl" />

        <div className="relative mx-auto max-w-[1500px]">

          {/* Badge */}

          <div className="mb-10 flex items-center gap-3">

            <span className="flex h-2.5 w-2.5 rounded-full bg-[#78845c]" />

            <p className="text-xs font-medium uppercase tracking-[0.25em] text-[#171717]/50">
              Food redistribution platform
            </p>

          </div>


          {/* Main Heading */}

          <h1 className="max-w-[1100px] text-[clamp(4rem,9vw,9rem)] font-light leading-[0.86] tracking-[-0.07em]">

            Good food

            <br />

            <span className="text-[#8b6f47]">
              deserves another
            </span>

            <br />

            table.

          </h1>


          {/* Hero Bottom */}

          <div className="mt-16 grid gap-10 border-t border-[#171717]/10 pt-8 md:grid-cols-[1fr_auto] md:items-end">

            <div className="max-w-xl">

              <p className="text-lg leading-8 text-[#171717]/60 md:text-xl">
                FoodBridge connects event organizers with nearby
                organizations so surplus food can reach people
                who need it instead of going to waste.
              </p>

            </div>


            <Link
              to="/auth"
              className="group flex w-fit items-center gap-6 rounded-full bg-[#171717] px-7 py-4 text-sm font-medium text-white transition hover:-translate-y-1"
            >
              Get started

              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 transition group-hover:translate-x-1">
                →
              </span>
            </Link>

          </div>


          {/* Flow */}

          <div className="mt-20 grid grid-cols-2 border-t border-[#171717]/10 md:grid-cols-4">

            <Stat
              number="01"
              text="Post surplus food"
            />

            <Stat
              number="02"
              text="Find available food"
            />

            <Stat
              number="03"
              text="Request & accept"
            />

            <Stat
              number="04"
              text="Collect & complete"
            />

          </div>

        </div>

      </section>


      {/* ================= ABOUT ================= */}

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
              Events can have more food than they need,
              while nearby organizations are looking for food
              for the communities they support. FoodBridge
              brings both sides together through one simple
              platform.
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
              A simple flow connecting organizers who have
              surplus food with organizations that need it.
            </p>

          </div>


          {/* Steps */}

          <div className="grid gap-px overflow-hidden rounded-3xl border border-[#171717]/10 bg-[#171717]/10 md:grid-cols-2 lg:grid-cols-4">

            <Step
              number="01"
              title="Post food"
              description="Organizers post their surplus food with basic details such as food type, quantity and pickup location."
            />

            <Step
              number="02"
              title="Find food"
              description="Organizations browse food donations that are currently available."
            />

            <Step
              number="03"
              title="Request food"
              description="An organization requests an available donation and the organizer receives the request."
            />

            <Step
              number="04"
              title="Accept & collect"
              description="The organizer accepts the request and the organization collects the food."
            />

          </div>

        </div>

      </section>


      {/* ================= ROLES ================= */}

      <section
        id="roles"
        className="px-6 pb-24 md:px-12 md:pb-32 lg:px-16"
      >

        <div className="mx-auto max-w-[1500px]">

          <div className="mb-12">

            <p className="text-xs uppercase tracking-[0.3em] text-[#171717]/40">
              Get involved
            </p>

            <h2 className="mt-5 text-5xl font-light tracking-[-0.05em] md:text-7xl">
              Choose your role.
            </h2>

          </div>


          <div className="grid gap-6 md:grid-cols-2">

            {/* Organizer */}

            <div className="rounded-[2rem] bg-[#171717] p-8 text-[#f5f1e8] md:p-12">

              <p className="text-xs uppercase tracking-[0.3em] text-white/40">
                For organizers
              </p>

              <h3 className="mt-8 text-4xl font-light">
                Have surplus food?
              </h3>

              <p className="mt-5 max-w-lg leading-7 text-white/50">
                Post food left over from your events and
                connect with organizations that can put it
                to good use.
              </p>

              <div className="mt-10 flex flex-col gap-4 sm:flex-row">

                <Link
                  to="/organizer/register"
                  className="w-fit rounded-full bg-[#f5f1e8] px-7 py-4 text-sm font-medium text-[#171717] transition hover:-translate-y-1"
                >
                  Register as organizer →
                </Link>

                <Link
                  to="/auth"
                  className="w-fit rounded-full border border-white/20 px-7 py-4 text-sm text-white transition hover:bg-white/10"
                >
                  Login
                </Link>

              </div>

            </div>


            {/* Organization */}

            <div className="rounded-[2rem] bg-[#d8c6a7] p-8 md:p-12">

              <p className="text-xs uppercase tracking-[0.3em] text-[#171717]/50">
                For organizations
              </p>

              <h3 className="mt-8 text-4xl font-light">
                Need food for your community?
              </h3>

              <p className="mt-5 max-w-lg leading-7 text-[#171717]/55">
                Discover surplus food from nearby organizers,
                request donations and collect food for the
                people you serve.
              </p>

              <div className="mt-10 flex flex-col gap-4 sm:flex-row">

                <Link
                  to="/organization/register"
                  className="w-fit rounded-full bg-[#171717] px-7 py-4 text-sm font-medium text-white transition hover:-translate-y-1"
                >
                  Register organization →
                </Link>

                <Link
                  to="/auth"
                  className="w-fit rounded-full border border-[#171717]/20 px-7 py-4 text-sm transition hover:bg-[#171717]/5"
                >
                  Login
                </Link>

              </div>

            </div>

          </div>

        </div>

      </section>


      {/* ================= CTA ================= */}

      <section className="px-6 pb-24 md:px-12 md:pb-32 lg:px-16">

        <div className="relative mx-auto max-w-[1500px] overflow-hidden rounded-[2rem] bg-[#d8c6a7] px-8 py-16 md:px-16 md:py-24">

          <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full border-[40px] border-[#f5f1e8]/20" />

          <div className="relative max-w-4xl">

            <p className="text-xs uppercase tracking-[0.3em] text-[#171717]/50">
              FoodBridge
            </p>

            <h2 className="mt-6 text-5xl font-light leading-[0.92] tracking-[-0.06em] md:text-8xl">
              Good food
              <br />
              should not go
              <br />
              to waste.
            </h2>

            <div className="mt-10">

              <Link
                to="/auth"
                className="group flex w-fit items-center gap-5 rounded-full bg-[#171717] px-7 py-4 text-sm font-medium text-white transition hover:-translate-y-1"
              >
                Join FoodBridge

                <span className="transition-transform group-hover:translate-x-1">
                  →
                </span>
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
              href="#roles"
              className="transition hover:text-[#171717]"
            >
              Get involved
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

function Stat({ number, text }) {
  return (
    <div className="border-r border-[#171717]/10 px-4 py-7 first:pl-0 last:border-r-0 md:px-7">

      <p className="text-xs text-[#171717]/35">
        {number}
      </p>

      <p className="mt-3 text-sm font-medium">
        {text}
      </p>

    </div>
  );
}


/* ================= STEP ================= */

function Step({ number, title, description }) {
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