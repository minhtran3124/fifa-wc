/**
 * Official FIFA World Cup 2026 mascots — the trio unveiled on 25 Sep 2025,
 * one per host nation. Source: fifa.com/.../canadamexicousa2026/mascots.
 * Emoji stand-ins are used in place of the (copyrighted) official artwork.
 */
export interface Mascot {
  name: string;
  animal: string;
  emoji: string;
  flag: string;
  country: string;
  teamId: string;
  role: string;
  blurb: string;
  /** host-nation accent colour, used for the card glow/highlight */
  accent: string;
}

export const MASCOTS: Mascot[] = [
  {
    name: "Maple",
    animal: "The Moose",
    emoji: "🫎",
    flag: "🇨🇦",
    country: "Canada",
    teamId: "can",
    role: "Goalkeeper",
    blurb:
      "A street-style artist and music lover who guards the net with creativity, resilience and unapologetic individuality.",
    accent: "#ef4444",
  },
  {
    name: "Zayu",
    animal: "The Jaguar",
    emoji: "🐆",
    flag: "🇲🇽",
    country: "Mexico",
    teamId: "mex",
    role: "Striker",
    blurb:
      "A daring striker of exceptional agility — a symbol of cultural celebration carrying the heart of Mexico with pride.",
    accent: "#22c55e",
  },
  {
    name: "Clutch",
    animal: "The Bald Eagle",
    emoji: "🦅",
    flag: "🇺🇸",
    country: "United States",
    teamId: "usa",
    role: "Midfielder",
    blurb:
      "A social spark and sports fanatic who, like every great midfielder, unites people wherever the game takes them.",
    accent: "#3b82f6",
  },
];
