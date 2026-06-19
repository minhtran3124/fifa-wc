import Link from "next/link";
import { TEAMS } from "@/lib/teams";
import { crestUrl } from "@/lib/crests";
import { getDictionary } from "@/lib/dictionaries";
import type { Locale } from "@/lib/i18n";
import TeamWall, { type WallTeam } from "@/components/TeamWall";

/* All-time FIFA World Cup winners and their title counts (static fact) → ★. */
const WC_TITLES: Record<string, number> = {
  bra: 5, ger: 4, ita: 4, arg: 3, fra: 2, uru: 2, eng: 1, esp: 1,
};

export default async function AlbumTeams({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const l = locale as Locale;
  const dict = getDictionary(l);
  const ti = dict.teamsIndex;

  const teams: WallTeam[] = TEAMS.map((t) => ({
    id: t.id,
    name: t.name,
    code: t.code,
    flag: t.flag,
    confederation: t.confederation,
    fifaRank: t.fifaRank,
    pot: t.pot ?? 4,
    group: t.group,
    crest: crestUrl(t.id),
    titles: WC_TITLES[t.id] ?? 0,
  }));

  return (
    <>
      <div className="al-page-head">
        <div>
          <Link href={`/${l}`} className="al-back">{dict.common.back}</Link>
          <h1 className="al-page-title">{ti.title}</h1>
          <p className="al-page-sub">{ti.wallSub}</p>
        </div>
      </div>

      <TeamWall teams={teams} locale={l} dict={dict} />
    </>
  );
}
