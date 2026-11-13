# Delivery: Deployment, Testing, Checklist

<!-- STATUS: INITIALIZED -->

## Approved workflow

The user approved the recommended architecture and delivery workflow.
Implementation begins only after the initialization summary and explicit go-ahead,
as required by MASTER_PROMPT.md.

1. Scaffold the approved React/Next.js/TypeScript stack using npm.
2. Build a playable game with pure rules, session scoring, and both reset controls.
3. Apply the CSS 3D CRT/desk styling and responsive, accessible layout.
4. Add the narrator using user-reviewed original dialogue and the approved behavior.
5. Complete verification and correct failures.
6. Prepare the Vercel deployment for user approval, then deploy when authorized.

## Before implementation and commits

- Summarize initialized decisions and obtain the user's go-ahead before scaffolding.
- Propose exact font families for review before adding font assets.
- Review original narrator dialogue with the user before treating it as final content.
- Before the first commit, ignore .agent/ and verify no planning files are tracked.
- Keep source, config, dependencies, README, and commits proportionate to the application.

## Verification checklist

Checked items have automated verification; unchecked items remain review work.

- [x] Automated pure-rule tests cover all eight winning lines, draws, invalid moves, turn progression, scoring once per completed round, and both reset transitions.
- [x] Gameplay, CRT scene, and narrator production build succeeds.
- [ ] Complete final manual gameplay review; browser automation has verified X starts, a win, and both resets, while rule tests cover invalid moves and terminal locking.
- [x] Automated rule/browser checks verify Next round preserves scores and memory, Reset session clears both apart from the documented short-lived spam counter, and reload clears session state.
- [x] Narrator captions follow selected triggers, prioritize results, avoid stale queues, and do not block moves (rule and browser checks).
- [x] Narrator button removed at the user's request; captions remain available independently of sound muting.
- [x] Sound-effects control mutes playback, leaves gameplay and captions intact, and survives both resets (browser checks).
- [ ] Complete final mobile review including narrator captions. Browser checks currently verify the board, status, and reset controls at 390px and 320px.
- [x] Browser checks verify keyboard activation, visible focus, accessible cell/prop/control names, polite status/caption regions, and reduced-motion behavior.
- [ ] Complete manual screen-reader and contrast review, including the user-requested dark wall-lettering treatment.
- [x] User approved Barlow Condensed and IBM Plex Mono, plus narrator tone and implementation.
- [ ] User reviews the final rendered visual result and narration pacing.

## Deployment and handoff

- Prepare a concrete, locally verified result before requesting deployment approval.
- Deploy on Vercel after approval; do not infer deployment authorization from planning approval.
- Verify the public URL in a fresh incognito session, including a full round and reset.
- Include setup commands, the live URL, and short design notes in a natural developer README.
- Record actual deployment configuration and the public URL once available; do not invent them in advance.

## Scope

- Single-sitting application with one polished scene.
- No automated browser-test suite in the initial scope.
- No application code, tests, build, or deployment has been completed by initializing this document.

## Scaffold progress

- User authorized scaffolding. App Router, TypeScript, Tailwind, shadcn/ui configuration and Button, and a placeholder home page are implemented.
- Installed Next.js 16.4.6, React 19.3.1, Tailwind 4.3.5, and TypeScript 5.9.3; exact versions are recorded in package.json and package-lock.json.
- Type checking and the production build pass. npm installation reports zero known vulnerabilities after removing optional ESLint tooling.
- No browser/manual gameplay verification has occurred; the placeholder has no game behavior yet.
- Exact fonts and original dialogue remain pending review. No deployment or commit was made.
- .agent/ is ignored for new files but existing planning files remain tracked; the earlier untracking permission request was rejected. Resolve before committing.

## Gameplay progress

- Implemented the client-side board, live turn/result status, winning-cell highlights, session scoreboard, Next round, and Reset session.
- Pure game rules and reducer are separate from the UI; accepted moves and resets expose events for the future narrator.
- Twenty-six rule tests pass, including an exhaustive check of all 5,478 reachable boards. Type checking and the production build pass.
- Production HTTP smoke check returned 200 with nine labeled board buttons and both reset controls. The temporary verification server was stopped.
- Browser interaction, screen-reader, and mobile visual checks remain unverified. Do not tick manual verification or the application baseline from rule tests alone.
- Tests use Node's built-in runner and TypeScript stripping. Minimum supported Node version is now 22.6, reflected in package.json, the lockfile, and README.
- No narrator, custom font assets, CRT scene, deployment, or commit was added in this step.

## CRT scene progress

- Implemented the approved CSS 3D CRT composition, warm lamp, desk, mug, and keyboard using HTML/CSS only. The view is fixed.
- Mobile layout retains the CRT, hides peripheral props, and preserves playable cell sizes and reset controls.
- Kept native board buttons, accessible labels and status updates, winning highlights, visible focus styling, and reduced-motion behavior. No custom font assets or narrator dialogue were added.
- Verified in headless Chrome: a desktop winning round, winning-cell highlights, Next round preserving score, Reset session clearing score, mobile pointer input, keyboard Enter activation, 44px minimum controls and no horizontal overflow at 390px and 320px, and reduced-motion transition removal.
- Inspected desktop and mobile screenshots. Final user visual review and screen-reader checks remain pending.
- All 26 game-rule tests and the production build pass after styling.
- Reused the user's running development server at localhost:3000 without stopping it. Browser verification used a separate temporary profile.

## Layout refinement

- Removed the user-rejected labels, their sections and divider lines, and the visible reset-explanation paragraph. Reset buttons retain descriptive titles.
- Recentered the title and CRT, moved the lamp left and mug right, and sized the composition from the viewport. Short landscape screens use a side-by-side title and terminal.
- Headless Chrome checks confirm no page scrolling and all gameplay/reset controls visible with at least 44px targets at 1920x1080, 1440x900, 1366x768, 1280x720, 768x1024, 390x844, 375x667, 320x568, and 844x390.
- Rechecked desktop winning play, both resets, mobile input, keyboard Enter activation, and reduced-motion handling. Inspected desktop and phone screenshots.

## CRT and environment refinement

- Darkened the CRT, changed screen content to green phosphor, and added static scanlines, phosphor-mask texture, glass reflection, and edge shading. Overlays ignore pointer events.
- Added CSS blue-gray wall panels and dark trim inspired by the user's latest reference.
- Moved the tabletop from the bounded scene to a full-viewport decorative layer, removing the abrupt side cutoff.
- Rechecked gameplay, resets, keyboard/mobile input, and no-scroll/44px-control requirements across all nine documented viewport sizes. Inspected the updated desktop and phone screenshots.

## Narrator content review

- Prepared a 24-line original dialogue draft in 02-narrator.md, covering the approved events and replay variation.
- Dialogue is explicitly pending user approval and has not been added to application components or runtime data.
- After approval, implement typed local dialogue data, separate narrator selection/memory logic, a visible toggle, and a dedicated caption region; verify result priority, silent tracking, resets, and no-scroll layout.

## Narrator implementation

- The user approved the recommended politely controlling baseline with quiet exasperation across replays and explicitly authorized implementation, superseding the previous draft-only status.
- Added 48 typed local lines in src/lib/dialogue.ts, pure narrator memory/selection, and a session reducer coordinating game and narrator state without effects or timers.
- Added a dedicated live subtitle region and visible Narrator on/off toggle. Reserve footer space and simplify keyboard scenery on compact-height layouts so captions do not cover controls.
- All 39 tests pass, including 13 narrator/session tests. Type checking and the production build pass.
- Headless Chrome verifies actual repeated-center tone progression, muting, gameplay and score tracking while muted, fresh resume commentary, reset preserving the toggle, and reload returning to default narration.
- All 48 captions were measured at the nine documented viewport sizes: no overlap with game controls, no page scrolling, and 44px minimum buttons including the toggle. Inspected desktop, phone portrait, and phone landscape screenshots.
- Actual screen-reader review and final user visual/font review remain pending. No deployment or commit was made.

## Wall caption placement

- At desktop sizes, moved narration to the wall on the right of the computer, left-aligned with dark ink and subtle surface shading instead of a floating subtitle box.
- Restored the desk keyboard at normal desktop heights. Narrow/short layouts retain the dedicated caption footer and simplified scenery.
- Browser checks cover all 48 captions at the nine documented viewport sizes, ensuring no overlap with the CRT or toggle, no scrolling, and usable control targets. Reviewed the desktop result visually.

## Sound effects and narrator button removal

This supersedes historical entries about the narrator toggle and its resume dialogue.

- Removed the narrator button, its state/action, and the four unreachable resume lines. Captions are always on; 44 live lines remain.
- Added distinct quiet synthesized move tones, a win chime, a draw cue, and separate reset sounds using native Web Audio, with no audio assets or additional dependencies.
- A compact speaker icon on the CRT bezel controls sound only. Muting stops scheduled voices; both resets preserve it. Reload returns sound to its default enabled setting.
- Audio is initialized lazily during interactions, with low gain and short envelopes. Invalid moves are silent; results supersede normal move sounds. Rapid actions replace pending audio. Unsupported/blocked audio does not affect gameplay. Audio context is disposed on unmount.
- All 42 tests and type checking pass. Browser checks instrument actual oscillator scheduling, verify no audio initialization on page load, mute/resume, reset preserving mute, unsupported-audio fallback, and all 44 captions fitting at nine viewport sizes with 44px minimum controls and no scrolling.
- Final audible-volume review on the user's device remains part of visual/interaction review.

## Hover, controls, and mug refinement

- Added softer, pitch-varied hover/focus sounds for playable cells and controls. Only run after interaction has unlocked audio; throttle rapid transitions, ignore stationary hover and touch entry, and leave result cues uninterrupted.
- Added a code-native SVG beige/green cursor for interactive buttons and retro uppercase monospace button lettering, allowing labels to wrap on narrow screens.
- Fixed mug stacking with a separate cup body over the handle, and lowered the handle below the rim.
- All 42 tests and type checking pass. Browser checks verify distinct hover pitches, stationary hover silence, muting, no hover audio initialization, cursor/font application, mug z-order, and no-scroll/target-size/caption-fit checks at all nine documented viewport sizes. Inspected desktop and 320px screenshots.

## Placement sounds, gain, and global cursor

- Distinguished X placement with a bright rising double tick and O with a rounded descending sine tone.
- Applied the requested 50% gain increase centrally to all effects: main peak gain 0.045 to 0.0675 and hover gain 0.012 to 0.018.
- Refined the custom arrow and applied it consistently to the entire document, including text, wall, CRT, active controls, and occupied cells.
- All 42 tests pass. Browser instrumentation confirms the gain values and identical computed cursors inside/outside the CRT; existing sound, mute, gameplay, and nine-viewport layout checks pass.

## Placement/reset audibility fix

- The user reported missing placement and next/reset sounds. Increased cue duration and added a short sustained gain segment instead of an immediate exponential fade, retaining the requested 1.5 gain multiplier.
- Added a 20ms renderer lead-in. X retains a bright rising double tick; O is a rounded descending 440-to-330Hz tone. Next round and Reset session now use longer, clearly pitched two-note cues.
- Browser verification now routes the actual mixed signal through an analyser rather than relying only on oscillator-start instrumentation. Measured nonzero substantial output for all four cues: X RMS about 0.039, O about 0.048, Next round about 0.039, and Reset session about 0.039.
- Hover, mute/resume, unsupported-audio fallback, gameplay, and all nine viewport checks still pass. User-device listening review remains necessary for subjective loudness.

## Contextual narration and scenery paths

The user's script-reference and follow-up scenery requests supersede the earlier
restriction to simple move/result triggers. Game rules and the one-scene scope remain.

- Reviewed the supplied 131-page PDF's organization and representative idle, repeated-action, revisiting, interrupted-story, and restart sections for structure. Wrote original dialogue; no reference dialogue or PDF content is shipped in the application.
- Expanded to 134 original lines across 56 categories: tactical opportunities, forks, repeated/changed sequences, abandonments, outcome streaks, first points, equalizers, draws, score resets, occupied/finished-cell persistence, pauses, speaker use, scenery, and button spam.
- Added connected callbacks: missed opportunity to eventual win, repeated abandonment to renewed play, long pause to return, and room detours to returning to the board.
- Added a once-per-round 18-second idle observation, canceled on blur/hidden pages and protected against stale board/round state. No move is delayed or forced.
- Keyboard, mug, and lamp have labeled pointer/Enter/Space interactions. The room handler observes wall/table clicks while excluding game controls and text selection. Each object has a distinct synthesized tap, obeying the existing mute setting.
- Three repeated object taps, six detours, and ten detours progress through familiarity, boredom, and resignation. Rapid control bursts escalate at four and eight presses; valid moves or an 850ms gap break the burst. Only this ephemeral burst counter survives session resets, without retaining board or score history.
- All 54 automated tests and type checking pass. Production build passes.
- Browser checks confirm actual contextual paths, the real idle interval and return, pointer and keyboard prop activation, all five object-specific audio outputs, escalating distraction and button-spam behavior, and no game-state changes from props/invalid attempts.
- All 134 captions fit without CRT/control overlap or page scrolling at all nine documented viewports. Existing gameplay, keyboard, mute, hover, cursor, and audio-output checks still pass.
- Next review: dialogue pacing and line selection, final font choice, and remaining manual accessibility/visual checks. Deployment remains pending user approval of the prepared application.

## Pacing and bundled-font pass

- Added deterministic reading room for incidental asides: 900ms between routine prop/speaker lines, with 1600ms result priority over those minor interruptions. No queues or gameplay delays. Meaningful game events and deliberate spam/distraction milestones remain immediate.
- Suppressed asides still track interactions and play sound, but do not count unspoken text as used. Prop, speaker, and occupied-square interactions restart the idle interval.
- User selected bundled Barlow Condensed for title/captions and IBM Plex Mono for controls. Added unmodified upstream font files plus their original OFL licenses in public/fonts, loaded through next/font/local with no runtime font service. Title uses Barlow Black 900; captions use Bold 700; controls/status/scores use Plex Mono Bold 700.
- Increased small-screen caption sizing with the condensed face. Inspected desktop and 320px screenshots.
- All 57 tests, type checking, and the production build pass. Browser checks confirm actual custom-font rendering, caption pacing, native keyboard focus and its visible ring, accessible names, live-region attributes, the full narration/audio/scenery paths, and all 134 captions fitting at all nine documented viewport sizes.
- Final user visual/pacing review and manual screen-reader/contrast review remain. Preserved the explicitly requested dark wallpaper lettering rather than changing that art direction. No deployment or commit was made.

## Website logo

- Created an original code-native SVG CRT/game logo matching the beige, phosphor-green, and mustard palette, plus a transparent 512px PNG, 32px ICO favicon, and 180px Apple icon.
- Added browser icon metadata in the root layout. Kept the established page wordmark and scene composition intact.

## Responsive and zoom pass

- Moved the title wholly onto the wall and narration into the desk surface, following the latest user request. Wide layouts pair a left wall title with the computer on the right; portrait layouts center the title and computer. Short landscapes reserve lower-left desk space for captions.
- Consolidated responsive scenery in src/app/scene.css. A shared viewport-relative unit scales the CRT, board, props, fonts, spacing, and textures together, avoiding the tiny floating monitor seen at zoom-out. Retained readable text and at least 44px game/control targets. Simplified props on compact layouts.
- Corrected a short-landscape caption overlap and a monitor-stand/tabletop gap. Disabled Next.js's development indicator because it covered the desk/captions on small screens.
- Browser geometry checks pass 42 cases: 23 screen sizes from 280px phones to 3840px desktops, 15 zoom-equivalent viewports spanning 25% to 300% on a 1920x960 display, and four high-density cases. All 134 captions stay on the desk without computer/keyboard overlap, clipping, or page scrolling. Reviewed representative desktop, portrait, and zoom screenshots.
- Full browser regression passes gameplay, narration pathways/pacing, keyboard focus/accessibility attributes, props, mute/hover/audio output, fonts, cursor, and mug layering. All 57 automated tests and the production build (including TypeScript) pass.
- Browser zoom coverage uses viewport/device-scale emulation rather than operating the browser's zoom toolbar. Manual screen-reader and user-device visual/audio review remain. No deployment or commit was made.

## Centered desktop composition correction

- Restored the user's preferred centered desktop arrangement: single-line wall title above the CRT, keyboard directly below, and lamp/mug grouped closer to the computer. Removed the forced title line break. Desk captions remain left-aligned within a centered area.
- Retained viewport-relative scaling, minimum control sizes, and compact-screen adaptations. Rechecked all 42 screen/zoom cases and all 134 captions; reviewed 1366x768 and 1920x1080 screenshots.

## Phone spacing refinement

- Portrait narration now follows the monitor stand with a small consistent gap, rather than sitting at the viewport bottom. Spare height is distributed around the grouped scene and the desk boundary moves with the computer, reducing empty tabletop space.
- Rechecked all 42 screen/zoom cases with all 134 captions; inspected 390x844 and 320x568 screenshots. Desktop wall narration remains on the right of the computer with left-aligned text.
