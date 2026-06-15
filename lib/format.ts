import type { Locale } from "./i18n";

// All match times are displayed in Vietnam time (Indochina Time, GMT+7).
export const VN_TZ = "Asia/Ho_Chi_Minh";
export const VN_LABEL = "GMT+7";

const INTL: Record<Locale, string> = { vi: "vi-VN", en: "en-US" };

export function fmtDate(iso: string, locale: Locale = "en"): string {
  return new Date(iso).toLocaleDateString(INTL[locale], {
    weekday: "short",
    month: "short",
    day: "numeric",
    timeZone: VN_TZ,
  });
}

export function fmtDateLong(iso: string, locale: Locale = "en"): string {
  return new Date(iso).toLocaleDateString(INTL[locale], {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: VN_TZ,
  });
}

export function fmtTime(iso: string, locale: Locale = "en"): string {
  return (
    new Date(iso).toLocaleTimeString(INTL[locale], {
      hour: "numeric",
      minute: "2-digit",
      timeZone: VN_TZ,
      hour12: locale === "en",
    }) + ` ${VN_LABEL}`
  );
}

/** Calendar-date key (YYYY-MM-DD) for a match, in Vietnam time — used to group
 *  the schedule by day so late kickoffs fall on the correct local date. */
export function vnDayKey(iso: string): string {
  return new Date(iso).toLocaleDateString("en-CA", { timeZone: VN_TZ });
}

/** Human label for a vnDayKey ("2026-06-12" → "Friday, June 12"). The key is
 *  already a Vietnam calendar date, so format it at noon UTC to avoid drift. */
export function fmtDayKey(day: string, locale: Locale = "en"): string {
  return new Date(day + "T12:00:00Z").toLocaleDateString(INTL[locale], {
    weekday: "long",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}
