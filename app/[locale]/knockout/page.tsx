import Link from "next/link";
import type { Match, Stage } from "@/lib/types";
import { getTeam, getVenue } from "@/lib/teams";
import { slotLabel } from "@/lib/matches";
import { fmtDate } from "@/lib/format";
import { getWcData } from "@/lib/footballData";
import { getDictionary, type Dictionary } from "@/lib/dictionaries";
import type { Locale } from "@/lib/i18n";
import AlbumRefresh from "@/components/AlbumRefresh";

/* ── shared helpers ──────────────────────────────────────────────── */

/** Compress a placeholder slot into a wall-chart token for the compact bracket:
 *  "Group E winners" → "1E", "Group A runners-up" → "2A", "Winner Match 74" →
 *  "W74", best-third slots → "3rd". Unknown/"To be decided" → "" (flag only). */
function shortSlot(label: string): string {
  const s = (label || "").trim();
  let m: RegExpMatchArray | null;
  if ((m = s.match(/group\s+([a-l]).*winner/i))) return `1${m[1].toUpperCase()}`;
  if ((m = s.match(/group\s+([a-l]).*runner/i))) return `2${m[1].toUpperCase()}`;
  if (/third[\s-]*place/i.test(s)) return "3rd";
  if ((m = s.match(/winners?\s*(?:match)?\s*#?\s*(\d+)/i))) return `W${m[1]}`;
  if ((m = s.match(/losers?\s*(?:match)?\s*#?\s*(\d+)/i))) return `L${m[1]}`;
  if (/to be decided|^tbd$/i.test(s)) return "";
  return s.length > 4 ? s.slice(0, 4) : s;
}

/** Resolve a knockout participant — a real team, or an unfilled placeholder
 *  slot while the bracket is still being decided. `code` is a compact token for
 *  the bracket; `name` is the full label for the vertical road. */
function teamSide(code: string, name?: string) {
  const t = getTeam(code);
  const label = name ?? slotLabel(code);
  return {
    known: !!t,
    flag: t?.flag ?? "⬜",
    name: t?.name ?? label,
    code: t?.code ?? shortSlot(label),
  };
}

/** Who advanced — counts a penalty shoot-out when full-time was level. */
function outcome(m: Match) {
  const hs = m.homeScore;
  const as = m.awayScore;
  const scored = hs != null && as != null;
  if (m.status !== "finished" || !scored) return { scored, homeWin: false, awayWin: false };
  if (hs === as && m.homePens != null && m.awayPens != null) {
    return { scored, homeWin: m.homePens > m.awayPens, awayWin: m.awayPens > m.homePens };
  }
  return { scored, homeWin: (hs as number) > (as as number), awayWin: (as as number) > (hs as number) };
}

/* ── desktop: mirrored wall-chart bracket ───────────────────────────── */

/** Compact tie card used inside the mirrored bracket (flag + 3-letter code). */
function BracketCard({ m, locale, dict }: { m: Match; locale: Locale; dict: Dictionary }) {
  const home = teamSide(m.home, m.homeName);
  const away = teamSide(m.away, m.awayName);
  const { scored, homeWin, awayWin } = outcome(m);
  const finished = m.status === "finished";
  const live = m.status === "live";
  const decided = home.known && away.known;
  const pens = m.homePens != null && m.awayPens != null;

  const cls = ["al-wc-card", decided ? "" : "todo", finished ? "done" : "", live ? "live" : ""]
    .filter(Boolean)
    .join(" ");

  return (
    <Link href={`/${locale}/matches/${m.id}`} className={cls} title={`${home.name} – ${away.name}`}>
      {finished && <span className="al-wc-got" aria-hidden>✓</span>}
      {live && <span className="al-wc-live" aria-hidden />}
      <span className={`al-wc-row ${homeWin ? "win" : awayWin ? "lose" : ""}`}>
        <span className="fl">{home.flag}</span>
        <span className="cd">{home.code}</span>
        {scored && (
          <span className="sc">
            {m.homeScore}
            {pens && <sup>{m.homePens}</sup>}
          </span>
        )}
      </span>
      <span className={`al-wc-row ${awayWin ? "win" : homeWin ? "lose" : ""}`}>
        <span className="fl">{away.flag}</span>
        <span className="cd">{away.code}</span>
        {scored && (
          <span className="sc">
            {m.awayScore}
            {pens && <sup>{m.awayPens}</sup>}
          </span>
        )}
      </span>
    </Link>
  );
}

function BracketRound({
  side,
  position,
  label,
  ties,
  locale,
  dict,
}: {
  side: "l" | "r";
  position: "outer" | "mid" | "inner";
  label: string;
  ties: Match[];
  locale: Locale;
  dict: Dictionary;
}) {
  return (
    <div className={`al-wc-round ${side} ${position}`}>
      <div className="hd">{label}</div>
      <div className="al-wc-matches">
        {ties.map((m) => (
          <div className="al-wc-match" key={m.id}>
            <BracketCard m={m} locale={locale} dict={dict} />
          </div>
        ))}
      </div>
    </div>
  );
}

/** The central FINAL column: the trophy showpiece + third-place coda. */
function FinalColumn({
  final,
  third,
  locale,
  dict,
}: {
  final?: Match;
  third?: Match;
  locale: Locale;
  dict: Dictionary;
}) {
  const fh = final ? teamSide(final.home, final.homeName) : null;
  const fa = final ? teamSide(final.away, final.awayName) : null;
  const fo = final ? outcome(final) : { scored: false, homeWin: false, awayWin: false };
  const venue = final ? getVenue(final.venueId) : null;

  const th = third ? teamSide(third.home, third.homeName) : null;
  const ta = third ? teamSide(third.away, third.awayName) : null;
  const to = third ? outcome(third) : { scored: false, homeWin: false, awayWin: false };

  return (
    <div className="al-wc-round final">
      <div className="hd" aria-hidden>
        &nbsp;
      </div>
      <div className="al-wc-matches">
        <div className="al-wc-match">
          {final && fh && fa && (
            <Link href={`/${locale}/matches/${final.id}`} className="al-wc-fcard">
              <span className="rib">{dict.knockout.finalScribble}</span>
              <span className="trophy" aria-hidden>
                🏆
              </span>
              <div className="al-wc-frow">
                <div className={`sd ${fo.homeWin ? "win" : fo.awayWin ? "lose" : ""}`}>
                  <span className="fl">{fh.flag}</span>
                  <span className="nm">{fh.name}</span>
                </div>
                <div className="mid">
                  {fo.scored ? (
                    <span className="sc">
                      {final.homeScore}
                      <i>–</i>
                      {final.awayScore}
                    </span>
                  ) : (
                    <span className="vs">VS</span>
                  )}
                </div>
                <div className={`sd ${fo.awayWin ? "win" : fo.homeWin ? "lose" : ""}`}>
                  <span className="fl">{fa.flag}</span>
                  <span className="nm">{fa.name}</span>
                </div>
              </div>
              <div className="meta">
                {fmtDate(final.date, locale)}
                {venue ? ` · ${venue.city}` : ""}
              </div>
            </Link>
          )}

          {third && th && ta && (
            <Link href={`/${locale}/matches/${third.id}`} className="al-wc-third">
              <span className="ttl">🥉 {dict.stage.third}</span>
              <span className={`tr ${to.homeWin ? "win" : to.awayWin ? "lose" : ""}`}>
                <span className="fl">{th.flag}</span>
                <span className="cd">{th.code}</span>
                {to.scored && <span className="sc">{third.homeScore}</span>}
              </span>
              <span className={`tr ${to.awayWin ? "win" : to.homeWin ? "lose" : ""}`}>
                <span className="fl">{ta.flag}</span>
                <span className="cd">{ta.code}</span>
                {to.scored && <span className="sc">{third.awayScore}</span>}
              </span>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── mobile: vertical "Road to the Final" ───────────────────────────── */

function RoadTie({ m, locale, dict }: { m: Match; locale: Locale; dict: Dictionary }) {
  const home = teamSide(m.home, m.homeName);
  const away = teamSide(m.away, m.awayName);
  const { scored, homeWin, awayWin } = outcome(m);
  const live = m.status === "live";
  const finished = m.status === "finished";
  const decided = home.known && away.known;
  const pens = m.homePens != null && m.awayPens != null;
  const venue = getVenue(m.venueId);
  const city = venue?.city ?? m.venueName ?? "";

  const cls = ["al-ko-tie", decided ? "" : "todo", finished ? "done" : "", live ? "live" : ""]
    .filter(Boolean)
    .join(" ");

  return (
    <Link href={`/${locale}/matches/${m.id}`} className={cls}>
      {finished && <span className="al-ko-got" aria-hidden>✓</span>}
      {live && (
        <span className="al-ko-livetag">
          <span className="dot" /> {dict.match.live}
        </span>
      )}
      <div className={`al-ko-row ${homeWin ? "win" : awayWin ? "lose" : ""}`}>
        <span className="fl">{home.flag}</span>
        <span className="nm">{home.name}</span>
        {scored && (
          <span className="sc">
            {m.homeScore}
            {pens && <sup>{m.homePens}</sup>}
          </span>
        )}
      </div>
      <div className={`al-ko-row ${awayWin ? "win" : homeWin ? "lose" : ""}`}>
        <span className="fl">{away.flag}</span>
        <span className="nm">{away.name}</span>
        {scored && (
          <span className="sc">
            {m.awayScore}
            {pens && <sup>{m.awayPens}</sup>}
          </span>
        )}
      </div>
      <div className="al-ko-foot">
        <span>{finished ? dict.match.fullTime : live ? dict.match.live : fmtDate(m.date, locale)}</span>
        {city && <span className="city">{city}</span>}
      </div>
    </Link>
  );
}

function RoadStage({
  stage,
  node,
  ties,
  locale,
  dict,
}: {
  stage: Stage;
  node: string;
  ties: Match[];
  locale: Locale;
  dict: Dictionary;
}) {
  const collected = ties.filter((m) => m.status === "finished").length;
  const full = ties.length > 0 && collected === ties.length;
  return (
    <section className="al-stage al-reveal">
      <div className="al-rail">
        <span className={`al-node ${full ? "full" : ""}`}>{node}</span>
      </div>
      <div className="al-stage-body">
        <div className="al-stage-head">
          <h2>{dict.stage[stage]}</h2>
          <span className="al-stage-ct">
            {ties.length} {dict.knockout.ties}
            {collected > 0 ? ` · ${collected} ${dict.knockout.collected}` : ""}
          </span>
        </div>
        <div className="al-ties">
          {ties.map((m) => (
            <RoadTie key={m.id} m={m} locale={locale} dict={dict} />
          ))}
        </div>
      </div>
    </section>
  );
}

function RoadFinal({ m, locale, dict }: { m: Match; locale: Locale; dict: Dictionary }) {
  const home = teamSide(m.home, m.homeName);
  const away = teamSide(m.away, m.awayName);
  const { scored, homeWin, awayWin } = outcome(m);
  const pens = m.homePens != null && m.awayPens != null;
  const venue = getVenue(m.venueId);
  const venueText = venue ? `${venue.stadium}, ${venue.city}` : m.venueName ?? "";
  const decided = home.known && away.known;

  return (
    <Link href={`/${locale}/matches/${m.id}`} className={`al-ko-final ${decided ? "" : "todo"}`}>
      <span className="rib">{dict.knockout.finalScribble}</span>
      <div className="al-ko-final-row">
        <div className={`sd ${homeWin ? "win" : awayWin ? "lose" : ""}`}>
          <span className="fl">{home.flag}</span>
          <span className="nm">{home.name}</span>
        </div>
        <div className="mid">
          {scored ? (
            <span className="sc">
              {m.homeScore}
              <i>–</i>
              {m.awayScore}
            </span>
          ) : (
            <span className="vs">VS</span>
          )}
          {pens && (
            <span className="pens">
              {dict.knockout.pens} {m.homePens}–{m.awayPens}
            </span>
          )}
        </div>
        <div className={`sd ${awayWin ? "win" : homeWin ? "lose" : ""}`}>
          <span className="fl">{away.flag}</span>
          <span className="nm">{away.name}</span>
        </div>
      </div>
      <div className="al-ko-final-meta">
        {fmtDate(m.date, locale)}
        {venueText ? ` · ${venueText}` : ""}
      </div>
    </Link>
  );
}

/* ── page ────────────────────────────────────────────────────────── */

export default async function AlbumKnockout({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const l = locale as Locale;
  const dict = getDictionary(l);
  const { matches, source, fetchedAt } = await getWcData();

  const byStage = (s: Stage) =>
    matches.filter((m) => m.stage === s).sort((a, b) => a.date.localeCompare(b.date));

  const r32 = byStage("R32");
  const r16 = byStage("R16");
  const qf = byStage("QF");
  const sf = byStage("SF");
  const final = byStage("final")[0];
  const third = byStage("third")[0];

  // Split each round down the middle for the mirrored bracket. The feed gives
  // no true bracket tree, so left/right is by date order — adjacency implies the
  // pairing visually.
  const half = (arr: Match[], side: "l" | "r") =>
    side === "l" ? arr.slice(0, Math.ceil(arr.length / 2)) : arr.slice(Math.ceil(arr.length / 2));

  const koTies = matches.filter((m) => m.stage !== "group" && m.stage !== "third");
  const total = koTies.length;
  const collected = koTies.filter((m) => m.status === "finished").length;
  const pct = total ? Math.round((collected / total) * 100) : 0;

  const roadStages: { stage: Stage; node: string }[] = [
    { stage: "R32", node: "32" },
    { stage: "R16", node: "16" },
    { stage: "QF", node: "8" },
    { stage: "SF", node: "4" },
  ];

  return (
    <>
      <div className="al-page-head">
        <div>
          <Link href={`/${l}`} className="al-back">
            {dict.common.back}
          </Link>
          <h1 className="al-page-title">{dict.knockout.title}</h1>
          <p className="al-page-sub">{dict.knockout.sub}</p>
        </div>
        <AlbumRefresh source={source} fetchedAt={fetchedAt} locale={l} dict={dict} />
      </div>

      <div className="al-ko-progress al-reveal">
        <span className="scribble">{dict.knockout.scribble}</span>
        <div className="al-meter">
          <i style={{ width: `${pct}%` }} />
        </div>
        <span className="ct">
          {collected}/{total} {dict.knockout.stickersDone}
        </span>
      </div>

      {/* desktop / wide: mirrored wall-chart converging on the Final */}
      <div className="al-ko-wide al-reveal">
        <div className="al-wc">
          <BracketRound side="l" position="outer" label={dict.stage.R32} ties={half(r32, "l")} locale={l} dict={dict} />
          <BracketRound side="l" position="mid" label={dict.stage.R16} ties={half(r16, "l")} locale={l} dict={dict} />
          <BracketRound side="l" position="mid" label={dict.stage.QF} ties={half(qf, "l")} locale={l} dict={dict} />
          <BracketRound side="l" position="inner" label={dict.stage.SF} ties={half(sf, "l")} locale={l} dict={dict} />
          <FinalColumn final={final} third={third} locale={l} dict={dict} />
          <BracketRound side="r" position="inner" label={dict.stage.SF} ties={half(sf, "r")} locale={l} dict={dict} />
          <BracketRound side="r" position="mid" label={dict.stage.QF} ties={half(qf, "r")} locale={l} dict={dict} />
          <BracketRound side="r" position="mid" label={dict.stage.R16} ties={half(r16, "r")} locale={l} dict={dict} />
          <BracketRound side="r" position="outer" label={dict.stage.R32} ties={half(r32, "r")} locale={l} dict={dict} />
        </div>
      </div>

      {/* mobile / narrow: vertical Road to the Final */}
      <div className="al-ko-narrow">
        <div className="al-road">
          {roadStages.map(({ stage, node }) => (
            <RoadStage key={stage} stage={stage} node={node} ties={byStage(stage)} locale={l} dict={dict} />
          ))}
          <section className="al-stage al-stage-final al-reveal">
            <div className="al-rail">
              <span className="al-node trophy" aria-hidden>
                🏆
              </span>
            </div>
            <div className="al-stage-body">
              <div className="al-stage-head">
                <h2>{dict.stage.final}</h2>
              </div>
              {final && <RoadFinal m={final} locale={l} dict={dict} />}
              {third && (
                <div className="al-ko-third">
                  <span className="al-ko-third-ttl">🥉 {dict.stage.third}</span>
                  <RoadTie m={third} locale={l} dict={dict} />
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
