"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import type { Locale } from "@/lib/i18n";
import type { Dictionary } from "@/lib/dictionaries";

type NavLabels = Dictionary["common"]["nav"];

export default function AlbumNav({ locale, labels }: { locale: Locale; labels: NavLabels }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const base = `/${locale}`;
  const links = [
    { path: "", label: labels.home },
    { path: "/groups", label: labels.groups },
    { path: "/matches", label: labels.matches },
    { path: "/previews", label: labels.previews },
    { path: "/knockout", label: labels.knockout },
    { path: "/stats", label: labels.stats },
    { path: "/rules", label: labels.rules },
  ];
  const isActive = (path: string) =>
    path === "" ? pathname === base : pathname.startsWith(base + path);

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
        {links.map((l) => (
          <Link
            key={l.path}
            href={base + l.path}
            aria-current={isActive(l.path) ? "page" : undefined}
            className={`al-tab ${isActive(l.path) ? "active" : ""}`}
            onClick={() => setOpen(false)}
          >
            {l.label}
          </Link>
        ))}
      </nav>
    </>
  );
}
