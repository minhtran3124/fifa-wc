import Link from "next/link";
import type { PlayerStat } from "@/lib/types";
import { tournamentStats } from "@/lib/standings";
import { getTeam, getVenue } from "@/lib/teams";
import { getWcData, getWcScorers } from "@/lib/footballData";
import { getDictionary, type Dictionary } from "@/lib/dictionaries";
import type { Locale } from "@/lib/i18n";
import { side } from "@/components/MatchSticker";
import AlbumRefresh from "@/components/AlbumRefresh";

function Leaderboard({
  title,
  metric,
  players,
  dict,
}: {
  title: string;
  metric: "goals" | "assists";
  players: PlayerStat[];
  dict: Dictionary;
}) {
  const max = Math.max(...players.map((p) => p[metric]), 1);
  return (
    <div className="al-board">
      <h3>{title}</h3>
      <ol>
        {players.map((p, i) => {
          const team = getTeam(p.teamId);
          const val = p[metric];
          return (
            <li key={p.name}>
              <span className="lr">{i + 1}</span>
              <span className="fl">{team?.flag ?? "⬜"}</span>
              <span className="who">
                <span className="top">
                  <span className="nm">{p.name}</span>
                  <span className="val">{val}</span>
                </span>
                <span className="bar"><i style={{ width: `${(val / max) * 100}%` }} /></span>
                <span className="sub">
                  {team?.name} · {p.position} ·{" "}
                  {metric === "goals"
                    ? `${p.assists} ${dict.stats.assistsSuffix}`
                    : `${p.goals} ${dict.stats.goalsSuffix}`}
                </span>
              </span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

export default async function AlbumStats({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const l = locale as Locale;
  const dict = getDictionary(l);
  const [{ matches, source, fetchedAt }, scorers] = await Promise.all([
    getWcData(),
    getWcScorers(),
  ]);
  const t = tournamentStats(matches);
  const topScorers = scorers.slice(0, 10);
  const topAssists = scorers
    .filter((p) => p.assists > 0)
    .sort((a, b) => b.assists - a.assists)
    .slice(0, 10);
  const bw = t.biggestWin.match;
  const bwHome = bw ? side(bw.home, bw.homeName) : null;
  const bwAway = bw ? side(bw.away, bw.awayName) : null;

  const stamps = [
    { v: `${t.matchesPlayed}`, frac: `/${t.totalMatches}`, l: dict.stats.stamps.played },
    { v: `${t.goals}`, l: dict.stats.stamps.goals },
    { v: `${t.avgGoals}`, l: dict.stats.stamps.perMatch },
    { v: `${t.cleanSheets}`, l: dict.stats.stamps.cleanSheets },
  ];

  return (
    <>
      <div className="al-page-head">
        <div>
          <Link href={`/${l}`} className="al-back">{dict.common.back}</Link>
          <h1 className="al-page-title">{dict.stats.title}</h1>
          <p className="al-page-sub">{dict.stats.sub}</p>
        </div>
        <AlbumRefresh source={source} fetchedAt={fetchedAt} locale={l} dict={dict} />
      </div>

      <div className="al-stamps">
        {stamps.map((s) => (
          <div key={s.l} className="al-stamp">
            <div className="v">{s.v}{s.frac && <span className="frac">{s.frac}</span>}</div>
            <div className="l">{s.l}</div>
          </div>
        ))}
      </div>

      {bw && bwHome && bwAway && (
        <section className="al-sec">
          <div className="al-bigwin">
            <div className="lbl">{dict.stats.biggestWin}</div>
            <div className="row">
              <span style={{ display: "inline-flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: 30 }}>{bwHome.flag}</span> {bwHome.name}
              </span>
              <span className="sc">{bw.homeScore} – {bw.awayScore}</span>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: 30 }}>{bwAway.flag}</span> {bwAway.name}
              </span>
            </div>
            <p style={{ marginTop: 10, fontSize: 12, color: "var(--al-ink-soft)" }}>
              {getVenue(bw.venueId)?.stadium ?? bw.venueName ?? ""}
              {bw.group ? ` · ${dict.team.groupLabel} ${bw.group}` : ""}
            </p>
          </div>
        </section>
      )}

      <section className="al-sec">
        <div className="al-sec-head">
          <div>
            <span className="scribble">{dict.stats.boardKicker}</span>
            <h2>{dict.stats.boardTitle}</h2>
          </div>
        </div>
        <div className="al-cols">
          {topScorers.length > 0 ? (
            <Leaderboard title={dict.stats.topScorers} metric="goals" players={topScorers} dict={dict} />
          ) : (
            <div className="al-board">
              <h3>{dict.stats.topScorers}</h3>
              <p style={{ fontSize: 13, color: "var(--al-ink-soft)" }}>{dict.stats.noScorers}</p>
            </div>
          )}
          {topAssists.length > 0 ? (
            <Leaderboard title={dict.stats.mostAssists} metric="assists" players={topAssists} dict={dict} />
          ) : (
            <div className="al-board">
              <h3>{dict.stats.mostAssists}</h3>
              <p style={{ fontSize: 13, color: "var(--al-ink-soft)" }}>{dict.stats.noAssists}</p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
