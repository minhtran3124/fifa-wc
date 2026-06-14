import type { Metadata } from "next";
import Link from "next/link";
import { getWcData } from "@/lib/footballData";
import { matchesByDay } from "@/lib/matches";
import AlbumSchedule from "../AlbumSchedule";
import AlbumRefresh from "../AlbumRefresh";

export const metadata: Metadata = { title: "Matches" };

export const dynamic = "force-dynamic";

export default async function AlbumMatches() {
  const { matches, source, fetchedAt } = await getWcData();
  const days = matchesByDay(matches);

  return (
    <>
      <div className="al-page-head">
        <div>
          <Link href="/v2" className="al-back">← Album home</Link>
          <h1 className="al-page-title">All Matches</h1>
          <p className="al-page-sub">
            All 104 fixtures grouped by day. Filter by stage or status — every result is
            a sticker waiting for the book.
          </p>
        </div>
        <AlbumRefresh source={source} fetchedAt={fetchedAt} />
      </div>

      <AlbumSchedule days={days} />
    </>
  );
}
