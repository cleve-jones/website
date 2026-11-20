/* render an SVG file to PNG at a given square size, transparent background */
const fs=require('fs');
const [,,svgPath,out,SIZE]=process.argv; const S=+SIZE;
(async()=>{
 const t=await (await fetch('http://127.0.0.1:9222/json/new?about:blank',{method:'PUT'})).json();
 const ws=new WebSocket(t.webSocketDebuggerUrl); let id=0; const pend=new Map();
 const send=(m,p={})=>new Promise(r=>{const x={id:++id,method:m,params:p};pend.set(x.id,r);ws.send(JSON.stringify(x));});
 await new Promise(r=>ws.addEventListener('open',r));
 ws.addEventListener('message',e=>{const m=JSON.parse(e.data);if(m.id&&pend.has(m.id)){pend.get(m.id)(m.result);pend.delete(m.id);}});
 await send('Page.enable');await send('Runtime.enable');
 await send('Emulation.setDeviceMetricsOverride',{width:S,height:S,deviceScaleFactor:1,mobile:false});
 await send('Emulation.setDefaultBackgroundColorOverride',{color:{r:0,g:0,b:0,a:0}});
 const svg=fs.readFileSync(svgPath,'utf8')
   .replace(/width="\d+" height="\d+"/, `width="${S}" height="${S}"`);
 const html='<!doctype html><meta charset="utf-8"><style>html,body{margin:0;padding:0;background:transparent}svg{display:block}</style>'+svg;
 await send('Page.navigate',{url:'data:text/html;charset=utf-8,'+encodeURIComponent(html)});
 await new Promise(r=>setTimeout(r,900));
 const shot=await send('Page.captureScreenshot',{format:'png',captureBeyondViewport:true,
   clip:{x:0,y:0,width:S,height:S,scale:1}});
 fs.writeFileSync(out,Buffer.from(shot.data,'base64'));
 console.log(out, S+'x'+S, fs.statSync(out).size+' bytes');
 await send('Page.close'); ws.close();
})();
