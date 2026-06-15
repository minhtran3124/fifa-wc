import type { Locale } from "../i18n";
import en, { type Dictionary } from "./en";
import vi from "./vi";

const dictionaries: Record<Locale, Dictionary> = { en, vi };

/** Dictionaries are static objects, so this resolves synchronously. */
export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}

export type { Dictionary };
