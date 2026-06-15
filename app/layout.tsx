import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Manrope, Big_Shoulders, Anton, Inter, Caveat } from "next/font/google";
import "./globals.css";
import "./sticker.css";

const manrope = Manrope({ subsets: ["latin"], variable: "--font-manrope", display: "swap" });
const headline = Big_Shoulders({
  subsets: ["latin"],
  weight: ["600", "700", "800", "900"],
  variable: "--font-headline",
  display: "swap",
});
const anton = Anton({ weight: "400", subsets: ["latin"], variable: "--font-anton", display: "swap" });
const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const caveat = Caveat({ weight: "700", subsets: ["latin"], variable: "--font-caveat", display: "swap" });

export const metadata: Metadata = {
  title: {
    default: "World Cup 2026 — Sticker Album",
    template: "%s — World Cup 2026",
  },
  description:
    "A sticker-album take on the 2026 FIFA World Cup: collect all 48 nations, follow live results, tables, the bracket and stats.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#e7dcc4",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  // lang defaults to the default locale; the active locale is reflected on the
  // client by <HtmlLang> inside app/[locale]/layout.tsx.
  return (
    <html
      lang="vi"
      className={`${manrope.variable} ${headline.variable} ${anton.variable} ${inter.variable} ${caveat.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
