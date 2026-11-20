const s = require('fs').readFileSync(__dirname + '/build.js', 'utf8');
for (const id of ['i-bullhorn', 'i-brush', 'i-people', 'i-quilt']) {
  const m = s.match(new RegExp('<symbol id="' + id + '"[^>]*>([^]*?)</symbol>'));
  const body = m[1];
  const xs = [], ys = [];
  for (const d of [...body.matchAll(/ d="([^"]+)"/g)].map(x => x[1])) {
    const n = d.match(/-?\d+(?:\.\d+)?/g).map(Number);
    for (let i = 0; i < n.length; i += 2) { xs.push(n[i]); ys.push(n[i + 1]); }
  }
  for (const r of [...body.matchAll(/<rect x="([\d.]+)" y="([\d.]+)" width="([\d.]+)" height="([\d.]+)"/g)]) {
    const x = +r[1], y = +r[2], w = +r[3], h = +r[4];
    xs.push(x, x + w); ys.push(y, y + h);
  }
  const x0 = Math.min(...xs), x1 = Math.max(...xs), y0 = Math.min(...ys), y1 = Math.max(...ys);
  console.log(id.padEnd(12),
    'x', x0.toFixed(2), '..', x1.toFixed(2),
    '| y', y0.toFixed(2), '..', y1.toFixed(2),
    '| w', (x1 - x0).toFixed(1), 'h', (y1 - y0).toFixed(1),
    '| cx', ((x0 + x1) / 2).toFixed(1), 'cy', ((y0 + y1) / 2).toFixed(1));
}
