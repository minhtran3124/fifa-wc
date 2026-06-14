"use client";

import { useMemo, useState } from "react";
import type { Match } from "@/lib/types";
import { fmtDayKey } from "@/lib/format";
import MatchSticker from "./MatchSticker";

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

export default function AlbumSchedule({ days }: { days: Day[] }) {
  const [filter, setFilter] = useState<FilterKey>("all");

  const filtered = useMemo(
    () =>
      days
        .map((d) => ({ ...d, matches: d.matches.filter((m) => keep(m, filter)) }))
        .filter((d) => d.matches.length > 0),
    [days, filter]
  );

  return (
    <div>
      <div className="al-chips" role="tablist" aria-label="Filter matches">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            type="button"
            role="tab"
            aria-selected={filter === f.key}
            onClick={() => setFilter(f.key)}
            className={`al-chip ${filter === f.key ? "active" : ""}`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {filtered.map((day) => (
        <section key={day.date}>
          <div className="al-day">
            <span className="tab">{fmtDayKey(day.date)}</span>
            <span className="ln" />
          </div>
          <div className="al-matches">
            {day.matches.map((m) => (
              <MatchSticker key={m.id} m={m} />
            ))}
          </div>
        </section>
      ))}

      {filtered.length === 0 && <p className="al-empty">No matches for this filter.</p>}
    </div>
  );
}
