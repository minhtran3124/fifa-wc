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

  const label = `${fav ? dict.fav.following : dict.fav.follow} · ${teamName}`;

  return (
    <button
      type="button"
      className={`al-fav ${mounted && fav ? "on" : ""}`}
      aria-pressed={mounted ? fav : undefined}
      aria-label={label}
      title={label}
      onClick={() => setFav(toggleFavorite(teamId))}
    >
      <span aria-hidden>{mounted && fav ? "★" : "☆"}</span>
    </button>
  );
}
