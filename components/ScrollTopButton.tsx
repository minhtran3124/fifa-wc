"use client";

import { useEffect, useState } from "react";

/** Floating button (bottom-right) that appears after scrolling down and
 *  smooth-scrolls back to the top. The app scrolls inside `.album-root`
 *  (position: fixed; overflow-y: auto), not the window, so listen to and
 *  scroll that container — falling back to the window if it's not found. */
export default function ScrollTopButton({ label }: { label: string }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const scroller = document.querySelector<HTMLElement>(".album-root");
    const node: HTMLElement | Window = scroller ?? window;
    const onScroll = () => setShow((scroller?.scrollTop ?? window.scrollY) > 600);
    onScroll();
    node.addEventListener("scroll", onScroll, { passive: true });
    return () => node.removeEventListener("scroll", onScroll);
  }, []);

  if (!show) return null;

  return (
    <button
      type="button"
      className="al-totop"
      aria-label={label}
      title={label}
      onClick={() =>
        (document.querySelector<HTMLElement>(".album-root") ?? window).scrollTo({
          top: 0,
          behavior: "smooth",
        })
      }
    >
      <span aria-hidden>↑</span>
    </button>
  );
}
