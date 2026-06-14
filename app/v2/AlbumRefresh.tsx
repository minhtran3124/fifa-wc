"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";

/** Album-styled refresh control for the v2 pages. Mirrors the classic
 *  RefreshButton: pages are force-dynamic + no-store, so router.refresh
 *  re-runs the server fetch and pulls the latest scores. Source badge and
 *  "updated" stamp render only when the page passes that data in. */
export default function AlbumRefresh({
  fetchedAt,
  source,
}: {
  fetchedAt?: string;
  source?: "live" | "bundled";
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const updated = fetchedAt
    ? new Date(fetchedAt).toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        timeZone: "Asia/Ho_Chi_Minh",
        hour12: true,
      }) + " GMT+7"
    : null;

  return (
    <div className="al-refresh-wrap">
      {source && (
        <span className={`al-src ${source}`}>
          <span className="dot" />
          {source === "live" ? "Live source" : "Bundled"}
        </span>
      )}
      {updated && <span className="al-updated">Updated {updated}</span>}
      <button
        type="button"
        onClick={() => startTransition(() => router.refresh())}
        disabled={isPending}
        className="al-refresh"
      >
        <span className={isPending ? "spin" : ""} aria-hidden>
          ⚽
        </span>
        {isPending ? "Refreshing…" : "Refresh"}
      </button>
    </div>
  );
}
