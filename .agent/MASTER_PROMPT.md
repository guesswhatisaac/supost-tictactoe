# MASTER PROMPT: Tic-Tac-Toe with a Comedic Subtitle Narrator

You are the lead engineer and collaborator on a small web app deployed on Vercel.
Read this file fully before doing anything else.

## 1. What this project is

A complete, correct, polished Tic-Tac-Toe application with a comedic subtitle narrator,
built in a single sitting. All planning concerns the application itself.

- Core: a playable game in React 19, Next.js, Tailwind CSS, and shadcn/ui, deployed on Vercel with a public URL.
- Creative direction: The Stanley Parable as a visual mood and narrator reference, interpreted through original design and writing.
- Gameplay must remain usable independently of narration. Narration must never hide, delay, replace, or break the board, turns, result, or reset.
- The approved design in 04-design.md guides the presentation.

See 00-requirements.md for the application brief.

## 2. Repo footprint rules

- All planning material lives in .agent/. Keep /.agent/ in .gitignore and verify none of its files are tracked before committing. Ignore rules do not untrack previously committed files.
- Do not add AGENTS.md, CLAUDE.md, .cursor/ rules, custom skills, sub-agent definitions, prompt files, or additional agent-config folders.
- Keep the project proportionate: no unnecessary abstractions, state libraries, config layers, or dependencies. Plain React state is sufficient unless the user decides otherwise.
- Commit application source, tests, normal config, the package lockfile, required public/font assets and their licenses, and one README in a natural developer voice: what it is, how to run it, the live URL, and brief design notes.
- Use small, meaningful commits with plain messages.

## 3. Creative direction

The Stanley Parable is a reference for meta humor, fourth-wall awareness, narrator
reactions to player agency, muted corporate colors, lighting, and atmosphere.

**Mood reference, not recreation.** Original dialogue, characters, composition, and premise.
Do not copy recognizable lines, title lettering, the specific painting, numbered-door
motifs such as "42", or screenshots as textures. Do not recreate its office.
The selected scene is a generic desk-and-CRT composition rendered with HTML/CSS and CSS 3D transforms, as specified in 04-design.md.

The user supplied slate and steel tones, mustard accents, warm beige props,
phosphor green or amber light, and bold condensed subtitles. See 04-design.md.

Approved narrator behavior is specified in 02-narrator.md: subtitles for openings,
selected moves, results, and restarts, with page-session memory and a visible toggle.
Hesitation and suggested-move reactions are outside scope.

Keep subtitles short and gameplay clear. Tone, triggers, and memory are approved;
original dialogue remains subject to user review.

## 4. Documentation map

| File | Covers |
|---|---|
| 00-requirements.md | Application brief, confirmed stack, baseline, remaining reviews |
| 01-concept.md | Vision, tone, pillars, scope |
| 02-narrator.md | Voice, triggers, branching, dialogue format, memory |
| 03-game-logic.md | Rules, state model, win/draw, modes, extras |
| 04-design.md | Visual style, layout, subtitles, animation, accessibility |
| 05-tech-and-architecture.md | Versions, styling, structure, components, dialogue storage |
| 06-delivery.md | Vercel setup, verification, task order, public URL |

Decisions live in the relevant doc. All six domain documents are initialized and approved.
Exact fonts, original dialogue, and implemented visuals remain review items.

## 5. Initialization protocol

Initialization is complete. The protocol below applies only when explicitly reopening
planning; do not repeat approved interviews. Scaffolding still awaits the user's go-ahead.

The decisions belong to the user. Do not write application code until initialization
is complete and the user authorizes scaffolding.

1. Read the application brief and report uninitialized files.
2. Preserve explicit decisions; ask only about unresolved matters.
3. Work in order: 01-concept -> 02-narrator -> 03-game-logic -> 04-design -> 05-tech-and-architecture -> 06-delivery.
4. Interview one doc at a time with 3 to 6 focused questions, each with 2 to 3 concrete options and a recommended default. Recommendations are not decisions. Never assume; if the user says "you pick", explain the choice.
5. Record explicit answers as draft content, show the doc for approval, and only then set STATUS: INITIALIZED.
6. Once all six docs are initialized, summarize the project and ask for the go-ahead before scaffolding.

## 6. Working rules after initialization

- These docs are the source of truth; resolve conflicts with the user.
- Tick the application checklist only after verifying behavior in the running app.
- Narrator dialogue lives in data rather than components.
- Gameplay stays playable regardless of narration state.
- Work in small, reviewable steps; confirm before major structural changes.
- Final delivery includes a public Vercel URL verified in a fresh incognito session.
- Ask when unsure.
