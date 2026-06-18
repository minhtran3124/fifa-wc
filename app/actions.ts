"use server";

import { revalidateTag } from "next/cache";

/** Bust the cached World Cup data so the next render fetches fresh from the
 *  upstream API. Invoked by the Refresh button on every page. */
export async function refreshWcData() {
  revalidateTag("wc");
}

/** Bust the cached ESPN post-match stats (team stats, cards, line-ups) so the
 *  next render re-fetches them. Invoked by the "Fetch latest stats" button on
 *  the match detail page (the cache otherwise lives for 1 day). */
export async function refreshMatchStats() {
  revalidateTag("espn-stats");
}
