import Link from "next/link";
import { GROUPS, teamsByGroup } from "@/lib/teams";
import { getDictionary } from "@/lib/dictionaries";
import type { Locale } from "@/lib/i18n";

export default async function AlbumTeams({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const l = locale as Locale;
  const dict = getDictionary(l);
  const ti = dict.teamsIndex;

  return (
    <>
      <div className="al-page-head">
        <div>
          <Link href={`/${l}`} className="al-back">{dict.common.back}</Link>
          <h1 className="al-page-title">{ti.title}</h1>
          <p className="al-page-sub">{ti.sub}</p>
        </div>
      </div>

      {GROUPS.map((g) => (
        <section className="al-sec" key={g}>
          <div className="al-sec-head">
            <div>
              <span className="scribble">{dict.team.groupLabel} {g}</span>
              <h2>{dict.team.groupLabel} {g}</h2>
            </div>
            <Link className="more" href={`/${l}/groups`}>{dict.groups.title} →</Link>
          </div>
          <div className="al-rivals">
            {teamsByGroup(g).map((t) => (
              <Link key={t.id} href={`/${l}/teams/${t.id}`} className="al-rival">
                <span className="fl">{t.flag}</span>
                <span style={{ minWidth: 0 }}>
                  <span className="nm" style={{ display: "block" }}>{t.name}</span>
                  <span className="sub">
                    #{t.fifaRank} {ti.rankSuffix} · {dict.team.regions[t.confederation]}
                  </span>
                </span>
              </Link>
            ))}
          </div>
        </section>
      ))}
    </>
  );
}
