"use client";

import { buildIcs } from "@/lib/ics";

/** Downloads a one-event .ics for a fixture's kick-off. */
export default function AddToCalendar({
  uid,
  startIso,
  title,
  location,
  description,
  label,
}: {
  uid: string;
  startIso: string;
  title: string;
  location?: string;
  description?: string;
  label: string;
}) {
  const onClick = () => {
    const ics = buildIcs(
      [{ uid, start: new Date(startIso), title, location, description }],
      new Date(),
    );
    const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${uid}.ics`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <button type="button" className="al-cal-btn" onClick={onClick}>
      📅 {label}
    </button>
  );
}
