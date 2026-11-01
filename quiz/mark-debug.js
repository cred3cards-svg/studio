#!/usr/bin/env node
// Mark a Debug Lab result code.
//   node mark-debug.js <resultCode>
// Reads the level bank out of index.html, so no plaintext answer key is stored.
const fs = require('fs'), path = require('path'), zlib = require('zlib');
const KEY = 'rk-dbg-lab';
const CATNAME = { SYNTAX:'Syntax', NAME:'Name', TYPE:'Type', INDEX:'Index', ZERO:'Div/zero', LOGIC:'Logic' };

function reveal(b64){
  const bin = Buffer.from(b64, 'base64'), out = Buffer.alloc(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin[i] ^ KEY.charCodeAt(i % KEY.length);
  return JSON.parse(out.toString('utf8'));
}
const page = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
const BANK = reveal(page.match(/var BANK_B64 = "([^"]+)"/)[1]);

const raw = (process.argv[2] || '').trim();
if (!raw) { console.error('usage: node mark-debug.js <resultCode>'); process.exit(1); }
let json;
try {
  if (raw.startsWith('D1:')) json = zlib.gunzipSync(Buffer.from(raw.slice(3), 'base64')).toString('utf8');
  else if (raw.startsWith('D0:')) json = Buffer.from(raw.slice(3), 'base64').toString('utf8');
  else json = Buffer.from(raw, 'base64').toString('utf8');
} catch (e) { console.error('That does not look like a Debug Lab result code.'); process.exit(1); }
const r = JSON.parse(json);

const repairPts = row => row.skipped || !row.passed ? 0 : Math.max(3, 7 - row.attempts);
let diagCat = 0, diagLine = 0, repair = 0, fixed = 0, skipped = 0, totalAttempts = 0;

const lines = r.rows.map((row, i) => {
  const c = row.catOk ? 2 : 0, l = row.lineOk ? 2 : 0, rp = repairPts(row);
  diagCat += c; diagLine += l; repair += rp;
  if (row.passed) fixed++;
  if (row.skipped) skipped++;
  totalAttempts += row.attempts;
  return { n: i + 1, row, c, l, rp, total: c + l + rp };
});
const score = diagCat + diagLine + repair, max = r.rows.length * 10;
const pct = Math.round(score / max * 100);
const grade = pct >= 90 ? 'A*' : pct >= 80 ? 'A' : pct >= 70 ? 'B' : pct >= 60 ? 'C' : pct >= 50 ? 'D' : pct >= 40 ? 'E' : 'U';
const when = r.end ? new Date(r.end).toISOString().replace('T',' ').slice(0,16) + ' UTC' : 'unknown';

console.log(`${r.name} — Debug Lab`);
console.log(`${score}/${max}  (${pct}%, grade ${grade})`);
console.log(`Submitted ${when} · about ${r.mins} min · ${fixed}/${r.rows.length} repaired · ${skipped} skipped · ${totalAttempts} total attempts · ${r.pastes} paste attempt(s)\n`);

console.log(`Diagnosis   ${diagCat / 2}/${r.rows.length} error types,  ${diagLine / 2}/${r.rows.length} fault lines   (${diagCat + diagLine}/${r.rows.length * 4})`);
console.log(`Repair      ${repair}/${r.rows.length * 6}\n`);

console.log('Level by level');
console.log('  #  type            line        repair        pts  title');
lines.forEach(({ n, row, c, l, rp, total }) => {
  const type = row.catOk ? `ok (${CATNAME[row.catRight]})`
                         : `${CATNAME[row.catGiven] || '—'}→${CATNAME[row.catRight]}`;
  const ln = row.lineOk ? `ok (${row.lineRight})` : `${row.lineGiven ?? '—'}→${row.lineRight}`;
  const rep = row.skipped ? 'skipped' : row.passed ? `${row.attempts} attempt${row.attempts === 1 ? '' : 's'}` : 'not fixed';
  console.log(`  ${String(n).padStart(2)}  ${type.padEnd(15)} ${ln.padEnd(11)} ${rep.padEnd(13)} ${String(total).padStart(2)}  ${row.title}`);
});

const weakType = lines.filter(x => !x.row.catOk);
const weakLine = lines.filter(x => !x.row.lineOk);
const hard = lines.filter(x => x.row.attempts > 2 || x.row.skipped || !x.row.passed);
console.log('\nWhere he struggled');
if (!weakType.length && !weakLine.length && !hard.length) console.log('  Nowhere — clean run.');
if (weakType.length) console.log('  Misread the error type on: ' + weakType.map(x => `L${x.n} (said ${CATNAME[x.row.catGiven] || '—'}, was ${CATNAME[x.row.catRight]})`).join(', '));
if (weakLine.length) console.log('  Pointed at the wrong line on: ' + weakLine.map(x => `L${x.n} (said ${x.row.lineGiven ?? '—'}, was ${x.row.lineRight})`).join(', '));
if (hard.length) console.log('  Took longest to repair: ' + hard.map(x => `L${x.n} ${x.row.title} (${x.row.skipped ? 'skipped' : x.row.passed ? x.row.attempts + ' attempts' : 'never fixed'})`).join(', '));

console.log('\n' + '-'.repeat(62));
console.log('HIS FINAL CODE PER LEVEL');
console.log('-'.repeat(62));
r.rows.forEach((row, i) => {
  console.log(`\n### L${i + 1} ${row.title} — ${row.skipped ? 'SKIPPED' : row.passed ? 'repaired' : 'NOT FIXED'}`);
  console.log(row.code.split('\n').map((l, k) => String(k + 1).padStart(3) + ' | ' + l).join('\n'));
});
