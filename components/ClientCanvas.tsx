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
    // Ensure React is fully loaded before rendering Canvas
    setMounted(true)
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
