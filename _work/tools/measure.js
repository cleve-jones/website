const [,,url,expr,W]=process.argv;
(async()=>{
 const t=await (await fetch('http://127.0.0.1:9222/json/new?about:blank',{method:'PUT'})).json();
 const ws=new WebSocket(t.webSocketDebuggerUrl); let id=0; const pend=new Map();
 const send=(m,p={})=>new Promise(r=>{const x={id:++id,method:m,params:p};pend.set(x.id,r);ws.send(JSON.stringify(x));});
 await new Promise(r=>ws.addEventListener('open',r));
 ws.addEventListener('message',e=>{const m=JSON.parse(e.data);if(m.id&&pend.has(m.id)){pend.get(m.id)(m.result);pend.delete(m.id);}});
 await send('Page.enable');await send('Runtime.enable');
 await send('Emulation.setDeviceMetricsOverride',{width:+(W||1440),height:900,deviceScaleFactor:1,mobile:+(W||1440)<900});
 await send('Page.navigate',{url});
 await new Promise(r=>setTimeout(r,2000));
 const res=await send('Runtime.evaluate',{expression:expr,returnByValue:true,awaitPromise:true});
 console.log(typeof res.result.value==='string'?res.result.value:JSON.stringify(res.result.value,null,1));
 await send('Page.close'); ws.close();
})();
