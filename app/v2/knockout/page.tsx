import type { Metadata } from "next";
import Link from "next/link";
import type { Match, Stage } from "@/lib/types";
import { matchesByStage, slotLabel } from "@/lib/matches";
import { getTeam, getVenue } from "@/lib/teams";
import { fmtDate } from "@/lib/format";
import AlbumRefresh from "../AlbumRefresh";

export const metadata: Metadata = { title: "Knockout Bracket" };

function Slot({ code }: { code: string }) {
  const team = getTeam(code);
  return (
    <div className={`slot ${team ? "" : "tbd"}`}>
      <span className="fl">{team ? team.flag : "⬜"}</span>
      <span>{team ? team.name : slotLabel(code)}</span>
    </div>
  );
}

function Tie({ match, final }: { match: Match; final?: boolean }) {
  const venue = getVenue(match.venueId);
  return (
    <div className={`al-tie ${final ? "final" : ""}`}>
      <Slot code={match.home} />
      <Slot code={match.away} />
      <div className="tfoot">
        {fmtDate(match.date)}
        {venue ? ` · ${venue.city}` : ""}
      </div>
    </div>
  );
}

function Column({ stage, title }: { stage: Stage; title: string }) {
  const ties = matchesByStage(stage);
  return (
    <div className="al-col">
      <h3>{title} <span className="ct">({ties.length})</span></h3>
      {ties.map((m) => (
        <Tie key={m.id} match={m} />
      ))}
    </div>
  );
}

export const dynamic = "force-dynamic";

export default function AlbumKnockout() {
  const final = matchesByStage("final")[0];
  const third = matchesByStage("third")[0];

  return (
    <>
      <div className="al-page-head">
        <div>
          <Link href="/v2" className="al-back">← Album home</Link>
          <h1 className="al-page-title">Knockout Bracket</h1>
          <p className="al-page-sub">
            32 teams, one road to glory. Ties fill in once the group stage concludes —
            scroll sideways to follow the path to the Final.
          </p>
        </div>
        <AlbumRefresh />
      </div>

      <div className="al-bracket">
        <Column stage="R32" title="Round of 32" />
        <Column stage="R16" title="Round of 16" />
        <Column stage="QF" title="Quarter-finals" />
        <Column stage="SF" title="Semi-finals" />
        <div className="al-col final-col">
          <div>
            <div className="al-final-ttl">🏆 Final</div>
            {final && <Tie match={final} final />}
          </div>
          <div style={{ marginTop: 20 }}>
            <h3>Third Place</h3>
            {third && <Tie match={third} />}
          </div>
        </div>
      </div>
    </>
  );
}
