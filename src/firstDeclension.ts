// First declension noun engine.
// The 1st declension is the most regular in Latin: stem + fixed endings.
// Mostly feminine (puella, aqua, via), a few masculine (agricola, nauta, poeta).

import type { Case, Number, NounEntry, NounForm, Paradigm } from './types.js';
import { CASES, NUMBERS } from './types.js';

// Endings for the 1st declension, keyed by number then case.
const FIRST_DECLENSION_ENDINGS: Record<Number, Record<Case, string>> = {
  singular: {
    nominative: 'a',
    genitive: 'ae',
    dative: 'ae',
    accusative: 'am',
    ablative: 'ā',
    vocative: 'a',
  },
  plural: {
    nominative: 'ae',
    genitive: 'ārum',
    dative: 'īs',
    accusative: 'ās',
    ablative: 'īs',
    vocative: 'ae',
  },
};

/** Strip the nominative 'a' to get the stem, e.g. "puella" -> "puell". */
export function firstDeclensionStem(entry: NounEntry): string {
  // Genitive singular in -ae is the reliable marker; stem = genitive minus "ae".
  if (entry.genitive.endsWith('ae')) {
    return entry.genitive.slice(0, -2);
  }
  // Fallback: nominative minus "a".
  if (entry.nominative.endsWith('a')) {
    return entry.nominative.slice(0, -1);
  }
  throw new Error(
    `Not a recognizable 1st-declension noun: ${entry.nominative}, ${entry.genitive}`
  );
}

/** Inflect a single case/number cell. */
export function inflectFirst(
  entry: NounEntry,
  c: Case,
  n: Number
): NounForm {
  const stem = firstDeclensionStem(entry);
  const ending = FIRST_DECLENSION_ENDINGS[n][c];
  return {
    form: stem + ending,
    lemma: entry.nominative,
    case: c,
    number: n,
    gender: entry.gender,
    declension: 1,
  };
}

/** Generate the complete paradigm: 6 cases × 2 numbers = 12 forms. */
export function paradigmFirst(entry: NounEntry): Paradigm {
  const cells: NounForm[] = [];
  for (const n of NUMBERS) {
    for (const c of CASES) {
      cells.push(inflectFirst(entry, c, n));
    }
  }
  return {
    lemma: entry.nominative,
    declension: 1,
    gender: entry.gender,
    cells,
  };
}
