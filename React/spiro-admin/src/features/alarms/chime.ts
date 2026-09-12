/**
 * The alarm chime, synthesised with WebAudio.
 *
 * No audio file: a two-tone chime is six lines of oscillator, and shipping a
 * binary asset for it would be the only non-code file in the project.
 *
 * Two constraints drive the design:
 *
 *   1. Browsers refuse to start an AudioContext without a user gesture. So
 *      the context is created lazily, inside the click that ARMS the sound —
 *      not on page load, where it would be created suspended and stay silent.
 *   2. A console that beeps continuously gets muted at the operating system
 *      and then nobody hears the one alarm that mattered. Hence the cooldown.
 */

let context: AudioContext | null = null;
let lastPlayed = 0;

const COOLDOWN_MS = 4000;

/** Call inside a user gesture. Returns false if WebAudio is unavailable. */
export function armAudio(): boolean {
  try {
    if (!context) {
      const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!Ctor) return false;
      context = new Ctor();
    }
    // Safari suspends a context created outside a gesture; resume inside one.
    void context.resume();
    return true;
  } catch {
    return false;
  }
}

export function disarmAudio() {
  void context?.close();
  context = null;
}

type Tone = { freq: number; at: number; duration: number };

const PATTERNS: Record<'critical' | 'serious' | 'warning', Tone[]> = {
  // Rising, urgent, three pulses.
  critical: [
    { freq: 880, at: 0, duration: 0.16 },
    { freq: 1174, at: 0.18, duration: 0.16 },
    { freq: 880, at: 0.36, duration: 0.22 },
  ],
  serious: [
    { freq: 660, at: 0, duration: 0.18 },
    { freq: 880, at: 0.2, duration: 0.22 },
  ],
  warning: [{ freq: 523, at: 0, duration: 0.22 }],
};

export function playChime(severity: 'critical' | 'serious' | 'warning') {
  if (!context) return;

  const now = Date.now();
  if (now - lastPlayed < COOLDOWN_MS) return;
  lastPlayed = now;

  const t0 = context.currentTime;

  for (const tone of PATTERNS[severity]) {
    const osc = context.createOscillator();
    const gain = context.createGain();

    osc.type = 'sine';
    osc.frequency.value = tone.freq;

    // A square-edged gain clicks audibly; ramp both ends.
    gain.gain.setValueAtTime(0, t0 + tone.at);
    gain.gain.linearRampToValueAtTime(0.18, t0 + tone.at + 0.02);
    gain.gain.linearRampToValueAtTime(0, t0 + tone.at + tone.duration);

    osc.connect(gain).connect(context.destination);
    osc.start(t0 + tone.at);
    osc.stop(t0 + tone.at + tone.duration + 0.02);
  }
}
