import Link from "next/link";
import { RULE_CHANGES } from "@/lib/rules";
import { getDictionary } from "@/lib/dictionaries";
import type { Locale } from "@/lib/i18n";

export default async function AlbumRules({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const l = locale as Locale;
  const dict = getDictionary(l);

  return (
    <>
      <div className="al-page-head">
        <div>
          <Link href={`/${l}`} className="al-back">{dict.common.back}</Link>
          <h1 className="al-page-title">{dict.rules.title}</h1>
          <p className="al-page-sub">{dict.rules.sub}</p>
        </div>
      </div>

      <div className="al-rules">
        {RULE_CHANGES.map((r) => (
          <div key={r.title.en} className="al-rule">
            <span className="ic" aria-hidden>{r.emoji}</span>
            <div className="bd">
              <div className="top">
                <h3>{r.title[l]}</h3>
                <span className="tag">{dict.rules.tags[r.tag]}</span>
              </div>
              <p>{r.desc[l]}</p>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
