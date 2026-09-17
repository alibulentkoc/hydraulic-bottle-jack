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
- Student handout retypeset as a LaTeX-style article: centred title block with
  name and date rules, numbered sections and subsections, numbered display
  equations, booktabs-style tables, and a references section. Questions 14 and
  15 removed, a section describing the companion simulation with its link added,
  and a full citation for the activity added at the end. The introduction now
  carries a labelled cross-section figure drawn by the simulation itself, and the
  simulation link is accompanied by a QR code so the printed sheet reaches the
  same page. Both images are embedded in the file, so it stays self-contained. The grading tool's
  suggested weighting was rebalanced to match the shorter question set.
- Handout and simulator now share one set of symbols and one field order, with
  the handout as the reference and the simulator changed to match it. The
  simulator's controls, dashboard rows, drawing dimensions and equation panel use
  the handout's notation (W, s_p, theta, a, b, D_r, d_p, D_i, D_o, H, L, A_r,
  A_p, V_p, h, P, F_p, F_hand, A_res), and its drawing labels the check valves
  INLET and DELIVERY as the handout does. Previously the two named nine
  quantities differently and described the reservoir diameters from opposite
  sides, so a measured value could be typed into the wrong field.
- The entry panel lists the eleven measured quantities in the order of the
  handout's Tables 1, 2 and 3, the sequence a student writes them down in, with
  the four simulation-only fields separated below under their own heading. The
  handle swept angle appears in its data-sheet position as a read-only row
  showing the angle the linkage implies. The answer sheet and grading tool were
  reordered to match and now take the measured swept angle as an input rather
  than deriving it, as question 11 instructs, each flagging a disagreement with
  the linkage over two degrees. A field-order suite reads the canonical order out
  of the handout's own data tables and checks the other three against it.
- One field order across all four documents, taken from the handout's data sheet:
  Table 2 for the nameplate load, Table 3 for the measurements taken with the
  jack assembled, then Table 4 for the internal ones. That is the sequence a
  student writes values down in, so reading down the sheet and typing down the
  panel stay in step. The simulator's entry panel now follows it, with
  the four simulation-only fields (drawing bore, initial ram position, pump
  cylinder length, dead volume) separated below under their own heading, so
  nothing on the bench data sheet has to be hunted for. The handle swept angle
  appears in the panel as a read-only row in its data-sheet position, showing the
  angle the linkage implies. The answer sheet and the grading tool were reordered
  to match, and both now take the measured swept angle as an input rather than
  deriving it, which is what the handout asks for; each reports the angle implied
  by the linkage beside it and flags a disagreement over two degrees. A
  field-order suite checks all four documents agree.
- The simulator now works the handout's questions 2 to 13 from the entered
  geometry, in a Laboratory calculations panel beside the drawing: pump and ram
  areas, displaced volume, lift per stroke, pressure, pump and hand forces,
  torque, hydraulic and linear power, stroke count and time, swept angle and hand
  travel, reservoir area, level drop, capacity and margin, and the force and
  speed factors. Each row carries its formula, results follow the unit toggle and
  are given to four significant figures, and the pumping rate n is adjustable.
  Pressure there is W / A_r, the load alone as the handout has it, which differs
  slightly from the lifting pressure in Live values since that also carries the
  ram's own weight. A suite drives an awkward jack through both the panel and the
  answer sheet and checks the twelve headline answers agree.
- All eleven measured quantities are now genuine inputs. The handle swept angle
  theta is typed in as measured rather than derived, so s_p, a and theta are
  independent exactly as on the bench: the handle sweeps the measured angle, the
  piston travels the measured stroke, and the angle the linkage implies,
  asin(s_p / a), is shown as a cross-check with a warning when the two differ by
  more than two degrees. The reservoir diameters D_i and D_o are kept exactly as
  typed; previously the drawing's ordering rules silently rewrote them, so a
  student entering a real jack found different numbers than they had entered. An
  impossible combination is now reported rather than corrected, and the field
  floors were lowered so small jacks fit. The earlier stroke-limited-by-linkage
  behaviour and its warning are gone.
- Audit fixes. Restore defaults restored the dimensions but not the oil, so the
  reservoir kept whatever volume the previous jack had and could show nearly
  empty against the default capacity; it now refills through the same path as
  any other edit. The drawing used only the lower part of its canvas after the
  vertical geometry became parametric; the body and ram travel scales were
  raised so it fills the space. The INLET label sat under the pump chamber oil
  and the RAM callout sat on the cylinder wall; both moved.
- Question 11 in the simulator and the answer sheet now shows the ideal operator
  power, F_hand times the straight-line hand travel s_p (b / a), beside the arc
  method figure. The ideal value equals the hydraulic power and the lifting power
  exactly, which is the equality an ideal machine must show, and the arc figure
  is reported with the factor a theta / s_p by which it departs. With consistent
  linkage measurements that factor is theta / sin(theta); with a measured angle
  that disagrees with asin(s_p / a) it can fall either side of one. The mismatch
  warning now states that consequence. A check asserts the three powers agree.
- Animated demonstration added to the README.
