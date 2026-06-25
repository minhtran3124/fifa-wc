// Build an iCalendar (.ics) document for one or more events — used by the
// "Add to calendar" button so users can save match kick-offs.

export interface IcsEvent {
  uid: string;
  start: Date;
  durationMin?: number;
  title: string;
  description?: string;
  location?: string;
}

function pad(n: number): string {
  return n < 10 ? "0" + n : "" + n;
}

function fmtUtc(d: Date): string {
  return (
    d.getUTCFullYear() +
    pad(d.getUTCMonth() + 1) +
    pad(d.getUTCDate()) +
    "T" +
    pad(d.getUTCHours()) +
    pad(d.getUTCMinutes()) +
    pad(d.getUTCSeconds()) +
    "Z"
  );
}

function esc(s: string): string {
  return s.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\n/g, "\\n");
}

/** `stamp` is "now" (DTSTAMP); pass it in so this stays a pure function. */
export function buildIcs(events: IcsEvent[], stamp: Date): string {
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//World Cup 2026 Album//EN",
    "CALSCALE:GREGORIAN",
  ];
  for (const e of events) {
    const end = new Date(e.start.getTime() + (e.durationMin ?? 120) * 60_000);
    lines.push(
      "BEGIN:VEVENT",
      `UID:${e.uid}@wc2026`,
      `DTSTAMP:${fmtUtc(stamp)}`,
      `DTSTART:${fmtUtc(e.start)}`,
      `DTEND:${fmtUtc(end)}`,
      `SUMMARY:${esc(e.title)}`,
    );
    if (e.location) lines.push(`LOCATION:${esc(e.location)}`);
    if (e.description) lines.push(`DESCRIPTION:${esc(e.description)}`);
    lines.push("END:VEVENT");
  }
  lines.push("END:VCALENDAR");
  return lines.join("\r\n");
}
