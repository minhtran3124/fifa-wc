import highlightsMap from "@/data/highlights.json";

/**
 * Match highlights come from VTV Thể Thao — the official Vietnamese rights-holder
 * for the 2026 World Cup. We embed their YouTube uploads inline (no redirect).
 *
 * YouTube can't embed a search, only a specific video, so per-match video ids are
 * curated in data/highlights.json (keyed by `<homeCode>-<awayCode>-<YYYY-MM-DD>`).
 * A match without a curated id falls back to a VTV Thể Thao channel search link.
 */

const MAP = highlightsMap as Record<string, string>;

/** Official VTV Thể Thao YouTube channel (used for the search fallback). */
const VTV_CHANNEL_ID = "UCrI4iNMPZ2vT_G-TqRO6yrw";

/** Curated VTV highlight video id for a match, or null if none is mapped yet. */
export function highlightVideoId(home: string, away: string, dateIso: string): string | null {
  return MAP[`${home}-${away}-${dateIso.slice(0, 10)}`] ?? null;
}

/** Fallback: search the official VTV Thể Thao channel for a match's highlight. */
export function vtvSearchUrl(home: string, away: string): string {
  const q = `${home} vs ${away} highlights FIFA World Cup 2026`;
  return `https://www.youtube.com/channel/${VTV_CHANNEL_ID}/search?query=${encodeURIComponent(q)}`;
}
