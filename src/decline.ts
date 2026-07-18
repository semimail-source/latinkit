// Unified noun engine: figure out the declension from the dictionary form
// (nominative + genitive) and route to the right sub-engine. This is the
// function a learner actually wants — they should not have to know "which
// declension" before they can decline a word.

import type { NounEntry, Paradigm } from './types.js';
import { paradigmFirst } from './firstDeclension.js';
import { paradigmSecond } from './secondDeclension.js';
import { paradigmThird } from './thirdDeclension.js';
import { paradigmFourth } from './fourthDeclension.js';
import { paradigmFifth } from './fifthDeclension.js';

export type Declension = 1 | 2 | 3 | 4 | 5;

/**
 * Detect the declension from the genitive singular ending — the same signal a
 * Latin dictionary uses:
 *   -ae   -> 1st   (puella, puellae)
 *   -ī    -> 2nd   (dominus, dominī / bellum, bellī)
 *   -is   -> 3rd   (rēx, rēgis)
 *   -ūs   -> 4th   (manus, manūs)      [engine not built yet]
 *   -eī / -ēī -> 5th (rēs, reī / diēs, diēī) [engine not built yet]
 */
export function detectDeclension(entry: NounEntry): Declension {
  const gen = entry.genitive;
  if (gen.endsWith('ae')) return 1;
  if (gen.endsWith('ūs')) return 4;
  if (gen.endsWith('eī') || gen.endsWith('ēī')) return 5;
  if (gen.endsWith('ī')) return 2;
  if (gen.endsWith('is')) return 3;
  throw new Error(
    `Cannot detect declension from genitive "${gen}". Supported endings: ` +
      `-ae (1st), -ī (2nd), -is (3rd), -ūs (4th), -eī/-ēī (5th).`
  );
}

/**
 * Decline any supported noun. Throws a clear, learner-friendly error for
 * declensions whose engines are not built yet, rather than guessing.
 */
export function decline(entry: NounEntry): Paradigm {
  const d = detectDeclension(entry);
  switch (d) {
    case 1: return paradigmFirst(entry);
    case 2: return paradigmSecond(entry);
    case 3: return paradigmThird(entry);
    case 4: return paradigmFourth(entry);
    case 5: return paradigmFifth(entry);
    default:
      throw new Error(
        `Detected ${d}th declension for "${entry.nominative}", but that engine ` +
          `is not implemented yet.`
      );
  }
}
