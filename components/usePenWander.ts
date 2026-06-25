"use client";

import { useEffect, useRef } from "react";

/**
 * Drives N creatures wandering inside their pens with one shared rAF loop.
 * Position/velocity live in refs (no React re-render in the hot path). Each
 * creature uses Reynolds' accumulated-angle "wander" steering plus inward
 * boundary force so it stays in the pen. Faces its direction via scaleX, and
 * gets a `.walking` class toggled when it is actually moving (drives the CSS
 * leg cycle). Pauses on tab-hidden; honours prefers-reduced-motion (no loop —
 * the creature stays CSS-centred).
 *
 * `speedScales[i]` (0..1, from each mascot's mood) modulates how lively each
 * creature is: 1 = bouncy, 0 = settles in place.
 */
const CREATURE = 60; // px footprint used for bounds
const MARGIN = 6; // px clearance from the fence
const BASE_SPEED = 0.9; // px/frame at scale 1
const WANDER_DIST = 26;
const WANDER_RADIUS = 14;
// pets roam only the lower "grass" band of the pen (above is sky/hills)
const GROUND_TOP = 0.46;
// vscode-pets sprites face RIGHT by default → scaleX(1) when moving right.
// Flip to -1 if a future sprite set faces left.
const SPRITE_DIR = 1;

interface CState {
  x: number;
  y: number;
  vx: number;
  vy: number;
  wa: number;
  init: boolean;
  walking: boolean;
  face: number;
}

function clamp(v: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, v));
}

export function usePenWander(n: number, speedScales: number[]) {
  const pens = useRef<(HTMLElement | null)[]>(Array(n).fill(null));
  const creatures = useRef<(HTMLElement | null)[]>(Array(n).fill(null));
  const states = useRef<CState[]>(
    Array.from({ length: n }, (_, i) => ({
      x: 0,
      y: 0,
      vx: i % 2 === 0 ? BASE_SPEED : -BASE_SPEED,
      vy: BASE_SPEED * 0.4,
      wa: i * 1.7,
      init: false,
      walking: false,
      face: 1,
    })),
  );
  const scales = useRef<number[]>(speedScales);
  scales.current = speedScales;
  const raf = useRef<number>(0);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");

    const tick = () => {
      for (let i = 0; i < n; i++) {
        const pen = pens.current[i];
        const el = creatures.current[i];
        if (!pen || !el) continue;
        const rect = pen.getBoundingClientRect();
        const w = rect.width;
        const h = rect.height;
        if (w === 0 || h === 0) continue;
        const s = states.current[i];
        const maxX = w - CREATURE - MARGIN;
        const maxY = h - CREATURE - MARGIN;
        const minY = Math.min(h * GROUND_TOP, maxY);

        if (!s.init) {
          s.x = (w - CREATURE) / 2;
          s.y = (minY + maxY) / 2;
          s.init = true;
          el.style.left = "0px";
          el.style.top = "0px";
        }

        const scale = clamp(scales.current[i] ?? 1, 0, 1);
        const maxSpeed = BASE_SPEED * scale;

        if (maxSpeed < 0.06) {
          // worn out (gaunt) — drift to a stop and rest
          s.vx *= 0.85;
          s.vy *= 0.85;
        } else {
          s.wa += (Math.random() - 0.5) * 0.5;
          const sp0 = Math.hypot(s.vx, s.vy) || maxSpeed;
          const nx = s.vx / sp0;
          const ny = s.vy / sp0;
          const tx = s.x + nx * WANDER_DIST + Math.cos(s.wa) * WANDER_RADIUS;
          const ty = s.y + ny * WANDER_DIST + Math.sin(s.wa) * WANDER_RADIUS;
          let ax = (tx - s.x) * 0.03;
          let ay = (ty - s.y) * 0.03;
          if (s.x < MARGIN) ax += 0.5;
          if (s.x > maxX) ax -= 0.5;
          if (s.y < minY) ay += 0.5;
          if (s.y > maxY) ay -= 0.5;
          s.vx += ax;
          s.vy += ay;
          // hold a constant cruising speed so the pet keeps strolling (only the
          // heading changes) — never stalls to an idle stop
          const sp = Math.hypot(s.vx, s.vy) || 1;
          s.vx = (s.vx / sp) * maxSpeed;
          s.vy = (s.vy / sp) * maxSpeed;
        }

        s.x = clamp(s.x + s.vx, MARGIN, maxX);
        s.y = clamp(s.y + s.vy, minY, maxY);

        // face the travel direction, with a small deadzone to avoid flicker
        if (s.vx > 0.06) s.face = SPRITE_DIR;
        else if (s.vx < -0.06) s.face = -SPRITE_DIR;
        el.style.transform = `translate(${s.x}px, ${s.y}px) scaleX(${s.face})`;

        const walking = Math.hypot(s.vx, s.vy) > 0.18;
        if (walking !== s.walking) {
          s.walking = walking;
          el.classList.toggle("walking", walking);
        }
      }
      raf.current = requestAnimationFrame(tick);
    };

    const start = () => {
      if (mq.matches) return; // reduced motion → no loop; CSS keeps it centred
      cancelAnimationFrame(raf.current);
      raf.current = requestAnimationFrame(tick);
    };
    const stop = () => cancelAnimationFrame(raf.current);

    const onVis = () => (document.hidden ? stop() : start());
    const onMq = () => {
      stop();
      start();
    };

    start();
    document.addEventListener("visibilitychange", onVis);
    mq.addEventListener("change", onMq);
    return () => {
      stop();
      document.removeEventListener("visibilitychange", onVis);
      mq.removeEventListener("change", onMq);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [n]);

  const setPen = (i: number) => (el: HTMLDivElement | null) => {
    pens.current[i] = el;
  };
  const setCreature = (i: number) => (el: HTMLDivElement | null) => {
    creatures.current[i] = el;
  };
  return { setPen, setCreature };
}
