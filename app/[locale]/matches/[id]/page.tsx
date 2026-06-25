import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Match } from "@/lib/types";
import { getTeam, getVenue } from "@/lib/teams";
import { groupStandings } from "@/lib/standings";
import { getWcData } from "@/lib/footballData";
import { getSquad } from "@/lib/squads";
import { getMatchStats } from "@/lib/matchStats";
import StatsRefresh from "@/components/StatsRefresh";
import AddToCalendar from "@/components/AddToCalendar";
import ScorePredictor from "@/components/ScorePredictor";
import { getFifaMatch } from "@/lib/fifaMatch";
import { fmtDate, fmtTime } from "@/lib/format";
import { getDictionary } from "@/lib/dictionaries";
import type { Locale } from "@/lib/i18n";
import { side } from "@/components/MatchSticker";
import SquadList from "@/components/SquadList";
import FormationPitch from "@/components/FormationPitch";

function formFor(teamId: string, matches: Match[]): ("w" | "d" | "l")[] {
  return matches
    .filter((m) => (m.home === teamId || m.away === teamId) && m.stage === "group" && m.status === "finished")
    .sort((a, b) => a.date.localeCompare(b.date))
    .map((m) => {
      const us = (m.home === teamId ? m.homeScore : m.awayScore) ?? 0;
      const them = (m.home === teamId ? m.awayScore : m.homeScore) ?? 0;
      return us > them ? "w" : us < them ? "l" : "d";
    });
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const { matches } = await getWcData();
  const m = matches.find((x) => x.id === id);
  if (!m) return { title: "Match" };
  const h = side(m.home, m.homeName).name;
  const a = side(m.away, m.awayName).name;
  return { title: `${h} vs ${a}` };
}

export default async function MatchDetail({ params }: { params: Promise<{ locale: string; id: string }> }) {
  const { locale, id } = await params;
  const l = locale as Locale;
  const dict = getDictionary(l);

  const { matches } = await getWcData();
  const m = matches.find((x) => x.id === id);
  if (!m) notFound();

  const home = side(m.home, m.homeName);
  const away = side(m.away, m.awayName);
  const homeTeam = getTeam(m.home);
  const awayTeam = getTeam(m.away);
  const venue = getVenue(m.venueId);
  const venueText = venue ? `${venue.stadium}, ${venue.city}` : m.venueName ?? "";
  const scored = m.homeScore != null && m.awayScore != null;
  const live = m.status === "live";

  const [homeSquad, awaySquad] = await Promise.all([getSquad(m.home), getSquad(m.away)]);

  const homeForm = formFor(m.home, matches);
  const awayForm = formFor(m.away, matches);
  const rows = m.group ? groupStandings(m.group, matches) : [];
  const th = dict.groups.th;

  // post-match metrics (team stats, cards, starting XI) — fetched live from
  // ESPN (cached 1 day), with the bundled snapshot as fallback.
  const finished = m.status === "finished";
  const [stats, fifa] = finished
    ? await Promise.all([
        getMatchStats(m.home, m.away, m.date),
        getFifaMatch(homeTeam?.code ?? m.home, awayTeam?.code ?? m.away),
      ])
    : [null, null];
  const fifaHasXi = !!(fifa && (fifa.homeStarters.length || fifa.awayStarters.length));
  const statRows = stats
    ? (["possession", "shots", "shotsOnTarget", "corners", "fouls", "offsides", "saves"] as const)
        .map((k) => ({ k, h: stats.home[k], a: stats.away[k] }))
        .filter((r) => r.h != null || r.a != null)
    : [];
  const homeBarPct = (h?: string, a?: string): number => {
    const hv = Number(h ?? 0);
    const av = Number(a ?? 0);
    return hv + av > 0 ? Math.round((hv / (hv + av)) * 100) : 50;
  };

  const TeamLink = ({ code, children }: { code: string; children: ReactNode }) =>
    getTeam(code) ? (
      <Link href={`/${l}/teams/${code}`} className="t">{children}</Link>
    ) : (
      <span className="t">{children}</span>
    );

  return (
    <>
      <div className="al-page-head" style={{ borderBottom: "none", marginBottom: 12 }}>
        <Link href={`/${l}/matches`} className="al-back">{dict.common.back}</Link>
        {finished && (
          <StatsRefresh label={dict.matchPage.fetchStats} busyLabel={dict.matchPage.fetchStatsBusy} />
        )}
        {!finished && !live && (
          <AddToCalendar
            uid={m.id}
            startIso={m.date}
            title={`${home.name} – ${away.name}`}
            location={venueText || undefined}
            description={`${dict.stage[m.stage]}${m.group ? ` · ${dict.team.groupLabel} ${m.group}` : ""}`}
            label={dict.matchPage.addCalendar}
          />
        )}
      </div>

      {/* match header */}
      <section className="al-mh al-reveal">
        <div className="al-mh-tag">
          {dict.stage[m.stage]}{m.group ? ` · ${dict.team.groupLabel} ${m.group}` : ""}
        </div>
        <div className="al-mh-row">
          <TeamLink code={m.home}>
            <span className="fl">{home.flag}</span>
            <span className="nm">{home.name}</span>
          </TeamLink>
          {scored ? (
            <span className="al-mh-score">{m.homeScore}<i>–</i>{m.awayScore}</span>
          ) : (
            <span className="al-mh-vs">{dict.matchPage.vs}</span>
          )}
          <TeamLink code={m.away}>
            <span className="fl">{away.flag}</span>
            <span className="nm">{away.name}</span>
          </TeamLink>
        </div>
        <div className="al-mh-meta">
          {live ? (
            <span className="live"><span className="dot" /> {dict.match.live}</span>
          ) : (
            <span>{fmtDate(m.date, l)} · {fmtTime(m.date, l)}</span>
          )}
          {venueText && <span>{venueText}</span>}
          {fifa?.attendance && (
            <span title={dict.matchPage.attendance}>👥 {Number(fifa.attendance).toLocaleString()}</span>
          )}
          {fifa?.referee && (
            <span title={dict.matchPage.referee}>
              🧑‍⚖️ {fifa.referee}
              {fifa.refereeCountry ? ` (${fifa.refereeCountry})` : ""}
            </span>
          )}
        </div>
      </section>

      <ScorePredictor
        matchId={m.id}
        dict={dict}
        finished={finished}
        actualHome={m.homeScore}
        actualAway={m.awayScore}
      />

      {/* goals / scoresheet */}
      {m.goals && m.goals.length > 0 && (
        <section className="al-sec">
          <div className="al-sec-head">
            <div>
              <span className="scribble">{dict.matchPage.goalsKicker}</span>
              <h2>{dict.matchPage.goalsTitle}</h2>
            </div>
            {m.htHome != null && m.htAway != null && (
              <span className="more" style={{ color: "var(--al-ink-soft)", fontWeight: 700 }}>
                {dict.matchPage.halfTime} {m.htHome}–{m.htAway}
              </span>
            )}
          </div>
          <ul className="al-goals">
            {m.goals.map((g, i) => {
              const isHome = g.team === "home";
              const s = isHome ? home : away;
              return (
                <li key={`${g.minute}-${g.name}-${i}`} className={`al-goal ${isHome ? "h" : "a"}`}>
                  <span className="min">{g.minute}&rsquo;</span>
                  <span className="who">
                    <span className="fl">{s.flag}</span>
                    <span className="nm">{g.name}</span>
                    {g.penalty && <span className="gbdg pen">{dict.matchPage.penaltyShort}</span>}
                    {g.owngoal && <span className="gbdg og">{dict.matchPage.ownGoalShort}</span>}
                  </span>
                </li>
              );
            })}
          </ul>
        </section>
      )}

      {/* team stats */}
      {statRows.length > 0 && (
        <section className="al-sec">
          <div className="al-sec-head"><div>
            <span className="scribble">{dict.matchPage.statsKicker}</span>
            <h2>{dict.matchPage.statsTitle}</h2>
          </div></div>
          <div className="al-stats">
            <div className="al-stats-head">
              <span><span className="fl">{home.flag}</span> {home.name}</span>
              <span><span className="fl">{away.flag}</span> {away.name}</span>
            </div>
            {statRows.map((r) => (
              <div key={r.k} className="al-statrow">
                <span className="hv">{r.h ?? "–"}{r.k === "possession" && r.h ? "%" : ""}</span>
                <span className="lbl">{dict.matchPage.stat[r.k]}</span>
                <span className="av">{r.a ?? "–"}{r.k === "possession" && r.a ? "%" : ""}</span>
                <span className="bar"><i style={{ width: `${homeBarPct(r.h, r.a)}%` }} /></span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* cards */}
      {stats && stats.cards.length > 0 && (
        <section className="al-sec">
          <div className="al-sec-head"><div>
            <span className="scribble">{dict.matchPage.cardsKicker}</span>
            <h2>{dict.matchPage.cardsTitle}</h2>
          </div></div>
          <ul className="al-goals">
            {stats.cards.map((c, i) => {
              const isHome = c.side === "home";
              const s = isHome ? home : away;
              return (
                <li key={`${c.minute}-${c.player}-${i}`} className={`al-goal ${isHome ? "h" : "a"}`}>
                  <span className="min">{c.minute}&rsquo;</span>
                  <span className="who">
                    <span className="fl">{s.flag}</span>
                    <span className="nm">{c.player}</span>
                    <span className={`al-cardchip ${c.type}`} aria-hidden />
                  </span>
                </li>
              );
            })}
          </ul>
        </section>
      )}

      {/* substitutions (FIFA) */}
      {fifa && fifa.subs.length > 0 && (
        <section className="al-sec">
          <div className="al-sec-head"><div>
            <span className="scribble">{dict.matchPage.subsKicker}</span>
            <h2>{dict.matchPage.subsTitle}</h2>
          </div></div>
          <ul className="al-goals">
            {fifa.subs.map((s, i) => {
              const isHome = s.team === "home";
              const sd = isHome ? home : away;
              return (
                <li key={i} className={`al-goal ${isHome ? "h" : "a"}`}>
                  <span className="min">{s.minute ? `${s.minute}′` : "⇅"}</span>
                  <span className="who">
                    <span className="fl">{sd.flag}</span>
                    <span className="nm">
                      <span className="sub-on">▲ {s.on}</span>
                      <span className="sub-off">▼ {s.off}</span>
                    </span>
                  </span>
                </li>
              );
            })}
          </ul>
        </section>
      )}

      {/* starting line-ups with photos (FIFA) */}
      {fifaHasXi && (
        <section className="al-sec">
          <div className="al-sec-head"><div>
            <span className="scribble">{dict.team.squad.kicker}</span>
            <h2>{dict.matchPage.lineupTitle}</h2>
          </div></div>
          <div className="al-mh-squads">
            {[
              { flag: home.flag, name: home.name, pl: fifa!.homeStarters },
              { flag: away.flag, name: away.name, pl: fifa!.awayStarters },
            ].map((x, i) => (
              <div key={i}>
                <h3 className="al-mh-sqttl"><span>{x.flag}</span> {x.name}</h3>
                <ul className="fifa-xi">
                  {x.pl.map((p, j) => (
                    <li key={j} className="fifa-pl">
                      <span className="fifa-av">
                        {p.photo ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={p.photo} alt="" loading="lazy" />
                        ) : (
                          <span className="ph">{p.number ?? "•"}</span>
                        )}
                      </span>
                      <span className="fifa-nm">
                        {p.number != null && <b className="num">{p.number}</b>} {p.name}
                        {p.captain && <b className="cap">©</b>}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* recent form */}
      {(homeForm.length > 0 || awayForm.length > 0) && (
        <section className="al-sec">
          <div className="al-sec-head"><div>
            <span className="scribble">{dict.matchPage.kicker}</span>
            <h2>{dict.matchPage.formTitle}</h2>
          </div></div>
          <div className="al-mh-forms">
            {[{ t: homeTeam, name: home.name, flag: home.flag, f: homeForm }, { t: awayTeam, name: away.name, flag: away.flag, f: awayForm }].map((x, i) => (
              <div key={i} className="al-formrow">
                <span className="lbl"><span style={{ marginRight: 6 }}>{x.flag}</span>{x.name}</span>
                {x.f.length === 0 ? (
                  <span className="al-empty">{dict.team.formEmpty}</span>
                ) : (
                  x.f.map((r, j) => <span key={j} className={`al-fp ${r}`}>{r.toUpperCase()}</span>)
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* group standings */}
      {rows.length > 0 && (
        <section className="al-sec">
          <div className="al-sec-head">
            <div>
              <span className="scribble">{dict.team.groupLabel} {m.group}</span>
              <h2>{dict.matchPage.tableTitle}</h2>
            </div>
            <Link className="more" href={`/${l}/groups`}>{dict.team.allGroups}</Link>
          </div>
          <div className="al-standwrap">
            <table className="al-stand">
              <thead>
                <tr><th>#</th><th>{th.team}</th><th>{th.p}</th><th>{th.w}</th><th>{th.d}</th><th>{th.l}</th><th>{th.gd}</th><th>{th.pts}</th></tr>
              </thead>
              <tbody>
                {rows.map((r) => {
                  const t = getTeam(r.teamId);
                  const isMatch = r.teamId === m.home || r.teamId === m.away;
                  return (
                    <tr key={r.teamId} className={isMatch ? "self" : r.rank <= 2 ? "q" : ""}>
                      <td><span className="rk">{r.rank}</span></td>
                      <td>
                        {t ? (
                          <Link href={`/${l}/teams/${t.id}`} className="tm">
                            <span className="fl">{t.flag}</span>{t.name}
                          </Link>
                        ) : (
                          <span className="tm" style={{ cursor: "default" }}><span className="fl">⬜</span>{r.teamId.toUpperCase()}</span>
                        )}
                      </td>
                      <td>{r.played}</td><td>{r.won}</td><td>{r.drawn}</td><td>{r.lost}</td>
                      <td>{r.gd > 0 ? `+${r.gd}` : r.gd}</td>
                      <td><span className="pts">{r.points}</span></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* starting XI (ESPN fallback when FIFA line-ups are unavailable) */}
      {!fifaHasXi && stats && (stats.homeLineup || stats.awayLineup) && (
        <section className="al-sec">
          <div className="al-sec-head"><div>
            <span className="scribble">{dict.team.squad.kicker}</span>
            <h2>{dict.matchPage.lineupTitle}</h2>
          </div></div>
          <div className="al-mh-squads">
            {[
              { flag: home.flag, name: home.name, lu: stats.homeLineup },
              { flag: away.flag, name: away.name, lu: stats.awayLineup },
            ].map((x, i) => (
              <div key={i}>
                <h3 className="al-mh-sqttl">
                  <span>{x.flag}</span> {x.name}
                  {x.lu?.formation && <span className="al-formation">{x.lu.formation}</span>}
                </h3>
                {x.lu && x.lu.starters.length > 0 ? (
                  <FormationPitch lineup={x.lu} />
                ) : (
                  <p className="al-empty">—</p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* squads (full squad fallback when no line-up data) */}
      {!fifaHasXi && !stats?.homeLineup && !stats?.awayLineup && (homeSquad.length > 0 || awaySquad.length > 0) && (
        <section className="al-sec">
          <div className="al-sec-head"><div>
            <span className="scribble">{dict.team.squad.kicker}</span>
            <h2>{dict.matchPage.squadsTitle}</h2>
          </div></div>
          <div className="al-mh-squads">
            <div>
              <h3 className="al-mh-sqttl"><span>{home.flag}</span> {home.name}</h3>
              <SquadList squad={homeSquad} labels={dict.team.squad} locale={l} />
            </div>
            <div>
              <h3 className="al-mh-sqttl"><span>{away.flag}</span> {away.name}</h3>
              <SquadList squad={awaySquad} labels={dict.team.squad} locale={l} />
            </div>
          </div>
        </section>
      )}
    </>
  );
}
