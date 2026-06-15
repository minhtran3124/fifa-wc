import type { Metadata } from "next";
import Link from "next/link";
import { RULE_CHANGES } from "@/lib/rules";

export const metadata: Metadata = { title: "New Rules" };

export default function AlbumRules() {
  return (
    <>
      <div className="al-page-head">
        <div>
          <Link href="/" className="al-back">← Album home</Link>
          <h1 className="al-page-title">New rules in 2026</h1>
          <p className="al-page-sub">
            The first 48-team World Cup also debuts a wave of IFAB rule changes — some
            brand new, some expanded — aimed at cutting time-wasting, protecting players
            and giving VAR a wider remit.
          </p>
        </div>
      </div>

      <div className="al-rules">
        {RULE_CHANGES.map((r) => (
          <div key={r.title} className="al-rule">
            <span className="ic" aria-hidden>{r.emoji}</span>
            <div className="bd">
              <div className="top">
                <h3>{r.title}</h3>
                <span className="tag">{r.tag}</span>
              </div>
              <p>{r.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
