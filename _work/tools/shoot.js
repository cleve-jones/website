/* CDP screenshotter:真 device emulation, full-page capture.
   usage: node shoot.js <url> <out.png> <width> [height] */
const fs = require('fs');

const [, , url, out, wArg, hArg] = process.argv;
const W = Number(wArg) || 390;
const H = Number(hArg) || 844;

async function main() {
  const list = await (await fetch('http://127.0.0.1:9222/json/new?about:blank', { method: 'PUT' })).json();
  const ws = new WebSocket(list.webSocketDebuggerUrl);
  let id = 0;
  const pending = new Map();

  const send = (method, params = {}) => new Promise(res => {
    const msg = { id: ++id, method, params };
    pending.set(msg.id, res);
    ws.send(JSON.stringify(msg));
  });

  await new Promise(r => ws.addEventListener('open', r));
  ws.addEventListener('message', ev => {
    const m = JSON.parse(ev.data);
    if (m.id && pending.has(m.id)) { pending.get(m.id)(m.result); pending.delete(m.id); }
  });

  await send('Page.enable');
  await send('Emulation.setDeviceMetricsOverride', {
    width: W, height: H, deviceScaleFactor: 2, mobile: W < 900
  });
  await send('Page.navigate', { url });
  await new Promise(r => setTimeout(r, 2500));

  const metrics = await send('Page.getLayoutMetrics');
  const vw = await send('Runtime.evaluate', {
    expression: 'JSON.stringify({vw:innerWidth,sw:document.documentElement.scrollWidth,sh:document.documentElement.scrollHeight})',
    returnByValue: true
  });
  console.log(out, vw.result.value);

  const full = Math.min(metrics.cssContentSize.height, 16000);
  await send('Emulation.setDeviceMetricsOverride', {
    width: W, height: Math.ceil(full), deviceScaleFactor: 1, mobile: W < 900
  });
  await new Promise(r => setTimeout(r, 600));
  const shot = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: true });
  fs.writeFileSync(out, Buffer.from(shot.data, 'base64'));
  await send('Page.close');
  ws.close();
}
main().catch(e => { console.error(e); process.exit(1); });
