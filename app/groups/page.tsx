import type { Metadata } from "next";
import Link from "next/link";
import type { Match } from "@/lib/types";
import { GROUPS, getTeam } from "@/lib/teams";
import { groupStandings, teamDisplayName } from "@/lib/standings";
import { getWcData } from "@/lib/footballData";
import RefreshButton from "@/components/RefreshButton";
import MatchCard from "@/components/MatchCard";
import PageHeader from "@/components/PageHeader";

export const metadata: Metadata = {
  title: "Group Tables — FIFA World Cup 2026",
  description: "Live standings for all 12 groups at the 2026 FIFA World Cup.",
};

function GroupTable({
  group,
  matches,
}: {
  group: (typeof GROUPS)[number];
  matches: Match[];
}) {
  const rows = groupStandings(group, matches);
  const fixtures = matches
    .filter((m) => m.stage === "group" && m.group === group)
    .sort((a, b) => a.date.localeCompare(b.date));

  return (
    <div className="panel p-4 transition-colors hover:border-line">
      <h2 className="mb-3 flex items-center gap-2.5 text-lg font-extrabold">
        <span className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-gold to-gold-soft font-display text-sm font-extrabold text-ink shadow-md shadow-gold/20">
          {group}
        </span>
        Group {group}
      </h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-[11px] uppercase tracking-wide text-white/40">
              <th className="py-1.5 pr-2 font-medium">#</th>
              <th className="py-1.5 pr-2 font-medium">Team</th>
              <th className="px-1.5 py-1.5 text-center font-medium">P</th>
              <th className="px-1.5 py-1.5 text-center font-medium">W</th>
              <th className="px-1.5 py-1.5 text-center font-medium">D</th>
              <th className="px-1.5 py-1.5 text-center font-medium">L</th>
              <th className="hidden px-1.5 py-1.5 text-center font-medium sm:table-cell">GF</th>
              <th className="hidden px-1.5 py-1.5 text-center font-medium sm:table-cell">GA</th>
              <th className="px-1.5 py-1.5 text-center font-medium">GD</th>
              <th className="px-1.5 py-1.5 text-center font-bold text-white/60">Pts</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => {
              const team = getTeam(r.teamId);
              const qualifies = r.rank <= 2;
              return (
                <tr
                  key={r.teamId}
                  className={`border-t border-line/60 transition-colors last:border-b-0 hover:bg-white/[0.03] ${
                    qualifies ? "bg-pitch/[0.06]" : ""
                  }`}
                >
                  <td className="py-2.5 pr-2">
                    <span
                      className={`grid h-5 w-5 place-items-center rounded text-[11px] font-bold ${
                        qualifies
                          ? "bg-pitch text-white"
                          : r.rank === 3
                          ? "bg-white/15 text-white/80"
                          : "text-white/40"
                      }`}
                    >
                      {r.rank}
                    </span>
                  </td>
                  <td className="py-2 pr-2">
                    {team ? (
                      <Link
                        href={`/teams/${team.id}`}
                        className="flex items-center gap-2 transition-colors hover:text-gold"
                      >
                        <span className="text-base">{team.flag}</span>
                        <span className="font-medium">{team.name}</span>
                      </Link>
                    ) : (
                      <span className="flex items-center gap-2">
                        <span className="text-base">⬜</span>
                        <span className="font-medium">
                          {teamDisplayName(r.teamId, matches)}
                        </span>
                      </span>
                    )}
                  </td>
                  <td className="px-1.5 text-center tabular-nums text-white/70">{r.played}</td>
                  <td className="px-1.5 text-center tabular-nums text-white/70">{r.won}</td>
                  <td className="px-1.5 text-center tabular-nums text-white/70">{r.drawn}</td>
                  <td className="px-1.5 text-center tabular-nums text-white/70">{r.lost}</td>
                  <td className="hidden px-1.5 text-center tabular-nums text-white/70 sm:table-cell">{r.gf}</td>
                  <td className="hidden px-1.5 text-center tabular-nums text-white/70 sm:table-cell">{r.ga}</td>
                  <td className="px-1.5 text-center tabular-nums text-white/70">
                    {r.gd > 0 ? `+${r.gd}` : r.gd}
                  </td>
                  <td className="px-1.5 text-center font-display text-base font-extrabold tabular-nums text-gold">
                    {r.points}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <details className="mt-3 group">
        <summary className="cursor-pointer list-none text-xs font-medium text-white/50 hover:text-white/80">
          ▸ Group {group} fixtures
        </summary>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          {fixtures.map((m) => (
            <MatchCard key={m.id} match={m} />
          ))}
        </div>
      </details>
    </div>
  );
}

export const dynamic = "force-dynamic";

export default async function GroupsPage() {
  const { matches, source, fetchedAt } = await getWcData();

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Group Stage"
        title="Group Tables"
        sub="Top two of each group advance, plus the eight best third-placed teams — 32 nations reach the knockout round."
        action={<RefreshButton fetchedAt={fetchedAt} source={source} />}
      />

      <div className="flex flex-wrap gap-4 text-xs text-white/50">
        <span className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded bg-pitch" /> Qualify (top 2)
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded bg-white/15" /> Best-third contender
        </span>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        {GROUPS.map((g) => (
          <GroupTable key={g} group={g} matches={matches} />
        ))}
      </div>
    </div>
  );
}
