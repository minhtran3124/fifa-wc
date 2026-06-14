import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { Anton, Inter, Caveat } from "next/font/google";
import AlbumNav from "./AlbumNav";
import "./sticker.css";

const anton = Anton({ weight: "400", subsets: ["latin"], variable: "--font-anton", display: "swap" });
const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const caveat = Caveat({ weight: "700", subsets: ["latin"], variable: "--font-caveat", display: "swap" });

export const metadata: Metadata = {
  title: {
    default: "World Cup 2026 — Sticker Album (v2)",
    template: "%s — Sticker Album (v2)",
  },
  description:
    "A sticker-album take on the 2026 FIFA World Cup: collect all 48 nations, follow live results, tables, the bracket and stats.",
};

export default function V2Layout({ children }: { children: ReactNode }) {
  return (
    <div className={`album-root ${anton.variable} ${inter.variable} ${caveat.variable}`}>
      <div className="al-bar">
        <div className="al-bar-inner">
          <Link href="/v2" className="al-brand">
            <span className="al-badge">Official Collection</span>
            <span className="wm">World Cup 2026 · Sticker Album</span>
          </Link>
          <AlbumNav />
        </div>
      </div>

      <main className="al-wrap">{children}</main>

      <footer className="al-foot">
        <div className="inner">
          <p className="al-foot-mascots">🫎 Maple · 🐆 Zayu · 🦅 Clutch — your World Cup 26 hosts</p>
          <p>
            Unofficial fan project · Sticker-album concept (v2) · FIFA World Cup 2026 ·
            USA · Canada · Mexico
          </p>
        </div>
      </footer>
    </div>
  );
}
