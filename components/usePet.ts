"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  applyEarnings,
  feed,
  feedAll,
  freshState,
  PET_EVENT,
  PET_IDS,
  readPetState,
  savePetState,
  type MascotId,
  type PetState,
} from "@/lib/pet";

/**
 * Shared client state for the Pet Corner. Used by both the full page and the
 * home widget so they never diverge. Earning is idempotent (daily guard +
 * claim-once), so whichever surface mounts first grants snacks and the other
 * just reflects the saved state via PET_EVENT.
 */
export function usePet(playedTeamIds: string[]) {
  const [state, setState] = useState<PetState | null>(null);
  const [now, setNow] = useState(0);
  const [eating, setEating] = useState<MascotId[]>([]);
  const [gained, setGained] = useState(0);

  const stateRef = useRef<PetState | null>(null);
  stateRef.current = state;
  const eatTimer = useRef<number | null>(null);

  useEffect(() => {
    const t = Date.now();
    setNow(t);
    const existing = readPetState();
    // brand-new save: seed claimed with teams that already played so the first
    // visit doesn't dump a snack windfall — only future first-matches earn.
    const base = existing ?? { ...freshState(t), claimed: [...playedTeamIds] };
    const { state: next, gained: g } = applyEarnings(base, playedTeamIds, t);
    setState(next);
    if (!existing || g) savePetState(next);
    if (g) setGained(g);

    const iv = window.setInterval(() => setNow(Date.now()), 60_000);
    const onChange = () => {
      const s = readPetState();
      if (s) setState(s);
    };
    window.addEventListener(PET_EVENT, onChange);
    return () => {
      window.clearInterval(iv);
      window.removeEventListener(PET_EVENT, onChange);
      if (eatTimer.current) window.clearTimeout(eatTimer.current);
    };
    // run once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const flash = useCallback((ids: MascotId[]) => {
    setEating(ids);
    if (eatTimer.current) window.clearTimeout(eatTimer.current);
    eatTimer.current = window.setTimeout(() => setEating([]), 800);
  }, []);

  const feedOne = useCallback(
    (id: MascotId) => {
      const prev = stateRef.current;
      if (!prev || prev.snacks < 1) return;
      const next = feed(prev, id, Date.now());
      setState(next);
      savePetState(next);
      setNow(Date.now());
      flash([id]);
    },
    [flash],
  );

  const doFeedAll = useCallback(() => {
    const prev = stateRef.current;
    if (!prev || prev.snacks < 1) return;
    const t = Date.now();
    const next = feedAll(prev, t);
    const fed = PET_IDS.filter((id) => next.pets[id] !== prev.pets[id]);
    setState(next);
    savePetState(next);
    setNow(t);
    flash(fed);
  }, [flash]);

  const clearGained = useCallback(() => setGained(0), []);

  return { state, now, eating, gained, clearGained, feedOne, doFeedAll };
}
