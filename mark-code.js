#!/usr/bin/env node
// Unpack a result code from the programming task.
//   node mark-code.js <resultCode>
// Prints the submitted program plus the automated checks, ready for marking.
const zlib = require('zlib');

const raw = (process.argv[2] || '').trim();
if (!raw) { console.error('usage: node mark-code.js <resultCode>'); process.exit(1); }

let json;
try {
  if (raw.startsWith('C1:')) json = zlib.gunzipSync(Buffer.from(raw.slice(3), 'base64')).toString('utf8');
  else if (raw.startsWith('C0:')) json = Buffer.from(raw.slice(3), 'base64').toString('utf8');
  else json = Buffer.from(raw, 'base64').toString('utf8');
} catch (e) { console.error('That does not look like a result code.'); process.exit(1); }

const r = JSON.parse(json);
const when = r.end ? new Date(r.end).toISOString().replace('T', ' ').slice(0, 16) + ' UTC' : 'unknown';
const lines = (r.code || '').split('\n');

console.log(`${r.name} — programming task`);
console.log(`${r.task}`);
console.log(`Submitted ${when} · about ${r.mins} min · ${lines.length} lines · ${r.runs} test run(s) · ${r.pastes} paste attempt(s)\n`);

const c = r.checks || {};
if (c.stats) {
  const s = c.stats;
  console.log('Automated checks');
  console.log(`  syntax            ${s.syntax_ok ? 'parses cleanly' : 'ERROR — ' + s.syntax_error}`);
  console.log(`  arrays/lists      ${s.lists}`);
  console.log(`  loops             ${s.for_loops} for, ${s.while_loops} while`);
  console.log(`  branches          ${s.ifs} if`);
  console.log(`  input()/print()   ${s.inputs} / ${s.prints}`);
  console.log(`  built-ins used    ${['sum','len','max','min','append','round'].filter(k => s['uses_' + k]).join(', ') || 'none'}`);
  console.log(`  mentions houses   Saturn: ${s.names_saturn ? 'yes' : 'no'}, Mars: ${s.names_mars ? 'yes' : 'no'}`);
  console.log(`  comments          ${s.comments}`);
  if (s.short_names && s.short_names.length) console.log(`  short names       ${s.short_names.join(', ')}  (meaningful-identifier rule)`);
  console.log(`  identifiers       ${(s.identifiers || []).join(', ')}`);
} else {
  console.log('Automated checks did not run (Python failed to load on the candidate device).');
}

if (c.run) {
  console.log('\nLast run');
  console.log(`  inputs consumed   ${c.run.asked}`);
  console.log(`  error             ${c.run.err || 'none'}`);
  console.log('  output:');
  console.log((c.run.out || '(none)').replace(/^/gm, '    ').replace(/\s+$/, ''));
}

console.log('\n' + '-'.repeat(60));
console.log('SUBMITTED PROGRAM');
console.log('-'.repeat(60));
lines.forEach((l, i) => console.log(String(i + 1).padStart(3) + ' | ' + l));
