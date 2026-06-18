import type { MatchCard, TeamStat, TeamLineup } from "./types";
import statsData from "@/data/match-stats-2026.json";

/**
 * Post-match metrics for finished World Cup 2026 matches — team stats
 * (possession, shots, corners, fouls…), yellow/red cards, and starting
 * line-ups. Scraped from ESPN into a bundled snapshot by
 * `scripts/fetch-match-stats.mjs` (re-run to refresh). Records are keyed by
 * the sorted team-id pair; per-team data lives under its code.
 */

interface RawCard {
  team: string | null;
  player: string;
  minute: string;
  type: "yellow" | "red";
}

interface RawRecord {
  pair: string;
  date: string;
  teams: Record<string, { stats?: TeamStat; lineup?: TeamLineup }>;
  cards: RawCard[];
}

const RAW = statsData as unknown as RawRecord[];

const pairKey = (a: string, b: string) => [a, b].sort().join("_");

const BY_PAIR = new Map<string, RawRecord>();
for (const r of RAW) BY_PAIR.set(r.pair, r);

function minuteValue(m: string): number {
  const [base, extra] = m.split("+");
  return Number(base) + (extra ? Number(extra) / 100 : 0);
}

export interface MatchStats {
  home: TeamStat;
  away: TeamStat;
  homeLineup?: TeamLineup;
  awayLineup?: TeamLineup;
  cards: MatchCard[];
  hasStats: boolean;
}

/**
 * Stats / cards / line-ups for a finished match, oriented to the caller's
 * home/away team ids. Returns null when the snapshot has no record.
 */
export function getMatchStats(homeId: string, awayId: string): MatchStats | null {
  const r = BY_PAIR.get(pairKey(homeId, awayId));
  if (!r) return null;

  const h = r.teams[homeId];
  const a = r.teams[awayId];

  const cards: MatchCard[] = r.cards
    .map((c) => ({
      side: (c.team === homeId ? "home" : "away") as "home" | "away",
      player: c.player,
      minute: c.minute,
      type: c.type,
    }))
    .sort((x, y) => minuteValue(x.minute) - minuteValue(y.minute));

  return {
    home: h?.stats ?? {},
    away: a?.stats ?? {},
    homeLineup: h?.lineup,
    awayLineup: a?.lineup,
    cards,
    hasStats: !!(h?.stats && Object.keys(h.stats).length > 0),
  };
}
