// Golden tests for the 5th declension engine.
// Correctness owned by Dally (Latin). Every expected form is hand-verified.
// Run: npx tsx test/fifthDeclension.test.ts

import { paradigmFifth, inflectFifth, decline, detectDeclension } from '../src/index.js';
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

// rēs, reī (f.) — "thing/matter". Stem "r" ends in a CONSONANT -> gen/dat sg -eī (short e).
const res: NounEntry = { nominative: 'rēs', genitive: 'reī', gender: 'feminine' };

const RES: Record<Number, Record<Case, string>> = {
  singular: {
    nominative: 'rēs',
    genitive: 'reī',
    dative: 'reī',
    accusative: 'rem',
    ablative: 'rē',
    vocative: 'rēs',
  },
  plural: {
    nominative: 'rēs',
    genitive: 'rērum',
    dative: 'rēbus',
    accusative: 'rēs',
    ablative: 'rēbus',
    vocative: 'rēs',
  },
};

for (const n of ['singular', 'plural'] as Number[]) {
  for (const c of ['nominative','genitive','dative','accusative','ablative','vocative'] as Case[]) {
    eq(`rēs ${n} ${c}`, inflectFifth(res, c, n).form, RES[n][c]);
  }
}

// diēs, diēī (m.) — "day". Stem "di" ends in a VOWEL -> gen/dat sg -ēī (long ē).
const dies: NounEntry = { nominative: 'diēs', genitive: 'diēī', gender: 'masculine' };

const DIES: Record<Number, Record<Case, string>> = {
  singular: {
    nominative: 'diēs',
    genitive: 'diēī',
    dative: 'diēī',
    accusative: 'diem',
    ablative: 'diē',
    vocative: 'diēs',
  },
  plural: {
    nominative: 'diēs',
    genitive: 'diērum',
    dative: 'diēbus',
    accusative: 'diēs',
    ablative: 'diēbus',
    vocative: 'diēs',
  },
};

for (const n of ['singular', 'plural'] as Number[]) {
  for (const c of ['nominative','genitive','dative','accusative','ablative','vocative'] as Case[]) {
    eq(`diēs ${n} ${c}`, inflectFifth(dies, c, n).form, DIES[n][c]);
  }
}

// The short-e / long-ē distinction is the whole point of this engine.
eq('rēs gen sg is short -eī', inflectFifth(res, 'genitive', 'singular').form, 'reī');
eq('diēs gen sg is long -ēī', inflectFifth(dies, 'genitive', 'singular').form, 'diēī');

// detectDeclension + unified decline() routing.
eq('detect rēs as 5th', String(detectDeclension(res)), '5');
eq('detect diēs as 5th', String(detectDeclension(dies)), '5');
eq('decline() routes rēs to 5th', decline(res).cells[3].form, 'rem'); // acc sg
eq('rēs paradigm cell count', String(paradigmFifth(res).cells.length), '12');

console.log(`\n5th declension: ${pass} passed, ${fail} failed.`);
if (fail > 0) process.exit(1);
