"use client";

import { useEffect, useState } from "react";
import { MASCOTS } from "@/lib/mascots";

/** Centred page-loading indicator: a spinning ball with a random host mascot
 *  below it for a bit of life. The mascot is chosen on the client (after mount)
 *  to avoid a hydration mismatch from random selection during SSR. */
export default function LoadingBall() {
  const [mascot, setMascot] = useState<(typeof MASCOTS)[number] | null>(null);

  useEffect(() => {
    setMascot(MASCOTS[Math.floor(Math.random() * MASCOTS.length)]);
  }, []);

  return (
    <div className="al-loading" role="status" aria-live="polite">
      <span className="ball" aria-hidden>
        ⚽
      </span>
      {mascot && (
        <span className="al-load-mascot" aria-hidden>
          <span className="em">{mascot.emoji}</span>
          <span className="nm">
            {mascot.flag} {mascot.name}
          </span>
        </span>
      )}
      <span className="sr-only">Loading…</span>
    </div>
  );
}
