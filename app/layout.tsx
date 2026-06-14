import type { Metadata, Viewport } from "next";
import { Manrope, Big_Shoulders } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

const headline = Big_Shoulders({
  subsets: ["latin"],
  weight: ["600", "700", "800", "900"],
  variable: "--font-headline",
  display: "swap",
});

export const metadata: Metadata = {
  title: "FIFA World Cup 2026 — Overview, Tables, Matches & Stats",
  description:
    "Follow the 2026 FIFA World Cup across the USA, Canada and Mexico — group tables, full match schedule, the knockout bracket and tournament stats.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#0b1020",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${manrope.variable} ${headline.variable}`}>
      <body>
        <Navbar />
        <main className="mx-auto max-w-6xl px-4 py-6 sm:py-10">{children}</main>
        <footer className="mt-8 border-t border-line/60">
          <div className="mx-auto max-w-6xl px-4 py-8 text-center text-xs text-white/40">
            <p className="mb-3 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-sm text-white/55">
              <span className="text-base">🫎</span> Maple
              <span className="text-white/20">·</span>
              <span className="text-base">🐆</span> Zayu
              <span className="text-white/20">·</span>
              <span className="text-base">🦅</span> Clutch
              <span className="ml-1 text-xs text-white/35">— your World Cup 26 hosts</span>
            </p>
            <p>
              Unofficial fan project · Live data from{" "}
              <a
                href="https://www.football-data.org"
                className="text-white/60 underline-offset-2 hover:text-gold hover:underline"
              >
                football-data.org
              </a>{" "}
              · FIFA World Cup 2026 · USA · Canada · Mexico
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
