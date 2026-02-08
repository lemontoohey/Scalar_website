'use client'

import { useState, Suspense, useLayoutEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import ErrorBoundary from './ErrorBoundary'

function ClientCanvas({
  children,
  fallback,
}: {
  children: React.ReactNode
  fallback?: React.ReactNode
}) {
  const [shouldRender, setShouldRender] = useState(false)

  // useLayoutEffect ensures we are truly on the client before the first paint hits the WebGL context
  useLayoutEffect(() => {
    setShouldRender(true)
  }, [])

  if (!shouldRender) {
    return <div className="fixed inset-0 bg-[#000502]" />
  }

  return (
    <ErrorBoundary fallback={fallback ?? <div className="fixed inset-0 bg-[#000502]" />}>
      <div className="fixed inset-0 pointer-events-none z-0" data-red-mist>
        <Suspense fallback={fallback ?? null}>
          <Canvas
            flat
            dpr={[1, 2]}
            gl={{ antialias: true, alpha: true, stencil: false, depth: true }}
            camera={{ position: [0, 0, 5], fov: 45 }}
          >
            {children}
          </Canvas>
        </Suspense>
      </div>
    </ErrorBoundary>
  )
}

export default ClientCanvas
