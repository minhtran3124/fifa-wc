# Product

## Register

product

> Design serves the data. The landing page is expressive and brand-led, but the
> reason the site exists is to let people read scores, tables, the bracket and
> stats fast and correctly. When atmosphere and legibility conflict, legibility
> wins — the "alive, on-brand" feel is carried by type, motion and color, never
> at the cost of reading a result at a glance. Treat the data routes
> (`/groups`, `/matches`, `/knockout`, `/stats`) per-task as product surfaces;
> the landing (`/`) may be worked brand-register when the task is clearly about
> the hero/identity.

## Users

Casual football fans during the 2026 World Cup (USA · Canada · Mexico). They
open the site in **big-moment check-ins** — around kickoff, at half-time, when a
result drops, or to see who's up next. Mostly **mobile, low patience, short
sessions**: they want the live score, the next match, and the feeling that the
tournament is happening *right now*, with the option to go deeper into tables,
the bracket and stats when they care to. They are not power users studying the
data daily; the front door must pay off in seconds.

## Product Purpose

A fast, unofficial fan hub for the first 48-team World Cup. It pulls real
fixtures, live results and standings (football-data.org, with a bundled
fallback so it always renders) and derives group tables, the knockout bracket
and tournament stats from them. Success is a site that **feels alive and
on-brand the instant it loads, yet lets a casual fan find any score, table or
fact without thinking** — atmosphere that earns the check-in, clarity that
rewards it.

## Brand Personality

**Electric · Bold · Broadcast.** Stadium-at-night energy: a deep midnight
surface lit by gold floodlight and pitch green, big condensed athletic
headlines, and broadcast-graphics cues (the live ticker, score panels, the
"LIVE" pulse). The voice is a confident matchday presenter — punchy, present
tense, never stiff or corporate. Emotional goal: the charge of walking into a
packed stadium, channelled so it never drowns out the scoreline.

## Anti-references

- **Generic SaaS dashboard** — flat gray card grids with one token accent,
  corporate admin-panel energy. This is a stadium, not an analytics tool.
- **Cluttered scores aggregator** — the dense, ad-stuffed, table-soup feel of
  legacy results sites (ESPN/Flashscore clutter). Breathing room over density.
- **Official governing-body site** — stiff sponsor-logo walls and corporate
  press-release tone. This is a fan's site, with a fan's pulse.
- **Over-the-top / gimmicky** — gaudy gradients and effect-for-effect's-sake
  animation that gets between a fan and the score. Motion must serve reading.

## Design Principles

1. **The score in two seconds.** Every screen answers a fan's first question
   (what's the score, who's next) before it asks for any attention. Atmosphere
   loads around the answer, never in front of it.
2. **Broadcast, not dashboard.** Borrow the language of live TV graphics —
   tickers, lower-thirds, the LIVE dot — not the language of admin panels.
   Tables are arenas, not spreadsheets.
3. **Earn every effect.** Floodlight, the rolling ball, the marquee, shimmer —
   each motion has a reason and a reduced-motion answer. If it doesn't help a
   fan feel the moment or read the data, it's cut.
4. **Mobile is the main event.** Designed for a phone held one-handed at a
   match, then scaled up — not the reverse. Thumb-reach, scannability and tap
   targets come first.
5. **Always renders, never lies.** Live source vs. bundled is always honest and
   visible; the site degrades gracefully and never shows a broken or empty
   tournament.

## Accessibility & Inclusion

Target **WCAG 2.1 AA**: body text ≥4.5:1 and large/UI text ≥3:1 against the dark
surfaces (watch muted `text-white/40–55` values on tinted panels — verify, don't
assume), full keyboard operability and visible focus, and semantic structure for
the data tables. **Motion-safe**: every animation (floodlight, rolling ball,
marquee, shimmer, reveals) must honor `prefers-reduced-motion: reduce` with a
static or crossfade fallback — already partially in place in `globals.css`.
Don't rely on color or flag emoji alone to convey team/result meaning.
