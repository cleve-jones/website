const fs=require('fs'), path=require('path');
const {PNG}=require(path.join(__dirname,'node_modules','pngjs'));
const p=PNG.sync.read(fs.readFileSync(process.argv[2]));
const [y0,y1]=process.argv[3].split(',').map(Number);
const {width:W,data:D}=p;
const dark=x=>{for(let y=y0;y<=y1;y++){const i=(y*W+x)*4;
  if(D[i+3]>120 && (D[i]+D[i+1]+D[i+2])/3 < 170) return true;} return false;};
let runs=[],cur=null;
for(let x=0;x<W;x++){ if(dark(x)){ if(cur===null)cur=x; } else if(cur!==null){ runs.push([cur,x-1]); cur=null; } }
if(cur!==null)runs.push([cur,W-1]);
// merge runs separated by < 4px (letter gaps), leaving word gaps
const words=[]; for(const r of runs){ const last=words[words.length-1];
  if(last && r[0]-last[1] < +process.argv[4]) last[1]=r[1]; else words.push([...r]); }
const total=words[words.length-1][1]-words[0][0]+1;
console.log('ink span', words[0][0],'..',words[words.length-1][1],' width',total);
words.forEach((w,i)=>{ const g=i?w[0]-words[i-1][1]-1:0;
  console.log(`  word ${i+1}: x ${w[0]}..${w[1]} (w ${w[1]-w[0]+1})` + (i?`   gap before = ${g}  = ${(g/total*100).toFixed(2)}% of lockup`:''));});
