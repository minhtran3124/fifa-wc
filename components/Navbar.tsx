"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "@/components/Logo";

const LINKS = [
  { href: "/", label: "Overview" },
  { href: "/groups", label: "Table" },
  { href: "/matches", label: "Matches" },
  { href: "/knockout", label: "Knockout" },
  { href: "/stats", label: "Stats" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  // close the mobile menu on navigation
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // close on Escape
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const bar =
    "absolute left-1/2 h-0.5 w-5 -translate-x-1/2 rounded-full bg-current transition-all duration-300 ease-in-out motion-reduce:transition-none";

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-ink/80 backdrop-blur-xl [padding-left:env(safe-area-inset-left)] [padding-right:env(safe-area-inset-right)]">
      <nav className="relative mx-auto flex max-w-6xl items-center justify-between gap-2 px-4 py-2.5 sm:gap-4 sm:py-3">
        <Link href="/" className="shrink-0" aria-label="World Cup 2026 home">
          <Logo />
        </Link>

        {/* desktop links */}
        <ul className="hidden items-center gap-1 text-sm sm:flex">
          {LINKS.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                className={`block whitespace-nowrap rounded-full px-3 py-2 font-medium transition-colors ${
                  isActive(l.href)
                    ? "bg-gold text-ink"
                    : "text-white/70 hover:bg-white/10 hover:text-white"
                }`}
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* mobile hamburger (animates to an X) */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="mobile-menu"
          className="relative grid h-10 w-10 place-items-center rounded-lg text-white/85 transition-colors hover:bg-white/10 sm:hidden"
        >
          <span className="relative block h-4 w-5">
            <span className={`${bar} ${open ? "top-1/2 -translate-y-1/2 rotate-45" : "top-0"}`} />
            <span className={`${bar} top-1/2 -translate-y-1/2 ${open ? "opacity-0" : "opacity-100"}`} />
            <span className={`${bar} ${open ? "top-1/2 -translate-y-1/2 -rotate-45" : "bottom-0"}`} />
          </span>
        </button>
      </nav>

      {/* dimmed overlay (fades) */}
      <div
        aria-hidden="true"
        onClick={() => setOpen(false)}
        className={`fixed inset-0 z-40 bg-black/40 transition-opacity duration-200 sm:hidden motion-reduce:transition-none ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      {/* mobile dropdown (slides + fades) */}
      <div
        id="mobile-menu"
        inert={!open}
        className={`absolute inset-x-0 top-full z-50 origin-top border-b border-white/10 bg-ink/95 px-4 pb-3 pt-1 shadow-xl backdrop-blur-xl transition-all duration-200 ease-out sm:hidden motion-reduce:transition-none ${
          open
            ? "translate-y-0 opacity-100"
            : "pointer-events-none -translate-y-2 opacity-0"
        }`}
      >
        <ul className="flex flex-col gap-1">
          {LINKS.map((l, i) => (
            <li
              key={l.href}
              className={`transition-all duration-300 ease-out motion-reduce:transition-none motion-reduce:!translate-y-0 ${
                open ? "translate-y-0 opacity-100" : "translate-y-1 opacity-0"
              }`}
              style={{ transitionDelay: open ? `${60 + i * 45}ms` : "0ms" }}
            >
              <Link
                href={l.href}
                onClick={() => setOpen(false)}
                className={`block rounded-lg px-3 py-3 text-base font-medium transition-colors ${
                  isActive(l.href)
                    ? "bg-gold text-ink"
                    : "text-white/80 hover:bg-white/10 hover:text-white"
                }`}
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </header>
  );
}
