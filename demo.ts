import { paradigmFirst, inflectFirst, explain } from './src/index.js';
const puella = { nominative: 'puella', genitive: 'puellae', gender: 'feminine' as const };
console.log('=== puella 完整变格表 (girl) ===');
const par = paradigmFirst(puella);
const sg: string[] = [], pl: string[] = [];
for (const cell of par.cells) {
  const line = `${cell.case.padEnd(11)} ${cell.form}`;
  if (cell.number === 'singular') sg.push(line); else pl.push(line);
}
console.log('\nSINGULAR'); sg.forEach(l => console.log('  ' + l));
console.log('\nPLURAL'); pl.forEach(l => console.log('  ' + l));
console.log('\n=== "为什么" 讲解 (钩子功能) ===\n');
const ablSg = inflectFirst(puella, 'ablative', 'singular');
console.log('Q: puellā 是什么? 为什么?');
console.log('A: ' + explain(ablSg));
