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

/* ── R32 field prediction (from the live group tables) ─────────────────── */

/** Predicted team ids for one R32 tie, or null on a side we can't yet project. */
export interface R32Prediction {
  home: string | null;
  away: string | null;
}

/** "Group A winners" → { pos: 1, group: "A" }; "Group B runners-up" → pos 2. */
function parseWinRun(label: string): { pos: 1 | 2; group: GroupName } | null {
  let m: RegExpMatchArray | null;
  if ((m = label.match(/group\s+([a-l])\b.*winner/i))) {
    return { pos: 1, group: m[1].toUpperCase() as GroupName };
  }
  if ((m = label.match(/group\s+([a-l])\b.*runner/i))) {
    return { pos: 2, group: m[1].toUpperCase() as GroupName };
  }
  return null;
}

/** "Group A/B/C/D/F third place" → ["A","B","C","D","F"]; null if not a third slot. */
function parseThirdSlot(label: string): GroupName[] | null {
  const m = label.match(/group\s+([a-l/]+)\s+third/i);
  if (!m) return null;
  return m[1].toUpperCase().split("/").filter(Boolean) as GroupName[];
}

/**
 * Project the 32 teams reaching the Round of 32 from the group tables *as they
 * stand*: each group's current top two fill the winner/runner-up slots, and the
 * eight best third-placed teams are matched to their eligible third-place slots
 * (a group's third can only feed a slot whose candidate set lists that group).
 * Returns a map keyed by R32 match id. Illustrative — not an official seeding.
 */
export function predictR32(matches: Match[]): Map<string, R32Prediction> {
  // Current top two of every group.
  const winner = new Map<GroupName, string>();
  const runner = new Map<GroupName, string>();
  for (const g of GROUPS) {
    const table = groupStandings(g, matches);
    if (table[0]) winner.set(g, table[0].teamId);
    if (table[1]) runner.set(g, table[1].teamId);
  }

  // The eight qualifying thirds, by their group (ranked best-first).
  const qualThirds = bestThirds(matches).filter((r) => r.qualifies);
  const thirdTeam = new Map<GroupName, string>();
  for (const r of qualThirds) thirdTeam.set(r.group, r.standing.teamId);

  const slotMap = r32SlotMap(matches);

  // Collect every third-place slot with its eligible groups, then match each to
  // a distinct qualifying third (Kuhn's augmenting-path bipartite matching).
  const thirdSlots: { matchId: string; side: "home" | "away"; candidates: GroupName[] }[] = [];
  for (const [id, s] of slotMap) {
    for (const side of ["home", "away"] as const) {
      const cand = parseThirdSlot(s[side]);
      if (cand) thirdSlots.push({ matchId: id, side, candidates: cand.filter((g) => thirdTeam.has(g)) });
    }
  }

  const slotGroup = new Map<number, GroupName>(); // slot index → assigned group
  const groupSlot = new Map<GroupName, number>(); // group → slot index
  const augment = (si: number, seen: Set<GroupName>): boolean => {
    for (const g of thirdSlots[si].candidates) {
      if (seen.has(g)) continue;
      seen.add(g);
      const taken = groupSlot.get(g);
      if (taken === undefined || augment(taken, seen)) {
        slotGroup.set(si, g);
        groupSlot.set(g, si);
        return true;
      }
    }
    return false;
  };
  // Most-constrained slots first → a complete assignment when one exists.
  const order = thirdSlots.map((_, i) => i).sort((a, b) => thirdSlots[a].candidates.length - thirdSlots[b].candidates.length);
  for (const si of order) augment(si, new Set());

  const resolveWinRun = (label: string): string | null => {
    const p = parseWinRun(label);
    if (!p) return null;
    return (p.pos === 1 ? winner.get(p.group) : runner.get(p.group)) ?? null;
  };

  const out = new Map<string, R32Prediction>();
  for (const [id, s] of slotMap) {
    out.set(id, { home: resolveWinRun(s.home), away: resolveWinRun(s.away) });
  }
  thirdSlots.forEach((slot, si) => {
    const g = slotGroup.get(si);
    const teamId = g ? thirdTeam.get(g) ?? null : null;
    const cur = out.get(slot.matchId);
    if (cur) out.set(slot.matchId, { ...cur, [slot.side]: teamId });
  });
  return out;
}
