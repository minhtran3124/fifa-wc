import type { Confederation } from "./types";

export interface TeamMeta {
  code: string;
  flag: string;
  confederation: Confederation;
  fifaRank: number;
}

/**
 * Metadata for the 48 teams of the real 2026 World Cup draw.
 * Keys are the exact team names used in data/fixtures.json (TheStatsAPI).
 * FIFA ranks are approximate and used for display + standings tiebreakers.
 */
export const TEAM_META: Record<string, TeamMeta> = {
  "Argentina": { code: "ARG", flag: "🇦🇷", confederation: "CONMEBOL", fifaRank: 1 },
  "Spain": { code: "ESP", flag: "🇪🇸", confederation: "UEFA", fifaRank: 2 },
  "France": { code: "FRA", flag: "🇫🇷", confederation: "UEFA", fifaRank: 3 },
  "England": { code: "ENG", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", confederation: "UEFA", fifaRank: 4 },
  "Brazil": { code: "BRA", flag: "🇧🇷", confederation: "CONMEBOL", fifaRank: 5 },
  "Portugal": { code: "POR", flag: "🇵🇹", confederation: "UEFA", fifaRank: 6 },
  "Netherlands": { code: "NED", flag: "🇳🇱", confederation: "UEFA", fifaRank: 7 },
  "Belgium": { code: "BEL", flag: "🇧🇪", confederation: "UEFA", fifaRank: 8 },
  "Germany": { code: "GER", flag: "🇩🇪", confederation: "UEFA", fifaRank: 9 },
  "Croatia": { code: "CRO", flag: "🇭🇷", confederation: "UEFA", fifaRank: 10 },
  "Morocco": { code: "MAR", flag: "🇲🇦", confederation: "CAF", fifaRank: 12 },
  "Colombia": { code: "COL", flag: "🇨🇴", confederation: "CONMEBOL", fifaRank: 13 },
  "Mexico": { code: "MEX", flag: "🇲🇽", confederation: "CONCACAF", fifaRank: 14 },
  "Uruguay": { code: "URU", flag: "🇺🇾", confederation: "CONMEBOL", fifaRank: 15 },
  "United States": { code: "USA", flag: "🇺🇸", confederation: "CONCACAF", fifaRank: 16 },
  "Senegal": { code: "SEN", flag: "🇸🇳", confederation: "CAF", fifaRank: 17 },
  "Japan": { code: "JPN", flag: "🇯🇵", confederation: "AFC", fifaRank: 18 },
  "Switzerland": { code: "SUI", flag: "🇨🇭", confederation: "UEFA", fifaRank: 19 },
  "IR Iran": { code: "IRN", flag: "🇮🇷", confederation: "AFC", fifaRank: 20 },
  "Austria": { code: "AUT", flag: "🇦🇹", confederation: "UEFA", fifaRank: 22 },
  "Korea Republic": { code: "KOR", flag: "🇰🇷", confederation: "AFC", fifaRank: 23 },
  "Australia": { code: "AUS", flag: "🇦🇺", confederation: "AFC", fifaRank: 24 },
  "Sweden": { code: "SWE", flag: "🇸🇪", confederation: "UEFA", fifaRank: 25 },
  "Ecuador": { code: "ECU", flag: "🇪🇨", confederation: "CONMEBOL", fifaRank: 26 },
  "Norway": { code: "NOR", flag: "🇳🇴", confederation: "UEFA", fifaRank: 28 },
  "Turkiye": { code: "TUR", flag: "🇹🇷", confederation: "UEFA", fifaRank: 27 },
  "Panama": { code: "PAN", flag: "🇵🇦", confederation: "CONCACAF", fifaRank: 30 },
  "Canada": { code: "CAN", flag: "🇨🇦", confederation: "CONCACAF", fifaRank: 31 },
  "Egypt": { code: "EGY", flag: "🇪🇬", confederation: "CAF", fifaRank: 32 },
  "Scotland": { code: "SCO", flag: "🏴󠁧󠁢󠁳󠁣󠁴󠁿", confederation: "UEFA", fifaRank: 33 },
  "Czechia": { code: "CZE", flag: "🇨🇿", confederation: "UEFA", fifaRank: 36 },
  "Paraguay": { code: "PAR", flag: "🇵🇾", confederation: "CONMEBOL", fifaRank: 39 },
  "Cote d'Ivoire": { code: "CIV", flag: "🇨🇮", confederation: "CAF", fifaRank: 40 },
  "Tunisia": { code: "TUN", flag: "🇹🇳", confederation: "CAF", fifaRank: 41 },
  "Algeria": { code: "ALG", flag: "🇩🇿", confederation: "CAF", fifaRank: 43 },
  "South Africa": { code: "RSA", flag: "🇿🇦", confederation: "CAF", fifaRank: 56 },
  "Uzbekistan": { code: "UZB", flag: "🇺🇿", confederation: "AFC", fifaRank: 57 },
  "Iraq": { code: "IRQ", flag: "🇮🇶", confederation: "AFC", fifaRank: 58 },
  "Saudi Arabia": { code: "KSA", flag: "🇸🇦", confederation: "AFC", fifaRank: 59 },
  "Congo DR": { code: "COD", flag: "🇨🇩", confederation: "CAF", fifaRank: 60 },
  "Qatar": { code: "QAT", flag: "🇶🇦", confederation: "AFC", fifaRank: 51 },
  "Jordan": { code: "JOR", flag: "🇯🇴", confederation: "AFC", fifaRank: 62 },
  "Cabo Verde": { code: "CPV", flag: "🇨🇻", confederation: "CAF", fifaRank: 70 },
  "Ghana": { code: "GHA", flag: "🇬🇭", confederation: "CAF", fifaRank: 73 },
  "Bosnia and Herzegovina": { code: "BIH", flag: "🇧🇦", confederation: "UEFA", fifaRank: 74 },
  "Haiti": { code: "HAI", flag: "🇭🇹", confederation: "CONCACAF", fifaRank: 83 },
  "New Zealand": { code: "NZL", flag: "🇳🇿", confederation: "OFC", fifaRank: 89 },
  "Curacao": { code: "CUW", flag: "🇨🇼", confederation: "CONCACAF", fifaRank: 90 },
};

const HOST_COUNTRY: Record<string, "USA" | "Canada" | "Mexico"> = {
  "mexico-city": "Mexico",
  "guadalajara": "Mexico",
  "monterrey": "Mexico",
  "toronto": "Canada",
  "vancouver": "Canada",
};

export function cityCountry(slug: string): "USA" | "Canada" | "Mexico" {
  return HOST_COUNTRY[slug] ?? "USA";
}

export function cityName(slug: string): string {
  const overrides: Record<string, string> = {
    "new-york": "New York / New Jersey",
    "san-francisco": "San Francisco Bay Area",
    "los-angeles": "Los Angeles",
    "kansas-city": "Kansas City",
    "mexico-city": "Mexico City",
  };
  return (
    overrides[slug] ??
    slug.split("-").map((w) => w[0].toUpperCase() + w.slice(1)).join(" ")
  );
}

/** Stable team id derived from the FIFA code (falls back to a slug of the name). */
export function teamId(name: string): string {
  const meta = TEAM_META[name];
  if (meta) return meta.code.toLowerCase();
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}
