/* Loads all three artifacts in a headless DOM and exercises the controls.
   Catches load-time and handler errors that a syntax check cannot. */
const fs = require("fs");
const { JSDOM, VirtualConsole } = require("jsdom");
const { SIM, SHEET, HANDOUT } = require("./extract.js");

const R = [];
const ok = (name, cond, note) => R.push([cond, name, note || ""]);

function open(file){
  const errs = [];
  const vc = new VirtualConsole();
  vc.on("jsdomError", e => errs.push(e.message.split("\n")[0]));
  const dom = new JSDOM(fs.readFileSync(file, "utf8"),
    { runScripts: "dangerously", pretendToBeVisual: true, virtualConsole: vc });
  dom.window.addEventListener("error", e => errs.push(e.message));
  return { w: dom.window, d: dom.window.document, errs };
}
const click = (d, w, id) => d.getElementById(id).dispatchEvent(new w.Event("click", { bubbles: true }));

module.exports = new Promise(resolve => {
  /* handout: static, must simply parse without script errors */
  {
    const { d, errs } = open(HANDOUT);
    ok("handout loads without errors", errs.length === 0, errs.join("; "));
    ok("handout renders eight objectives", d.querySelectorAll("ol.obj li").length === 8);
    ok("handout renders eight core principles", d.querySelectorAll(".principle").length === 8);
    ok("handout renders questions 2 through 15", d.querySelectorAll(".q").length === 14);
  }

  /* answer sheet: recomputes when a measurement changes */
  {
    const { w, d, errs } = open(SHEET);
    ok("answer sheet loads without errors", errs.length === 0, errs.join("; "));
    ok("answer sheet renders every question", d.querySelectorAll(".q").length === 12);
    const before = d.querySelectorAll(".ans")[1].textContent;
    const input = d.getElementById("i_Dr");
    input.value = String(parseFloat(input.value) * 2);
    input.dispatchEvent(new w.Event("input"));
    const after = d.querySelectorAll(".ans")[1].textContent;
    ok("answer sheet recomputes on input", before !== after);
    ok("answer sheet stays error free after edit", errs.length === 0, errs.join("; "));
  }

  /* simulator: animation loop, unit switching, typed entry */
  {
    const { w, d, errs } = open(SIM);
    const row = label => {
      for(const tr of d.querySelectorAll("#dash tr")){
        const td = tr.querySelectorAll("td");
        if(td.length === 2 && td[0].textContent === label) return td[1].textContent;
      }
      return "";
    };
    setTimeout(() => {
      ok("simulator loads without errors", errs.length === 0, errs.join("; "));
      ok("simulator builds the cross section", d.getElementById("jack").childNodes.length > 5);
      ok("no sliders remain", d.querySelectorAll("input[type=range]").length === 0);
      click(d, w, "bAuto");
      setTimeout(() => {
        ok("auto pump advances the state machine",
           d.getElementById("statePill").textContent !== "IDLE",
           d.getElementById("statePill").textContent);
        ok("handle angle reads live", /deg/.test(row("Handle angle now")), row("Handle angle now"));
        click(d, w, "bAuto");
        click(d, w, "uUS");
        ok("customary units reach the entry fields",
           d.getElementById("u_ramDia").textContent === "in",
           d.getElementById("n_ramDia").value + " in");
        const f = d.getElementById("n_ramDia");
        f.value = "2";
        f.dispatchEvent(new w.KeyboardEvent("keydown", { key: "Enter", bubbles: true }));
        click(d, w, "uSI");
        ok("typed inches round trip to millimetres",
           Math.abs(parseFloat(d.getElementById("n_ramDia").value) - 50.8) < 0.05,
           d.getElementById("n_ramDia").value + " mm");
        click(d, w, "bRel");
        ok("release valve toggles", /open/.test(d.getElementById("bRel").textContent));
        click(d, w, "bDefaults");
        click(d, w, "bApply");
        ok("simulator stays error free through the controls", errs.length === 0, errs.join("; "));
        resolve(R);
      }, 500);
    }, 400);
  }
});

if(require.main === module) module.exports.then(r => require("./run.js").report("interface", r));
