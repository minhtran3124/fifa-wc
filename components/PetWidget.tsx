"use client";

import Link from "next/link";
import type { Locale } from "@/lib/i18n";
import type { Dictionary } from "@/lib/dictionaries";
import { MASCOTS } from "@/lib/mascots";
import { moodFor, type MascotId } from "@/lib/pet";
import MascotAvatar from "./MascotAvatar";
import { usePet } from "./usePet";

export default function PetWidget({
  locale,
  dict,
  playedTeamIds,
}: {
  locale: Locale;
  dict: Dictionary;
  playedTeamIds: string[];
}) {
  const { state, now, eating, doFeedAll } = usePet(playedTeamIds);
  const href = `/${locale}/pets`;

  // skeleton on first paint to avoid a hydration mismatch
  if (!state) {
    return (
      <Link href={href} className="pet-widget" aria-busy="true">
        <span className="pw-avatars">
          {MASCOTS.map((m) => (
            <MascotAvatar key={m.name} emoji={m.emoji} accent={m.accent} mood="content" size={40} label={m.name} />
          ))}
        </span>
        <span className="pw-body">
          <span className="pw-title">{dict.pet.widget.title}</span>
        </span>
      </Link>
    );
  }

  const moods = (MASCOTS.map((m) => m.name.toLowerCase()) as MascotId[]).map((id) =>
    moodFor(state.pets[id], now),
  );
  const needsCare = moods.some((m) => m === "hungry" || m === "weak" || m === "gaunt");
  const empty = state.snacks < 1;

  return (
    <div className="pet-widget">
      <Link href={href} className="pw-avatars" aria-label={dict.pet.widget.title}>
        {MASCOTS.map((m) => {
          const id = m.name.toLowerCase() as MascotId;
          return (
            <MascotAvatar
              key={m.name}
              emoji={m.emoji}
              accent={m.accent}
              mood={moodFor(state.pets[id], now)}
              eating={eating.includes(id)}
              size={40}
              label={m.name}
            />
          );
        })}
      </Link>
      <div className="pw-body">
        <Link href={href} className="pw-title">{dict.pet.widget.title}</Link>
        <span className="pw-status">
          {needsCare ? dict.pet.widget.hungryNote : dict.pet.widget.allHappy}
          {" · "}
          🍪 {state.snacks}
        </span>
      </div>
      {needsCare && !empty ? (
        <button type="button" className="pw-feed" onClick={doFeedAll}>
          {dict.pet.feedAll}
        </button>
      ) : (
        <Link href={href} className="pw-cta">{dict.pet.widget.cta}</Link>
      )}
    </div>
  );
}
