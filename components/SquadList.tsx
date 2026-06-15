import { groupSquad, type SquadPlayer } from "@/lib/squads";
import type { Dictionary } from "@/lib/dictionaries";

// Renders a squad grouped by position. Shared by the team page and the match
// detail page. Empty state when the squad couldn't be loaded.
export default function SquadList({ squad, dict }: { squad: SquadPlayer[]; dict: Dictionary }) {
  const groups = groupSquad(squad);
  if (groups.length === 0) return <p className="al-empty">{dict.team.squad.empty}</p>;

  return (
    <>
      {groups.map((g) => (
        <div key={g.position} className="al-squad-group">
          <h3 className="al-squad-pos">{dict.team.squad.positions[g.position]}</h3>
          <div className="al-squad">
            {g.players.map((p) => (
              <div key={p.id} className="al-player">
                <span className="num">{p.number ?? "–"}</span>
                {p.photo ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img className="ph" src={p.photo} alt="" loading="lazy" />
                ) : (
                  <span className="ph ph-empty" aria-hidden />
                )}
                <span className="bd">
                  <span className="nm">{p.name}</span>
                  <span className="age">
                    {p.age != null ? `${p.age} ${dict.team.squad.ageSuffix}` : ""}
                  </span>
                </span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </>
  );
}
