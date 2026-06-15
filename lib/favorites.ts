// Followed teams, persisted client-side in localStorage. No server/data cost.
const KEY = "wc-fav-teams";
export const FAV_EVENT = "wc-fav-change";

export function getFavorites(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const v = JSON.parse(localStorage.getItem(KEY) || "[]");
    return Array.isArray(v) ? v : [];
  } catch {
    return [];
  }
}

export function isFavorite(id: string): boolean {
  return getFavorites().includes(id);
}

/** Toggle a team; returns the new favorited state and notifies listeners. */
export function toggleFavorite(id: string): boolean {
  const cur = getFavorites();
  const has = cur.includes(id);
  const next = has ? cur.filter((x) => x !== id) : [...cur, id];
  localStorage.setItem(KEY, JSON.stringify(next));
  window.dispatchEvent(new Event(FAV_EVENT));
  return !has;
}
