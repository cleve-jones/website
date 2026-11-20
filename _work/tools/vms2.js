const WIDTHS=[390,768,1100,1440];
const PROBE=`(() => {
  const out={sw:document.documentElement.scrollWidth,vw:innerWidth,small:[],align:[]};
  const vis=el=>{const r=el.getBoundingClientRect();return r.width>0&&r.height>0;};
  const seen=new Set();
  for(const el of document.querySelectorAll('body *')){
    if(!vis(el))continue;
    let t='';for(const n of el.childNodes)if(n.nodeType===3)t+=n.nodeValue.trim();
    if(!t)continue;
    const fs=parseFloat(getComputedStyle(el).fontSize);
    if(fs<13.333-0.01){const k=el.tagName+'.'+el.className+'@'+fs.toFixed(2);if(!seen.has(k)){seen.add(k);out.small.push(k+' :: '+t.slice(0,30));}}
  }
  document.querySelectorAll('.lockup.col').forEach((l,i)=>{
    const rowEl=l.querySelector('.tilerow')||l.querySelector('.rulerow');
    const n=l.querySelector('.name');
    if(!rowEl||!n)return;
    const a=rowEl.getBoundingClientRect(),b=n.getBoundingClientRect();
    const first=rowEl.firstElementChild.getBoundingClientRect();
    const last=rowEl.lastElementChild.getBoundingClientRect();
    out.align.push(i+' L'+(first.left-b.left).toFixed(2)+' R'+(last.right-b.right).toFixed(2));
  });
  out.broken=[...document.images].filter(i=>i.complete&&i.naturalWidth===0).length;
  return JSON.stringify(out);
})()`;
async function tab(){
  const t=await (await fetch('http://127.0.0.1:9222/json/new?about:blank',{method:'PUT'})).json();
  const ws=new WebSocket(t.webSocketDebuggerUrl);let id=0;const p=new Map();const ev=[];
  const send=(m,q={})=>new Promise(r=>{const x={id:++id,method:m,params:q};p.set(x.id,r);ws.send(JSON.stringify(x));});
  await new Promise(r=>ws.addEventListener('open',r));
  ws.addEventListener('message',e=>{const m=JSON.parse(e.data);
    if(m.id&&p.has(m.id)){p.get(m.id)(m.result);p.delete(m.id);}
    else if(m.method==='Log.entryAdded'&&m.params.entry.level==='error')ev.push('LOG '+m.params.entry.text);
    else if(m.method==='Runtime.exceptionThrown')ev.push('EXC '+JSON.stringify(m.params.exceptionDetails.text));
    else if(m.method==='Network.loadingFailed')ev.push('NET '+m.params.errorText);});
  await send('Page.enable');await send('Log.enable');await send('Runtime.enable');await send('Network.enable');
  return {send,ev,close:()=>ws.close()};
}
(async()=>{
 for(const W of WIDTHS){
  const t=await tab();
  await t.send('Emulation.setDeviceMetricsOverride',{width:W,height:900,deviceScaleFactor:1,mobile:W<900});
  await t.send('Page.navigate',{url:'http://127.0.0.1:8744/mark-studies-2.html'});
  await new Promise(r=>setTimeout(r,2000));
  const r=await t.send('Runtime.evaluate',{expression:PROBE,returnByValue:true});
  const d=JSON.parse(r.result.value);
  const bad=[];
  if(d.sw>d.vw+1)bad.push('OVERFLOW '+d.sw+'>'+d.vw);
  if(d.small.length)bad.push('SMALL '+JSON.stringify(d.small));
  if(d.broken)bad.push('BROKENIMG');
  if(t.ev.length)bad.push(t.ev.join(' | '));
  console.log(W, bad.length?'FAIL '+bad.join('; '):'ok', '| align:', d.align.join('  '));
  await t.send('Page.close');t.close();
 }
})();
