/* Hydraulic model: conservation of volume, valve logic, lever ratios.
   Mirrors the verification tests listed in the design specification. */
const { physics } = require("./extract.js");
const { dims, DEFAULTS, derived, sim, step, resetSim } = physics();

const R = [];
const ok = (name, cond, note) => R.push([cond, name, note || ""]);
const setDims = o => { Object.assign(dims, DEFAULTS, o); resetSim(); };

function cycles(n, sub){
  sub = sub || 240;
  const D = derived(dims);
  for(let c = 0; c < n; c++){
    for(let i = 1; i <= sub; i++){ sim.theta = D.thetaMax * (i / sub); step(0.004); }
    for(let i = sub - 1; i >= 0; i--){ sim.theta = D.thetaMax * (i / sub); step(0.004); }
  }
}

setDims({});
const A1 = derived(dims).Ar;
setDims({ ramDia: 80 });
ok("ram area scales with diameter squared", Math.abs(derived(dims).Ar / A1 - 4) < 1e-9);

setDims({}); cycles(3); const rA = sim.ram / 3;
setDims({ pumpDia: DEFAULTS.pumpDia * Math.SQRT2 }); cycles(3); const rB = sim.ram / 3;
ok("doubling pump area doubles rise per stroke", Math.abs(rB / rA - 2) < 0.05,
   "ratio " + (rB / rA).toFixed(3));

setDims({ ramDia: DEFAULTS.ramDia * Math.SQRT2, boreDia: 64 }); cycles(3);
ok("doubling ram area halves rise per stroke", Math.abs((sim.ram / 3) / rA - 0.5) < 0.05,
   "ratio " + ((sim.ram / 3) / rA).toFixed(3));

setDims({});
const total = () => sim.vRes + sim.vPump + derived(dims).Ar * sim.ram + dims.deadVol * 1000;
const t0 = total(); cycles(6);
ok("oil conserved over six strokes", Math.abs(total() - t0) / t0 < 0.02,
   "drift " + (100 * (total() - t0) / t0).toFixed(4) + "%");

const theory = 6 * derived(dims).dispPerStroke;
ok("ram rise matches pumped volume", Math.abs(derived(dims).Ar * sim.ram / theory - 1) < 0.06,
   "actual/theory " + (derived(dims).Ar * sim.ram / theory).toFixed(3));

const held = sim.ram;
for(let i = 0; i < 500; i++) step(0.016);
ok("holds position with both check valves closed", Math.abs(sim.ram - held) < 1e-9, "mode " + sim.mode);

sim.releaseOpen = true;
for(let i = 0; i < 900; i++) step(0.016);
ok("release valve returns the ram to zero", sim.ram < 1e-6);
ok("released oil returns to the reservoir", Math.abs(total() - t0) / t0 < 0.02);

setDims({ ramStrokeMax: 20 }); cycles(40);
ok("pumping cannot exceed maximum stroke", sim.ram <= 20 + 1e-9, "ram " + sim.ram.toFixed(3));
ok("relief conserves oil at full extension", Math.abs(total() - t0) / t0 < 0.05);

setDims({});
const m1 = derived(dims).MA;
setDims({ handleLen: 700 });
ok("handle length changes mechanical advantage", Math.abs(derived(dims).MA / m1 - 2) < 1e-9);
setDims({ pivotLink: 70 });
ok("pivot distance changes mechanical advantage", Math.abs(derived(dims).MA - m1 / 2) < 1e-9);

setDims({});
const d1 = derived(dims).dispPerStroke;
setDims({ pumpStroke: 30 });
ok("pump stroke changes displacement per cycle", Math.abs(derived(dims).dispPerStroke / d1 - 1.5) < 1e-9);

setDims({});
const Dm = derived(dims);
let both = 0, sawIn = 0, sawOut = 0;
for(let i = 1; i <= 200; i++){ sim.theta = Dm.thetaMax * (i / 200); step(0.004);
  if(sim.inlet && sim.outlet) both++; if(sim.inlet) sawIn++; }
for(let i = 199; i >= 0; i--){ sim.theta = Dm.thetaMax * (i / 200); step(0.004);
  if(sim.inlet && sim.outlet) both++; if(sim.outlet) sawOut++; }
ok("check valves are never both open", both === 0, "violations " + both);
ok("inlet valve opens on the suction stroke", sawIn > 150);
ok("outlet valve opens on the delivery stroke", sawOut > 150);

setDims({ pumpStroke: 45, pivotLink: 20 });
ok("pump stroke is clamped by the linkage", derived(dims).strokeReal <= 20,
   derived(dims).strokeReal.toFixed(2) + " mm");

setDims({ load: 5000 });
const Dp = derived(dims);
ok("pressure equals load over ram area",
   Math.abs(Dp.Phold - (5000 + Dp.ramWeight) / Dp.Ar) < 1e-9, Dp.Phold.toFixed(2) + " MPa");
ok("hand force equals pump force over mechanical advantage",
   Math.abs(Dp.Fhand - Dp.Phold * Dp.Ap / Dp.MA) < 1e-9, Dp.Fhand.toFixed(1) + " N");

module.exports = R;
if(require.main === module) require("./run.js").report("physics", R);
