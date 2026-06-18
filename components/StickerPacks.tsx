"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

export interface PackTeam {
  id: string;
  name: string;
  flag: string;
  has: boolean;
  /** National crest image, or null → fall back to the flag emoji. */
  crest: string | null;
}

export interface Pack {
  group: string;
  title: string;
  got: number;
  total: number;
  teams: PackTeam[];
}

/**
 * The "Album · 48 nations" section as foil sticker packets — one Panini-style
 * pack per group. A sealed pack shows the group letter, a progress strip and
 * count; tapping it rips the pack open to reveal that group's stickers (crests
 * link to the team page; collected ones shine, missing ones stay grey). The
 * "open all" toggle reveals every pack at once for an overview.
 */
export default function StickerPacks({
  packs,
  locale,
  hint,
  openAll,
  closeAll,
}: {
  packs: Pack[];
  locale: string;
  hint: string;
  openAll: string;
  closeAll: string;
}) {
  const [open, setOpen] = useState<Set<string>>(new Set());
  const allOpen = open.size === packs.length;

  const toggle = (g: string) =>
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(g)) next.delete(g);
      else next.add(g);
      return next;
    });

  const toggleAll = () =>
    setOpen(allOpen ? new Set() : new Set(packs.map((p) => p.group)));

  return (
    <>
      <div className="al-packs-bar">
        <span className="pk-hint">✂ {hint}</span>
        <button type="button" className="pk-allbtn" onClick={toggleAll}>
          {allOpen ? closeAll : openAll}
        </button>
      </div>

      <div className="al-packs">
        {packs.map((p) => {
          const isOpen = open.has(p.group);
          return (
            <div key={p.group} className={`al-pack ${isOpen ? "open" : ""}`}>
              <button
                type="button"
                className="pk-top"
                aria-expanded={isOpen}
                aria-label={p.title}
                onClick={() => toggle(p.group)}
              >
                <span className="pk-tab">{p.group}</span>
                <span className="pk-brand">
                  World Cup 2026
                  <small>{p.title}</small>
                </span>
                <span className="pk-meta">
                  <span className="pk-ct">
                    {p.got}/{p.total}
                  </span>
                  <span className="pk-dots" aria-hidden>
                    {p.teams.map((t, i) => (
                      <i key={i} className={t.has ? "on" : ""} />
                    ))}
                  </span>
                </span>
                <span className="pk-lip" aria-hidden />
              </button>

              {isOpen && (
                <div className="pk-strip">
                  {p.teams.map((t) => (
                    <Link
                      key={t.id}
                      href={`/${locale}/teams/${t.id}`}
                      className={`al-disc ${t.has ? "got" : "todo"}`}
                      aria-label={t.name}
                    >
                      <span className="ring">
                        {t.crest ? (
                          <Image className="crestimg" src={t.crest} alt="" width={40} height={40} />
                        ) : (
                          <span className="fl">{t.flag}</span>
                        )}
                        {t.crest && <span className="fl-badge" aria-hidden>{t.flag}</span>}
                        {t.has && <span className="got-tab">✓</span>}
                      </span>
                      <span className="nm">{t.name}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
}
