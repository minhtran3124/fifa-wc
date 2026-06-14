import type { Team, Venue, GroupName } from "./types";
import { TEAM_META, teamId, cityCountry, cityName } from "./teamMeta";
import fixturesData from "@/data/fixtures.json";

/* eslint-disable @typescript-eslint/no-explicit-any */
const RAW: any = fixturesData;
const FIXTURES: any[] = RAW.fixtures ?? [];
/* eslint-enable @typescript-eslint/no-explicit-any */

export const TOURNAMENT = RAW.tournament as {
  edition: string;
  startDate: string;
  endDate: string;
  hosts: string[];
  totalTeams: number;
  totalMatches: number;
};

export const GROUPS: GroupName[] = [
  "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L",
];

/* ------------------------------- build teams ------------------------------- */

function buildTeams(): Team[] {
  const seen = new Map<string, Team>();
  for (const f of FIXTURES) {
    if (f.stage !== "group-stage") continue;
    for (const name of [f.homeTeam, f.awayTeam] as string[]) {
      const id = teamId(name);
      if (seen.has(id)) continue;
      const meta = TEAM_META[name];
      seen.set(id, {
        id,
        name,
        code: meta?.code ?? name.slice(0, 3).toUpperCase(),
        flag: meta?.flag ?? "⬜",
        confederation: meta?.confederation ?? "UEFA",
        fifaRank: meta?.fifaRank ?? 99,
        group: f.group as GroupName,
      });
    }
  }
  return [...seen.values()].sort((a, b) => a.group.localeCompare(b.group) || a.fifaRank - b.fifaRank);
}

/* ------------------------------ build venues ------------------------------- */

function buildVenues(): Venue[] {
  const seen = new Map<string, Venue>();
  for (const f of FIXTURES) {
    const slug = f.hostCity as string;
    if (seen.has(slug)) continue;
    seen.set(slug, {
      id: slug,
      city: cityName(slug),
      country: cityCountry(slug),
      stadium: f.stadium as string,
    });
  }
  return [...seen.values()];
}

export const TEAMS: Team[] = buildTeams();
export const VENUES: Venue[] = buildVenues();

const TEAM_MAP = new Map(TEAMS.map((t) => [t.id, t]));
export const getTeam = (id: string): Team | undefined => TEAM_MAP.get(id);

const VENUE_MAP = new Map(VENUES.map((v) => [v.id, v]));
export const getVenue = (id: string): Venue | undefined => VENUE_MAP.get(id);

export const teamsByGroup = (g: GroupName): Team[] =>
  TEAMS.filter((t) => t.group === g);
