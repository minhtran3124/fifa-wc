"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { locales, type Locale } from "@/lib/i18n";

const STRIP = new RegExp(`^/(${locales.join("|")})(?=/|$)`);

// VI / EN toggle that keeps the user on the same page under the other locale.
export default function LangSwitch({ locale }: { locale: Locale }) {
  const pathname = usePathname();
  const rest = pathname.replace(STRIP, "");

  return (
    <div className="al-lang" role="group" aria-label="Language">
      {locales.map((l) => (
        <Link
          key={l}
          href={`/${l}${rest}`}
          className={`al-lang-opt ${l === locale ? "active" : ""}`}
          aria-current={l === locale ? "true" : undefined}
        >
          {l.toUpperCase()}
        </Link>
      ))}
    </div>
  );
}
