---
slug: pet-corner
status: shipped
owner: Minh Tran
created: 2026-06-25
---

# Pet Corner

## 1. Motivation
A daily-return hook for the site: feed the three WC 2026 mascots; neglect makes them
sad/gaunt. Client-only, no backend — state derived from a `lastFedAt` timestamp in
`localStorage`.

## 2. Non-goals
Food types, happiness/cleanliness stats, mini-games, evolution, cross-device sync,
real backend. Art is emoji+CSS for v1 (drawn art is a later swap behind `MascotAvatar`).

## 3. Success Criteria
- `/[locale]/pets` renders 3 mascots, each with mood + satiety bar + Feed button.
- Hunger decays in real time; feeding resets to happy; never permadeath.
- Snacks earned (daily visit + first-match teams), spent on feeding; persisted.
- Home widget shows status + quick "Feed all" + link.
- EN + VN copy; nav entry; `tsc` + `build` green.

## 4. Tasks

### Task 1.1 — Pet state + game logic

```xml
<task id="1.1" wave="1">
  <files>lib/pet.ts</files>
  <action>Pure logic + localStorage layer: MascotId, Mood, moodFor(lastFedAt,now), satietyFor(), PetState schema (v, snacks, pets, claimed, lastVisitDay, startedAt), load/save (SSR-safe, versioned, shape-guarded), freshState (starter 3 snacks), applyEarnings (daily +2 + new played teams +1, claim-once), feed/feedAll (hungriest first), localDay helper, PET_EVENT.</action>
  <verify>npx tsc --noEmit</verify>
  <done>Module type-checks; no React imports.</done>
</task>
```

### Task 1.2 — Avatar (swappable art layer)

```xml
<task id="1.2" wave="1">
  <files>components/MascotAvatar.tsx</files>
  <action>Client presentational component MascotAvatar({id,emoji,accent,mood,eating,size?}). v1 renders emoji + mood overlays (💧/🪰/zzz/✨) under class mood-{mood}; sets --pet-accent. Single seam for future drawn art.</action>
  <verify>npx tsc --noEmit</verify>
  <done>Renders for all 5 moods; no other component references emoji directly.</done>
</task>
```

### Task 2.1 — Pet Corner UI + home widget

```xml
<task id="2.1" wave="2">
  <files>components/usePet.ts, components/PetCorner.tsx, components/PetWidget.tsx</files>
  <action>usePet(playedTeamIds) — shared client hook (load/earn/feed, 60s mood tick, PET_EVENT sync) so page + widget never diverge. PetCorner (client leaf): hydration-guarded; on mount load state, seed claimed=playedIds on first ever run, applyEarnings, toast gained snacks. Per-mascot card: avatar, name, localized animal/role, mood label, satiety bar, Feed (disabled if 0 snacks). Header: snack count, Feed all, earn hint. PetWidget: compact home card — 3 mini avatars + snack count + quick Feed all + link to /pets. Both subscribe to PET_EVENT.</action>
  <verify>npx tsc --noEmit</verify>
  <done>No hydration mismatch (stable first paint); feeding updates mood + bar live.</done>
</task>
```

### Task 3.1 — Route, nav, copy, styles

```xml
<task id="3.1" wave="3">
  <files>app/[locale]/pets/page.tsx, components/AlbumNav.tsx, lib/dictionaries/en.ts, lib/dictionaries/vi.ts, app/sticker.css, app/[locale]/page.tsx</files>
  <action>Server route /[locale]/pets: fetch matches, compute playedTeamIds, page head + PetCorner. Add nav.pets + pet{} block to en/vi (moods, feed, feedAll, toasts, hints, widget). Add pets link to AlbumNav. Mount PetWidget on home. CSS: .pet-avatar mood states (grayscale/droop/shake/overlays), eat animation + hearts, cards, satiety bar, snack chip; respect prefers-reduced-motion.</action>
  <verify>npx tsc --noEmit && npm run build</verify>
  <done>Page reachable from nav; widget on home; EN+VN; build green.</done>
</task>
```

### Task 4.1 — Pens with wandering creatures (v2)

```xml
<task id="4.1" wave="4">
  <files>components/usePenWander.ts, components/PetCreature.tsx, components/PetCorner.tsx, app/sticker.css</files>
  <action>Turn the 3 static cards into 3 fenced pens, each with one creature that autonomously wanders inside. usePenWander(n, speedScales): one shared rAF loop, Reynolds accumulated-angle wander + inward boundary force, refs (no re-render), faces via scaleX, toggles .walking class, pauses on tab-hidden, honours prefers-reduced-motion (no loop; CSS-centred). speedScales derived from each mascot's mood (happy lively → gaunt still). PetCreature: original SVG/CSS "minion" (accent body + emoji face + stepped leg walk cycle) behind the same swappable seam (PNG/AI sprite can replace internals later). CSS: pen (grass + fence), creature/legs walk animation, reduced-motion fallback.</action>
  <verify>npx tsc --noEmit && npm run build</verify>
  <done>3 pens render; creatures wander within bounds, face direction, walk-animate; movement scales with mood; reduced-motion = static centred; build green.</done>
</task>
```

## 5. Risks
- Branded-character tone/IP — mitigated by cute+recoverable states and fan disclaimer.
- First-visit snack windfall — mitigated by seeding `claimed` with already-played teams.
- Hydration mismatch — mitigated by mounted-guard pattern (see `FavoriteButton`).

## 6. Status Log
- 2026-06-25 — plan active; executing single-session.
