import data from "@/data/worldCups.json";

export type WorldCupResult =
  | "Champions"
  | "RunnersUp"
  | "ThirdPlace"
  | "FourthPlace"
  | "QuarterFinals"
  | "RoundOf16"
  | "GroupStage"
  | "Debut";

export interface WorldCupRecord {
  /** Year of the most recent completed World Cup before 2026, or null for a 2026 debutant. */
  year: number | null;
  host: string | null;
  result: WorldCupResult;
  /** Final ranking position in that tournament, when known. */
  rank: number | null;
}

const WORLD_CUPS = data as unknown as Record<string, WorldCupRecord>;

/**
 * A team's most recent completed World Cup appearance (pre-2026), curated from
 * Wikipedia ("[Country] at the FIFA World Cup" + each tournament's final
 * ranking) into data/worldCups.json. Returns undefined for an unknown team.
 */
export function getWorldCup(teamId: string): WorldCupRecord | undefined {
  return WORLD_CUPS[teamId];
}
