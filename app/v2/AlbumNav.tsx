"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/v2", label: "Home" },
  { href: "/v2/groups", label: "Tables" },
  { href: "/v2/matches", label: "Matches" },
  { href: "/v2/knockout", label: "Knockout" },
  { href: "/v2/stats", label: "Stats" },
];

export default function AlbumNav() {
  const pathname = usePathname();
  const isActive = (href: string) =>
    href === "/v2" ? pathname === "/v2" : pathname.startsWith(href);

  return (
    <nav className="al-nav" aria-label="Album sections">
      {LINKS.map((l) => (
        <Link
          key={l.href}
          href={l.href}
          aria-current={isActive(l.href) ? "page" : undefined}
          className={`al-tab ${isActive(l.href) ? "active" : ""}`}
        >
          {l.label}
        </Link>
      ))}
      <Link href="/" className="al-tab classic">Classic site</Link>
    </nav>
  );
}
