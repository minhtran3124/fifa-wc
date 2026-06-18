"use client";

import { useEffect, useMemo, useState } from "react";
import type { Match } from "@/lib/types";
import { fmtDayKey } from "@/lib/format";
import type { Locale } from "@/lib/i18n";
import type { Dictionary } from "@/lib/dictionaries";
import MatchSticker from "./MatchSticker";

type Day = { date: string; matches: Match[] };

const FILTER_KEYS = ["all", "group", "knockout", "finished", "scheduled"] as const;
type FilterKey = (typeof FILTER_KEYS)[number];

function keep(m: Match, f: FilterKey): boolean {
  switch (f) {
    case "group": return m.stage === "group";
    case "knockout": return m.stage !== "group";
    case "finished": return m.status === "finished";
    case "scheduled": return m.status === "scheduled";
    default: return true;
  }
}

export default function AlbumSchedule({
  days,
  locale,
  dict,
}: {
  days: Day[];
  locale: Locale;
  dict: Dictionary;
}) {
  const [filter, setFilter] = useState<FilterKey>("all");

  // The latest finished match (max date) — days are ascending and within-day
  // ascending, so it's the last finished match in document order.
  const latestFinishedId = useMemo(() => {
    let id: string | undefined;
    for (const d of days) for (const m of d.matches) if (m.status === "finished") id = m.id;
    return id;
  }, [days]);
  const ANCHOR = "latest-finished";

  // On entry, jump to the latest finished match so the user lands on what just
  // happened without scrolling. Runs once on mount (not on filter changes).
  useEffect(() => {
    if (!latestFinishedId) return;
    const el = document.getElementById(ANCHOR);
    if (el) el.scrollIntoView({ block: "center" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const labels: Record<FilterKey, string> = {
    all: dict.schedule.filters.all,
    group: dict.schedule.filters.group,
    knockout: dict.schedule.filters.knockout,
    finished: dict.schedule.filters.results,
    scheduled: dict.schedule.filters.upcoming,
  };

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
        {FILTER_KEYS.map((key) => (
          <button
            key={key}
            type="button"
            role="tab"
            aria-selected={filter === key}
            onClick={() => setFilter(key)}
            className={`al-chip ${filter === key ? "active" : ""}`}
          >
            {labels[key]}
          </button>
        ))}
      </div>

      {filtered.map((day) => (
        <section key={day.date}>
          <div className="al-day">
            <span className="tab">{fmtDayKey(day.date, locale)}</span>
            <span className="ln" />
          </div>
          <div className="al-matches">
            {day.matches.map((m) => (
              <MatchSticker
                key={m.id}
                m={m}
                locale={locale}
                dict={dict}
                id={m.id === latestFinishedId ? ANCHOR : undefined}
              />
            ))}
          </div>
        </section>
      ))}

      {filtered.length === 0 && <p className="al-empty">{dict.schedule.empty}</p>}
    </div>
  );
}
