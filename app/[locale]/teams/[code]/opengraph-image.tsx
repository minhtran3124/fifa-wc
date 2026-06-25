import { ImageResponse } from "next/og";
import { getTeam } from "@/lib/teams";
import { teamMascot } from "@/lib/teamMascots";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "World Cup 2026 — team";

const CREAM = "#e7dcc4";
const PAPER = "#f3ead4";
const INK = "#2b2114";
const RED = "#bb3829";
const FOIL = "#d9b24a";

export default async function Image({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const team = getTeam(code.toLowerCase());
  const mascot = team ? teamMascot(team.name) : undefined;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 64,
          background: `linear-gradient(135deg, ${CREAM} 0%, ${PAPER} 100%)`,
          color: INK,
          fontFamily: "sans-serif",
        }}
      >
        {/* gold foil top rule */}
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 16, background: FOIL }} />

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div
              style={{
                display: "flex",
                background: RED,
                color: "#fff",
                fontSize: 26,
                fontWeight: 800,
                padding: "8px 18px",
                borderRadius: 10,
                letterSpacing: 2,
              }}
            >
              WORLD CUP 2026
            </div>
            <div style={{ display: "flex", fontSize: 26, color: "#6b5d44", fontWeight: 700 }}>
              USA · CANADA · MEXICO
            </div>
          </div>
          {mascot && (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <div style={{ display: "flex", fontSize: 96 }}>{mascot.emoji}</div>
              <div style={{ display: "flex", fontSize: 24, color: "#6b5d44", fontWeight: 700 }}>{mascot.nick}</div>
            </div>
          )}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 44 }}>
          <div style={{ display: "flex", fontSize: 220, lineHeight: 1 }}>{team?.flag ?? "🏆"}</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 14, minWidth: 0 }}>
            <div style={{ display: "flex", fontSize: 96, fontWeight: 900, textTransform: "uppercase", lineHeight: 1 }}>
              {team?.name ?? "World Cup 2026"}
            </div>
            {team && (
              <div style={{ display: "flex", gap: 16, fontSize: 34, color: "#6b5d44", fontWeight: 700 }}>
                <div style={{ display: "flex" }}>Group {team.group}</div>
                <div style={{ display: "flex" }}>·</div>
                <div style={{ display: "flex" }}>#{team.fifaRank} FIFA</div>
              </div>
            )}
          </div>
        </div>

        <div style={{ display: "flex", fontSize: 26, color: "#6b5d44", fontWeight: 700 }}>
          48 nations · 16 cities · one road to glory
        </div>
      </div>
    ),
    { ...size, emoji: "twemoji" },
  );
}
