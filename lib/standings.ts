import type { GroupName, Standing, Match } from "./types";
import { getTeam } from "./teams";

function emptyStanding(teamId: string): Standing {
  return {
    teamId,
    played: 0, won: 0, drawn: 0, lost: 0,
    gf: 0, ga: 0, gd: 0, points: 0, rank: 0,
  };
}

function applyMatch(table: Map<string, Standing>, m: Match) {
  if (m.status !== "finished" || m.homeScore == null || m.awayScore == null) return;
  const h = table.get(m.home);
  const a = table.get(m.away);
  if (!h || !a) return;
  h.played++; a.played++;
  h.gf += m.homeScore; h.ga += m.awayScore;
  a.gf += m.awayScore; a.ga += m.homeScore;
  if (m.homeScore > m.awayScore) { h.won++; a.lost++; h.points += 3; }
  else if (m.homeScore < m.awayScore) { a.won++; h.lost++; a.points += 3; }
  else { h.drawn++; a.drawn++; h.points++; a.points++; }
}

/** Display name for a standings row — prefers the static team, falls back to a
 *  name carried on a live match. */
export function teamDisplayName(teamId: string, matches: Match[]): string {
  const team = getTeam(teamId);
  if (team) return team.name;
  for (const m of matches) {
    if (m.home === teamId && m.homeName) return m.homeName;
    if (m.away === teamId && m.awayName) return m.awayName;
  }
  return teamId.toUpperCase();
}

export function groupStandings(group: GroupName, matches: Match[]): Standing[] {
  const groupMatches = matches.filter((m) => m.stage === "group" && m.group === group);

  const table = new Map<string, Standing>();
  for (const m of groupMatches) {
    if (!table.has(m.home)) table.set(m.home, emptyStanding(m.home));
    if (!table.has(m.away)) table.set(m.away, emptyStanding(m.away));
  }
  for (const m of groupMatches) applyMatch(table, m);

  const rows = [...table.values()];
  for (const r of rows) r.gd = r.gf - r.ga;

  rows.sort((x, y) => {
    if (y.points !== x.points) return y.points - x.points;
    if (y.gd !== x.gd) return y.gd - x.gd;
    if (y.gf !== x.gf) return y.gf - x.gf;
    return (getTeam(x.teamId)?.fifaRank ?? 99) - (getTeam(y.teamId)?.fifaRank ?? 99);
  });
  rows.forEach((r, i) => (r.rank = i + 1));
  return rows;
}

/* ------------------------------- tournament stats ------------------------------- */

export function tournamentStats(matches: Match[]) {
  const finished = matches.filter(
    (m) => m.stage === "group" && m.status === "finished"
  );
  const goals = finished.reduce(
    (sum, m) => sum + (m.homeScore ?? 0) + (m.awayScore ?? 0),
    0
  );
  let cleanSheets = 0;
  let biggestWin = { margin: 0, match: null as Match | null };
  for (const m of finished) {
    if (m.awayScore === 0) cleanSheets++;
    if (m.homeScore === 0) cleanSheets++;
    const margin = Math.abs((m.homeScore ?? 0) - (m.awayScore ?? 0));
    if (margin > biggestWin.margin) biggestWin = { margin, match: m };
  }
  return {
    matchesPlayed: finished.length,
    totalMatches: 104,
    goals,
    avgGoals: finished.length ? +(goals / finished.length).toFixed(2) : 0,
    cleanSheets,
    biggestWin,
  };
}

/**
 * Richer aggregates across *every* finished match (group + knockout), for the
 * detailed tournament summary on the Stats page. Kept separate from
 * `tournamentStats` (which is group-only and feeds the home/stats pulse stamps)
 * so neither view shifts unexpectedly.
 */
export function detailedStats(matches: Match[]) {
  const finished = matches.filter(
    (m) => m.status === "finished" && m.homeScore != null && m.awayScore != null
  );

  let homeWins = 0;
  let awayWins = 0;
  let draws = 0;
  let shootouts = 0;
  let highestScoring = { total: -1, match: null as Match | null };

  const scoredFor = new Map<string, number>();
  const concededBy = new Map<string, number>();
  const playedBy = new Map<string, number>();

  for (const m of finished) {
    const hs = m.homeScore ?? 0;
    const as = m.awayScore ?? 0;

    if (hs > as) homeWins++;
    else if (as > hs) awayWins++;
    else draws++;
    if (m.homePens != null && m.awayPens != null) shootouts++;

    const total = hs + as;
    if (total > highestScoring.total) highestScoring = { total, match: m };

    scoredFor.set(m.home, (scoredFor.get(m.home) ?? 0) + hs);
    scoredFor.set(m.away, (scoredFor.get(m.away) ?? 0) + as);
    concededBy.set(m.home, (concededBy.get(m.home) ?? 0) + as);
    concededBy.set(m.away, (concededBy.get(m.away) ?? 0) + hs);
    playedBy.set(m.home, (playedBy.get(m.home) ?? 0) + 1);
    playedBy.set(m.away, (playedBy.get(m.away) ?? 0) + 1);
  }

  let topScoringTeam: { teamId: string; goals: number } | null = null;
  for (const [teamId, goals] of scoredFor) {
    if (!topScoringTeam || goals > topScoringTeam.goals) {
      topScoringTeam = { teamId, goals };
    }
  }

  // Fewest conceded among teams that have played; ties broken by more games.
  let bestDefense: { teamId: string; conceded: number; played: number } | null = null;
  for (const [teamId, played] of playedBy) {
    const conceded = concededBy.get(teamId) ?? 0;
    if (
      !bestDefense ||
      conceded < bestDefense.conceded ||
      (conceded === bestDefense.conceded && played > bestDefense.played)
    ) {
      bestDefense = { teamId, conceded, played };
    }
  }

  const teamsScored = [...scoredFor.values()].filter((g) => g > 0).length;

  return {
    finishedCount: finished.length,
    homeWins,
    awayWins,
    draws,
    shootouts,
    teamsScored,
    highestScoring: highestScoring.match,
    highestScoringTotal: highestScoring.total >= 0 ? highestScoring.total : 0,
    topScoringTeam,
    bestDefense,
  };
}
