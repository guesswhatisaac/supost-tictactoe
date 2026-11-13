# Tech Stack & Architecture

<!-- STATUS: INITIALIZED -->

## Confirmed main stack

- React 19
- Next.js
- Tailwind CSS
- shadcn/ui
- Vercel deployment

## Approved architecture

- **Language:** TypeScript, with TSX for React components. React and Next.js remain the core framework stack.
- **Routing:** Next.js App Router with a single game page.
- **State:** one React reducer for game/session state, with separate narrator logic. No external state library.
- **Dialogue:** typed local data with no runtime API calls. Original lines remain subject to user review.
- **Styling:** Tailwind for layout, CSS for the CRT/scenery and perspective, and shadcn/ui for suitable controls.
- **Typography:** a bundled condensed display font plus a readable UI font. Exact font families remain to be selected and reviewed before adding assets.
- **Rendering:** HTML/CSS with CSS 3D transforms. No Three.js or React Three Fiber.
- **Sound:** optional quiet Web Audio synthesis, created lazily during interaction, with no audio files or new packages. The bezel sound control is independent of the game reducer and always-on captions. Playback failure must not interrupt gameplay; stop active voices on mute and dispose the audio context on unmount.
- **Hover feedback:** quiet, pitch-varied ticks on entering playable squares or focusing controls, only after an interaction has unlocked audio. Hover never creates/resumes an audio context, queues sounds, or interrupts result cues; throttle rapid transitions and skip touch pointer entry.
- **Sound refinement:** X uses a bright rising two-note triangle click; O uses a lower descending sine tone. A shared 1.5 gain multiplier raises every cue, including hover, by 50% relative to its prior envelope.

## Component and data boundaries

- Keep the page shell separate from the interactive client-side game.
- Group board, status/score display, controls, captions, and decorative scenery by responsibility. Keep the structure proportionate to one page.
- Keep move validation, winner/draw detection, scoring, and reset transitions in pure game logic used by the reducer.
- Keep narrator line selection separate from game rules, consuming game events and session context.
- Store dialogue outside UI components in typed local data.
- Share round outcomes and scores rather than keeping conflicting copies in narrator state.
- No backend, account system, database, or remote narration service is needed for the selected scope.

## Configuration details

- React 19 is confirmed. Select mutually compatible Next.js, Tailwind, and shadcn/ui versions during scaffolding and record the installed versions in the package manifest and lockfile.
- Use npm and commit its lockfile.
- Verification covers automated game-rule tests, a production build, and manual gameplay, mobile, and keyboard checks. Automated browser tests are outside the initial scope.
- Propose specific bundled font families for user review before adding their assets. Exact fonts remain a content-review item, not an architecture blocker.

The architecture and delivery defaults are approved by the user. See 06-delivery.md for execution order and verification.
