const fs=require('fs'), path=require('path');
const {PNG}=require(path.join(__dirname,'node_modules','pngjs'));

function load(f){const p=PNG.sync.read(fs.readFileSync(f));return p;}
const dist=(a,b)=>Math.hypot(a[0]-b[0],a[1]-b[1],a[2]-b[2]);

/* classify each pixel to nearest palette entry; return binary mask for index `want` */
function mask(p,palette,want){
  const {width:W,height:H,data:D}=p, m=new Uint8Array(W*H);
  for(let i=0;i<W*H;i++){
    const c=[D[i*4],D[i*4+1],D[i*4+2]];
    let best=0,bd=1e9;
    for(let k=0;k<palette.length;k++){const d=dist(c,palette[k]); if(d<bd){bd=d;best=k;}}
    m[i]=best===want?1:0;
  }
  return m;
}

/* marching squares on a binary mask -> array of closed contours (pixel-corner coords) */
function contours(m,W,H){
  // edge set: for every cell corner grid (W+1)x(H+1); walk boundaries between 1 and 0
  const at=(x,y)=> (x<0||y<0||x>=W||y>=H)?0:m[y*W+x];
  const seen=new Set(), out=[];
  // horizontal edges: between (x,y-1) and (x,y) -> edge from (x,y) to (x+1,y)
  const key=(x,y,d)=>x+','+y+','+d;
  // build directed edges so the filled region is on the left
  const edges=new Map();
  const add=(ax,ay,bx,by)=>{const k=ax+','+ay; if(!edges.has(k))edges.set(k,[]); edges.get(k).push([bx,by]);};
  for(let y=0;y<=H;y++)for(let x=0;x<=W;x++){
    const up=at(x,y-1), left=at(x-1,y), cur=at(x,y), ul=at(x-1,y-1);
    // vertical edge at (x,y)-(x,y+1): between left cell (x-1,y) and right cell (x,y)
    if(y<H){ if(left===1&&cur===0) add(x,y+1,x,y); else if(left===0&&cur===1) add(x,y,x,y+1); }
    // horizontal edge at (x,y)-(x+1,y): between up cell (x,y-1) and down cell (x,y)
    if(x<W){ if(up===1&&cur===0) add(x,y,x+1,y); else if(up===0&&cur===1) add(x+1,y,x,y); }
  }
  const used=new Set();
  for(const [k,list] of edges){
    for(const target of list){
      const ek=k+'>'+target[0]+','+target[1];
      if(used.has(ek))continue;
      // walk
      let [cx,cy]=k.split(',').map(Number), ring=[[cx,cy]];
      let nx=target[0],ny=target[1], guard=0;
      used.add(ek);
      while(guard++<1e6){
        ring.push([nx,ny]);
        if(nx===+k.split(',')[0]&&ny===+k.split(',')[1])break;
        const nk=nx+','+ny, outs=edges.get(nk);
        if(!outs)break;
        let picked=null;
        for(const t of outs){ const tk=nk+'>'+t[0]+','+t[1]; if(!used.has(tk)){picked=t;used.add(tk);break;} }
        if(!picked)break;
        [nx,ny]=picked;
      }
      if(ring.length>4) out.push(ring);
    }
  }
  return out;
}

/* Douglas-Peucker */
function dp(pts,tol){
  if(pts.length<3)return pts;
  const d2=(p,a,b)=>{const dx=b[0]-a[0],dy=b[1]-a[1];const L=dx*dx+dy*dy;
    if(!L)return (p[0]-a[0])**2+(p[1]-a[1])**2;
    let t=((p[0]-a[0])*dx+(p[1]-a[1])*dy)/L; t=Math.max(0,Math.min(1,t));
    return (p[0]-a[0]-t*dx)**2+(p[1]-a[1]-t*dy)**2;};
  const keep=new Uint8Array(pts.length); keep[0]=keep[pts.length-1]=1;
  const st=[[0,pts.length-1]];
  while(st.length){const [a,b]=st.pop(); let mi=-1,md=0;
    for(let i=a+1;i<b;i++){const d=d2(pts[i],pts[a],pts[b]); if(d>md){md=d;mi=i;}}
    if(mi>=0&&md>tol*tol){keep[mi]=1;st.push([a,mi],[mi,b]);}}
  return pts.filter((_,i)=>keep[i]);
}

function toPath(rings,scale,tol,prec){
  const r=n=>{const v=n*scale; return (Math.round(v*10**prec)/10**prec);};
  return rings.map(ring=>{
    let p=dp(ring,tol);
    if(p.length>2 && p[0][0]===p[p.length-1][0] && p[0][1]===p[p.length-1][1]) p=p.slice(0,-1);
    if(p.length<3)return '';
    return 'M'+p.map(([x,y],i)=>(i?'L':'')+r(x)+' '+r(y)).join('')+'Z';
  }).filter(Boolean).join('');
}

/* remove mask components that touch the image border — the tile's rounded
   corners let the white page through and would otherwise trace as icon */
function dropBorder(m,W,H){
  const q=[],seen=new Uint8Array(W*H);
  const push=(x,y)=>{if(x<0||y<0||x>=W||y>=H)return;const i=y*W+x;if(seen[i]||!m[i])return;seen[i]=1;q.push(i);};
  for(let x=0;x<W;x++){push(x,0);push(x,H-1);}
  for(let y=0;y<H;y++){push(0,y);push(W-1,y);}
  while(q.length){const i=q.pop();m[i]=0;const x=i%W,y=(i/W)|0;push(x+1,y);push(x-1,y);push(x,y+1);push(x,y-1);}
  return m;
}
module.exports={load,mask,contours,toPath,dropBorder};

if(require.main===module){
  const [,,file,wantIdx,...pal]=process.argv;
  const p=load(file);
  const palette=pal.map(s=>s.split(',').map(Number));
  let m;
  if(process.env.TIGHT){                      /* colour-distance threshold */
    const T=+process.env.TIGHT, {width:W,height:H,data:D}=p, t=palette[+wantIdx];
    m=new Uint8Array(W*H);
    for(let i=0;i<W*H;i++) m[i]=dist([D[i*4],D[i*4+1],D[i*4+2]],t)<T?1:0;
  } else m=mask(p,palette,+wantIdx);
  if(process.env.OPEN){                       /* erode then dilate: kills AA haloes */
    const r=+process.env.OPEN, W=p.width, H=p.height;
    const sweep=(src,want)=>{           /* 1 where any neighbour within r equals `want` */
      const o=new Uint8Array(W*H);
      for(let y=0;y<H;y++)for(let x=0;x<W;x++){let hit=0;
        for(let dy=-r;dy<=r&&!hit;dy++)for(let dx=-r;dx<=r&&!hit;dx++){
          if(dx*dx+dy*dy>r*r)continue;
          const nx=x+dx,ny=y+dy;
          const v=(nx<0||ny<0||nx>=W||ny>=H)?0:src[ny*W+nx];
          if(v===want)hit=1;}
        o[y*W+x]=hit;}
      return o;};
    const erode=s=>{const n=sweep(s,0);const o=new Uint8Array(W*H);
      for(let i=0;i<W*H;i++)o[i]=n[i]?0:1; return o;};
    m=sweep(erode(m),1);               /* open = erode then dilate */
  }
  m=dropBorder(m,p.width,p.height);
  const rings=contours(m,p.width,p.height);
  const tol=+(process.env.TOL||0.9);
  console.log(toPath(rings,200/p.width,tol,2));
}
