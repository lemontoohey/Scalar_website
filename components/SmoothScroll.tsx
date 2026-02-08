'use client'

import { useEffect } from 'react'

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Only initialize Lenis on client side
    if (typeof window === 'undefined') return

    let lenis: any = null
    let rafId: number | null = null

    try {
      // Dynamic import to avoid SSR issues
      import('lenis').then((LenisModule) => {
        const Lenis = LenisModule.default
        lenis = new Lenis({
          duration: 1.2,
          easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        })

        function raf(time: number) {
          if (lenis) {
            lenis.raf(time)
            rafId = requestAnimationFrame(raf)
          }
        }

        rafId = requestAnimationFrame(raf)
      }).catch((error) => {
        console.warn('Failed to load Lenis, smooth scroll disabled:', error)
      })
    } catch (error) {
      console.warn('Smooth scroll initialization error:', error)
    }

    return () => {
      if (rafId !== null) {
        cancelAnimationFrame(rafId)
      }
      if (lenis) {
        try {
          lenis.destroy()
        } catch (e) {
          // Ignore destroy errors
        }
      }
    }
  }, [])

  return <>{children}</>
}
