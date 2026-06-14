"use client";

import { useEffect, useState } from "react";

function parts(ms: number) {
  const s = Math.max(0, Math.floor(ms / 1000));
  return {
    d: Math.floor(s / 86400),
    h: Math.floor((s % 86400) / 3600),
    m: Math.floor((s % 3600) / 60),
  };
}

/** Compact album-styled countdown. Renders a stable label until mounted to
 *  avoid hydration mismatch (Date.now is client-only). */
export default function AlbumCountdown({ iso }: { iso: string }) {
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    setNow(Date.now());
    const t = setInterval(() => setNow(Date.now()), 30_000);
    return () => clearInterval(t);
  }, []);

  if (now === null) return <span>Kicks off soon</span>;

  const diff = new Date(iso).getTime() - now;
  if (diff <= 0) return <span style={{ fontWeight: 800 }}>Kicking off…</span>;

  const { d, h, m } = parts(diff);
  const label = d > 0 ? `${d}d ${h}h ${m}m` : h > 0 ? `${h}h ${m}m` : `${m}m`;
  return (
    <span>
      Kicks off in{" "}
      <span style={{ fontWeight: 800, fontVariantNumeric: "tabular-nums" }}>
        {label}
      </span>
    </span>
  );
}
