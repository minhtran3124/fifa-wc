import Link from "next/link";
import type { Match, Stage } from "@/lib/types";
import { matchesByStage, slotLabel } from "@/lib/matches";
import { getTeam, getVenue } from "@/lib/teams";
import { fmtDate } from "@/lib/format";
import { getDictionary } from "@/lib/dictionaries";
import type { Locale } from "@/lib/i18n";
import AlbumRefresh from "@/components/AlbumRefresh";

function Slot({ code }: { code: string }) {
  const team = getTeam(code);
  return (
    <div className={`slot ${team ? "" : "tbd"}`}>
      <span className="fl">{team ? team.flag : "⬜"}</span>
      <span>{team ? team.name : slotLabel(code)}</span>
    </div>
  );
}

function Tie({ match, locale, final }: { match: Match; locale: Locale; final?: boolean }) {
  const venue = getVenue(match.venueId);
  return (
    <div className={`al-tie ${final ? "final" : ""}`}>
      <Slot code={match.home} />
      <Slot code={match.away} />
      <div className="tfoot">
        {fmtDate(match.date, locale)}
        {venue ? ` · ${venue.city}` : ""}
      </div>
    </div>
  );
}

function Column({ stage, title, locale }: { stage: Stage; title: string; locale: Locale }) {
  const ties = matchesByStage(stage);
  return (
    <div className="al-col">
      <h3>{title} <span className="ct">({ties.length})</span></h3>
      {ties.map((m) => (
        <Tie key={m.id} match={m} locale={locale} />
      ))}
    </div>
  );
}

export default async function AlbumKnockout({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const l = locale as Locale;
  const dict = getDictionary(l);
  const final = matchesByStage("final")[0];
  const third = matchesByStage("third")[0];

  return (
    <>
      <div className="al-page-head">
        <div>
          <Link href={`/${l}`} className="al-back">{dict.common.back}</Link>
          <h1 className="al-page-title">{dict.knockout.title}</h1>
          <p className="al-page-sub">{dict.knockout.sub}</p>
        </div>
        <AlbumRefresh locale={l} dict={dict} />
      </div>

      <div className="al-bracket">
        <Column stage="R32" title={dict.stage.R32} locale={l} />
        <Column stage="R16" title={dict.stage.R16} locale={l} />
        <Column stage="QF" title={dict.stage.QF} locale={l} />
        <Column stage="SF" title={dict.stage.SF} locale={l} />
        <div className="al-col final-col">
          <div>
            <div className="al-final-ttl">🏆 {dict.stage.final}</div>
            {final && <Tie match={final} locale={l} final />}
          </div>
          <div style={{ marginTop: 20 }}>
            <h3>{dict.stage.third}</h3>
            {third && <Tie match={third} locale={l} />}
          </div>
        </div>
      </div>
    </>
  );
}
