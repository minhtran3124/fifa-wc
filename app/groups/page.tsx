import type { Metadata } from "next";
import Link from "next/link";
import type { Match } from "@/lib/types";
import { GROUPS, getTeam } from "@/lib/teams";
import { groupStandings, teamDisplayName } from "@/lib/standings";
import { getWcData } from "@/lib/footballData";
import AlbumRefresh from "../AlbumRefresh";

export const metadata: Metadata = { title: "Group Tables" };

function GroupCard({ group, matches }: { group: (typeof GROUPS)[number]; matches: Match[] }) {
  const rows = groupStandings(group, matches);
  return (
    <div className="al-group-card">
      <div className="gc-head">
        <span className="pg-tab">{group}</span>
        <span className="pg-ttl">Group {group}</span>
      </div>
      <div className="al-standwrap" style={{ background: "transparent", border: "none", padding: 0 }}>
        <table className="al-stand">
          <thead>
            <tr>
              <th>#</th>
              <th>Team</th>
              <th>P</th>
              <th>W</th>
              <th>D</th>
              <th>L</th>
              <th>GD</th>
              <th>Pts</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => {
              const team = getTeam(r.teamId);
              const q = r.rank <= 2;
              return (
                <tr key={r.teamId} className={q ? "q" : ""}>
                  <td><span className="rk">{r.rank}</span></td>
                  <td>
                    {team ? (
                      <Link href={`/teams/${team.id}`} className="tm">
                        <span className="fl">{team.flag}</span>
                        {team.name}
                      </Link>
                    ) : (
                      <span className="tm" style={{ cursor: "default" }}>
                        <span className="fl">⬜</span>
                        {teamDisplayName(r.teamId, matches)}
                      </span>
                    )}
                  </td>
                  <td>{r.played}</td>
                  <td>{r.won}</td>
                  <td>{r.drawn}</td>
                  <td>{r.lost}</td>
                  <td>{r.gd > 0 ? `+${r.gd}` : r.gd}</td>
                  <td><span className="pts">{r.points}</span></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default async function AlbumGroups() {
  const { matches, source, fetchedAt } = await getWcData();
  return (
    <>
      <div className="al-page-head">
        <div>
          <Link href="/" className="al-back">← Album home</Link>
          <h1 className="al-page-title">Group Tables</h1>
          <p className="al-page-sub">
            Top two of each group advance, plus the eight best third-placed teams — 32
            nations reach the knockout round. Tap a crest to open that nation&rsquo;s page.
          </p>
        </div>
        <AlbumRefresh source={source} fetchedAt={fetchedAt} />
      </div>

      <div className="al-legend" style={{ marginBottom: 22 }}>
        <span><i style={{ background: "var(--al-green)" }} /> Qualify (top 2)</span>
      </div>

      <div className="al-groups">
        {GROUPS.map((g) => (
          <GroupCard key={g} group={g} matches={matches} />
        ))}
      </div>
    </>
  );
}
