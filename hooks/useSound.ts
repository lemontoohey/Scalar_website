/**
 * Heavy cinematic sub-bass impact.
 * Note: Browser autoplay policy blocks AudioContext until user interaction.
 * If thud is silent on first load, add a "Click to Enter" overlay that triggers
 * a no-op user gesture (e.g. playThud or ctx.resume()) before hero sequence.
 */
function doPlayThud() {
  if (typeof window === 'undefined') return
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext
    const ctx = new AudioCtx()
    if (ctx.state === 'suspended') ctx.resume() // Unblock after user gesture

    // Dual oscillators: sub (35Hz) + body (55Hz) for weight
    const sub = ctx.createOscillator()
    const body = ctx.createOscillator()
    const gain = ctx.createGain()
    const filter = ctx.createBiquadFilter()

    sub.type = 'sine'
    sub.frequency.setValueAtTime(35, ctx.currentTime)
    sub.frequency.exponentialRampToValueAtTime(12, ctx.currentTime + 0.5)
    body.type = 'sine'
    body.frequency.setValueAtTime(55, ctx.currentTime)
    body.frequency.exponentialRampToValueAtTime(18, ctx.currentTime + 0.5)

    filter.type = 'lowpass'
    filter.frequency.value = 60
    filter.Q.value = 2

    gain.gain.setValueAtTime(0.55, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5)

    sub.connect(filter)
    body.connect(filter)
    filter.connect(gain)
    gain.connect(ctx.destination)

    sub.start()
    body.start()
    sub.stop(ctx.currentTime + 0.5)
    body.stop(ctx.currentTime + 0.5)
  } catch (_) {}
}

export const playThud = doPlayThud

function doPlayLensClick() {
  if (typeof window === 'undefined') return
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    const filter = ctx.createBiquadFilter()
    osc.type = 'sine'
    osc.frequency.setValueAtTime(3200, ctx.currentTime)
    osc.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.04)
    filter.type = 'highpass'
    filter.frequency.value = 2000
    gain.gain.setValueAtTime(0.12, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04)
    osc.connect(filter)
    filter.connect(gain)
    gain.connect(ctx.destination)
    osc.start()
    osc.stop(ctx.currentTime + 0.04)
  } catch (_) {}
}

export const playLensClick = doPlayLensClick

export function useSound() {
  return { playThud, playLensClick }
}
