"""Draws the Cleve Jones Foundation logo as SVG outlines, fitted to the
November 2026 logo sheet ("CJF Logo 11-26.pdf").

The sheet's logo is a 300 ppi image (1741 x 575). The numbers below are pixel
positions measured on it: name ink 180-1557, tagline 309-338 high and
180-1558 wide, bars 396-419 high. Lora 500 and Inter 600 are shaped with
HarfBuzz (so kerning matches a browser), scaled to those edges, and the
tagline's tracking is solved so it ends exactly under the "n" of Foundation.

  pip install fonttools uharfbuzz
  python make-logo.py FONT_DIR > logo.svg      # FONT_DIR holds lora.ttf, inter.ttf
                                               # (static Lora 500 / Inter 600 from Google Fonts)

It also writes FONT_DIR/../sprite-logo.txt: the <defs> block pasted into the
SPRITE in _work/build.js.
"""
import sys, uharfbuzz as hb
from fontTools.ttLib import TTFont
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.pens.boundsPen import BoundsPen
D=sys.argv[1]
def shape(path,text,wght):
    blob=hb.Blob.from_file_path(path); face=hb.Face(blob); font=hb.Font(face)
    font.set_variations({'wght':wght})
    buf=hb.Buffer(); buf.add_str(text); buf.guess_segment_properties()
    hb.shape(font,buf,{"kern":True,"liga":True})
    tt=TTFont(path)
    try:
        from fontTools.varLib.instancer import instantiateVariableFont
        if 'fvar' in tt: tt=instantiateVariableFont(tt,{'wght':wght})
    except Exception as e: print(e,file=sys.stderr)
    gs=tt.getGlyphSet(); order=tt.getGlyphOrder(); upm=tt['head'].unitsPerEm
    glyphs=[]; x=0
    for info,pos in zip(buf.glyph_infos,buf.glyph_positions):
        glyphs.append((order[info.codepoint],x+pos.x_offset,pos.y_offset,info.cluster)); x+=pos.x_advance
    return gs,glyphs,upm
def ink(gs,glyphs,scale,track=0):
    bp=BoundsPen(gs); xs=[];res=[]
    for i,(g,x,y,c) in enumerate(glyphs):
        b=BoundsPen(gs); gs[g].draw(b)
        if b.bounds: res.append((x*scale+i*track+b.bounds[0]*scale, x*scale+i*track+b.bounds[2]*scale, b.bounds[1]*scale,b.bounds[3]*scale))
    return min(r[0] for r in res),max(r[1] for r in res),min(r[2] for r in res),max(r[3] for r in res)
def path(gs,glyphs,scale,x0,base,track=0):
    out=[]
    for i,(g,x,y,c) in enumerate(glyphs):
        p=SVGPathPen(gs,ntos=lambda v:('%.1f'%v).rstrip('0').rstrip('.'))
        gs[g].draw(TransformPen(p,(scale,0,0,-scale,x0+x*scale+i*track,base-y*scale)))
        out.append(p.getCommands())
    return ''.join(out)
# sheet geometry (pixels of the 300ppi sheet image), origin moved to the lockup's left edge
L,R=180,1561
ngs,ng,nupm=shape(D+'/lora.ttf','Cleve Jones Foundation',500)
a,b,lo,hi=ink(ngs,ng,1)
s=(1557-180)/(b-a)                      # name ink 180..1557
print('name font px',s*nupm,'ink h',(hi-lo)*s,'(sheet 98)',file=sys.stderr)
nbase=253 + lo*s if lo<0 else 253       # 253 = lowest ink row on sheet
nx=L-a*s
tgs,tg,tupm=shape(D+'/inter.ttf','ADVOCACY & ART FOR SOCIAL CHANGE',600)
capH=tgs['H']; bpn=BoundsPen(tgs); capH.draw(bpn); cap=bpn.bounds[3]
ts=30/cap*0.985                          # sheet band 309..338 incl. round overshoot
a2,b2,_,_=ink(tgs,tg,ts)
n=len(tg); track=((1558-180)-(b2-a2))/(n-1)
print('tag font px',ts*tupm,'tracking em',track/(ts*tupm),file=sys.stderr)
tx=L-a2*ts; tbase=338
W=R-L; top=156; H=419-top
nb=path(ngs,ng,s,nx-L,nbase-top); tb=path(tgs,tg,ts,tx-L,tbase-top,track)
bars=[(180,508),(531,859),(882,1210),(1233,1561)]
cls=['r','g','p','b']
svg=f'<svg class="logo-svg" viewBox="0 0 {W} {H}" role="img" aria-label="Cleve Jones Foundation — Advocacy &amp; Art for Social Change" xmlns="http://www.w3.org/2000/svg">'
svg+=f'<path class="logo-n" d="{nb}"/><path class="logo-t" d="{tb}"/>'
for (x0,x1),c in zip(bars,cls): svg+=f'<rect class="logo-{c}" x="{x0-L}" y="{396-top}" width="{x1-x0+1}" height="24"/>'
svg+='</svg>'
print(svg)
print('W',W,'H',H,file=sys.stderr)
# sprite fragment: shared glyph paths + two lockups
BY=396-top
def bars(y): return ''.join(f'<rect x="{x0-L}" y="{y}" width="{x1-x0+1}" height="24" fill="{c}"/>' for (x0,x1),c in zip(bars_,cols))
bars_=bars_l=[(180,508),(531,859),(882,1210),(1233,1561)]
cols=['#D2462E','#4E8A60','#7D3B76','#4459B0']
nameH=round(nbase-top)  # baseline row in lockup units
frag=(f'  <path id="logo-name" d="{nb}"/>\n'
 f'  <path id="logo-tag" d="{tb}"/>\n'
 f'  <symbol id="logo-full" viewBox="0 0 {W} {H}"><use href="#logo-name" fill="var(--logo-name,#1B2350)"/><use href="#logo-tag" fill="var(--logo-tag,#6B6660)"/>{bars(BY)}</symbol>\n'
 f'  <symbol id="logo-compact" viewBox="0 0 {W} {nameH+56+24}"><use href="#logo-name" fill="var(--logo-name,#1B2350)"/>{bars(nameH+56)}</symbol>')
open(D+'/../sprite-logo.txt','w').write(frag)
print('compact H',nameH+56+24,file=sys.stderr)
