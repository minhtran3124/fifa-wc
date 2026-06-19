import type { GroupName, Match, Standing } from "./types";
import { GROUPS } from "./teams";
import { groupStandings } from "./standings";
import fixturesData from "@/data/fixtures.json";

/* eslint-disable @typescript-eslint/no-explicit-any */
/** Canonical R32 bracket slots in kickoff order, from the fixed schedule. The
 *  live feed reports knockout participants as "To be decided", so the
 *  group-position structure ("Group A winners" …) only survives here. */
const R32_CANON: { home: string; away: string }[] = ((fixturesData as any).fixtures ?? [])
  .filter((f: any) => f.stage === "round-of-32")
  .sort((a: any, b: any) => String(a.kickoffUtc).localeCompare(String(b.kickoffUtc)))
  .map((f: any) => ({ home: String(f.homeTeam), away: String(f.awayTeam) }));
/* eslint-enable @typescript-eslint/no-explicit-any */

/** Map each runtime R32 match → its canonical slot labels, aligned by kickoff
 *  order (robust across the live feed's `fd-*` ids and the bundled `m*` ids). */
export function r32SlotMap(matches: Match[]): Map<string, { home: string; away: string }> {
  const r32 = matches.filter((m) => m.stage === "R32").sort((a, b) => a.date.localeCompare(b.date));
  const map = new Map<string, { home: string; away: string }>();
  r32.forEach((m, i) => {
    const c = R32_CANON[i];
    if (c) map.set(m.id, c);
  });
  return map;
}

export interface ThirdRow {
  standing: Standing;
  group: GroupName;
  rank: number;
  /** within the top 8 → through to the Round of 32 as it stands */
  qualifies: boolean;
}

/** Cross-group ranking: points, then goal difference, then goals for. */
function compareStandings(a: Standing, b: Standing): number {
  if (b.points !== a.points) return b.points - a.points;
  if (b.gd !== a.gd) return b.gd - a.gd;
  return b.gf - a.gf;
}

/**
 * The twelve third-placed teams ranked against each other; the top eight
 * qualify for the Round of 32 as it currently stands. (Which exact slot each
 * qualifying third feeds is a fixed FIFA combination table we deliberately do
 * not fabricate — this shows the race, not the slot assignment.)
 */
export function bestThirds(matches: Match[]): ThirdRow[] {
  const rows: { standing: Standing; group: GroupName }[] = [];
  for (const g of GROUPS) {
    const third = groupStandings(g, matches)[2];
    if (third) rows.push({ standing: third, group: g });
  }
  rows.sort((a, b) => compareStandings(a.standing, b.standing));
  return rows.map((r, i) => ({ ...r, rank: i + 1, qualifies: i < 8 }));
}

/** "1A" → { pos: 1, group: "A" }; returns null for non group-position seeds. */
export function parseSeed(seed: string | null): { pos: 1 | 2; group: string } | null {
  if (!seed) return null;
  const m = seed.match(/^([12])([A-L])$/);
  return m ? { pos: Number(m[1]) as 1 | 2, group: m[2] } : null;
}
