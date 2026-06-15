import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { locales, defaultLocale } from "@/lib/i18n";

// Ensure every request carries a locale prefix. Bare paths redirect to the
// default locale (vi); legacy /v2/* links redirect into the default locale too.
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/v2" || pathname.startsWith("/v2/")) {
    const url = request.nextUrl.clone();
    url.pathname = `/${defaultLocale}${pathname.slice(3)}`;
    return NextResponse.redirect(url);
  }

  const hasLocale = locales.some(
    (l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`),
  );
  if (hasLocale) return;

  const url = request.nextUrl.clone();
  url.pathname = `/${defaultLocale}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  // skip Next internals, the API, and any file with an extension (icon.svg, etc.)
  matcher: ["/((?!_next|api|.*\\..*).*)"],
};
