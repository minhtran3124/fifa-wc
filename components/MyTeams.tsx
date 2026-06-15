"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getTeam } from "@/lib/teams";
import { slotLabel } from "@/lib/matches";
import { fmtDate } from "@/lib/format";
import type { Match } from "@/lib/types";
import type { Locale } from "@/lib/i18n";
import type { Dictionary } from "@/lib/dictionaries";
import { getFavorites, FAV_EVENT } from "@/lib/favorites";

function opponent(m: Match, id: string) {
  const isHome = m.home === id;
  const oppId = isHome ? m.away : m.home;
  const oppName = isHome ? m.awayName : m.homeName;
  const opp = getTeam(oppId);
  return { flag: opp?.flag ?? "⬜", name: opp?.name ?? oppName ?? slotLabel(oppId) };
}

export default function MyTeams({
  matches,
  locale,
  dict,
}: {
  matches: Match[];
  locale: Locale;
  dict: Dictionary;
}) {
  const [favs, setFavs] = useState<string[] | null>(null);

  useEffect(() => {
    const read = () => setFavs(getFavorites());
    read();
    window.addEventListener(FAV_EVENT, read);
    return () => window.removeEventListener(FAV_EVENT, read);
  }, []);

  if (!favs || favs.length === 0) return null;
  const teams = favs.map((id) => getTeam(id)).filter((t) => t != null);
  if (teams.length === 0) return null;

  return (
    <section className="al-sec">
      <div className="al-sec-head">
        <div>
          <span className="scribble">{dict.fav.myTeamsKicker}</span>
          <h2>{dict.fav.myTeams}</h2>
        </div>
      </div>
      <div className="al-myteams">
        {teams.map((t) => {
          const ms = matches.filter((m) => m.home === t.id || m.away === t.id);
          const last = ms
            .filter((m) => m.status === "finished")
            .sort((a, b) => b.date.localeCompare(a.date))[0];
          const next = ms
            .filter((m) => m.status === "scheduled")
            .sort((a, b) => a.date.localeCompare(b.date))[0];
          const lastUs = last ? (last.home === t.id ? last.homeScore : last.awayScore) : null;
          const lastThem = last ? (last.home === t.id ? last.awayScore : last.homeScore) : null;
          return (
            <Link key={t.id} href={`/${locale}/teams/${t.id}`} className="al-myteam">
              <span className="hd">
                <span className="fl">{t.flag}</span>
                <span className="nm">{t.name}</span>
              </span>
              {last && lastUs != null && lastThem != null && (
                <span className="ln">
                  <b>{dict.fav.last}</b> {opponent(last, t.id).flag} {lastUs}–{lastThem}
                </span>
              )}
              {next && (
                <span className="ln">
                  <b>{dict.fav.next}</b> {opponent(next, t.id).flag} {opponent(next, t.id).name} · {fmtDate(next.date, locale)}
                </span>
              )}
            </Link>
          );
        })}
      </div>
    </section>
  );
}
