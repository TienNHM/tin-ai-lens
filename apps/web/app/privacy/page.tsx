import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy — TinAiLens",
  description:
    "How TinAiLens handles page content, BYOK API keys, and local history.",
};

export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <p className="text-sm text-ink-soft">
        <Link href="/" className="text-pine hover:underline">
          TinAiLens
        </Link>
        <span className="mx-2">/</span>
        Privacy
      </p>

      <h1 className="mt-6 font-display text-4xl tracking-tight text-ink">
        Privacy Policy
      </h1>
      <p className="mt-3 text-sm text-ink-soft">Last updated: 1 August 2026</p>

      <div className="prose-store mt-10 space-y-8 text-base leading-relaxed text-ink-soft">
        <section className="space-y-3">
          <h2 className="font-display text-2xl tracking-tight text-ink">
            Summary
          </h2>
          <p>
            TinAiLens is a Chrome Trust Assistant (“Think Before You Trust.”).
            Analysis runs on your device and, when you choose, through{" "}
            <strong className="font-medium text-ink">your own</strong> Gemini or
            OpenAI API key. The community extension build does not send page
            bodies to a TinAiLens analyze server. We do not sell personal data.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-2xl tracking-tight text-ink">
            Data the extension processes
          </h2>
          <ul className="list-disc space-y-2 pl-5">
            <li>
              <strong className="font-medium text-ink">Page content</strong> —
              After you click Analyze, the extension reads the active tab
              (title, URL, readable text) and sends it to the AI provider you
              configured, using your API key.
            </li>
            <li>
              <strong className="font-medium text-ink">API keys (BYOK)</strong> —
              Stored only in Chrome local extension storage on your computer.
              Not uploaded to TinAiLens.
            </li>
            <li>
              <strong className="font-medium text-ink">Local history</strong> —
              Trust Reports (not full page markdown) may be saved locally. You
              can delete items or clear all history in the extension.
            </li>
            <li>
              <strong className="font-medium text-ink">Locale</strong> — Language
              preference (VI/EN) is stored locally.
            </li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-2xl tracking-tight text-ink">
            Permissions
          </h2>
          <ul className="list-disc space-y-2 pl-5">
            <li>
              Read the current page when you ask to analyze it (content scripts /
              active tab).
            </li>
            <li>
              Storage for settings, API key, locale, and local Trust Report
              history.
            </li>
            <li>
              Network access to Google Generative Language and/or OpenAI so your
              key can call the provider you selected.
            </li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-2xl tracking-tight text-ink">
            Third parties
          </h2>
          <p>
            Google (Gemini) and/or OpenAI process content under their own API
            terms when you use their keys. Chrome provides extension storage and
            distribution. We do not use advertising SDKs.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-2xl tracking-tight text-ink">
            Retention & contact
          </h2>
          <p>
            Local data remains until you clear it or uninstall. Provider
            retention follows their policies. Contact:{" "}
            <a
              className="text-pine hover:underline"
              href="mailto:privacy@tinailens.com"
            >
              privacy@tinailens.com
            </a>
            . Site:{" "}
            <a
              className="text-pine hover:underline"
              href="https://tiennhm.github.io/tin-ai-lens/"
            >
              tiennhm.github.io/tin-ai-lens
            </a>
            .
          </p>
        </section>
      </div>
    </main>
  );
}
