/* screenshot one element: node clip.js <url> <selector> <out.png> [width] [scale] */
const fs=require('fs');
const [,,url,sel,out,W,SC]=process.argv;
(async()=>{
 const t=await (await fetch('http://127.0.0.1:9222/json/new?about:blank',{method:'PUT'})).json();
 const ws=new WebSocket(t.webSocketDebuggerUrl); let id=0; const pend=new Map();
 const send=(m,p={})=>new Promise(r=>{const x={id:++id,method:m,params:p};pend.set(x.id,r);ws.send(JSON.stringify(x));});
 await new Promise(r=>ws.addEventListener('open',r));
 ws.addEventListener('message',e=>{const m=JSON.parse(e.data);if(m.id&&pend.has(m.id)){pend.get(m.id)(m.result);pend.delete(m.id);}});
 await send('Page.enable');await send('Runtime.enable');
 await send('Emulation.setDeviceMetricsOverride',{width:+(W||1440),height:900,deviceScaleFactor:+(SC||2),mobile:+(W||1440)<900});
 await send('Page.navigate',{url}); await new Promise(r=>setTimeout(r,2200));
 const r=await send('Runtime.evaluate',{expression:`(()=>{const e=document.querySelector(${JSON.stringify(sel)});
   const b=e.getBoundingClientRect();return JSON.stringify({x:b.x,y:b.y+scrollY,w:b.width,h:b.height})})()`,returnByValue:true});
 const b=JSON.parse(r.result.value);
 const shot=await send('Page.captureScreenshot',{format:'png',captureBeyondViewport:true,
   clip:{x:Math.max(0,b.x-8),y:Math.max(0,b.y-8),width:b.w+16,height:b.h+16,scale:+(SC||2)}});
 fs.writeFileSync(out,Buffer.from(shot.data,'base64'));
 console.log(out,JSON.stringify(b));
 await send('Page.close'); ws.close();
})();
