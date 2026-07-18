# latinkit

**Modern open-source Latin morphology infrastructure.**  
Decline any Latin noun in all five declensions — and understand *why* every ending is what it is.

[![CI](https://github.com/semimail-source/latinkit/actions/workflows/ci.yml/badge.svg)](https://github.com/semimail-source/latinkit/actions/workflows/ci.yml)
[![license: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](./LICENSE)
[![tests](https://img.shields.io/badge/tests-177%20passing-brightgreen.svg)](./test)

Most Latin tools tell you **what** a form is. latinkit also tells you **why** —
the part learners actually get stuck on.

> **Try it live:** [latinkit playground →](PLAYGROUND_URL)  
> Type any noun, get its full declension table plus a plain-English explanation of every ending.

---

## Why latinkit?

Existing morphology tools (Whitaker's Words, Collatinus, Morpheus) are powerful
but built for lookup, not learning. latinkit is different:

| | Whitaker's Words | Collatinus | **latinkit** |
|---|---|---|---|
| Language | C (1990s) | C++ | **TypeScript** |
| Package | ❌ | ❌ | **npm install latinkit** |
| Explanations | ❌ | ❌ | **✅ explain() for every cell** |
| Tests / CI | ❌ | ❌ | **177 assertions, all green** |
| Browser bundle | ❌ | ❌ | **~12 KB, zero dependencies** |
| Third-party data | copied | copied | **clean-room rules only** |

- **Deterministic** — pure rules, no AI, no network. Same input → same output, every time.
- **Testable** — every rule is locked by a golden test. Correctness is auditable.
- **Explanatory** — `explain()` says *why* an ending appears, not just what it is.
- **Tiny** — the browser bundle is ~12 KB and has zero runtime dependencies.
- **Clean-room** — rules are written from Latin grammar itself; no third-party dictionary data is copied in, so the license stays unambiguous.

---

## Install

```bash
npm install latinkit
```

## Quick start

```ts
import { decline, explain } from 'latinkit';

// latinkit detects the declension from the genitive — you don't have to.
const rex = decline({
  nominative: 'rēx',
  genitive:   'rēgis',
  gender:     'masculine',
});

for (const cell of rex.cells) {
  console.log(cell.case, cell.number, '→', cell.form);
}
// nominative singular → rēx
// genitive   singular → rēgis
// dative     singular → rēgī
// accusative singular → rēgem
// ablative   singular → rēge
// vocative   singular → rēx
// nominative plural   → rēgēs
// genitive   plural   → rēgum
// ...

// Ask *why* a form looks the way it does:
const ablSg = rex.cells.find(c => c.case === 'ablative' && c.number === 'singular')!;
console.log(explain(ablSg));
// "rēge" is the ablative singular of rēx (masculine, 3rd declension).
// Use the ablative for "by / with / from" the noun.
// Ablative singular is -e for consonant stems, but -ī for neuter i-stems (marī, animālī).
```

Another example — first declension with an irregular masculine:

```ts
const agricola = decline({
  nominative: 'agricola',
  genitive:   'agricolae',
  gender:     'masculine',   // 1st-declension masculine trap!
});
// Handles agricola, nauta, poēta, etc. correctly.
```

Fifth declension (the short-e / long-ē genitive trap):

```ts
const res  = decline({ nominative: 'rēs',  genitive: 'reī',  gender: 'feminine' });
const dies = decline({ nominative: 'diēs', genitive: 'diēī', gender: 'masculine' });
// reī (short e, consonant stem) vs diēī (long ē, vowel stem) — handled automatically.
```

---

## What's covered

| Feature | Status |
|---|---|
| 1st declension — *puella*, *agricola* | ✅ |
| 2nd declension — *dominus*, *puer*, *ager*, *vir*, *bellum*, *filius* | ✅ |
| 3rd declension — consonant stem, i-stem, neuter (*rēx*, *corpus*, *civis*, *mare*, *animal*) | ✅ |
| 4th declension — *manus*, *portus*, *cornū* | ✅ |
| 5th declension — *rēs*, *diēs* (short-e / long-ē genitive trap) | ✅ |
| Automatic declension detection from the genitive | ✅ |
| `explain()` — declension-aware "why" for every cell | ✅ |
| `analyze(word)` — reverse lookup | 🔜 planned |
| Verbs (1st–4th conjugation) | 🔜 planned |
| Adjectives (1–2 / 3rd declension) | 🔜 planned |

The engine handles the classic traps that students hit:
masculine 1st-declension nouns (*agricola*),
the 2nd-declension vocative *-e* (*domine*) vs. the contracted *-ius* vocative (*filī*, not *filie*),
*-er* nouns that keep or drop their *e* (*puerī* but *agrī*),
neuter rules, 3rd-declension i-stems (*-ium* gen. pl., neuter *-ia* / *-ī*),
and the 4th/5th declension traps most textbooks barely touch.

---

## Design & correctness

latinkit's whole premise is that its Latin can be **checked**, not taken on faith:

- Every declension has a golden test file in `test/`.
- Run `npm test` — currently **177 assertions, all passing**.
- The rule engine is clean-room: written from standard Latin grammars, with **no third-party dictionary data** copied in. License stays clean.
- Found a form we get wrong? [Open an issue](../../issues) with the word and the
  authority you're citing (Allen & Greenough, Wheelock, etc.).
  Latin has genuine ambiguity, and we mark it rather than pretend it away.

```bash
npm install
npm test        # golden tests — 177 passing
npm run demo    # print a sample paradigm + explanation
npx tsc --noEmit  # type-check — zero errors
```

---

## Contributing

Issues and PRs welcome — especially:

- New paradigms **with tests** (please cite a grammar or dictionary).
- Reports of incorrect forms (with a source).
- Playground / docs improvements.

Please keep the core **clean-room**: write rules from standard grammars,
don't paste in third-party dictionary data.

---

## License

[MIT](./LICENSE) © 2026 semimail-source

Latin grammatical rules are public knowledge and not copyrightable.
latinkit implements them from scratch and ships **no third-party lexical data** in its core.
