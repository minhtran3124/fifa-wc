import Link from "next/link";
import type { Match, PlayerStat } from "@/lib/types";
import { tournamentStats, detailedStats } from "@/lib/standings";
import { getTeam, getVenue } from "@/lib/teams";
import { getWcData, getWcScorers } from "@/lib/footballData";
import { highlightsSearchUrl } from "@/lib/highlights";
import { getDictionary, type Dictionary } from "@/lib/dictionaries";
import type { Locale } from "@/lib/i18n";
import { side } from "@/components/MatchSticker";
import { fmtDate } from "@/lib/format";
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

/** A foil "standout moment" card: a single match shown big with its scoreline. */
function MomentCard({ label, match, groupLabel }: { label: string; match: Match; groupLabel: string }) {
  const home = side(match.home, match.homeName);
  const away = side(match.away, match.awayName);
  return (
    <div className="al-bigwin">
      <div className="lbl">{label}</div>
      <div className="row">
        <span style={{ display: "inline-flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 30 }}>{home.flag}</span> {home.name}
        </span>
        <span className="sc">{match.homeScore} – {match.awayScore}</span>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 30 }}>{away.flag}</span> {away.name}
        </span>
      </div>
      <p style={{ marginTop: 10, fontSize: 12, color: "var(--al-ink-soft)" }}>
        {getVenue(match.venueId)?.stadium ?? match.venueName ?? ""}
        {match.group ? ` · ${groupLabel} ${match.group}` : ""}
      </p>
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
  const d = detailedStats(matches);
  const topScorers = scorers.slice(0, 10);
  const topAssists = scorers
    .filter((p) => p.assists > 0)
    .sort((a, b) => b.assists - a.assists)
    .slice(0, 10);

  // Recent finished matches, most recent first — each gets a highlights link.
  const recentFinished = matches
    .filter((m) => m.status === "finished" && m.homeScore != null && m.awayScore != null)
    .slice(-12)
    .reverse();

  const topTeam = d.topScoringTeam;
  const topTeamSide = topTeam ? side(topTeam.teamId) : null;
  const bestDef = d.bestDefense;
  const bestDefSide = bestDef ? side(bestDef.teamId) : null;

  const stamps = [
    { v: `${t.matchesPlayed}`, frac: `/${t.totalMatches}`, l: dict.stats.stamps.played },
    { v: `${t.goals}`, l: dict.stats.stamps.goals },
    { v: `${t.avgGoals}`, l: dict.stats.stamps.perMatch },
    { v: `${t.cleanSheets}`, l: dict.stats.stamps.cleanSheets },
  ];

  const resultTotal = Math.max(d.homeWins + d.draws + d.awayWins, 1);
  const splitParts = [
    { key: "home", n: d.homeWins, label: dict.stats.summary.homeWins, cls: "home" },
    { key: "draw", n: d.draws, label: dict.stats.summary.draws, cls: "draw" },
    { key: "away", n: d.awayWins, label: dict.stats.summary.awayWins, cls: "away" },
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

      {/* ---------- tournament summary ---------- */}
      <section className="al-sec">
        <div className="al-sec-head">
          <div>
            <span className="scribble">{dict.stats.summary.kicker}</span>
            <h2>{dict.stats.summary.title}</h2>
          </div>
        </div>

        {d.finishedCount > 0 ? (
          <>
            <div className="al-split">
              <div className="al-split-head">
                <span className="ttl">{dict.stats.summary.resultsSplit}</span>
                <span className="leg">
                  {splitParts.map((p) => (
                    <span key={p.key} className="lg">
                      <i className={`sw ${p.cls}`} /> {p.label} · <b>{p.n}</b>
                    </span>
                  ))}
                </span>
              </div>
              <div className="al-split-bar" role="img" aria-label={dict.stats.summary.resultsSplit}>
                {splitParts.map((p) =>
                  p.n > 0 ? (
                    <span
                      key={p.key}
                      className={`seg ${p.cls}`}
                      style={{ width: `${(p.n / resultTotal) * 100}%` }}
                    >
                      {p.n}
                    </span>
                  ) : null
                )}
              </div>
            </div>

            <div className="al-facts">
              <div className="al-stamp">
                <div className="v">{d.shootouts}</div>
                <div className="l">{dict.stats.summary.shootouts}</div>
              </div>
              <div className="al-stamp">
                <div className="v">{d.teamsScored}</div>
                <div className="l">{dict.stats.summary.teamsScored}</div>
              </div>
              {topTeam && topTeamSide && (
                <div className="al-fact">
                  <span className="fl">{topTeamSide.flag}</span>
                  <span className="bd">
                    <span className="nm">{topTeamSide.name}</span>
                    <span className="lbl">
                      {dict.stats.summary.topTeam} · {topTeam.goals} {dict.stats.goalsSuffix}
                    </span>
                  </span>
                  <span className="big">{topTeam.goals}</span>
                </div>
              )}
              {bestDef && bestDefSide && (
                <div className="al-fact">
                  <span className="fl">{bestDefSide.flag}</span>
                  <span className="bd">
                    <span className="nm">{bestDefSide.name}</span>
                    <span className="lbl">
                      {dict.stats.summary.bestDefence} · {bestDef.conceded} {dict.stats.summary.concededSuffix}
                    </span>
                  </span>
                  <span className="big">{bestDef.conceded}</span>
                </div>
              )}
            </div>
          </>
        ) : (
          <p className="al-empty">{dict.stats.summary.empty}</p>
        )}
      </section>

      {/* ---------- standout moments ---------- */}
      {(t.biggestWin.match || d.highestScoring) && (
        <section className="al-sec">
          <div className="al-sec-head">
            <div>
              <span className="scribble">{dict.stats.moments.kicker}</span>
              <h2>{dict.stats.moments.title}</h2>
            </div>
          </div>
          <div className="al-cols">
            {t.biggestWin.match && (
              <MomentCard label={dict.stats.biggestWin} match={t.biggestWin.match} groupLabel={dict.team.groupLabel} />
            )}
            {d.highestScoring && (
              <MomentCard
                label={`${dict.stats.moments.highestScoring} · ${d.highestScoringTotal} ${dict.stats.moments.goalsLabel}`}
                match={d.highestScoring}
                groupLabel={dict.team.groupLabel}
              />
            )}
          </div>
        </section>
      )}

      {/* ---------- leaderboards ---------- */}
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

      {/* ---------- watch highlights ---------- */}
      <section className="al-sec">
        <div className="al-sec-head">
          <div>
            <span className="scribble">{dict.stats.highlights.kicker}</span>
            <h2>{dict.stats.highlights.title}</h2>
          </div>
        </div>
        <p className="al-page-sub" style={{ marginTop: -4, marginBottom: 14 }}>
          {dict.stats.highlights.sub}
        </p>
        {recentFinished.length > 0 ? (
          <div className="al-hl">
            {recentFinished.map((m) => {
              const home = side(m.home, m.homeName);
              const away = side(m.away, m.awayName);
              return (
                <a
                  key={m.id}
                  className="al-hl-row"
                  href={highlightsSearchUrl(home.name, away.name)}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className="dt">{fmtDate(m.date, l)}</span>
                  <span className="mt">
                    <span className="sd">
                      <span className="fl">{home.flag}</span>
                      <span className="nm">{home.name}</span>
                    </span>
                    <span className="sc">{m.homeScore}–{m.awayScore}</span>
                    <span className="sd r">
                      <span className="nm">{away.name}</span>
                      <span className="fl">{away.flag}</span>
                    </span>
                  </span>
                  <span className="play">
                    <span className="yt" aria-hidden>▶</span>
                    <span className="tx">
                      {dict.stats.highlights.watch}
                      <small>{dict.stats.highlights.via}</small>
                    </span>
                  </span>
                </a>
              );
            })}
          </div>
        ) : (
          <p className="al-empty">{dict.stats.highlights.empty}</p>
        )}
      </section>
    </>
  );
}
