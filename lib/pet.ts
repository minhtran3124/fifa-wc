// Pet Corner — feed the three WC mascots. Client-only toy state, derived from a
// per-mascot "last fed" timestamp in localStorage. No server/data cost.
// Mirrors the persistence pattern in lib/favorites.ts.

export type MascotId = "maple" | "zayu" | "clutch";
export const PET_IDS: MascotId[] = ["maple", "zayu", "clutch"];

export type Mood = "happy" | "content" | "hungry" | "weak" | "gaunt";

const KEY = "wc26-pets";
const VERSION = 1;
export const PET_EVENT = "wc26-pet-change";

// starter snacks on a brand-new save — enough to feed the whole trio once
const STARTER_SNACKS = 3;
const DAILY_SNACKS = 2; // first visit each day
// satiety reaches ~0 (gaunt) after this many hours since last fed
const FULL_HOURS = 144; // 6 days

// mood ladder by hours since the mascot was last fed (gentle pace)
const LADDER: { mood: Mood; underHours: number }[] = [
  { mood: "happy", underHours: 18 },
  { mood: "content", underHours: 36 },
  { mood: "hungry", underHours: 72 },
  { mood: "weak", underHours: 144 },
];

export function moodFor(lastFedAt: number, now: number): Mood {
  const hours = (now - lastFedAt) / 3_600_000;
  for (const step of LADDER) if (hours < step.underHours) return step.mood;
  return "gaunt";
}

/** 0..1 fullness for the satiety bar (1 = just fed). */
export function satietyFor(lastFedAt: number, now: number): number {
  const hours = (now - lastFedAt) / 3_600_000;
  return Math.max(0, Math.min(1, 1 - hours / FULL_HOURS));
}

export interface PetState {
  v: number;
  snacks: number;
  /** last-fed epoch ms per mascot */
  pets: Record<MascotId, number>;
  /** team ids already granted a snack (claim-once) */
  claimed: string[];
  /** local day key (YYYY-MM-DD) of the last daily bonus */
  lastVisitDay: string;
  startedAt: number;
}

export function localDay(now: number): string {
  return new Date(now).toLocaleDateString("en-CA"); // YYYY-MM-DD, local tz
}

export function freshState(now: number): PetState {
  return {
    v: VERSION,
    snacks: STARTER_SNACKS,
    pets: { maple: now, zayu: now, clutch: now },
    claimed: [],
    lastVisitDay: "",
    startedAt: now,
  };
}

/** Read raw saved state, or null if none / invalid. SSR-safe. */
export function readPetState(): PetState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const s = JSON.parse(raw) as PetState;
    if (!s || s.v !== VERSION || !s.pets) return null;
    return s;
  } catch {
    return null;
  }
}

export function savePetState(s: PetState): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(s));
  window.dispatchEvent(new Event(PET_EVENT));
}

/**
 * Grant snacks for the daily visit and for any newly-played teams (claimed once).
 * Returns the next state plus how many snacks were gained.
 */
export function applyEarnings(
  s: PetState,
  playedTeamIds: string[],
  now: number,
): { state: PetState; gained: number } {
  let gained = 0;
  const claimed = new Set(s.claimed);
  for (const id of playedTeamIds) {
    if (!claimed.has(id)) {
      claimed.add(id);
      gained += 1;
    }
  }
  let lastVisitDay = s.lastVisitDay;
  const today = localDay(now);
  if (lastVisitDay !== today) {
    gained += DAILY_SNACKS;
    lastVisitDay = today;
  }
  if (gained === 0) return { state: s, gained: 0 };
  return {
    state: { ...s, snacks: s.snacks + gained, claimed: [...claimed], lastVisitDay },
    gained,
  };
}

/** Feed one mascot to full, spending one snack. No-op if out of snacks. */
export function feed(s: PetState, id: MascotId, now: number): PetState {
  if (s.snacks < 1) return s;
  return { ...s, snacks: s.snacks - 1, pets: { ...s.pets, [id]: now } };
}

/** Feed mascots hungriest-first, one snack each, until snacks run out. */
export function feedAll(s: PetState, now: number): PetState {
  const order = [...PET_IDS].sort((a, b) => s.pets[a] - s.pets[b]); // oldest fed first
  let snacks = s.snacks;
  const pets = { ...s.pets };
  for (const id of order) {
    if (snacks < 1) break;
    snacks -= 1;
    pets[id] = now;
  }
  return { ...s, snacks, pets };
}
