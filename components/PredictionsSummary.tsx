"use client";

import { useEffect, useState } from "react";
import type { Dictionary } from "@/lib/dictionaries";
import {
  readPredState,
  savePredState,
  scorePrediction,
  summarize,
  PRED_EVENT,
  type FinishedScore,
  type PredSummary,
} from "@/lib/predictions";
import { grantSnacks } from "@/lib/pet";

export default function PredictionsSummary({
  dict,
  finished,
}: {
  dict: Dictionary;
  finished: FinishedScore[];
}) {
  const [sum, setSum] = useState<PredSummary | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    const s = readPredState();
    // settle: grant snacks for any newly-played predictions (once)
    const claimed = new Set(s.claimed);
    const byId = new Map(finished.map((f) => [f.id, f]));
    let gain = 0;
    let changed = false;
    for (const id of Object.keys(s.preds)) {
      const f = byId.get(id);
      if (!f || claimed.has(id)) continue;
      claimed.add(id);
      changed = true;
      gain += scorePrediction(s.preds[id], f.h, f.a); // 0 awards nothing
    }
    if (changed) savePredState({ ...s, claimed: [...claimed] });
    if (gain > 0) {
      grantSnacks(gain);
      setToast(dict.predict.rewardToast.replace("{n}", String(gain)));
    }
    setSum(summarize(s, finished));

    const onChange = () => setSum(summarize(readPredState(), finished));
    window.addEventListener(PRED_EVENT, onChange);
    return () => window.removeEventListener(PRED_EVENT, onChange);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!toast) return;
    const t = window.setTimeout(() => setToast(null), 2600);
    return () => window.clearTimeout(t);
  }, [toast]);

  return (
    <section className="al-sec pred-summary">
      <div className="al-sec-head">
        <div>
          <span className="scribble">{dict.predict.summaryKicker}</span>
          <h2>{dict.predict.summaryTitle}</h2>
        </div>
      </div>
      {sum && sum.predicted > 0 ? (
        <div className="pred-stats">
          <div className="pred-stat big">
            <span className="v">{sum.points}</span>
            <span className="l">{dict.predict.pointsLabel}</span>
          </div>
          <div className="pred-stat">
            <span className="v">{sum.predicted}</span>
            <span className="l">{dict.predict.predictedLabel}</span>
          </div>
          <div className="pred-stat">
            <span className="v">{sum.exact}</span>
            <span className="l">{dict.predict.exactLabel}</span>
          </div>
          <div className="pred-stat">
            <span className="v">{sum.correct}</span>
            <span className="l">{dict.predict.correctLabel}</span>
          </div>
        </div>
      ) : (
        <p className="al-empty">{dict.predict.empty}</p>
      )}
      {toast && <div className="pet-toast" role="status">{toast}</div>}
    </section>
  );
}
