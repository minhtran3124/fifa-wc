import { Fragment } from "react";
import Link from "next/link";
import type { Match, Stage } from "@/lib/types";
import { getTeam, getVenue } from "@/lib/teams";
import { slotLabel } from "@/lib/matches";
import { fmtDate } from "@/lib/format";
import { getWcData } from "@/lib/footballData";
import { r32SlotMap, bestThirds } from "@/lib/qualification";
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

/** Resolve a knockout participant: a real team once the feed officially advances
 *  it, otherwise an undecided slot. `code` is a compact token for known teams. */
function teamSide(code: string, name?: string) {
  const t = getTeam(code);
  if (t) {
    return { known: true, flag: t.flag, name: t.name, code: t.code };
  }
  const label = name ?? slotLabel(code);
  return { known: false, flag: "⬜", name: label, code: shortSlot(label) };
}

/** The fixed slot label for one side of a tie ("Group A winners", "Winner
 *  Match 74"), taken from the canonical R32 schedule — not from live tables. */
type SeedFn = (matchId: string, side: "home" | "away") => string | null;

/** Turn a slot label into readable, localised text. `compact` = wall-chart
 *  ("Nhất A" / "1st A", "Hạng 3 ABCDF"); else the vertical road ("Nhất bảng A").
 *  Group letters are kept so every slot says which group it belongs to. */
function slotText(label: string, dict: Dictionary, compact: boolean): string {
  const s = (label || "").trim();
  let m: RegExpMatchArray | null;
  if ((m = s.match(/group\s+([a-l])\b.*winner/i))) {
    return `${compact ? dict.qualif.winShort : dict.qualif.winnerOf} ${m[1].toUpperCase()}`;
  }
  if ((m = s.match(/group\s+([a-l])\b.*runner/i))) {
    return `${compact ? dict.qualif.ruShort : dict.qualif.runnerOf} ${m[1].toUpperCase()}`;
  }
  if ((m = s.match(/group\s+([a-l/]+)\s+third/i))) {
    const g = m[1].toUpperCase();
    return compact ? `${dict.qualif.thirdShort} ${g.replace(/\//g, "")}` : `${dict.qualif.thirdLabel} ${g}`;
  }
  if (/third[\s-]*place/i.test(s)) return compact ? dict.qualif.thirdShort : dict.qualif.thirdLabel;
  if ((m = s.match(/winners?\s*(?:match)?\s*#?\s*(\d+)/i))) return compact ? `W${m[1]}` : s;
  if ((m = s.match(/losers?\s*(?:match)?\s*#?\s*(\d+)/i))) return compact ? `L${m[1]}` : s;
  return compact ? shortSlot(s) : s;
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

/** Compact tie card used inside the mirrored bracket. Decided sides show flag +
 *  3-letter code; undecided sides show their localised group position. */
function BracketCard({ m, locale, dict, seed }: { m: Match; locale: Locale; dict: Dictionary; seed?: SeedFn }) {
  const home = teamSide(m.home, m.homeName);
  const away = teamSide(m.away, m.awayName);
  const homeLabel = home.known ? home.code : slotText(seed?.(m.id, "home") ?? home.name, dict, true);
  const awayLabel = away.known ? away.code : slotText(seed?.(m.id, "away") ?? away.name, dict, true);
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
      <span className={`al-wc-row ${home.known ? "" : "tbd"} ${homeWin ? "win" : awayWin ? "lose" : ""}`}>
        {home.known && <span className="fl">{home.flag}</span>}
        <span className="cd">{homeLabel}</span>
        {scored && (
          <span className="sc">
            {m.homeScore}
            {pens && <sup>{m.homePens}</sup>}
          </span>
        )}
      </span>
      <span className={`al-wc-row ${away.known ? "" : "tbd"} ${awayWin ? "win" : homeWin ? "lose" : ""}`}>
        {away.known && <span className="fl">{away.flag}</span>}
        <span className="cd">{awayLabel}</span>
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
  count,
  ties,
  locale,
  dict,
  seed,
}: {
  side: "l" | "r";
  position: "outer" | "mid" | "inner";
  label: string;
  count: number;
  ties: Match[];
  locale: Locale;
  dict: Dictionary;
  seed?: SeedFn;
}) {
  return (
    <div className={`al-wc-round ${side} ${position}`}>
      <div className="hd">
        <span className="rd">{label}</span>
        <span className="ct">{count} {dict.knockout.teams}</span>
      </div>
      <div className="al-wc-matches">
        {ties.map((m) => (
          <div className="al-wc-match" key={m.id}>
            <BracketCard m={m} locale={locale} dict={dict} seed={seed} />
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
                <div className={`sd ${fh.known ? "" : "tbd"} ${fo.homeWin ? "win" : fo.awayWin ? "lose" : ""}`}>
                  {fh.known && <span className="fl">{fh.flag}</span>}
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
                <div className={`sd ${fa.known ? "" : "tbd"} ${fo.awayWin ? "win" : fo.homeWin ? "lose" : ""}`}>
                  {fa.known && <span className="fl">{fa.flag}</span>}
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
              <span className={`tr ${th.known ? "" : "tbd"} ${to.homeWin ? "win" : to.awayWin ? "lose" : ""}`}>
                {th.known && <span className="fl">{th.flag}</span>}
                <span className="cd">{th.code}</span>
                {to.scored && <span className="sc">{third.homeScore}</span>}
              </span>
              <span className={`tr ${ta.known ? "" : "tbd"} ${to.awayWin ? "win" : to.homeWin ? "lose" : ""}`}>
                {ta.known && <span className="fl">{ta.flag}</span>}
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

function RoadTie({ m, locale, dict, seed }: { m: Match; locale: Locale; dict: Dictionary; seed?: SeedFn }) {
  const home = teamSide(m.home, m.homeName);
  const away = teamSide(m.away, m.awayName);
  // Undecided slots read as their group position ("Nhất bảng A"), localised.
  const homeName = home.known ? home.name : slotText(seed?.(m.id, "home") ?? home.name, dict, false);
  const awayName = away.known ? away.name : slotText(seed?.(m.id, "away") ?? away.name, dict, false);
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
      <div className={`al-ko-row ${home.known ? "" : "tbd"} ${homeWin ? "win" : awayWin ? "lose" : ""}`}>
        {home.known && <span className="fl">{home.flag}</span>}
        <span className="nm">{homeName}</span>
        {scored && (
          <span className="sc">
            {m.homeScore}
            {pens && <sup>{m.homePens}</sup>}
          </span>
        )}
      </div>
      <div className={`al-ko-row ${away.known ? "" : "tbd"} ${awayWin ? "win" : homeWin ? "lose" : ""}`}>
        {away.known && <span className="fl">{away.flag}</span>}
        <span className="nm">{awayName}</span>
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
  seed,
}: {
  stage: Stage;
  node: string;
  ties: Match[];
  locale: Locale;
  dict: Dictionary;
  seed?: SeedFn;
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
            <RoadTie key={m.id} m={m} locale={locale} dict={dict} seed={seed} />
          ))}
        </div>
      </div>
    </section>
  );
}

function RoadFinal({ m, locale, dict }: { m: Match; locale: Locale; dict: Dictionary }) {
  const home = teamSide(m.home, m.homeName);
  const away = teamSide(m.away, m.awayName);
  const homeName = home.known ? home.name : slotText(home.name, dict, false);
  const awayName = away.known ? away.name : slotText(away.name, dict, false);
  const { scored, homeWin, awayWin } = outcome(m);
  const pens = m.homePens != null && m.awayPens != null;
  const venue = getVenue(m.venueId);
  const venueText = venue ? `${venue.stadium}, ${venue.city}` : m.venueName ?? "";
  const decided = home.known && away.known;

  return (
    <Link href={`/${locale}/matches/${m.id}`} className={`al-ko-final ${decided ? "" : "todo"}`}>
      <span className="rib">{dict.knockout.finalScribble}</span>
      <div className="al-ko-final-row">
        <div className={`sd ${home.known ? "" : "tbd"} ${homeWin ? "win" : awayWin ? "lose" : ""}`}>
          {home.known && <span className="fl">{home.flag}</span>}
          <span className="nm">{homeName}</span>
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
        <div className={`sd ${away.known ? "" : "tbd"} ${awayWin ? "win" : homeWin ? "lose" : ""}`}>
          {away.known && <span className="fl">{away.flag}</span>}
          <span className="nm">{awayName}</span>
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

  // R32 slots show their fixed group position ("Group A winners" …), taken from
  // the canonical schedule — not from whoever currently leads the live tables.
  const slots = r32SlotMap(matches);
  const seed: SeedFn = (id, side) => {
    const s = slots.get(id);
    return s ? s[side] : null;
  };
  const thirds = bestThirds(matches);

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

      <p className="al-ko-seednote">{dict.qualif.seedNote}</p>

      {/* desktop / wide: mirrored wall-chart converging on the Final */}
      <div className="al-ko-wide al-arena al-reveal">
        <div className="al-wc">
          <BracketRound side="l" position="outer" label={dict.stage.R32} count={32} ties={half(r32, "l")} locale={l} dict={dict} seed={seed} />
          <BracketRound side="l" position="mid" label={dict.stage.R16} count={16} ties={half(r16, "l")} locale={l} dict={dict} seed={seed} />
          <BracketRound side="l" position="mid" label={dict.stage.QF} count={8} ties={half(qf, "l")} locale={l} dict={dict} seed={seed} />
          <BracketRound side="l" position="inner" label={dict.stage.SF} count={4} ties={half(sf, "l")} locale={l} dict={dict} seed={seed} />
          <FinalColumn final={final} third={third} locale={l} dict={dict} />
          <BracketRound side="r" position="inner" label={dict.stage.SF} count={4} ties={half(sf, "r")} locale={l} dict={dict} seed={seed} />
          <BracketRound side="r" position="mid" label={dict.stage.QF} count={8} ties={half(qf, "r")} locale={l} dict={dict} seed={seed} />
          <BracketRound side="r" position="mid" label={dict.stage.R16} count={16} ties={half(r16, "r")} locale={l} dict={dict} seed={seed} />
          <BracketRound side="r" position="outer" label={dict.stage.R32} count={32} ties={half(r32, "r")} locale={l} dict={dict} seed={seed} />
        </div>
      </div>

      {/* mobile / narrow: vertical Road to the Final */}
      <div className="al-ko-narrow al-arena">
        <div className="al-road">
          {roadStages.map(({ stage, node }) => (
            <RoadStage key={stage} stage={stage} node={node} ties={byStage(stage)} locale={l} dict={dict} seed={seed} />
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

      {/* best third-placed race — 12 thirds ranked, top 8 reach the R32 */}
      <section className="al-thirds al-reveal">
        <div className="al-sec-head">
          <div>
            <span className="scribble">{dict.qualif.thirdScribble}</span>
            <h2>{dict.qualif.thirdTitle}</h2>
          </div>
        </div>
        <p className="al-thirds-sub">{dict.qualif.thirdSub}</p>
        <ol className="al-thirds-list">
          {thirds.map((r) => {
            const t = getTeam(r.standing.teamId);
            const gd = r.standing.gd;
            return (
              <Fragment key={r.standing.teamId}>
                <li className={r.qualifies ? "in" : "out"}>
                  <span className="rk">{r.rank}</span>
                  <span className="fl">{t?.flag ?? "⬜"}</span>
                  <span className="nm">
                    {t?.name ?? r.standing.teamId.toUpperCase()}
                    <em>{dict.team.groupLabel} {r.group}</em>
                  </span>
                  <span className="num">{r.standing.played}</span>
                  <span className="num">{gd >= 0 ? `+${gd}` : gd}</span>
                  <span className="num pts">{r.standing.points}</span>
                  <span className="tag">{r.qualifies ? dict.qualif.in : dict.qualif.out}</span>
                </li>
                {r.rank === 8 && (
                  <li className="cutline" aria-hidden>
                    <span>{dict.qualif.cut}</span>
                  </li>
                )}
              </Fragment>
            );
          })}
        </ol>
      </section>
    </>
  );
}
