import teamPhotos from "@/data/teamPhotos.json";

const MAP = teamPhotos as Record<string, string>;

/**
 * Curated squad/lineup photo for a team — the real "team photo" can't be pulled
 * from any open API (FIFA only exposes flags), so these are hand-collected from
 * various sources and keyed by our lowercase team code in data/teamPhotos.json.
 * The value is a full image URL or a /public path; returns null when a team has
 * no photo yet so the team hero falls back to its flag/crest.
 */
export function teamPhotoUrl(teamId: string): string | null {
  const v = MAP[teamId];
  return v && v.length > 0 ? v : null;
}
