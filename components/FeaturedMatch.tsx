import Link from "next/link";
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

function side(code: string, name?: string) {
  const team = getTeam(code);
  return {
    flag: team?.flag ?? "⬜",
    name: team?.name ?? name ?? slotLabel(code),
  };
}

export default function FeaturedMatch({
  match,
  variant,
}: {
  match: Match;
  variant: "live" | "next";
}) {
  const home = side(match.home, match.homeName);
  const away = side(match.away, match.awayName);
  const venue = getVenue(match.venueId);
  const venueText = venue ? `${venue.stadium}, ${venue.city}` : match.venueName ?? "";
  const hasScore = match.homeScore != null && match.awayScore != null;
  const isLive = variant === "live";

  return (
    <Link
      href="/matches"
      className={`group block overflow-hidden rounded-2xl border bg-gradient-to-br p-5 transition-colors ${
        isLive
          ? "border-red-500/40 from-red-500/10 via-ink-soft to-ink hover:border-red-500/60"
          : "border-gold/30 from-pitch/15 via-ink-soft to-ink hover:border-gold/60"
      }`}
    >
      <div className="mb-4 flex items-center justify-between text-[11px] font-semibold uppercase tracking-wide">
        <span className="text-white/45">
          {STAGE_LABEL[match.stage]}
          {match.group ? ` · Group ${match.group}` : ""}
        </span>
        {isLive ? (
          <span className="flex items-center gap-1.5 text-red-400">
            <span className="h-2 w-2 animate-pulse rounded-full bg-red-500" /> Live
          </span>
        ) : (
          <span className="text-gold">Up Next</span>
        )}
      </div>

      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 sm:gap-4">
        {/* home */}
        <div className="flex flex-col items-center gap-1.5 text-center">
          <span className="text-4xl leading-none sm:text-5xl">{home.flag}</span>
          <span className="text-sm font-bold sm:text-base">{home.name}</span>
        </div>

        {/* center */}
        <div className="flex flex-col items-center">
          {hasScore ? (
            <span className="font-display text-4xl font-extrabold tnum sm:text-5xl">
              <span>{match.homeScore}</span>
              <span className="mx-2 text-white/25">-</span>
              <span>{match.awayScore}</span>
            </span>
          ) : (
            <span className="font-display text-xl font-bold text-white/30">vs</span>
          )}
          {!isLive && (
            <span className="mt-1 whitespace-nowrap text-[11px] text-white/50">
              {fmtTime(match.date)}
            </span>
          )}
        </div>

        {/* away */}
        <div className="flex flex-col items-center gap-1.5 text-center">
          <span className="text-4xl leading-none sm:text-5xl">{away.flag}</span>
          <span className="text-sm font-bold sm:text-base">{away.name}</span>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-x-3 gap-y-1 border-t border-white/5 pt-3 text-[11px] text-white/45">
        <span>
          {fmtDate(match.date)}
          {venueText ? ` · ${venueText}` : ""}
        </span>
        <span className="group-hover:text-white/70">
          {isLive ? "Watch updates →" : `Kick-off ${fmtTime(match.date)}`}
        </span>
      </div>
    </Link>
  );
}
