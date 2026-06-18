"use client";

import { useEffect, useState } from "react";
import { groupSquad, type SquadPlayer } from "@/lib/squads";
import type { Dictionary } from "@/lib/dictionaries";
import type { Locale } from "@/lib/i18n";

type SquadLabels = Dictionary["team"]["squad"];

// Renders a squad grouped by position. Shared by the team page and the match
// detail page. Each player opens a detail modal (enriched data from squads.json).
export default function SquadList({
  squad,
  labels,
  locale,
}: {
  squad: SquadPlayer[];
  labels: SquadLabels;
  locale: Locale;
}) {
  const [selected, setSelected] = useState<SquadPlayer | null>(null);
  const groups = groupSquad(squad);
  if (groups.length === 0) return <p className="al-empty">{labels.empty}</p>;

  const hasDetail = squad.some((p) => p.enriched);

  return (
    <>
      {hasDetail && <p className="al-squad-hint">{labels.modal.tapHint}</p>}
      {groups.map((g) => (
        <div key={g.position} className="al-squad-group">
          <h3 className="al-squad-pos">{labels.positions[g.position]}</h3>
          <div className="al-squad">
            {g.players.map((p) => (
              <button
                key={p.id}
                type="button"
                className="al-player"
                onClick={() => setSelected(p)}
                aria-haspopup="dialog"
              >
                <span className="num">{p.number ?? "–"}</span>
                {p.photo ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img className="ph" src={p.photo} alt="" loading="lazy" />
                ) : (
                  <span className="ph ph-empty" aria-hidden />
                )}
                <span className="bd">
                  <span className="nm">{p.name}</span>
                  <span className="age">
                    {p.age != null ? `${p.age} ${labels.ageSuffix}` : ""}
                  </span>
                </span>
              </button>
            ))}
          </div>
        </div>
      ))}

      {selected && (
        <PlayerModal
          player={selected}
          labels={labels}
          locale={locale}
          onClose={() => setSelected(null)}
        />
      )}
    </>
  );
}

function fmtBirth(iso: string | null | undefined, locale: Locale): string | null {
  if (!iso) return null;
  if (/^\d{4}$/.test(iso)) return iso; // year only
  const d = new Date(iso + "T00:00:00Z");
  if (Number.isNaN(d.getTime())) return iso;
  return new Intl.DateTimeFormat(locale === "vi" ? "vi-VN" : "en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(d);
}

function PlayerModal({
  player,
  labels,
  locale,
  onClose,
}: {
  player: SquadPlayer;
  labels: SquadLabels;
  locale: Locale;
  onClose: () => void;
}) {
  const m = labels.modal;

  // Esc to close + lock background scroll while open.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  const posLabel = labels.positions[player.position as keyof typeof labels.positions] ?? player.position;
  const born = fmtBirth(player.birthDate, locale);
  const height = player.heightCm ? `${(player.heightCm / 100).toFixed(2)} m` : null;
  const capsLine =
    player.caps != null
      ? m.capsValue.replace("{caps}", String(player.caps)).replace("{goals}", String(player.goals ?? 0))
      : null;

  // Friendly stat chips that wrap to content (no rigid grid / empty cells).
  // Club lives in the header, age in the position line — so they're not repeated here.
  const isGK = player.position === "Goalkeeper";
  const chips: { icon: string; label: string; value: string }[] = [];
  if (born) chips.push({ icon: "🎂", label: m.born, value: born });
  if (height) chips.push({ icon: "📏", label: m.height, value: height });
  if (capsLine) chips.push({ icon: isGK ? "🧤" : "👕", label: m.caps, value: capsLine });

  return (
    <div className="al-modal-backdrop" onClick={onClose}>
      <div
        className="al-modal"
        role="dialog"
        aria-modal="true"
        aria-label={player.name}
        onClick={(e) => e.stopPropagation()}
      >
        <button type="button" className="al-modal-x" onClick={onClose} aria-label={m.close}>
          ✕
        </button>

        <div className="pm-head">
          {player.photo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img className="pm-photo" src={player.photo} alt="" />
          ) : (
            <span className="pm-photo pm-photo-empty" aria-hidden>
              {player.number ?? "?"}
            </span>
          )}
          <div className="pm-id">
            <span className="pm-pos">
              {posLabel}
              {player.number != null ? ` · #${player.number}` : ""}
              {player.age != null ? ` · ${player.age} ${m.ageSuffix}` : ""}
            </span>
            <h3 className="pm-name">{player.name}</h3>
            {player.club && (
              <span className="pm-club">
                <span aria-hidden>🏟️</span> {player.club}
              </span>
            )}
          </div>
        </div>

        {chips.length > 0 && (
          <div className="pm-chips">
            {chips.map((c) => (
              <div key={c.label} className="pm-chip">
                <span className="ic" aria-hidden>{c.icon}</span>
                <span className="tx">
                  <b>{c.value}</b>
                  <i>{c.label}</i>
                </span>
              </div>
            ))}
          </div>
        )}

        {player.bio && <p className="pm-bio">{player.bio}</p>}

        {!player.enriched && !player.bio && <p className="al-empty">{m.noInfo}</p>}

        {player.wikipedia && (
          <a className="pm-wiki" href={player.wikipedia} target="_blank" rel="noopener noreferrer">
            {m.wikipedia}
          </a>
        )}
      </div>
    </div>
  );
}
