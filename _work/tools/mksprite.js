const fs=require('fs'), path=require('path');
const env=Object.fromEntries(fs.readFileSync(path.join(__dirname,'paths.env'),'utf8')
  .trim().split('\n').map(l=>{const i=l.indexOf('=');return [l.slice(0,i),l.slice(i+1)];}));

/* drop the stray dash fragment the quilt trace leaves at the frame corner:
   keep only subpaths whose bounding box is a full inner square */
const big = d => d.split('Z').filter(Boolean).map(s=>s+'Z').filter(s=>{
  const n=s.match(/-?\d+(\.\d+)?/g).map(Number);
  const xs=n.filter((_,i)=>i%2===0), ys=n.filter((_,i)=>i%2===1);
  return Math.max(...xs)-Math.min(...xs) > 20;
}).join('');

const QUILT_SQ = (() => {
  const S=45.8, X=[50.8,104.6], Y=[50.4,104.2];
  const r=(x,y,op)=>`<rect x="${x}" y="${y}" width="${S}" height="${S}" fill="currentColor"${op?` opacity="${op}"`:''}/>`;
  return r(X[0],Y[0])+r(X[1],Y[0],'.6')+r(X[0],Y[1],'.6')+r(X[1],Y[1]);
})();
const QUILT_FRAME =
  '<rect x="41.8" y="41.8" width="117.6" height="117.6" fill="none" stroke="currentColor" stroke-width="2.1" stroke-dasharray="5.2 6"/>';

const ICONS = {
  'i-bullhorn': `<path fill="currentColor" d="${env.BULLHORN_W}"/>`,
  'i-brush'   : `<path fill="currentColor" opacity=".7" d="${env.BRUSH_F}"/><path fill="currentColor" d="${env.BRUSH_W}"/>`,
  'i-people'  : `<path fill="currentColor" d="${env.PEOPLE_W}"/>`,
  'i-quilt'   : QUILT_FRAME + QUILT_SQ
};

let out = '';
for (const [id, body] of Object.entries(ICONS))
  out += `  <symbol id="${id}" viewBox="0 0 200 200">${body}</symbol>\n`;

/* the full four-square mark: tiles 216 wide, 21 gap, 453 overall — the real
   proportions, measured off the strategy deck's own artwork */
const TILES=[['i-bullhorn','#C2553A',0,0],['i-brush','#6F8F78',237,0],
             ['i-people','#C9A227',0,237],['i-quilt','#2B3A73',237,237]];
out += `  <symbol id="i-mark" viewBox="0 0 453 453">\n`;
for (const [id,col,tx,ty] of TILES){
  out += `    <rect x="${tx}" y="${ty}" width="216" height="216" rx="8.5" fill="${col}"/>\n`;
  out += `    <g transform="translate(${tx},${ty}) scale(1.08)" color="#fff">${ICONS[id]}</g>\n`;
}
out += `  </symbol>\n`;
fs.writeFileSync(path.join(__dirname,'sprite-icons.html'), out);
console.log(out.length+' bytes written');
