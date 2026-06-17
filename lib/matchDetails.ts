import type { GoalEvent } from "./types";
import detailsData from "@/data/match-details-2026.json";

/**
 * Real finished-match results and goal events, sourced from
 * openfootball/worldcup.json (2026). Covers the matches played so far —
 * full-time + half-time score and goalscorers (name, minute, penalty/own-goal
 * flags). There is no card / possession / shots data in that feed, so the
 * detail page only surfaces what is genuinely sourced.
 */

interface RawGoal {
  name: string;
  minute: string | number;
  penalty?: boolean;
  owngoal?: boolean;
}

interface RawDetail {
  home: string; // team id (lowercase fifa code) of openfootball team1
  away: string; // team id of openfootball team2
  date: string;
  ft: [number, number];
  ht?: [number, number] | null;
  goals1: RawGoal[]; // scored for `home`
  goals2: RawGoal[]; // scored for `away`
}

const RAW = detailsData as RawDetail[];

const pairKey = (a: string, b: string) => [a, b].sort().join("_");

const BY_PAIR = new Map<string, RawDetail>();
for (const d of RAW) BY_PAIR.set(pairKey(d.home, d.away), d);

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
 * caller's home/away team ids. Returns null when openfootball has no record
 * for that pairing (i.e. the match hasn't been played in the feed).
 */
export function getMatchDetail(homeId: string, awayId: string): MatchDetail | null {
  const d = BY_PAIR.get(pairKey(homeId, awayId));
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
