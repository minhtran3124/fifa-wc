import type { Match } from "@/lib/types";
import { getTeam } from "@/lib/teams";

function Item({ m }: { m: Match }) {
  const h = getTeam(m.home)!;
  const a = getTeam(m.away)!;
  const live = m.status === "live";
  const scored = m.homeScore != null && m.awayScore != null;
  return (
    <span className="flex shrink-0 items-center gap-2.5 px-5">
      {live && <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-red-500" />}
      <span className="text-base leading-none">{h.flag}</span>
      <span className="text-sm font-bold text-white/80">{h.code}</span>
      {scored ? (
        <span className={`font-display text-base font-extrabold tnum ${live ? "text-red-400" : "text-gold"}`}>
          {m.homeScore}-{m.awayScore}
        </span>
      ) : (
        <span className="text-xs font-semibold text-white/30">v</span>
      )}
      <span className="text-sm font-bold text-white/80">{a.code}</span>
      <span className="text-base leading-none">{a.flag}</span>
      <span className="pl-3 text-gold/30">◆</span>
    </span>
  );
}

export default function Ticker({ matches }: { matches: Match[] }) {
  const resolvable = (m: Match) => getTeam(m.home) && getTeam(m.away);
  const live = matches.filter((m) => m.status === "live" && resolvable(m));
  const finished = matches.filter((m) => m.status === "finished" && resolvable(m)).slice(-12);
  const upcoming = matches.filter((m) => m.status === "scheduled" && resolvable(m)).slice(0, 8);
  const list = [...live, ...finished, ...upcoming];
  if (list.length === 0) return null;

  const Row = () => (
    <div className="flex shrink-0 items-center py-2.5">
      {list.map((m, i) => (
        <Item key={`${m.id}-${i}`} m={m} />
      ))}
    </div>
  );

  return (
    <div className="marquee-track relative overflow-hidden rounded-xl border border-line bg-ink-soft/50 stripes">
      <div className="flex w-max animate-marquee">
        <Row />
        <Row />
      </div>
      <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-ink-soft to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-ink-soft to-transparent" />
    </div>
  );
}
