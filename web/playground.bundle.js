// src/types.ts
var CASES = [
  "nominative",
  "genitive",
  "dative",
  "accusative",
  "ablative",
  "vocative"
];
var NUMBERS = ["singular", "plural"];

// src/firstDeclension.ts
var FIRST_DECLENSION_ENDINGS = {
  singular: {
    nominative: "a",
    genitive: "ae",
    dative: "ae",
    accusative: "am",
    ablative: "\u0101",
    vocative: "a"
  },
  plural: {
    nominative: "ae",
    genitive: "\u0101rum",
    dative: "\u012Bs",
    accusative: "\u0101s",
    ablative: "\u012Bs",
    vocative: "ae"
  }
};
function firstDeclensionStem(entry) {
  if (entry.genitive.endsWith("ae")) {
    return entry.genitive.slice(0, -2);
  }
  if (entry.nominative.endsWith("a")) {
    return entry.nominative.slice(0, -1);
  }
  throw new Error(
    `Not a recognizable 1st-declension noun: ${entry.nominative}, ${entry.genitive}`
  );
}
function inflectFirst(entry, c, n) {
  const stem = firstDeclensionStem(entry);
  const ending = FIRST_DECLENSION_ENDINGS[n][c];
  return {
    form: stem + ending,
    lemma: entry.nominative,
    case: c,
    number: n,
    gender: entry.gender,
    declension: 1
  };
}
function paradigmFirst(entry) {
  const cells = [];
  for (const n of NUMBERS) {
    for (const c of CASES) {
      cells.push(inflectFirst(entry, c, n));
    }
  }
  return {
    lemma: entry.nominative,
    declension: 1,
    gender: entry.gender,
    cells
  };
}

// src/secondDeclension.ts
var SECOND_MASC_ENDINGS = {
  singular: {
    nominative: "us",
    // overridden for -er/-ir
    genitive: "\u012B",
    dative: "\u014D",
    accusative: "um",
    ablative: "\u014D",
    vocative: "e"
    // overridden for -ius and -er/-ir
  },
  plural: {
    nominative: "\u012B",
    genitive: "\u014Drum",
    dative: "\u012Bs",
    accusative: "\u014Ds",
    ablative: "\u012Bs",
    vocative: "\u012B"
  }
};
var SECOND_NEUTER_ENDINGS = {
  singular: {
    nominative: "um",
    genitive: "\u012B",
    dative: "\u014D",
    accusative: "um",
    ablative: "\u014D",
    vocative: "um"
    // neuter: voc = nom
  },
  plural: {
    nominative: "a",
    genitive: "\u014Drum",
    dative: "\u012Bs",
    accusative: "a",
    ablative: "\u012Bs",
    vocative: "a"
  }
};
function secondDeclensionStem(entry) {
  if (entry.nominative.endsWith("ius") || entry.nominative.endsWith("ium")) {
    return entry.nominative.slice(0, -2);
  }
  if (entry.genitive.endsWith("\u012B")) {
    return entry.genitive.slice(0, -1);
  }
  if (entry.nominative.endsWith("us") || entry.nominative.endsWith("um")) {
    return entry.nominative.slice(0, -2);
  }
  throw new Error(
    `Not a recognizable 2nd-declension noun: ${entry.nominative}, ${entry.genitive}`
  );
}
function isErIrNoun(entry) {
  return entry.gender === "masculine" && (entry.nominative.endsWith("er") || entry.nominative.endsWith("ir"));
}
function vocativeSingular(entry, stem) {
  if (entry.gender === "neuter") {
    return stem + "um";
  }
  if (isErIrNoun(entry)) {
    return entry.nominative;
  }
  if (entry.nominative.endsWith("ius")) {
    return stem.endsWith("i") ? stem.slice(0, -1) + "\u012B" : stem + "\u012B";
  }
  return stem + "e";
}
function nominativeSingular(entry, stem) {
  if (entry.gender === "neuter") return stem + "um";
  if (isErIrNoun(entry)) return entry.nominative;
  return stem + "us";
}
function inflectSecond(entry, c, n) {
  const stem = secondDeclensionStem(entry);
  const endings = entry.gender === "neuter" ? SECOND_NEUTER_ENDINGS : SECOND_MASC_ENDINGS;
  let form;
  if (n === "singular" && c === "nominative") {
    form = nominativeSingular(entry, stem);
  } else if (n === "singular" && c === "vocative") {
    form = vocativeSingular(entry, stem);
  } else {
    form = stem + endings[n][c];
  }
  return {
    form,
    lemma: entry.nominative,
    case: c,
    number: n,
    gender: entry.gender,
    declension: 2
  };
}
function paradigmSecond(entry) {
  const cells = [];
  for (const n of NUMBERS) {
    for (const c of CASES) {
      cells.push(inflectSecond(entry, c, n));
    }
  }
  return {
    lemma: entry.nominative,
    declension: 2,
    gender: entry.gender,
    cells
  };
}

// src/thirdDeclension.ts
function thirdDeclensionStem(entry) {
  if (entry.genitive.endsWith("is")) {
    return entry.genitive.slice(0, -2);
  }
  throw new Error(
    `Not a recognizable 3rd-declension noun (genitive should end in -is): ${entry.nominative}, ${entry.genitive}`
  );
}
function isIStem(entry) {
  if (typeof entry.iStem === "boolean") return entry.iStem;
  const nom = entry.nominative;
  const stem = thirdDeclensionStem(entry);
  if (entry.gender === "neuter" && (nom.endsWith("e") || nom.endsWith("al") || nom.endsWith("ar"))) {
    return true;
  }
  if (/[bcdfghjklmnpqrstvxz]{2}$/i.test(stem)) {
    return true;
  }
  const syl = (s) => (s.match(/[aeiouāēīōūyæœ]+/gi) || []).length;
  if (syl(nom) === syl(entry.genitive)) {
    return true;
  }
  return false;
}
function mfEnding(c, n, iStem) {
  if (n === "singular") {
    switch (c) {
      case "genitive":
        return "is";
      case "dative":
        return "\u012B";
      case "accusative":
        return "em";
      case "ablative":
        return "e";
      // nominative & vocative handled from the dictionary form
      default:
        return "";
    }
  }
  switch (c) {
    case "nominative":
      return "\u0113s";
    case "genitive":
      return iStem ? "ium" : "um";
    case "dative":
      return "ibus";
    case "accusative":
      return "\u0113s";
    case "ablative":
      return "ibus";
    case "vocative":
      return "\u0113s";
    default:
      return "";
  }
}
function neuterEnding(c, n, iStem) {
  if (n === "singular") {
    switch (c) {
      case "genitive":
        return "is";
      case "dative":
        return "\u012B";
      case "ablative":
        return iStem ? "\u012B" : "e";
      // nominative = accusative = vocative = the dictionary form
      default:
        return "";
    }
  }
  switch (c) {
    case "nominative":
    case "accusative":
    case "vocative":
      return iStem ? "ia" : "a";
    case "genitive":
      return iStem ? "ium" : "um";
    case "dative":
      return "ibus";
    case "ablative":
      return "ibus";
    default:
      return "";
  }
}
function inflectThird(entry, c, n) {
  const stem = thirdDeclensionStem(entry);
  const iStem = isIStem(entry);
  const isNeuter = entry.gender === "neuter";
  let form;
  if (isNeuter) {
    if (n === "singular" && (c === "nominative" || c === "accusative" || c === "vocative")) {
      form = entry.nominative;
    } else {
      form = stem + neuterEnding(c, n, iStem);
    }
  } else {
    if (n === "singular" && (c === "nominative" || c === "vocative")) {
      form = entry.nominative;
    } else {
      form = stem + mfEnding(c, n, iStem);
    }
  }
  return {
    form,
    lemma: entry.nominative,
    case: c,
    number: n,
    gender: entry.gender,
    declension: 3
  };
}
function paradigmThird(entry) {
  const cells = [];
  for (const n of NUMBERS) {
    for (const c of CASES) {
      cells.push(inflectThird(entry, c, n));
    }
  }
  return {
    lemma: entry.nominative,
    declension: 3,
    gender: entry.gender,
    cells
  };
}

// src/decline.ts
function detectDeclension(entry) {
  const gen = entry.genitive;
  if (gen.endsWith("ae")) return 1;
  if (gen.endsWith("\u016Bs")) return 4;
  if (gen.endsWith("e\u012B") || gen.endsWith("\u0113\u012B")) return 5;
  if (gen.endsWith("\u012B")) return 2;
  if (gen.endsWith("is")) return 3;
  throw new Error(
    `Cannot detect declension from genitive "${gen}". Supported endings: -ae (1st), -\u012B (2nd), -is (3rd), -\u016Bs (4th), -e\u012B/-\u0113\u012B (5th).`
  );
}
function decline(entry) {
  const d = detectDeclension(entry);
  switch (d) {
    case 1:
      return paradigmFirst(entry);
    case 2:
      return paradigmSecond(entry);
    case 3:
      return paradigmThird(entry);
    default:
      throw new Error(
        `Detected ${d}th declension for "${entry.nominative}", but that engine is not implemented yet (only 1st\u20133rd are ready).`
      );
  }
}

// src/explain.ts
var ORDINAL = ["", "1st", "2nd", "3rd", "4th", "5th"];
var CASE_ROLE = {
  nominative: "the subject of the sentence (the one doing the action)",
  genitive: 'possession \u2014 "of" the noun',
  dative: 'the indirect object \u2014 "to" or "for" the noun',
  accusative: "the direct object (the one receiving the action)",
  ablative: '"by / with / from" the noun, and object of many prepositions',
  vocative: 'directly addressing someone \u2014 "O ..."'
};
var DECLENSION_NOTES = {
  1: {
    singular: {
      genitive: "The -ae ending marks genitive singular; it is also how you identify a 1st-declension noun.",
      dative: "Dative singular is -ae, identical in spelling to the genitive singular \u2014 context tells them apart.",
      accusative: "The -am ending marks the direct object in the singular.",
      ablative: "The long -\u0101 (with a macron) distinguishes ablative singular from the nominative -a.",
      vocative: "In the 1st declension the vocative is identical to the nominative."
    },
    plural: {
      genitive: 'The -\u0101rum ending means "of the ..." for plural nouns.',
      dative: "Dative and ablative plural share the ending -\u012Bs.",
      ablative: "Dative and ablative plural are both -\u012Bs \u2014 the case is disambiguated by context."
    }
  },
  2: {
    singular: {
      genitive: "The -\u012B ending marks the genitive singular of the 2nd declension.",
      accusative: "Masculine -um / neuter -um marks the direct object; for neuters it equals the nominative.",
      ablative: "Ablative singular is a short -\u014D in the 2nd declension.",
      vocative: "Masculine -us nouns take a special vocative -e (domine); -ius nouns contract to -\u012B (fil\u012B); -er/-ir nouns and all neuters keep the nominative form."
    },
    plural: {
      nominative: "Masculine plural is -\u012B; neuter plural is -a.",
      genitive: 'The -\u014Drum ending means "of the ..." in the 2nd declension.',
      dative: "Dative and ablative plural share -\u012Bs.",
      ablative: "Dative and ablative plural are both -\u012Bs."
    }
  },
  3: {
    singular: {
      genitive: "The -is ending marks the genitive singular \u2014 and it reveals the true stem, which the nominative often hides (r\u0113x \u2192 r\u0113g-).",
      dative: "Dative singular is -\u012B across the 3rd declension.",
      accusative: "Masculine/feminine take -em; neuters keep the nominative form.",
      ablative: "Ablative singular is -e for consonant stems, but -\u012B for neuter i-stems (mar\u012B, anim\u0101l\u012B)."
    },
    plural: {
      nominative: "Masculine/feminine plural is -\u0113s; neuters take -a (or -ia for i-stems).",
      genitive: "Genitive plural is -um for consonant stems but -ium for i-stems (civium, urbium, marium).",
      dative: "Dative and ablative plural share -ibus.",
      ablative: "Dative and ablative plural are both -ibus."
    }
  }
};
var GENERIC = {
  singular: {
    nominative: "The nominative singular is the dictionary form \u2014 the subject."
  },
  plural: {}
};
function explain(f, _opts = {}) {
  const numLabel = f.number === "singular" ? "singular" : "plural";
  const ord = ORDINAL[f.declension] ?? `${f.declension}th`;
  const declNotes = DECLENSION_NOTES[f.declension];
  const note = declNotes?.[f.number]?.[f.case] ?? GENERIC[f.number]?.[f.case] ?? `The ${f.case} ${numLabel} is formed with the ${ord}-declension ending for this case.`;
  return [
    `"${f.form}" is the ${f.case} ${numLabel} of ${f.lemma} (${f.gender}, ${ord} declension).`,
    `Use the ${f.case} for ${CASE_ROLE[f.case]}.`,
    note
  ].join(" ");
}

// web/playground.entry.ts
var STARTER_WORDS = [
  { nominative: "puella", genitive: "puellae", gender: "feminine", gloss: "girl (1st)" },
  { nominative: "agricola", genitive: "agricolae", gender: "masculine", gloss: "farmer (1st, masc.)" },
  { nominative: "dominus", genitive: "domin\u012B", gender: "masculine", gloss: "master (2nd)" },
  { nominative: "puer", genitive: "puer\u012B", gender: "masculine", gloss: "boy (2nd, keeps e)" },
  { nominative: "ager", genitive: "agr\u012B", gender: "masculine", gloss: "field (2nd, drops e)" },
  { nominative: "filius", genitive: "fil\u012B", gender: "masculine", gloss: "son (2nd, voc. fil\u012B)" },
  { nominative: "bellum", genitive: "bell\u012B", gender: "neuter", gloss: "war (2nd, neuter)" },
  { nominative: "r\u0113x", genitive: "r\u0113gis", gender: "masculine", iStem: false, gloss: "king (3rd, cons.)" },
  { nominative: "corpus", genitive: "corporis", gender: "neuter", iStem: false, gloss: "body (3rd, neuter)" },
  { nominative: "civis", genitive: "civis", gender: "masculine", iStem: true, gloss: "citizen (3rd, i-stem)" },
  { nominative: "urbs", genitive: "urbis", gender: "feminine", gloss: "city (3rd, i-stem)" },
  { nominative: "mare", genitive: "maris", gender: "neuter", gloss: "sea (3rd, neuter i-stem)" }
];
function run(entry) {
  try {
    const par = decline(entry);
    const byKey = /* @__PURE__ */ new Map();
    for (const cell of par.cells) {
      byKey.set(`${cell.case}:${cell.number}`, cell.form);
    }
    const rows = CASES.map((c) => ({
      case: c,
      singular: byKey.get(`${c}:singular`) ?? "",
      plural: byKey.get(`${c}:plural`) ?? ""
    }));
    const ablSg = par.cells.find(
      (c) => c.case === "ablative" && c.number === "singular"
    );
    const highlight = ablSg ? { label: `${ablSg.form} (ablative sg.)`, text: explain(ablSg) } : void 0;
    return {
      ok: true,
      lemma: par.lemma,
      declension: par.declension,
      gender: par.gender,
      rows,
      highlight
    };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : String(err) };
  }
}
if (typeof window !== "undefined") {
  window.latinkit = {
    run,
    STARTER_WORDS,
    detectDeclension,
    CASES,
    NUMBERS
  };
}
export {
  STARTER_WORDS,
  run
};
