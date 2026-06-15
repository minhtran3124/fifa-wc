"use client";

import { useEffect, useState } from "react";
import type { Dictionary } from "@/lib/dictionaries";
import { isFavorite, toggleFavorite } from "@/lib/favorites";

export default function FavoriteButton({
  teamId,
  teamName,
  dict,
}: {
  teamId: string;
  teamName: string;
  dict: Dictionary;
}) {
  // Render a stable (off) state on the server / first paint, then hydrate from
  // localStorage to avoid a hydration mismatch.
  const [mounted, setMounted] = useState(false);
  const [fav, setFav] = useState(false);

  useEffect(() => {
    setMounted(true);
    setFav(isFavorite(teamId));
  }, [teamId]);

  const on = mounted && fav;
  const text = on ? dict.fav.following : dict.fav.follow;

  return (
    <button
      type="button"
      className={`al-fav ${on ? "on" : ""}`}
      aria-pressed={mounted ? fav : undefined}
      aria-label={`${text} · ${teamName}`}
      onClick={() => setFav(toggleFavorite(teamId))}
    >
      <span className="ic" aria-hidden>{on ? "★" : "☆"}</span>
      <span className="tx">{text}</span>
    </button>
  );
}
