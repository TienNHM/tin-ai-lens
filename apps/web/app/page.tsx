import Link from "next/link";

function HeroLensVisual() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      <div className="bg-drift absolute -left-[18%] -top-[28%] h-[75vmax] w-[75vmax] rounded-full bg-[radial-gradient(circle_at_center,rgba(183,212,200,0.6),transparent_64%)]" />
      <div className="bg-drift absolute -bottom-[30%] -right-[12%] h-[65vmax] w-[65vmax] rounded-full bg-[radial-gradient(circle_at_center,rgba(15,92,76,0.22),transparent_62%)] [animation-delay:-7s]" />
      <div className="lens-pulse absolute left-[58%] top-[46%] h-[min(70vw,520px)] w-[min(70vw,520px)] -translate-x-1/2 -translate-y-1/2 rounded-full border border-pine/20 bg-[radial-gradient(circle,rgba(245,248,246,0.5)_0%,rgba(15,92,76,0.12)_42%,transparent_72%)] max-md:left-1/2 max-md:top-[58%]" />
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-paper via-paper/80 to-transparent" />
    </div>
  );
}

export default function HomePage() {
  return (
    <main>
      <section className="relative min-h-[100svh] overflow-hidden">
        <HeroLensVisual />

        <div className="relative z-10 mx-auto flex min-h-[100svh] max-w-5xl flex-col px-6 pb-20 pt-8">
          <nav className="flex items-center justify-between animate-rise">
            <span className="font-display text-lg font-semibold tracking-tight">
              TinAiLens
            </span>
            <a
              href="#install"
              className="text-sm text-ink-soft transition-colors hover:text-pine"
            >
              Install
            </a>
          </nav>

          <div className="flex max-w-xl flex-1 flex-col justify-center pt-16 md:pt-10">
            <p className="animate-rise font-display text-[clamp(3rem,10vw,5.75rem)] font-semibold leading-[0.92] tracking-[-0.035em] text-ink">
              TinAiLens
            </p>
            <h1 className="animate-rise-delay mt-6 text-[clamp(1.4rem,3.2vw,2rem)] font-medium leading-snug tracking-tight text-ink">
              Think Before You Trust.
            </h1>
            <p className="animate-rise-delay mt-4 text-base leading-relaxed text-ink-soft sm:text-lg">
              A calm browser Trust Assistant that explains signals, uncertainty,
              and what to verify next — without deciding for you.
            </p>

            <div className="animate-rise-delay-2 mt-9 flex flex-wrap items-center gap-3">
              <a
                id="install"
                href="#how"
                className="inline-flex items-center justify-center rounded-full bg-pine px-5 py-3 text-sm font-semibold text-white transition hover:bg-pine-deep"
              >
                Get the Chrome extension
              </a>
              <a
                href="#not"
                className="inline-flex items-center justify-center rounded-full border border-line/80 bg-white/40 px-5 py-3 text-sm font-medium text-ink backdrop-blur-sm transition hover:border-pine/40"
              >
                What it is not
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-line bg-mist/70 px-6 py-20">
        <div className="mx-auto max-w-3xl">
          <h2 className="font-display text-3xl tracking-tight text-ink sm:text-4xl">
            One action. One explainable report.
          </h2>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-ink-soft">
            Open an article, click Analyze, and see a Trust Score with reasons,
            claims worth checking, and concrete next steps — so careful judgment
            fits the moment you are already reading.
          </p>
        </div>
      </section>

      <section id="how" className="px-6 py-20">
        <div className="mx-auto max-w-3xl">
          <h2 className="font-display text-3xl tracking-tight">How it works</h2>
          <ol className="mt-8 space-y-6 text-ink-soft">
            <li className="grid gap-1 sm:grid-cols-[4rem_1fr] sm:items-baseline">
              <span className="font-display text-2xl text-pine">01</span>
              <span>Open any text-heavy article in Chrome.</span>
            </li>
            <li className="grid gap-1 sm:grid-cols-[4rem_1fr] sm:items-baseline">
              <span className="font-display text-2xl text-pine">02</span>
              <span>Click TinAiLens and analyze the current page.</span>
            </li>
            <li className="grid gap-1 sm:grid-cols-[4rem_1fr] sm:items-baseline">
              <span className="font-display text-2xl text-pine">03</span>
              <span>
                Read the Trust Report — score, reasons, signals, claims,
                suggestions — then you decide.
              </span>
            </li>
          </ol>

          <div className="mt-12 overflow-hidden rounded-2xl border border-line bg-white">
            <div className="flex items-center justify-between border-b border-line px-5 py-3">
              <span className="font-display text-sm font-semibold tracking-tight text-pine">
                Example Trust Report
              </span>
              <span className="text-xs text-ink-soft">Confidence 72%</span>
            </div>
            <div className="grid gap-4 px-5 py-5 sm:grid-cols-[auto_1fr] sm:items-end">
              <div>
                <div className="text-[11px] uppercase tracking-[0.14em] text-ink-soft">
                  Trust Score
                </div>
                <div className="font-display text-5xl font-semibold tracking-tight">
                  64
                </div>
              </div>
              <p className="text-sm leading-relaxed text-ink-soft">
                Mixed sourcing on load-bearing statistics. Worth verifying the
                primary study before citing.
              </p>
            </div>
            <div className="border-t border-line px-5 py-4 text-sm text-ink-soft">
              Reason: several figures lack linked sources — not a verdict of
              false.
            </div>
          </div>

          <p className="mt-10 text-sm leading-relaxed text-ink-soft">
            Free for the community: bring your own Gemini or OpenAI API key in
            extension Settings. Analysis runs on your device against your
            provider — see our{" "}
            <Link href="/privacy/" className="text-pine hover:underline">
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </section>

      <section id="not" className="border-t border-line bg-ink px-6 py-20 text-paper">
        <div className="mx-auto max-w-3xl">
          <h2 className="font-display text-3xl tracking-tight">
            Not a detector. Not an oracle.
          </h2>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-glow">
            TinAiLens will not tell you something is fake, true, or AI-generated
            as a final label. It surfaces explainable trust signals and leaves
            the final decision with you.
          </p>
          <ul className="mt-8 space-y-3 text-mist/90">
            <li>No fear theater. No censorship tooling.</li>
            <li>Ephemeral analysis by default — privacy is part of trust.</li>
            <li>Every score comes with reasons, or it does not ship.</li>
          </ul>
        </div>
      </section>

      <footer className="border-t border-line px-6 py-10">
        <div className="mx-auto flex max-w-5xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-display text-lg font-semibold tracking-tight">
            TinAiLens
          </p>
          <div className="flex flex-wrap items-center gap-4 text-sm text-ink-soft">
            <Link href="/privacy/" className="transition hover:text-pine">
              Privacy
            </Link>
            <a
              href="https://www.facebook.com/tiennhm.vn"
              target="_blank"
              rel="noreferrer"
              className="transition hover:text-pine"
            >
              Facebook
            </a>
            <span>Think Before You Trust. Explain. Never judge.</span>
          </div>
        </div>
      </footer>
    </main>
  );
}
