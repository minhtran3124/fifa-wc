import type { ReactNode } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getDictionary } from "@/lib/dictionaries";
import { isLocale, locales } from "@/lib/i18n";
import AlbumNav from "@/components/AlbumNav";
import LangSwitch from "@/components/LangSwitch";
import HtmlLang from "@/components/HtmlLang";

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
    <div className="album-root">
      <HtmlLang locale={locale} />
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
    </div>
  );
}
