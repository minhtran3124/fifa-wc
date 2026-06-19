import Link from "next/link";
import { getWcData } from "@/lib/footballData";
import { previewForMatch } from "@/lib/previews";
import { getVenue, getTeam } from "@/lib/teams";
import { crestUrl } from "@/lib/crests";
import { getDictionary, type Dictionary } from "@/lib/dictionaries";
import { fmtDate, fmtTime } from "@/lib/format";
import type { Locale } from "@/lib/i18n";
import type { Match } from "@/lib/types";
import { side } from "@/components/MatchSticker";

/** How many upcoming fixtures to preview on the page. */
const PREVIEW_COUNT = 3;

/**
 * A rough win / draw / away projection from the predicted scoreline — a
 * broadcast-style graphic, not a real model (previews are editorial; see the
 * page disclaimer). Deterministic so the bar is stable for a given fixture.
 */
function projection(predHome: number, predAway: number) {
  const diff = predHome - predAway;
  const draw = Math.round(Math.max(15, 30 - Math.abs(diff) * 6));
  const rest = 100 - draw;
  const home = Math.round(rest / (1 + Math.exp(-diff * 0.85)));
  return { home, draw, away: rest - home };
}

/** One fixture's full preview card. `hero` marks the very next match. */
function PreviewArticle({
  match,
  locale: l,
  dict,
  hero,
}: {
  match: Match;
  locale: Locale;
  dict: Dictionary;
  hero: boolean;
}) {
  const preview = previewForMatch(match);
  const home = side(preview.home, match.home === preview.home ? match.homeName : match.awayName);
  const away = side(preview.away, match.away === preview.away ? match.awayName : match.homeName);
  const homeRank = getTeam(preview.home)?.fifaRank;
  const awayRank = getTeam(preview.away)?.fifaRank;
  const homeCrest = crestUrl(preview.home);
  const awayCrest = crestUrl(preview.away);
  const p = projection(preview.predHome, preview.predAway);
  const venue = getVenue(match.venueId);
  const venueText = venue ? `${venue.stadium}, ${venue.city}` : match.venueName ?? "";
  const crestLoad = hero ? "eager" : "lazy";

  return (
    <article className="al-preview">
      <header className="pv-fixture al-reveal">
        {hero ? <span className="pv-stamp">{dict.previews.nextUp}</span> : null}
        <span className="pv-eyebrow">
          {dict.stage[match.stage]}
          {match.group ? ` · ${dict.team.groupLabel} ${match.group}` : ""}
        </span>

        <div className="pv-clash">
          <div className="pv-side">
            <span className="pv-crest">
              <span className="fl" aria-hidden>{home.flag}</span>
              {homeCrest && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={homeCrest} alt="" loading={crestLoad} />
              )}
            </span>
            <span className="nm">{home.name}</span>
            {homeRank ? <span className="rk">#{homeRank}</span> : null}
          </div>

          <div className="pv-pred">
            <span className="sc">{preview.predHome}<i>–</i>{preview.predAway}</span>
            <span className="lbl">{dict.previews.prediction}</span>
          </div>

          <div className="pv-side">
            <span className="pv-crest">
              <span className="fl" aria-hidden>{away.flag}</span>
              {awayCrest && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={awayCrest} alt="" loading={crestLoad} />
              )}
            </span>
            <span className="nm">{away.name}</span>
            {awayRank ? <span className="rk">#{awayRank}</span> : null}
          </div>
        </div>

        <div className="pv-odds">
          <span className="pv-odds-cap">{dict.previews.projection}</span>
          <div
            className="pv-odds-bar"
            role="img"
            aria-label={`${home.name} ${p.home}% · ${dict.previews.draw} ${p.draw}% · ${away.name} ${p.away}%`}
          >
            <span className="seg home" style={{ width: `${p.home}%` }}>{p.home}</span>
            <span className="seg draw" style={{ width: `${p.draw}%` }}>{p.draw}</span>
            <span className="seg away" style={{ width: `${p.away}%` }}>{p.away}</span>
          </div>
          <div className="pv-odds-leg" aria-hidden>
            <span><i className="sw home" />{home.name}</span>
            <span><i className="sw draw" />{dict.previews.draw}</span>
            <span><i className="sw away" />{away.name}</span>
          </div>
        </div>

        <div className="pv-meta">
          <span className="pv-when">{fmtDate(match.date, l)} · {fmtTime(match.date, l)}</span>
          {venueText && <span className="pv-venue">{venueText}</span>}
        </div>
      </header>

      <section className="pv-block al-reveal" style={{ animationDelay: "0.08s" }}>
        <span className="scribble">{dict.previews.verdict}</span>
        <p className="pv-verdict">{preview.verdict[l]}</p>
        <p className="pv-battle">
          <span className="pv-battle-tag">{dict.previews.keyBattle}</span>
          {preview.keyBattle[l]}
        </p>
      </section>

      <section className="pv-press al-reveal" style={{ animationDelay: "0.16s" }}>
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

      <p className="pv-disclaimer al-reveal" style={{ animationDelay: "0.24s" }}>
        {preview.generated ? `${dict.previews.generatedNote} ` : ""}
        {dict.previews.disclaimer}
      </p>
    </article>
  );
}

export default async function AlbumPreviews({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const l = locale as Locale;
  const dict = getDictionary(l);
  const { matches } = await getWcData();

  // The next fixtures to preview: scheduled games first (a pre-match read),
  // topped up with live games only if the calendar runs short.
  const upcoming = [
    ...matches.filter((m) => m.status === "scheduled"),
    ...matches.filter((m) => m.status === "live"),
  ].slice(0, PREVIEW_COUNT);

  return (
    <>
      <div className="al-page-head">
        <div>
          <Link href={`/${l}`} className="al-back">{dict.common.back}</Link>
          <h1 className="al-page-title">{dict.previews.title}</h1>
          <p className="al-page-sub">{dict.previews.sub}</p>
        </div>
      </div>

      {upcoming.length === 0 ? (
        <p className="al-empty">{dict.previews.empty}</p>
      ) : (
        <div className="al-previews">
          {upcoming.map((m, i) => (
            <PreviewArticle key={m.id} match={m} locale={l} dict={dict} hero={i === 0} />
          ))}
        </div>
      )}
    </>
  );
}
