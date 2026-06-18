/**
 * Official national-team flag from FIFA's public API (no key needed). FIFA keys
 * its team pictures by the 3-letter association code — the same codes we use in
 * lib/teamMeta.ts — so our lowercase team id uppercases straight to it (no id
 * mapping). `flags-sq-5` is the highest-res variant (≈500px). All 48 WC teams
 * are covered; kept returning string for a defensive flag-emoji fallback path.
 */
export function crestUrl(teamId: string): string | null {
  const code = teamId.trim().toUpperCase();
  if (!/^[A-Z]{3}$/.test(code)) return null;
  return `https://api.fifa.com/api/v3/picture/flags-sq-5/${code}`;
}
