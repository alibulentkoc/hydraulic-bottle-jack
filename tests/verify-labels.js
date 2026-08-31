/* Label layout: no two labels on the drawing may overlap, and none may leave
   the canvas, at any combination of user-editable dimensions or unit system.
   Boxes are estimated from x, y, text-anchor, and the actual rotation angle. */
const fs = require("fs");
const { JSDOM } = require("jsdom");
const { SIM } = require("./extract.js");

const CH = 6.2, H = 13;                     // approximate glyph width and line height

function boxOf(t){
  const s = (t.textContent || "").trim();
  if(!s || t.getAttribute("opacity") === "0") return null;
  const x = parseFloat(t.getAttribute("x") || 0);
  const y = parseFloat(t.getAttribute("y") || 0) + parseFloat(t.getAttribute("dy") || 0);
  const a = t.getAttribute("text-anchor") || "start";
  const m = (t.getAttribute("transform") || "").match(/rotate\(\s*(-?[\d.]+)/);
  const ang = (m ? parseFloat(m[1]) : 0) * Math.PI / 180;
  const w = s.length * CH;
  const dx = a === "middle" ? -w/2 : a === "end" ? -w : 0;
  const pts = [[dx,3-H],[dx+w,3-H],[dx+w,3],[dx,3]].map(([px,py]) => [
    x + px*Math.cos(ang) - py*Math.sin(ang),
    y + px*Math.sin(ang) + py*Math.cos(ang)]);
  const xs = pts.map(p=>p[0]), ys = pts.map(p=>p[1]);
  return { s, box:[Math.min(...xs), Math.min(...ys),
                   Math.max(...xs)-Math.min(...xs), Math.max(...ys)-Math.min(...ys)] };
}

module.exports = new Promise(resolve => {
  const R = [];
  const dom = new JSDOM(fs.readFileSync(SIM, "utf8"),
    { runScripts: "dangerously", pretendToBeVisual: true });
  const w = dom.window, d = w.document;
  const set = (k,v) => { const n = d.getElementById("n_"+k); n.value = String(v);
    n.dispatchEvent(new w.KeyboardEvent("keydown", { key:"Enter", bubbles:true })); };
  const click = id => d.getElementById(id).dispatchEvent(new w.Event("click", { bubbles:true }));

  function scan(tag){
    const boxes = [...d.querySelectorAll("#jack text")].map(boxOf).filter(Boolean);
    const hit = (A,B) => A[0] < B[0]+B[2]-2 && A[0]+A[2] > B[0]+2 &&
                         A[1] < B[1]+B[3]-2 && A[1]+A[3] > B[1]+2;
    const clash = [];
    for(let i=0;i<boxes.length;i++) for(let j=i+1;j<boxes.length;j++)
      if(hit(boxes[i].box, boxes[j].box)) clash.push(boxes[i].s+" / "+boxes[j].s);
    const off = boxes.filter(b => b.box[0] < -2 || b.box[1] < -2 ||
                                  b.box[0]+b.box[2] > 782 || b.box[1]+b.box[3] > 572);
    R.push([clash.length === 0, "no overlapping labels, " + tag,
            clash.length ? [...new Set(clash)].join("; ") : boxes.length + " labels"]);
    R.push([off.length === 0, "all labels on the canvas, " + tag,
            off.map(o=>o.s).join(", ")]);
  }

  setTimeout(() => {
    click("tPress");                                    // dimensions and pressure both shown
    scan("defaults");
    set("ramDia",110); set("boreDia",120); set("cylOD",190); set("bodyID",200);
    set("pumpDia",26); set("pumpStroke",45); set("handleLen",700); set("pivotLink",80);
    set("ramStrokeMax",200); set("load",60000);
    scan("all dimensions maximum");
    click("bDefaults");
    set("ramDia",20); set("pumpDia",4); set("pumpStroke",5); set("handleLen",150);
    set("pivotLink",15); set("ramStrokeMax",20); set("cylOD",26); set("bodyID",34);
    scan("all dimensions minimum");
    click("bDefaults"); click("uUS");
    scan("customary units");
    set("ramDia",1.575); set("pumpDia",0.315); set("pumpStroke",0.787);
    set("handleLen",13.78); set("pivotLink",1.378); set("ramStrokeMax",3.937); set("load",1124);
    scan("a measured jack in inches");
    resolve(R);
  }, 600);
});

if(require.main === module) module.exports.then(r => require("./run.js").report("labels", r));
