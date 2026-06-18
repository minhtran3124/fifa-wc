import squadsData from "@/data/squads.json";

export interface SquadPlayer {
  id: number;
  name: string;
  age: number | null;
  number: number | null;
  position: string; // "Goalkeeper" | "Defender" | "Midfielder" | "Attacker"
  photo: string | null;
}

/** Display order for position groups. */
export const POSITION_ORDER = ["Goalkeeper", "Defender", "Midfielder", "Attacker"] as const;
export type Position = (typeof POSITION_ORDER)[number];

const SQUADS = squadsData as unknown as Record<string, SquadPlayer[]>;

/**
 * Current 26-player World Cup 2026 squad for a team. Curated from the official
 * squad lists (Wikipedia "2026 FIFA World Cup squads"; ages as of 11 Jun 2026,
 * the first tournament day) into data/squads.json — name, age, shirt number and
 * position, keyed by our team id. Returns [] for an unknown team.
 *
 * Player photos are not included (the UI shows a placeholder), and club history
 * / per-player stats are intentionally omitted. This is a point-in-time snapshot
 * rather than a live feed, so it does not change once the tournament squads lock.
 */
export async function getSquad(teamCode: string): Promise<SquadPlayer[]> {
  return SQUADS[teamCode] ?? [];
}

/** Group a flat squad into position buckets in display order. */
export function groupSquad(players: SquadPlayer[]): { position: Position; players: SquadPlayer[] }[] {
  return POSITION_ORDER.map((position) => ({
    position,
    players: players
      .filter((p) => p.position === position)
      .sort((a, b) => (a.number ?? 99) - (b.number ?? 99)),
  })).filter((g) => g.players.length > 0);
}
