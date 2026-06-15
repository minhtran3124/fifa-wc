"use client";

import { useEffect } from "react";
import type { Locale } from "@/lib/i18n";

// The root <html lang> is static (default locale); reflect the active locale
// on the client for correct accessibility on non-default-locale pages.
export default function HtmlLang({ locale }: { locale: Locale }) {
  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);
  return null;
}
