'use client'

import { Suspense, useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { motion } from 'framer-motion'
import ErrorBoundary from './ErrorBoundary'

const Canvas = dynamic(
  async () => {
    const mod = await import('@react-three/fiber')
    return { default: mod.Canvas }
  },
  { 
    ssr: false,
    loading: () => null
  }
)

const FluidCureShader = dynamic(
  async () => {
    const mod = await import('./FluidCureShader')
    return { default: mod.default }
  },
  { 
    ssr: false,
    loading: () => null
  }
)

function FallbackBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden" style={{ backgroundColor: '#000502' }}>
      <div 
        className="absolute inset-0 flex items-center justify-center"
        style={{
          background: `
            radial-gradient(circle at 50% 50%, rgba(168, 0, 0, 0.2) 0%, rgba(0, 0, 0, 1) 70%)
          `,
        }}
      />
    </div>
  )
}

export default function OpticalEngine({ 
  children,
  onCureComplete 
}: { 
  children: React.ReactNode
  onCureComplete?: () => void
}) {
  const [mouse, setMouse] = useState({ x: 0.5, y: 0.5 })
  const [mounted, setMounted] = useState(false)
  const [useShader, setUseShader] = useState(false)

  useEffect(() => {
    setMounted(true)
    
    // Check WebGL support before attempting to use shader
    try {
      const canvas = document.createElement('canvas')
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
      if (gl) {
        setUseShader(true)
      }
    } catch (e) {
      console.warn('WebGL check failed, using fallback:', e)
    }

    const handleMouseMove = (e: MouseEvent) => {
      const x = e.clientX / window.innerWidth
      const y = 1 - e.clientY / window.innerHeight
      setMouse({ x, y })
    }

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0]
        const x = touch.clientX / window.innerWidth
        const y = 1 - touch.clientY / window.innerHeight
        setMouse({ x, y })
      }
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('touchmove', handleTouchMove)
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('touchmove', handleTouchMove)
    }
  }, [])

  // Only render Canvas on client side after mount
  if (typeof window === 'undefined') {
    return (
      <div className="relative w-full h-screen overflow-hidden" style={{ backgroundColor: '#000502' }}>
        <FallbackBackground />
        <div className="relative" style={{ zIndex: 50, pointerEvents: 'none' }}>
          <div style={{ pointerEvents: 'auto' }}>
            {children}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="relative w-full h-screen overflow-hidden" style={{ backgroundColor: '#000502' }}>
      {mounted && useShader ? (
        <ErrorBoundary fallback={<FallbackBackground />}>
          <Suspense fallback={<FallbackBackground />}>
            <Canvas
              className="absolute inset-0"
              style={{ zIndex: 1 }}
              gl={{ 
                alpha: true, 
                antialias: true,
                powerPreference: 'high-performance',
                failIfMajorPerformanceCaveat: false
              }}
              onError={(error) => {
                console.error('Canvas error:', error)
                setUseShader(false)
              }}
            >
              <ErrorBoundary fallback={null}>
                <FluidCureShader logoPath="/logo.png" mouse={mouse} onCureComplete={onCureComplete} />
              </ErrorBoundary>
            </Canvas>
          </Suspense>
        </ErrorBoundary>
      ) : (
        <FallbackBackground />
      )}
      
      <div className="relative" style={{ zIndex: 50, pointerEvents: 'none' }}>
        <div style={{ pointerEvents: 'auto' }}>
          {children}
        </div>
      </div>
    </div>
  )
}
