import type { MatchCard, TeamStat, TeamLineup } from "./types";
import statsData from "@/data/match-stats-2026.json";

/**
 * Post-match metrics for finished World Cup 2026 matches — team stats
 * (possession, shots, corners, fouls…), yellow/red cards, and starting
 * line-ups.
 *
 * Fetched live from ESPN's public soccer API (no key) and cached in the
 * Next.js Data Cache for 1 day (tag "espn-stats"). The "Fetch latest stats"
 * button on the match page busts that tag (revalidateTag) for an on-demand
 * refresh. On any fetch failure we fall back to the bundled snapshot
 * (data/match-stats-2026.json, refreshed by scripts/fetch-match-stats.mjs),
 * so the page always renders. ESPN team abbreviations are our team ids
 * (lower-cased).
 */

const ESPN_BASE = "https://site.api.espn.com/apis/site/v2/sports/soccer/fifa.world";
const STATS_TAG = "espn-stats";
const ONE_DAY = 86400;

// ESPN statistic name -> our short key (percentages already 0-100).
const STAT_KEYS: Record<string, keyof TeamStat> = {
  possessionPct: "possession",
  totalShots: "shots",
  shotsOnTarget: "shotsOnTarget",
  wonCorners: "corners",
  foulsCommitted: "fouls",
  offsides: "offsides",
  saves: "saves",
  totalPasses: "passes",
};

interface TeamEntry {
  stats?: TeamStat;
  lineup?: TeamLineup;
}
interface RawCard {
  team: string | null;
  player: string;
  minute: string;
  type: "yellow" | "red";
}
interface RawRecord {
  pair?: string;
  date?: string;
  teams: Record<string, TeamEntry>;
  cards: RawCard[];
}

/* -------------------------------- bundled fallback ------------------------- */

const pairKey = (a: string, b: string) => [a, b].sort().join("_");
const BUNDLED = new Map<string, RawRecord>();
for (const r of statsData as unknown as RawRecord[]) {
  BUNDLED.set(r.pair ?? pairKey(...(Object.keys(r.teams) as [string, string])), r);
}

/* --------------------------------- orient ---------------------------------- */

export interface MatchStats {
  home: TeamStat;
  away: TeamStat;
  homeLineup?: TeamLineup;
  awayLineup?: TeamLineup;
  cards: MatchCard[];
  hasStats: boolean;
}

function minuteValue(m: string): number {
  const [base, extra] = m.split("+");
  return Number(base) + (extra ? Number(extra) / 100 : 0);
}

function orient(r: RawRecord, homeId: string, awayId: string): MatchStats {
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

/* ------------------------------- ESPN (live) ------------------------------- */

/* eslint-disable @typescript-eslint/no-explicit-any */
async function espn(url: string): Promise<any | null> {
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0" },
      next: { revalidate: ONE_DAY, tags: [STATS_TAG] },
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

function ymd(d: Date): string {
  return (
    d.getUTCFullYear().toString() +
    String(d.getUTCMonth() + 1).padStart(2, "0") +
    String(d.getUTCDate()).padStart(2, "0")
  );
}

/** Find the ESPN event id for a fixture by scanning its date (±1 day for tz). */
async function findEventId(homeId: string, awayId: string, dateISO: string): Promise<string | null> {
  const base = new Date(dateISO);
  const want = new Set([homeId, awayId]);
  for (const offset of [0, -1, 1]) {
    const d = new Date(base);
    d.setUTCDate(d.getUTCDate() + offset);
    const sb = await espn(`${ESPN_BASE}/scoreboard?dates=${ymd(d)}`);
    for (const e of sb?.events ?? []) {
      const comp = e.competitions?.[0];
      if (!comp?.status?.type?.completed) continue;
      const codes = (comp.competitors ?? []).map((c: any) => c.team?.abbreviation?.toLowerCase());
      if (codes.length === 2 && want.has(codes[0]) && want.has(codes[1])) return e.id as string;
    }
  }
  return null;
}

function extractSummary(summary: any): RawRecord {
  const id2code: Record<string, string> = {};
  for (const t of summary.boxscore?.teams ?? []) {
    id2code[t.team.id] = t.team.abbreviation.toLowerCase();
  }
  const teams: Record<string, TeamEntry> = {};
  for (const t of summary.boxscore?.teams ?? []) {
    const code = t.team.abbreviation.toLowerCase();
    const stats: TeamStat = {};
    for (const st of t.statistics ?? []) {
      const key = STAT_KEYS[st.name];
      if (key) stats[key] = st.displayValue;
    }
    (teams[code] ??= {}).stats = stats;
  }
  for (const r of summary.rosters ?? []) {
    const code = r.team.abbreviation.toLowerCase();
    const starters = (r.roster ?? [])
      .filter((p: any) => p.starter)
      .map((p: any) => ({
        n: p.jersey ?? "",
        name: p.athlete?.displayName ?? "",
        pos: p.position?.abbreviation ?? "",
      }));
    (teams[code] ??= {}).lineup = { formation: r.formation ?? "", starters };
  }
  const cards: RawCard[] = [];
  for (const e of summary.keyEvents ?? []) {
    const ty = e.type?.type ?? "";
    if (ty !== "yellow-card" && ty !== "red-card") continue;
    cards.push({
      team: id2code[e.team?.id] ?? null,
      player: (e.text ?? "").split(" (")[0],
      minute: (e.clock?.displayValue ?? "").replace(/'$/, ""),
      type: ty === "yellow-card" ? "yellow" : "red",
    });
  }
  return { teams, cards };
}
/* eslint-enable @typescript-eslint/no-explicit-any */

/**
 * Stats / cards / line-ups for a finished match, oriented to the caller's
 * home/away team ids. Fetches live from ESPN (cached 1 day, tag "espn-stats")
 * and falls back to the bundled snapshot on any failure. Returns null when no
 * source has data for the fixture.
 */
export async function getMatchStats(
  homeId: string,
  awayId: string,
  dateISO: string
): Promise<MatchStats | null> {
  const eventId = await findEventId(homeId, awayId, dateISO);
  if (eventId) {
    const summary = await espn(`${ESPN_BASE}/summary?event=${eventId}`);
    if (summary) {
      const rec = extractSummary(summary);
      if (rec.teams[homeId] || rec.teams[awayId]) return orient(rec, homeId, awayId);
    }
  }
  const bundled = BUNDLED.get(pairKey(homeId, awayId));
  return bundled ? orient(bundled, homeId, awayId) : null;
}
