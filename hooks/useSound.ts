'use client'

export const useSound = () => {
  const playThud = () => {
    if (typeof window === 'undefined') return
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)()
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      const filter = ctx.createBiquadFilter()

      osc.type = 'sine'
      osc.frequency.setValueAtTime(50, ctx.currentTime)
      osc.frequency.exponentialRampToValueAtTime(15, ctx.currentTime + 0.6)

      filter.type = 'lowpass'
      filter.frequency.value = 80

      gain.gain.setValueAtTime(0.4, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6)

      osc.connect(filter)
      filter.connect(gain)
      gain.connect(ctx.destination)

      osc.start()
      osc.stop(ctx.currentTime + 0.6)
    } catch (_) {}
  }

  return { playThud }
}

function doPlayThud() {
  if (typeof window === 'undefined') return
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    const filter = ctx.createBiquadFilter()
    osc.type = 'sine'
    osc.frequency.setValueAtTime(50, ctx.currentTime)
    osc.frequency.exponentialRampToValueAtTime(15, ctx.currentTime + 0.6)
    filter.type = 'lowpass'
    filter.frequency.value = 80
    gain.gain.setValueAtTime(0.4, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6)
    osc.connect(filter)
    filter.connect(gain)
    gain.connect(ctx.destination)
    osc.start()
    osc.stop(ctx.currentTime + 0.6)
  } catch (_) {}
}

export const playThud = doPlayThud
