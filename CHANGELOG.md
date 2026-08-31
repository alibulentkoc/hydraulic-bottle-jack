# Changelog

## 1.1.0 - 2026-08-30

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
