import Link from "next/link";
import { VENUES, getTeam } from "@/lib/teams";
import { ALL_MATCHES } from "@/lib/matches";
import { getWcData } from "@/lib/footballData";
import { fmtDate } from "@/lib/format";
import { getDictionary } from "@/lib/dictionaries";
import type { Locale } from "@/lib/i18n";
import AlbumRefresh from "@/components/AlbumRefresh";
import VenueMap, { type VenueNode, type VenueMatch } from "@/components/VenueMap";

/* Host-city coordinates (lat, lng) — the 2026 schedule's 16 venues. */
const COORDS: Record<string, [number, number]> = {
  vancouver: [49.28, -123.12],
  seattle: [47.61, -122.33],
  "san-francisco": [37.4, -121.97],
  "los-angeles": [33.95, -118.34],
  "kansas-city": [39.1, -94.58],
  dallas: [32.75, -97.09],
  houston: [29.76, -95.37],
  atlanta: [33.75, -84.39],
  miami: [25.96, -80.24],
  "new-york": [40.81, -74.07],
  philadelphia: [39.95, -75.17],
  boston: [42.09, -71.26],
  toronto: [43.65, -79.38],
  "mexico-city": [19.43, -99.13],
  guadalajara: [20.67, -103.35],
  monterrey: [25.67, -100.31],
};

export default async function VenuesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const l = locale as Locale;
  const dict = getDictionary(l);
  // The live feed drops venue ids, so group fixtures from the bundled schedule
  // (always carries venueId); getWcData stays only for the refresh widget meta.
  const { source, fetchedAt } = await getWcData();
  const matches = ALL_MATCHES;

  const disp = (code: string, name?: string) => {
    const t = getTeam(code);
    return t ? { flag: t.flag, name: t.name } : { flag: "", name: name ?? code };
  };

  const venues: VenueNode[] = VENUES.map((v) => {
    const coord = COORDS[v.id];
    const vm: VenueMatch[] = matches
      .filter((m) => m.venueId === v.id)
      .sort((a, b) => a.date.localeCompare(b.date))
      .map((m) => ({
        id: m.id,
        stageLabel: dict.stage[m.stage],
        dateLabel: fmtDate(m.date, l),
        home: disp(m.home, m.homeName),
        away: disp(m.away, m.awayName),
        homeScore: m.homeScore ?? null,
        awayScore: m.awayScore ?? null,
        scored: m.homeScore != null && m.awayScore != null,
        live: m.status === "live",
      }));
    return {
      id: v.id,
      city: v.city,
      country: v.country,
      stadium: v.stadium,
      lat: coord ? coord[0] : 0,
      lng: coord ? coord[1] : 0,
      matches: vm,
    };
  }).filter((v) => v.lat !== 0);

  return (
    <>
      <div className="al-page-head">
        <div>
          <Link href={`/${l}`} className="al-back">
            {dict.common.back}
          </Link>
          <h1 className="al-page-title">{dict.venues.title}</h1>
          <p className="al-page-sub">{dict.venues.sub}</p>
        </div>
        <AlbumRefresh source={source} fetchedAt={fetchedAt} locale={l} dict={dict} />
      </div>

      <VenueMap venues={venues} locale={l} dict={dict} />
    </>
  );
}
