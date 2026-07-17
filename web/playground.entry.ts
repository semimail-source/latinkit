// Browser entry for the playground. Bundled with esbuild into playground.bundle.js.
// Exposes a tiny window.latinkit API so the HTML page stays dependency-free.

import { decline, detectDeclension } from '../src/decline.js';
import { explain } from '../src/explain.js';
import { CASES, NUMBERS } from '../src/types.js';
import type { NounEntry } from '../src/types.js';

// A small starter dictionary so learners can just click a word and go —
// no need to know the genitive or gender. Curated common classroom words.
export const STARTER_WORDS: Array<NounEntry & { gloss: string }> = [
  { nominative: 'puella', genitive: 'puellae', gender: 'feminine', gloss: 'girl (1st)' },
  { nominative: 'agricola', genitive: 'agricolae', gender: 'masculine', gloss: 'farmer (1st, masc.)' },
  { nominative: 'dominus', genitive: 'dominī', gender: 'masculine', gloss: 'master (2nd)' },
  { nominative: 'puer', genitive: 'puerī', gender: 'masculine', gloss: 'boy (2nd, keeps e)' },
  { nominative: 'ager', genitive: 'agrī', gender: 'masculine', gloss: 'field (2nd, drops e)' },
  { nominative: 'filius', genitive: 'filī', gender: 'masculine', gloss: 'son (2nd, voc. filī)' },
  { nominative: 'bellum', genitive: 'bellī', gender: 'neuter', gloss: 'war (2nd, neuter)' },
  { nominative: 'rēx', genitive: 'rēgis', gender: 'masculine', iStem: false, gloss: 'king (3rd, cons.)' },
  { nominative: 'corpus', genitive: 'corporis', gender: 'neuter', iStem: false, gloss: 'body (3rd, neuter)' },
  { nominative: 'civis', genitive: 'civis', gender: 'masculine', iStem: true, gloss: 'citizen (3rd, i-stem)' },
  { nominative: 'urbs', genitive: 'urbis', gender: 'feminine', gloss: 'city (3rd, i-stem)' },
  { nominative: 'mare', genitive: 'maris', gender: 'neuter', gloss: 'sea (3rd, neuter i-stem)' },
];

export interface DeclineResult {
  ok: boolean;
  error?: string;
  lemma?: string;
  declension?: number;
  gender?: string;
  // rows keyed by case, each with singular + plural
  rows?: Array<{ case: string; singular: string; plural: string }>;
  // explanation for one highlighted cell
  highlight?: { label: string; text: string };
}

/** Decline an entry and shape it for the HTML table. */
export function run(entry: NounEntry): DeclineResult {
  try {
    const par = decline(entry);
    const byKey = new Map<string, string>();
    for (const cell of par.cells) {
      byKey.set(`${cell.case}:${cell.number}`, cell.form);
    }
    const rows = CASES.map((c) => ({
      case: c,
      singular: byKey.get(`${c}:singular`) ?? '',
      plural: byKey.get(`${c}:plural`) ?? '',
    }));

    // Highlight the ablative singular — the classic "why does it look like the
    // nominative?" moment — as the explain() showcase.
    const ablSg = par.cells.find(
      (c) => c.case === 'ablative' && c.number === 'singular'
    );
    const highlight = ablSg
      ? { label: `${ablSg.form} (ablative sg.)`, text: explain(ablSg) }
      : undefined;

    return {
      ok: true,
      lemma: par.lemma,
      declension: par.declension,
      gender: par.gender,
      rows,
      highlight,
    };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : String(err) };
  }
}

// Expose to the page (browser only; guarded so Node tests can import this).
if (typeof window !== 'undefined') {
  (window as unknown as { latinkit: unknown }).latinkit = {
    run,
    STARTER_WORDS,
    detectDeclension,
    CASES,
    NUMBERS,
  };
}
