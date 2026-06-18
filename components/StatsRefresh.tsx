"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { refreshMatchStats } from "@/app/actions";

/** Button that fetches the latest post-match stats from ESPN on demand. Busts
 *  the cached "espn-stats" data (revalidateTag) via a server action, then
 *  re-renders. The stats are otherwise cached for 1 day. */
export default function StatsRefresh({ label, busyLabel }: { label: string; busyLabel: string }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  return (
    <button
      type="button"
      className="al-refresh"
      disabled={isPending}
      onClick={() =>
        startTransition(async () => {
          await refreshMatchStats();
          router.refresh();
        })
      }
    >
      <span className={isPending ? "spin" : ""} aria-hidden>
        ⟳
      </span>
      {isPending ? busyLabel : label}
    </button>
  );
}
