/* eslint-disable @typescript-eslint/no-explicit-any */
// Extra match data copied from FIFA's public data API (api.fifa.com) for the
// 2026 World Cup — attendance, referee, substitutions and lineups with player
// photos. Mapped to our fixtures by team abbreviation (== our team.code).
// Best-effort: any failure returns null and the UI simply omits these panels.

const COMP = "17"; // FIFA World Cup
const SEASON = "285023"; // 2026
const BASE = "https://api.fifa.com/api/v3";
const TTL = 86400; // 1 day

interface Loc {
  Locale?: string;
  Description?: string;
}

function pick(arr?: Loc[]): string {
  if (!Array.isArray(arr) || arr.length === 0) return "";
  return arr.find((x) => x.Locale?.startsWith("en"))?.Description ?? arr[0]?.Description ?? "";
}

export interface FifaPlayer {
  name: string;
  number: number | null;
  photo: string | null;
  captain: boolean;
}

export interface FifaSub {
  team: "home" | "away";
  minute: string;
  on: string;
  off: string;
}

export interface FifaMatch {
  attendance: string | null;
  referee: string | null;
  refereeCountry: string | null;
  subs: FifaSub[];
  homeStarters: FifaPlayer[];
  awayStarters: FifaPlayer[];
}

let calendar: Record<string, { idStage: string; idMatch: string }> | null = null;

async function loadCalendar(): Promise<Record<string, { idStage: string; idMatch: string }>> {
  if (calendar) return calendar;
  const map: Record<string, { idStage: string; idMatch: string }> = {};
  try {
    const res = await fetch(
      `${BASE}/calendar/matches?idCompetition=${COMP}&idSeason=${SEASON}&count=500&language=en`,
      { next: { revalidate: TTL } },
    );
    if (res.ok) {
      const data = await res.json();
      for (const r of data?.Results ?? []) {
        const h = String(r?.Home?.Abbreviation ?? "").toUpperCase();
        const a = String(r?.Away?.Abbreviation ?? "").toUpperCase();
        if (h && a && r?.IdStage && r?.IdMatch) {
          map[`${h}|${a}`] = { idStage: String(r.IdStage), idMatch: String(r.IdMatch) };
        }
      }
    }
  } catch {
    /* ignore — network/shape issues degrade to no FIFA data */
  }
  calendar = map;
  return map;
}

const toPlayer = (p: any): FifaPlayer => ({
  name: pick(p?.PlayerName),
  number: typeof p?.ShirtNumber === "number" ? p.ShirtNumber : null,
  photo: p?.PlayerPicture?.PictureUrl ?? null,
  captain: !!p?.Captain,
});

const startersOf = (team: any): FifaPlayer[] =>
  (team?.Players ?? []).filter((p: any) => p?.Status === 1).map(toPlayer);

/** Extra FIFA data for one fixture, keyed by our team codes (e.g. "BRA", "SCO"). */
export async function getFifaMatch(homeCode: string, awayCode: string): Promise<FifaMatch | null> {
  const H = homeCode.toUpperCase();
  const A = awayCode.toUpperCase();
  const cal = await loadCalendar();
  const aligned = !!cal[`${H}|${A}`];
  const ref = cal[`${H}|${A}`] ?? cal[`${A}|${H}`];
  if (!ref) return null;

  try {
    const res = await fetch(
      `${BASE}/live/football/${COMP}/${SEASON}/${ref.idStage}/${ref.idMatch}?language=en`,
      { next: { revalidate: TTL } },
    );
    if (!res.ok) return null;
    const d = await res.json();

    const fifaHome = d?.HomeTeam;
    const fifaAway = d?.AwayTeam;
    const ourHome = aligned ? fifaHome : fifaAway;
    const ourAway = aligned ? fifaAway : fifaHome;

    const officials: any[] = d?.Officials ?? [];
    const refObj = officials.find((o) => o?.OfficialType === 1) ?? officials[0];

    // substitutions live inside each team object (HomeTeam/AwayTeam.Substitutions)
    const subsOf = (team: any, side: "home" | "away"): FifaSub[] =>
      (team?.Substitutions ?? [])
        .map((s: any) => ({
          team: side,
          minute: String(s?.Minute ?? "").replace(/[^0-9+]/g, ""),
          on: pick(s?.PlayerOnName),
          off: pick(s?.PlayerOffName),
        }))
        .filter((s: FifaSub) => s.on || s.off);
    const subs = [...subsOf(ourHome, "home"), ...subsOf(ourAway, "away")].sort(
      (a, b) => (parseInt(a.minute) || 0) - (parseInt(b.minute) || 0),
    );

    return {
      attendance: d?.Attendance ? String(d.Attendance) : null,
      referee: refObj ? pick(refObj.Name) : null,
      refereeCountry: refObj?.IdCountry ?? null,
      subs,
      homeStarters: startersOf(ourHome),
      awayStarters: startersOf(ourAway),
    };
  } catch {
    return null;
  }
}
