// latinkit public entry point.
export * from './types.js';
export {
  inflectFirst,
  paradigmFirst,
  firstDeclensionStem,
} from './firstDeclension.js';
export {
  inflectSecond,
  paradigmSecond,
  secondDeclensionStem,
} from './secondDeclension.js';
export {
  inflectThird,
  paradigmThird,
  thirdDeclensionStem,
  isIStem,
} from './thirdDeclension.js';
export {
  inflectFourth,
  paradigmFourth,
  fourthDeclensionStem,
} from './fourthDeclension.js';
export {
  inflectFifth,
  paradigmFifth,
  fifthDeclensionStem,
} from './fifthDeclension.js';
export {
  decline,
  detectDeclension,
} from './decline.js';
export type { Declension } from './decline.js';
export { explain } from './explain.js';
export type { ExplainOptions } from './explain.js';
