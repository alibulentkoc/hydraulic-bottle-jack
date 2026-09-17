/* The simulator's laboratory panel answers questions 2 to 13 from the entered
   geometry. It must agree with the answer sheet, which works the same questions
   independently, or a student checking one against the other finds a difference
   that is ours rather than theirs. */
const fs = require("fs");
const { JSDOM } = require("jsdom");
const { SIM, SHEET } = require("./extract.js");

// a jack with nothing round about it, so agreement is not a coincidence
const J = { Dr:1.432, dp:0.377, sp:0.691, L:5.25, a:1.187, b:11.4, W:3250,
            ID:2.06, OD:3.14, H:2.77 };

module.exports = new Promise(function(resolve){
  const R = [];
  const ok = function(n,c,note){ R.push([c, n, note || ""]); };

  // answer sheet
  const aw = new JSDOM(fs.readFileSync(SHEET,"utf8"), { runScripts:"dangerously" }).window;
  Object.keys(J).forEach(function(k){
    const n = aw.document.getElementById("i_"+k);
    if(n){ n.value = String(J[k]); n.dispatchEvent(new aw.Event("input")); }
  });
  const sheetText = aw.document.body.textContent;

  // simulator, same jack, customary units
  const sw = new JSDOM(fs.readFileSync(SIM,"utf8"),
    { runScripts:"dangerously", pretendToBeVisual:true }).window;

  setTimeout(function(){
    const d = sw.document;
    d.getElementById("uUS").dispatchEvent(new sw.Event("click",{bubbles:true}));
    const set = function(k,v){
      const n = d.getElementById("n_"+k); n.value = String(v);
      n.dispatchEvent(new sw.KeyboardEvent("keydown",{key:"Enter",bubbles:true}));
    };
    set("ramDia",J.Dr); set("pumpDia",J.dp); set("pumpStroke",J.sp);
    set("ramStrokeMax",J.L); set("pivotLink",J.a); set("handleLen",J.b);
    set("load",J.W); set("cylOD",J.ID); set("bodyID",J.OD); set("resHeight",J.H);

    const lab = {};
    [].forEach.call(d.querySelectorAll("#labtab tr"), function(tr){
      const td = tr.querySelectorAll("td");
      lab[td[0].textContent.replace(/^Q\d+\s*/,"").trim()] = td[1].textContent.trim();
    });

    ok("laboratory panel renders every question", Object.keys(lab).length >= 20,
       Object.keys(lab).length + " rows");

    // the panel's own numbers, recomputed here from the same measurements
    const PI = Math.PI;
    const Ap = PI/4*J.dp*J.dp, Ar = PI/4*J.Dr*J.Dr;
    const Vp = Ap*J.sp, h = Vp/Ar, P = J.W/Ar, Fp = P*Ap, T = Fp*J.a, Fh = T/J.b;
    const N = J.L/h, v = J.L/N, Phyd = P*Vp/6600, Plin = J.W*v/6600;
    const num = function(k){ return parseFloat((lab[k]||"").replace(/[^0-9.eE-]/g,"")); };

    const cases = [
      ["A_p = pi d_p^2 / 4", Ap], ["V_p = A_p s_p", Vp],
      ["A_r = pi D_r^2 / 4", Ar], ["h = V_p / A_r", h],
      ["P = W / A_r", P],         ["F_p = P A_p", Fp],
      ["T = F_p a", T],           ["F_hand = T / b", Fh],
      ["N = L / h", N],           ["v = L / t", v],
      ["Power_hyd = P Q", Phyd],  ["Power_out = W v", Plin]
    ];
    cases.forEach(function(c){
      const got = num(c[0]), want = c[1];
      const close = isFinite(got) && Math.abs(got - want)/Math.abs(want) < 0.002;
      ok("panel " + c[0] + " is correct", close,
         isFinite(got) ? got.toPrecision(5) + " vs " + want.toPrecision(5) : "not found");
    });

    // power in equals power out for an ideal machine, whatever was typed
    const ideal = num("Power_in, ideal = F_hand s_p (b/a) n"), hyd = num("Power_hyd = P Q"), out = num("Power_out = W v");
    ok("ideal operator power equals hydraulic power", Math.abs(ideal-hyd)/hyd < 1e-3,
       ideal.toPrecision(5)+" vs "+hyd.toPrecision(5));
    ok("hydraulic power equals lifting power", Math.abs(out-hyd)/hyd < 1e-3);

    // and the answer sheet, worked independently, reaches the same figures
    [Ar.toFixed(4), h.toFixed(5), P.toFixed(1), Fh.toFixed(2)].forEach(function(x){
      ok("answer sheet also shows " + x, sheetText.indexOf(x) >= 0);
    });
    resolve(R);
  }, 800);
});

if(require.main === module) module.exports.then(function(r){ require("./run.js").report("lab panel", r); });
