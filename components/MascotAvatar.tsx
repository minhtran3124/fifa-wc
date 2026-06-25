"use client";

import type { CSSProperties } from "react";
import type { Mood } from "@/lib/pet";

/**
 * The single render seam for a mascot. v1 draws the emoji + CSS mood effects;
 * a later version can swap the internals for drawn art (`<img>`/SVG) without
 * touching any caller.
 */
export default function MascotAvatar({
  emoji,
  accent,
  mood,
  eating = false,
  size = 92,
  label,
}: {
  emoji: string;
  accent: string;
  mood: Mood;
  eating?: boolean;
  size?: number;
  /** accessible name, e.g. "Maple — hungry" */
  label: string;
}) {
  const style = { "--pet-accent": accent, "--pet-size": `${size}px` } as CSSProperties;
  return (
    <span
      className={`pet-avatar mood-${mood}${eating ? " eating" : ""}`}
      style={style}
      role="img"
      aria-label={label}
    >
      <span className="pet-glow" aria-hidden />
      <span className="pet-emoji" aria-hidden>{emoji}</span>
      {/* mood overlays — decorative */}
      {mood === "happy" && <span className="pet-fx sparkle" aria-hidden>✨</span>}
      {(mood === "hungry" || mood === "weak") && <span className="pet-fx drop" aria-hidden>💧</span>}
      {mood === "gaunt" && <span className="pet-fx fly" aria-hidden>🪰</span>}
      {(mood === "weak" || mood === "gaunt") && <span className="pet-fx zzz" aria-hidden>💤</span>}
      {eating && <span className="pet-fx heart" aria-hidden>💕</span>}
    </span>
  );
}
