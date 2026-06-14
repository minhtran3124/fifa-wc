import type { Match } from "@/lib/types";
import { getTeam, getVenue } from "@/lib/teams";
import { slotLabel } from "@/lib/matches";
import { fmtDate, fmtTime } from "@/lib/format";

const STAGE_LABEL: Record<string, string> = {
  group: "Group Stage",
  R32: "Round of 32",
  R16: "Round of 16",
  QF: "Quarter-final",
  SF: "Semi-final",
  third: "Third Place",
  final: "Final",
};

function Side({
  code,
  name,
  score,
  dim,
  winner,
}: {
  code: string;
  name?: string;
  score?: number;
  dim: boolean;
  winner: boolean;
}) {
  const team = getTeam(code);
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="flex min-w-0 items-center gap-2.5">
        <span className="text-xl leading-none">{team ? team.flag : "⬜"}</span>
        <span
          className={`truncate text-sm ${
            winner ? "font-bold text-white" : dim ? "font-medium text-white/50" : "font-medium text-white/85"
          }`}
        >
          {team ? team.name : name ?? slotLabel(code)}
        </span>
      </span>
      {score != null && (
        <span
          className={`tnum text-lg font-extrabold ${
            winner ? "text-gold" : dim ? "text-white/50" : "text-white"
          }`}
        >
          {score}
        </span>
      )}
    </div>
  );
}

export default function MatchCard({ match }: { match: Match }) {
  const venue = getVenue(match.venueId);
  const finished = match.status === "finished";
  const homeWin = finished && (match.homeScore ?? 0) > (match.awayScore ?? 0);
  const awayWin = finished && (match.awayScore ?? 0) > (match.homeScore ?? 0);

  const live = match.status === "live";

  return (
    <div className="group rounded-xl border border-line bg-ink-soft/70 p-3.5 transition-all duration-200 hover:-translate-y-0.5 hover:border-gold/40 hover:bg-ink-card/70">
      <div className="mb-2.5 flex items-center justify-between text-[10.5px] font-semibold uppercase tracking-wider text-white/35">
        <span className="truncate">
          {STAGE_LABEL[match.stage]}
          {match.group ? ` · Grp ${match.group}` : ""}
          {match.matchday ? ` · MD${match.matchday}` : ""}
        </span>
        {live ? (
          <span className="flex items-center gap-1 text-red-400">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-red-500" /> Live
          </span>
        ) : (
          <span>{finished ? "FT" : fmtTime(match.date)}</span>
        )}
      </div>
      <div className="space-y-2">
        <Side code={match.home} name={match.homeName} score={match.homeScore} dim={finished && !homeWin} winner={homeWin} />
        <Side code={match.away} name={match.awayName} score={match.awayScore} dim={finished && !awayWin} winner={awayWin} />
      </div>
      <div className="mt-2.5 flex items-center justify-between border-t border-line/70 pt-2 text-[10.5px] text-white/35">
        <span>{fmtDate(match.date)}</span>
        <span className="truncate pl-2">
          {venue ? `${venue.stadium}, ${venue.city}` : match.venueName ?? ""}
        </span>
      </div>
    </div>
  );
}
