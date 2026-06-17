import type { GoalEvent, Match } from "./types";
import detailsData from "@/data/match-details-2026.json";

/**
 * Finished-match results and goal events for World Cup 2026.
 *
 * Source: openfootball worldcup.json, via the fast-updating mirror
 *   https://github.com/upbound-web/worldcup-live.json  (results within hours
 *   of full-time, same schema as openfootball).
 *
 * Fetched live and cached in the Next.js Data Cache (tag "wc", revalidated
 * every 15 min — the Refresh button busts the tag). On any failure we fall
 * back to the bundled snapshot (data/match-details-2026.json) so the site
 * always renders. The feed carries scores + goalscorers (name, minute,
 * penalty/own-goal) only — no cards / possession / shots.
 */

const LIVE_URL =
  "https://raw.githubusercontent.com/upbound-web/worldcup-live.json/master/2026/worldcup.json";

interface RawGoal {
  name: string;
  minute: string | number;
  penalty?: boolean;
  owngoal?: boolean;
}

interface RawDetail {
  home: string; // team id (lowercase fifa code) of team1
  away: string; // team id of team2
  date: string;
  ft: [number, number];
  ht?: [number, number] | null;
  goals1: RawGoal[]; // scored for `home`
  goals2: RawGoal[]; // scored for `away`
}

export type DetailMap = Map<string, RawDetail>;

const pairKey = (a: string, b: string) => [a, b].sort().join("_");

/* ----------------------------- bundled fallback ---------------------------- */

const BUNDLED: DetailMap = new Map();
for (const d of detailsData as RawDetail[]) BUNDLED.set(pairKey(d.home, d.away), d);

/* ------------------------- live mirror (openfootball) ----------------------- */

// openfootball team names → our team ids (lowercase fifa codes, see teamMeta.ts).
const NAME_TO_ID: Record<string, string> = {
  Argentina: "arg", Spain: "esp", France: "fra", England: "eng", Brazil: "bra",
  Portugal: "por", Netherlands: "ned", Belgium: "bel", Germany: "ger", Croatia: "cro",
  Morocco: "mar", Colombia: "col", Mexico: "mex", Uruguay: "uru",
  USA: "usa", "United States": "usa", Senegal: "sen", Japan: "jpn", Switzerland: "sui",
  Iran: "irn", "IR Iran": "irn", Austria: "aut", "South Korea": "kor", "Korea Republic": "kor",
  Australia: "aus", Sweden: "swe", Ecuador: "ecu", Norway: "nor", Turkey: "tur", Turkiye: "tur",
  Panama: "pan", Canada: "can", Egypt: "egy", Scotland: "sco",
  "Czech Republic": "cze", Czechia: "cze", Paraguay: "par",
  "Ivory Coast": "civ", "Cote d'Ivoire": "civ", Tunisia: "tun", Algeria: "alg",
  "South Africa": "rsa", Uzbekistan: "uzb", Iraq: "irq", "Saudi Arabia": "ksa",
  "Congo DR": "cod", "DR Congo": "cod", Qatar: "qat", Jordan: "jor",
  "Cape Verde": "cpv", "Cabo Verde": "cpv", Ghana: "gha",
  "Bosnia & Herzegovina": "bih", "Bosnia and Herzegovina": "bih",
  Haiti: "hai", "New Zealand": "nzl", "Curaçao": "cuw", Curacao: "cuw",
};

/* eslint-disable @typescript-eslint/no-explicit-any */
function transform(raw: any): DetailMap | null {
  const matches = raw?.matches;
  if (!Array.isArray(matches)) return null;
  const map: DetailMap = new Map();
  for (const m of matches) {
    if (!m?.score?.ft) continue; // only played matches
    const home = NAME_TO_ID[m.team1];
    const away = NAME_TO_ID[m.team2];
    if (!home || !away) continue; // unknown team name → skip rather than guess
    map.set(pairKey(home, away), {
      home,
      away,
      date: m.date,
      ft: m.score.ft,
      ht: m.score.ht ?? null,
      goals1: m.goals1 ?? [],
      goals2: m.goals2 ?? [],
    });
  }
  return map.size ? map : null;
}
/* eslint-enable @typescript-eslint/no-explicit-any */

/**
 * Load the result + goal-event map, preferring the live mirror and falling
 * back to the bundled snapshot. Cached in the Next.js Data Cache.
 */
export async function loadDetailMap(): Promise<DetailMap> {
  try {
    const res = await fetch(LIVE_URL, { next: { revalidate: 900, tags: ["wc"] } });
    if (!res.ok) return BUNDLED;
    const map = transform(await res.json());
    return map ?? BUNDLED;
  } catch {
    return BUNDLED;
  }
}

/* --------------------------------- accessors -------------------------------- */

export interface MatchDetail {
  ftHome: number;
  ftAway: number;
  htHome?: number;
  htAway?: number;
  goals: GoalEvent[];
}

/** Minutes like "90+5" sort after "90"; "45+2" after "45". */
function minuteValue(m: string): number {
  const [base, extra] = m.split("+");
  return Number(base) + (extra ? Number(extra) / 100 : 0);
}

/**
 * Real result + goal timeline for a finished group match, oriented to the
 * caller's home/away team ids. Returns null when the source has no record.
 */
export function detailFrom(map: DetailMap, homeId: string, awayId: string): MatchDetail | null {
  const d = map.get(pairKey(homeId, awayId));
  if (!d) return null;

  const sameOrientation = d.home === homeId;
  const toEvents = (goals: RawGoal[], team: "home" | "away"): GoalEvent[] =>
    goals.map((g) => ({
      team,
      name: g.name,
      minute: String(g.minute),
      penalty: g.penalty || undefined,
      owngoal: g.owngoal || undefined,
    }));

  const homeGoals = toEvents(sameOrientation ? d.goals1 : d.goals2, "home");
  const awayGoals = toEvents(sameOrientation ? d.goals2 : d.goals1, "away");
  const goals = [...homeGoals, ...awayGoals].sort(
    (a, b) => minuteValue(a.minute) - minuteValue(b.minute)
  );

  const ht = d.ht ?? undefined;
  return {
    ftHome: sameOrientation ? d.ft[0] : d.ft[1],
    ftAway: sameOrientation ? d.ft[1] : d.ft[0],
    htHome: ht ? (sameOrientation ? ht[0] : ht[1]) : undefined,
    htAway: ht ? (sameOrientation ? ht[1] : ht[0]) : undefined,
    goals,
  };
}

/** Bundled-only lookup (synchronous) — used as the build-time baseline. */
export function getMatchDetail(homeId: string, awayId: string): MatchDetail | null {
  return detailFrom(BUNDLED, homeId, awayId);
}

/**
 * Return a copy of `matches` with finished group matches enriched from `map`
 * (real score + half-time + goal timeline). Non-group matches and matches
 * absent from the feed are returned unchanged.
 */
export function enrichMatches(matches: Match[], map: DetailMap): Match[] {
  return matches.map((m) => {
    if (m.stage !== "group") return m;
    const d = detailFrom(map, m.home, m.away);
    if (!d) return m;
    return {
      ...m,
      status: "finished",
      homeScore: d.ftHome,
      awayScore: d.ftAway,
      htHome: d.htHome ?? undefined,
      htAway: d.htAway ?? undefined,
      goals: d.goals.length ? d.goals : undefined,
    };
  });
}
