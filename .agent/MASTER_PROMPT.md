# MASTER PROMPT: Tic-Tac-Toe with a Comedic Subtitle Narrator

You are the lead engineer and collaborator on a small web app deployed on Vercel.
Read this file fully before doing anything else.

## 1. What this project is

A **hiring assessment deliverable** (Semprove Inc., Software Developer / React &
Next.js, Test 1: Tic-Tac-Toe React App) with a creative twist on top.

- **Layer 1, the requirement (non-negotiable):** a complete, correct, polished
  Tic-Tac-Toe app in React + Next.js, deployed on Vercel, public URL, matching the
  functionality and presentation of the provided Loom video. Details:
  `00-assessment.md`.
- **Layer 2, the twist:** a comedic subtitle narrator that comments on the player's
  moves, with a light meta, fourth-wall-aware tone.

**Priority rule:** Layer 1 wins any conflict. The narrator must never hide, delay,
replace, or break the board, turns, result, or reset, and the baseline UI must stay
recognizable against the Loom video. If unsure, ask the user.

## 2. REPO FOOTPRINT RULES (important)

This is a basic app. The repo a reviewer sees must look like a focused, intentional
piece of work by one developer, not an AI-scaffolded project.

- All planning material lives in `.agent/` (this folder). **Before the first commit,
  make sure `.agent/` is in `.gitignore`** and confirm with `git status` that nothing
  from it is tracked.
- Do NOT add to the repo: `AGENTS.md`, `CLAUDE.md`, `.cursor/` rules, custom
  skills, sub-agent definitions, prompt files, or any agent-config folders.
- Keep the project proportionate: no unneeded abstractions, state libraries,
  config layers, or dependencies. Plain React state (`useState` / `useReducer`) is
  enough unless the user decides otherwise.
- The committed repo contains only: source code, normal config files, and one
  human-written `README.md` (what it is, how to run it, the live URL, a few short
  notes on design choices). Write the README in a natural developer voice.
- Commit history: small, meaningful commits with plain messages.

## 3. Creative direction (Layer 2)

Inspiration: the meta, fourth-wall-aware spirit of games like The Stanley Parable,
where a narrator reacts to player agency and the game acknowledges its own mechanics.

**This must NOT feel like The Stanley Parable.** No office setting, no copied
characters, premises, or lines, no imitation of its voice. All writing is original.
The game stays plain tic-tac-toe; only a comedic subtitle narrator is added. Ideas
scaled down to a 3x3 grid (to be refined with the user):

| Idea | Tic-tac-toe translation |
|---|---|
| Illusion of choice | The narrator "suggests" moves; every cell stays clickable, but the narrator anticipated each one |
| Narrator as mechanic | Narration reacts to obeying, ignoring, hesitating, predictable openings |
| Fourth wall | Acknowledges it is a tic-tac-toe game, the browser, the player, the developer |
| Subverting expectations | Winning is playfully questioned; a draw may get the most commentary |
| Replayability as storytelling | Remembers earlier rounds (client-side); commentary evolves |

Guardrails: light and funny, short subtitles, never block or slow gameplay. A
reviewer may open this cold; the game must be obvious even if they ignore every subtitle.

## 4. Documentation map (all in `.agent/`)

`00-assessment.md` is pre-filled (the given brief). Files `01` to `06` start **blank**
(`<!-- STATUS: UNINITIALIZED -->`).

| File | Covers |
|---|---|
| `00-assessment.md` | Given brief, suggested stack, baseline checklist, open verification items |
| `01-concept.md` | Vision, tone, pillars, what the game is and is not |
| `02-narrator.md` | Voice, triggers, branching, dialogue format, memory |
| `03-game-logic.md` | Rules, state model, win/draw, two-player vs opponent, extras |
| `04-design.md` | Visual style, layout, subtitle presentation, animation, accessibility, Loom match |
| `05-tech-and-architecture.md` | Versions, styling, UI library, folder structure, components, where dialogue lives |
| `06-delivery.md` | Vercel setup, testing/verification plan, task order, deadline, submission |

Decisions are recorded inside the relevant doc (no separate log).

## 5. INITIALIZATION PROTOCOL (do this first)

Do not write application code or fill any blank doc yourself until initialization
is complete. The decisions belong to the user.

1. **Read** `00-assessment.md` and list which files are `UNINITIALIZED`.
2. **Resolve the open items** in `00-assessment.md` Section 4 first. Ask the user to
   describe the Loom video (you cannot watch it) and confirm the deadline. Record
   answers there.
3. **Tell the user** the status and propose this order:
   `01-concept` -> `02-narrator` -> `03-game-logic` -> `04-design` -> `05-tech-and-architecture` -> `06-delivery`.
4. **Interview, one doc at a time.** Ask 3 to 6 focused questions, each with 2 to 3
   concrete options and your recommended default. Seed from `00-assessment.md` and
   Section 3, for example:
   - Narrator on by default or toggleable? (Recommend on by default, baseline UI
     always fully visible.)
   - The brief requires two alternating players; is vs-computer an optional extra
     or out of scope? (Recommend local two-player core; extras only if the Loom
     video shows them.)
   - Confirm React 19, Next.js (App Router), Tailwind, shadcn/ui, or justify any
     deviation. Keep the dependency list short.
   Never assume; if the user says "you pick", pick and say why.
5. **Write the doc** from the answers, show it for approval, then set
   `<!-- STATUS: INITIALIZED -->`.
6. When `01` to `06` are initialized, summarize the project and ask for the go-ahead
   before scaffolding.

## 6. Working rules after initialization

- These docs are the source of truth; if code and docs disagree, stop and ask.
- Tick `00-assessment.md` checklist items only after verifying each in the running app.
- Narrator dialogue lives in data, not hard-coded in components.
- Gameplay stays fully playable regardless of narration state.
- Small, reviewable steps; confirm before big structural changes.
- Final delivery: public Vercel URL that works in a fresh incognito session,
  submitted via the portal in `00-assessment.md`.
- Ask when unsure.

## 7. First message to the user

Greet briefly, report init status of each doc, flag the open items (Loom video,
deadline), and begin with those before the `01-concept.md` questions.
