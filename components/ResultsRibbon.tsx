"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import type { Locale } from "@/lib/i18n";

export interface RibbonItem {
  id: string;
  homeCode: string;
  awayCode: string;
  homeFlag: string;
  awayFlag: string;
  homeScore: number;
  awayScore: number;
}

/**
 * FIFA-style horizontal ribbon of recent results as circular badges. The track
 * auto-scrolls like a conveyor belt (items are duplicated for a seamless loop),
 * pauses on hover, and still responds to the arrow buttons. Honours
 * prefers-reduced-motion (no auto-scroll; manual scroll/arrows only).
 */
export default function ResultsRibbon({ items, locale }: { items: RibbonItem[]; locale: Locale }) {
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let paused = false;
    const pause = () => (paused = true);
    const resume = () => (paused = false);
    el.addEventListener("pointerenter", pause);
    el.addEventListener("pointerleave", resume);
    el.addEventListener("pointerdown", pause);
    el.addEventListener("pointerup", resume);

    const SPEED = 0.5; // px per frame (~30px/s at 60fps)
    let raf = 0;
    const tick = () => {
      const half = el.scrollWidth / 2; // one copy of the list
      if (!paused && document.visibilityState === "visible" && half > el.clientWidth) {
        el.scrollLeft += SPEED;
        if (el.scrollLeft >= half) el.scrollLeft -= half;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener("pointerenter", pause);
      el.removeEventListener("pointerleave", resume);
      el.removeEventListener("pointerdown", pause);
      el.removeEventListener("pointerup", resume);
    };
  }, [items.length]);

  const scroll = (dir: number) => {
    const el = trackRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: "smooth" });
  };

  const bubble = (it: RibbonItem, dup: boolean) => {
    const homeWin = it.homeScore > it.awayScore;
    const awayWin = it.awayScore > it.homeScore;
    return (
      <Link
        key={dup ? `dup-${it.id}` : it.id}
        href={`/${locale}/matches/${it.id}`}
        className="rib-item"
        aria-hidden={dup || undefined}
        tabIndex={dup ? -1 : undefined}
      >
        <span className="rib-circle">
          <span className="fl">{it.homeFlag}</span>
          <span className="fl">{it.awayFlag}</span>
        </span>
        <span className="rib-cap">
          <b className={homeWin ? "win" : ""}>{it.homeCode}</b> {it.homeScore}-{it.awayScore}{" "}
          <b className={awayWin ? "win" : ""}>{it.awayCode}</b>
        </span>
      </Link>
    );
  };

  return (
    <div className="rib-wrap">
      <button type="button" className="rib-arrow prev" onClick={() => scroll(-1)} aria-label="Scroll left">
        ‹
      </button>
      <div className="rib-track" ref={trackRef}>
        {items.map((it) => bubble(it, false))}
        {items.map((it) => bubble(it, true))}
      </div>
      <button type="button" className="rib-arrow next" onClick={() => scroll(1)} aria-label="Scroll right">
        ›
      </button>
    </div>
  );
}
