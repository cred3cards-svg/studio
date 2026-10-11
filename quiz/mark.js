#!/usr/bin/env node
// Mark a result code from the First Semester CS paper.
//   node mark.js <resultCode>
// Reads the question bank out of index.html, so there is no plaintext answer key on disk.
const fs = require('fs'), path = require('path');
const KEY = 'rk-cs-sem1';

function reveal(b64) {
  const bin = Buffer.from(b64, 'base64');
  const out = Buffer.alloc(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin[i] ^ KEY.charCodeAt(i % KEY.length);
  return JSON.parse(out.toString('utf8'));
}

const page = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
const { t: TOPICS, b: BANK } = reveal(page.match(/var BANK_B64 = "([^"]+)"/)[1]);

const code = (process.argv[2] || '').trim();
if (!code) { console.error('usage: node mark.js <resultCode>'); process.exit(1); }
let r;
try { r = JSON.parse(Buffer.from(code, 'base64').toString('utf8')); }
catch (e) { console.error('That does not look like a result code.'); process.exit(1); }

const pct = Math.round(r.score / r.total * 100);
const grade = pct >= 90 ? 'A*' : pct >= 80 ? 'A' : pct >= 70 ? 'B' : pct >= 60 ? 'C' : pct >= 50 ? 'D' : pct >= 40 ? 'E' : 'U';
const when = r.end ? new Date(r.end).toISOString().replace('T', ' ').slice(0, 16) + ' UTC' : 'unknown';

console.log(`${r.name} — ${r.score}/${r.total}  (${pct}%, grade ${grade})`);
console.log(`Submitted ${when} · about ${r.mins} min · ${r.blank} left blank\n`);

console.log('By topic, weakest first');
Object.entries(r.topics)
  .sort((a, b) => a[1][0] / a[1][1] - b[1][0] / b[1][1])
  .forEach(([name, [c, n]]) => {
    const p = Math.round(c / n * 100);
    const bar = '#'.repeat(Math.round(p / 10)).padEnd(10, '.');
    console.log(`  ${bar} ${String(p).padStart(3)}%  ${String(c).padStart(2)}/${n}  ${name}`);
  });

if (!r.wrong.length) { console.log('\nFull marks — nothing missed.'); process.exit(0); }
console.log(`\nMissed ${r.wrong.length} question${r.wrong.length === 1 ? '' : 's'}`);
r.wrong.forEach(n => {
  const q = BANK[n - 1];
  const blank = r.chosen && r.chosen[n - 1] === '-';
  console.log(`\n  Q${n}  [${TOPICS[q.t]}]${blank ? '  (left blank)' : ''}`);
  console.log(`  ${q.q}`);
  console.log(`  Correct: ${q.o[q.k]}`);
});
