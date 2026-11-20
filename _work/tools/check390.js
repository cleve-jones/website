const PAGES=['index','about','our-work','give','media','events','contact'];
const BASE='http://localhost:8731/';
async function one(name,W){
  const t=await (await fetch('http://127.0.0.1:9222/json/new?about:blank',{method:'PUT'})).json();
  const ws=new WebSocket(t.webSocketDebuggerUrl); let id=0; const pend=new Map();
  const send=(m,p={})=>new Promise(r=>{const x={id:++id,method:m,params:p};pend.set(x.id,r);ws.send(JSON.stringify(x));});
  await new Promise(r=>ws.addEventListener('open',r));
  ws.addEventListener('message',e=>{const m=JSON.parse(e.data);if(m.id&&pend.has(m.id)){pend.get(m.id)(m.result);pend.delete(m.id);}});
  await send('Page.enable');await send('Runtime.enable');
  await send('Emulation.setDeviceMetricsOverride',{width:W,height:844,deviceScaleFactor:1,mobile:W<900});
  await send('Page.navigate',{url:BASE+name+'.html'});
  await new Promise(r=>setTimeout(r,1800));
  const r=await send('Runtime.evaluate',{returnByValue:true,awaitPromise:true,expression:`(async()=>{await document.fonts.ready;
    const marks=[...document.querySelectorAll('.logo-mark')].map(function(m){const b=m.getBoundingClientRect();
      return Math.round(b.width)+'x'+Math.round(b.height);});
    let n=document.querySelector('.site-header .logo-name'), t=document.querySelector('.site-header .logo-tag');
    const ink=function(e){const q=document.createRange();q.selectNodeContents(e);const b=q.getBoundingClientRect();return b;};
    /* the logo is drawn as SVG outlines now, so its alignment is fixed; only
       measure it if a live-text logo ever comes back */
    if(!n||!t){ n=t=document.body; }
    const a=n===document.body?{left:0,right:0}:ink(n), b=n===document.body?{left:0,right:0}:ink(t), ls=n===document.body?0:(parseFloat(getComputedStyle(t).letterSpacing)||0);
    return JSON.stringify({scrollW:document.documentElement.scrollWidth, marks:marks,
      nameLines:n===document.body?1:n.getClientRects().length,
      leftDelta:+(a.left-b.left).toFixed(2), rightDelta:+(a.right-(b.right-ls)).toFixed(2),
      brokenImgs:[...document.images].filter(function(i){return i.complete&&i.naturalWidth===0;}).length,
      emptyUses:[...document.querySelectorAll('use')].filter(function(u){
        return !document.querySelector(u.getAttribute('href'));}).length});})()`});
  await send('Page.close'); ws.close();
  return JSON.parse(r.result.value);
}
(async()=>{ for(const W of [390,1440]){ console.log('--- viewport '+W+' ---');
  for(const p of PAGES){ const r=await one(p,W);
    const ok = r.scrollW<=W && r.brokenImgs===0 && r.emptyUses===0 && r.nameLines===1 &&
               Math.abs(r.leftDelta)<0.6 && Math.abs(r.rightDelta)<0.6 &&
               r.marks.every(m=>m.split('x')[0]===m.split('x')[1]);
    console.log((ok?'✓ ':'✗ ')+p.padEnd(10), 'scrollW',r.scrollW, '| marks',r.marks.join(','),
      '| wordmark lines',r.nameLines, '| align L',r.leftDelta,'R',r.rightDelta,
      '| brokenImgs',r.brokenImgs,'| deadUse',r.emptyUses); } } })();
