'use client'

import { useEffect, useRef } from 'react'

export default function AtmosphericAudio() {
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return

    try {
      // Create 20Hz low-frequency hum using Web Audio API
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()
      
      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)
      
      oscillator.frequency.setValueAtTime(20, audioContext.currentTime) // 20Hz
      oscillator.type = 'sine'
      
      // Very subtle volume
      gainNode.gain.setValueAtTime(0.02, audioContext.currentTime) // Very quiet
      
      oscillator.start()
      
      // Store reference for cleanup
      audioRef.current = {
        context: audioContext,
        oscillator,
        gainNode,
      } as any

      return () => {
        try {
          oscillator.stop()
          audioContext.close()
        } catch (e) {
          // Ignore cleanup errors
        }
      }
    } catch (error) {
      console.warn('Atmospheric audio failed to initialize:', error)
    }
  }, [])

  return null
}
