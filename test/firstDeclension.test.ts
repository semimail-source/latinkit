// Golden tests for the 1st declension engine.
// Correctness owned by Dally (Latin). Every expected form is hand-verified.
// Run: npx tsx test/firstDeclension.test.ts

import { paradigmFirst, inflectFirst, explain } from '../src/index.js';
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

// puella, puellae (f.) — "girl", the textbook model word.
const puella: NounEntry = { nominative: 'puella', genitive: 'puellae', gender: 'feminine' };

const EXPECTED: Record<Number, Record<Case, string>> = {
  singular: {
    nominative: 'puella',
    genitive: 'puellae',
    dative: 'puellae',
    accusative: 'puellam',
    ablative: 'puellā',
    vocative: 'puella',
  },
  plural: {
    nominative: 'puellae',
    genitive: 'puellārum',
    dative: 'puellīs',
    accusative: 'puellās',
    ablative: 'puellīs',
    vocative: 'puellae',
  },
};

for (const n of ['singular', 'plural'] as Number[]) {
  for (const c of ['nominative','genitive','dative','accusative','ablative','vocative'] as Case[]) {
    const f = inflectFirst(puella, c, n);
    eq(`puella ${n} ${c}`, f.form, EXPECTED[n][c]);
  }
}

// A masculine 1st-declension noun: agricola, agricolae (m.) — "farmer".
// Same endings despite masculine gender (a classic learner trap).
const agricola: NounEntry = { nominative: 'agricola', genitive: 'agricolae', gender: 'masculine' };
eq('agricola nom sg', inflectFirst(agricola, 'nominative', 'singular').form, 'agricola');
eq('agricola gen pl', inflectFirst(agricola, 'genitive', 'plural').form, 'agricolārum');
eq('agricola acc sg', inflectFirst(agricola, 'accusative', 'singular').form, 'agricolam');
eq('agricola keeps masculine', inflectFirst(agricola, 'nominative', 'singular').gender, 'masculine');

// Paradigm completeness: 6 cases × 2 numbers = 12 cells.
const par = paradigmFirst(puella);
eq('paradigm cell count', String(par.cells.length), '12');

// Explanation smoke test: must mention form, case, and the ablative macron note.
const ablSg = inflectFirst(puella, 'ablative', 'singular');
const ex = explain(ablSg);
eq('explain mentions form', String(ex.includes('puellā')), 'true');
eq('explain mentions ablative role', String(ex.toLowerCase().includes('by / with / from')), 'true');

console.log(`\n1st declension: ${pass} passed, ${fail} failed.`);
if (fail > 0) process.exit(1);
