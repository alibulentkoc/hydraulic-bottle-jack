/* Test runner. Exit code 1 on any failure, so CI fails the build. */
function report(suite, rows){
  let failed = 0;
  console.log("\n" + suite.toUpperCase());
  for(const [pass, name, note] of rows){
    if(!pass) failed++;
    console.log("  " + (pass ? "pass" : "FAIL") + "  " + name.padEnd(50) + (note || ""));
  }
  console.log("  " + (rows.length - failed) + "/" + rows.length + " passed");
  return failed;
}
module.exports = { report };

if(require.main === module){
  (async () => {
    let failed = 0;
    failed += report("physics",      require("./verify-physics.js"));
    failed += report("geometry",     require("./verify-geometry.js"));
    failed += report("answer sheet", require("./verify-answer-sheet.js"));
    failed += report("interface",    await require("./verify-dom.js"));
    failed += report("labels",       await require("./verify-labels.js"));
    failed += report("compatibility", require("./verify-compat.js"));
    console.log(failed ? "\n" + failed + " failing check(s)\n" : "\nall checks passed\n");
    process.exit(failed ? 1 : 0);
  })();
}
