---
name: FIFA World Cup 2026
description: A night-match broadcast for the first 48-team World Cup — midnight surfaces, floodlight gold, live data.
colors:
  ink: "#070b16"
  ink-soft: "#0e1424"
  ink-card: "#141d33"
  line: "#232f4a"
  text: "#eaf0fb"
  gold: "#fbbf24"
  gold-soft: "#fcd34d"
  pitch: "#16a34a"
  pitch-dark: "#0a6b35"
  live: "#ef4444"
  source-live: "#34d399"
  source-bundled: "#fbbf24"
typography:
  display:
    fontFamily: "Big Shoulders, Arial Narrow, Manrope, sans-serif"
    fontSize: "clamp(3rem, 9vw, 6rem)"
    fontWeight: 900
    lineHeight: 0.9
    letterSpacing: "0"
  headline:
    fontFamily: "Big Shoulders, Arial Narrow, sans-serif"
    fontSize: "clamp(1.875rem, 4vw, 2.25rem)"
    fontWeight: 800
    lineHeight: 1.1
    letterSpacing: "-0.01em"
  title:
    fontFamily: "Big Shoulders, Arial Narrow, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 800
    lineHeight: 1.2
    letterSpacing: "0"
  body:
    fontFamily: "Manrope, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "normal"
    fontFeature: "'ss01', 'cv01'"
  data:
    fontFamily: "Big Shoulders, Manrope, sans-serif"
    fontSize: "2.25rem"
    fontWeight: 800
    lineHeight: 1
    letterSpacing: "0"
    fontFeature: "tabular-nums"
  label:
    fontFamily: "Manrope, sans-serif"
    fontSize: "0.72rem"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "0.22em"
rounded:
  xs: "0.25rem"
  sm: "0.5rem"
  md: "0.75rem"
  lg: "1rem"
  xl: "1.75rem"
  pill: "9999px"
spacing:
  xs: "0.625rem"
  sm: "0.875rem"
  md: "1.25rem"
  lg: "2rem"
  section: "3.5rem"
components:
  button-primary:
    backgroundColor: "{colors.gold}"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    padding: "0.75rem 1.5rem"
  button-secondary:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.text}"
    rounded: "{rounded.pill}"
    padding: "0.75rem 1.5rem"
  chip-filter:
    backgroundColor: "{colors.gold}"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    padding: "0.5rem 1rem"
  card-match:
    backgroundColor: "{colors.ink-soft}"
    textColor: "{colors.text}"
    rounded: "{rounded.md}"
    padding: "0.875rem"
  panel:
    backgroundColor: "{colors.ink-card}"
    textColor: "{colors.text}"
    rounded: "{rounded.lg}"
    padding: "1.25rem"
  nav-link-active:
    backgroundColor: "{colors.gold}"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    padding: "0.5rem 0.75rem"
  source-badge-live:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.source-live}"
    rounded: "{rounded.pill}"
    padding: "0.25rem 0.625rem"
---

# Design System: FIFA World Cup 2026

## 1. Overview

**Creative North Star: "The Night-Match Broadcast"**

This is a floodlit stadium seen through a live TV broadcast. The surface is deep
midnight blue, the kind a camera sees in the stands after sunset; the light comes
from a single source — floodlight gold — falling on the things that matter: the
score, the call-to-action, the team that just qualified. Touchline green marks the
pitch and everything tied to it. The system speaks the grammar of broadcast
graphics: lower-third score panels, a scrolling results ticker, a pulsing LIVE
dot, big condensed athletic headlines stamped over the dark. Atmosphere arrives
*around* the answer, never in front of it.

It is a **product** at heart — the reason it exists is to let a casual fan read a
score, a table, a bracket or a stat in two seconds, mostly one-handed on a phone.
So the spectacle is disciplined: condensed display type for headlines and numbers,
a clean humanist sans for everything a user actually reads, generous hairline
structure instead of clutter, and motion that conveys state (live, refreshing,
incoming) rather than decoration. The dark is functional, not moody — it lets the
gold and the green carry meaning, and it lets a glowing scoreline read like a
broadcast caption.

This system explicitly rejects the four things its product brief names: the flat
gray **SaaS dashboard** (this is a stadium, not an analytics tool), the dense
ad-stuffed **scores aggregator** (breathing room over table-soup), the stiff
sponsor-wall **governing-body site** (this has a fan's pulse), and **gimmickry**
that gets between a fan and the score (every effect earns its place or is cut).

**Key Characteristics:**
- Midnight-navy surfaces lit by a single floodlight-gold accent.
- Tonal layering (ink → ink-soft → ink-card) and hairline borders instead of shadows.
- Condensed athletic display type (Big Shoulders) for headlines + numbers; Manrope for reading.
- Broadcast cues: score panels, the marquee ticker, the LIVE pulse, the source badge.
- Tabular-nums everywhere a number can change. The scoreline is sacred.
- Motion that signals state, with a `prefers-reduced-motion` answer for every animation.

## 2. Colors

A near-black midnight field, lit by one warm gold and grounded by one pitch green; everything else is a tonal step or a state signal.

### Primary
- **Floodlight Gold** (#fbbf24): The single source of light. Reserved for primary
  CTAs, the active nav/filter pill, all live and final scores, points totals,
  stat figures, and the section-day markers. Its scarcity is what makes a score
  feel lit. **Gold-Soft** (#fcd34d) is its lighter partner, used only inside the
  gold-to-gold gradient on badges and the biggest-win chip.

### Secondary
- **Touchline Green** (#16a34a): The pitch. Marks qualification (top-two rows tint
  `pitch/6`, rank badges go solid green), the home-hero gradient wash, and the
  brand badge. **Pitch-Dark** (#0a6b35) anchors the logo gradient. Green is
  semantic, never decorative.

### Neutral
- **Midnight Navy** (#070b16): The body surface — the stadium at night. Also the
  text color *on* gold (CTAs, active pills, badges).
- **Ink-Soft** (#0e1424): The first raised layer — match cards, the ticker, the
  stat-grid cells, bracket ties.
- **Ink-Card** (#141d33): The second raised layer — panels and hover states.
- **Line** (#232f4a): Every hairline — borders, dividers, table row rules, and
  (as a background behind `gap-px` grids) the seam that separates stat cells.
- **Caption White** (#eaf0fb): Body and heading text. Hierarchy is built by
  *opacity* of this one ink: `white/85` strong body, `white/55` secondary,
  `white/35–45` labels and metadata.

### State / Semantic
- **Live Red** (#ef4444): The LIVE dot and live scores only. Always paired with a
  pulse animation — never a static red.
- **Source Live** (#34d399, emerald) / **Source Bundled** (#fbbf24, amber): The
  honesty badge — live API vs. bundled fallback. This pairing is load-bearing
  trust UI, not styling.

### Named Rules
**The One Light Rule.** Floodlight Gold is the only thing that glows. If two
elements on a screen both reach for gold, one is wrong — demote it to caption
white at reduced opacity. Gold marks *the answer* (the score, the action, the
result), nothing else.

**The Opacity-Ramp Rule.** Neutral text hierarchy is built from one color
(#eaf0fb) at stepped opacity, not from separate gray tokens. Body never drops
below `white/55`; `white/35–45` is for labels and metadata only. Verify any
muted value against its actual backdrop for WCAG AA before shipping it.

**The Green-Means-Pitch Rule.** Touchline green is reserved for qualification and
the pitch. Never use it for a generic "success" or as a second accent.

## 3. Typography

**Display Font:** Big Shoulders (with Arial Narrow, then Manrope, fallback)
**Body Font:** Manrope (with ui-sans-serif, system-ui fallback)

**Character:** A contrast pairing on the condensed-vs-open axis. Big Shoulders is
a tall, condensed, athletic grotesque — it reads like the number on the back of a
shirt or a stadium scoreboard, and it carries every headline, score and stat.
Manrope is an open, friendly humanist sans that handles everything a fan actually
*reads*. The tension between the two is the whole voice: stadium signage over
calm prose.

### Hierarchy
- **Display** (900, `clamp(3rem, 9vw, 6rem)`, line-height 0.9, uppercase): Hero
  headline only, on the home page. Stamped, condensed, balanced. Capped at 6rem.
- **Headline** (800, `clamp(1.875rem, 4vw, 2.25rem)`, tracking-tight): Page `<h1>`
  titles (`PageHeader`).
- **Title** (800, 1rem–1.125rem): Section `<h2>` headings, panel headers, group names.
- **Body** (400–500, 0.875rem–1rem, line-height 1.5): Descriptions and prose at
  `white/55–85`. Cap reading measure at 65–75ch (`max-w-2xl` on subtitles).
- **Data** (800, condensed, tabular-nums): Scores, points, stat figures, the
  countdown — always Big Shoulders, always `tnum`, usually gold.
- **Label** (700, 0.72rem, letter-spacing 0.22em, uppercase): The `.eyebrow`
  kicker, table headers, stage tags, day markers. Gold/80 or white/35–45.

### Named Rules
**The Scoreboard Rule.** Every number that can change — scores, points, GD,
countdowns, stat totals — is set in condensed display type with
`font-variant-numeric: tabular-nums`. Numbers must not reflow as they tick.

**The Display-Stays-Big Rule.** Big Shoulders is for headlines, scores and stat
figures only. Never set body copy, button labels, table cells, or form text in
the display face — that's a product-UI smell. Reading text is always Manrope.

**The Eyebrow-Is-Earned Rule.** The all-caps gold `.eyebrow` kicker is a real
broadcast lower-third label, used on page and major section headers — not a
reflex above every block. Keep it as a deliberate cadence, not scaffolding.

## 4. Elevation

**Flat tonal layering + selective gold glow.** Surfaces are flat at rest. Depth
comes from a three-step tonal ramp (Midnight Navy → Ink-Soft → Ink-Card) and
hairline `line` borders, not from drop shadows. The one exception is the
floodlight: shadows appear only as *gold glow* under the things the One Light Rule
already privileges — the primary CTA, group badges, the highlighted Final tie, the
logo trophy. There is also one functional blur: the sticky nav and mobile menu use
`backdrop-blur-xl` over `ink/80` so content reads while scrolling beneath them.

### Shadow Vocabulary
- **Floodlight glow** (`box-shadow: 0 10px 25px -5px rgba(251,191,36,0.20)`):
  Under the primary gold CTA and the highlighted Final tie. The accent appears lit.
- **Badge glow** (`box-shadow: 0 4px 6px -1px rgba(251,191,36,0.20)`): Under
  small gold badges (group letters, active filter chips).
- **Menu lift** (`box-shadow: 0 20px 25px -5px rgba(0,0,0,0.30)`): The mobile
  dropdown only — a true dark shadow, because it floats over content.

### Named Rules
**The Flat-Until-Lit Rule.** Surfaces are flat. A shadow on this site means
"this is lit by the floodlight" — so shadows are gold and rare. A neutral drop
shadow is only ever allowed on a floating overlay (the mobile menu). If a card
has a gray shadow at rest, it's wrong; raise it with a tonal step or a `gold/40`
hover border instead.

## 5. Components

Components are **broadcast-grade and tactile**: TV-graphics-clean, confident, with
a small physical response on hover (lift, scale, or a gold border igniting),
while the data underneath stays crisp and scannable.

### Buttons
- **Shape:** Fully rounded pill (`rounded-full`).
- **Primary:** Floodlight gold background, Midnight Navy text, bold, `px-6 py-3`,
  with floodlight glow. Hover scales to `1.03–1.04` (no color change — the gold
  already glows). Used for the hero CTA and Refresh.
- **Secondary:** Transparent on `line` border, caption-white text. Hover lifts the
  border to `white/40` and washes `white/5`.
- **Refresh (signature):** Primary pill with a ⚽ glyph that spins 360° on hover and
  switches to a continuous `ball-spin` while the transition is pending.

### Chips (filters)
- **Style:** Pill. **Active** = gold fill, ink text, badge glow. **Inactive** =
  `line` border, `white/65` text; hover lifts border to `white/30` and text to white.
- **Behavior:** Horizontal scroll row on mobile (`no-scrollbar`), never wraps.

### Cards / Containers
- **Match Card:** `rounded-xl`, `ink-soft/70` on a `line` border, `p-3.5`. Hover
  lifts `-translate-y-0.5`, igniting a `gold/40` border and deepening to
  `ink-card/70`. Stage/meta in uppercase `white/35` labels top and bottom;
  winner's name and score go bold + gold, loser dims to `white/50`.
- **Panel:** The workhorse surface — a subtle vertical gradient
  (`ink-card → ink-soft` at 85% alpha) on a `line` border, `rounded-lg` (1rem),
  `p-4/p-5`. Used for tables, leaderboards, confederation lists. Hover may warm
  the border. **Never nest a panel inside a panel.**
- **Corner scale:** xs `0.25rem` (rank badges) · sm `0.5rem` (icon tiles, menu) ·
  md `0.75rem` (cards, ties) · lg `1rem` (panels, stat grids) · xl `1.75rem` (hero).

### Tables (standings — signature)
- **Header:** Uppercase `white/40` labels, 11px, no fill.
- **Rows:** Separated by `line/60` top borders (no zebra). Hover washes
  `white/3`. **Qualifying rows** (top two) tint `pitch/6` and get a solid green
  rank badge; the third-place contender gets a neutral `white/15` badge.
- **Numbers:** All cells `tabular-nums`, `white/70`; the Points column is condensed
  display gold.
- A legend (green / neutral swatch) always explains the row tints.

### Navigation
- **Desktop:** Sticky top bar, `ink/80` + `backdrop-blur-xl`, hairline bottom
  border. Pill links; active = gold fill + ink text, inactive = `white/70` with a
  `white/10` hover wash.
- **Mobile:** Hamburger that animates to an X; a backdrop-dimmed dropdown that
  slides + fades, with the links staggering in (`60 + i*45`ms). Honors
  `motion-reduce`. `inert` when closed.

### Stat Grid (signature)
A row of figures rendered as a `gap-px` grid over a `line` background, so a single
hairline seam separates each cell — a broadcast stat strip, not a row of cards.
Each cell: `ink-soft/90`, a big gold condensed `tnum` figure, an uppercase
`white/45` label. This is the house alternative to the banned hero-metric template.

### Broadcast Ticker (signature)
A full-width marquee inside a `line`-bordered, `stripes`-textured strip: flags +
3-letter codes + scores scrolling left at 45s, paused on hover, with gradient
fade masks at both edges. Live scores go red, finished go gold. Pure atmosphere
that doubles as a glanceable results crawl.

### Knockout Bracket (signature)
Horizontally-scrolling columns (R32 → Final) of `Tie` cards: two stacked team
slots split by a hairline, a date/venue footer on `black/20`. The Final tie is
highlighted with a `gold/50` border and floodlight glow.

## 6. Do's and Don'ts

### Do:
- **Do** keep Floodlight Gold (#fbbf24) for the answer only — scores, primary
  actions, current selection, results. Honor the One Light Rule.
- **Do** build neutral text hierarchy from #eaf0fb at stepped opacity; keep body
  ≥ `white/55` and verify muted values hit WCAG AA on their actual backdrop.
- **Do** set every changeable number in condensed display type with
  `tabular-nums` (the Scoreboard Rule).
- **Do** convey depth with the ink → ink-soft → ink-card tonal ramp and hairline
  `line` borders; reserve shadows for gold glow under lit elements.
- **Do** give every animation (floodlight, rolling ball, marquee, reveals, nav
  stagger) a `prefers-reduced-motion: reduce` fallback.
- **Do** keep the live-vs-bundled source badge visible and honest on every data
  page — it's trust UI (the "Always renders, never lies" principle).
- **Do** design mobile-first and one-handed: scrollable filter/bracket rows,
  thumb-reachable nav, sticky day markers.

### Don't:
- **Don't** ship the flat gray **SaaS-dashboard** look — card grids of icon +
  heading + text, one token accent, corporate admin energy. This is a stadium.
- **Don't** drift toward a dense, ad-stuffed **scores-aggregator** table-soup.
  Breathing room and hairline structure win over raw density.
- **Don't** adopt the stiff **governing-body** sponsor-wall, press-release tone.
- **Don't** add gimmicky, **over-the-top** motion or gaudy gradients that get
  between a fan and the score. Every effect earns its place or is cut.
- **Don't** set body copy, button labels, table cells, or form text in Big
  Shoulders — display type is for headlines, scores and stat figures only.
- **Don't** restate the eyebrow kicker or numbered markers above *every* section;
  keep them a deliberate broadcast cadence, not reflexive scaffolding.
- **Don't** use `background-clip: text` gradient text anywhere, ever. Gold words
  (the "2026" lockup, a hero phrase) are a single solid `gold`; emphasis comes
  from weight and size, never a gradient fill.
- **Don't** put a neutral gray drop shadow on a resting surface; if it has a
  shadow at rest it should be gold glow, or it should be flat.
- **Don't** use Touchline Green as a generic success color or a second accent —
  it means qualification and the pitch.
- **Don't** nest a panel inside a panel.
