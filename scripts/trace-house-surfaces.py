"""Trace one fill outline per surface (roof, siding, ...) from the services house line drawing.

Writes app/components/services-house-surfaces.ts, plus a debug preview in the system temp folder.
Needs: pip install opencv-python-headless numpy pillow
Run from the repo root: python scripts/trace-house-surfaces.py

How it works: the drawing is opaque linework on transparency, so every white cell between lines
(each shingle, siding board, picket, slab) is its own connected region. Rough per-surface areas,
plus cell shape (shingles are small, siding boards long and thin), decide which cells belong to
which surface. Each surface's cells are then merged across the lines between them and traced.
The numbered region IDs refer to this exact image; re-check them if the drawing changes.
"""
import json, os, tempfile, numpy as np, cv2
from PIL import Image, ImageDraw
SRC="public/images/services-house.png"
OUT="app/components/services-house-surfaces.ts"
alpha=np.array(Image.open(SRC).convert("RGBA"))[...,3]
H,W=alpha.shape
line=(alpha>100).astype(np.uint8)
n,lab,st,cent=cv2.connectedComponentsWithStats((1-line).astype(np.uint8),connectivity=4)
areas=st[:,4]

def poly_mask(polys):
    m=Image.new("L",(W,H),0); d=ImageDraw.Draw(m)
    for p in polys: d.polygon([tuple(q) for q in p],fill=1)
    return np.array(m,dtype=bool)

def frac_inside(mask):
    inside=np.bincount(lab[mask].ravel(),minlength=n)
    return inside/np.maximum(areas,1)

def comps_mask(ids):
    return np.isin(lab,list(ids))

x,y,w,h=st[:,0],st[:,1],st[:,2],st[:,3]
length=np.maximum(w,h)
# Siding boards: thin, and much wider than tall even in perspective; this skips vertical trim, columns and rakes.
horiz=(w>=12)&(w>=1.4*h)&(areas/np.maximum(w,1)<=9)
BIG=areas>20000

R={}
def band(p0,p1,t):
    (ax,ay),(bx,by)=p0,p1
    return [(ax,ay-t/2),(bx,by-t/2),(bx,by+t/2),(ax,ay+t/2)]
gutter_poly=poly_mask([
 [(498,271),(574,271),(574,286),(498,286)],
 [(588,271),(640,271),(640,286),(588,286)],
 [(352,266),(394,266),(394,281),(352,281)],
 [(190,264),(226,264),(226,278),(190,278)],
 [(818,277),(902,277),(902,293),(818,293)],
 [(994,267),(1022,270),(1022,282),(994,280)],
 band((166,398),(292,410),14),
 [(498,416),(532,416),(532,430),(498,430)],
 band((552,415),(872,442),12),
 [(495,283),(518,283),(518,562),(495,562)],
 [(876,288),(895,288),(895,382),(876,382)],
 [(851,438),(870,438),(870,587),(851,587)],
 [(211,272),(225,272),(225,292),(211,292)],
])
f=frac_inside(gutter_poly)
# Plus the porch gable's slanted gutter, which a box can't isolate from the shingles above it.
R["gutters"]=set(np.nonzero((f>0.75)&(areas<1500))[0])|{2331,2338}

# Each shingled roof plane, traced just inside its outline.
roof_poly=poly_mask([
 [(347,128),(407,131),(417,122),(699,106),(553,273),(497,274),(347,133)],  # front gable + back roof
 [(688,160),(966,152),(897,279),(830,279),(728,199),(640,279),(592,274)],  # right wing + dormer roof
 [(273,184),(297,183),(395,269),(360,272),(275,192)],                      # small left gable
 [(213,361),(332,368),(287,406),(168,393)],                                # left porch roof
 [(365,346),(429,341),(519,410),(449,423),(366,352)],                      # porch gable
 [(598,360),(656,360),(662,376),(810,386),(813,375),(901,379),(870,438),(553,410)],  # garage roof
])
roof_inner=cv2.erode(roof_poly.astype(np.uint8),np.ones((9,9),np.uint8)).astype(bool)
cx,cy=np.round(cent[:,0]).astype(int).clip(0,W-1),np.round(cent[:,1]).astype(int).clip(0,H-1)
# Long thin boards on a plane's edge are rakes and fascia; inside a plane they're valleys and ridges.
longthin=(length>=40)&(areas/np.maximum(length,1)<=8)
# Test centres against a slightly grown outline so part-shingles along the rakes aren't dropped;
# 1990 is a scrap of siding where the downspout cuts past the porch roof's edge board.
roof_grown=cv2.dilate(roof_poly.astype(np.uint8),np.ones((3,3),np.uint8)).astype(bool)
# Gutter boxes overlap the bottom row of shingles (and the downspout passes behind the porch roof),
# so shingle-shaped cells inside a roof plane go to the roof whatever box they're in.
shingle_like=roof_poly[cy,cx]&(h>=4)&(w<=25)
R["gutters"]-={i for i in R["gutters"] if shingle_like[i]}
R["roof"]=set(np.nonzero(roof_grown[cy,cx]&(~longthin|roof_inner[cy,cx])&~BIG)[0])-R["gutters"]-{1990}

window_rects=[(252,277,322,352),(405,280,447,330),(258,413,318,492),(625,285,658,350),(668,285,800,365),(935,280,958,357),(972,278,997,345),(890,448,915,530)]
wm=poly_mask([[(a,b),(c,b),(c,d),(a,d)] for a,b,c,d in window_rects])
f=frac_inside(wm)
R["windows"]=set(np.nonzero((f>0.9)&~BIG)[0])

house_poly=poly_mask([[(195,270),(270,183),(345,128),(700,105),(970,150),(1020,278),(1000,290),(1000,500),(870,585),(560,548),(500,560),(190,525)]])
f=frac_inside(house_poly)
# Plus the wider base boards at the foot of the front and garage walls.
R["siding"]=(set(np.nonzero((f>0.8)&horiz&~BIG)[0])|{2733,2662,2779})-R["roof"]-R["windows"]-R["gutters"]

# Narrow walls (beside doors and the dormer window, between the garage doors) have boards too
# short to pass the shape test, so take every cell there except tall vertical trim.
narrow_walls=poly_mask([[(a,b),(c,b),(c,d),(a,d)] for a,b,c,d in [
 (699,455,714,562),(866,450,894,548),(983,410,997,515),
 (796,286,806,366),(810,286,820,372),(660,286,669,366),(361,418,391,532),(361,318,377,348)]])
tall=(h>=2.5*w)&(h>=30)
R["siding"]|=set(np.nonzero(narrow_walls[cy,cx]&~tall&~BIG)[0])-R["windows"]-R["gutters"]

# Keep the front door's threshold, and the fence rails running behind the porch column, out of the siding.
front_door=poly_mask([[(388,420),(447,420),(447,532),(388,532)]])
behind_column=poly_mask([[(150,400),(232,400),(232,522),(150,522)]])
R["siding"]-={i for i in R["siding"] if front_door[cy[i],cx[i]] or behind_column[cy[i],cx[i]]}

# Ridge cap pieces are thin enough to pass as siding, so drop anything sitting on the roof.
R["siding"]-={i for i in R["siding"] if frac_inside(roof_poly)[i]>0.6}

fence_poly=poly_mask([[(0,415),(232,405),(232,522),(0,522)],[(995,375),(1264,383),(1264,465),(995,455)]])
f=frac_inside(fence_poly)
# The left run's last section sits behind the porch's corner column, which is house, not fence.
porch_column=poly_mask([[(192,400),(208,400),(208,520),(192,520)]])
R["fence"]=set(np.nonzero((f>0.6)&(areas<5000)&~porch_column[cy,cx])[0])

patio_poly=poly_mask([[(800,598),(860,585),(985,495),(1065,497),(1180,530),(1105,618),(950,600),(925,622),(800,610)]])
f=frac_inside(patio_poly)
# The skirt board along the side wall's base (2799) and two short boards beside the back door
# (2741, 2755) dip into the patio's area; they're siding.
wall_base={2799,2741,2755}
R["patio"]=set(np.nonzero((f>0.5)&(areas<6000))[0])-wall_base
R["siding"]|=wall_base

# The driveway also takes the two sidewalk slabs it crosses (3075, 3080) so it reads as one surface.
R["driveway"]={2875,2906,2916,2961,2952,3064,3078,3084,3088,3079,3075,3080}
# Sidewalk slabs along the street, plus the front walk from the porch step.
R["sidewalk"]={2955,2979,3029,3055,3069,3075,3080,3086,3087,3090,3091,3094,2983,2942,2910,2930}


COL={"roof":(70,75,85),"siding":(150,190,230),"windows":(180,220,245),"fence":(215,190,150),"patio":(190,180,165),"driveway":(200,195,185),"sidewalk":(175,170,160),"gutters":(160,110,60)}
out=np.full((H,W,3),255,np.uint8)
masks={}
for k,ids in R.items():
    m=comps_mask(ids).astype(np.uint8)
    m=cv2.morphologyEx(m,cv2.MORPH_CLOSE,np.ones((5,5),np.uint8))
    # Fill pinholes left by stray cells; real openings like windows are far bigger.
    hn,hl,hs,_=cv2.connectedComponentsWithStats((1-m).astype(np.uint8),connectivity=4)
    small=np.nonzero(hs[:,4]<150)[0]
    m[np.isin(hl,small)]=1
    # And drop specks: stray 1-2px gaps that ended up isolated from the rest of the surface.
    sn,sl,ss,_=cv2.connectedComponentsWithStats(m,connectivity=8)
    m[np.isin(sl,np.nonzero(ss[:,4]<30)[0][1:])]=0
    masks[k]=m
    out[m==1]=COL[k]
out[line==1]=(9,13,27)
Image.fromarray(out).save(os.path.join(tempfile.gettempdir(),"surfaces-preview.png"))
for k,v in R.items(): print(k,len(v))

# ---- vectorise ----
def to_path(m):
    m=cv2.dilate(m,np.ones((3,3),np.uint8))  # tuck the fill under the outline
    cs,_=cv2.findContours(m,cv2.RETR_CCOMP,cv2.CHAIN_APPROX_SIMPLE)
    parts=[]
    for c in cs:
        if cv2.contourArea(c)<6: continue
        c=cv2.approxPolyDP(c,0.7,True).reshape(-1,2)
        if len(c)<3: continue
        parts.append("M"+" ".join(f"{x} {y}" for x,y in c)+"Z")
    return "".join(parts)
paths={k:to_path(m) for k,m in masks.items()}
order=["roof","siding","windows","gutters","fence","patio","driveway","sidewalk"]
lines=["// Generated by scripts/trace-house-surfaces.py from public/images/services-house.png. Do not edit by hand.",
       "// One outline per surface, in the drawing's 1264×848 pixel space; draw with fill-rule=\"evenodd\".",
       "", 'export const HOUSE_VIEWBOX = "0 0 1264 848";', "",
       "export const houseSurfacePaths: Record<string, string> = {"]
lines+=[f'  {k}:\n    "{paths[k]}",' for k in order]
lines.append("};")
open(OUT,"w",encoding="utf-8",newline="\n").write("\n".join(lines)+"\n")
for k in order: print(k,len(paths[k]),"chars")
