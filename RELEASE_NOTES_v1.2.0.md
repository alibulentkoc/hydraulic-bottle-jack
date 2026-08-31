v1.2.0 - Browser compatibility, label layout, and reservoir geometry

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
  Handle length is bounded so the grip stays on the canvas.
- Five geometry invariants added for those: pivot above the pump cylinder,
  handle tip on canvas, ram protrusion at rest, load block on canvas, and the
  oil column contained by the body.
- Animated demonstration added to the README.
