/* Answer sheet solver: internal consistency of the lab calculations. */
const { answerSheet } = require("./extract.js");
const { D, solve } = answerSheet();

const R = [];
const ok = (name, cond, note) => R.push([cond, name, note || ""]);
let r = solve();

ok("displaced volume equals area times stroke", Math.abs(r.Vp - r.Ap * D.sp) < 1e-12,
   r.Vp.toFixed(5) + " in^3");
ok("lift per stroke equals stroke times area ratio",
   Math.abs(r.h - D.sp * r.Ap / r.Ar) < 1e-12, r.h.toFixed(5) + " in");
ok("pressure equals load over lifting area", Math.abs(r.P - D.W / r.Ar) < 1e-9,
   r.P.toFixed(1) + " psi");
ok("hand force equals load over total advantage",
   Math.abs(r.Fh - D.W / (r.aRat * r.lRat)) < 1e-9, r.Fh.toFixed(2) + " lb");
ok("hydraulic power equals output linear power", Math.abs(r.Phyd - r.Plin) < 1e-12,
   r.Phyd.toFixed(6) + " hp");
ok("force factor is the product of area and lever ratios",
   Math.abs(r.mult - r.aRat * r.lRat) < 1e-6, r.mult.toFixed(1) + " : 1");
ok("ideal speed reduction equals force multiplication",
   Math.abs(r.sIdeal - r.mult) < 1e-6, r.sIdeal.toFixed(1) + " : 1");
ok("arc method overstates input power by theta/sin(theta)",
   Math.abs(r.Pop / r.Phyd - 1) < 0.07, (100 * (r.Pop / r.Phyd - 1)).toFixed(2) + "% high");
ok("volume to fill equals area times extension", Math.abs(r.Vlift - r.Ar * D.L) < 1e-12,
   r.Vlift.toFixed(4) + " in^3");
ok("reservoir level drop accounts for that volume",
   Math.abs(r.Ares * r.drop - r.Vlift) < 1e-9, "drop " + r.drop.toFixed(3) + " in");

const h0 = r.h; D.dp *= 2; r = solve();
ok("doubling pump bore quadruples lift per stroke", Math.abs(r.h / h0 - 4) < 1e-9,
   (r.h / h0).toFixed(3) + "x");
D.dp /= 2; r = solve();
const F0 = r.Fh; D.b *= 2; r = solve();
ok("doubling handle length halves hand force", Math.abs(r.Fh / F0 - 0.5) < 1e-9,
   r.Fh.toFixed(2) + " lb");
D.b /= 2;

module.exports = R;
if(require.main === module) require("./run.js").report("answer sheet", R);
