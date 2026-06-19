"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { Locale } from "@/lib/i18n";
import type { Dictionary } from "@/lib/dictionaries";
import type { Confederation } from "@/lib/types";

export type WallTeam = {
  id: string;
  name: string;
  code: string;
  flag: string;
  confederation: Confederation;
  fifaRank: number;
  pot: number;
  group: string;
  crest: string | null;
  titles: number;
};

const CONF_ORDER: Confederation[] = ["UEFA", "CONMEBOL", "CONCACAF", "CAF", "AFC", "OFC"];
type SortKey = "rank" | "group" | "name" | "pot";

/* Holographic tilt — write CSS vars straight to the node so 48 cards don't
   trigger React re-renders on every pointer move. */
function tilt(e: React.PointerEvent<HTMLAnchorElement>) {
  const el = e.currentTarget;
  const r = el.getBoundingClientRect();
  const px = (e.clientX - r.left) / r.width;
  const py = (e.clientY - r.top) / r.height;
  el.style.setProperty("--ry", `${(px - 0.5) * 16}deg`);
  el.style.setProperty("--rx", `${(0.5 - py) * 16}deg`);
  el.style.setProperty("--mx", `${px * 100}%`);
  el.style.setProperty("--my", `${py * 100}%`);
}
function untilt(e: React.PointerEvent<HTMLAnchorElement>) {
  const el = e.currentTarget;
  el.style.removeProperty("--ry");
  el.style.removeProperty("--rx");
}

export default function TeamWall({
  teams,
  locale,
  dict,
}: {
  teams: WallTeam[];
  locale: Locale;
  dict: Dictionary;
}) {
  const ti = dict.teamsIndex;
  const [q, setQ] = useState("");
  const [conf, setConf] = useState<Confederation | "all">("all");
  const [sort, setSort] = useState<SortKey>("rank");

  const confs = useMemo(
    () => CONF_ORDER.filter((c) => teams.some((t) => t.confederation === c)),
    [teams]
  );

  const shown = useMemo(() => {
    const needle = q.trim().toLowerCase();
    const list = teams.filter(
      (t) =>
        (conf === "all" || t.confederation === conf) &&
        (!needle || t.name.toLowerCase().includes(needle) || t.code.toLowerCase().includes(needle))
    );
    list.sort((a, b) => {
      if (sort === "name") return a.name.localeCompare(b.name);
      if (sort === "group") return a.group.localeCompare(b.group) || a.fifaRank - b.fifaRank;
      if (sort === "pot") return a.pot - b.pot || a.fifaRank - b.fifaRank;
      return a.fifaRank - b.fifaRank;
    });
    return list;
  }, [teams, q, conf, sort]);

  return (
    <div className="al-wall">
      <div className="al-wall-bar">
        <input
          className="al-wall-search"
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={ti.search}
          aria-label={ti.search}
        />
        <div className="al-wall-chips" role="group" aria-label={ti.sortGroup}>
          <button
            type="button"
            className={`chip ${conf === "all" ? "on" : ""}`}
            onClick={() => setConf("all")}
          >
            {ti.all} <i>{teams.length}</i>
          </button>
          {confs.map((c) => (
            <button
              type="button"
              key={c}
              className={`chip ${conf === c ? "on" : ""}`}
              onClick={() => setConf(c)}
            >
              {dict.team.regions[c]} <i>{teams.filter((t) => t.confederation === c).length}</i>
            </button>
          ))}
        </div>
        <label className="al-wall-sort">
          {ti.sortLabel}
          <select value={sort} onChange={(e) => setSort(e.target.value as SortKey)}>
            <option value="rank">{ti.sortRank}</option>
            <option value="group">{ti.sortGroup}</option>
            <option value="pot">{ti.sortPot}</option>
            <option value="name">{ti.sortName}</option>
          </select>
        </label>
      </div>

      {shown.length === 0 ? (
        <p className="al-empty">{ti.noResults}</p>
      ) : (
        <div className="al-wall-grid">
          {shown.map((t) => (
            <Link
              key={t.id}
              href={`/${locale}/teams/${t.id}`}
              className={`al-wcard pot${t.pot}${t.titles > 0 ? " champ" : ""}`}
              onPointerMove={tilt}
              onPointerLeave={untilt}
            >
              <span className="holo" aria-hidden />
              <span className="grp" aria-hidden>{t.group}</span>
              {t.titles > 0 && (
                <span className="star" title={`${t.titles} ${ti.titles}`}>
                  ★{t.titles > 1 ? <i>{t.titles}</i> : null}
                </span>
              )}
              <span className="crest">
                <span className="emoji" aria-hidden>{t.flag}</span>
                {t.crest && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={t.crest}
                    alt=""
                    loading="lazy"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).style.display = "none";
                    }}
                  />
                )}
              </span>
              <span className="code">{t.code}</span>
              <span className="name">{t.name}</span>
              <span className="meta">
                <b>#{t.fifaRank}</b> {ti.rankSuffix} · {dict.team.regions[t.confederation]}
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
