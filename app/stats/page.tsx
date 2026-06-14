import type { Metadata } from "next";
import type { PlayerStat } from "@/lib/types";
import { tournamentStats } from "@/lib/standings";
import { getTeam, getVenue } from "@/lib/teams";
import { slotLabel } from "@/lib/matches";
import { getWcData, getWcScorers } from "@/lib/footballData";
import RefreshButton from "@/components/RefreshButton";
import PageHeader from "@/components/PageHeader";

export const metadata: Metadata = {
  title: "Tournament Stats — FIFA World Cup 2026",
  description:
    "Top scorers, assist leaders and tournament-wide numbers from the 2026 FIFA World Cup.",
};

function Leaderboard({
  title,
  metric,
  players,
}: {
  title: string;
  metric: "goals" | "assists";
  players: PlayerStat[];
}) {
  const max = Math.max(...players.map((p) => p[metric]), 1);
  return (
    <div className="panel p-5">
      <h2 className="mb-4 text-lg font-extrabold">{title}</h2>
      <ol className="space-y-3.5">
        {players.map((p, i) => {
          const team = getTeam(p.teamId);
          const val = p[metric];
          const lead = i === 0;
          return (
            <li key={p.name} className="flex items-center gap-3">
              <span
                className={`grid h-6 w-6 shrink-0 place-items-center rounded-md text-xs font-extrabold tnum ${
                  lead ? "bg-gold text-ink" : "text-white/35"
                }`}
              >
                {i + 1}
              </span>
              <span className="text-lg">{team?.flag}</span>
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline justify-between gap-2">
                  <span className="truncate text-sm font-bold">{p.name}</span>
                  <span className="shrink-0 font-display text-base font-extrabold tnum text-gold">
                    {val}
                  </span>
                </div>
                <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-white/8">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-gold/70 to-gold"
                    style={{ width: `${(val / max) * 100}%` }}
                  />
                </div>
                <div className="mt-1 text-[11px] text-white/40">
                  {team?.name} · {p.position} ·{" "}
                  {metric === "goals" ? `${p.assists} assists` : `${p.goals} goals`}
                </div>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

function LeaderboardEmpty({ title, note }: { title: string; note: string }) {
  return (
    <div className="panel p-5">
      <h2 className="mb-4 text-lg font-extrabold">{title}</h2>
      <p className="text-sm text-white/40">{note}</p>
    </div>
  );
}

export default async function StatsPage() {
  const [{ matches, source, fetchedAt }, scorers] = await Promise.all([
    getWcData(),
    getWcScorers(),
  ]);
  const t = tournamentStats(matches);
  const bw = t.biggestWin.match;
  const bwHome = bw ? getTeam(bw.home) : null;
  const bwAway = bw ? getTeam(bw.away) : null;

  const topScorers = scorers.slice(0, 10);
  const topAssists = scorers
    .filter((p) => p.assists > 0)
    .sort((a, b) => b.assists - a.assists)
    .slice(0, 10);

  const headline = [
    { v: `${t.matchesPlayed}/${t.totalMatches}`, l: "Matches played" },
    { v: t.goals, l: "Total goals" },
    { v: t.avgGoals, l: "Goals per match" },
    { v: t.cleanSheets, l: "Clean sheets" },
  ];

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="By the Numbers"
        title="Tournament Stats"
        sub={
          source === "live"
            ? "Aggregates and scorer leaderboards from live match data."
            : "Numbers update as results come in."
        }
        action={<RefreshButton fetchedAt={fetchedAt} source={source} />}
      />

      <section className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-4">
        {headline.map((s) => (
          <div key={s.l} className="bg-ink-soft/90 px-4 py-6 text-center">
            <div className="font-display text-4xl font-extrabold text-gold tnum">{s.v}</div>
            <div className="mt-1.5 text-xs uppercase tracking-wider text-white/45">{s.l}</div>
          </div>
        ))}
      </section>

      {bw && (
        <section className="panel overflow-hidden p-5">
          <p className="eyebrow text-white/40">Biggest win so far</p>
          <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-3 text-lg font-bold">
            <span className="flex items-center gap-2.5">
              <span className="text-3xl">{bwHome?.flag ?? "⬜"}</span>
              {bwHome?.name ?? bw.homeName ?? slotLabel(bw.home)}
            </span>
            <span className="rounded-lg bg-gradient-to-br from-gold to-gold-soft px-4 py-1.5 font-display text-xl font-extrabold tnum text-ink">
              {bw.homeScore} – {bw.awayScore}
            </span>
            <span className="flex items-center gap-2.5">
              <span className="text-3xl">{bwAway?.flag ?? "⬜"}</span>
              {bwAway?.name ?? bw.awayName ?? slotLabel(bw.away)}
            </span>
          </div>
          <p className="mt-3 text-xs text-white/40">
            {getVenue(bw.venueId)?.stadium ?? bw.venueName ?? ""}
            {bw.group ? ` · Group ${bw.group}` : ""}
          </p>
        </section>
      )}

      <section className="grid gap-5 lg:grid-cols-2">
        {topScorers.length > 0 ? (
          <Leaderboard title="🥇 Top Scorers" metric="goals" players={topScorers} />
        ) : (
          <LeaderboardEmpty
            title="🥇 Top Scorers"
            note="No scorer data available from the feed yet."
          />
        )}
        {topAssists.length > 0 ? (
          <Leaderboard title="🎯 Most Assists" metric="assists" players={topAssists} />
        ) : (
          <LeaderboardEmpty
            title="🎯 Most Assists"
            note="Assist data isn't provided by the feed yet."
          />
        )}
      </section>
    </div>
  );
}
