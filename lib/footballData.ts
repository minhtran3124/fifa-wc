import type { Match, Stage, GroupName, PlayerStat } from "./types";
import { ALL_MATCHES } from "./matches";

/**
 * football-data.org v4 client (free tier covers the FIFA World Cup).
 *
 * Token is read from the environment, never hardcoded:
 *   FOOTBALL_DATA_TOKEN   (sent as the X-Auth-Token header)
 *
 * Returns real fixtures *and results*. Cached in the Next.js Data Cache (tag
 * "wc") and revalidated every 5 minutes in the background, so visitor traffic
 * is decoupled from the upstream API rate limit. The Refresh button busts the
 * tag (revalidateTag) for an immediate update. On any failure it falls back to
 * the bundled dataset, so the site always renders.
 */

const MATCHES_URL = "https://api.football-data.org/v4/competitions/WC/matches";
const SCORERS_URL = "https://api.football-data.org/v4/competitions/WC/scorers?limit=20";

export interface WcData {
  available: boolean;
  source: "live" | "bundled";
  reason?: string;
  fetchedAt: string;
  matches: Match[];
}

const STAGE_MAP: Record<string, Stage> = {
  GROUP_STAGE: "group",
  LAST_32: "R32",
  LAST_16: "R16",
  QUARTER_FINALS: "QF",
  SEMI_FINALS: "SF",
  THIRD_PLACE: "third",
  FINAL: "final",
};

function mapStatus(s: string): Match["status"] {
  if (s === "FINISHED" || s === "AWARDED") return "finished";
  if (s === "IN_PLAY" || s === "PAUSED") return "live";
  return "scheduled"; // TIMED, SCHEDULED, POSTPONED, SUSPENDED, CANCELLED
}

function groupName(g: string | null | undefined): GroupName | undefined {
  if (!g) return undefined;
  const letter = g.replace("GROUP_", "").trim();
  return /^[A-L]$/.test(letter) ? (letter as GroupName) : undefined;
}

// football-data TLAs that differ from our team codes (lib/teamMeta.ts).
const TLA_ALIAS: Record<string, string> = { URY: "uru" };

/* eslint-disable @typescript-eslint/no-explicit-any */
function teamRef(t: any): { id: string; name: string } {
  if (!t || (!t.tla && !t.name)) return { id: "tbd", name: "To be decided" };
  const key = t.tla ? TLA_ALIAS[t.tla] ?? t.tla : (t.shortName ?? t.name);
  const id = key.toString().toLowerCase().replace(/[^a-z0-9]+/g, "-");
  return { id, name: t.shortName ?? t.name ?? id };
}

function normalise(m: any): Match {
  const stage = STAGE_MAP[m.stage] ?? "group";
  const home = teamRef(m.homeTeam);
  const away = teamRef(m.awayTeam);
  const ft = m.score?.fullTime ?? {};
  const status = mapStatus(m.status);
  const match: Match = {
    id: `fd-${m.id}`,
    stage,
    group: groupName(m.group),
    matchday: stage === "group" ? m.matchday ?? undefined : undefined,
    home: home.id,
    away: away.id,
    date: m.utcDate,
    venueId: "",
    venueName: m.venue ?? undefined,
    homeName: home.name,
    awayName: away.name,
    status,
  };
  if (status === "finished" || status === "live") {
    if (ft.home != null) match.homeScore = ft.home;
    if (ft.away != null) match.awayScore = ft.away;
  }
  const pen = m.score?.penalties ?? {};
  if (pen.home != null) match.homePens = pen.home;
  if (pen.away != null) match.awayPens = pen.away;
  return match;
}
/* eslint-enable @typescript-eslint/no-explicit-any */

export async function getWcData(): Promise<WcData> {
  const fetchedAt = new Date().toISOString();
  const token = process.env.FOOTBALL_DATA_TOKEN?.trim();

  const fallback = (reason: string): WcData => ({
    available: false,
    source: "bundled",
    reason,
    fetchedAt,
    matches: ALL_MATCHES,
  });

  if (!token) return fallback("no-token");

  try {
    const res = await fetch(MATCHES_URL, {
      headers: { "X-Auth-Token": token },
      // Shared Data Cache, revalidated every 5 min in the background; the
      // Refresh button busts tag "wc" (revalidateTag) for an immediate update.
      next: { revalidate: 300, tags: ["wc"] },
    });
    if (!res.ok) return fallback(`http-${res.status}`);
    const json = await res.json();
    const raw = json?.matches;
    if (!Array.isArray(raw) || raw.length === 0) return fallback("empty");
    const matches = raw
      .map(normalise)
      .sort((a, b) => a.date.localeCompare(b.date));
    return { available: true, source: "live", fetchedAt, matches };
  } catch {
    return fallback("exception");
  }
}

// football-data position strings are free-text ("Centre-Forward", "Defence",
// "Goalkeeper", …) — collapse them to our four buckets, defaulting to FW since
// the scorers list is goal-getters.
function mapPosition(p?: string | null): PlayerStat["position"] {
  const s = (p ?? "").toLowerCase();
  if (s.includes("keeper")) return "GK";
  if (s.includes("back") || s.includes("defen")) return "DF";
  if (s.includes("midfield")) return "MF";
  return "FW";
}

/**
 * Real top scorers for the World Cup from football-data.org (goals descending).
 * Returns `[]` when there is no token or the feed is unavailable — the Stats
 * page renders an empty state in that case rather than any placeholder data.
 * `assists` is `null` on lower API tiers; we coerce it to 0 so the page can
 * decide whether an assists leaderboard has any real data to show.
 */
export async function getWcScorers(): Promise<PlayerStat[]> {
  const token = process.env.FOOTBALL_DATA_TOKEN?.trim();
  if (!token) return [];

  try {
    const res = await fetch(SCORERS_URL, {
      headers: { "X-Auth-Token": token },
      next: { revalidate: 300, tags: ["wc"] },
    });
    if (!res.ok) return [];
    const json = await res.json();
    const raw = json?.scorers;
    if (!Array.isArray(raw)) return [];
    /* eslint-disable @typescript-eslint/no-explicit-any */
    return raw
      .map((s: any): PlayerStat => {
        const team = teamRef(s.team);
        return {
          name: s.player?.name ?? team.name,
          teamId: team.id,
          goals: s.goals ?? 0,
          assists: s.assists ?? 0,
          position: mapPosition(s.player?.position),
        };
      })
      .filter((p) => p.goals > 0);
    /* eslint-enable @typescript-eslint/no-explicit-any */
  } catch {
    return [];
  }
}
