"use client";

import { useMemo, useState } from "react";
import type { Match } from "@/lib/types";
import MatchCard from "@/components/MatchCard";
import { fmtDayKey } from "@/lib/format";

type Day = { date: string; matches: Match[] };

const FILTERS = [
  { key: "all", label: "All" },
  { key: "group", label: "Group Stage" },
  { key: "knockout", label: "Knockout" },
  { key: "finished", label: "Results" },
  { key: "scheduled", label: "Upcoming" },
] as const;

type FilterKey = (typeof FILTERS)[number]["key"];

function keep(m: Match, f: FilterKey): boolean {
  switch (f) {
    case "group": return m.stage === "group";
    case "knockout": return m.stage !== "group";
    case "finished": return m.status === "finished";
    case "scheduled": return m.status === "scheduled";
    default: return true;
  }
}

export default function MatchSchedule({ days }: { days: Day[] }) {
  const [filter, setFilter] = useState<FilterKey>("all");

  const filtered = useMemo(
    () =>
      days
        .map((d) => ({ ...d, matches: d.matches.filter((m) => keep(m, filter)) }))
        .filter((d) => d.matches.length > 0),
    [days, filter]
  );

  return (
    <div className="space-y-6">
      <div className="no-scrollbar -mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition-all ${
              filter === f.key
                ? "bg-gold text-ink shadow-md shadow-gold/20"
                : "border border-line text-white/65 hover:border-white/30 hover:text-white"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {filtered.map((day) => (
        <section key={day.date}>
          <h2 className="sticky top-[57px] z-10 -mx-1 mb-3 flex items-center gap-2 bg-ink/85 px-1 py-1.5 backdrop-blur">
            <span className="h-3 w-1 rounded-full bg-gold" />
            <span className="font-display text-sm font-bold uppercase tracking-wider text-gold">
              {fmtDayKey(day.date)}
            </span>
          </h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {day.matches.map((m) => (
              <MatchCard key={m.id} match={m} />
            ))}
          </div>
        </section>
      ))}

      {filtered.length === 0 && (
        <p className="text-sm text-white/50">No matches for this filter.</p>
      )}
    </div>
  );
}
