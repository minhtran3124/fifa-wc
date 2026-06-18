// Scrape post-match metrics (team stats, cards, starting line-ups) for World
// Cup 2026 from ESPN's public soccer API and write them to
// data/match-stats-2026.json.
//
// Source: site.api.espn.com (undocumented but public, no API key). Used to
// refresh a bundled snapshot — NOT called at runtime — so the app has no
// dependency on ESPN while rendering. Re-run after a matchday to update:
//
//   node scripts/fetch-match-stats.mjs
//
// ESPN team abbreviations are the FIFA codes we use as team ids (lower-cased).
// Records are keyed by the sorted team-id pair; per-team data lives under its
// code, so no home/away orientation is needed by the consumer.

import { writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const BASE = "https://site.api.espn.com/apis/site/v2/sports/soccer/fifa.world";
const OUT = join(dirname(fileURLToPath(import.meta.url)), "..", "data", "match-stats-2026.json");

// Tournament window (group stage + knockout). Generous bounds are harmless —
// days with no matches just return nothing.
const START = "2026-06-11";
const END = "2026-07-19";

// ESPN statistic name -> our short key (curated; percentages already 0-100).
const STAT_KEYS = {
  possessionPct: "possession",
  totalShots: "shots",
  shotsOnTarget: "shotsOnTarget",
  wonCorners: "corners",
  foulsCommitted: "fouls",
  offsides: "offsides",
  saves: "saves",
  totalPasses: "passes",
};

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function getJson(url) {
  const res = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0" } });
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  return res.json();
}

function* dateRange(start, end) {
  const d = new Date(start + "T00:00:00Z");
  const last = new Date(end + "T00:00:00Z");
  while (d <= last) {
    const y = d.getUTCFullYear();
    const m = String(d.getUTCMonth() + 1).padStart(2, "0");
    const day = String(d.getUTCDate()).padStart(2, "0");
    yield `${y}${m}${day}`;
    d.setUTCDate(d.getUTCDate() + 1);
  }
}

const pairKey = (a, b) => [a, b].sort().join("_");

function extract(summary) {
  const id2code = {};
  for (const t of summary.boxscore?.teams ?? []) {
    id2code[t.team.id] = t.team.abbreviation.toLowerCase();
  }

  const teams = {};
  // team statistics
  for (const t of summary.boxscore?.teams ?? []) {
    const code = t.team.abbreviation.toLowerCase();
    const stats = {};
    for (const st of t.statistics ?? []) {
      if (st.name in STAT_KEYS) stats[STAT_KEYS[st.name]] = st.displayValue;
    }
    (teams[code] ??= {}).stats = stats;
  }
  // starting line-ups
  for (const r of summary.rosters ?? []) {
    const code = r.team.abbreviation.toLowerCase();
    const starters = (r.roster ?? [])
      .filter((p) => p.starter)
      .map((p) => ({
        n: p.jersey ?? "",
        name: p.athlete?.displayName ?? "",
        pos: p.position?.abbreviation ?? "",
      }));
    (teams[code] ??= {}).lineup = { formation: r.formation ?? "", starters };
  }
  // cards (from key events; player name is in the free-text description)
  const cards = [];
  for (const e of summary.keyEvents ?? []) {
    const ty = e.type?.type ?? "";
    if (ty !== "yellow-card" && ty !== "red-card") continue;
    cards.push({
      team: id2code[e.team?.id] ?? null,
      player: (e.text ?? "").split(" (")[0],
      minute: (e.clock?.displayValue ?? "").replace(/'$/, ""),
      type: ty === "yellow-card" ? "yellow" : "red",
    });
  }

  const date = (summary.header?.competitions?.[0]?.date ?? "").slice(0, 10);
  return { date, teams, cards };
}

async function main() {
  // 1. collect completed event ids across the tournament window
  const eventIds = [];
  for (const d of dateRange(START, END)) {
    let sb;
    try {
      sb = await getJson(`${BASE}/scoreboard?dates=${d}`);
    } catch (err) {
      console.warn(`  scoreboard ${d}: ${err.message}`);
      continue;
    }
    for (const e of sb.events ?? []) {
      if (e.competitions?.[0]?.status?.type?.completed) eventIds.push(e.id);
    }
    await sleep(120);
  }
  console.log(`completed matches found: ${eventIds.length}`);

  // 2. fetch each match summary and extract metrics
  const records = [];
  let unmapped = 0;
  for (const id of eventIds) {
    try {
      const summary = await getJson(`${BASE}/summary?event=${id}`);
      const rec = extract(summary);
      const codes = Object.keys(rec.teams);
      if (codes.length !== 2) {
        unmapped++;
        continue;
      }
      records.push({ pair: pairKey(codes[0], codes[1]), ...rec });
    } catch (err) {
      console.warn(`  summary ${id}: ${err.message}`);
    }
    await sleep(120);
  }

  records.sort((a, b) => (a.date + a.pair).localeCompare(b.date + b.pair));
  await writeFile(OUT, JSON.stringify(records, null, 1) + "\n");
  console.log(`wrote ${records.length} records to ${OUT} (${unmapped} skipped)`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
