import Link from "next/link";
import { getWcData } from "@/lib/footballData";
import { matchesByDay } from "@/lib/matches";
import { getDictionary } from "@/lib/dictionaries";
import type { Locale } from "@/lib/i18n";
import AlbumSchedule from "@/components/AlbumSchedule";
import AlbumRefresh from "@/components/AlbumRefresh";

export default async function AlbumMatches({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const l = locale as Locale;
  const dict = getDictionary(l);
  const { matches, source, fetchedAt } = await getWcData();
  const days = matchesByDay(matches);

  return (
    <>
      <div className="al-page-head">
        <div>
          <Link href={`/${l}`} className="al-back">{dict.common.back}</Link>
          <h1 className="al-page-title">{dict.matches.title}</h1>
          <p className="al-page-sub">{dict.matches.sub}</p>
        </div>
        <AlbumRefresh source={source} fetchedAt={fetchedAt} locale={l} dict={dict} />
      </div>

      <AlbumSchedule days={days} locale={l} dict={dict} />
    </>
  );
}
