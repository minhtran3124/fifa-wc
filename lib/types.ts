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
  coach?: string;      // current head coach
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
  /** half-time score (finished matches, from openfootball match data) */
  htHome?: number;
  htAway?: number;
  /** goalscorer timeline (finished matches, from openfootball match data) */
  goals?: GoalEvent[];
}

/** Post-match team statistics (from ESPN; strings as reported, % are 0-100). */
export interface TeamStat {
  possession?: string;
  shots?: string;
  shotsOnTarget?: string;
  corners?: string;
  fouls?: string;
  offsides?: string;
  saves?: string;
  passes?: string;
}

/** A yellow/red card on the match timeline. */
export interface MatchCard {
  side: "home" | "away";
  player: string;
  minute: string;
  type: "yellow" | "red";
}

export interface LineupPlayer {
  n: string;   // shirt number
  name: string;
  pos: string; // position abbreviation (G/D/M/F)
}

export interface TeamLineup {
  formation: string;
  starters: LineupPlayer[];
}

/** A single goal event on the match timeline. */
export interface GoalEvent {
  /** which side the goal counts for */
  team: "home" | "away";
  /** scorer name (for an own goal, the player who put it in their own net) */
  name: string;
  /** minute as reported, e.g. "67" or "90+5" */
  minute: string;
  penalty?: boolean;
  owngoal?: boolean;
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
