import Link from "next/link";
import { TEAMS, GROUPS, teamsByGroup } from "@/lib/teams";
import { tournamentStats } from "@/lib/standings";
import { getWcData } from "@/lib/footballData";
import { previewForMatch } from "@/lib/previews";
import { fmtTime } from "@/lib/format";
import { MASCOTS } from "@/lib/mascots";
import { getDictionary } from "@/lib/dictionaries";
import type { Locale } from "@/lib/i18n";
import MatchSticker, { side } from "@/components/MatchSticker";
import AlbumRefresh from "@/components/AlbumRefresh";
import MyTeams from "@/components/MyTeams";

// festive sticker-tape band (decorative)
const PARADE = ["⚽", "🏆", "🥅", "🎉", "🎺", "🔥", "🌎", "🙌", "🥇", "📣", "🇺🇸", "🇨🇦", "🇲🇽", "🫎", "🐆", "🦅"];

export default async function AlbumHome({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const l = locale as Locale;
  const dict = getDictionary(l);
  const { matches, source, fetchedAt } = await getWcData();

  const finished = matches.filter((m) => m.status === "finished");
  const live = matches.filter((m) => m.status === "live");
  const scheduled = matches.filter((m) => m.status === "scheduled");
  const nextMatch = scheduled[0];
  const featured = live[0] ?? nextMatch;
  const recent = finished.slice(-6).reverse();
  const upcoming = scheduled.slice(0, 3);
  const stats = tournamentStats(matches);

  const playedIds = new Set<string>();
  for (const m of finished) {
    playedIds.add(m.home);
    playedIds.add(m.away);
  }
  const collected = TEAMS.filter((t) => playedIds.has(t.id)).length;
  const pct = Math.round((collected / 48) * 100);

  const stamps = [
    { v: `${stats.matchesPlayed}`, frac: `/${stats.totalMatches}`, l: dict.home.stamps.stickers, icon: "📒" },
    { v: `${stats.goals}`, l: dict.home.stamps.goals, icon: "⚽" },
    { v: `${stats.avgGoals}`, l: dict.home.stamps.perMatch, icon: "🎯" },
    { v: `${stats.cleanSheets}`, l: dict.home.stamps.cleanSheets, icon: "🧤" },
  ];

  const fHome = featured ? side(featured.home, featured.homeName) : null;
  const fAway = featured ? side(featured.away, featured.awayName) : null;
  const fScored = featured && featured.homeScore != null && featured.awayScore != null;

  // pre-match expert preview for the next scheduled fixture
  const preview = nextMatch ? previewForMatch(nextMatch) : null;
  const pHome = nextMatch ? side(nextMatch.home, nextMatch.homeName) : null;
  const pAway = nextMatch ? side(nextMatch.away, nextMatch.awayName) : null;
  const topTake = preview?.takes[0];

  return (
    <>
      <div
        className="al-page-head"
        style={{ borderBottom: "none", marginBottom: 0, paddingBottom: 0, justifyContent: "flex-end" }}
      >
        <AlbumRefresh source={source} fetchedAt={fetchedAt} locale={l} dict={dict} />
      </div>

      {/* ---------- hero ---------- */}
      <section className="al-hero">
        <span className="al-float" aria-hidden style={{ left: "31%", bottom: "2px" }}>⚽</span>
        <span className="al-float" aria-hidden style={{ right: "5%", top: "4px", animationDelay: "1.4s" }}>🎉</span>
        <span className="al-float" aria-hidden style={{ left: "-1%", top: "42%", animationDelay: "0.7s" }}>🏆</span>

        <div className="al-reveal">
          <span className="al-kicker">{dict.home.kicker}</span>
          <h1 className="al-title">
            {dict.home.title} <span className="yr">26</span>
          </h1>
          <p className="al-sub">{dict.home.sub}</p>
          <div className="al-cta">
            <Link className="al-btn primary" href={`/${l}/matches`}>{dict.home.ctaOpen}</Link>
            <Link className="al-btn ghost" href={`/${l}/groups`}>{dict.home.ctaTables}</Link>
            <span className="al-hostflags" title="USA · Canada · Mexico">🇺🇸 🇨🇦 🇲🇽</span>
          </div>
        </div>

        {featured && fHome && fAway && (
          <div className="al-shiny al-reveal" style={{ animationDelay: "120ms" }}>
            <span className="ribbon">{live[0] ? dict.home.featuredLive : dict.home.featuredNext}</span>
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
                {dict.stage[featured.stage]}
                {featured.group ? ` · ${dict.team.groupLabel} ${featured.group}` : ""}
              </span>
              {live[0] ? (
                <span className="live"><span className="dot" /> {dict.match.live}</span>
              ) : (
                <span>{dict.home.kickOff} {fmtTime(featured.date, l)}</span>
              )}
            </div>
          </div>
        )}
      </section>

      {/* ---------- up next (top of page — no scrolling needed) ---------- */}
      <section className="al-sec">
        <div className="al-sec-head">
          <div>
            <span className="scribble">{dict.home.upNextKicker}</span>
            <h2>{dict.home.upNextTitle}</h2>
          </div>
          <Link className="more" href={`/${l}/matches`}>{dict.home.fullSchedule}</Link>
        </div>
        {upcoming.length ? (
          <div className="al-matches">
            {upcoming.map((m) => <MatchSticker key={m.id} m={m} locale={l} dict={dict} />)}
          </div>
        ) : (
          <p className="al-empty">{dict.home.upNextEmpty}</p>
        )}
      </section>

      {/* ---------- my teams (favourites) ---------- */}
      <MyTeams matches={matches} locale={l} dict={dict} />

      {/* ---------- pre-match expert preview ---------- */}
      {preview && nextMatch && pHome && pAway && (
        <section className="al-sec">
          <div className="al-sec-head">
            <div>
              <span className="scribble">{dict.previews.homeKicker}</span>
              <h2>{dict.previews.homeTitle}</h2>
            </div>
            <Link className="more" href={`/${l}/previews`}>{dict.previews.homeCta}</Link>
          </div>
          <Link href={`/${l}/previews`} className="al-preview-card">
            <div className="pc-head">
              <span className="pc-team">
                <span className="fl">{pHome.flag}</span>
                <span className="nm">{pHome.name}</span>
              </span>
              <span className="pc-pred">{preview.predHome}<i>–</i>{preview.predAway}</span>
              <span className="pc-team">
                <span className="fl">{pAway.flag}</span>
                <span className="nm">{pAway.name}</span>
              </span>
            </div>
            <p className="pc-verdict">{preview.verdict[l]}</p>
            {topTake && (
              <p className="pc-take">
                “{topTake.quote[l]}” <span className="outlet">— {topTake.outlet}</span>
              </p>
            )}
          </Link>
        </section>
      )}

      {/* ---------- the album: 48 nations ---------- */}
      <section className="al-sec">
        <div className="al-sec-head">
          <div>
            <span className="scribble">{dict.home.albumKicker}</span>
            <h2>{dict.home.albumTitle}</h2>
          </div>
          <div className="al-progress">
            <span>{collected} / 48 {dict.home.collected}</span>
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
                  <span className="pg-ttl">{dict.team.groupLabel} {g}</span>
                  <span className="pg-ct">{got}/{teams.length}</span>
                </div>
                <div className="al-discs">
                  {teams.map((t) => {
                    const has = playedIds.has(t.id);
                    return (
                      <Link
                        key={t.id}
                        href={`/${l}/teams/${t.id}`}
                        className={`al-disc ${has ? "got" : "todo"}`}
                        aria-label={t.name}
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
            <span className="scribble">{dict.home.pulseKicker}</span>
            <h2>{dict.home.pulseTitle}</h2>
          </div>
          <Link className="more" href={`/${l}/stats`}>{dict.home.allStats}</Link>
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
            <span className="scribble">{dict.home.mascotsKicker}</span>
            <h2>{dict.home.mascotsTitle}</h2>
          </div>
          <span className="more" style={{ color: "var(--al-ink-soft)", fontWeight: 700 }}>
            {dict.home.mascotsUnveiled}
          </span>
        </div>
        <div className="al-mascots">
          {MASCOTS.map((m, i) => (
            <Link
              key={m.name}
              href={`/${l}/teams/${m.teamId}`}
              className="al-mascot al-reveal"
              style={{ animationDelay: `${i * 90}ms` }}
            >
              <span className="glow" style={{ background: m.accent }} aria-hidden />
              <span className="role" style={{ background: m.accent }}>{m.role[l]}</span>
              <span className="crest">{m.emoji}</span>
              <h3>{m.name}</h3>
              <p className="who">
                <span className="fl">{m.flag}</span> {m.animal[l]} · {m.country[l]}
              </p>
              <p className="blurb">{m.blurb[l]}</p>
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

      {/* ---------- recent results ---------- */}
      <section className="al-sec">
        <div className="al-sec-head">
          <div>
            <span className="scribble">{dict.home.resultsKicker}</span>
            <h2>{dict.home.resultsTitle}</h2>
          </div>
        </div>
        {recent.length ? (
          <div className="al-matches">
            {recent.map((m) => <MatchSticker key={m.id} m={m} locale={l} dict={dict} />)}
          </div>
        ) : (
          <p className="al-empty">{dict.home.resultsEmpty}</p>
        )}
      </section>
    </>
  );
}
