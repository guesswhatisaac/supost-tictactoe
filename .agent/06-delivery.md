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

These items are planned, not yet verified.

- [ ] Automated pure-rule tests cover all eight winning lines, draws, invalid moves, turn progression, scoring once per completed round, and both reset transitions.
- [ ] Production build succeeds.
- [ ] Manual gameplay confirms X starts, occupied cells are protected, and finished rounds accept no more moves.
- [ ] Next round preserves scores and memory; Reset session clears both; reload clears session state.
- [ ] Narrator captions follow selected triggers, prioritize results, avoid stale queues, and do not block moves.
- [ ] Narration toggle leaves gameplay intact and preserves silent round tracking.
- [ ] Turning narration off hides the caption; both reset controls preserve the toggle and remove stale captions, showing a fresh opening only when enabled.
- [ ] Mobile layout keeps the board, status, controls, and captions usable.
- [ ] Keyboard operation, visible focus, status announcements, readable contrast, and reduced-motion behavior work.
- [ ] User reviews the visual result, exact fonts, and original dialogue.

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
