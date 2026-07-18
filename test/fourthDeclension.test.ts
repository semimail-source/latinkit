// Golden tests for the 4th declension engine.
// Correctness owned by Dally (Latin). Every expected form is hand-verified.
// Run: npx tsx test/fourthDeclension.test.ts

import { paradigmFourth, inflectFourth } from '../src/index.js';
import type { NounEntry, Case, Number } from '../src/index.js';

let pass = 0;
let fail = 0;

function eq(label: string, got: string, want: string) {
  if (got === want) {
    pass++;
  } else {
    fail++;
    console.error(`  FAIL ${label}: got "${got}", want "${want}"`);
  }
}

// manus, manūs (f.) — "hand". The textbook model word; feminine despite -us.
const manus: NounEntry = { nominative: 'manus', genitive: 'manūs', gender: 'feminine' };

const MANUS: Record<Number, Record<Case, string>> = {
  singular: {
    nominative: 'manus',
    genitive: 'manūs',
    dative: 'manuī',
    accusative: 'manum',
    ablative: 'manū',
    vocative: 'manus',
  },
  plural: {
    nominative: 'manūs',
    genitive: 'manuum',
    dative: 'manibus',
    accusative: 'manūs',
    ablative: 'manibus',
    vocative: 'manūs',
  },
};

for (const n of ['singular', 'plural'] as Number[]) {
  for (const c of ['nominative','genitive','dative','accusative','ablative','vocative'] as Case[]) {
    eq(`manus ${n} ${c}`, inflectFourth(manus, c, n).form, MANUS[n][c]);
  }
}

// A masculine 4th noun: portus, portūs (m.) — "harbour". Same endings as manus.
const portus: NounEntry = { nominative: 'portus', genitive: 'portūs', gender: 'masculine' };
eq('portus dat sg', inflectFourth(portus, 'dative', 'singular').form, 'portuī');
eq('portus gen pl', inflectFourth(portus, 'genitive', 'plural').form, 'portuum');
eq('portus keeps masculine', inflectFourth(portus, 'nominative', 'singular').gender, 'masculine');

// Neuter 4th noun: cornū, cornūs (n.) — "horn". nom = acc = voc; plural of those in -ua.
const cornu: NounEntry = { nominative: 'cornū', genitive: 'cornūs', gender: 'neuter' };
const CORNU: Record<Number, Record<Case, string>> = {
  singular: {
    nominative: 'cornū',
    genitive: 'cornūs',
    dative: 'cornū',
    accusative: 'cornū',
    ablative: 'cornū',
    vocative: 'cornū',
  },
  plural: {
    nominative: 'cornua',
    genitive: 'cornuum',
    dative: 'cornibus',
    accusative: 'cornua',
    ablative: 'cornibus',
    vocative: 'cornua',
  },
};
for (const n of ['singular', 'plural'] as Number[]) {
  for (const c of ['nominative','genitive','dative','accusative','ablative','vocative'] as Case[]) {
    eq(`cornū ${n} ${c}`, inflectFourth(cornu, c, n).form, CORNU[n][c]);
  }
}
// Neuter nom/acc/voc identity check (the defining neuter rule).
eq('cornū neuter nom=acc sg', inflectFourth(cornu, 'nominative', 'singular').form, inflectFourth(cornu, 'accusative', 'singular').form);
eq('cornū neuter nom=acc pl', inflectFourth(cornu, 'nominative', 'plural').form, inflectFourth(cornu, 'accusative', 'plural').form);

// Paradigm completeness.
eq('manus paradigm cell count', String(paradigmFourth(manus).cells.length), '12');
eq('cornū paradigm cell count', String(paradigmFourth(cornu).cells.length), '12');

console.log(`\n4th declension: ${pass} passed, ${fail} failed.`);
if (fail > 0) process.exit(1);
