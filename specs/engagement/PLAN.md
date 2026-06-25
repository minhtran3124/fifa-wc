---
slug: engagement
status: shipped
owner: Minh Tran
created: 2026-06-25
---

# Engagement pack — trivia · PWA · share cards · predictions

## 1. Motivation
Add return-hook features that reuse the existing collect/pet loop. Snacks become
the shared currency: trivia and predictions reward snacks that feed the pets.
Client-only (localStorage); no backend.

## 2. Non-goals
Real push notifications (needs backend), accounts, server-side leaderboards.

## 3. Success criteria
Each feature ships independently, type-checks, builds, and is screenshot-verified.

## 4. Tasks

### Phase 1 — Daily trivia (+ shared snack reward)

```xml
<task id="1.1" wave="1">
  <files>lib/pet.ts, lib/trivia.ts, components/TriviaCard.tsx, app/[locale]/pets/page.tsx, lib/dictionaries/en.ts, lib/dictionaries/vi.ts, app/sticker.css</files>
  <action>grantSnacks(n) in lib/pet.ts (external reward → savePetState + event). Trivia question bank (EN/VI) + triviaForDay(). TriviaCard client component: one question/day, day-gated via localStorage; correct answer grants snacks once/day. Mount on Pet Corner page; EN/VI copy; CSS.</action>
  <verify>npx tsc --noEmit && npm run build</verify>
  <done>Daily question answerable once/day; correct → snacks; persists.</done>
</task>
```

### Phase 2 — PWA + add-to-calendar

```xml
<task id="2.1" wave="2">
  <files>app/manifest.ts, public/icon-*.png, components/Pwa.tsx, app/[locale]/layout.tsx, lib/ics.ts, components/AddToCalendar.tsx, app/[locale]/matches/page.tsx</files>
  <action>Web app manifest + icons + minimal service worker registration (installable, basic offline shell). lib/ics.ts builds an .ics; AddToCalendar button on fixtures (and followed teams) downloads a calendar event. EN/VI labels.</action>
  <verify>npx tsc --noEmit && npm run build</verify>
  <done>Installable; lighthouse PWA basics; .ics downloads with correct kickoff.</done>
</task>
```

### Phase 3 — Shareable OG cards

```xml
<task id="3.1" wave="3">
  <files>app/[locale]/teams/[code]/opengraph-image.tsx, components/ShareButton.tsx, app/[locale]/teams/[code]/page.tsx, lib/dictionaries/en.ts, lib/dictionaries/vi.ts</files>
  <action>Dynamic OG image (next/og ImageResponse) for team pages in the album/foil style. Share button (Web Share API + copy-link fallback). EN/VI labels.</action>
  <verify>npx tsc --noEmit && npm run build</verify>
  <done>OG image renders per team; share works on mobile + copy fallback.</done>
</task>
```

### Phase 4 — Predictions & bracket challenge

```xml
<task id="4.1" wave="4">
  <files>lib/predictions.ts, components/ScorePredictor.tsx, components/PredictionsSummary.tsx, app/[locale]/matches/page.tsx, app/[locale]/knockout/page.tsx, lib/dictionaries/en.ts, lib/dictionaries/vi.ts, app/sticker.css</files>
  <action>Per-match scoreline prediction (localStorage); score vs result (exact=3, correct result=1); points + accuracy summary; first correct settle grants snacks. Knockout: pick a winner per tie to fill the bracket, compare as results land.</action>
  <verify>npx tsc --noEmit && npm run build</verify>
  <done>Predict upcoming matches; settled results award points/snacks; bracket picks persist.</done>
</task>
```

## 5. Risks
- Scope is large — ship phase-by-phase, verify each before the next.
- Snack double-grant — gate rewards by day/match id in localStorage.
- PWA SW caching staleness — keep SW minimal (network-first), versioned.

## 6. Status log
- 2026-06-25 — plan active; Phase 1 in progress.
