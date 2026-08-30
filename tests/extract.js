/* Pulls runnable modules out of the single-file HTML artifacts.
   The simulator keeps its physics, geometry, and rendering in separate
   commented sections; these markers are the contract between the source
   and the test suite. If a marker moves, the tests fail loudly rather
   than silently testing nothing. */
const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const SIM   = path.join(ROOT, "simulator", "hydraulic-bottle-jack.html");
const SHEET = path.join(ROOT, "lab", "bottle-jack-lab-answer-sheet.html");

function script(file){
  const html = fs.readFileSync(file, "utf8");
  const m = html.match(/<script>\n([\s\S]*)\n<\/script>/);
  if(!m) throw new Error("no script block found in " + file);
  return m[1];
}
function cut(src, from, to, what){
  const a = src.indexOf(from);
  if(a < 0) throw new Error("marker not found (" + what + "): " + from.slice(0,40));
  const b = to ? src.indexOf(to) : src.length;
  if(b < 0) throw new Error("end marker not found (" + what + "): " + to.slice(0,40));
  return src.slice(a, b);
}

const BANNER = n => "/* ============================================================\n   " + n;

/* physics: dimensional model, derived values, state machine */
function physics(){
  const src = script(SIM);
  const head = cut(src, 0 === 0 ? src.slice(0,0) || src : src, null, "x"); // placeholder
  const upto = src.indexOf(BANNER("5. PARAMETRIC"));
  if(upto < 0) throw new Error("physics end marker not found");
  const body = src.slice(0, upto);
  const stub = 'function setPressed(a,b){}\nvar bRel={textContent:""}, bAuto={};\n' +
               'var fmt=function(v,n){return isFinite(v)? v.toFixed(n) : "-";};\n';
  const mod = stub + body +
    "\nmodule.exports={dims,DEFAULTS,derived,sim,step,resetSim};\n";
  return load(mod, "physics");
}

/* drawing geometry: parametric layout in pixels */
function geometry(){
  const src = script(SIM);
  const head = src.slice(0, src.indexOf(BANNER("3. SIMULATION")));
  const lay  = cut(src, "function layout()", BANNER("6. SVG"), "layout");
  if(head.length === 0) throw new Error("geometry head not found");
  const mod = head.replace(/^"use strict";/, "") +
    "\nvar sim={theta:0,ram:0};\n" + lay +
    "\nmodule.exports={dims,DEFAULTS,derived,layout,sim};\n";
  return load(mod, "geometry");
}

/* answer sheet: measured inputs and the solver */
function answerSheet(){
  const src = script(SHEET);
  const blk = cut(src, "const M = [", "/* ---------- question definitions", "solver");
  const mod = blk.replace(/const /g, "var ") + "\nmodule.exports={M,D,solve};\n";
  return load(mod, "answer sheet");
}

function load(code, label){
  const Module = require("module");
  const m = new Module(label);
  m._compile(code, label + ".js");
  return m.exports;
}

module.exports = { physics, geometry, answerSheet, SIM, SHEET,
                   HANDOUT: path.join(ROOT, "lab", "bottle-jack-lab-handout.html") };
