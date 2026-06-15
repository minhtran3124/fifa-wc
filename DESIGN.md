---
name: World Cup 2026 — Sticker Album
description: A Panini-style collector's album for the first 48-team World Cup — warm paper, foil crests, halftone print and live data.
colors:
  paper: "#e7dcc4"
  paper-raised: "#f2ead7"
  card: "#fffdf7"
  ink: "#2b2114"
  ink-soft: "#5d5037"
  line: "#cabd9b"
  red: "#bb3829"
  green: "#1c7a47"
  blue: "#185a92"
  foil-gold: "#d9b24a"
  source-bundled: "#c9a238"
  source-bundled-ink: "#9c6b14"
typography:
  display:
    fontFamily: "Anton, Arial Narrow, sans-serif"
    fontSize: "clamp(2.75rem, 9vw, 5.5rem)"
    fontWeight: 400
    lineHeight: 0.86
    letterSpacing: "0.005em"
  headline:
    fontFamily: "Anton, Arial Narrow, sans-serif"
    fontSize: "clamp(2rem, 5vw, 3rem)"
    fontWeight: 400
    lineHeight: 0.95
    letterSpacing: "0.01em"
  title:
    fontFamily: "Anton, Arial Narrow, sans-serif"
    fontSize: "1.15rem"
    fontWeight: 400
    lineHeight: 1
    letterSpacing: "0.01em"
  body:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "14.5px"
    fontWeight: 400
    lineHeight: 1.55
    letterSpacing: "normal"
  label:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "11px"
    fontWeight: 800
    lineHeight: 1.2
    letterSpacing: "0.06em"
  data:
    fontFamily: "Anton, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 400
    lineHeight: 1
    letterSpacing: "normal"
    fontFeature: "tabular-nums"
  script:
    fontFamily: "Caveat, cursive"
    fontSize: "1.375rem"
    fontWeight: 700
    lineHeight: 1
    letterSpacing: "normal"
rounded:
  sm: "8px"
  btn: "10px"
  md: "14px"
  lg: "16px"
  xl: "20px"
  pill: "9999px"
spacing:
  xs: "6px"
  sm: "10px"
  md: "16px"
  lg: "24px"
  gutter: "clamp(16px, 4vw, 48px)"
  section: "clamp(40px, 6vw, 64px)"
components:
  button-primary:
    backgroundColor: "{colors.red}"
    textColor: "#ffffff"
    rounded: "{rounded.btn}"
    padding: "12px 22px"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.btn}"
    padding: "12px 22px"
  chip-filter:
    backgroundColor: "transparent"
    textColor: "{colors.ink-soft}"
    rounded: "{rounded.pill}"
    padding: "9px 16px"
  chip-filter-active:
    backgroundColor: "{colors.red}"
    textColor: "#ffffff"
    rounded: "{rounded.pill}"
    padding: "9px 16px"
  nav-tab-active:
    backgroundColor: "{colors.ink}"
    textColor: "#ffffff"
    rounded: "{rounded.pill}"
    padding: "7px 12px"
  card-sticker:
    backgroundColor: "{colors.card}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: "14px 16px"
  panel:
    backgroundColor: "{colors.paper-raised}"
    textColor: "{colors.ink}"
    rounded: "{rounded.lg}"
    padding: "16px"
  refresh:
    backgroundColor: "{colors.ink}"
    textColor: "#ffffff"
    rounded: "{rounded.pill}"
    padding: "8px 16px"
  fav:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    padding: "9px 18px"
  fav-on:
    backgroundColor: "{colors.ink}"
    textColor: "#ffffff"
    rounded: "{rounded.pill}"
    padding: "9px 18px"
  source-badge-live:
    backgroundColor: "rgba(28, 122, 71, 0.1)"
    textColor: "{colors.green}"
    rounded: "{rounded.pill}"
    padding: "5px 11px"
---

# Design System: World Cup 2026 — Sticker Album

## 1. Overview

**Creative North Star: "The Collector's Sticker Album"**

This is the Panini album spread open on a kitchen table during the tournament.
The surface is warm collector's-album paper, dotted with halftone print; the
crests you've earned are foil-bordered shinies that catch the light, and the bits
that matter — a score, a "got it!", the Final — are stamped on in handwritten
marker. Every card is a sticker: it sits at a slight rotation, drops a hard
print-shadow onto the page, and lifts when you reach for it. The system speaks
the grammar of collectible football print — foil edges, dashed "still-to-collect"
slots, ribbons, page tabs, a progress meter for how full the album is — not the
grammar of a screen. The warmth is the product: it makes a live tournament feel
like something you're physically assembling.

Underneath, it is still a **product**. The reason it exists is to let a casual
fan read a score, a table, a bracket or a stat in two seconds, mostly one-handed
on a phone. So the nostalgia is disciplined: Anton's condensed athletic caps
carry every headline and every number, Inter handles everything a fan actually
reads, and the album devices (foil, rotation, scribble) are reserved for moments
of arrival — a collected sticker, a featured shiny, the Final — never sprayed
across the reading surface. Numbers are always tabular and never reflow. The
paper is functional, not merely pretty: it lets the red carry the answer and the
green carry qualification.

This system explicitly rejects the four things the product brief names: the flat
gray **SaaS dashboard** (this is an album, not an analytics tool), the dense
ad-stuffed **scores aggregator** (breathing room over table-soup), the stiff
sponsor-wall **governing-body site** (this has a collector's pulse), and
**gimmickry** that gets between a fan and the score (every foil edge and rotation
earns its place or is cut).

**Key Characteristics:**
- Warm album-paper surfaces (`#e7dcc4`) with a fine halftone print dot.
- Foil-bordered "shiny" stickers (`--al-foil` gradient via `background-clip`) for collected / featured items only.
- Anton condensed caps for headlines + numbers; Inter for reading; Caveat marker for scribbled moments.
- Tactile print elevation: hard offset shadows, slight per-card rotation, lift-on-hover, dashed "to-collect" slots.
- Red (`#bb3829`) is the single answer accent; green (`#1c7a47`) means qualification and the pitch.
- Tabular-nums on every number that can change. Live-vs-bundled source badge always visible.
- The whole app renders inside a `.album-root` scope; every component is an `.al-*` class.

## 2. Colors

A warm, printed palette: aged album paper grounded by dark earth ink, lit by one collectible red and one pitch green, with a foil gradient reserved for things you've earned.

### Primary
- **Album Red** (#bb3829): The single answer accent. Primary CTA (`.al-btn.primary`),
  active filter chip, every winning score, points totals, leaderboard values and
  bars, kickers/scribbles (Caveat), link hover, the "self" team highlight, and the
  red border a sticker takes on hover. Its scarcity is what makes a result feel
  stamped on.

### Secondary
- **Pitch Green** (#1c7a47): Qualification and the pitch. Marks qualifying rows
  (`tr.q` tints `green/10` + a solid green rank badge), the live source badge, a
  home-result split segment, the form "W" pill, and "got it!" collected tabs.
  Green is semantic, never decorative.

### Tertiary
- **Stadium Blue** (#185a92): A single supporting role — the *away* segment of the
  home/draw/away results split bar. Not used anywhere else.
- **Foil Gold** (#d9b24a, representative; full gradient `#f6e7a8 → #d9b24a → #fff6d0 → #c9a238 → #9c7a1f`):
  Not a flat color — a metallic gradient applied as a sticker *border* (collected
  discs, featured shinies, mascot cards, "my teams", the Final, match-detail
  header). It is the reward material; never use it as a fill or for text.

### Neutral
- **Album Paper** (#e7dcc4): The body surface — open-album paper, carrying the
  halftone dot pattern. Also the sticky top-bar fill at `92%` alpha.
- **Page Paper** (#f2ead7): The first raised paper layer — group/album pages,
  standings wraps, the team-status card, knockout nodes.
- **Sticker Card** (#fffdf7): The near-white sticker face — match stickers, player
  rows, fact cards, rules, all foil shinies sit on this.
- **Earth Ink** (#2b2114): Primary text; also the fill of dark chips, day tabs,
  page tabs, the refresh button, the score "chip" behind highlight results, and
  the active nav tab.
- **Soft Ink** (#5d5037): Secondary text — metadata, labels, captions, table cells.
- **Album Line** (#cabd9b): Every hairline and dashed edge — borders, dividers,
  table rules, "still-to-collect" dashed slots, the spine rail dashes, and the
  "v"/score separators (set in line color).

### State / Semantic
- **Source Live** (#1c7a47, green) / **Source Bundled** (#c9a238 border on
  #9c6b14 ink, amber): The honesty badge — live API vs. bundled fallback. This
  pairing is load-bearing trust UI, not styling.
- **Live Red** (#bb3829): The LIVE dot + live labels, always paired with a small
  filled dot — reuses Album Red.
- **Foil Star** (#e0a92b idle / #f6c552 active): The favourite/follow star glyph only.

### Named Rules
**The One Answer Rule.** Album Red is the only color that marks the answer — the
score, the primary action, the current selection, the result. If two things on a
screen both reach for red without being "the answer", one is wrong; demote it to
Soft Ink. Red's rarity on the warm paper is what makes it read as stamped.

**The Foil-Is-Earned Rule.** The foil gradient border means *collected, featured,
or the Final* — nothing else. A foil edge on an ordinary card is forbidden; it
cheapens the reward. Uncollected slots get a **dashed Album Line** border and a
grayscaled flag, never foil.

**The Green-Means-Pitch Rule.** Pitch Green is reserved for qualification, live
source, and the pitch (form W, home segment). Never use it as a generic "success"
color or a second decorative accent.

**The Print-Ink Rule.** Neutral text hierarchy is built from Earth Ink → Soft Ink
on warm paper, not from gray. Body and table-cell text stays at Earth/Soft Ink;
verify Soft Ink (#5d5037) on its actual paper backdrop for WCAG AA before
dropping anything lighter.

## 3. Typography

**Display Font:** Anton (with Arial Narrow fallback)
**Body Font:** Inter (with system-ui fallback)
**Script Font:** Caveat (handwritten marker, for collector's annotations)

**Character:** A three-voice print pairing. Anton is a single-weight (400),
ultra-condensed grotesque set in caps — it reads like the block lettering stamped
on a sticker or a scoreboard, and it carries every headline, team name and
number. Inter is a neutral, highly legible screen sans for everything a fan
actually reads. Caveat is the felt-tip marker a collector scrawls in the margins
— "Got it!", "Road to the Final", section labels. The tension between stamped
caps, calm reading sans, and handwriting *is* the album voice.

### Hierarchy
- **Display** (Anton 400, `clamp(2.75rem, 9vw, 5.5rem)`, line-height 0.86,
  uppercase): The hero album title only (`.al-title`). The year accent is red with
  an ink text-stroke. Capped well below the 6rem ceiling.
- **Headline** (Anton 400, `clamp(2rem, 5vw, 3rem)` / section `clamp(1.7rem,
  3.4vw, 2.4rem)`, uppercase): Page titles (`.al-page-title`) and section `<h2>`
  headings (`.al-sec-head h2`, knockout stage heads).
- **Title** (Anton 400, ~1.05–1.2rem, uppercase): Card names (`.al-myteam .nm`),
  squad position headers, match-detail squad titles, board headings.
- **Body** (Inter 400–500, 13–15px, line-height 1.55): Descriptions, subtitles,
  verdicts and prose at Earth/Soft Ink. Cap reading measure at ~56–62ch
  (`.al-sub`, `.al-page-sub` already do).
- **Data** (Anton 400, tabular-nums): Scores, points, stat stamps, meters,
  predictions, countdowns — always Anton, always `tnum`, usually red.
- **Label** (Inter 700–800, 10.5–12px, letter-spacing 0.05–0.08em, uppercase):
  Card meta rows (`.al-match .top`), tags (`.al-mh-tag`), table headers, day tabs.
- **Script** (Caveat 700, 18–32px, often rotated −2°, red): The hero kicker,
  section `.scribble` labels, ribbons, "got it!" tabs, the loading scribble.

### Named Rules
**The Stamp Rule.** Every number that can change — scores, points, GD, meters,
predictions, countdowns — is set in Anton with `font-variant-numeric:
tabular-nums`. Numbers must not reflow as they tick.

**The Three-Voice Rule.** Anton stamps, Inter reads, Caveat annotates. Never set
body copy, table cells, button labels or form text in Anton (a print-poster
smell), and never set a heading or a long sentence in Caveat — the marker is for
short collector's annotations only (≤ a few words).

**The Caps-Are-Anton Rule.** Uppercase display caps are always Anton at weight
400 — never faux-bold a body sans into a headline. If it's a big stamped word,
it's Anton; if it's read, it's Inter.

## 4. Elevation

**Tactile print stacking — the opposite of flat.** Depth is physical: stickers sit
at a slight rotation, cast a *hard offset* print-shadow onto the paper, and lift
on hover. Three paper tones (Album Paper → Page Paper → Sticker Card) layer the
surfaces, Album Line hairlines (often dashed) separate them, and the foil border
adds a metallic raised edge to earned items. There is one functional blur: the
sticky top bar uses `backdrop-filter: blur(10px)` over paper at 92% so content
reads while scrolling beneath it.

### Shadow Vocabulary
- **Print stamp** (`box-shadow: 2px 2px 0 rgba(43,33,20,0.22)`): The hard,
  offset, single-color shadow under badges, day tabs, page tabs and ribbons — the
  look of a sticker pressed onto paper.
- **Button press** (`box-shadow: 3px 4px 0 rgba(43,33,20,0.28)`, grows to `5px 7px
  0` on hover with `translate(-1px,-2px)`): Primary buttons, refresh, fav — the
  control physically presses up off the page.
- **Sticker lift** (`box-shadow: 0 12px 22px rgba(43,33,20,0.16)`): The diffuse
  shadow a card grows into on hover (`translateY(-2px)`), paired with a red border.
- **Foil drop** (`box-shadow: 0 16px 34px rgba(43,33,20,0.2)`, up to `0 22px 42px`
  for the Final/mascots): The deeper soft shadow under foil shinies — they sit
  highest on the page.
- **Inset highlight** (`box-shadow: inset 0 1px 0 rgba(255,255,255,0.5)`): A
  faint top sheen on paper pages, like light on a glossy page.

### Named Rules
**The Sticker-On-Paper Rule.** Shadows here are warm and ink-tinted
(`rgba(43,33,20,...)`), never neutral black, because the light is falling on
paper. A cool/black drop shadow is wrong. Resting cards may already carry a print
or foil shadow — this is intentional weight, not a flat-design violation.

**The Rotation Rule.** Collectible elements (stickers, badges, tabs, ribbons,
discs) sit at a slight rotation (±1–4°) at rest and straighten toward 0° on hover.
Reading surfaces (tables, prose blocks, panels) stay square. Rotation signals
"this is a physical object you can pick up."

## 5. Components

Components are **collectible and tactile**: print-clean, confident, each behaving
like a physical sticker — rotated at rest, hard-shadowed, lifting and squaring up
on hover — while the data underneath stays crisp and scannable. Everything lives
inside `.album-root` and is prefixed `.al-`.

### Buttons
- **Shape:** Rounded rectangle (`{rounded.btn}`, 10px); controls that are
  status/utility (refresh, fav, source) are full pills (`{rounded.pill}`).
- **Primary** (`.al-btn.primary`): Album Red fill, white text, weight 800,
  `12px 22px`, with the Button-press hard shadow. Hover nudges `translate(-1px,
  -2px)` and grows the shadow — no color change.
- **Ghost** (`.al-btn.ghost`): Transparent on a 2px Earth-Ink border, ink text.
  Hover washes `ink/6` and lifts `translateY(-2px)`.
- **Refresh (signature)** (`.al-refresh`): Earth-Ink pill, white text, with a ⚽
  glyph that spins continuously (`al-spin`) while the revalidate transition is
  pending; disabled drops to 0.65 opacity.

### Chips (filters)
- **Style** (`.al-chip`): Pill, 1.5px Album-Line border, Soft-Ink text,
  transparent fill. Horizontal scroll row (`.al-chips`, scrollbar hidden), never
  wraps.
- **States:** Hover lifts border + text to Earth Ink. **Active** = Album Red fill,
  white text, red border, Print-stamp shadow.

### Cards / Containers
- **Sticker card** (`.al-match`, `.al-fact`, `.al-rival`, `.al-player`,
  `.al-hl-row`): Sticker-Card paper on a 1px Album-Line border, `{rounded.md}`.
  Hover lifts `translateY(-2px)`, grows the Sticker-lift shadow, and turns the
  border Album Red. Winner's name + score go Earth-Ink/red bold; loser dims to
  Soft Ink.
- **Foil shiny** (`.al-shiny`, `.al-mascot`, `.al-myteam`, `.al-ko-final`,
  `.al-thero`, `.al-mh`, collected `.al-disc.got`): Sticker-Card face inside a
  ~6px **foil-gradient border** (`background-clip: padding-box, border-box`),
  rotated at rest, Foil-drop shadow. Reserved for collected / featured / the Final
  (the Foil-Is-Earned Rule).
- **Paper panel** (`.al-page`, `.al-standwrap`, `.al-group-card`, `.al-board`,
  `.al-split`, `.al-block`, status card): Page-Paper fill on Album-Line border,
  `{rounded.lg}`, sometimes an Inset-highlight sheen. The workhorse reading
  surface — square, never rotated, never foil.
- **To-collect slot** (`.al-disc.todo`, `.al-ko-tie.todo`): A **dashed** Album-Line
  border on transparent, with a grayscaled flag at ~0.4 opacity — the empty
  pocket waiting for a sticker.
- **Corner scale:** sm 8px (badges, rank chips, tabs) · btn 10px (buttons) · md
  14px (cards, players, rules) · lg 16px (panels, tables, group cards) · xl 20px
  (team hero, match-detail header) · pill (chips, fav, source, refresh, meters).

### Tables (standings — signature)
- **Wrap** (`.al-standwrap`): Page-Paper panel, horizontal scroll on overflow.
- **Header:** Soft-Ink uppercase labels, 10.5px, on a 2px Earth-Ink bottom rule.
- **Rows:** Separated by 1px Album-Line rules (no zebra). **Qualifying rows**
  (`tr.q`) tint `green/10` and get a solid green rank badge; the user's followed
  team (`tr.self`) tints `red/9` with a red name.
- **Numbers:** All cells `tabular-nums`, Soft Ink; the Points column is Anton in
  Album Red. A green/neutral **legend** always explains the row tints.

### Navigation
- **Desktop** (`.al-bar` / `.al-tab`): Sticky top bar, paper at 92% +
  `backdrop-blur(10px)`, Album-Line bottom border. Pill tabs; active = Earth-Ink
  fill + white text, inactive = ink-soft with an `ink/7` hover wash. A red
  rotated `.al-badge` brand stamp sits at the left.
- **Language switch** (`.al-lang`): A segmented pill (VI · EN) inside an Album-Line
  border; the active locale gets the Earth-Ink fill. Keeps the user on the same
  page under the other locale.
- **Mobile:** A solid Earth-Ink hamburger (☰ ↔ ✕) reveals a full-width paper
  dropdown anchored under the sticky bar; tabs stack as rounded rows. `aria-expanded`
  / `aria-controls` wired.

### Fields / Favourite control
- The album has no text inputs; the primary stateful control is the **favourite /
  follow** button (`.al-fav`): a pill, 2px Earth-Ink border, transparent at rest
  with a ☆ Foil-Star glyph; **on** state fills Earth Ink with white text and a ★
  in lit foil-gold. `aria-pressed` reflects state; renders a stable off-state on
  first paint, then hydrates from `localStorage`.

### Source badge (signature, trust UI)
`.al-src`: A bordered pill with a leading status dot. **Live** = green text on a
green-tinted fill; **Bundled** = amber. Always rendered next to the refresh
control on data pages — the honest "live API vs. bundled fallback" signal the
"Always renders, never lies" principle demands.

### Match sticker (signature)
`.al-match`: The collectible result card. Stage/group label + kickoff time (or a
red LIVE dot, or "Full time") on top; two team lines with flag, name and Anton
score; a footer with date + venue on an Album-Line rule. Winner emphasised, loser
dimmed. Links to the match-detail page.

### Knockout — "Road to the Final" (signature)
`.al-road`: A vertical spine of dashed rail + Anton-numbered nodes (foil when the
stage is complete, a solid-red trophy node at the end). Each stage lists `.al-ko-tie`
sticker ties — dashed when still to come, foil when collected, with a green "got
it!" tab. The Final is a large foil showpiece (`.al-ko-final`) with a red ribbon.

### Stamps & meters (signature)
`.al-stamp` (dashed Sticker-Card tile, Anton red value over a Soft-Ink label) is
the house stat unit — the album alternative to the banned hero-metric template.
The collection-progress `.al-meter` / `.al-board .bar` are green/red fills on a
paper track, showing how full the album / how dominant a leader is.

## 6. Do's and Don'ts

### Do:
- **Do** keep Album Red (#bb3829) for the answer only — scores, primary actions,
  current selection, results, links-on-hover. Honor the One Answer Rule.
- **Do** reserve the foil-gradient border for collected, featured, or Final items;
  give still-to-collect slots a dashed Album-Line border + grayscaled flag (the
  Foil-Is-Earned Rule).
- **Do** build neutral text from Earth Ink → Soft Ink on warm paper; verify Soft
  Ink (#5d5037) hits WCAG AA on its actual paper backdrop before shipping.
- **Do** set every changeable number in Anton with `tabular-nums` (the Stamp Rule).
- **Do** convey depth with the paper ramp (Album → Page → Card), warm ink-tinted
  shadows, slight rotation at rest, and lift-on-hover.
- **Do** rotate collectible objects ±1–4° at rest and straighten them on hover;
  keep reading surfaces (tables, prose, panels) square.
- **Do** give every animation (al-pop reveal, refresh spin, hover bounce, hero
  float, parade marquee) a `prefers-reduced-motion: reduce` fallback — already
  scoped under `.album-root`.
- **Do** keep the live-vs-bundled source badge visible and honest on every data
  page — it's trust UI ("Always renders, never lies").
- **Do** design mobile-first and one-handed: scrollable chip/bracket rows, the
  hamburger dropdown, thumb-reachable nav, sticky day tabs.

### Don't:
- **Don't** ship the flat gray **SaaS-dashboard** look — card grids of icon +
  heading + text, one token accent, corporate admin energy. This is an album.
- **Don't** drift toward a dense, ad-stuffed **scores-aggregator** table-soup;
  breathing room and hairline structure win over raw density.
- **Don't** adopt the stiff **governing-body** sponsor-wall, press-release tone.
- **Don't** add gimmicky, **over-the-top** motion or extra foil that gets between
  a fan and the score. Every foil edge and rotation earns its place or is cut.
- **Don't** set body copy, table cells, button labels or form text in Anton, and
  don't set headings or sentences in Caveat — Anton stamps, Inter reads, Caveat
  annotates (the Three-Voice Rule).
- **Don't** put foil on an ordinary card, or red on something that isn't the
  answer; both cheapen the signal.
- **Don't** use a neutral/black drop shadow — album shadows are warm and
  ink-tinted (`rgba(43,33,20,...)`) because light falls on paper.
- **Don't** use `background-clip: text` gradient *text* anywhere; the foil is a
  border material only. The "2026" lockup is solid Album Red with an ink stroke.
- **Don't** use Pitch Green as a generic success color or a second accent — it
  means qualification, live source, and the pitch.
- **Don't** nest a paper panel inside a paper panel; let the paper → card tonal
  step carry the layering instead.
