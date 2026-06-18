import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Manrope, Big_Shoulders, Anton, Inter, Caveat } from "next/font/google";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getDictionary } from "@/lib/dictionaries";
import { isLocale, locales } from "@/lib/i18n";
import AlbumNav from "@/components/AlbumNav";
import LangSwitch from "@/components/LangSwitch";
import ScrollTopButton from "@/components/ScrollTopButton";
import NavLoader from "@/components/NavLoader";
import "../globals.css";
import "../sticker.css";

const manrope = Manrope({ subsets: ["latin", "vietnamese"], variable: "--font-manrope", display: "swap" });
const headline = Big_Shoulders({
  subsets: ["latin", "vietnamese"],
  weight: ["600", "700", "800", "900"],
  variable: "--font-headline",
  display: "swap",
});
const anton = Anton({ weight: "400", subsets: ["latin", "vietnamese"], variable: "--font-anton", display: "swap" });
const inter = Inter({ subsets: ["latin", "vietnamese"], variable: "--font-inter", display: "swap" });
const caveat = Caveat({ weight: "700", subsets: ["latin", "latin-ext"], variable: "--font-caveat", display: "swap" });

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

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale);

  return (
    <html
      lang={locale}
      className={`${manrope.variable} ${headline.variable} ${anton.variable} ${inter.variable} ${caveat.variable}`}
    >
      <body>
        <div className="album-root">
          <div className="al-bar">
            <div className="al-bar-inner">
              <Link href={`/${locale}`} className="al-brand">
                <span className="al-badge">{dict.common.badge}</span>
                <span className="wm">{dict.common.brand}</span>
              </Link>
              <div className="al-bar-right">
                <AlbumNav locale={locale} labels={dict.common.nav} />
                <LangSwitch locale={locale} />
              </div>
            </div>
          </div>

          <main className="al-wrap">{children}</main>

          <footer className="al-foot">
            <div className="inner">
              <p className="al-foot-mascots">{dict.footer.mascots}</p>
              <p>{dict.footer.tagline}</p>
            </div>
          </footer>

          <ScrollTopButton label={dict.common.toTop} />
          <NavLoader />
        </div>
      </body>
    </html>
  );
}
