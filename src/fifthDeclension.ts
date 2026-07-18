// Fifth declension noun engine.
// The 5th declension is the small "-ēs / -eī" group. Almost all feminine; the
// notable masculines are diēs (day) and its compound merīdiēs (noon).
//
// Key subtlety learners get wrong: the genitive/dative singular ending is
// -ēī (long ē) when the stem ends in a vowel (diēs -> diēī) but -eī (short e)
// when the stem ends in a consonant (rēs -> reī). We derive this automatically.

import type { Case, Number, NounEntry, NounForm, Paradigm } from './types.js';
import { CASES, NUMBERS } from './types.js';

const VOWELS = ['a', 'e', 'i', 'o', 'u', 'ā', 'ē', 'ī', 'ō', 'ū'];

/** Strip the nominative '-ēs' to get the stem, e.g. "rēs" -> "r", "diēs" -> "di". */
export function fifthDeclensionStem(entry: NounEntry): string {
  if (entry.nominative.endsWith('ēs')) {
    return entry.nominative.slice(0, -2);
  }
  throw new Error(
    `Not a recognizable 5th-declension noun (nominative should end in -ēs): ` +
      `${entry.nominative}, ${entry.genitive}`
  );
}

/** Endings that never depend on the stem shape. */
const FIFTH_FIXED: Record<Number, Record<Case, string | null>> = {
  singular: {
    nominative: 'ēs',
    genitive: null, // computed: -ēī / -eī
    dative: null, // computed: -ēī / -eī
    accusative: 'em',
    ablative: 'ē',
    vocative: 'ēs',
  },
  plural: {
    nominative: 'ēs',
    genitive: 'ērum',
    dative: 'ēbus',
    accusative: 'ēs',
    ablative: 'ēbus',
    vocative: 'ēs',
  },
};

/** Inflect a single case/number cell. */
export function inflectFifth(entry: NounEntry, c: Case, n: Number): NounForm {
  const stem = fifthDeclensionStem(entry);
  const stemEndsInVowel = VOWELS.includes(stem.slice(-1));
  let ending = FIFTH_FIXED[n][c];
  if (ending === null) {
    // genitive & dative singular
    ending = stemEndsInVowel ? 'ēī' : 'eī';
  }
  return {
    form: stem + ending,
    lemma: entry.nominative,
    case: c,
    number: n,
    gender: entry.gender,
    declension: 5,
  };
}

/** Generate the complete paradigm: 6 cases × 2 numbers = 12 forms. */
export function paradigmFifth(entry: NounEntry): Paradigm {
  const cells: NounForm[] = [];
  for (const n of NUMBERS) {
    for (const c of CASES) {
      cells.push(inflectFifth(entry, c, n));
    }
  }
  return {
    lemma: entry.nominative,
    declension: 5,
    gender: entry.gender,
    cells,
  };
}
