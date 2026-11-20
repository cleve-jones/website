/* Checks every page at several widths:
   - no rendered text smaller than 10pt (13.333px)
   - no horizontal overflow
   - no console errors, failed requests, broken images or dead <use> refs
   - the logo lockup still aligns                                            */
const PAGES = ['index', 'about', 'our-work', 'give', 'media', 'events', 'contact'];
const WIDTHS = [390, 768, 1100, 1440];

const PROBE = `(() => {
  const small = new Map();
  const vis = el => { const r = el.getBoundingClientRect();
    return r.width > 0 && r.height > 0 && getComputedStyle(el).visibility !== 'hidden'; };
  for (const el of document.querySelectorAll('body *')) {
    if (el.closest('.sr-only') || el.classList.contains('sr-only')) continue;
    if (!vis(el)) continue;
    // only elements that actually render their own text
    let text = '';
    for (const n of el.childNodes) if (n.nodeType === 3) text += n.nodeValue.trim();
    if (!text) continue;
    const fs = parseFloat(getComputedStyle(el).fontSize);
    if (fs < 13.333 - 0.01) {
      const k = el.tagName.toLowerCase() + '.' + (el.className || '') + ' @' + fs.toFixed(2);
      if (!small.has(k)) small.set(k, text.slice(0, 40));
    }
  }
  const dead = [...document.querySelectorAll('use')]
    .filter(u => !document.querySelector(u.getAttribute('href'))).length;
  const broken = [...document.images].filter(i => i.complete && i.naturalWidth === 0).length;
  const sq = [...document.querySelectorAll('.hero-squares .sq')].map(s => {
    const r = s.getBoundingClientRect(), g = s.querySelector('svg').getBoundingClientRect();
    return (g.width / r.width).toFixed(3) + '/' + (r.width / r.height).toFixed(3);
  });
  const L = document.querySelector('.site-header .logo-text');
  let align = 'n/a';
  if (L) {
    const n = L.querySelector('.logo-name'), t = L.querySelector('.logo-tag');
    if (t && getComputedStyle(t).display !== 'none') {
      const rn = n.getBoundingClientRect(), rt = t.getBoundingClientRect();
      align = 'L' + (rn.left - rt.left).toFixed(2) + ' R' + (rn.right - rt.right).toFixed(2)
            + ' lines' + Math.round(rn.height / parseFloat(getComputedStyle(n).fontSize));
    } else align = 'tagline hidden';
  }
  return JSON.stringify({
    sw: document.documentElement.scrollWidth, vw: innerWidth,
    small: [...small.entries()], dead, broken, sq: [...new Set(sq)], align
  });
})()`;

async function tab() {
  const t = await (await fetch('http://127.0.0.1:9222/json/new?about:blank', { method: 'PUT' })).json();
  const ws = new WebSocket(t.webSocketDebuggerUrl);
  let id = 0; const pending = new Map(); const events = [];
  const send = (method, params = {}) => new Promise(res => {
    const m = { id: ++id, method, params }; pending.set(m.id, res); ws.send(JSON.stringify(m));
  });
  await new Promise(r => ws.addEventListener('open', r));
  ws.addEventListener('message', ev => {
    const m = JSON.parse(ev.data);
    if (m.id && pending.has(m.id)) { pending.get(m.id)(m.result); pending.delete(m.id); }
    else if (m.method === 'Log.entryAdded' && m.params.entry.level === 'error') events.push('LOG ' + m.params.entry.text);
    else if (m.method === 'Runtime.exceptionThrown') events.push('EXC ' + JSON.stringify(m.params.exceptionDetails.text));
    else if (m.method === 'Network.loadingFailed') events.push('NET ' + m.params.errorText);
  });
  await send('Page.enable'); await send('Log.enable'); await send('Runtime.enable'); await send('Network.enable');
  return { send, events, close: () => ws.close() };
}

(async () => {
  let bad = 0;
  for (const W of WIDTHS) {
    for (const p of PAGES) {
      const t = await tab();
      await t.send('Emulation.setDeviceMetricsOverride', { width: W, height: 900, deviceScaleFactor: 1, mobile: W < 900 });
      await t.send('Page.navigate', { url: `http://127.0.0.1:8731/${p}.html` });
      await new Promise(r => setTimeout(r, 1700));
      const r = await t.send('Runtime.evaluate', { expression: PROBE, returnByValue: true });
      const d = JSON.parse(r.result.value);
      const issues = [];
      if (d.sw > d.vw + 1) issues.push(`OVERFLOW sw=${d.sw}`);
      if (d.small.length) issues.push('SMALL TYPE ' + JSON.stringify(d.small));
      if (d.dead) issues.push(`DEAD USE ${d.dead}`);
      if (d.broken) issues.push(`BROKEN IMG ${d.broken}`);
      if (t.events.length) issues.push(t.events.join(' | '));
      if (issues.length) bad++;
      console.log(`${String(W).padStart(4)} ${p.padEnd(9)} ${issues.length ? 'FAIL  ' + issues.join('; ') : 'ok'}   sq=${d.sq.join(',')} logo=${d.align}`);
      await t.send('Page.close'); t.close();
    }
  }
  console.log(bad ? `\n${bad} page/width combinations with issues` : '\nall clean');
})();
