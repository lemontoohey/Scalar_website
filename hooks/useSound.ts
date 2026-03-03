'use client'

let audioCtx: AudioContext | null = null;

function getContext() {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  return audioCtx;
}

export function playThud() {
  const ctx = getContext();
  if (!ctx) return;
  if (ctx.state === 'suspended') ctx.resume();

  try {
    const sub = ctx.createOscillator();
    const subGain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    sub.type = 'sine';
    sub.frequency.setValueAtTime(45, ctx.currentTime);
    sub.frequency.exponentialRampToValueAtTime(10, ctx.currentTime + 0.8);

    filter.type = 'lowpass';
    filter.frequency.value = 60;

    subGain.gain.setValueAtTime(0.7, ctx.currentTime);
    subGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8);

    sub.connect(filter);
    filter.connect(subGain);
    subGain.connect(ctx.destination);

    sub.start();
    sub.stop(ctx.currentTime + 0.8);
  } catch (e) {
    console.error("Audio blocked:", e);
  }
}

export function playLensClick() {
  const ctx = getContext();
  if (!ctx) return;
  if (ctx.state === 'suspended') ctx.resume();

  try {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(3200, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.05);
    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.05);
  } catch (_) {}
}