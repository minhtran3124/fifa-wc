import Link from "next/link";
import type { Match } from "@/lib/types";
import { getTeam, getVenue } from "@/lib/teams";
import { slotLabel } from "@/lib/matches";
import { fmtDate, fmtTime } from "@/lib/format";
import type { Locale } from "@/lib/i18n";
import type { Dictionary } from "@/lib/dictionaries";

export function side(code: string, name?: string) {
  const t = getTeam(code);
  return { flag: t?.flag ?? "⬜", name: t?.name ?? name ?? slotLabel(code) };
}

export default function MatchSticker({
  m,
  locale,
  dict,
}: {
  m: Match;
  locale: Locale;
  dict: Dictionary;
}) {
  const home = side(m.home, m.homeName);
  const away = side(m.away, m.awayName);
  const venue = getVenue(m.venueId);
  const venueText = venue ? `${venue.stadium}, ${venue.city}` : m.venueName ?? "";
  const finished = m.status === "finished";
  const live = m.status === "live";
  const scored = m.homeScore != null && m.awayScore != null;
  const homeWin = finished && (m.homeScore ?? 0) > (m.awayScore ?? 0);
  const awayWin = finished && (m.awayScore ?? 0) > (m.homeScore ?? 0);

  return (
    <Link href={`/${locale}/matches/${m.id}`} className="al-match">
      <div className="top">
        <span>
          {dict.stage[m.stage]}
          {m.group ? ` · ${dict.match.grp} ${m.group}` : ""}
        </span>
        {live ? (
          <span className="live"><span className="dot" /> {dict.match.live}</span>
        ) : (
          <span>{finished ? dict.match.fullTime : fmtTime(m.date, locale)}</span>
        )}
      </div>

      <div className={`ln ${homeWin ? "win" : awayWin ? "lose" : ""}`}>
        <span className="t">
          <span className="fl">{home.flag}</span>
          <span className="nm">{home.name}</span>
        </span>
        {scored ? <span className="sc">{m.homeScore}</span> : <span className="vs">v</span>}
      </div>
      <div className={`ln ${awayWin ? "win" : homeWin ? "lose" : ""}`}>
        <span className="t">
          <span className="fl">{away.flag}</span>
          <span className="nm">{away.name}</span>
        </span>
        {scored ? <span className="sc">{m.awayScore}</span> : <span />}
      </div>

      <div className="foot">
        <span>{fmtDate(m.date, locale)}</span>
        <span style={{ textAlign: "right", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {venueText}
        </span>
      </div>
    </Link>
  );
}
