'use client'

import { Suspense, useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import ErrorBoundary from './ErrorBoundary'

// Only import Canvas after React is fully loaded
const Canvas = dynamic(
  () => import('@react-three/fiber').then((mod) => mod.Canvas),
  { 
    ssr: false,
    loading: () => null
  }
)

export default function ClientCanvas({ 
  children,
  fallback 
}: { 
  children: React.ReactNode
  fallback?: React.ReactNode
}) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    // Wait for React to be fully initialized
    // Use multiple animation frames to ensure React internals are available
    if (typeof window === 'undefined') {
      setMounted(true)
      return
    }
    
    // Wait for React to initialize its internals
    // Multiple RAF calls ensure we're past React's initialization phase
    let rafId1: number
    let rafId2: number
    
    rafId1 = requestAnimationFrame(() => {
      rafId2 = requestAnimationFrame(() => {
        // One more frame to be absolutely sure
        requestAnimationFrame(() => {
          setMounted(true)
        })
      })
    })

    return () => {
      if (rafId1) cancelAnimationFrame(rafId1)
      if (rafId2) cancelAnimationFrame(rafId2)
    }
  }, [])

  if (!mounted) {
    return <>{fallback}</>
  }

  return (
    <ErrorBoundary fallback={fallback}>
      <Suspense fallback={fallback}>
        <Canvas
          className="absolute inset-0"
          style={{ zIndex: 1 }}
          gl={{ 
            alpha: true, 
            antialias: true,
            powerPreference: 'high-performance',
            failIfMajorPerformanceCaveat: false
          }}
        >
          {children}
        </Canvas>
      </Suspense>
    </ErrorBoundary>
  )
}
