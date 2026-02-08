'use client'

import { Suspense, useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { motion } from 'framer-motion'

const Canvas = dynamic(
  () => import('@react-three/fiber').then((mod) => mod.Canvas),
  { ssr: false }
)

const RefractiveVoid = dynamic(
  () => import('./RefractiveVoid'),
  { ssr: false }
)

function FallbackBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <div 
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(circle at 50% 50%, rgba(168, 0, 0, 0.3) 0%, rgba(0, 26, 35, 0.5) 50%, #000000 100%)
          `,
          backdropFilter: 'blur(100px)',
        }}
      />
      <motion.div
        className="absolute top-1/4 left-1/4 w-96 h-96 bg-scalar-red/20 rounded-full blur-3xl"
        animate={{
          x: [0, 100, 0],
          y: [0, 50, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
    </div>
  )
}

export default function OpticalEngine({ children }: { children: React.ReactNode }) {
  const [mouse, setMouse] = useState({ x: 0.5, y: 0.5 })
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const handleMouseMove = (e: MouseEvent) => {
      const x = e.clientX / window.innerWidth
      const y = 1 - e.clientY / window.innerHeight
      setMouse({ x, y })
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {mounted ? (
        <Suspense fallback={<FallbackBackground />}>
          <Canvas
            className="absolute inset-0"
            gl={{ alpha: true, antialias: true }}
          >
            <RefractiveVoid mouse={mouse} />
          </Canvas>
        </Suspense>
      ) : (
        <FallbackBackground />
      )}
      
      <div className="relative z-10">
        {children}
      </div>
    </div>
  )
}
