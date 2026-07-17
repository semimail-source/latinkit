// Third declension noun engine — the hardest and most common declension.
//
// Two big sub-patterns:
//   - consonant stems: rex/rēgis, corpus/corporis (neuter), pater/patris
//   - i-stems:         civis/civis, urbs/urbis; neuter mare/maris, animal/animālis
//
// The stem comes from the GENITIVE minus -is (rēgis -> rēg, corporis -> corpor),
// which is why the nominative alone is never enough for this declension.
//
// i-stem status genuinely can't be inferred reliably from nom+gen for every
// word, so the engine uses standard heuristics but lets a caller override with
// entry.iStem. The only endings that differ for i-stems:
//   - genitive plural:  -ium (not -um)
//   - neuter nom/acc/voc plural: -ia (not -a)
//   - neuter ablative singular:  -ī (not -e)   [pure i-stem neuters: mare, animal]

import type { Case, Number, NounEntry, NounForm, Paradigm } from './types.js';
import { CASES, NUMBERS } from './types.js';

/** Stem = genitive singular minus its -is ending. rēgis -> rēg. */
export function thirdDeclensionStem(entry: NounEntry): string {
  if (entry.genitive.endsWith('is')) {
    return entry.genitive.slice(0, -2);
  }
  throw new Error(
    `Not a recognizable 3rd-declension noun (genitive should end in -is): ` +
      `${entry.nominative}, ${entry.genitive}`
  );
}

/**
 * Decide whether a noun behaves as an i-stem.
 * Explicit entry.iStem always wins. Otherwise apply the school heuristics:
 *   - "parisyllabic" nouns (nom and gen have equal syllable count), e.g.
 *     civis/civis, nūbēs/nūbis  -> i-stem
 *   - nouns whose stem ends in two consonants, e.g. urbs/urbis, mōns/montis
 *     -> i-stem
 *   - neuters in -e, -al, -ar (mare, animal, calcar) -> i-stem
 * This is a heuristic, not a proof; callers with authoritative data should set
 * entry.iStem directly.
 */
export function isIStem(entry: NounEntry): boolean {
  if (typeof entry.iStem === 'boolean') return entry.iStem;

  const nom = entry.nominative;
  const stem = thirdDeclensionStem(entry);

  // Neuter i-stems: nominative in -e, -al, -ar.
  if (
    entry.gender === 'neuter' &&
    (nom.endsWith('e') || nom.endsWith('al') || nom.endsWith('ar'))
  ) {
    return true;
  }

  // Stem ending in two consonants (urbs -> urb..., mōns -> mont-).
  if (/[bcdfghjklmnpqrstvxz]{2}$/i.test(stem)) {
    return true;
  }

  // Parisyllabic: equal vowel-group count in nom and gen (rough syllable proxy).
  const syl = (s: string) => (s.match(/[aeiouāēīōūyæœ]+/gi) || []).length;
  if (syl(nom) === syl(entry.genitive)) {
    return true;
  }

  return false;
}

/** Non-neuter (masc/fem) third declension endings. */
function mfEnding(c: Case, n: Number, iStem: boolean): string {
  if (n === 'singular') {
    switch (c) {
      case 'genitive': return 'is';
      case 'dative': return 'ī';
      case 'accusative': return 'em';
      case 'ablative': return 'e';
      // nominative & vocative handled from the dictionary form
      default: return '';
    }
  }
  // plural
  switch (c) {
    case 'nominative': return 'ēs';
    case 'genitive': return iStem ? 'ium' : 'um';
    case 'dative': return 'ibus';
    case 'accusative': return 'ēs';
    case 'ablative': return 'ibus';
    case 'vocative': return 'ēs';
    default: return '';
  }
}

/** Neuter third declension endings. */
function neuterEnding(c: Case, n: Number, iStem: boolean): string {
  if (n === 'singular') {
    switch (c) {
      case 'genitive': return 'is';
      case 'dative': return 'ī';
      case 'ablative': return iStem ? 'ī' : 'e';
      // nominative = accusative = vocative = the dictionary form
      default: return '';
    }
  }
  // plural: neuter nom/acc/voc take -a (or -ia for i-stems)
  switch (c) {
    case 'nominative':
    case 'accusative':
    case 'vocative':
      return iStem ? 'ia' : 'a';
    case 'genitive': return iStem ? 'ium' : 'um';
    case 'dative': return 'ibus';
    case 'ablative': return 'ibus';
    default: return '';
  }
}

/** Inflect a single case/number cell. */
export function inflectThird(entry: NounEntry, c: Case, n: Number): NounForm {
  const stem = thirdDeclensionStem(entry);
  const iStem = isIStem(entry);
  const isNeuter = entry.gender === 'neuter';

  let form: string;

  if (isNeuter) {
    // Neuter: nom = acc = voc, singular takes the dictionary form.
    if (n === 'singular' && (c === 'nominative' || c === 'accusative' || c === 'vocative')) {
      form = entry.nominative;
    } else {
      form = stem + neuterEnding(c, n, iStem);
    }
  } else {
    // Masc/fem: nominative & vocative singular = the dictionary form.
    if (n === 'singular' && (c === 'nominative' || c === 'vocative')) {
      form = entry.nominative;
    } else {
      form = stem + mfEnding(c, n, iStem);
    }
  }

  return {
    form,
    lemma: entry.nominative,
    case: c,
    number: n,
    gender: entry.gender,
    declension: 3,
  };
}

/** Generate the complete paradigm: 6 cases × 2 numbers = 12 forms. */
export function paradigmThird(entry: NounEntry): Paradigm {
  const cells: NounForm[] = [];
  for (const n of NUMBERS) {
    for (const c of CASES) {
      cells.push(inflectThird(entry, c, n));
    }
  }
  return {
    lemma: entry.nominative,
    declension: 3,
    gender: entry.gender,
    cells,
  };
}
