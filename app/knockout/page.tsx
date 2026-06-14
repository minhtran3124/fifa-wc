import type { Metadata } from "next";
import type { Match, Stage } from "@/lib/types";
import { matchesByStage, slotLabel } from "@/lib/matches";
import { getTeam, getVenue } from "@/lib/teams";
import { fmtDate } from "@/lib/format";
import PageHeader from "@/components/PageHeader";

export const metadata: Metadata = {
  title: "Knockout Bracket — FIFA World Cup 2026",
  description:
    "The 2026 FIFA World Cup knockout bracket — Round of 32 through to the Final.",
};

function Slot({ code }: { code: string }) {
  const team = getTeam(code);
  return (
    <div className="flex items-center gap-2 px-3 py-2.5">
      <span className="text-base">{team ? team.flag : "⬜"}</span>
      <span className={`truncate text-xs ${team ? "font-bold text-white" : "font-medium text-white/55"}`}>
        {team ? team.name : slotLabel(code)}
      </span>
    </div>
  );
}

function Tie({ match, highlight }: { match: Match; highlight?: boolean }) {
  const venue = getVenue(match.venueId);
  return (
    <div
      className={`overflow-hidden rounded-xl border bg-ink-soft/80 transition-colors hover:border-gold/40 ${
        highlight ? "border-gold/50 shadow-lg shadow-gold/10" : "border-line"
      }`}
    >
      <Slot code={match.home} />
      <div className="mx-3 border-t border-line/70" />
      <Slot code={match.away} />
      <div className="border-t border-line/70 bg-black/20 px-3 py-1.5 text-[10px] text-white/40">
        {fmtDate(match.date)}
        {venue ? ` · ${venue.city}` : ""}
      </div>
    </div>
  );
}

function Column({ stage, title }: { stage: Stage; title: string }) {
  const ties = matchesByStage(stage);
  return (
    <div className="flex w-60 shrink-0 flex-col gap-3">
      <h2 className="text-center font-display text-xs font-bold uppercase tracking-wider text-white/45">
        {title}
        <span className="ml-1 text-white/25">({ties.length})</span>
      </h2>
      <div className="flex flex-1 flex-col justify-around gap-3">
        {ties.map((m) => (
          <Tie key={m.id} match={m} />
        ))}
      </div>
    </div>
  );
}

export default function KnockoutPage() {
  const final = matchesByStage("final")[0];
  const third = matchesByStage("third")[0];

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Single Elimination"
        title="Knockout Bracket"
        sub="32 teams, one road to glory. Ties fill in once the group stage concludes on June 26 — scroll sideways to follow the path to the Final."
      />

      <div className="no-scrollbar overflow-x-auto pb-4">
        <div className="flex min-w-max gap-5">
          <Column stage="R32" title="Round of 32" />
          <Column stage="R16" title="Round of 16" />
          <Column stage="QF" title="Quarter-finals" />
          <Column stage="SF" title="Semi-finals" />
          <div className="flex w-60 shrink-0 flex-col justify-center gap-5">
            <div>
              <h2 className="mb-2 text-center font-display text-sm font-extrabold uppercase tracking-wider text-gold">
                🏆 Final
              </h2>
              {final && <Tie match={final} highlight />}
            </div>
            <div>
              <h3 className="mb-2 text-center text-[11px] font-bold uppercase tracking-wider text-white/40">
                Third Place
              </h3>
              {third && <Tie match={third} />}
            </div>
          </div>
        </div>
      </div>

      <p className="rounded-xl border border-line/70 bg-ink-soft/40 px-4 py-3 text-xs text-white/45">
        Bracket structure is illustrative. Group winners (1X), runners-up (2X) and the
        best third-placed teams (3X) are seeded into the Round of 32 once group play ends.
      </p>
    </div>
  );
}
