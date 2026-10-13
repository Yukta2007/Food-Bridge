import { useState } from "react";
import { Link } from "react-router-dom";

const heroImage =
  import.meta.env.VITE_CLOUDINARY_HERO_URL ||
  "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1800&q=85";

const steps = [
  {
    number: "01",
    title: "Donate Food",
    description:
      "Restaurants, event organizers and donors can share surplus food before it goes to waste.",
  },
  {
    number: "02",
    title: "Share Food",
    description:
      "Make surplus food available so it can reach the people and communities who need it.",
  },
  {
    number: "03",
    title: "Connect with NGOs",
    description:
      "Connect with community organizations and help build a more thoughtful food system.",
  },
];

function Home() {
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  return (
    <div className="min-h-screen overflow-x-clip bg-[#EAF2E3] text-[#193c2c]">
      {/* Navigation */}
      <header className="sticky top-0 z-50 border-b border-[#193c2c]/10 bg-[#f8f7f2]/95 backdrop-blur-xl">
        <nav className="mx-auto flex min-h-[72px] max-w-[1440px] items-center justify-between gap-3 px-4 sm:min-h-[82px] sm:px-8 lg:px-14">
          {/* Logo */}
          <Link
            to="/"
            onClick={closeMenu}
            className="group flex min-w-0 items-center gap-2.5 sm:gap-3"
          >
           <span className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#214d38] transition-transform group-hover:rotate-[-8deg] sm:h-11 sm:w-11">
  <img
    src="https://res.cloudinary.com/mm1n2nhv/image/upload/v1791570170/%E0%B8%AD%E0%B8%B0%E0%B9%82%E0%B8%A7%E0%B8%84%E0%B8%B2%E0%B9%82%E0%B8%94%E0%B9%89_-removebg-preview.png"
    alt="FoodBridge logo"
    className="h-full w-full object-contain"
  />
</span>

            
<span className="truncate text-[20px] font-bold tracking-[-1.2px] sm:text-[22px]">
  <span className="text-[#193c2c]">Food</span>
  <span className="text-[#bd7148]">Bridge</span>
  <span className="text-[#bd7148]">.</span>
</span>
          </Link>

          {/* Desktop navigation */}
          <div className="hidden items-center gap-6 text-[13px] font-medium text-[#526458] lg:flex xl:gap-9">
            <a
              href="/auth"
              className="transition hover:text-[#bd7148]"
            >
              How it works
            </a>
            <a href="#about" className="transition hover:text-[#bd7148]">
              Our mission
            </a>
            <a href="#impact" className="transition hover:text-[#bd7148]">
              Why FoodBridge
            </a>
          </div>

         

          {/* Mobile actions */}
          <div className="flex shrink-0 items-center gap-2 sm:hidden">
           
            <button
              type="button"
              aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#193c2c]/15 text-[#193c2c] transition hover:bg-[#e9ece3]"
            >
              <span className="text-xl leading-none">
                {menuOpen ? "×" : "☰"}
              </span>
            </button>
          </div>
        </nav>

        {/* Mobile dropdown */}
        {menuOpen && (
          <div className="border-t border-[#193c2c]/10 bg-[#f8f7f2] px-4 pb-5 pt-3 shadow-lg sm:hidden">
            <div className="flex flex-col">
              <a
                href="#how-it-works"
                onClick={closeMenu}
                className="border-b border-[#193c2c]/10 py-3.5 text-sm font-medium text-[#526458]"
              >
                How it works
              </a>

              <a
                href="#about"
                onClick={closeMenu}
                className="border-b border-[#193c2c]/10 py-3.5 text-sm font-medium text-[#526458]"
              >
                Our mission
              </a>

              <a
                href="#impact"
                onClick={closeMenu}
                className="border-b border-[#193c2c]/10 py-3.5 text-sm font-medium text-[#526458]"
              >
                Why FoodBridge
              </a>

             
            </div>
          </div>
        )}
      </header>

      <main>
        {/* Hero */}
        <section className="relative isolate min-h-[640px] overflow-hidden bg-[#183b2b] sm:min-h-[700px] lg:min-h-[780px]">
          <img
            src={heroImage}
            alt="Community members coming together to help others"
            className="absolute inset-0 h-full w-full object-cover object-center"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src =
                "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1800&q=85";
            }}
          />

          {/* Responsive gradient: darker behind text */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(90deg, rgba(16,43,29,0.96) 0%, rgba(20,51,35,0.88) 42%, rgba(24,55,38,0.20) 100%)",
            }}
          />

          {/* Extra contrast on mobile */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#12291c]/65 via-transparent to-black/15 sm:from-[#12291c]/45" />

          <div className="relative z-10 mx-auto flex min-h-[640px] max-w-[1440px] items-center px-5 py-14 sm:min-h-[700px] sm:px-8 sm:py-20 lg:min-h-[780px] lg:px-14">
            <div className="max-w-[720px] text-white">
              <div className="mb-6 inline-flex max-w-full items-center gap-2.5 rounded-full border border-white/25 bg-white/[0.08] px-3.5 py-2.5 backdrop-blur-sm sm:mb-8 sm:gap-3 sm:px-4">
                <span className="h-2 w-2 shrink-0 rounded-full bg-[#dfb493]" />
                <span className="text-[9px] font-semibold uppercase tracking-[1.8px] text-white/85 sm:text-[10px] sm:tracking-[2.5px]">
                  Good food. Greater good.
                </span>
              </div>

              <h1 className="text-[clamp(3rem,10vw,7rem)] font-medium leading-[0.98] tracking-[-0.065em] sm:leading-[0.96] sm:tracking-[-0.075em]">
                A little more
                <br />
                <span className="font-serif italic text-[#e7b894]">
                  care.
                </span>{" "}
                A lot less
                <br />
                waste.
              </h1>

              <p className="mt-6 max-w-[490px] text-sm leading-7 text-white/85 sm:mt-8 sm:text-lg sm:leading-8">
                Good food deserves a better destination. FoodBridge connects
                surplus food with the organizations and communities that need
                it most.
              </p>

              {/* Buttons stack on narrow screens */}
              <div className="mt-8 flex w-full flex-col gap-3 min-[420px]:flex-row sm:mt-9 sm:w-auto">
                <Link
                  to="/auth"
                  className="group inline-flex min-h-[52px] w-full items-center justify-center gap-4 rounded-full bg-[#f1e8d7] px-5 text-sm font-semibold text-[#193c2c] transition duration-300 hover:-translate-y-1 hover:bg-white min-[420px]:w-auto sm:min-h-[56px] sm:gap-5 sm:px-7"
                >
                  Start donating
                  <span className="transition-transform group-hover:translate-x-1">
                    →
                  </span>
                </Link>

                <Link
                  to="/auth"
                  className="inline-flex min-h-[52px] w-full items-center justify-center gap-3 rounded-full border border-white/40 bg-white/[0.06] px-5 text-sm font-semibold text-white backdrop-blur-sm transition duration-300 hover:border-white hover:bg-white/15 min-[420px]:w-auto sm:min-h-[56px] sm:gap-4 sm:px-6"
                >
                  Find food support <span>↗</span>
                </Link>
              </div>

              <div className="mt-8 flex items-center gap-3 text-xs text-white/75 sm:mt-12 sm:text-sm">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/25 text-lg">
                  ♡
                </span>
                Making every meal count, together.
              </div>
            </div>
          </div>

          {/* Desktop image caption */}
          <div className="absolute bottom-7 right-6 z-10 hidden items-center gap-3 text-xs text-white/80 sm:flex lg:right-14">
            <span className="h-px w-8 bg-white/60" />
            Good food. Shared with purpose.
          </div>
        </section>

        {/* Premium Impact Strip */}
        <section
          id="impact"
          className="relative scroll-mt-20 overflow-hidden border-y border-[#193c2c]/10 bg-[#eeeee4]"
        >
          <div className="mx-auto grid max-w-[1440px] grid-cols-1 px-5 sm:px-8 md:grid-cols-3 lg:px-14">
            {/* Impact 1 */}
            <div className="group relative flex items-start gap-4 py-7 transition-all duration-300 sm:gap-5 sm:py-9 md:px-5 md:py-12 lg:px-9">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white text-[#bd7148] shadow-sm ring-1 ring-[#193c2c]/5 transition-all duration-300 group-hover:-translate-y-1 group-hover:bg-[#214d38] group-hover:text-white group-hover:shadow-md sm:h-12 sm:w-12">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  className="h-5 w-5"
                >
                  <path d="M12 3v18M5 10l7-7 7 7" />
                  <path d="M5 14l7 7 7-7" opacity=".35" />
                </svg>
              </div>

              <div className="min-w-0 pt-0.5">
                <p className="text-[9px] font-bold uppercase tracking-[1.7px] text-[#bd7148] sm:text-[10px] sm:tracking-[2px]">
                  A better tomorrow
                </p>
                <h2 className="mt-2 text-lg font-semibold tracking-[-0.4px] text-[#193c2c] sm:text-xl">
                  Less food waste
                </h2>
                <p className="mt-2 max-w-[270px] text-sm leading-6 text-[#69776c]">
                  Give perfectly good surplus food a second chance to make a
                  difference.
                </p>
              </div>

              <span className="absolute bottom-0 left-0 h-px w-full bg-[#193c2c]/10 md:hidden" />
            </div>

            {/* Impact 2 */}
            <div className="group relative flex items-start gap-4 py-7 transition-all duration-300 sm:gap-5 sm:py-9 md:border-x md:border-[#d6d9ce] md:px-5 md:py-12 lg:px-9">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white text-[#bd7148] shadow-sm ring-1 ring-[#193c2c]/5 transition-all duration-300 group-hover:-translate-y-1 group-hover:bg-[#214d38] group-hover:text-white group-hover:shadow-md sm:h-12 sm:w-12">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  className="h-5 w-5"
                >
                  <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z" />
                </svg>
              </div>

              <div className="min-w-0 pt-0.5">
                <p className="text-[9px] font-bold uppercase tracking-[1.7px] text-[#bd7148] sm:text-[10px] sm:tracking-[2px]">
                  People first
                </p>
                <h2 className="mt-2 text-lg font-semibold tracking-[-0.4px] text-[#193c2c] sm:text-xl">
                  Stronger communities
                </h2>
                <p className="mt-2 max-w-[270px] text-sm leading-6 text-[#69776c]">
                  Bring food donors and community organizations together
                  through care.
                </p>
              </div>

              <span className="absolute bottom-0 left-0 h-px w-full bg-[#193c2c]/10 md:hidden" />
            </div>

            {/* Impact 3 */}
            <div className="group flex items-start gap-4 py-7 transition-all duration-300 sm:gap-5 sm:py-9 md:px-5 md:py-12 lg:px-9">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white text-[#bd7148] shadow-sm ring-1 ring-[#193c2c]/5 transition-all duration-300 group-hover:-translate-y-1 group-hover:bg-[#214d38] group-hover:text-white group-hover:shadow-md sm:h-12 sm:w-12">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  className="h-5 w-5"
                >
                  <path d="M12 2v20M2 12h20M4.9 4.9l14.2 14.2M19.1 4.9 4.9 19.1" />
                  <circle cx="12" cy="12" r="8" opacity=".35" />
                </svg>
              </div>

              <div className="min-w-0 pt-0.5">
                <p className="text-[9px] font-bold uppercase tracking-[1.7px] text-[#bd7148] sm:text-[10px] sm:tracking-[2px]">
                  Shared with purpose
                </p>
                <h2 className="mt-2 text-lg font-semibold tracking-[-0.4px] text-[#193c2c] sm:text-xl">
                  Food with purpose
                </h2>
                <p className="mt-2 max-w-[270px] text-sm leading-6 text-[#69776c]">
                  Help nourishing food reach people and communities who need
                  it most.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section
          id="how-it-works"
          className="mx-auto max-w-[1440px] scroll-mt-20 px-5 py-16 sm:px-8 sm:py-24 lg:px-14 lg:py-28"
        >
          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end md:gap-6">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[2.5px] text-[#bd7148]">
                Thoughtfully simple
              </p>

              <h2 className="mt-4 max-w-2xl text-4xl font-medium leading-tight tracking-[-0.055em] sm:mt-5 sm:text-5xl lg:text-6xl">
                Good things happen
                <br className="hidden sm:block" /> when we{" "}
                <span className="font-serif italic text-[#bd7148]">
                  work together.
                </span>
              </h2>
            </div>

            <p className="max-w-sm text-sm leading-7 text-[#69776c] sm:text-base md:pb-1">
              Three simple steps turn surplus food into something meaningful
              for someone else.
            </p>
          </div>

          {/* All cards link to authentication */}
          <div className="mt-9 grid grid-cols-1 gap-4 sm:mt-12 md:mt-16 md:grid-cols-3">
            {steps.map((step) => (
              <Link
                key={step.number}
                to="/auth"
                aria-label={`${step.title} — get started`}
                className="group relative flex min-h-[250px] flex-col border border-[#193c2c]/10 bg-white/60 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-[#214d38]/30 hover:bg-white hover:shadow-[0_18px_55px_rgba(25,60,44,0.09)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#bd7148] sm:min-h-[275px] sm:p-9"
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#edf0e5] font-serif text-lg italic text-[#214d38] transition-colors group-hover:bg-[#214d38] group-hover:text-white sm:h-12 sm:w-12">
                    {step.number}
                  </span>

                  <span className="text-[10px] font-semibold tracking-[1.5px] text-[#a0aa9c] sm:text-xs sm:tracking-[2px]">
                    STEP {step.number}
                  </span>
                </div>

                <h3 className="mt-6 text-xl font-semibold tracking-tight sm:mt-8">
                  {step.title}
                </h3>

                <p className="mt-3 text-sm leading-7 text-[#69776c]">
                  {step.description}
                </p>

                <div className="mt-auto flex items-center justify-between pt-6">
                  <span className="text-[10px] font-bold uppercase tracking-[1.5px] text-[#8a9588] transition-colors group-hover:text-[#214d38] sm:tracking-[1.8px]">
                    Get started
                  </span>

                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#193c2c]/15 text-lg text-[#bd7148] transition-all group-hover:border-[#214d38] group-hover:bg-[#214d38] group-hover:text-white">
                    ↗
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Mission */}
        <section
          id="about"
          className="scroll-mt-20 px-4 pb-16 sm:px-8 sm:pb-24 lg:px-14 lg:pb-28"
        >
          <div className="relative mx-auto grid max-w-[1440px] grid-cols-1 overflow-hidden bg-[#214633] text-white md:grid-cols-[1.1fr_0.9fr]">
            <div className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full border border-white/10" />
            <div className="pointer-events-none absolute -right-10 -top-14 h-52 w-52 rounded-full border border-white/10" />

            <div className="relative z-10 px-6 py-10 sm:px-12 sm:py-16 lg:px-16 lg:py-20">
              <p className="text-[10px] font-bold uppercase tracking-[2.5px] text-[#dfb493]">
                More than a meal
              </p>

              <h2 className="mt-5 max-w-xl text-4xl font-medium leading-[1.1] tracking-[-0.05em] sm:mt-6 sm:text-5xl lg:text-6xl">
                A better world starts with what we{" "}
                <span className="font-serif italic text-[#dfb493]">
                  share.
                </span>
              </h2>
            </div>

            <div className="relative z-10 flex flex-col items-start justify-center border-t border-white/15 px-6 py-8 sm:px-12 sm:py-12 md:border-l md:border-t-0 lg:px-14">
              <p className="max-w-md text-sm leading-7 text-white/75 sm:text-base sm:leading-8">
                FoodBridge aims to make food sharing easier by helping donors
                and community organizations connect. Together, we can encourage
                responsible food use and build a more caring community.
              </p>

              <Link
                to="/auth"
                className="group mt-7 inline-flex min-h-12 max-w-full items-center justify-center gap-3 rounded-full bg-[#f1e8d7] px-5 py-3.5 text-sm font-semibold text-[#214633] transition hover:bg-white sm:mt-8 sm:gap-5 sm:px-6"
              >
                Become part of the change
                <span className="transition-transform group-hover:translate-x-1">
                  →
                </span>
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#193c2c]/10">
        <div className="mx-auto grid max-w-[1440px] grid-cols-1 gap-8 px-5 py-10 sm:grid-cols-2 sm:gap-10 sm:px-8 sm:py-12 md:grid-cols-[1.4fr_0.7fr_0.9fr] lg:px-14 lg:py-16">
          {/* Footer brand */}
          <div>
            <Link to="/" className="inline-flex items-center gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#214d38] transition-transform group-hover:rotate-[-8deg] sm:h-11 sm:w-11">
  <img
    src="https://res.cloudinary.com/mm1n2nhv/image/upload/v1791570170/%E0%B8%AD%E0%B8%B0%E0%B9%82%E0%B8%A7%E0%B8%84%E0%B8%B2%E0%B9%82%E0%B8%94%E0%B9%89_-removebg-preview.png"
    alt="FoodBridge logo"
    className="h-full w-full object-contain"
  />
</span>

             <span className="truncate text-[20px] font-bold tracking-[-1.2px] sm:text-[22px]">
  <span className="text-[#193c2c]">Food</span>
  <span className="text-[#bd7148]">Bridge</span>
  <span className="text-[#bd7148]">.</span>
</span>
            </Link>

            <p className="mt-4 max-w-xs text-sm leading-7 text-[#69776c] sm:mt-5">
              Connecting surplus food with organizations that care. Because
              good food should do good things.
            </p>
          </div>

          {/* Discover */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-[1.5px]">
              Discover
            </h3>

            <div className="mt-4 flex flex-col items-start gap-3.5 text-sm text-[#69776c] sm:mt-5 sm:gap-4">
              <a
                href="#how-it-works"
                className="transition hover:text-[#bd7148]"
              >
                How it works
              </a>
              <a href="#about" className="transition hover:text-[#bd7148]">
                Our mission
              </a>
              <a href="#impact" className="transition hover:text-[#bd7148]">
                Why FoodBridge
              </a>
            </div>
          </div>

          {/* Get involved */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-[1.5px]">
              Get involved
            </h3>

            <div className="mt-4 flex flex-col items-start gap-3.5 text-sm text-[#69776c] sm:mt-5 sm:gap-4">
              <Link
                to="/auth"
                className="transition hover:text-[#bd7148]"
              >
                Donate surplus food ↗
              </Link>

              <Link
                to="/auth"
                className="transition hover:text-[#bd7148]"
              >
                Find food support ↗
              </Link>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-[#193c2c]/10">
          <div className="mx-auto flex max-w-[1440px] flex-col gap-2 px-5 py-5 text-xs leading-5 text-[#879086] sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-14">
            <p>
              © {new Date().getFullYear()} FoodBridge. Made for a better
              tomorrow.
            </p>

            <p>Less waste. More care. Stronger communities.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Home;