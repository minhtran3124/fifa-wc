import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Match } from "@/lib/types";
import { getTeam, getVenue } from "@/lib/teams";
import { groupStandings } from "@/lib/standings";
import { getWcData } from "@/lib/footballData";
import { getSquad } from "@/lib/squads";
import { fmtDate, fmtTime } from "@/lib/format";
import { getDictionary } from "@/lib/dictionaries";
import type { Locale } from "@/lib/i18n";
import { side } from "@/components/MatchSticker";
import SquadList from "@/components/SquadList";

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
        </div>
      </section>

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

      {/* squads */}
      {(homeSquad.length > 0 || awaySquad.length > 0) && (
        <section className="al-sec">
          <div className="al-sec-head"><div>
            <span className="scribble">{dict.team.squad.kicker}</span>
            <h2>{dict.matchPage.squadsTitle}</h2>
          </div></div>
          <div className="al-mh-squads">
            <div>
              <h3 className="al-mh-sqttl"><span>{home.flag}</span> {home.name}</h3>
              <SquadList squad={homeSquad} dict={dict} />
            </div>
            <div>
              <h3 className="al-mh-sqttl"><span>{away.flag}</span> {away.name}</h3>
              <SquadList squad={awaySquad} dict={dict} />
            </div>
          </div>
        </section>
      )}
    </>
  );
}
