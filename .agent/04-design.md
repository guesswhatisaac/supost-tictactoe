# Design & UX

<!-- STATUS: INITIALIZED -->

## Seeded user reference

The Stanley Parable is a mood reference, not a scene to recreate.
Borrow muted corporate colors, utilitarian geometry, lighting, atmosphere,
and condensed typography. Use original composition and generic props.

Reference qualities:
- Institutional 90s materials: laminate, pale cabinets, beige CRT housing.
- Office reference: flat fluorescent lighting, low contrast, soft shadows.
- Title-art reference: dim desk, one warm lamp, heavy vignette.
- Chunky simple planes, little ornament, primitive boxes and cylinders.
- Tall, bold, condensed, all-caps off-white display type.

## Reference palette

| Role | Color | Hex |
|---|---|---|
| Upper surfaces | Slate blue-gray | #6F7B88 |
| Lower surfaces | Dark steel | #4A5561 |
| Main accent | Mustard ochre | #B9962F |
| Desk and cabinets | Pale cool gray | #B8BEC4 |
| CRT and paper | Warm beige | #CFC6AE |
| Signal accents | Red / green / yellow | #C0392B / #5E9B4A / #D9B93A |
| Screen glow | Phosphor green | #6EE08A |
| Dark background | Charcoal | #18181A |
| Lamp light | Warm amber | #E8A94B |
| Text | Off-white | #F2F0EA |

Muted gray dominates; mustard accents the title and physical controls. Following the
user's CRT refinement, phosphor green also colors the on-screen marks, turn/result,
board lines, and scores. Amber remains the lamp-light accent.

## Selected scene

- Small desk-and-CRT composition in dim charcoal surroundings with a warm desk lamp.
- Updated from the user's supplied layout reference: a large centered original Tic-Tac-Toe wordmark above the CRT, lamp on the left, keyboard in front, and mug on the right. Borrow composition and atmosphere without reproducing the reference's title art or numbered wall.
- The board is inside the CRT screen.
- Use green phosphor marks and screen content on a near-black CRT screen, with subtle glow and depth. X and O remain distinguishable by shape.
- Add static scanlines, a fine phosphor-mask texture, edge shading, and a faint glass reflection. Overlays are decorative, ignore pointer input, and do not flicker or animate.
- Use a dark blue-gray upper wall and darker lower paneling, with a clear thin horizontal chair rail near 56% of the viewport height, based on the user's clarified reference. No vertical stripe behind the title. Keep the room and tabletop dim, with restrained lamp spill.
- The tabletop spans the full viewport and continues into the foreground; it must not end as a floating slab inside the scene container.
- Bold condensed white subtitles at the bottom, in a dedicated area that does not overlap gameplay or controls.
- Fixed camera with subtle interaction effects. No camera drift.
- Build scenery from HTML and CSS shapes; no external 3D model assets.
- Fluorescent office lighting remains reference context rather than the selected scene lighting.

Do not copy office layouts, characters, dialogue, title lettering, the specific
painting, numbered-door motifs such as "42", or screenshot textures.

## Selected rendering approach

- CSS 3D transforms for perspective and depth, with CSS gradients and shadows for lighting cues.
- Do not add Three.js or @react-three/fiber. Real volumetric fog, dynamic scene lighting, and a 3D camera are outside the selected approach.

## Responsive layout

- On small screens, simplify scenery and enlarge the playable CRT rather than switching to a different flat-board presentation.
- Keep all nine cells, turn/result text, scores, reset controls, and narrator toggle accessible without scenery obscuring them.
- Decorative perspective must preserve legible labels and usable cell targets.
- Fit the composition to the available viewport height so the board, scores, and reset controls can be seen without scrolling on common desktop, tablet, and phone screens. Adapt the title and scene to a side-by-side layout on short landscape viewports.
- Size the board from the scene's available height and width. Clip only decorative overflow; do not hide gameplay or controls to simulate a fitting layout.

## Copy and visual restraint

- The user rejected promotional labels and filler such as "A game for two", "One device. Nine squares. Three in a row.", "Local / Two players", and the local-player/rules footer.
- Remove those entire header/footer groups and their divider lines. Keep the title, actual turn/result, scores, and actionable controls.
- Reset explanations belong on the controls as concise descriptive titles rather than an extra visible paragraph under the monitor.

## Accessibility and motion

- Use keyboard-playable cells with meaningful accessible names and visible focus.
- Announce turn and result changes accessibly; game status remains separate from narrator captions.
- Respect reduced-motion preferences by removing nonessential animation and transitions.
- Keep text and control contrast readable within the reference palette.
- No additional high-contrast toggle is in the selected scope.

## Approval

The user approved this design. Exact font selection and implementation details are handled
in the architecture discussion and visual review; no specific font asset is selected yet.
