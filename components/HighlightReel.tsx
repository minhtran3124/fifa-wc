"use client";

import { useState } from "react";

export interface HighlightRow {
  id: string;
  dt: string;
  homeName: string;
  homeFlag: string;
  awayName: string;
  awayFlag: string;
  homeScore: number;
  awayScore: number;
  /** Curated VTV video id, or null → fall back to the channel search link. */
  videoId: string | null;
  fallbackUrl: string;
}

/**
 * Recent-results list where each row plays its official VTV Thể Thao highlight
 * inline (click-to-play, no redirect). Rows with no curated video link out to a
 * VTV channel search instead. Only one player is open at a time.
 */
export default function HighlightReel({
  rows,
  watch,
  via,
}: {
  rows: HighlightRow[];
  watch: string;
  via: string;
}) {
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <div className="al-hl">
      {rows.map((r) => {
        const body = (
          <>
            <span className="dt">{r.dt}</span>
            <span className="mt">
              <span className="sd">
                <span className="fl">{r.homeFlag}</span>
                <span className="nm">{r.homeName}</span>
              </span>
              <span className="sc">{r.homeScore}–{r.awayScore}</span>
              <span className="sd r">
                <span className="nm">{r.awayName}</span>
                <span className="fl">{r.awayFlag}</span>
              </span>
            </span>
            <span className="play">
              <span className="yt" aria-hidden>▶</span>
              <span className="tx">
                {watch}
                <small>{via}</small>
              </span>
            </span>
          </>
        );

        // No curated video yet → outbound fallback to the official channel search.
        if (!r.videoId) {
          return (
            <a
              key={r.id}
              className="al-hl-row"
              href={r.fallbackUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              {body}
            </a>
          );
        }

        // Curated video → click-to-play inline, no redirect.
        const open = openId === r.id;
        return (
          <div key={r.id} className="al-hl-item">
            <button
              type="button"
              className="al-hl-row"
              aria-expanded={open}
              onClick={() => setOpenId(open ? null : r.id)}
            >
              {body}
            </button>
            {open && (
              <div className="al-hl-vid">
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/${r.videoId}?autoplay=1&rel=0`}
                  title={`${r.homeName} ${r.homeScore}–${r.awayScore} ${r.awayName}`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
