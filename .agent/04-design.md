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

Muted gray dominates, mustard is the primary accent, and phosphor green or amber
is reserved for light sources.

## Selected scene

- Small desk-and-CRT composition in dim charcoal surroundings with a warm desk lamp.
- The board is inside the CRT screen.
- Use the reference mustard and off-white for X and O, with CSS depth effects consistent with the screen composition.
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

## Accessibility and motion

- Use keyboard-playable cells with meaningful accessible names and visible focus.
- Announce turn and result changes accessibly; game status remains separate from narrator captions.
- Respect reduced-motion preferences by removing nonessential animation and transitions.
- Keep text and control contrast readable within the reference palette.
- No additional high-contrast toggle is in the selected scope.

## Approval

The user approved this design. Exact font selection and implementation details are handled
in the architecture discussion and visual review; no specific font asset is selected yet.
