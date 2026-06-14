"use server";

import { revalidateTag } from "next/cache";

/** Bust the cached World Cup data so the next render fetches fresh from the
 *  upstream API. Invoked by the Refresh button on every page. */
export async function refreshWcData() {
  revalidateTag("wc");
}
