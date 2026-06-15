/**
 * FIFA posts free, official match highlights to its YouTube channel. We can't
 * hardcode per-match video IDs ahead of kickoff, so a search URL pre-filled with
 * the matchup always resolves to the right clip once it's uploaded — and never
 * needs maintenance. FIFA's official uploads rank at the top for these queries.
 */
export function highlightsSearchUrl(home: string, away: string): string {
  const q = `${home} vs ${away} FIFA World Cup 2026 highlights`;
  return `https://www.youtube.com/results?search_query=${encodeURIComponent(q)}`;
}
