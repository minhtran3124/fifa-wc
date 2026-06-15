import { NATIONAL_TEAM_IDS } from "./nationalTeamIds";

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

/**
 * Current national-team squad from API-Football (/players/squads). Real data:
 * name, age, shirt number, position, photo. Cached 12h (squads change rarely)
 * and tagged "squad". Returns [] when there's no key, no mapping, or on error —
 * the team page shows an empty state rather than any placeholder.
 *
 * Club history and per-player goals/assists need per-player calls that exceed
 * the free-tier daily quota, so they are intentionally omitted for now.
 */
export async function getSquad(teamCode: string): Promise<SquadPlayer[]> {
  const key = process.env.API_FOOTBALL_KEY?.trim();
  const teamId = NATIONAL_TEAM_IDS[teamCode];
  if (!key || !teamId) return [];

  try {
    const res = await fetch(`https://v3.football.api-sports.io/players/squads?team=${teamId}`, {
      headers: { "x-apisports-key": key },
      next: { revalidate: 43200, tags: ["squad"] },
    });
    if (!res.ok) return [];
    const json = await res.json();
    const players = json?.response?.[0]?.players;
    if (!Array.isArray(players)) return [];
    /* eslint-disable @typescript-eslint/no-explicit-any */
    return players.map((p: any): SquadPlayer => ({
      id: p.id,
      name: p.name ?? "—",
      age: typeof p.age === "number" ? p.age : null,
      number: typeof p.number === "number" ? p.number : null,
      position: p.position ?? "",
      photo: p.photo ?? null,
    }));
    /* eslint-enable @typescript-eslint/no-explicit-any */
  } catch {
    return [];
  }
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
