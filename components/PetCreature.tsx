"use client";

import type { MascotId, Mood } from "@/lib/pet";

/**
 * The walking-creature render seam. v2 uses real animated sprite GIFs from
 * vscode-pets (MIT) under /public/pets/<id>/. Two frames are stacked — idle and
 * walk — and CSS shows the walk one only while the parent .pen-creature has the
 * `.walking` class (toggled by the wander loop). The GIF animates the legs; the
 * loop moves the element and flips facing. To swap a pet, just replace the GIFs.
 */
export default function PetCreature({ id, mood }: { id: MascotId; mood: Mood }) {
  return (
    <span className={`creature mood-${mood}`} aria-hidden>
      <span className="creature-shadow" />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="creature-sprite is-idle" src={`/pets/${id}/idle.gif`} alt="" draggable={false} />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="creature-sprite is-walk" src={`/pets/${id}/walk.gif`} alt="" draggable={false} />
    </span>
  );
}
