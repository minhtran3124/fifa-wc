// Each team's "mascot" — an emoji derived from the side's common/official
// nickname (animals preferred; a fitting symbol otherwise). Flags are shown
// separately on the team page, so flags are never used here.
// Keys are the exact team names used in lib/teamMeta.ts (TheStatsAPI names).

export interface TeamMascot {
  emoji: string;
  nick: string;
}

export const TEAM_MASCOTS: Record<string, TeamMascot> = {
  "Argentina": { emoji: "⭐", nick: "La Albiceleste" },
  "Spain": { emoji: "🐂", nick: "La Roja" },
  "France": { emoji: "🐓", nick: "Les Bleus" },
  "England": { emoji: "🦁", nick: "Three Lions" },
  "Brazil": { emoji: "🐤", nick: "Canarinho" },
  "Portugal": { emoji: "🛡️", nick: "Seleção das Quinas" },
  "Netherlands": { emoji: "🟠", nick: "Oranje" },
  "Belgium": { emoji: "😈", nick: "Red Devils" },
  "Germany": { emoji: "🦅", nick: "Die Mannschaft" },
  "Croatia": { emoji: "🔥", nick: "Vatreni" },
  "Morocco": { emoji: "🦁", nick: "Atlas Lions" },
  "Colombia": { emoji: "☕", nick: "Los Cafeteros" },
  "Mexico": { emoji: "🦅", nick: "El Tri" },
  "Uruguay": { emoji: "🩵", nick: "La Celeste" },
  "United States": { emoji: "⭐", nick: "Stars and Stripes" },
  "Senegal": { emoji: "🦁", nick: "Lions de la Téranga" },
  "Japan": { emoji: "⚔️", nick: "Samurai Blue" },
  "Switzerland": { emoji: "➕", nick: "Nati" },
  "IR Iran": { emoji: "🌷", nick: "Team Melli" },
  "Austria": { emoji: "🦅", nick: "Das Team" },
  "Korea Republic": { emoji: "🔴", nick: "Taegeuk Warriors" },
  "Australia": { emoji: "🦘", nick: "Socceroos" },
  "Sweden": { emoji: "💛", nick: "Blågult" },
  "Ecuador": { emoji: "🌈", nick: "La Tri" },
  "Norway": { emoji: "🦁", nick: "Løvene" },
  "Turkiye": { emoji: "🌙", nick: "Ay-Yıldızlılar" },
  "Panama": { emoji: "⚓", nick: "Los Canaleros" },
  "Canada": { emoji: "🍁", nick: "Les Rouges" },
  "Egypt": { emoji: "🏛️", nick: "The Pharaohs" },
  "Scotland": { emoji: "🦁", nick: "Lion Rampant" },
  "Czechia": { emoji: "🔴", nick: "Repre" },
  "Paraguay": { emoji: "❤️", nick: "La Albirroja" },
  "Cote d'Ivoire": { emoji: "🐘", nick: "Les Éléphants" },
  "Tunisia": { emoji: "🦅", nick: "Eagles of Carthage" },
  "Algeria": { emoji: "🦊", nick: "Les Fennecs" },
  "South Africa": { emoji: "🙌", nick: "Bafana Bafana" },
  "Uzbekistan": { emoji: "🐺", nick: "White Wolves" },
  "Iraq": { emoji: "🦁", nick: "Lions of Mesopotamia" },
  "Saudi Arabia": { emoji: "🦅", nick: "Green Falcons" },
  "Congo DR": { emoji: "🐆", nick: "Les Léopards" },
  "Qatar": { emoji: "🟥", nick: "Al-Annabi" },
  "Jordan": { emoji: "🗡️", nick: "Al-Nashama" },
  "Cabo Verde": { emoji: "🦈", nick: "Tubarões Azuis" },
  "Ghana": { emoji: "⭐", nick: "Black Stars" },
  "Bosnia and Herzegovina": { emoji: "🐉", nick: "Zmajevi" },
  "Haiti": { emoji: "💂", nick: "Les Grenadiers" },
  "New Zealand": { emoji: "🥝", nick: "All Whites" },
  "Curacao": { emoji: "🌊", nick: "Blue Wave" },
};

export function teamMascot(name: string): TeamMascot | undefined {
  return TEAM_MASCOTS[name];
}
