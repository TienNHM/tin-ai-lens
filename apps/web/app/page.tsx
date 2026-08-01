import Image from "next/image";
import Link from "next/link";

/** Prefix public assets for GitHub Pages basePath (Image unoptimized can skip auto-prefix). */
const BASE = (process.env.NEXT_PUBLIC_BASE_PATH ?? "").replace(/\/$/, "");
const asset = (path: string) =>
  `${BASE}${path.startsWith("/") ? path : `/${path}`}`;

const PRODUCT_SHOTS = [
  {
    src: asset("/screenshots/01-main-popup.png"),
    alt: "TinAiLens popup on an article — Analyze current page",
    caption: "Popup",
  },
  {
    src: asset("/screenshots/02-settings-byok.png"),
    alt: "Settings with bring-your-own Gemini or OpenAI API key",
    caption: "BYOK Settings",
  },
  {
    src: asset("/screenshots/03-trust-score.png"),
    alt: "Trust Score with summary and reasons",
    caption: "Trust Score",
  },
  {
    src: asset("/screenshots/04-signals-claims.png"),
    alt: "Trust signals and key claims in the report",
    caption: "Signals & claims",
  },
  {
    src: asset("/screenshots/05-suggestions.png"),
    alt: "Verification suggestions and uncertainty notes",
    caption: "Suggestions",
  },
] as const;

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
  const [heroShot, ...moreShots] = PRODUCT_SHOTS;

  return (
    <main>
      <section className="relative min-h-[100svh] overflow-hidden">
        <HeroLensVisual />

        <div className="relative z-10 mx-auto flex min-h-[100svh] max-w-5xl flex-col px-6 pb-20 pt-8">
          <nav className="flex items-center justify-between animate-rise">
            <span className="font-display text-lg font-semibold tracking-tight">
              TinAiLens
            </span>
            <div className="flex items-center gap-5 text-sm text-ink-soft">
              <a href="#product" className="transition-colors hover:text-pine">
                Product
              </a>
              <a href="#install" className="transition-colors hover:text-pine">
                Install
              </a>
            </div>
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
                href="#install"
                className="inline-flex items-center justify-center rounded-full bg-pine px-5 py-3 text-sm font-semibold text-white transition hover:bg-pine-deep"
              >
                Get the Chrome extension
              </a>
              <a
                href="#product"
                className="inline-flex items-center justify-center rounded-full border border-line/80 bg-white/40 px-5 py-3 text-sm font-medium text-ink backdrop-blur-sm transition hover:border-pine/40"
              >
                See the product
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

      <section id="product" className="px-6 py-20">
        <div className="mx-auto max-w-5xl">
          <h2 className="font-display text-3xl tracking-tight sm:text-4xl">
            The extension, as it looks.
          </h2>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-ink-soft">
            Popup, bring-your-own key settings, and the Trust Report — captured
            from the real Chrome UI.
          </p>

          <figure className="shot-rise mt-12">
            <Image
              src={heroShot.src}
              alt={heroShot.alt}
              width={1280}
              height={800}
              className="h-auto w-full"
              priority
              sizes="(max-width: 1024px) 100vw, 1024px"
            />
            <figcaption className="mt-3 text-sm text-ink-soft">
              {heroShot.caption}
            </figcaption>
          </figure>

          <div className="mt-10 grid gap-8 sm:grid-cols-2">
            {moreShots.map((shot, i) => (
              <figure
                key={shot.src}
                className="shot-rise"
                style={{ animationDelay: `${120 + i * 80}ms` }}
              >
                <Image
                  src={shot.src}
                  alt={shot.alt}
                  width={1280}
                  height={800}
                  className="h-auto w-full"
                  sizes="(max-width: 640px) 100vw, 50vw"
                />
                <figcaption className="mt-3 text-sm text-ink-soft">
                  {shot.caption}
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section id="how" className="border-t border-line bg-mist/50 px-6 py-20">
        <div className="mx-auto max-w-3xl">
          <h2 className="font-display text-3xl tracking-tight">How it works</h2>
          <ol className="mt-8 space-y-6 text-ink-soft">
            <li className="grid gap-1 sm:grid-cols-[4rem_1fr] sm:items-baseline">
              <span className="font-display text-2xl text-pine">01</span>
              <span>
                In Settings, paste your own Gemini or OpenAI API key (stays on
                your device).
              </span>
            </li>
            <li className="grid gap-1 sm:grid-cols-[4rem_1fr] sm:items-baseline">
              <span className="font-display text-2xl text-pine">02</span>
              <span>Open any text-heavy article in Chrome.</span>
            </li>
            <li className="grid gap-1 sm:grid-cols-[4rem_1fr] sm:items-baseline">
              <span className="font-display text-2xl text-pine">03</span>
              <span>
                Click Analyze — read the Trust Report, then you decide what to
                trust next.
              </span>
            </li>
          </ol>

          <p className="mt-10 text-sm leading-relaxed text-ink-soft">
            Analysis runs against your provider — not a TinAiLens backend. See
            our{" "}
            <Link href="/privacy/" className="text-pine hover:underline">
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </section>

      <section id="install" className="px-6 py-20">
        <div className="mx-auto max-w-3xl">
          <h2 className="font-display text-3xl tracking-tight">
            Get TinAiLens for Chrome
          </h2>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-ink-soft">
            Chrome Web Store listing is in review. When it is live, install from
            the Store — free community BYOK, no TinAiLens account.
          </p>
          <p className="mt-8 text-sm text-ink-soft">
            Prefer source? Follow the monorepo README to load the unpacked
            production build while the listing is pending.
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
            <li>Local history stores Trust Reports only — not full page bodies.</li>
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
