# FIFA World Cup 2026 🏆

A fan website for the 2026 FIFA World Cup (USA · Canada · Mexico) — the first
48-team edition. Built with **Next.js 15 (App Router)**, **TypeScript** and
**Tailwind CSS v4**.

## Sections

| Route        | What it shows |
|--------------|---------------|
| `/`          | **Overview** — hero, tournament facts, live pulse, latest & upcoming matches, all 48 nations |
| `/groups`    | **Table** — standings for all 12 groups, computed from results, with collapsible fixtures |
| `/matches`   | **Matches** — all 104 fixtures grouped by day, filterable (group / knockout / results / upcoming) |
| `/knockout`  | **Knockout** — the bracket from Round of 32 through to the Final |
| `/stats`     | **Stats** — top scorers, assist leaders, and tournament-wide numbers |

## Live data + Refresh button

The site runs on **real 2026 World Cup data** — fixtures, **live results** and
standings — from [football-data.org](https://www.football-data.org) (free tier
covers the World Cup).

Setup:

```bash
cp .env.example .env.local
# .env.local
FOOTBALL_DATA_TOKEN=your_token_here   # register free at football-data.org
```

How it works:

- `lib/footballData.ts` fetches `GET /v4/competitions/WC/matches` (token sent in
  the `X-Auth-Token` header) and normalises matches into the app's types. Real
  scores drive the group tables and stats (computed in `lib/standings.ts`).
- The fetch is cached **indefinitely** and tagged `wc-data` — **no auto-polling**.
- The **Refresh** button calls `POST /api/refresh`, which runs
  `revalidateTag("wc-data")` to bust the cache, then re-renders — so scores only
  update when *you* click Refresh. A badge shows **Live source** vs **Bundled**.
- **No token / request fails → falls back to the bundled `data/fixtures.json`
  (real 2026 draw & schedule from [TheStatsAPI](https://www.thestatsapi.com))**
  so the site always renders.

> Free-tier limit: ~10 requests/minute. Because data is cached until you hit
> Refresh, normal browsing makes at most one request. Player leaderboards on the
> Stats page are still illustrative samples.

## Data model

All data lives in `lib/` and is fully typed (`lib/types.ts`):

- `lib/teams.ts` — 48 teams in 12 groups (A–L) + 16 host venues.
- `lib/matches.ts` — generates the group fixtures (round-robin) and the knockout
  bracket. Group results are **deterministically simulated** (strength-weighted,
  stable per match id) for any match before `TODAY` (2026-06-14).
- `lib/standings.ts` — computes group tables (points → GD → GF → FIFA rank) and
  tournament aggregates.
- `lib/stats.ts` — sample player leaderboards.

> The group draw, fixtures and results are **illustrative**. To wire in real
> data, replace the arrays in `lib/teams.ts` / `lib/matches.ts` (or point them at
> an API) — the rest of the app derives from them automatically.

## Develop

```bash
# requires Node 18.18+ (Node 20 used here)
npm install
npm run dev      # http://localhost:3000
npm run build    # production build (all pages prerender statically)
npm start
```

## Deploy

Zero-config on Vercel — push the repo and import it, or run `vercel`.
