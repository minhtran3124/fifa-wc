import type { Metadata } from "next";
import Link from "next/link";
import type { PlayerStat } from "@/lib/types";
import { tournamentStats } from "@/lib/standings";
import { getTeam, getVenue } from "@/lib/teams";
import { getWcData, getWcScorers } from "@/lib/footballData";
import { side } from "../MatchSticker";
import AlbumRefresh from "../AlbumRefresh";

export const metadata: Metadata = { title: "Tournament Stats" };

function Leaderboard({ title, metric, players }: { title: string; metric: "goals" | "assists"; players: PlayerStat[] }) {
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
                  {team?.name} · {p.position} · {metric === "goals" ? `${p.assists} assists` : `${p.goals} goals`}
                </span>
              </span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

export const dynamic = "force-dynamic";

export default async function AlbumStats() {
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
    { v: `${t.matchesPlayed}`, frac: `/${t.totalMatches}`, l: "Matches played" },
    { v: `${t.goals}`, l: "Total goals" },
    { v: `${t.avgGoals}`, l: "Goals / match" },
    { v: `${t.cleanSheets}`, l: "Clean sheets" },
  ];

  return (
    <>
      <div className="al-page-head">
        <div>
          <Link href="/v2" className="al-back">← Album home</Link>
          <h1 className="al-page-title">Tournament Stats</h1>
          <p className="al-page-sub">
            Aggregates and scorer leaderboards from live match data.
          </p>
        </div>
        <AlbumRefresh source={source} fetchedAt={fetchedAt} />
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
            <div className="lbl">Biggest win so far</div>
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
              {bw.group ? ` · Group ${bw.group}` : ""}
            </p>
          </div>
        </section>
      )}

      <section className="al-sec">
        <div className="al-sec-head">
          <div>
            <span className="scribble">Top of the pile</span>
            <h2>Leaderboards</h2>
          </div>
        </div>
        <div className="al-cols">
          {topScorers.length > 0 ? (
            <Leaderboard title="🥇 Top Scorers" metric="goals" players={topScorers} />
          ) : (
            <div className="al-board">
              <h3>🥇 Top Scorers</h3>
              <p style={{ fontSize: 13, color: "var(--al-ink-soft)" }}>
                No scorer data available from the feed yet.
              </p>
            </div>
          )}
          {topAssists.length > 0 ? (
            <Leaderboard title="🎯 Most Assists" metric="assists" players={topAssists} />
          ) : (
            <div className="al-board">
              <h3>🎯 Most Assists</h3>
              <p style={{ fontSize: 13, color: "var(--al-ink-soft)" }}>
                Assist data isn&rsquo;t provided by the feed yet.
              </p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
