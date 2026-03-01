'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

function useIsTouchDevice(): boolean {
  const [isTouch, setIsTouch] = useState(true)
  useEffect(() => {
    const check =
      'ontouchstart' in window ||
      navigator.maxTouchPoints > 0 ||
      window.matchMedia('(hover: none) and (pointer: coarse)').matches
    setIsTouch(check)
  }, [])
  return isTouch
}

export default function HybridCursor() {
  const [mousePosition, setMousePosition] = useState({ x: -100, y: -100 })
  const [isHovering, setIsHovering] = useState(false)
  const isTouch = useIsTouchDevice()

  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const isInteractive =
        target.tagName === 'BUTTON' ||
        target.tagName === 'A' ||
        target.tagName === 'H1' ||
        target.tagName === 'H2' ||
        target.tagName === 'H3' ||
        target.getAttribute('role') === 'button' ||
        target.classList?.contains('cursor-pointer') ||
        !!target.closest('button') ||
        !!target.closest('a') ||
        !!target.closest('[role="button"]') ||
        !!target.closest('.cursor-pointer') ||
        target.hasAttribute('data-thermal-hover') ||
        !!target.closest('[data-thermal-hover]')
      setIsHovering(!!isInteractive)
    }

    window.addEventListener('mousemove', updateMousePosition)
    window.addEventListener('mouseover', handleMouseOver)
    return () => {
      window.removeEventListener('mousemove', updateMousePosition)
      window.removeEventListener('mouseover', handleMouseOver)
    }
  }, [])

  if (isTouch) return null

  return (
    <motion.div
      className="fixed top-0 left-0 pointer-events-none z-[9999]"
      animate={{
        x: mousePosition.x,
        y: mousePosition.y,
      }}
      transition={{ type: 'spring', mass: 0.1, stiffness: 800, damping: 35 }}
    >
      {/* Layer 1: The Refractive Glass Lens */}
      <motion.div
        className="absolute top-0 left-0 rounded-full"
        style={{
          backdropFilter: 'blur(4px) brightness(1.1) contrast(1.2)',
          WebkitBackdropFilter: 'blur(4px) brightness(1.1) contrast(1.2)',
        }}
        initial={{ width: 16, height: 16, x: '-50%', y: '-50%' }}
        animate={{
          width: isHovering ? 64 : 16,
          height: isHovering ? 64 : 16,
          x: '-50%',
          y: '-50%',
          backgroundColor: isHovering ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0)',
        }}
        transition={{ type: 'spring', mass: 0.2, stiffness: 300, damping: 20 }}
      />

      {/* Layer 2: The Thermal Red Mist (Pulsing behind the lens) */}
      <motion.div
        className="absolute top-0 left-0 mix-blend-screen"
        initial={{ width: 32, height: 32, x: '-50%', y: '-50%', opacity: 0.5 }}
        animate={{
          width: isHovering ? 150 : 32,
          height: isHovering ? 150 : 32,
          x: '-50%',
          y: '-50%',
          opacity: isHovering ? 0.8 : 0.5,
          background: isHovering
            ? 'radial-gradient(circle, rgba(168, 0, 0, 0.5) 0%, rgba(168, 0, 0, 0) 70%)'
            : 'radial-gradient(circle, rgba(252, 251, 248, 0.4) 0%, rgba(252, 251, 248, 0) 70%)',
        }}
        transition={{ type: 'spring', mass: 0.4, stiffness: 200, damping: 25 }}
      />
    </motion.div>
  )
}
