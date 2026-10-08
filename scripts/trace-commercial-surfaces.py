"""Trace the fill outlines for each commercial service from the commercial line drawing.

Writes app/components/services-commercial-surfaces.ts, plus a debug preview in the system temp folder.
Needs: pip install opencv-python-headless numpy pillow
Run from the repo root: python scripts/trace-commercial-surfaces.py

Same approach as trace-house-surfaces.py: every white cell between lines is its own connected region,
and rough outlines per part decide which cells belong to it. The numbered region IDs refer to this
exact image; re-check them if the drawing changes.
"""
import os, tempfile, numpy as np, cv2
from PIL import Image, ImageDraw
SRC="public/images/services-commercial.png"
OUT="app/components/services-commercial-surfaces.ts"
alpha=np.array(Image.open(SRC).convert("RGBA"))[...,3]
H,W=alpha.shape
line=(alpha>100).astype(np.uint8)
n,lab,st,cent=cv2.connectedComponentsWithStats((1-line).astype(np.uint8),connectivity=4)
areas=st[:,4]
w,h=st[:,2],st[:,3]
cx,cy=np.round(cent[:,0]).astype(int).clip(0,W-1),np.round(cent[:,1]).astype(int).clip(0,H-1)

def poly_mask(*polys):
    m=Image.new("L",(W,H),0); d=ImageDraw.Draw(m)
    for p in polys: d.polygon([tuple(q) for q in p],fill=1)
    return np.array(m,dtype=bool)

def frac_inside(mask):
    inside=np.bincount(lab[mask].ravel(),minlength=n)
    return inside/np.maximum(areas,1)

def cells(mask,frac=0.8,max_area=None):
    keep=frac_inside(mask)>frac
    if max_area: keep&=areas<max_area
    keep[0]=False
    return set(np.nonzero(keep)[0])

SKY=1    # the white page around the drawing
LOT=1293 # all the asphalt, from the curb in front of the shops down to the bottom edge

canopy=cells(poly_mask([(0,236),(662,360),(662,382),(452,470),(0,345)]),0.5)
enclosure_poly=poly_mask([(1033,393),(1100,374),(1252,398),(1252,490),(1172,562),(1008,505)])

R={}
# The concrete slab under the canopy, minus the pump islands, columns and bollards standing on it.
# Its back edge is the line behind the pumps from about (20,380) to (520,535); the cells past it are
# open ground under the far side of the canopy, not the slab.
under_canopy=cells(poly_mask([(0,330),(452,470),(560,470),(670,580),(440,700),(0,520)]),0.8)
tall=(h>=2.5*w)
# Raised island bases (1719, 2008, 2019, 2094, 2103) and the third pump's panels (1977, 1990, 2078, 2088).
islands_and_pumps={1719,2008,2019,2094,2103,1977,1990,2078,2088}
ground={i for i in under_canopy if areas[i]>=250 and not tall[i]}-canopy-islands_and_pumps-{LOT,SKY}
R["gas-pad"]=ground&cells(poly_mask([(0,374),(700,591),(700,848),(0,848)]),0.6)

# Asphalt only, so the painted stripes and curb stops stay white. Includes the patches of lot seen
# between the canopy's columns, beyond the slab's back edge.
R["parking-lot"]={LOT}|(ground-R["gas-pad"])

# The finished end unit, in three parts: the cones and A-frame barricade on the sidewalk, each traced
# inside its own outline so nothing around them is caught; the two curb stops in front of the unit;
# and the storefront itself (sign band, awning, glass, door, kick plates) between its brick piers.
R["construction-cones"]=cells(poly_mask(
 [(830,432),(837,432),(843,452),(843,457),(824,457),(824,452)],
 [(899,444),(905,444),(912,465),(914,470),(892,470),(894,465)],
 [(931,449),(937,449),(943,470),(945,477),(923,477),(925,470)],
 [(948,455),(954,455),(960,476),(962,482),(939,482),(942,476)],
 [(845,429),(882,429),(891,465),(842,465)],
),0.9,max_area=150)-{1399,1417,1428,1835}  # storefront trim and door jamb behind the barricade, curb sliver by its foot
R["construction-stops"]=cells(poly_mask(
 [(789,458),(805,458),(845,469),(845,481),(835,481),(789,469)],
 [(866,476),(880,476),(926,488),(926,500),(915,500),(866,488)],
),0.9,max_area=1000)
# Plus the awning's end stripe and valance (821, 951, 955), which hang out over the left pier, and the
# two kick-plate panels under the right-hand windows (1544, 1638), which dip below the outline.
R["construction-storefront"]=(cells(poly_mask([(830,266),(996,290),(996,452),(830,437)]),0.6)|{821,951,955,1544,1638})-R["construction-cones"]

R["dumpster"]=cells(poly_mask([(1076,449),(1083,429),(1160,433),(1158,470),(1150,500),(1135,511),(1076,500)]),0.9)
# The slab inside the enclosure (1925, 1924), the apron in front of it (2001), and the slab's exposed
# front and side edges (2038, 1959, 1964, 2062). Picked by hand: an outline also catches gate slats and wall bricks.
R["dumpster-pad"]={1925,1924,2001,2038,1959,1964,2062}

# The whole retail building: roof, front, side wall, piers and awnings. The gas canopy and the
# dumpster enclosure sit in front of it, so their cells are left out.
building_poly=poly_mask([(156,170),(270,178),(345,178),(1162,256),(1162,376),(1040,404),(1040,476),(1000,476),(156,300)])
R["building"]=cells(building_poly,0.7)-canopy-cells(enclosure_poly,0.5)-{SKY,LOT}

COL={"building":(215,218,224),"gas-pad":(205,195,175),"parking-lot":(110,112,118),"construction-storefront":(215,218,224),
     "construction-cones":(240,150,60),"construction-stops":(240,205,60),"dumpster":(45,110,70),"dumpster-pad":(205,195,175)}
order=["building","gas-pad","parking-lot","construction-storefront","construction-cones","construction-stops","dumpster","dumpster-pad"]

def build_mask(ids):
    m=np.isin(lab,list(ids)).astype(np.uint8)
    m=cv2.morphologyEx(m,cv2.MORPH_CLOSE,np.ones((5,5),np.uint8))
    # Fill pinholes left by stray cells; real openings are far bigger.
    hn,hl,hs,_=cv2.connectedComponentsWithStats((1-m).astype(np.uint8),connectivity=4)
    m[np.isin(hl,np.nonzero(hs[:,4]<150)[0])]=1
    # And drop specks isolated from the rest of the part.
    sn,sl,ss,_=cv2.connectedComponentsWithStats(m,connectivity=8)
    m[np.isin(sl,np.nonzero(ss[:,4]<30)[0][1:])]=0
    return m

masks={k:build_mask(R[k]) for k in order}

tmp=tempfile.gettempdir()
for k in order:
    out=np.full((H,W,3),255,np.uint8)
    out[masks[k]==1]=COL[k]
    out[line==1]=(9,13,27)
    Image.fromarray(out).save(os.path.join(tmp,f"commercial-{k}.png"))
    print(k,len(R[k]),"cells")

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
paths={k:to_path(masks[k]) for k in order}
lines=["// Generated by scripts/trace-commercial-surfaces.py from public/images/services-commercial.png. Do not edit by hand.",
       "// One outline per part, in the drawing's 1264×848 pixel space; draw with fill-rule=\"evenodd\".",
       "", 'export const COMMERCIAL_VIEWBOX = "0 0 1264 848";', "",
       "export const commercialSurfacePaths: Record<string, string> = {"]
lines+=[f'  "{k}":\n    "{paths[k]}",' for k in order]
lines.append("};")
open(OUT,"w",encoding="utf-8",newline="\n").write("\n".join(lines)+"\n")
for k in order: print(k,len(paths[k]),"chars")
