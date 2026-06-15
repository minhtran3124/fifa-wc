import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Confederation, Match, Standing } from "@/lib/types";
import { getTeam } from "@/lib/teams";
import { groupStandings } from "@/lib/standings";
import { getWcData } from "@/lib/footballData";
import { slotLabel } from "@/lib/matches";
import { fmtDate } from "@/lib/format";
import AlbumCountdown from "../../AlbumCountdown";
import MatchSticker from "../../MatchSticker";
import AlbumRefresh from "../../AlbumRefresh";

const REGION: Record<Confederation, string> = {
  UEFA: "Europe",
  CONMEBOL: "South America",
  CONCACAF: "N. & C. America",
  CAF: "Africa",
  AFC: "Asia",
  OFC: "Oceania",
};

function ordinal(n: number): string {
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

export async function generateMetadata({ params }: { params: Promise<{ code: string }> }): Promise<Metadata> {
  const { code } = await params;
  const team = getTeam(code.toLowerCase());
  return { title: team ? team.name : "Team not found" };
}

export default async function AlbumTeam({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const team = getTeam(code.toLowerCase());
  if (!team) notFound();

  const { matches, source, fetchedAt } = await getWcData();
  const id = team.id;

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
  const outlook =
    played === 0 || rank === 0
      ? null
      : rank <= 2
        ? { dot: "var(--al-green)", text: `Sitting ${ordinal(rank)} in Group ${team.group} — inside the automatic qualifying places (top two advance).` }
        : rank === 3
          ? { dot: "var(--al-line)", text: `Sitting 3rd in Group ${team.group} — in contention for one of the eight best third-place spots.` }
          : { dot: "var(--al-red)", text: `Sitting ${ordinal(rank)} in Group ${team.group} — currently outside the qualifying places.` };

  const stats = [
    { l: "P", v: record?.played ?? 0 },
    { l: "W", v: record?.won ?? 0 },
    { l: "D", v: record?.drawn ?? 0 },
    { l: "L", v: record?.lost ?? 0 },
    { l: "GF", v: record?.gf ?? 0 },
    { l: "GA", v: record?.ga ?? 0 },
    { l: "GD", v: record ? (record.gd > 0 ? `+${record.gd}` : record.gd) : 0 },
    { l: "Pts", v: record?.points ?? 0, accent: true },
  ];

  const liveOpp = liveMatch ? opponent(liveMatch, id) : null;
  const nextOpp = nextMatch ? opponent(nextMatch, id) : null;
  const liveUs = liveMatch ? (liveMatch.home === id ? liveMatch.homeScore : liveMatch.awayScore) : null;
  const liveThem = liveMatch ? (liveMatch.home === id ? liveMatch.awayScore : liveMatch.homeScore) : null;

  return (
    <>
      <div className="al-page-head" style={{ borderBottom: "none", marginBottom: 12 }}>
        <Link href="/" className="al-back">← Album home</Link>
        <AlbumRefresh source={source} fetchedAt={fetchedAt} />
      </div>

      {/* hero */}
      <section className="al-thero al-reveal">
        <div className="id">
          <span className="crest">{team.flag}</span>
          <div style={{ minWidth: 0 }}>
            <div className="meta-top">
              <span className="gtab">Group {team.group}</span>
              <span className="code">{team.code}</span>
            </div>
            <h1>{team.name}</h1>
            <div className="facts">
              <span><b>#{team.fifaRank}</b> FIFA ranking</span>
              <span>·</span>
              <span>{team.confederation} — {REGION[team.confederation]}</span>
            </div>
          </div>
        </div>

        {liveMatch && liveOpp ? (
          <div className="status live">
            <div className="lbl"><span className="dot" /> Live now</div>
            <div className="opp">
              <span className="fl">{liveOpp.flag}</span>
              <span className="nm">{liveOpp.name}</span>
              {liveUs != null && liveThem != null && <span className="sc" style={{ marginLeft: "auto" }}>{liveUs}–{liveThem}</span>}
            </div>
          </div>
        ) : nextMatch && nextOpp ? (
          <div className="status">
            <div className="lbl">Up next</div>
            <div className="opp">
              <span className="fl">{nextOpp.flag}</span>
              <span className="nm">{nextOpp.name}</span>
            </div>
            <div className="when">
              <span>{fmtDate(nextMatch.date)}</span>
              <AlbumCountdown iso={nextMatch.date} />
            </div>
          </div>
        ) : (
          <div className="status">
            <div className="lbl">Group stage</div>
            <div className="opp"><span className="nm">{played > 0 ? "All matches played" : "Awaiting kick-off"}</span></div>
            <div className="when">
              <span>{played > 0 && rank > 0 ? `Finished ${ordinal(rank)} in Group ${team.group}` : "Three group games to come"}</span>
            </div>
          </div>
        )}
      </section>

      {/* record + form */}
      <section className="al-sec">
        <div className="al-sec-head">
          <div>
            <span className="scribble">The numbers</span>
            <h2>Group stage record</h2>
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
          <span className="lbl">Form</span>
          {form.length === 0 ? (
            <span className="al-empty">No matches played yet.</span>
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
            <span className="scribble">Group {team.group}</span>
            <h2>Where they stand</h2>
          </div>
          <Link className="more" href="/groups">All groups →</Link>
        </div>
        <div className="al-standwrap">
          <table className="al-stand">
            <thead>
              <tr>
                <th>#</th><th>Team</th><th>P</th><th>W</th><th>D</th><th>L</th><th>GF</th><th>GA</th><th>GD</th><th>Pts</th>
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
                        <Link href={`/teams/${t.id}`} className="tm">
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

      {/* fixtures */}
      <section className="al-sec">
        <div className="al-sec-head">
          <div>
            <span className="scribble">Every match</span>
            <h2>Fixtures &amp; results</h2>
          </div>
        </div>
        {teamMatches.length > 0 ? (
          <div className="al-matches">
            {teamMatches.map((m) => <MatchSticker key={m.id} m={m} />)}
          </div>
        ) : (
          <p className="al-empty">Fixtures will appear once the schedule is confirmed.</p>
        )}
      </section>

      {/* rivals */}
      {rows.length > 1 && (
        <section className="al-sec">
          <div className="al-sec-head">
            <div>
              <span className="scribble">Same group</span>
              <h2>Group {team.group} rivals</h2>
            </div>
          </div>
          <div className="al-rivals">
            {rows
              .filter((r) => r.teamId !== id)
              .map((r) => {
                const t = getTeam(r.teamId);
                if (!t) return null;
                return (
                  <Link key={t.id} href={`/teams/${t.id}`} className="al-rival">
                    <span className="fl">{t.flag}</span>
                    <span style={{ minWidth: 0 }}>
                      <span className="nm" style={{ display: "block" }}>{t.name}</span>
                      <span className="sub">#{t.fifaRank} · {r.points} pts</span>
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
