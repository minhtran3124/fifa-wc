import Link from "next/link";
import { getWcData } from "@/lib/footballData";
import { getDictionary } from "@/lib/dictionaries";
import type { Locale } from "@/lib/i18n";
import AlbumRefresh from "@/components/AlbumRefresh";
import PetCorner from "@/components/PetCorner";
import TriviaCard from "@/components/TriviaCard";

export default async function PetsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const l = locale as Locale;
  const dict = getDictionary(l);
  const { matches, source, fetchedAt } = await getWcData();

  // teams that have played at least one finished match — each earns a snack
  const playedIds = new Set<string>();
  for (const m of matches) {
    if (m.status === "finished") {
      playedIds.add(m.home);
      playedIds.add(m.away);
    }
  }

  return (
    <>
      <div className="al-page-head">
        <div>
          <Link href={`/${l}`} className="al-back">{dict.common.back}</Link>
          <h1 className="al-page-title">{dict.pet.title}</h1>
          <p className="al-page-sub">{dict.pet.sub}</p>
        </div>
        <AlbumRefresh source={source} fetchedAt={fetchedAt} locale={l} dict={dict} />
      </div>

      <TriviaCard locale={l} dict={dict} />

      <PetCorner locale={l} dict={dict} playedTeamIds={[...playedIds]} />
    </>
  );
}
