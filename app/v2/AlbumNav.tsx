"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const LINKS = [
  { href: "/v2", label: "Home" },
  { href: "/v2/groups", label: "Tables" },
  { href: "/v2/matches", label: "Matches" },
  { href: "/v2/knockout", label: "Knockout" },
  { href: "/v2/stats", label: "Stats" },
];

export default function AlbumNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const isActive = (href: string) =>
    href === "/v2" ? pathname === "/v2" : pathname.startsWith(href);

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
