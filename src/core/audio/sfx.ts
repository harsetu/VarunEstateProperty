// Small synthesized sound effects (no audio files). Browsers only allow sound after a tap, so call unlockAudio() from one.
let ctx: AudioContext | null = null;
let noise: AudioBuffer | null = null;

export const unlockAudio = () => {
  try {
    ctx ??= new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    if (ctx.state === 'suspended') void ctx.resume();
  } catch { /* no audio support: everything stays silent */ }
};

const ready = (): AudioContext | null => (ctx && ctx.state === 'running' ? ctx : null);

const noiseBuffer = (c: AudioContext) => {
  if (!noise) {
    noise = c.createBuffer(1, c.sampleRate * 2, c.sampleRate);
    const d = noise.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  }
  return noise;
};

const noiseSource = (c: AudioContext) => {
  const s = c.createBufferSource();
  s.buffer = noiseBuffer(c);
  s.loop = true;
  return s;
};

/** Countdown beep; the last one is higher. */
export const tick = (final = false) => {
  const c = ready();
  if (!c) return;
  const o = c.createOscillator();
  const g = c.createGain();
  const t = c.currentTime;
  o.frequency.value = final ? 1320 : 880;
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(0.25, t + 0.01);
  g.gain.exponentialRampToValueAtTime(0.0001, t + 0.28);
  o.connect(g).connect(c.destination);
  o.start(t);
  o.stop(t + 0.3);
};

/** A rocket climbing: filtered noise sweeping upwards. */
export const whoosh = (duration = 0.7) => {
  const c = ready();
  if (!c) return;
  const t = c.currentTime;
  const s = noiseSource(c);
  const f = c.createBiquadFilter();
  const g = c.createGain();
  f.type = 'bandpass';
  f.Q.value = 1.2;
  f.frequency.setValueAtTime(350, t);
  f.frequency.exponentialRampToValueAtTime(2200, t + duration);
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(0.16, t + 0.08);
  g.gain.exponentialRampToValueAtTime(0.0001, t + duration);
  s.connect(f).connect(g).connect(c.destination);
  s.start(t, Math.random());
  s.stop(t + duration + 0.05);
};

/** A burst: low thump + noise boom, then a few crackles. */
export const boom = (power = 1) => {
  const c = ready();
  if (!c) return;
  const t = c.currentTime;
  const s = noiseSource(c);
  const f = c.createBiquadFilter();
  const g = c.createGain();
  f.type = 'lowpass';
  f.frequency.setValueAtTime(1400, t);
  f.frequency.exponentialRampToValueAtTime(90, t + 0.9);
  g.gain.setValueAtTime(0.5 * power, t);
  g.gain.exponentialRampToValueAtTime(0.0001, t + 0.9);
  s.connect(f).connect(g).connect(c.destination);
  s.start(t, Math.random());
  s.stop(t + 1);

  const o = c.createOscillator();
  const og = c.createGain();
  o.frequency.setValueAtTime(130, t);
  o.frequency.exponentialRampToValueAtTime(38, t + 0.5);
  og.gain.setValueAtTime(0.45 * power, t);
  og.gain.exponentialRampToValueAtTime(0.0001, t + 0.55);
  o.connect(og).connect(c.destination);
  o.start(t);
  o.stop(t + 0.6);

  for (let i = 0; i < 7; i++) {
    const at = t + 0.12 + Math.random() * 0.7;
    const cs = noiseSource(c);
    const hp = c.createBiquadFilter();
    const cg = c.createGain();
    hp.type = 'highpass';
    hp.frequency.value = 3000;
    cg.gain.setValueAtTime(0.12 * power, at);
    cg.gain.exponentialRampToValueAtTime(0.0001, at + 0.04);
    cs.connect(hp).connect(cg).connect(c.destination);
    cs.start(at, Math.random());
    cs.stop(at + 0.05);
  }
};
