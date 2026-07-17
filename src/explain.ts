// Learner-facing explanations for inflected forms.
// Goal: not just "what" but "why" — the part that raw morphology tools skip.
//
// Explanations are declension-aware: the reason an ending looks the way it does
// depends on which declension the noun belongs to, so we must not hard-code
// 1st-declension notes for every word.

import type { Case, Number, NounForm } from './types.js';

const ORDINAL = ['', '1st', '2nd', '3rd', '4th', '5th'];

const CASE_ROLE: Record<Case, string> = {
  nominative: 'the subject of the sentence (the one doing the action)',
  genitive: 'possession — "of" the noun',
  dative: 'the indirect object — "to" or "for" the noun',
  accusative: 'the direct object (the one receiving the action)',
  ablative: '"by / with / from" the noun, and object of many prepositions',
  vocative: 'directly addressing someone — "O ..."',
};

// Per-declension note for each case/number cell. Keys: declension -> number -> case.
// Only the pedagogically interesting notes need to be sharp; a sensible generic
// fallback covers the rest.
type Notes = Partial<Record<Number, Partial<Record<Case, string>>>>;

const DECLENSION_NOTES: Record<1 | 2 | 3, Notes> = {
  1: {
    singular: {
      genitive: 'The -ae ending marks genitive singular; it is also how you identify a 1st-declension noun.',
      dative: 'Dative singular is -ae, identical in spelling to the genitive singular — context tells them apart.',
      accusative: 'The -am ending marks the direct object in the singular.',
      ablative: 'The long -ā (with a macron) distinguishes ablative singular from the nominative -a.',
      vocative: 'In the 1st declension the vocative is identical to the nominative.',
    },
    plural: {
      genitive: 'The -ārum ending means "of the ..." for plural nouns.',
      dative: 'Dative and ablative plural share the ending -īs.',
      ablative: 'Dative and ablative plural are both -īs — the case is disambiguated by context.',
    },
  },
  2: {
    singular: {
      genitive: 'The -ī ending marks the genitive singular of the 2nd declension.',
      accusative: 'Masculine -um / neuter -um marks the direct object; for neuters it equals the nominative.',
      ablative: 'Ablative singular is a short -ō in the 2nd declension.',
      vocative: 'Masculine -us nouns take a special vocative -e (domine); -ius nouns contract to -ī (filī); -er/-ir nouns and all neuters keep the nominative form.',
    },
    plural: {
      nominative: 'Masculine plural is -ī; neuter plural is -a.',
      genitive: 'The -ōrum ending means "of the ..." in the 2nd declension.',
      dative: 'Dative and ablative plural share -īs.',
      ablative: 'Dative and ablative plural are both -īs.',
    },
  },
  3: {
    singular: {
      genitive: 'The -is ending marks the genitive singular — and it reveals the true stem, which the nominative often hides (rēx → rēg-).',
      dative: 'Dative singular is -ī across the 3rd declension.',
      accusative: 'Masculine/feminine take -em; neuters keep the nominative form.',
      ablative: 'Ablative singular is -e for consonant stems, but -ī for neuter i-stems (marī, animālī).',
    },
    plural: {
      nominative: 'Masculine/feminine plural is -ēs; neuters take -a (or -ia for i-stems).',
      genitive: 'Genitive plural is -um for consonant stems but -ium for i-stems (civium, urbium, marium).',
      dative: 'Dative and ablative plural share -ibus.',
      ablative: 'Dative and ablative plural are both -ibus.',
    },
  },
};

const GENERIC: Record<Number, Partial<Record<Case, string>>> = {
  singular: {
    nominative: 'The nominative singular is the dictionary form — the subject.',
  },
  plural: {},
};

export interface ExplainOptions {
  level?: 'grade-9' | 'beginner' | 'advanced';
}

/** Produce a readable explanation of one inflected form. */
export function explain(f: NounForm, _opts: ExplainOptions = {}): string {
  const numLabel = f.number === 'singular' ? 'singular' : 'plural';
  const ord = ORDINAL[f.declension] ?? `${f.declension}th`;

  const declNotes = DECLENSION_NOTES[f.declension as 1 | 2 | 3];
  const note =
    declNotes?.[f.number]?.[f.case] ??
    GENERIC[f.number]?.[f.case] ??
    `The ${f.case} ${numLabel} is formed with the ${ord}-declension ending for this case.`;

  return [
    `"${f.form}" is the ${f.case} ${numLabel} of ${f.lemma} (${f.gender}, ${ord} declension).`,
    `Use the ${f.case} for ${CASE_ROLE[f.case]}.`,
    note,
  ].join(' ');
}
