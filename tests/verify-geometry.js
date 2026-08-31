/* Drawing geometry: no passage crossings, no clipping, clearances hold
   across the full range of every user-editable dimension. */
const { geometry } = require("./extract.js");
const { dims, DEFAULTS, derived, layout, sim } = geometry();

const segs = p => { const o = []; for(let i = 1; i < p.length; i++) o.push([p[i-1], p[i]]); return o; };
function crosses(a, b){                      // axis-aligned segments only
  const aV = Math.abs(a[0][0] - a[1][0]) < 0.01, bV = Math.abs(b[0][0] - b[1][0]) < 0.01;
  if(aV === bV) return false;
  const v = aV ? a : b, h = aV ? b : a;
  const x = v[0][0], y = h[0][1];
  return x > Math.min(h[0][0], h[1][0]) + 0.5 && x < Math.max(h[0][0], h[1][0]) - 0.5 &&
         y > Math.min(v[0][1], v[1][1]) + 0.5 && y < Math.max(v[0][1], v[1][1]) - 0.5;
}

const worst = {}, crossings = [];
const rec = (k, v, tag) => { if(!(k in worst) || v < worst[k].v) worst[k] = { v, tag }; };

function check(tag){
  for(const th of [0, 0.5, 1]){
    sim.theta = derived(dims).thetaMax * th;
    for(const r of [0, 0.5, 1]){
      sim.ram = dims.ramStrokeMax * r;
      const g = layout();
      const P = { Inlet: g.pathInlet, DelLow: g.pathDelLow, DelHigh: g.pathDelHigh,
                  HpBranch: g.pathHpBranch, RelOut: g.pathRelOut };
      const k = Object.keys(P);
      for(let i = 0; i < k.length; i++) for(let j = i + 1; j < k.length; j++)
        for(const s1 of segs(P[k[i]])) for(const s2 of segs(P[k[j]]))
          if(crosses(s1, s2)) crossings.push(tag + " " + k[i] + " x " + k[j]);

      rec("left margin",              g.cx - g.bodyHalf - 8, tag);
      rec("right margin",             772 - (g.pumpX + 46), tag);
      rec("top clearance",            g.ramTopY - 52, tag);
      rec("piston inside bore top",   g.headTopY - g.pumpTop, tag);
      rec("piston above floor",       g.baseTop - g.headBotY, tag);
      rec("pivot clear of body",      g.pivotX - 9 - (g.cx + g.bodyHalf), tag);
      rec("pump wall clear of pivot", (g.pumpX - g.pumpR - 9) - (g.pivotX + 9), tag);
      rec("suction port in bore",     (g.pumpR + 3) - (g.pumpX - g.pIn), tag);
      rec("delivery port in bore",    (g.pumpR + 3) - (g.pOut - g.pumpX), tag);
      rec("release valve run",        g.xResRel - g.Tx, tag);
      rec("riser separation",         (g.xResR - g.xResRel) - 14, tag);
      rec("risers inside annulus",    (g.cx + g.cylOut + g.resW - 6) - g.xResR, tag);
      rec("release riser in annulus", g.xResRel - (g.cx + g.cylOut + 5), tag);
      rec("tap upstream of chamber",  g.obX - g.Tx, tag);
      rec("galleries inside base",    508 - g.yOut - 6, tag);
      rec("lifting chamber height",   g.baseTop - g.ramBotY, tag);
      // the handle must never pass through the pump cylinder
      rec("pivot above pump cylinder", g.pumpTop - g.pivotY - 12, tag);
      rec("handle tip on canvas",      Math.min(g.hEndY - 8, 772 - g.hEndX), tag);
      rec("ram protrudes at rest",     (g.bodyTop - (g.ramBot0 - g.ramLenPx)) - 20, tag);
      rec("load block on canvas",      g.ramTopY - 54, tag);
      rec("oil column inside body",    g.resTop - g.bodyTop - 6, tag);
    }
  }
}

const RANGE = { ramDia:[20,110], boreDia:[22,120], ramStrokeMax:[20,200], pumpDia:[4,26],
                pumpStroke:[5,45], pumpCylLen:[30,110], handleLen:[150,700], pivotLink:[15,80],
                bodyID:[34,200], cylOD:[26,190], resHeight:[20,250] };
for(const k in RANGE) for(const v of RANGE[k]){
  Object.assign(dims, DEFAULTS); dims[k] = v;
  if(dims.boreDia < dims.ramDia + 2) dims.boreDia = dims.ramDia + 2;
  check(k + "=" + v);
}
Object.assign(dims, DEFAULTS, { ramDia:110, boreDia:120, pivotLink:80, pumpDia:26,
  pumpStroke:45, handleLen:700, ramStrokeMax:200, pumpCylLen:110, cylOD:190, bodyID:200,
  resHeight:250 }); check("all maximum");
Object.assign(dims, DEFAULTS, { ramDia:20, boreDia:22, pivotLink:15, pumpDia:4,
  pumpStroke:5, handleLen:150, ramStrokeMax:20, pumpCylLen:30, cylOD:26, bodyID:34,
  resHeight:20 }); check("all minimum");

const R = [];
for(const k in worst) R.push([worst[k].v >= 0, k, worst[k].v.toFixed(1) + " px, worst at " + worst[k].tag]);
R.push([crossings.length === 0, "no hydraulic passages cross",
        crossings.length ? [...new Set(crossings)].join(", ") : ""]);

module.exports = R;
if(require.main === module) require("./run.js").report("geometry", R);
