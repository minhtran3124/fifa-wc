import type { TeamLineup, LineupPlayer } from "@/lib/types";

/* Map a position abbreviation (ESPN: G/D/M/F, sometimes CB/ST/LW…) to a band. */
function band(pos: string): "G" | "D" | "M" | "F" {
  const p = (pos || "").toUpperCase();
  if (p.startsWith("G")) return "G";
  if (p.startsWith("D") || /^(CB|LB|RB|WB|RWB|LWB)$/.test(p)) return "D";
  if (p.startsWith("F") || /^(ST|CF|LW|RW|SS|W)$/.test(p)) return "F";
  return "M";
}

/* Lay the XI out into rows, top (attack) → bottom (keeper).
   Prefer real position bands; fall back to slicing by the formation string. */
function toRows(lineup: TeamLineup): LineupPlayer[][] {
  const st = lineup.starters;
  const G = st.filter((p) => band(p.pos) === "G");
  const D = st.filter((p) => band(p.pos) === "D");
  const M = st.filter((p) => band(p.pos) === "M");
  const F = st.filter((p) => band(p.pos) === "F");

  if (G.length >= 1 && D.length >= 1 && (M.length || F.length)) {
    return [F, M, D, G].filter((row) => row.length > 0);
  }

  // fallback: GK first, then split the rest by the formation numbers
  const nums = (lineup.formation || "").split(/[^0-9]+/).filter(Boolean).map(Number);
  const gk = st.slice(0, 1);
  const lines: LineupPlayer[][] = [];
  let i = 1;
  for (const n of nums) {
    lines.push(st.slice(i, i + n));
    i += n;
  }
  if (i < st.length) lines.push(st.slice(i)); // any leftovers
  return [...lines.reverse(), gk].filter((row) => row.length > 0);
}

const lastName = (name: string) => name.trim().split(/\s+/).slice(-1)[0] || name;

export default function FormationPitch({ lineup }: { lineup: TeamLineup }) {
  const rows = toRows(lineup);
  const N = rows.length;

  return (
    <div className="al-pitch" role="img" aria-label={`Starting XI ${lineup.formation}`}>
      <svg className="al-pitch-lines" viewBox="0 0 100 150" preserveAspectRatio="none" aria-hidden>
        <rect x="2" y="2" width="96" height="146" rx="2" />
        <line x1="2" y1="75" x2="98" y2="75" />
        <circle cx="50" cy="75" r="11" />
        <circle cx="50" cy="75" r="0.8" className="spot" />
        {/* bottom box (keeper end) */}
        <rect x="22" y="120" width="56" height="28" />
        <rect x="38" y="138" width="24" height="10" />
        {/* top box (attacking end) */}
        <rect x="22" y="2" width="56" height="28" />
        <rect x="38" y="2" width="24" height="10" />
      </svg>

      {rows.map((row, r) => {
        const top = N > 1 ? 13 + (r / (N - 1)) * 74 : 50;
        return row.map((p, c) => {
          const left = 10 + ((c + 1) / (row.length + 1)) * 80;
          return (
            <span
              key={`${p.n}-${p.name}-${c}`}
              className="al-pitch-pl"
              style={{ top: `${top}%`, left: `${left}%` }}
            >
              <span className="disc">{p.n}</span>
              <span className="nm">{lastName(p.name)}</span>
            </span>
          );
        });
      })}
    </div>
  );
}
