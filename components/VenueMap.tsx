"use client";

import { useState } from "react";
import Link from "next/link";
import type { Locale } from "@/lib/i18n";
import type { Dictionary } from "@/lib/dictionaries";

/* One match played at a venue — display strings are pre-formatted server-side. */
export type VenueMatch = {
  id: string;
  stageLabel: string;
  dateLabel: string;
  home: { flag: string; name: string };
  away: { flag: string; name: string };
  homeScore: number | null;
  awayScore: number | null;
  scored: boolean;
  live: boolean;
};

export type VenueNode = {
  id: string;
  city: string;
  country: "USA" | "Canada" | "Mexico";
  stadium: string;
  lat: number;
  lng: number;
  matches: VenueMatch[];
};

/* equirectangular projection across North America, padded off the edges */
const LNG_MIN = -125, LNG_SPAN = 56; // -125 … -69
const LAT_MAX = 51, LAT_SPAN = 34; //   17 … 51
const PAD = 7, INNER = 86;
const projX = (lng: number) => PAD + ((lng - LNG_MIN) / LNG_SPAN) * INNER;
const projY = (lat: number) => PAD + ((LAT_MAX - lat) / LAT_SPAN) * INNER;

const COUNTRY_LABELS: { country: VenueNode["country"]; lat: number; lng: number }[] = [
  { country: "Canada", lat: 50.5, lng: -113 },
  { country: "USA", lat: 41.5, lng: -99 },
  { country: "Mexico", lat: 22, lng: -103.5 },
];

export default function VenueMap({
  venues,
  locale,
  dict,
}: {
  venues: VenueNode[];
  locale: Locale;
  dict: Dictionary;
}) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = venues.find((v) => v.id === selectedId) ?? null;
  const maxMatches = Math.max(...venues.map((v) => v.matches.length), 1);

  return (
    <div className="al-vmap-wrap">
      <div className="al-vmap" role="group" aria-label={dict.venues.title}>
        {/* faint graticule */}
        <div className="al-vmap-grid" aria-hidden />

        {COUNTRY_LABELS.map((c) => (
          <span
            key={c.country}
            className={`al-vmap-country ${c.country.toLowerCase()}`}
            style={{ left: `${projX(c.lng)}%`, top: `${projY(c.lat)}%` }}
            aria-hidden
          >
            {dict.venues.countries[c.country]}
          </span>
        ))}

        {venues.map((v) => {
          const active = v.id === selectedId;
          const scale = 0.7 + (v.matches.length / maxMatches) * 0.6;
          return (
            <button
              type="button"
              key={v.id}
              className={`al-vmap-pin ${v.country.toLowerCase()} ${active ? "active" : ""}`}
              style={{ left: `${projX(v.lng)}%`, top: `${projY(v.lat)}%` }}
              onClick={() => setSelectedId(active ? null : v.id)}
              aria-pressed={active}
              aria-label={`${v.city} — ${v.matches.length} ${dict.venues.matchesHere}`}
            >
              <span className="dot" style={{ ["--s" as string]: scale }} />
              <span className="lbl">{v.city}</span>
            </button>
          );
        })}
      </div>

      <aside className="al-vmap-side">
        {selected ? (
          <div className="al-vmap-detail al-reveal" key={selected.id}>
            <div className="al-vmap-detail-hd">
              <span className={`tag ${selected.country.toLowerCase()}`}>
                {dict.venues.countries[selected.country]}
              </span>
              <h2>{selected.city}</h2>
              <p className="stad">🏟️ {selected.stadium}</p>
              <p className="ct">
                {selected.matches.length} {dict.venues.matchesHere}
              </p>
            </div>
            <ol className="al-vmap-matches">
              {selected.matches.map((m) => (
                <li key={m.id}>
                  <Link href={`/${locale}/matches/${m.id}`}>
                    <span className="stg">{m.stageLabel}</span>
                    <span className="ln">
                      <span className="tm">
                        <span className="fl">{m.home.flag}</span>
                        <span className="nm">{m.home.name}</span>
                      </span>
                      <span className="mid">
                        {m.scored ? (
                          <span className="sc">{m.homeScore}–{m.awayScore}</span>
                        ) : (
                          <span className="vs">v</span>
                        )}
                      </span>
                      <span className="tm r">
                        <span className="nm">{m.away.name}</span>
                        <span className="fl">{m.away.flag}</span>
                      </span>
                    </span>
                    <span className="dt">
                      {m.live ? <span className="live"><i />{" "}LIVE</span> : m.dateLabel}
                    </span>
                  </Link>
                </li>
              ))}
            </ol>
          </div>
        ) : (
          <div className="al-vmap-hint">
            <span className="pin" aria-hidden>📍</span>
            <p>{dict.venues.tapHint}</p>
          </div>
        )}
      </aside>
    </div>
  );
}
