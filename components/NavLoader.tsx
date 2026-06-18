"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import LoadingBall from "./LoadingBall";

// Keep the indicator on screen at least this long so it's always visible, even
// when navigating to a prefetched static page (which is near-instant).
const MIN_VISIBLE_MS = 500;

/**
 * Global page-transition indicator. The route-level loading.tsx fallback only
 * shows when the destination's server render suspends — most pages here are
 * static and prefetched, so navigation is instant and the fallback never
 * appears. This shows the centred spinning ball the moment an internal link is
 * clicked and hides it once the route (pathname) actually changes.
 */
export default function NavLoader() {
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);
  const startRef = useRef(0);

  // Navigation finished → the pathname changed → hide the overlay, but keep it
  // up for at least MIN_VISIBLE_MS so a fast/prefetched nav still shows it.
  useEffect(() => {
    if (!loading) return;
    const remaining = Math.max(0, MIN_VISIBLE_MS - (Date.now() - startRef.current));
    const t = setTimeout(() => setLoading(false), remaining);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      // ignore modified clicks / non-primary button (new tab, etc.)
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey)
        return;
      const a = (e.target as HTMLElement | null)?.closest("a");
      if (!a) return;
      const href = a.getAttribute("href");
      const target = a.getAttribute("target");
      if (!href || href.startsWith("#") || (target && target !== "_self")) return;
      if (a.hasAttribute("download")) return;

      let url: URL;
      try {
        url = new URL(a.href, location.href);
      } catch {
        return;
      }
      if (url.origin !== location.origin) return; // external
      if (url.pathname === location.pathname && url.search === location.search) return; // same page

      startRef.current = Date.now();
      setLoading(true);
    };

    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  // Safety net: never let the overlay get stuck if a navigation is aborted.
  useEffect(() => {
    if (!loading) return;
    const t = setTimeout(() => setLoading(false), 10000);
    return () => clearTimeout(t);
  }, [loading]);

  if (!loading) return null;

  return <LoadingBall />;
}
