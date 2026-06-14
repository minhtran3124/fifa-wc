export type Confederation =
  | "UEFA"
  | "CONMEBOL"
  | "CONCACAF"
  | "CAF"
  | "AFC"
  | "OFC";

export type GroupName =
  | "A" | "B" | "C" | "D" | "E" | "F"
  | "G" | "H" | "I" | "J" | "K" | "L";

export type Stage = "group" | "R32" | "R16" | "QF" | "SF" | "third" | "final";

export type MatchStatus = "scheduled" | "live" | "finished";

export interface Team {
  id: string;          // 3-letter code, lowercase
  name: string;
  code: string;        // 3-letter uppercase (FIFA style)
  flag: string;        // emoji
  confederation: Confederation;
  fifaRank: number;
  pot?: 1 | 2 | 3 | 4;
  group: GroupName;
}

export interface Venue {
  id: string;
  city: string;
  country: "USA" | "Canada" | "Mexico";
  stadium: string;
}

export interface Match {
  id: string;
  stage: Stage;
  group?: GroupName;
  matchday?: number;
  /** team id, or a placeholder label for knockout (e.g. "1A", "W49") */
  home: string;
  away: string;
  /** display names from a live source (override the static team lookup) */
  homeName?: string;
  awayName?: string;
  date: string;        // ISO datetime (UTC)
  venueId: string;
  /** venue name from a live source (when not one of our static venues) */
  venueName?: string;
  status: MatchStatus;
  homeScore?: number;
  awayScore?: number;
  /** for knockout: penalty result if drawn */
  homePens?: number;
  awayPens?: number;
}

export interface Standing {
  teamId: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  gf: number;          // goals for
  ga: number;          // goals against
  gd: number;          // goal difference
  points: number;
  rank: number;        // position within group (1-based)
}

export interface PlayerStat {
  name: string;
  teamId: string;
  goals: number;
  assists: number;
  position: "FW" | "MF" | "DF" | "GK";
}
