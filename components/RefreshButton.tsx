"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { refreshWcData } from "@/app/actions";

export default function RefreshButton({
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
        second: "2-digit",
        timeZone: "Asia/Ho_Chi_Minh",
        hour12: true,
      }) + " GMT+7"
    : null;

  function handleRefresh() {
    // Bust the cached WC data (revalidateTag "wc"), then re-render so the
    // server re-fetches fresh scores. Cached data otherwise lives ~15 min.
    startTransition(async () => {
      await refreshWcData();
      router.refresh();
    });
  }

  const loading = isPending;

  return (
    <div className="flex flex-wrap items-center gap-2 sm:gap-3">
      {source && (
        <span
          className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold ${
            source === "live"
              ? "border-emerald-400/40 bg-emerald-400/10 text-emerald-300"
              : "border-amber-400/40 bg-amber-400/10 text-amber-200"
          }`}
        >
          <span
            className={`h-1.5 w-1.5 rounded-full ${
              source === "live" ? "bg-emerald-400" : "bg-amber-400"
            }`}
          />
          {source === "live" ? "Live source" : "Bundled"}
        </span>
      )}
      {updated && (
        <span className="hidden text-xs text-white/40 sm:inline">Updated {updated}</span>
      )}
      <button
        onClick={handleRefresh}
        disabled={loading}
        className="group inline-flex items-center gap-2 rounded-full bg-gold px-4 py-1.5 text-sm font-bold text-ink transition-transform hover:scale-[1.03] disabled:opacity-70"
      >
        <span
          className={`inline-block text-base leading-none ${
            loading ? "animate-ball-spin" : "transition-transform duration-500 group-hover:rotate-[360deg]"
          }`}
        >
          ⚽
        </span>
        {loading ? "Refreshing…" : "Refresh"}
      </button>
    </div>
  );
}
