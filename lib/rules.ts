/**
 * New / trialed Laws of the Game at the 2026 FIFA World Cup. These are IFAB
 * 2025/26 changes being applied or expanded at the tournament. Sourced from
 * IFAB announcements and reporting (Al Jazeera, Sky Sports, June 2026).
 */
export interface RuleChange {
  emoji: string;
  title: string;
  desc: string;
  tag: "VAR" | "Time-wasting" | "Player conduct" | "Player welfare";
}

export const RULE_CHANGES: RuleChange[] = [
  {
    emoji: "🧤",
    title: "8-second goalkeeper limit",
    desc: "Keepers may hold the ball for a maximum of 8 seconds — the referee shows a visual 5-second countdown — and holding on longer now concedes a corner to the opposition instead of an indirect free kick.",
    tag: "Time-wasting",
  },
  {
    emoji: "⏱️",
    title: "5-second restart countdown",
    desc: "Referees raise a hand and count down five seconds on throw-ins and goal kicks; failing to restart in time hands possession to the opponents.",
    tag: "Time-wasting",
  },
  {
    emoji: "🔁",
    title: "10-second substitutions",
    desc: "A substituted player must leave the pitch within 10 seconds of the board going up; dawdling delays their replacement coming on.",
    tag: "Time-wasting",
  },
  {
    emoji: "📺",
    title: "Expanded VAR",
    desc: "VAR can now review second yellow cards, mistaken identity, wrongly awarded corners, and fouls committed in the build-up before a restart.",
    tag: "VAR",
  },
  {
    emoji: "🤕",
    title: "One-minute treatment penalty",
    desc: "An outfield player who receives medical treatment on the pitch must stay off for one minute after play resumes — goalkeepers and serious head injuries are exempt.",
    tag: "Player welfare",
  },
  {
    emoji: "💧",
    title: "Three-minute hydration breaks",
    desc: "Every match now has a three-minute hydration break in each half, taken around the 22nd minute.",
    tag: "Player welfare",
  },
  {
    emoji: "🤫",
    title: "Mouth-covering offence",
    desc: "Covering the mouth during a confrontation can earn a red card — aimed at curbing hidden discriminatory or abusive remarks. Ordinary, friendly communication is exempt.",
    tag: "Player conduct",
  },
  {
    emoji: "🚪",
    title: "Leaving the pitch in protest",
    desc: "Walking off the field to protest a referee's decision earns a red card, and a team that causes a match to be abandoned forfeits it.",
    tag: "Player conduct",
  },
];
