// Score predictions — client-only. Users predict a scoreline per match; once
// the match is played they earn points (exact = 3, correct result = 1) and pet
// snacks. State persists in localStorage; points are always recomputed from the
// stored picks + actual scores (only the snack reward is de-duped via `claimed`).

export interface Pred {
  h: number;
  a: number;
}

export interface PredState {
  preds: Record<string, Pred>;
  /** match ids whose snack reward has already been granted */
  claimed: string[];
}

export interface FinishedScore {
  id: string;
  h: number;
  a: number;
}

export interface PredSummary {
  predicted: number;
  settled: number;
  exact: number;
  correct: number;
  points: number;
}

const KEY = "wc26-predictions";
export const PRED_EVENT = "wc26-pred-change";

export function readPredState(): PredState {
  if (typeof window === "undefined") return { preds: {}, claimed: [] };
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return { preds: {}, claimed: [] };
    const s = JSON.parse(raw) as PredState;
    return { preds: s.preds ?? {}, claimed: s.claimed ?? [] };
  } catch {
    return { preds: {}, claimed: [] };
  }
}

export function savePredState(s: PredState): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(s));
  window.dispatchEvent(new Event(PRED_EVENT));
}

export function setPrediction(matchId: string, h: number, a: number): PredState {
  const s = readPredState();
  const next: PredState = { ...s, preds: { ...s.preds, [matchId]: { h, a } } };
  savePredState(next);
  return next;
}

export function scorePrediction(p: Pred, ah: number, aa: number): number {
  if (p.h === ah && p.a === aa) return 3;
  if (Math.sign(p.h - p.a) === Math.sign(ah - aa)) return 1;
  return 0;
}

export function summarize(s: PredState, finished: FinishedScore[]): PredSummary {
  const byId = new Map(finished.map((f) => [f.id, f]));
  let settled = 0;
  let exact = 0;
  let correct = 0;
  let points = 0;
  for (const id of Object.keys(s.preds)) {
    const f = byId.get(id);
    if (!f) continue;
    settled++;
    const pts = scorePrediction(s.preds[id], f.h, f.a);
    points += pts;
    if (pts === 3) exact++;
    else if (pts === 1) correct++;
  }
  return { predicted: Object.keys(s.preds).length, settled, exact, correct, points };
}
