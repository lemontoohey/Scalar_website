'use client'

let globalAudioCtx: AudioContext | null = null

export function initAudio() {
  if (typeof window === 'undefined') return
  if (!globalAudioCtx) {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext
    globalAudioCtx = new AudioCtx()
  }
  if (globalAudioCtx.state === 'suspended') {
    globalAudioCtx.resume()
  }
}

export function playThud() {
  if (!globalAudioCtx) return
  try {
    const sub = globalAudioCtx.createOscillator()
    const body = globalAudioCtx.createOscillator()
    const gain = globalAudioCtx.createGain()
    const filter = globalAudioCtx.createBiquadFilter()

    sub.type = 'sine'
    sub.frequency.setValueAtTime(35, globalAudioCtx.currentTime)
    sub.frequency.exponentialRampToValueAtTime(12, globalAudioCtx.currentTime + 0.5)

    body.type = 'sine'
    body.frequency.setValueAtTime(55, globalAudioCtx.currentTime)
    body.frequency.exponentialRampToValueAtTime(18, globalAudioCtx.currentTime + 0.5)

    filter.type = 'lowpass'
    filter.frequency.value = 60
    filter.Q.value = 2

    gain.gain.setValueAtTime(0.55, globalAudioCtx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, globalAudioCtx.currentTime + 0.5)

    sub.connect(filter)
    body.connect(filter)
    filter.connect(gain)
    gain.connect(globalAudioCtx.destination)

    sub.start()
    body.start()
    sub.stop(globalAudioCtx.currentTime + 0.5)
    body.stop(globalAudioCtx.currentTime + 0.5)
  } catch (_) {}
}

export function playLensClick() {
  if (!globalAudioCtx) return
  try {
    const osc = globalAudioCtx.createOscillator()
    const gain = globalAudioCtx.createGain()
    const filter = globalAudioCtx.createBiquadFilter()

    osc.type = 'sine'
    osc.frequency.setValueAtTime(3200, globalAudioCtx.currentTime)
    osc.frequency.exponentialRampToValueAtTime(800, globalAudioCtx.currentTime + 0.04)

    filter.type = 'highpass'
    filter.frequency.value = 2000

    gain.gain.setValueAtTime(0.12, globalAudioCtx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, globalAudioCtx.currentTime + 0.04)

    osc.connect(filter)
    filter.connect(gain)
    gain.connect(globalAudioCtx.destination)

    osc.start()
    osc.stop(globalAudioCtx.currentTime + 0.04)
  } catch (_) {}
}

export function useSound() {
  return { playThud, playLensClick, initAudio }
}
