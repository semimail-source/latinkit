# latinkit

**A small, deterministic, testable Latin morphology toolkit.**
Decline Latin nouns — and understand *why* each ending is what it is.

[![license: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](./LICENSE)
[![tests](https://img.shields.io/badge/tests-116%20passing-brightgreen.svg)](./test)

Most Latin tools tell you *what* a form is. latinkit also tells you *why* —
the part learners actually get stuck on.

> **Try it live:** [playground](https://web-seven-swart-53.vercel.app) — type any noun, get its full declension table plus a plain-English explanation of every ending.

---

## Why another Latin tool?

Existing morphology tools (Whitaker's Words, Collatinus, Morpheus) are powerful
but built for lookup, not learning. latinkit is:

- **Deterministic** — pure rules, no AI, no network. Same input → same output, every time.
- **Testable** — every rule is locked by a golden test. Correctness is auditable, not "trust me."
- **Explanatory** — `explain()` says *why* an ending appears, not just what it is.
- **Tiny & dependency-free** — the browser bundle is ~12 KB.
- **Clean-room** — rules are written from Latin grammar itself; no third-party dictionary data is copied in, so the license stays clean.

## Install

```bash
npm install latinkit
```

## Quick start

```ts
import { decline, explain } from 'latinkit';

// You don't need to know which declension it is —
// the genitive tells latinkit everything.
const par = decline({
  nominative: 'rēx',
  genitive: 'rēgis',
  gender: 'masculine',
});

for (const cell of par.cells) {
  console.log(cell.case, cell.number, '→', cell.form);
}
// nominative singular → rēx
// genitive   singular → rēgis
// ablative   singular → rēge
// nominative plural   → rēgēs
// genitive   plural   → rēgum
// ...

// Ask *why* a form looks the way it does:
const ablSg = par.cells.find(c => c.case === 'ablative' && c.number === 'singular');
console.log(explain(ablSg));
// "rēge" is the ablative singular of rēx (masculine, 3rd declension).
// Use the ablative for "by / with / from" the noun... Ablative singular is -e
// for consonant stems, but -ī for neuter i-stems (marī, animālī).
```

## What's covered

| Feature | Status |
|---|---|
| 1st declension (puella, agricola) | ✅ |
| 2nd declension (dominus, puer, ager, vir, bellum, filius) | ✅ |
| 3rd declension — consonant & i-stem, incl. neuters (rēx, corpus, civis, mare, animal) | ✅ |
| Automatic declension detection from the genitive | ✅ |
| `explain()` — declension-aware "why" for every cell | ✅ |
| 4th & 5th declension | 🔜 planned |
| Verbs (conjugations) | 🔜 planned |
| `analyze(word)` — reverse lookup | 🔜 planned |

The engine handles the classic traps students hit: masculine 1st-declension
nouns (*agricola*), the 2nd-declension vocative in *-e* (*domine*) vs. the
contracted *-ius* vocative (*filī*, not *filie*), *-er* nouns that keep or drop
their *e* (*puer* → *puerī* but *ager* → *agrī*), neuter rules, and 3rd-declension
i-stems (*-ium* genitive plural, neuter *-ia* / *-ī*).

## Design & correctness

latinkit's whole premise is that its Latin can be **checked**, not taken on faith:

- Every declension has a golden test file (`test/`).
- Run `npm test` — currently **116 assertions, all passing**.
- Found a form we get wrong? [Open an issue](../../issues) with the word and the
  authority you're citing. Latin has genuine ambiguity, and we mark it rather
  than pretend it away.

```bash
npm install
npm test        # run the golden tests
npm run demo    # print a sample paradigm + explanation
```

## Contributing

Issues and PRs welcome — especially:
- New paradigms with tests (please cite a grammar or dictionary).
- Reports of incorrect forms (with a source).
- Playground / docs improvements.

Please keep the core **clean-room**: write rules from grammar, don't paste in
third-party dictionary data.

## License

[MIT](./LICENSE) © 2026 latinkit contributors.

Latin grammatical rules are public knowledge and not copyrightable; latinkit
implements them from scratch and ships no third-party lexical data in its core.
