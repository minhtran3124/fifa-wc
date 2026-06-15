import Link from "next/link";
import { getWcData } from "@/lib/footballData";
import { previewForMatch } from "@/lib/previews";
import { getVenue } from "@/lib/teams";
import { getDictionary } from "@/lib/dictionaries";
import { fmtDate, fmtTime } from "@/lib/format";
import type { Locale } from "@/lib/i18n";
import { side } from "@/components/MatchSticker";

export default async function AlbumPreviews({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const l = locale as Locale;
  const dict = getDictionary(l);
  const { matches } = await getWcData();

  // The next match to preview: the next scheduled fixture (a pre-match read),
  // falling back to a live game only if nothing is left on the calendar.
  const next =
    matches.find((m) => m.status === "scheduled") ??
    matches.find((m) => m.status === "live");

  return (
    <>
      <div className="al-page-head">
        <div>
          <Link href={`/${l}`} className="al-back">{dict.common.back}</Link>
          <h1 className="al-page-title">{dict.previews.title}</h1>
          <p className="al-page-sub">{dict.previews.sub}</p>
        </div>
      </div>

      {!next ? (
        <p className="al-empty">{dict.previews.empty}</p>
      ) : (
        (() => {
          const preview = previewForMatch(next);
          const home = side(preview.home, next.home === preview.home ? next.homeName : next.awayName);
          const away = side(preview.away, next.away === preview.away ? next.awayName : next.homeName);
          const venue = getVenue(next.venueId);
          const venueText = venue ? `${venue.stadium}, ${venue.city}` : next.venueName ?? "";

          return (
            <article className="al-preview">
              <header className="pv-fixture">
                <span className="pv-eyebrow">
                  {dict.previews.nextUp} · {dict.stage[next.stage]}
                  {next.group ? ` · ${dict.team.groupLabel} ${next.group}` : ""}
                </span>
                <div className="pv-teams">
                  <span className="pv-side">
                    <span className="fl">{home.flag}</span>
                    <span className="nm">{home.name}</span>
                  </span>
                  <span className="pv-pred">
                    <span className="sc">{preview.predHome}<i>–</i>{preview.predAway}</span>
                    <span className="lbl">{dict.previews.prediction}</span>
                  </span>
                  <span className="pv-side">
                    <span className="fl">{away.flag}</span>
                    <span className="nm">{away.name}</span>
                  </span>
                </div>
                <div className="pv-meta">
                  <span>{fmtDate(next.date, l)} · {fmtTime(next.date, l)}</span>
                  {venueText && <span className="pv-venue">{venueText}</span>}
                </div>
              </header>

              <section className="pv-block">
                <span className="scribble">{dict.previews.verdict}</span>
                <p className="pv-verdict">{preview.verdict[l]}</p>
                <p className="pv-battle">
                  <strong>{dict.previews.keyBattle}:</strong> {preview.keyBattle[l]}
                </p>
              </section>

              <section className="pv-block">
                <span className="scribble">{dict.previews.press}</span>
                <div className="pv-takes">
                  {preview.takes.map((t) => (
                    <figure key={t.outlet} className="pv-take">
                      <blockquote>{t.quote[l]}</blockquote>
                      <figcaption>
                        <span className="outlet">{t.outlet}</span>
                        {t.pundit ? <span className="pundit"> · {t.pundit}</span> : null}
                      </figcaption>
                    </figure>
                  ))}
                </div>
              </section>

              <p className="pv-disclaimer">
                {preview.generated ? `${dict.previews.generatedNote} ` : ""}
                {dict.previews.disclaimer}
              </p>
            </article>
          );
        })()
      )}
    </>
  );
}
