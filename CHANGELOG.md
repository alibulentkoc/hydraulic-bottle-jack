# Changelog

## 1.2.0 - 2026-08-30

- Simulator reservoir is now defined by measurable geometry: jack body inside
  diameter, lifting cylinder outside diameter, and oil column height. Annulus
  area, capacity, oil level, level drop at full stroke, and capacity margin are
  derived from those and reported live. Replaces the previous reservoir volume
  input, which could not be measured on a real jack.
- Annulus width and cylinder wall thickness in the drawing are now parametric,
  and the physical ordering bore < cylinder OD < body ID is enforced.
- Warning when the reservoir cannot supply a full extension.
- Handout and answer sheet: added the reservoir oil column height measurement
  and a capacity and adequacy check as question 12(b).
- Geometry verification sweep extended over the three new dimensions.
- Label layout reworked so annotations no longer overlap: reservoir callouts run
  vertically in their columns, the pump diameter dimension moved to a clear lane
  below the casting with extension lines, valve names sit above their galleries,
  pressure readings moved to a fixed corner block with colour chips, and the
  handle and linkage labels were separated into their own rows.
- New verification suite checks every label for overlap and for leaving the
  canvas, at both dimension extremes and in both unit systems.
- Browser compatibility floor lowered and enforced: removed Array.prototype.flat,
  Math.hypot, getScreenCTM, SVGPoint, flexbox gap and accent-color; added a
  mouse and touch fallback for the draggable handle, feature detection for
  paint-order, and a :focus fallback for :focus-visible. A new compatibility
  suite checks the source against the floor on every push.
- Vertical geometry made parametric. Body height and the drawn oil column now
  follow the reservoir column height, ram travel on screen follows the entered
  ram stroke, ram length keeps a constant protrusion at rest, and the handle
  pivot sits above the pump cylinder whatever the pump stroke and cylinder
  length, which removes the case where the handle passed through the cylinder.
  Handle length is bounded so the grip stays on the canvas. The lifting cylinder
  is likewise floored by the ram travel, so a long stroke lengthens the cylinder
  instead of walking the ram out of it and drawing the chamber outside the body.
- Seven geometry invariants added for those, including ram engagement at full
  stroke and the chamber staying inside the cylinder: pivot above the pump cylinder,
  handle tip on canvas, ram protrusion at rest, load block on canvas, and the
  oil column contained by the body.
- Reservoir now shows the oil still committed to a full extension as a shaded
  band above the dashed level that would remain. The true drop is a fraction of
  a millimetre per stroke and reads as static, so changing ram stroke or ram
  diameter previously moved the numbers without moving the reservoir. The band
  turns red when the reservoir cannot cover the remaining stroke.
- The reservoir now follows the lifting cylinder. Raising the ram stroke or bore
  past what the oil can supply resizes the oil column to cover it with a 25 per
  cent margin, and says so in the panel rather than doing it silently. A typed
  value always wins, so a measured jack can still be entered and shown to be
  inadequate. A Fit reservoir button applies the same sizing on demand.
- New instructor grading tool, lab/bottle-jack-lab-grader.html. Enter the master
  dimensions of a jack and what a group reported; it audits each dimension
  against a per-feature tolerance and recomputes every answer twice, once from
  the master values and once from the reported ones, so method can be credited
  separately from measurement. Raises flags for readings that match the master
  exactly, for a level drop exceeding the oil column, and for the arc-versus-chord
  discrepancy in question 13, and carries a suggested mark weighting.
- Animated demonstration added to the README.

## 1.0.0 - 2026-08-30

First public release.

- Interactive bottle jack cross section: parametric geometry, explicit
  hydraulic state machine, ram displacement derived from oil volume
  conservation, live handle angle and operator force vector, section
  hatching on cut material, SI and US customary entry.
- Student laboratory handout: objectives, eight core principles, safety,
  procedure ordered for jacks that hold no oil, data tables, and questions
  2 through 15.
- Instructor answer sheet: live formulas, substitutions, and results that
  recompute from entered measurements.
- Verification suite: 63 checks across physics, drawing geometry, the
  answer sheet solver, and interface behaviour.
