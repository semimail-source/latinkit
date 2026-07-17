// Golden tests for the 2nd declension engine.
// Run: npx tsx test/secondDeclension.test.ts

import { inflectSecond, paradigmSecond } from '../src/secondDeclension.js';
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

// --- dominus, dominī (regular masculine -us) ---
const dominus: NounEntry = {
  nominative: 'dominus',
  genitive: 'dominī',
  gender: 'masculine',
};
eq('dominus nom sg', inflectSecond(dominus, 'nominative', 'singular').form, 'dominus');
eq('dominus gen sg', inflectSecond(dominus, 'genitive', 'singular').form, 'dominī');
eq('dominus dat sg', inflectSecond(dominus, 'dative', 'singular').form, 'dominō');
eq('dominus acc sg', inflectSecond(dominus, 'accusative', 'singular').form, 'dominum');
eq('dominus abl sg', inflectSecond(dominus, 'ablative', 'singular').form, 'dominō');
eq('dominus voc sg', inflectSecond(dominus, 'vocative', 'singular').form, 'domine'); // classic -e voc
eq('dominus nom pl', inflectSecond(dominus, 'nominative', 'plural').form, 'dominī');
eq('dominus gen pl', inflectSecond(dominus, 'genitive', 'plural').form, 'dominōrum');
eq('dominus dat pl', inflectSecond(dominus, 'dative', 'plural').form, 'dominīs');
eq('dominus acc pl', inflectSecond(dominus, 'accusative', 'plural').form, 'dominōs');
eq('dominus abl pl', inflectSecond(dominus, 'ablative', 'plural').form, 'dominīs');
eq('dominus voc pl', inflectSecond(dominus, 'vocative', 'plural').form, 'dominī');

// --- puer, puerī (masculine -er that KEEPS the e) ---
const puer: NounEntry = {
  nominative: 'puer',
  genitive: 'puerī',
  gender: 'masculine',
};
eq('puer nom sg', inflectSecond(puer, 'nominative', 'singular').form, 'puer');
eq('puer gen sg', inflectSecond(puer, 'genitive', 'singular').form, 'puerī');
eq('puer voc sg', inflectSecond(puer, 'vocative', 'singular').form, 'puer'); // voc = nom
eq('puer acc sg', inflectSecond(puer, 'accusative', 'singular').form, 'puerum');
eq('puer nom pl', inflectSecond(puer, 'nominative', 'plural').form, 'puerī');

// --- ager, agrī (masculine -er that DROPS the e) ---
const ager: NounEntry = {
  nominative: 'ager',
  genitive: 'agrī',
  gender: 'masculine',
};
eq('ager nom sg', inflectSecond(ager, 'nominative', 'singular').form, 'ager');
eq('ager gen sg', inflectSecond(ager, 'genitive', 'singular').form, 'agrī');
eq('ager voc sg', inflectSecond(ager, 'vocative', 'singular').form, 'ager'); // voc = nom
eq('ager acc sg', inflectSecond(ager, 'accusative', 'singular').form, 'agrum'); // e dropped
eq('ager dat sg', inflectSecond(ager, 'dative', 'singular').form, 'agrō');
eq('ager nom pl', inflectSecond(ager, 'nominative', 'plural').form, 'agrī');
eq('ager gen pl', inflectSecond(ager, 'genitive', 'plural').form, 'agrōrum');

// --- vir, virī (masculine -ir) ---
const vir: NounEntry = {
  nominative: 'vir',
  genitive: 'virī',
  gender: 'masculine',
};
eq('vir nom sg', inflectSecond(vir, 'nominative', 'singular').form, 'vir');
eq('vir voc sg', inflectSecond(vir, 'vocative', 'singular').form, 'vir');
eq('vir acc sg', inflectSecond(vir, 'accusative', 'singular').form, 'virum');
eq('vir nom pl', inflectSecond(vir, 'nominative', 'plural').form, 'virī');
eq('vir gen pl', inflectSecond(vir, 'genitive', 'plural').form, 'virōrum');

// --- bellum, bellī (neuter -um) ---
const bellum: NounEntry = {
  nominative: 'bellum',
  genitive: 'bellī',
  gender: 'neuter',
};
eq('bellum nom sg', inflectSecond(bellum, 'nominative', 'singular').form, 'bellum');
eq('bellum gen sg', inflectSecond(bellum, 'genitive', 'singular').form, 'bellī');
eq('bellum dat sg', inflectSecond(bellum, 'dative', 'singular').form, 'bellō');
eq('bellum acc sg', inflectSecond(bellum, 'accusative', 'singular').form, 'bellum'); // acc = nom
eq('bellum abl sg', inflectSecond(bellum, 'ablative', 'singular').form, 'bellō');
eq('bellum voc sg', inflectSecond(bellum, 'vocative', 'singular').form, 'bellum'); // voc = nom
eq('bellum nom pl', inflectSecond(bellum, 'nominative', 'plural').form, 'bella'); // neuter pl -a
eq('bellum gen pl', inflectSecond(bellum, 'genitive', 'plural').form, 'bellōrum');
eq('bellum dat pl', inflectSecond(bellum, 'dative', 'plural').form, 'bellīs');
eq('bellum acc pl', inflectSecond(bellum, 'accusative', 'plural').form, 'bella'); // = nom pl
eq('bellum abl pl', inflectSecond(bellum, 'ablative', 'plural').form, 'bellīs');
eq('bellum voc pl', inflectSecond(bellum, 'vocative', 'plural').form, 'bella');

// --- filius, filī (the -ius vocative/genitive trap) ---
const filius: NounEntry = {
  nominative: 'filius',
  genitive: 'filī',
  gender: 'masculine',
};
eq('filius nom sg', inflectSecond(filius, 'nominative', 'singular').form, 'filius');
eq('filius voc sg', inflectSecond(filius, 'vocative', 'singular').form, 'filī'); // NOT "filie"
eq('filius acc sg', inflectSecond(filius, 'accusative', 'singular').form, 'filium');
eq('filius nom pl', inflectSecond(filius, 'nominative', 'plural').form, 'filiī');

// --- paradigm shape check ---
const p = paradigmSecond(dominus);
eq('paradigm cell count', String(p.cells.length), '12');
eq('paradigm declension', String(p.declension), '2');

console.log(`\n2nd declension: ${passed} passed, ${failed} failed.`);
if (failed > 0) process.exit(1);
