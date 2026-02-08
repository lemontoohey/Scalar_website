'use client'

function doPlayThud() {
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    const filter = ctx.createBiquadFilter()
    osc.type = 'sine'
    osc.frequency.setValueAtTime(60, ctx.currentTime)
    osc.frequency.exponentialRampToValueAtTime(20, ctx.currentTime + 0.3)
    filter.type = 'lowpass'
    filter.frequency.value = 100
    gain.gain.setValueAtTime(0.5, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3)
    osc.connect(filter)
    filter.connect(gain)
    gain.connect(ctx.destination)
    osc.start()
    osc.stop(ctx.currentTime + 0.3)
  } catch (_) {}
}

export const useSound = () => ({ playThud: doPlayThud })
export const playThud = doPlayThud
