const http=require('http'),fs=require('fs'),p=require('path');
const ROOT=process.argv[2]||__dirname, PORT=+(process.argv[3]||8742);
const TYPE={'.html':'text/html;charset=utf-8','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg',
 '.css':'text/css','.js':'text/javascript','.svg':'image/svg+xml','.webp':'image/webp','.ico':'image/x-icon'};
http.createServer((q,r)=>{
  let u=decodeURIComponent(q.url.split('?')[0]); if(u==='/')u='/index.html';
  const f=p.join(ROOT,u.replace(/^\/+/,''));
  fs.readFile(f,(e,d)=>{ if(e){r.writeHead(404);return r.end('not found');}
    r.writeHead(200,{'Content-Type':TYPE[p.extname(f).toLowerCase()]||'application/octet-stream'}); r.end(d);});
}).listen(PORT,()=>console.log('serving',ROOT,'on',PORT));
