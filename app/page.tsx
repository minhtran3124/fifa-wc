import Link from "next/link";
import { TEAMS, GROUPS, teamsByGroup } from "@/lib/teams";
import { tournamentStats } from "@/lib/standings";
import { getWcData } from "@/lib/footballData";
import { fmtTime } from "@/lib/format";
import { MASCOTS } from "@/lib/mascots";
import MatchSticker, { side, STAGE_LABEL } from "./MatchSticker";
import AlbumRefresh from "./AlbumRefresh";

// festive sticker-tape band (decorative)
const PARADE = ["⚽", "🏆", "🥅", "🎉", "🎺", "🔥", "🌎", "🙌", "🥇", "📣", "🇺🇸", "🇨🇦", "🇲🇽", "🫎", "🐆", "🦅"];

export default async function AlbumHome() {
  const { matches, source, fetchedAt } = await getWcData();

  const finished = matches.filter((m) => m.status === "finished");
  const live = matches.filter((m) => m.status === "live");
  const scheduled = matches.filter((m) => m.status === "scheduled");
  const nextMatch = scheduled[0];
  const featured = live[0] ?? nextMatch;
  const recent = finished.slice(-6).reverse();
  const upcoming = scheduled.slice(0, 6);
  const stats = tournamentStats(matches);

  const playedIds = new Set<string>();
  for (const m of finished) {
    playedIds.add(m.home);
    playedIds.add(m.away);
  }
  const collected = TEAMS.filter((t) => playedIds.has(t.id)).length;
  const pct = Math.round((collected / 48) * 100);

  const stamps = [
    { v: `${stats.matchesPlayed}`, frac: `/${stats.totalMatches}`, l: "Stickers stuck", icon: "📒" },
    { v: `${stats.goals}`, l: "Goals scored", icon: "⚽" },
    { v: `${stats.avgGoals}`, l: "Goals / match", icon: "🎯" },
    { v: `${stats.cleanSheets}`, l: "Clean sheets", icon: "🧤" },
  ];

  const fHome = featured ? side(featured.home, featured.homeName) : null;
  const fAway = featured ? side(featured.away, featured.awayName) : null;
  const fScored = featured && featured.homeScore != null && featured.awayScore != null;

  return (
    <>
      <div
        className="al-page-head"
        style={{ borderBottom: "none", marginBottom: 0, paddingBottom: 0, justifyContent: "flex-end" }}
      >
        <AlbumRefresh source={source} fetchedAt={fetchedAt} />
      </div>

      {/* ---------- hero ---------- */}
      <section className="al-hero">
        {/* drifting album stickers — playful, behind the content */}
        <span className="al-float" aria-hidden style={{ left: "31%", bottom: "2px" }}>⚽</span>
        <span className="al-float" aria-hidden style={{ right: "5%", top: "4px", animationDelay: "1.4s" }}>🎉</span>
        <span className="al-float" aria-hidden style={{ left: "-1%", top: "42%", animationDelay: "0.7s" }}>🏆</span>

        <div className="al-reveal">
          <span className="al-kicker">Stick&rsquo;em in!</span>
          <h1 className="al-title">
            World&nbsp;Cup <span className="yr">26</span>
          </h1>
          <p className="al-sub">
            Collect all 48 nations across the USA, Canada &amp; Mexico. Every match you
            watch sticks a crest in the book — tables, the bracket and stats fill in as
            the tournament plays out.
          </p>
          <div className="al-cta">
            <Link className="al-btn primary" href="/matches">Open the album</Link>
            <Link className="al-btn ghost" href="/groups">Group tables</Link>
            <span className="al-hostflags" title="USA · Canada · Mexico">🇺🇸 🇨🇦 🇲🇽</span>
          </div>
        </div>

        {featured && fHome && fAway && (
          <div className="al-shiny al-reveal" style={{ animationDelay: "120ms" }}>
            <span className="ribbon">{live[0] ? "live now" : "next up"}</span>
            <div className="row">
              <span className="side">
                <span className="fl">{fHome.flag}</span>
                <span className="nm">{fHome.name}</span>
              </span>
              {fScored ? (
                <span className="score">
                  {featured.homeScore}<span style={{ color: "var(--al-line)" }}>–</span>{featured.awayScore}
                </span>
              ) : (
                <span className="vs">vs</span>
              )}
              <span className="side">
                <span className="fl">{fAway.flag}</span>
                <span className="nm">{fAway.name}</span>
              </span>
            </div>
            <div className="meta">
              <span>
                {STAGE_LABEL[featured.stage]}
                {featured.group ? ` · Group ${featured.group}` : ""}
              </span>
              {live[0] ? (
                <span className="live"><span className="dot" /> Live</span>
              ) : (
                <span>Kick-off {fmtTime(featured.date)}</span>
              )}
            </div>
          </div>
        )}
      </section>

      {/* ---------- the album: 48 nations ---------- */}
      <section className="al-sec">
        <div className="al-sec-head">
          <div>
            <span className="scribble">Gotta collect &rsquo;em all</span>
            <h2>The album · 48 nations</h2>
          </div>
          <div className="al-progress">
            <span>{collected} / 48 collected</span>
            <span className="al-meter"><i style={{ width: `${Math.max(pct, 3)}%` }} /></span>
          </div>
        </div>

        <div className="al-pages">
          {GROUPS.map((g) => {
            const teams = teamsByGroup(g);
            const got = teams.filter((t) => playedIds.has(t.id)).length;
            return (
              <div key={g} className="al-page">
                <div className="pg-head">
                  <span className="pg-tab">{g}</span>
                  <span className="pg-ttl">Group {g}</span>
                  <span className="pg-ct">{got}/{teams.length}</span>
                </div>
                <div className="al-discs">
                  {teams.map((t) => {
                    const has = playedIds.has(t.id);
                    return (
                      <Link
                        key={t.id}
                        href={`/teams/${t.id}`}
                        className={`al-disc ${has ? "got" : "todo"}`}
                        aria-label={`${t.name}${has ? " — collected" : " — not collected yet"}`}
                      >
                        <span className="ring">
                          <span className="fl">{t.flag}</span>
                          {has && <span className="got-tab">✓</span>}
                        </span>
                        <span className="nm">{t.name}</span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ---------- pulse stamps ---------- */}
      <section className="al-sec">
        <div className="al-sec-head">
          <div>
            <span className="scribble">Album stats</span>
            <h2>By the numbers</h2>
          </div>
          <Link className="more" href="/stats">All stats →</Link>
        </div>
        <div className="al-stamps">
          {stamps.map((s) => (
            <div key={s.l} className="al-stamp">
              <span className="ic">{s.icon}</span>
              <div className="v">
                {s.v}{s.frac && <span className="frac">{s.frac}</span>}
              </div>
              <div className="l">{s.l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ---------- mascots ---------- */}
      <section className="al-sec">
        <div className="al-sec-head">
          <div>
            <span className="scribble">Say hello</span>
            <h2>The official crew</h2>
          </div>
          <span className="more" style={{ color: "var(--al-ink-soft)", fontWeight: 700 }}>
            Unveiled Sept 2025
          </span>
        </div>
        <div className="al-mascots">
          {MASCOTS.map((m, i) => (
            <Link
              key={m.name}
              href={`/teams/${m.teamId}`}
              className="al-mascot al-reveal"
              style={{ animationDelay: `${i * 90}ms` }}
            >
              <span className="glow" style={{ background: m.accent }} aria-hidden />
              <span className="role" style={{ background: m.accent }}>{m.role}</span>
              <span className="crest">{m.emoji}</span>
              <h3>{m.name}</h3>
              <p className="who">
                <span className="fl">{m.flag}</span> {m.animal} · {m.country}
              </p>
              <p className="blurb">{m.blurb}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* ---------- sticker-tape parade ---------- */}
      <div className="al-parade" aria-hidden>
        <div className="al-parade-track">
          {[...PARADE, ...PARADE].map((e, i) => (
            <span key={i}>{e}</span>
          ))}
        </div>
      </div>

      {/* ---------- results + upcoming ---------- */}
      <section className="al-sec">
        <div className="al-cols">
          <div>
            <div className="al-sec-head">
              <div>
                <span className="scribble">Just stuck in</span>
                <h2>Latest results</h2>
              </div>
            </div>
            {recent.length ? (
              <div className="al-matches">
                {recent.map((m) => <MatchSticker key={m.id} m={m} />)}
              </div>
            ) : (
              <p className="al-empty">The first stickers go in when the tournament kicks off.</p>
            )}
          </div>
          <div>
            <div className="al-sec-head">
              <div>
                <span className="scribble">Coming up</span>
                <h2>Next to collect</h2>
              </div>
              <Link className="more" href="/matches">Full schedule →</Link>
            </div>
            {upcoming.length ? (
              <div className="al-matches">
                {upcoming.map((m) => <MatchSticker key={m.id} m={m} />)}
              </div>
            ) : (
              <p className="al-empty">No upcoming fixtures.</p>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
