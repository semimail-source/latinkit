// latinkit core types — public API surface
// Latin morphology engine for learners. Deterministic, testable, no AI required.

export type Case =
  | 'nominative'
  | 'genitive'
  | 'dative'
  | 'accusative'
  | 'ablative'
  | 'vocative';

export type Number = 'singular' | 'plural';

export type Gender = 'masculine' | 'feminine' | 'neuter';

export const CASES: Case[] = [
  'nominative',
  'genitive',
  'dative',
  'accusative',
  'ablative',
  'vocative',
];

export const NUMBERS: Number[] = ['singular', 'plural'];

/** One fully-specified inflected form of a noun. */
export interface NounForm {
  form: string;          // the inflected Latin word, e.g. "puellae"
  lemma: string;         // dictionary headword, e.g. "puella"
  case: Case;
  number: Number;
  gender: Gender;
  declension: 1 | 2 | 3 | 4 | 5;
}

/** A dictionary entry for a noun, enough to inflect it. */
export interface NounEntry {
  nominative: string;    // e.g. "puella"
  genitive: string;      // e.g. "puellae" (identifies stem + declension)
  gender: Gender;
  /**
   * 3rd declension only: marks an i-stem (rex is consonant-stem, civis/mare
   * are i-stems). i-stem status is genuinely hard to infer from nom+gen alone
   * even in textbooks, so callers may state it explicitly. When omitted, the
   * 3rd-declension engine applies the standard heuristics.
   */
  iStem?: boolean;
}

/** A full paradigm: every case × number. */
export interface Paradigm {
  lemma: string;
  declension: 1 | 2 | 3 | 4 | 5;
  gender: Gender;
  cells: NounForm[];
}
