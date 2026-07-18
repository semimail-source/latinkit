// Fourth declension noun engine.
// The 4th declension is the "-us / -ūs" group: mostly masculine (manus is a
// notable feminine; also domus, which is irregular and NOT handled here), plus
// a small neuter set in -ū (cornū, genū). Stem comes from the genitive in -ūs.

import type { Case, Number, NounEntry, NounForm, Paradigm } from './types.js';
import { CASES, NUMBERS } from './types.js';

// Masculine / feminine endings (manus, manūs).
const FOURTH_MF_ENDINGS: Record<Number, Record<Case, string>> = {
  singular: {
    nominative: 'us',
    genitive: 'ūs',
    dative: 'uī',
    accusative: 'um',
    ablative: 'ū',
    vocative: 'us',
  },
  plural: {
    nominative: 'ūs',
    genitive: 'uum',
    dative: 'ibus',
    accusative: 'ūs',
    ablative: 'ibus',
    vocative: 'ūs',
  },
};

// Neuter endings (cornū, cornūs). Neuters follow the rule nom = acc = voc, and
// the plural of those three is -ua.
const FOURTH_NEUTER_ENDINGS: Record<Number, Record<Case, string>> = {
  singular: {
    nominative: 'ū',
    genitive: 'ūs',
    dative: 'ū',
    accusative: 'ū',
    ablative: 'ū',
    vocative: 'ū',
  },
  plural: {
    nominative: 'ua',
    genitive: 'uum',
    dative: 'ibus',
    accusative: 'ua',
    ablative: 'ibus',
    vocative: 'ua',
  },
};

/** Strip the genitive '-ūs' to get the stem, e.g. "manūs" -> "man". */
export function fourthDeclensionStem(entry: NounEntry): string {
  if (entry.genitive.endsWith('ūs')) {
    return entry.genitive.slice(0, -2);
  }
  throw new Error(
    `Not a recognizable 4th-declension noun (genitive should end in -ūs): ` +
      `${entry.nominative}, ${entry.genitive}`
  );
}

/** Inflect a single case/number cell. */
export function inflectFourth(entry: NounEntry, c: Case, n: Number): NounForm {
  const stem = fourthDeclensionStem(entry);
  const endings =
    entry.gender === 'neuter' ? FOURTH_NEUTER_ENDINGS : FOURTH_MF_ENDINGS;
  const ending = endings[n][c];
  return {
    form: stem + ending,
    lemma: entry.nominative,
    case: c,
    number: n,
    gender: entry.gender,
    declension: 4,
  };
}

/** Generate the complete paradigm: 6 cases × 2 numbers = 12 forms. */
export function paradigmFourth(entry: NounEntry): Paradigm {
  const cells: NounForm[] = [];
  for (const n of NUMBERS) {
    for (const c of CASES) {
      cells.push(inflectFourth(entry, c, n));
    }
  }
  return {
    lemma: entry.nominative,
    declension: 4,
    gender: entry.gender,
    cells,
  };
}
