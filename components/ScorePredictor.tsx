"use client";

import { useEffect, useState } from "react";
import type { Dictionary } from "@/lib/dictionaries";
import { readPredState, setPrediction, scorePrediction } from "@/lib/predictions";

export default function ScorePredictor({
  matchId,
  dict,
  finished,
  actualHome,
  actualAway,
}: {
  matchId: string;
  dict: Dictionary;
  finished: boolean;
  actualHome?: number | null;
  actualAway?: number | null;
}) {
  const [mounted, setMounted] = useState(false);
  const [h, setH] = useState(0);
  const [a, setA] = useState(0);
  const [saved, setSaved] = useState(false);
  const [hasPred, setHasPred] = useState(false);

  useEffect(() => {
    const p = readPredState().preds[matchId];
    if (p) {
      setH(p.h);
      setA(p.a);
      setSaved(true);
      setHasPred(true);
    }
    setMounted(true);
  }, [matchId]);

  if (!mounted) return null;

  // played match — show the user's pick + points earned
  if (finished) {
    if (!hasPred) return null;
    const pts =
      actualHome != null && actualAway != null
        ? scorePrediction({ h, a }, actualHome, actualAway)
        : null;
    const cls = pts === 3 ? "exact" : pts === 1 ? "ok" : "miss";
    return (
      <section className="al-sec pred-card">
        <div className="pred-row">
          <span className="pred-title">{dict.predict.yourPick}</span>
          <span className="pred-pick">{h} – {a}</span>
          {pts != null && (
            <span className={`pred-pts ${cls}`}>{dict.predict.points.replace("{n}", String(pts))}</span>
          )}
        </div>
      </section>
    );
  }

  const step = (set: (n: number) => void, v: number, d: number) => set(Math.max(0, Math.min(15, v + d)));
  const save = () => {
    setPrediction(matchId, h, a);
    setSaved(true);
    setHasPred(true);
  };

  return (
    <section className="al-sec pred-card">
      <span className="pred-title">{dict.predict.title}</span>
      <div className="pred-steppers">
        <div className="pred-side">
          <button type="button" onClick={() => step(setH, h, 1)} aria-label="+1">+</button>
          <span className="pred-n">{h}</span>
          <button type="button" onClick={() => step(setH, h, -1)} aria-label="-1">−</button>
        </div>
        <span className="pred-dash">–</span>
        <div className="pred-side">
          <button type="button" onClick={() => step(setA, a, 1)} aria-label="+1">+</button>
          <span className="pred-n">{a}</span>
          <button type="button" onClick={() => step(setA, a, -1)} aria-label="-1">−</button>
        </div>
      </div>
      <button type="button" className="pred-save" onClick={save}>
        {saved ? dict.predict.saved : dict.predict.save}
      </button>
      <p className="pred-hint">{dict.predict.hint}</p>
    </section>
  );
}
