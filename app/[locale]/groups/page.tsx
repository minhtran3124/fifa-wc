import Link from "next/link";
import type { Match } from "@/lib/types";
import { GROUPS, getTeam } from "@/lib/teams";
import { groupStandings, teamDisplayName } from "@/lib/standings";
import { getWcData } from "@/lib/footballData";
import { getDictionary, type Dictionary } from "@/lib/dictionaries";
import type { Locale } from "@/lib/i18n";
import AlbumRefresh from "@/components/AlbumRefresh";

function GroupCard({
  group,
  matches,
  locale,
  dict,
}: {
  group: (typeof GROUPS)[number];
  matches: Match[];
  locale: Locale;
  dict: Dictionary;
}) {
  const rows = groupStandings(group, matches);
  const th = dict.groups.th;
  // every team has played all three group games → qualifiers are locked in
  const decided = rows.length > 0 && rows.every((r) => r.played >= 3);
  return (
    <div className={`al-group-card${decided ? " is-done" : ""}`}>
      <div className="gc-head">
        <span className="pg-tab">{group}</span>
        <span className="pg-ttl">{dict.team.groupLabel} {group}</span>
        {decided && (
          <span className="gc-seal">✓ {dict.groups.decided}</span>
        )}
      </div>
      <div className="al-standwrap" style={{ background: "transparent", border: "none", padding: 0 }}>
        <table className="al-stand">
          <thead>
            <tr>
              <th>#</th>
              <th>{th.team}</th>
              <th>{th.p}</th>
              <th>{th.w}</th>
              <th>{th.d}</th>
              <th>{th.l}</th>
              <th>{th.gd}</th>
              <th>{th.pts}</th>
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
                      <Link href={`/${locale}/teams/${team.id}`} className="tm">
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

export default async function AlbumGroups({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const l = locale as Locale;
  const dict = getDictionary(l);
  const { matches, source, fetchedAt } = await getWcData();
  return (
    <>
      <div className="al-page-head">
        <div>
          <Link href={`/${l}`} className="al-back">{dict.common.back}</Link>
          <h1 className="al-page-title">{dict.groups.title}</h1>
          <p className="al-page-sub">{dict.groups.sub}</p>
        </div>
        <AlbumRefresh source={source} fetchedAt={fetchedAt} locale={l} dict={dict} />
      </div>

      <div className="al-legend" style={{ marginBottom: 22 }}>
        <span><i style={{ background: "var(--al-green)" }} /> {dict.groups.qualify}</span>
      </div>

      <div className="al-groups">
        {GROUPS.map((g) => (
          <GroupCard key={g} group={g} matches={matches} locale={l} dict={dict} />
        ))}
      </div>
    </>
  );
}
