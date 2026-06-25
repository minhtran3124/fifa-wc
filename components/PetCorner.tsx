"use client";

import { useEffect, useState } from "react";
import type { Locale } from "@/lib/i18n";
import type { Dictionary } from "@/lib/dictionaries";
import { MASCOTS } from "@/lib/mascots";
import { moodFor, satietyFor, type MascotId, type Mood } from "@/lib/pet";
import PetCreature from "./PetCreature";
import { usePet } from "./usePet";
import { usePenWander } from "./usePenWander";

// how lively each mascot wanders, by mood (0 = settles in place)
const MOOD_SPEED: Record<Mood, number> = {
  happy: 1,
  content: 0.7,
  hungry: 0.45,
  weak: 0.22,
  gaunt: 0,
};

export default function PetCorner({
  locale,
  dict,
  playedTeamIds,
}: {
  locale: Locale;
  dict: Dictionary;
  playedTeamIds: string[];
}) {
  const { state, now, gained, clearGained, feedOne, doFeedAll } = usePet(playedTeamIds);
  const [toast, setToast] = useState<string | null>(null);

  // per-mascot mood (defaults to "content" before hydration → stable first paint)
  const moods: Mood[] = MASCOTS.map((m) =>
    state ? moodFor(state.pets[m.name.toLowerCase() as MascotId], now) : "content",
  );
  const speedScales = moods.map((mo) => (state ? MOOD_SPEED[mo] : 0));
  const { setPen, setCreature } = usePenWander(MASCOTS.length, speedScales);

  useEffect(() => {
    if (gained <= 0) return;
    setToast(dict.pet.earnedToast.replace("{n}", String(gained)));
    clearGained();
    const t = window.setTimeout(() => setToast(null), 2600);
    return () => window.clearTimeout(t);
  }, [gained, clearGained, dict.pet.earnedToast]);

  const empty = !state || state.snacks < 1;

  return (
    <div className="pet-wrap">
      <div className="pet-bar-head">
        <span className="pet-snacks">
          🍪 <b>{state ? state.snacks : "—"}</b> {dict.pet.snacksLabel}
        </span>
        <button type="button" className="pet-feedall" disabled={empty} onClick={doFeedAll}>
          {dict.pet.feedAll}
        </button>
      </div>
      <p className="pet-earnhint">{empty ? dict.pet.noSnacks : dict.pet.earnHint}</p>

      <div className="pet-pens">
        {MASCOTS.map((m, i) => {
          const id = m.name.toLowerCase() as MascotId;
          const mood = moods[i];
          const sat = state ? satietyFor(state.pets[id], now) : 0.6;
          const moodLabel = dict.pet.moods[mood];
          return (
            <div className={`pet-pen-card mood-${mood}`} key={id}>
              <div className="pet-pen" ref={setPen(i)}>
                <div className="pen-scene" aria-hidden>
                  <span className="pen-sky" />
                  <span className="pen-cloud c1" />
                  <span className="pen-cloud c2" />
                  <span className="pen-hill" />
                  <span className="pen-ground" />
                  <span className="pen-grass" />
                  <span className="pen-bowl" />
                  <span className="pen-sign">{m.flag}</span>
                </div>
                <div className="pen-creature" ref={setCreature(i)}>
                  <PetCreature id={id} mood={mood} />
                </div>
              </div>
              <div className="pet-pen-foot">
                <div className="pet-name">{m.name}</div>
                <div className="pet-role">
                  {m.flag} {m.animal[locale]} · {m.role[locale]}
                </div>
                <div className={`pet-mood mood-${mood}`}>{moodLabel}</div>
                <div className="pet-bar" aria-hidden>
                  <span style={{ width: `${Math.round(sat * 100)}%` }} />
                </div>
                <button
                  type="button"
                  className="pet-feed"
                  disabled={empty}
                  onClick={() => feedOne(id)}
                >
                  🍖 {dict.pet.feed}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <p className="pet-credit">
        <a href="https://github.com/tonybaloney/vscode-pets" target="_blank" rel="noopener noreferrer">
          {dict.pet.credit}
        </a>
      </p>

      {toast && (
        <div className="pet-toast" role="status">
          {toast}
        </div>
      )}
    </div>
  );
}
