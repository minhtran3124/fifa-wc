import type { Confederation } from "./types";

export interface TeamMeta {
  code: string;
  flag: string;
  confederation: Confederation;
  fifaRank: number;
  coach: string; // current senior men's national team head coach
}

/**
 * Metadata for the 48 teams of the real 2026 World Cup draw.
 * Keys are the exact team names used in data/fixtures.json (TheStatsAPI).
 * FIFA ranks are approximate and used for display + standings tiebreakers.
 */
export const TEAM_META: Record<string, TeamMeta> = {
  "Argentina": { code: "ARG", flag: "🇦🇷", confederation: "CONMEBOL", fifaRank: 1, coach: "Lionel Scaloni" },
  "Spain": { code: "ESP", flag: "🇪🇸", confederation: "UEFA", fifaRank: 2, coach: "Luis de la Fuente" },
  "France": { code: "FRA", flag: "🇫🇷", confederation: "UEFA", fifaRank: 3, coach: "Didier Deschamps" },
  "England": { code: "ENG", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", confederation: "UEFA", fifaRank: 4, coach: "Thomas Tuchel" },
  "Brazil": { code: "BRA", flag: "🇧🇷", confederation: "CONMEBOL", fifaRank: 5, coach: "Carlo Ancelotti" },
  "Portugal": { code: "POR", flag: "🇵🇹", confederation: "UEFA", fifaRank: 6, coach: "Roberto Martínez" },
  "Netherlands": { code: "NED", flag: "🇳🇱", confederation: "UEFA", fifaRank: 7, coach: "Ronald Koeman" },
  "Belgium": { code: "BEL", flag: "🇧🇪", confederation: "UEFA", fifaRank: 8, coach: "Rudi Garcia" },
  "Germany": { code: "GER", flag: "🇩🇪", confederation: "UEFA", fifaRank: 9, coach: "Julian Nagelsmann" },
  "Croatia": { code: "CRO", flag: "🇭🇷", confederation: "UEFA", fifaRank: 10, coach: "Zlatko Dalić" },
  "Morocco": { code: "MAR", flag: "🇲🇦", confederation: "CAF", fifaRank: 12, coach: "Mohamed Ouahbi" },
  "Colombia": { code: "COL", flag: "🇨🇴", confederation: "CONMEBOL", fifaRank: 13, coach: "Néstor Lorenzo" },
  "Mexico": { code: "MEX", flag: "🇲🇽", confederation: "CONCACAF", fifaRank: 14, coach: "Javier Aguirre" },
  "Uruguay": { code: "URU", flag: "🇺🇾", confederation: "CONMEBOL", fifaRank: 15, coach: "Marcelo Bielsa" },
  "United States": { code: "USA", flag: "🇺🇸", confederation: "CONCACAF", fifaRank: 16, coach: "Mauricio Pochettino" },
  "Senegal": { code: "SEN", flag: "🇸🇳", confederation: "CAF", fifaRank: 17, coach: "Pape Thiaw" },
  "Japan": { code: "JPN", flag: "🇯🇵", confederation: "AFC", fifaRank: 18, coach: "Hajime Moriyasu" },
  "Switzerland": { code: "SUI", flag: "🇨🇭", confederation: "UEFA", fifaRank: 19, coach: "Murat Yakin" },
  "IR Iran": { code: "IRN", flag: "🇮🇷", confederation: "AFC", fifaRank: 20, coach: "Amir Ghalenoei" },
  "Austria": { code: "AUT", flag: "🇦🇹", confederation: "UEFA", fifaRank: 22, coach: "Ralf Rangnick" },
  "Korea Republic": { code: "KOR", flag: "🇰🇷", confederation: "AFC", fifaRank: 23, coach: "Hong Myung-bo" },
  "Australia": { code: "AUS", flag: "🇦🇺", confederation: "AFC", fifaRank: 24, coach: "Tony Popovic" },
  "Sweden": { code: "SWE", flag: "🇸🇪", confederation: "UEFA", fifaRank: 25, coach: "Graham Potter" },
  "Ecuador": { code: "ECU", flag: "🇪🇨", confederation: "CONMEBOL", fifaRank: 26, coach: "Sebastián Beccacece" },
  "Norway": { code: "NOR", flag: "🇳🇴", confederation: "UEFA", fifaRank: 28, coach: "Ståle Solbakken" },
  "Turkiye": { code: "TUR", flag: "🇹🇷", confederation: "UEFA", fifaRank: 27, coach: "Vincenzo Montella" },
  "Panama": { code: "PAN", flag: "🇵🇦", confederation: "CONCACAF", fifaRank: 30, coach: "Thomas Christiansen" },
  "Canada": { code: "CAN", flag: "🇨🇦", confederation: "CONCACAF", fifaRank: 31, coach: "Jesse Marsch" },
  "Egypt": { code: "EGY", flag: "🇪🇬", confederation: "CAF", fifaRank: 32, coach: "Hossam Hassan" },
  "Scotland": { code: "SCO", flag: "🏴󠁧󠁢󠁳󠁣󠁴󠁿", confederation: "UEFA", fifaRank: 33, coach: "Steve Clarke" },
  "Czechia": { code: "CZE", flag: "🇨🇿", confederation: "UEFA", fifaRank: 36, coach: "Miroslav Koubek" },
  "Paraguay": { code: "PAR", flag: "🇵🇾", confederation: "CONMEBOL", fifaRank: 39, coach: "Gustavo Alfaro" },
  "Cote d'Ivoire": { code: "CIV", flag: "🇨🇮", confederation: "CAF", fifaRank: 40, coach: "Emerse Faé" },
  "Tunisia": { code: "TUN", flag: "🇹🇳", confederation: "CAF", fifaRank: 41, coach: "Mondher Kebaier" },
  "Algeria": { code: "ALG", flag: "🇩🇿", confederation: "CAF", fifaRank: 43, coach: "Vladimir Petković" },
  "South Africa": { code: "RSA", flag: "🇿🇦", confederation: "CAF", fifaRank: 56, coach: "Hugo Broos" },
  "Uzbekistan": { code: "UZB", flag: "🇺🇿", confederation: "AFC", fifaRank: 57, coach: "Fabio Cannavaro" },
  "Iraq": { code: "IRQ", flag: "🇮🇶", confederation: "AFC", fifaRank: 58, coach: "Graham Arnold" },
  "Saudi Arabia": { code: "KSA", flag: "🇸🇦", confederation: "AFC", fifaRank: 59, coach: "Georgios Donis" },
  "Congo DR": { code: "COD", flag: "🇨🇩", confederation: "CAF", fifaRank: 60, coach: "Sébastien Desabre" },
  "Qatar": { code: "QAT", flag: "🇶🇦", confederation: "AFC", fifaRank: 51, coach: "Julen Lopetegui" },
  "Jordan": { code: "JOR", flag: "🇯🇴", confederation: "AFC", fifaRank: 62, coach: "Jamal Sellami" },
  "Cabo Verde": { code: "CPV", flag: "🇨🇻", confederation: "CAF", fifaRank: 70, coach: "Pedro Leitão Brito" },
  "Ghana": { code: "GHA", flag: "🇬🇭", confederation: "CAF", fifaRank: 73, coach: "Carlos Queiroz" },
  "Bosnia and Herzegovina": { code: "BIH", flag: "🇧🇦", confederation: "UEFA", fifaRank: 74, coach: "Sergej Barbarez" },
  "Haiti": { code: "HAI", flag: "🇭🇹", confederation: "CONCACAF", fifaRank: 83, coach: "Sébastien Migné" },
  "New Zealand": { code: "NZL", flag: "🇳🇿", confederation: "OFC", fifaRank: 89, coach: "Darren Bazeley" },
  "Curacao": { code: "CUW", flag: "🇨🇼", confederation: "CONCACAF", fifaRank: 90, coach: "Dick Advocaat" },
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
