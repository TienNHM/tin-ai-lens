import type { Metadata } from "next";
import { Figtree, Fraunces } from "next/font/google";

import "./globals.css";

const display = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
});

const sans = Figtree({
  subsets: ["latin"],
  variable: "--font-figtree",
  display: "swap",
});

export const metadata: Metadata = {
  title: "TinAiLens — Think Before You Trust",
  description:
    "A calm browser Trust Assistant that explains trust signals, uncertainty, and what to verify next — without deciding for you.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable}`}>
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
