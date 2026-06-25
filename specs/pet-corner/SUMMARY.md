---
slug: pet-corner
lane: normal
confidence: high
created: 2026-06-25
---

# Pet Corner — feed the 3 World Cup mascots

## Intake

- **Lane:** normal — client-only feature, no auth, no DB, no data-loss. Persists a
  small toy state in `localStorage` (same pattern as `lib/favorites.ts`).
- **Confidence:** high — scope and approach agreed with the user over a brainstorm.
- **Reason:** additive feature; isolated new route + components; no change to existing
  data flows. Risk is cosmetic only.

## Concept

A Tamagotchi-style daily loop using the three official WC 2026 mascots (Maple 🫎,
Zayu 🐆, Clutch 🦅). Each mascot has its **own** hunger that decays in real time since
it was last fed. Neglect → progressively sadder/gaunt visuals (recoverable, never
permadeath). Feeding costs **snacks**, earned by visiting daily and by teams playing
their first match (reuses `playedIds`).

### Mood ladder (per mascot, by hours since last fed)
happy <18h · content <36h · hungry <72h · weak <144h · gaunt ≥144h (bottom, always
revivable). Feeding resets to happy. Daily visitor easily keeps them happy.

### Snack economy
Earn: +2 first visit each day; +1 per team that plays its first match (claimed once).
Starter: 3 snacks. Spend: 1 snack feeds one mascot to full; "Feed all" feeds the
hungriest first, 1 snack each.

## Decisions (locked with user)

- Per-mascot hunger (not shared) + a "Feed all" convenience.
- **Art is a swappable layer:** every render goes through `MascotAvatar({id,mood,eating})`.
  v1 = emoji + CSS mood effects; v2 swaps the component internals to drawn art with no
  other code change.
- Hybrid feeding: interaction earns snacks + manual Feed button spends them.
- Gentle decay pace.

## Guardrails

- No permadeath; first visit starts happy; bottom state revivable with one feed.
- Worst state stays cute + recoverable (branded characters — keep the "unofficial fan
  project" framing; heavy stylisation when real art lands).
- A11y: mood conveyed by label + emoji, not colour alone; respect `prefers-reduced-motion`.
- `localStorage` is per-device (no sync) — acceptable for a toy.
- Scope locked to hunger + snacks + feed + 5 moods. Out: food types, extra stats,
  mini-games, evolution.

### Verify

| Check | Command | Exit | Notes |
|---|---|---|---|
| Type check | `npx tsc --noEmit` | 0 | run with Node 20 |
| Prod build | `npm run build` | 0 | run with Node 20 |

### Rollback

- `git revert <sha>` — feature is additive (new route + components + dict keys + CSS).
