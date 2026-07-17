// Golden tests for the 3rd declension engine.
// Run: npx tsx test/thirdDeclension.test.ts

import { inflectThird, paradigmThird, isIStem } from '../src/thirdDeclension.js';
import type { NounEntry } from '../src/types.js';

let passed = 0;
let failed = 0;

function eq(label: string, got: string, want: string) {
  if (got === want) {
    passed++;
  } else {
    failed++;
    console.error(`FAIL ${label}: got "${got}", want "${want}"`);
  }
}

// --- rēx, rēgis (consonant stem, masculine: king) ---
const rex: NounEntry = { nominative: 'rēx', genitive: 'rēgis', gender: 'masculine', iStem: false };
eq('rex nom sg', inflectThird(rex, 'nominative', 'singular').form, 'rēx');
eq('rex gen sg', inflectThird(rex, 'genitive', 'singular').form, 'rēgis');
eq('rex dat sg', inflectThird(rex, 'dative', 'singular').form, 'rēgī');
eq('rex acc sg', inflectThird(rex, 'accusative', 'singular').form, 'rēgem');
eq('rex abl sg', inflectThird(rex, 'ablative', 'singular').form, 'rēge'); // consonant: -e
eq('rex voc sg', inflectThird(rex, 'vocative', 'singular').form, 'rēx');  // voc = nom
eq('rex nom pl', inflectThird(rex, 'nominative', 'plural').form, 'rēgēs');
eq('rex gen pl', inflectThird(rex, 'genitive', 'plural').form, 'rēgum');  // consonant: -um
eq('rex dat pl', inflectThird(rex, 'dative', 'plural').form, 'rēgibus');
eq('rex acc pl', inflectThird(rex, 'accusative', 'plural').form, 'rēgēs');
eq('rex abl pl', inflectThird(rex, 'ablative', 'plural').form, 'rēgibus');

// --- corpus, corporis (consonant stem, NEUTER: body) ---
const corpus: NounEntry = { nominative: 'corpus', genitive: 'corporis', gender: 'neuter', iStem: false };
eq('corpus nom sg', inflectThird(corpus, 'nominative', 'singular').form, 'corpus');
eq('corpus gen sg', inflectThird(corpus, 'genitive', 'singular').form, 'corporis'); // stem shift
eq('corpus dat sg', inflectThird(corpus, 'dative', 'singular').form, 'corporī');
eq('corpus acc sg', inflectThird(corpus, 'accusative', 'singular').form, 'corpus'); // neuter acc = nom
eq('corpus abl sg', inflectThird(corpus, 'ablative', 'singular').form, 'corpore'); // consonant: -e
eq('corpus nom pl', inflectThird(corpus, 'nominative', 'plural').form, 'corpora'); // neuter -a
eq('corpus gen pl', inflectThird(corpus, 'genitive', 'plural').form, 'corporum');
eq('corpus acc pl', inflectThird(corpus, 'accusative', 'plural').form, 'corpora');
eq('corpus abl pl', inflectThird(corpus, 'ablative', 'plural').form, 'corporibus');

// --- civis, civis (i-stem, masc/fem: citizen) ---
const civis: NounEntry = { nominative: 'civis', genitive: 'civis', gender: 'masculine', iStem: true };
eq('civis nom sg', inflectThird(civis, 'nominative', 'singular').form, 'civis');
eq('civis gen sg', inflectThird(civis, 'genitive', 'singular').form, 'civis');
eq('civis acc sg', inflectThird(civis, 'accusative', 'singular').form, 'civem');
eq('civis abl sg', inflectThird(civis, 'ablative', 'singular').form, 'cive'); // masc i-stem still -e
eq('civis nom pl', inflectThird(civis, 'nominative', 'plural').form, 'civēs');
eq('civis gen pl', inflectThird(civis, 'genitive', 'plural').form, 'civium'); // i-stem: -ium
eq('civis acc pl', inflectThird(civis, 'accusative', 'plural').form, 'civēs');

// --- urbs, urbis (i-stem by two-consonant stem: city) ---
const urbs: NounEntry = { nominative: 'urbs', genitive: 'urbis', gender: 'feminine' };
eq('urbs auto i-stem', String(isIStem(urbs)), 'true'); // stem "urb" ends in two consonants
eq('urbs gen pl', inflectThird(urbs, 'genitive', 'plural').form, 'urbium');
eq('urbs acc sg', inflectThird(urbs, 'accusative', 'singular').form, 'urbem');

// --- mare, maris (NEUTER i-stem: sea) ---
const mare: NounEntry = { nominative: 'mare', genitive: 'maris', gender: 'neuter' };
eq('mare auto i-stem', String(isIStem(mare)), 'true'); // neuter in -e
eq('mare nom sg', inflectThird(mare, 'nominative', 'singular').form, 'mare');
eq('mare abl sg', inflectThird(mare, 'ablative', 'singular').form, 'marī'); // neuter i-stem: -ī
eq('mare nom pl', inflectThird(mare, 'nominative', 'plural').form, 'maria'); // neuter i-stem: -ia
eq('mare gen pl', inflectThird(mare, 'genitive', 'plural').form, 'marium');
eq('mare acc pl', inflectThird(mare, 'accusative', 'plural').form, 'maria');

// --- animal, animālis (NEUTER i-stem in -al: animal) ---
const animal: NounEntry = { nominative: 'animal', genitive: 'animālis', gender: 'neuter' };
eq('animal auto i-stem', String(isIStem(animal)), 'true'); // neuter in -al
eq('animal nom sg', inflectThird(animal, 'nominative', 'singular').form, 'animal');
eq('animal abl sg', inflectThird(animal, 'ablative', 'singular').form, 'animālī');
eq('animal nom pl', inflectThird(animal, 'nominative', 'plural').form, 'animālia');
eq('animal gen pl', inflectThird(animal, 'genitive', 'plural').form, 'animālium');

// --- paradigm shape check ---
const p = paradigmThird(rex);
eq('paradigm cell count', String(p.cells.length), '12');
eq('paradigm declension', String(p.declension), '3');

console.log(`\n3rd declension: ${passed} passed, ${failed} failed.`);
if (failed > 0) process.exit(1);
