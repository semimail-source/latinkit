// Golden tests for explain() — locks in the declension-aware fix so the
// explanation can never silently regress to hard-coded 1st-declension notes.
// Run: npx tsx test/explain.test.ts

import { inflectFirst } from '../src/firstDeclension.js';
import { inflectThird } from '../src/thirdDeclension.js';
import { explain } from '../src/explain.js';
import type { NounEntry } from '../src/types.js';

let passed = 0;
let failed = 0;

function assert(label: string, cond: boolean) {
  if (cond) passed++;
  else { failed++; console.error(`FAIL ${label}`); }
}

// 1st declension ablative: should mention 1st declension and the long -ā note.
const puella: NounEntry = { nominative: 'puella', genitive: 'puellae', gender: 'feminine' };
const p = explain(inflectFirst(puella, 'ablative', 'singular'));
assert('puella says 1st declension', p.includes('1st declension'));
assert('puella mentions long -ā', p.includes('long -ā'));
assert('puella not mislabeled 3rd', !p.includes('3rd declension'));

// 3rd declension consonant stem: must NOT claim 1st declension or the -ā note.
const rex: NounEntry = { nominative: 'rēx', genitive: 'rēgis', gender: 'masculine', iStem: false };
const r = explain(inflectThird(rex, 'ablative', 'singular'));
assert('rex says 3rd declension', r.includes('3rd declension'));
assert('rex NOT mislabeled 1st', !r.includes('1st declension'));
assert('rex ablative note mentions consonant stems', r.includes('consonant stem'));

// 3rd declension genitive singular: should teach the stem-reveal insight.
const g = explain(inflectThird(rex, 'genitive', 'singular'));
assert('rex gen reveals stem lesson', g.includes('stem'));

console.log(`\nexplain(): ${passed} passed, ${failed} failed.`);
if (failed > 0) process.exit(1);
