import type { GameAction, GameState } from "./game.ts";

export type SoundCue = "move-x" | "move-o" | "win" | "draw" | "next-round" | "reset-session";

export function getSoundCue(previous: GameState, next: GameState, action: GameAction): SoundCue | null {
  if (previous === next) return null;
  if (action.type !== "play") return action.type;
  if (next.result.type === "win") return "win";
  if (next.result.type === "draw") return "draw";
  return previous.turn === "X" ? "move-x" : "move-o";
}

type Note = { frequency: number; delay: number; duration: number; wave?: OscillatorType };

const cues: Record<SoundCue, readonly Note[]> = {
  "move-x": [{ frequency: 460, delay: 0, duration: 0.055 }],
  "move-o": [{ frequency: 340, delay: 0, duration: 0.055 }],
  win: [
    { frequency: 523.25, delay: 0, duration: 0.12 },
    { frequency: 659.25, delay: 0.09, duration: 0.12 },
    { frequency: 783.99, delay: 0.18, duration: 0.22 },
  ],
  draw: [
    { frequency: 330, delay: 0, duration: 0.12 },
    { frequency: 277.18, delay: 0.12, duration: 0.18 },
  ],
  "next-round": [
    { frequency: 260, delay: 0, duration: 0.06, wave: "sine" },
    { frequency: 520, delay: 0.065, duration: 0.09, wave: "sine" },
  ],
  "reset-session": [
    { frequency: 390, delay: 0, duration: 0.08, wave: "sine" },
    { frequency: 195, delay: 0.07, duration: 0.12, wave: "sine" },
  ],
};

/** Created lazily by a user gesture; unsupported or blocked audio stays silent. */
export function createSoundPlayer() {
  let context: AudioContext | null = null;
  let generation = 0;
  let disposed = false;
  const voices = new Set<{ oscillator: OscillatorNode; gain: GainNode }>();

  function stop() {
    generation += 1;
    for (const voice of voices) {
      voice.oscillator.onended = null;
      voice.oscillator.stop();
      voice.oscillator.disconnect();
      voice.gain.disconnect();
    }
    voices.clear();
  }

  async function play(cue: SoundCue) {
    try {
      if (disposed || typeof window.AudioContext !== "function") return;
      context ??= new window.AudioContext();
      // Replace pending sounds instead of letting rapid resets build a queue.
      stop();
      const currentGeneration = generation;
      if (context.state === "suspended") await context.resume();
      if (disposed || currentGeneration !== generation || context.state !== "running") return;
      const start = context.currentTime;
      for (const note of cues[cue]) {
        const oscillator = context.createOscillator();
        const gain = context.createGain();
        oscillator.type = note.wave ?? "triangle";
        oscillator.frequency.value = note.frequency;
        const when = start + note.delay;
        gain.gain.setValueAtTime(0, when);
        gain.gain.linearRampToValueAtTime(0.045, when + 0.005);
        gain.gain.exponentialRampToValueAtTime(0.0001, when + note.duration);
        oscillator.connect(gain);
        gain.connect(context.destination);
        const voice = { oscillator, gain };
        voices.add(voice);
        oscillator.onended = () => {
          oscillator.disconnect();
          gain.disconnect();
          voices.delete(voice);
        };
        oscillator.start(when);
        oscillator.stop(when + note.duration + 0.01);
      }
    } catch {
      // Audio is optional: it must never interrupt a move or caption update.
    }
  }

  return {
    play,
    stop,
    dispose() {
      disposed = true;
      stop();
      void context?.close().catch(() => {});
      context = null;
    },
  };
}
