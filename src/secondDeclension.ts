// Second declension noun engine.
// Three sub-patterns:
//   - masculine in -us:   dominus, dominī  (voc. -e)
//   - masculine in -er/-ir: puer/puerī (keeps e), ager/agrī (drops e), vir/virī
//   - neuter in -um:      bellum, bellī   (nom = acc = voc; plural -a)
// Famous traps handled: -ius nouns (filius -> voc. filī, gen. often -ī),
// and the -er/-ir nouns whose stem must come from the genitive, not the nominative.

import type { Case, Number, NounEntry, NounForm, Paradigm } from './types.js';
import { CASES, NUMBERS } from './types.js';

// Case endings attached to the stem. Nominative and vocative singular are
// handled specially below because they depend on the sub-pattern.
const SECOND_MASC_ENDINGS: Record<Number, Record<Case, string>> = {
  singular: {
    nominative: 'us', // overridden for -er/-ir
    genitive: 'ī',
    dative: 'ō',
    accusative: 'um',
    ablative: 'ō',
    vocative: 'e', // overridden for -ius and -er/-ir
  },
  plural: {
    nominative: 'ī',
    genitive: 'ōrum',
    dative: 'īs',
    accusative: 'ōs',
    ablative: 'īs',
    vocative: 'ī',
  },
};

const SECOND_NEUTER_ENDINGS: Record<Number, Record<Case, string>> = {
  singular: {
    nominative: 'um',
    genitive: 'ī',
    dative: 'ō',
    accusative: 'um',
    ablative: 'ō',
    vocative: 'um', // neuter: voc = nom
  },
  plural: {
    nominative: 'a',
    genitive: 'ōrum',
    dative: 'īs',
    accusative: 'a',
    ablative: 'īs',
    vocative: 'a',
  },
};

/** Strip the genitive '-ī' to get the true stem, e.g. "agrī" -> "agr". */
export function secondDeclensionStem(entry: NounEntry): string {
  // -ius / -ium nouns: the classical genitive contracts (filius -> filī, not
  // filiī), so the genitive under-represents the stem. Take it from the
  // nominative instead: filius -> fili, ingenium -> ingeni.
  if (entry.nominative.endsWith('ius') || entry.nominative.endsWith('ium')) {
    return entry.nominative.slice(0, -2);
  }
  if (entry.genitive.endsWith('ī')) {
    return entry.genitive.slice(0, -1);
  }
  // Fallback for -us / -um nominatives when genitive is missing/odd.
  if (entry.nominative.endsWith('us') || entry.nominative.endsWith('um')) {
    return entry.nominative.slice(0, -2);
  }
  throw new Error(
    `Not a recognizable 2nd-declension noun: ${entry.nominative}, ${entry.genitive}`
  );
}

/** True for the -er / -ir masculine sub-pattern (puer, ager, vir). */
function isErIrNoun(entry: NounEntry): boolean {
  return (
    entry.gender === 'masculine' &&
    (entry.nominative.endsWith('er') || entry.nominative.endsWith('ir'))
  );
}

/** Vocative singular, which is the classic 2nd-declension exception zone. */
function vocativeSingular(entry: NounEntry, stem: string): string {
  if (entry.gender === 'neuter') {
    // Neuter: vocative = nominative.
    return stem + 'um';
  }
  if (isErIrNoun(entry)) {
    // puer -> puer, ager -> ager, vir -> vir: vocative = nominative.
    return entry.nominative;
  }
  // Masculine in -us:
  if (entry.nominative.endsWith('ius')) {
    // filius -> filī, Vergilius -> Vergilī (contracted, not "filie").
    return stem.endsWith('i') ? stem.slice(0, -1) + 'ī' : stem + 'ī';
  }
  // Regular masculine -us: dominus -> domine.
  return stem + 'e';
}

/** Nominative singular: taken from the dictionary form for -er/-ir irregulars. */
function nominativeSingular(entry: NounEntry, stem: string): string {
  if (entry.gender === 'neuter') return stem + 'um';
  if (isErIrNoun(entry)) return entry.nominative;
  return stem + 'us';
}

/** Inflect a single case/number cell. */
export function inflectSecond(entry: NounEntry, c: Case, n: Number): NounForm {
  const stem = secondDeclensionStem(entry);
  const endings =
    entry.gender === 'neuter' ? SECOND_NEUTER_ENDINGS : SECOND_MASC_ENDINGS;

  let form: string;
  if (n === 'singular' && c === 'nominative') {
    form = nominativeSingular(entry, stem);
  } else if (n === 'singular' && c === 'vocative') {
    form = vocativeSingular(entry, stem);
  } else {
    form = stem + endings[n][c];
  }

  return {
    form,
    lemma: entry.nominative,
    case: c,
    number: n,
    gender: entry.gender,
    declension: 2,
  };
}

/** Generate the complete paradigm: 6 cases × 2 numbers = 12 forms. */
export function paradigmSecond(entry: NounEntry): Paradigm {
  const cells: NounForm[] = [];
  for (const n of NUMBERS) {
    for (const c of CASES) {
      cells.push(inflectSecond(entry, c, n));
    }
  }
  return {
    lemma: entry.nominative,
    declension: 2,
    gender: entry.gender,
    cells,
  };
}
