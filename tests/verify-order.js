/* One field order, taken from the handout's data sheet. Tables 1, 2 and 3 of the
   handout are the reference: the nameplate load, then the measurements taken
   with the jack assembled, then the internal ones. The simulator's entry panel,
   the answer sheet and the grading tool must present the same sequence, so a
   student reading down the sheet types down the panel without hunting. */
const fs = require("fs");
const { JSDOM } = require("jsdom");
const { SIM, SHEET, HANDOUT, GRADER } = require("./extract.js");

// handout row label -> symbol used by the other three documents
const SYMBOL = {
  "Rated load W (lb)":                  "W",
  "Pump plunger stroke (in)":           "s_p",
  "Handle swept angle (deg)":           "theta",
  "Pivot to pump rod end (in)":         "a",
  "Pivot to operator hand (in)":        "b",
  "Lifting cylinder bore (in)":         "D_r",
  "Pump cylinder bore (in)":            "d_p",
  "Reservoir inside dia (in)":          "D_i",
  "Reservoir outside dia (in)":         "D_o",
  "Reservoir oil column height (in)":   "H",
  "Lifting cylinder extension (in)":    "L"
};

module.exports = new Promise(function(resolve){
  const R = [];
  const ok = function(n,c,note){ R.push([c, n, note || ""]); };

  // read the canonical order straight out of the handout's data tables
  const hd = new JSDOM(fs.readFileSync(HANDOUT,"utf8")).window.document;
  const CANON = [];
  [].forEach.call(hd.querySelectorAll("table td.lab"), function(td){
    const sym = SYMBOL[td.textContent.trim()];
    if(sym && CANON.indexOf(sym) < 0) CANON.push(sym);
  });
  ok("handout data sheet yields all eleven quantities", CANON.length === 11, CANON.join(" "));

  const sd = new JSDOM(fs.readFileSync(SIM,"utf8"),
    { runScripts:"dangerously", pretendToBeVisual:true }).window.document;

  setTimeout(function(){
    const ssyms = [].map.call(sd.querySelectorAll("#grpMeas label"),
      function(l){ return l.textContent.trim().split(/\s\s+/).pop(); });
    ok("simulator panel follows the handout data sheet",
       JSON.stringify(ssyms) === JSON.stringify(CANON), ssyms.join(" "));
    ok("simulator keeps simulation-only fields separate",
       sd.querySelectorAll("#grpSim .ctl").length === 4);

    [["answer sheet", SHEET, ".m label i"], ["grading tool", GRADER, "#audit tr td.sym"]]
      .forEach(function(e){
        const d = new JSDOM(fs.readFileSync(e[1],"utf8"),
          { runScripts:"dangerously" }).window.document;
        const syms = [].map.call(d.querySelectorAll(e[2]),
          function(t){ return t.textContent.trim(); }).slice(0, CANON.length);
        ok(e[0] + " follows the handout data sheet",
           JSON.stringify(syms) === JSON.stringify(CANON), syms.join(" "));
      });
    resolve(R);
  }, 700);
});

if(require.main === module) module.exports.then(function(r){ require("./run.js").report("field order", r); });
