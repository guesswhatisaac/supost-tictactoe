import type { GameAction, GameState } from "./game.ts";
import type { SceneObject } from "./narrator.ts";

type SoundCue = "move-x" | "move-o" | "win" | "draw" | "next-round" | "reset-session" | SceneObject;

export function getSoundCue(previous: GameState, next: GameState, action: GameAction): SoundCue | null {
  if (previous === next) return null;
  if (action.type !== "play") return action.type;
  if (next.result.type === "win") return "win";
  if (next.result.type === "draw") return "draw";
  return previous.turn === "X" ? "move-x" : "move-o";
}

type Note = { frequency: number; endFrequency?: number; delay: number; duration: number; wave?: OscillatorType };

const volumeMultiplier = 1.5;
const hoverFrequencies = [220, 246.94, 261.63, 293.66, 329.63, 349.23, 392, 440, 493.88, 370, 311.13, 277.18];

const cues: Record<SoundCue, readonly Note[]> = {
  keyboard: [
    { frequency: 1100, delay: 0, duration: 0.035 },
    { frequency: 780, delay: 0.025, duration: 0.04 },
  ],
  mug: [
    { frequency: 880, endFrequency: 830, delay: 0, duration: 0.19, wave: "sine" },
    { frequency: 1320, delay: 0.005, duration: 0.08, wave: "sine" },
  ],
  lamp: [{ frequency: 180, delay: 0, duration: 0.07 }],
  wall: [{ frequency: 220, delay: 0, duration: 0.09 }],
  desk: [{ frequency: 150, delay: 0, duration: 0.12 }],
  "move-x": [
    { frequency: 660, delay: 0, duration: 0.10 },
    { frequency: 880, delay: 0.075, duration: 0.12 },
  ],
  "move-o": [{ frequency: 440, endFrequency: 330, delay: 0, duration: 0.20, wave: "sine" }],
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
    { frequency: 392, delay: 0, duration: 0.12 },
    { frequency: 587.33, delay: 0.11, duration: 0.18 },
  ],
  "reset-session": [
    { frequency: 523.25, delay: 0, duration: 0.12 },
    { frequency: 261.63, delay: 0.11, duration: 0.20 },
  ],
};

/** Created lazily by a user gesture; unsupported or blocked audio stays silent. */
export function createSoundPlayer() {
  let context: AudioContext | null = null;
  let generation = 0;
  let disposed = false;
  let lastHover = -Infinity;
  let hoverBlockedUntil = 0;
  const voices = new Set<{ oscillator: OscillatorNode; gain: GainNode }>();

  function schedule(note: Note, start: number, volume: number) {
    if (!context) return;
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.type = note.wave ?? "triangle";
    oscillator.frequency.value = note.frequency;
    const when = start + note.delay;
    if (note.endFrequency) {
      oscillator.frequency.setValueAtTime(note.frequency, when);
      oscillator.frequency.exponentialRampToValueAtTime(note.endFrequency, when + note.duration);
    }
    gain.gain.setValueAtTime(0, when);
    gain.gain.linearRampToValueAtTime(volume * volumeMultiplier, when + 0.005);
    gain.gain.setValueAtTime(volume * volumeMultiplier, when + note.duration * 0.45);
    gain.gain.exponentialRampToValueAtTime(0.0001 * volumeMultiplier, when + note.duration);
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
      // Give the audio renderer a small lead-in so short cues do not start late.
      const start = context.currentTime + 0.02;
      hoverBlockedUntil = start + Math.max(...cues[cue].map(note => note.delay + note.duration));
      for (const note of cues[cue]) schedule(note, start, 0.045);
    } catch {
      // Audio is optional: it must never interrupt a move or caption update.
    }
  }

  return {
    play,
    hover(target: number) {
      // Hover never unlocks or resumes audio, interrupts a result, or queues ticks.
      if (disposed || !context || context.state !== "running") return;
      const now = context.currentTime;
      if (now < hoverBlockedUntil || now - lastHover < 0.065) return;
      lastHover = now;
      try {
        schedule({ frequency: hoverFrequencies[target] ?? 330, delay: 0, duration: 0.035, wave: "sine" }, now, 0.012);
      } catch {
        // Pointer and keyboard navigation remain usable without audio.
      }
    },
    stop,
    dispose() {
      disposed = true;
      stop();
      void context?.close().catch(() => {});
      context = null;
    },
  };
}
