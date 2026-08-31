/* Browser compatibility guard. The three artifacts are handed to students on
   whatever machine they have, so the source must stay inside a conservative
   feature floor: ES6 (2015) syntax, no ES2017+ library methods, no CSS or SVG
   feature that fails silently or illegibly when unsupported. */
const fs = require("fs");
const { SIM, SHEET, HANDOUT, GRADER } = require("./extract.js");

const FILES = [["simulator", SIM], ["answer sheet", SHEET], ["handout", HANDOUT],
               ["grader", GRADER]];

/* Comments explain which features are avoided and why, so they name the very
   patterns being banned. Strip them before scanning, or the prose fails the
   check that the code passes. */
function code(src){
  return src
    .replace(/\/\*[\s\S]*?\*\//g, " ")     // block comments, JS and CSS
    .replace(/^[ \t]*\/\/.*$/gm, " ")        // whole-line JS comments
    .replace(/<!--[\s\S]*?-->/g, " ");        // HTML comments
}

// pattern, name, and an optional guard that makes the usage safe
const BANNED = [
  [/\.flat\s*\(/,                 "Array.prototype.flat (ES2019)"],
  [/\.flatMap\s*\(/,              "Array.prototype.flatMap (ES2019)"],
  [/\.replaceAll\s*\(/,           "String.replaceAll (ES2021)"],
  [/Object\.fromEntries/,         "Object.fromEntries (ES2019)"],
  [/\?\?[^?]/,                    "nullish coalescing (ES2020)"],
  [/[^\w)\]]\?\.\s*[\w[(]/,       "optional chaining (ES2020)"],
  [/Math\.hypot/,                 "Math.hypot (no IE, rounding differences)"],
  [/structuredClone/,             "structuredClone (2022)"],
  [/localStorage|sessionStorage/, "web storage (blocked in some contexts)"],
  [/createSVGPoint|getScreenCTM/, "SVGPoint / getScreenCTM (deprecated in SVG2)"],
  [/gap\s*:/,                     "flex or grid gap (flex gap needs Safari 14.1+)", /display\s*:\s*grid/],
  [/:is\(|:where\(/,              "CSS :is() / :where() (2021)"],
  [/aspect-ratio\s*:/,            "CSS aspect-ratio (2021)"],
  [/accent-color\s*:/,            "CSS accent-color (2021)"],
  [/inset\s*:/,                   "CSS inset shorthand (2021)"]
];

const R = [];
for(const [label, file] of FILES){
  const src = code(fs.readFileSync(file, "utf8"));
  for(const [pat, name, allowIfNear] of BANNED){
    let bad = pat.test(src);
    if(bad && allowIfNear){
      // allow the pattern only on lines that also carry the guard
      bad = src.split("\n").some(l => pat.test(l) && !allowIfNear.test(l));
    }
    R.push([!bad, label + ": no " + name]);
  }
  // paint-order must be feature detected, never assumed
  if(/paint-order/.test(src)){
    R.push([/CSS\.supports\("paint-order"|window\.CSS\.supports\("paint-order"/.test(src),
            label + ": paint-order is feature detected"]);
  }
  // any pointer-event listener needs a mouse or touch fallback beside it
  if(/addEventListener\("pointer/.test(src)){
    R.push([/PointerEvent/.test(src) && /addEventListener\("mousedown"/.test(src),
            label + ": pointer events have a mouse and touch fallback"]);
  }
  // focus-visible needs a plain focus rule too
  if(/:focus-visible/.test(src)){
    R.push([/:focus\{/.test(src), label + ": :focus-visible has a :focus fallback"]);
  }
}

module.exports = R;
if(require.main === module) require("./run.js").report("compatibility", R);
