"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/groups", label: "Tables" },
  { href: "/matches", label: "Matches" },
  { href: "/knockout", label: "Knockout" },
  { href: "/stats", label: "Stats" },
];

export default function AlbumNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <>
      <button
        type="button"
        className="al-burger"
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        aria-controls="al-nav"
        onClick={() => setOpen((o) => !o)}
      >
        <span aria-hidden>{open ? "✕" : "☰"}</span>
      </button>
      <nav id="al-nav" className={`al-nav ${open ? "open" : ""}`} aria-label="Album sections">
        {LINKS.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            aria-current={isActive(l.href) ? "page" : undefined}
            className={`al-tab ${isActive(l.href) ? "active" : ""}`}
            onClick={() => setOpen(false)}
          >
            {l.label}
          </Link>
        ))}
      </nav>
    </>
  );
}
