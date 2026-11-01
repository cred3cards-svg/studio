const fs=require('fs');
const levels=require('./levels.js');
const KEY="rk-dbg-lab";
const blob=(()=>{
  const b=Buffer.from(JSON.stringify(levels),'utf8');
  const o=Buffer.alloc(b.length);
  for(let i=0;i<b.length;i++) o[i]=b[i]^KEY.charCodeAt(i%KEY.length);
  return o.toString('base64');
})();
const t=fs.readFileSync('debug-template.html','utf8');
if(!t.includes('__BANK__')) throw new Error('placeholder missing');
fs.writeFileSync('debug-index.html', t.split('__BANK__').join(blob));
const out=fs.readFileSync('debug-index.html','utf8');
console.log('built debug-index.html', (out.length/1024).toFixed(1)+'KB');
// the broken code IS shown, but the answers must not be readable
for(const probe of ['"cat"','"line"','SYNTAX","line','0.48','Slowest reaction time']){
  console.log(`  leak ${JSON.stringify(probe)}:`, out.includes(probe));
}
