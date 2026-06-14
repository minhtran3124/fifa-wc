"use client";

import { useEffect, useState } from "react";

function parts(ms: number) {
  const s = Math.max(0, Math.floor(ms / 1000));
  const d = Math.floor(s / 86400);
  const h = Math.floor((s % 86400) / 3600);
  const m = Math.floor((s % 3600) / 60);
  return { d, h, m };
}

export default function Countdown({ iso }: { iso: string }) {
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    setNow(Date.now());
    const t = setInterval(() => setNow(Date.now()), 30_000);
    return () => clearInterval(t);
  }, []);

  // avoid hydration mismatch: render nothing until mounted on the client
  if (now === null) return <span className="text-white/40">Kicks off soon</span>;

  const diff = new Date(iso).getTime() - now;
  if (diff <= 0) return <span className="font-semibold text-red-400">Kicking off…</span>;

  const { d, h, m } = parts(diff);
  const label = d > 0 ? `${d}d ${h}h ${m}m` : h > 0 ? `${h}h ${m}m` : `${m}m`;
  return (
    <span>
      Kicks off in <span className="font-semibold text-gold tabular-nums">{label}</span>
    </span>
  );
}
