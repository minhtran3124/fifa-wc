"use client";

import { useEffect, useState } from "react";
import type { Locale } from "@/lib/i18n";
import type { Dictionary } from "@/lib/dictionaries";
import { triviaForDay } from "@/lib/trivia";
import { grantSnacks } from "@/lib/pet";

const KEY = "wc26-trivia";
const REWARD = 2;

interface Saved {
  day: number;
  picked: number;
}

export default function TriviaCard({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const [mounted, setMounted] = useState(false);
  const [dayNum, setDayNum] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [rewarded, setRewarded] = useState(false);

  useEffect(() => {
    const d = Math.floor(Date.now() / 86_400_000);
    setDayNum(d);
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const s = JSON.parse(raw) as Saved;
        if (s.day === d) setPicked(s.picked);
      }
    } catch {
      /* ignore */
    }
    setMounted(true);
  }, []);

  const q = triviaForDay(dayNum);
  const answered = picked !== null;

  const pick = (i: number) => {
    if (answered) return;
    const correct = i === q.answer;
    setPicked(i);
    try {
      localStorage.setItem(KEY, JSON.stringify({ day: dayNum, picked: i }));
    } catch {
      /* ignore */
    }
    if (correct) {
      grantSnacks(REWARD);
      setRewarded(true);
    }
  };

  return (
    <section className="al-sec trivia-card">
      <div className="al-sec-head">
        <div>
          <span className="scribble">{dict.trivia.kicker}</span>
          <h2>{dict.trivia.title}</h2>
        </div>
      </div>
      <p className="trivia-sub">{dict.trivia.sub}</p>

      {mounted && (
        <>
          <p className="trivia-q">{q.q[locale]}</p>
          <div className="trivia-opts">
            {q.options.map((o, i) => {
              const state = !answered
                ? ""
                : i === q.answer
                  ? "right"
                  : picked === i
                    ? "wrong"
                    : "dim";
              return (
                <button
                  key={i}
                  type="button"
                  className={`trivia-opt ${state}`}
                  disabled={answered}
                  onClick={() => pick(i)}
                >
                  {o[locale]}
                </button>
              );
            })}
          </div>
          {answered && (
            <p className="trivia-result">
              {picked === q.answer ? dict.trivia.correct : dict.trivia.wrong}
              {rewarded && ` ${dict.trivia.reward.replace("{n}", String(REWARD))}`} {dict.trivia.comeBack}
            </p>
          )}
        </>
      )}
    </section>
  );
}
