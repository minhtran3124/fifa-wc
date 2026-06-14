import type { Match, GroupName, Stage } from "./types";
import { getTeam } from "./teams";
import { teamId } from "./teamMeta";
import { vnDayKey } from "./format";
import fixturesData from "@/data/fixtures.json";

/* eslint-disable @typescript-eslint/no-explicit-any */
const FIXTURES: any[] = (fixturesData as any).fixtures ?? [];
/* eslint-enable @typescript-eslint/no-explicit-any */

/** "Today" for the simulated tournament — drives which matches show preview scores. */
export const TODAY = new Date("2026-06-14T00:00:00Z");

const STAGE_MAP: Record<string, Stage> = {
  "group-stage": "group",
  "round-of-32": "R32",
  "round-of-16": "R16",
  "quarter-finals": "QF",
  "semi-finals": "SF",
  "third-place": "third",
  "final": "final",
};

/* ------------------------- deterministic preview scores ------------------------- */
// The fixtures feed has no scores, so past group matches get stable, strength-
// weighted *preview* scores (deterministic per match) to populate tables & stats.

function seededRng(seed: string): () => number {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return () => {
    h += 0x6d2b79f5;
    let t = h;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function poisson(lambda: number, rng: () => number): number {
  const L = Math.exp(-lambda);
  let k = 0;
  let p = 1;
  do {
    k++;
    p *= rng();
  } while (p > L);
  return Math.min(k - 1, 6);
}

function simulateScore(id: string, homeRank: number, awayRank: number) {
  const rng = seededRng(id);
  const homeExp = Math.max(0.25, 1.15 + (awayRank - homeRank) / 90 + 0.15);
  const awayExp = Math.max(0.25, 1.15 + (homeRank - awayRank) / 90);
  return { home: poisson(homeExp, rng), away: poisson(awayExp, rng) };
}

/* --------------------------------- builders -------------------------------- */

/** Map a raw TheStatsAPI fixtures array into our typed Match[] (used for both
 *  the bundled file and live-fetched data). */
export function fixturesToMatches(fixtures: any[]): Match[] { // eslint-disable-line @typescript-eslint/no-explicit-any
  // matchday per group: order each group's six matches by kickoff → 1,1,2,2,3,3
  const groupOrder = new Map<string, number>();
  const byGroup = new Map<string, any[]>(); // eslint-disable-line @typescript-eslint/no-explicit-any
  for (const f of fixtures) {
    if (f.stage !== "group-stage") continue;
    if (!byGroup.has(f.group)) byGroup.set(f.group, []);
    byGroup.get(f.group)!.push(f);
  }
  for (const [, list] of byGroup) {
    list
      .sort((a, b) => a.kickoffUtc.localeCompare(b.kickoffUtc))
      .forEach((f, i) => groupOrder.set(f.matchNumber, Math.floor(i / 2) + 1));
  }

  return fixtures.map((f) => {
    const stage = STAGE_MAP[f.stage] ?? "group";
    const isGroup = stage === "group";
    const home = isGroup ? teamId(f.homeTeam) : (f.homeTeam as string);
    const away = isGroup ? teamId(f.awayTeam) : (f.awayTeam as string);
    const kickoff = new Date(f.kickoffUtc);

    const match: Match = {
      id: `m${f.matchNumber}`,
      stage,
      group: isGroup ? (f.group as GroupName) : undefined,
      matchday: isGroup ? groupOrder.get(f.matchNumber) : undefined,
      home,
      away,
      date: kickoff.toISOString(),
      venueId: f.hostCity as string,
      status: "scheduled",
    };

    if (isGroup && kickoff < TODAY) {
      match.status = "finished";
      const s = simulateScore(
        match.id,
        getTeam(home)?.fifaRank ?? 50,
        getTeam(away)?.fifaRank ?? 50
      );
      match.homeScore = s.home;
      match.awayScore = s.away;
    }
    return match;
  });
}

const ALL: Match[] = fixturesToMatches(FIXTURES);

export const GROUP_MATCHES: Match[] = ALL.filter((m) => m.stage === "group");
export const KNOCKOUT_MATCHES: Match[] = ALL.filter((m) => m.stage !== "group");
export const ALL_MATCHES: Match[] = ALL;

export const matchesByGroup = (g: GroupName): Match[] =>
  GROUP_MATCHES.filter((m) => m.group === g).sort((a, b) => a.date.localeCompare(b.date));

export const matchesByStage = (stage: Stage): Match[] =>
  ALL.filter((m) => m.stage === stage).sort((a, b) => a.date.localeCompare(b.date));

export function matchesByDay(matches: Match[] = ALL): { date: string; matches: Match[] }[] {
  const map = new Map<string, Match[]>();
  for (const m of matches) {
    const day = vnDayKey(m.date); // group by Vietnam calendar date
    if (!map.has(day)) map.set(day, []);
    map.get(day)!.push(m);
  }
  return [...map.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, ms]) => ({
      date,
      matches: ms.sort((a, b) => a.date.localeCompare(b.date)),
    }));
}

/**
 * Label for a knockout participant. In the real feed these are already readable
 * strings ("Group A runners-up", "Winner Match 74"), so we return them as-is.
 */
export function slotLabel(code: string): string {
  return code;
}
