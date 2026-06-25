import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Match, Standing } from "@/lib/types";
import { getTeam, TEAMS } from "@/lib/teams";
import { groupStandings } from "@/lib/standings";
import { getWcData } from "@/lib/footballData";
import { getSquad } from "@/lib/squads";
import { getWorldCup } from "@/lib/worldCup";
import { teamPhotoUrl } from "@/lib/teamPhotos";
import SquadList from "@/components/SquadList";
import FavoriteButton from "@/components/FavoriteButton";
import { slotLabel } from "@/lib/matches";
import { fmtDate } from "@/lib/format";
import { getDictionary } from "@/lib/dictionaries";
import type { Locale } from "@/lib/i18n";
import AlbumCountdown from "@/components/AlbumCountdown";
import MatchSticker from "@/components/MatchSticker";
import AlbumRefresh from "@/components/AlbumRefresh";
import { teamMascot } from "@/lib/teamMascots";
import ShareButton from "@/components/ShareButton";

function ordinalEn(n: number): string {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

function opponent(m: Match, id: string) {
  const isHome = m.home === id;
  const oppId = isHome ? m.away : m.home;
  const oppName = isHome ? m.awayName : m.homeName;
  const opp = getTeam(oppId);
  return { flag: opp?.flag ?? "⬜", name: opp?.name ?? oppName ?? slotLabel(oppId) };
}

// All 48 team codes are known at build time — prerender each as static HTML
// (composed with the parent [locale] params, so /vi/teams/… and /en/teams/…).
export function generateStaticParams() {
  return TEAMS.map((t) => ({ code: t.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ code: string }> }): Promise<Metadata> {
  const { code } = await params;
  const team = getTeam(code.toLowerCase());
  return { title: team ? team.name : "Team not found" };
}

export default async function AlbumTeam({ params }: { params: Promise<{ locale: string; code: string }> }) {
  const { locale, code } = await params;
  const l = locale as Locale;
  const dict = getDictionary(l);
  const team = getTeam(code.toLowerCase());
  if (!team) notFound();

  const [{ matches, source, fetchedAt }, squad] = await Promise.all([
    getWcData(),
    getSquad(team.id),
  ]);
  const id = team.id;
  const th = dict.groups.th;
  const photo = teamPhotoUrl(id);
  const mascot = teamMascot(team.name);
  const wc = getWorldCup(id);

  const teamMatches = matches
    .filter((m) => m.home === id || m.away === id)
    .sort((a, b) => a.date.localeCompare(b.date));

  const rows = groupStandings(team.group, matches);
  const record: Standing | undefined = rows.find((r) => r.teamId === id);

  const liveMatch = teamMatches.find((m) => m.status === "live");
  const nextMatch = teamMatches.find((m) => m.status === "scheduled");

  const form = teamMatches
    .filter((m) => m.stage === "group" && m.status === "finished")
    .map((m) => {
      const us = (m.home === id ? m.homeScore : m.awayScore) ?? 0;
      const them = (m.home === id ? m.awayScore : m.homeScore) ?? 0;
      const result: "w" | "d" | "l" = us > them ? "w" : us < them ? "l" : "d";
      return { m, result, us, them, opp: opponent(m, id).name };
    });

  const played = record?.played ?? 0;
  const rank = record?.rank ?? 0;

  const ord = (n: number) => (l === "vi" ? `thứ ${n}` : ordinalEn(n));
  const inGroup = (n: number, verb: string) =>
    l === "vi"
      ? `${verb} ${ord(n)} ở ${dict.team.groupLabel} ${team.group}`
      : `${verb} ${ord(n)} in ${dict.team.groupLabel} ${team.group}`;

  const outlook =
    played === 0 || rank === 0
      ? null
      : rank <= 2
        ? { dot: "var(--al-green)", text: `${inGroup(rank, dict.team.sittingIn)} — ${dict.team.outlookQualify}` }
        : rank === 3
          ? { dot: "var(--al-line)", text: `${inGroup(rank, dict.team.sittingIn)} — ${dict.team.outlookThird}` }
          : { dot: "var(--al-red)", text: `${inGroup(rank, dict.team.sittingIn)} — ${dict.team.outlookOut}` };

  const stats = [
    { l: th.p, v: record?.played ?? 0 },
    { l: th.w, v: record?.won ?? 0 },
    { l: th.d, v: record?.drawn ?? 0 },
    { l: th.l, v: record?.lost ?? 0 },
    { l: th.gf, v: record?.gf ?? 0 },
    { l: th.ga, v: record?.ga ?? 0 },
    { l: th.gd, v: record ? (record.gd > 0 ? `+${record.gd}` : record.gd) : 0 },
    { l: th.pts, v: record?.points ?? 0, accent: true },
  ];

  const liveOpp = liveMatch ? opponent(liveMatch, id) : null;
  const nextOpp = nextMatch ? opponent(nextMatch, id) : null;
  const liveUs = liveMatch ? (liveMatch.home === id ? liveMatch.homeScore : liveMatch.awayScore) : null;
  const liveThem = liveMatch ? (liveMatch.home === id ? liveMatch.awayScore : liveMatch.homeScore) : null;

  const rivalsHeading =
    l === "vi"
      ? `${dict.team.rivalsWord} ${dict.team.groupLabel} ${team.group}`
      : `${dict.team.groupLabel} ${team.group} ${dict.team.rivalsWord}`;

  return (
    <>
      <div className="al-page-head" style={{ borderBottom: "none", marginBottom: 12 }}>
        <Link href={`/${l}`} className="al-back">{dict.common.back}</Link>
        <AlbumRefresh source={source} fetchedAt={fetchedAt} locale={l} dict={dict} />
      </div>

      {/* hero */}
      <section className="al-thero al-reveal">
        {mascot && (
          <span className="thero-mascot" title={mascot.nick} aria-label={`${team.name}: ${mascot.nick}`}>
            <span className="em" aria-hidden>{mascot.emoji}</span>
            <span className="nk">{mascot.nick}</span>
          </span>
        )}
        {photo && (
          <div className="thero-photo">
            {/* Curated squad photo (data/teamPhotos.json); host-agnostic so a plain img fits. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={photo} alt={`${team.name} squad`} loading="lazy" />
          </div>
        )}
        <div className="id">
          <span className="crest">{team.flag}</span>
          <div style={{ minWidth: 0 }}>
            <div className="meta-top">
              <span className="gtab">{dict.team.groupLabel} {team.group}</span>
              <span className="code">{team.code}</span>
            </div>
            <h1>{team.name}</h1>
            <div className="facts">
              <span><b>#{team.fifaRank}</b> {dict.team.fifaRanking}</span>
              <span>·</span>
              <span>{team.confederation} — {dict.team.regions[team.confederation]}</span>
            </div>
            <div className="thero-actions">
              <FavoriteButton teamId={team.id} teamName={team.name} dict={dict} />
              <ShareButton
                title={`${team.name} — World Cup 2026`}
                label={dict.team.share}
                copiedLabel={dict.team.shareCopied}
              />
            </div>
          </div>
        </div>

        {liveMatch && liveOpp ? (
          <div className="status live">
            <div className="lbl"><span className="dot" /> {dict.team.liveNow}</div>
            <div className="opp">
              <span className="fl">{liveOpp.flag}</span>
              <span className="nm">{liveOpp.name}</span>
              {liveUs != null && liveThem != null && <span className="sc" style={{ marginLeft: "auto" }}>{liveUs}–{liveThem}</span>}
            </div>
          </div>
        ) : nextMatch && nextOpp ? (
          <div className="status">
            <div className="lbl">{dict.team.upNext}</div>
            <div className="opp">
              <span className="fl">{nextOpp.flag}</span>
              <span className="nm">{nextOpp.name}</span>
            </div>
            <div className="when">
              <span>{fmtDate(nextMatch.date, l)}</span>
              <AlbumCountdown iso={nextMatch.date} dict={dict} />
            </div>
          </div>
        ) : (
          <div className="status">
            <div className="lbl">{dict.team.groupStage}</div>
            <div className="opp"><span className="nm">{played > 0 ? dict.team.allPlayed : dict.team.awaiting}</span></div>
            <div className="when">
              <span>{played > 0 && rank > 0 ? inGroup(rank, dict.team.finishedIn) : dict.team.threeToCome}</span>
            </div>
          </div>
        )}
      </section>

      {/* most recent World Cup pedigree */}
      {wc && (
        <p className={`al-pedigree ${wc.result === "Champions" ? "champ" : ""} ${wc.result === "Debut" ? "debut" : ""}`}>
          <span className="ic" aria-hidden>
            {wc.result === "Champions" ? "🏆" : wc.result === "Debut" ? "✨" : "🌍"}
          </span>
          <span className="lbl">{wc.result === "Debut" ? dict.team.wc.kicker : dict.team.wc.last}</span>
          <span className="val">
            {wc.result === "Debut" ? (
              dict.team.wc.debut
            ) : (
              <>
                <b>{wc.year}</b> · {dict.team.wc.results[wc.result]}
                {wc.rank ? <span className="rk"> · {dict.team.wc.finished} {ord(wc.rank)}</span> : null}
              </>
            )}
          </span>
        </p>
      )}

      {/* record + form */}
      <section className="al-sec">
        <div className="al-sec-head">
          <div>
            <span className="scribble">{dict.team.recordKicker}</span>
            <h2>{dict.team.recordTitle}</h2>
          </div>
        </div>
        <div className="al-rec">
          {stats.map((s) => (
            <div key={s.l} className={`cell ${s.accent ? "pts" : ""}`}>
              <div className="v">{s.v}</div>
              <div className="l">{s.l}</div>
            </div>
          ))}
        </div>
        <div className="al-formrow">
          <span className="lbl">{dict.team.form}</span>
          {form.length === 0 ? (
            <span className="al-empty">{dict.team.formEmpty}</span>
          ) : (
            form.map(({ m, result, us, them, opp }) => (
              <span key={m.id} className={`al-fp ${result}`} title={`${result.toUpperCase()} ${us}-${them} vs ${opp}`}>
                {result.toUpperCase()}
              </span>
            ))
          )}
        </div>
      </section>

      {/* standing */}
      <section className="al-sec">
        <div className="al-sec-head">
          <div>
            <span className="scribble">{dict.team.groupLabel} {team.group}</span>
            <h2>{dict.team.standTitle}</h2>
          </div>
          <Link className="more" href={`/${l}/groups`}>{dict.team.allGroups}</Link>
        </div>
        <div className="al-standwrap">
          <table className="al-stand">
            <thead>
              <tr>
                <th>#</th><th>{th.team}</th><th>{th.p}</th><th>{th.w}</th><th>{th.d}</th><th>{th.l}</th><th>{th.gf}</th><th>{th.ga}</th><th>{th.gd}</th><th>{th.pts}</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => {
                const t = getTeam(r.teamId);
                const isSelf = r.teamId === id;
                const q = r.rank <= 2;
                return (
                  <tr key={r.teamId} className={isSelf ? "self" : q ? "q" : ""}>
                    <td><span className="rk">{r.rank}</span></td>
                    <td>
                      {isSelf || !t ? (
                        <span className="tm" style={{ cursor: "default" }}>
                          <span className="fl">{t?.flag ?? "⬜"}</span>
                          <span className={isSelf ? "self-nm" : ""}>{t?.name ?? r.teamId.toUpperCase()}</span>
                        </span>
                      ) : (
                        <Link href={`/${l}/teams/${t.id}`} className="tm">
                          <span className="fl">{t.flag}</span>
                          {t.name}
                        </Link>
                      )}
                    </td>
                    <td>{r.played}</td>
                    <td>{r.won}</td>
                    <td>{r.drawn}</td>
                    <td>{r.lost}</td>
                    <td>{r.gf}</td>
                    <td>{r.ga}</td>
                    <td>{r.gd > 0 ? `+${r.gd}` : r.gd}</td>
                    <td><span className="pts">{r.points}</span></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {outlook && (
          <p className="al-note">
            <span className="dot" style={{ background: outlook.dot }} />
            {outlook.text}
          </p>
        )}
      </section>

      {/* squad */}
      <section className="al-sec">
        <div className="al-sec-head">
          <div>
            <span className="scribble">{dict.team.squad.kicker}</span>
            <h2>{dict.team.squad.title}</h2>
          </div>
          {squad.length > 0 && (
            <span className="more" style={{ color: "var(--al-ink-soft)", fontWeight: 700, maxWidth: "32ch", textAlign: "right" }}>
              {dict.team.squad.note}
            </span>
          )}
        </div>
        {team.coach && (
          <div className="al-coach">
            <span className="ic" aria-hidden>🎯</span>
            <span className="tx">
              <span className="lbl">{dict.team.headCoach}</span>
              <span className="nm">{team.coach}</span>
            </span>
          </div>
        )}
        <SquadList squad={squad} labels={dict.team.squad} locale={l} />
      </section>

      {/* fixtures */}
      <section className="al-sec">
        <div className="al-sec-head">
          <div>
            <span className="scribble">{dict.team.fixturesKicker}</span>
            <h2>{dict.team.fixturesTitle}</h2>
          </div>
        </div>
        {teamMatches.length > 0 ? (
          <div className="al-matches">
            {teamMatches.map((m) => <MatchSticker key={m.id} m={m} locale={l} dict={dict} />)}
          </div>
        ) : (
          <p className="al-empty">{dict.team.fixturesEmpty}</p>
        )}
      </section>

      {/* rivals */}
      {rows.length > 1 && (
        <section className="al-sec">
          <div className="al-sec-head">
            <div>
              <span className="scribble">{dict.team.rivalsKicker}</span>
              <h2>{rivalsHeading}</h2>
            </div>
          </div>
          <div className="al-rivals">
            {rows
              .filter((r) => r.teamId !== id)
              .map((r) => {
                const t = getTeam(r.teamId);
                if (!t) return null;
                return (
                  <Link key={t.id} href={`/${l}/teams/${t.id}`} className="al-rival">
                    <span className="fl">{t.flag}</span>
                    <span style={{ minWidth: 0 }}>
                      <span className="nm" style={{ display: "block" }}>{t.name}</span>
                      <span className="sub">#{t.fifaRank} · {r.points} {th.pts}</span>
                    </span>
                  </Link>
                );
              })}
          </div>
        </section>
      )}
    </>
  );
}
