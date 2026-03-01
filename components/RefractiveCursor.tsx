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

export default function RefractiveCursor() {
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
        !!target.closest('button') ||
        !!target.closest('a') ||
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

  const size = isHovering ? 56 : 24

  return (
    <motion.div
      className="fixed top-0 left-0 pointer-events-none z-[9999] rounded-full"
      style={{
        left: mousePosition.x,
        top: mousePosition.y,
        width: size,
        height: size,
        backdropFilter: 'blur(4px) brightness(1.1) contrast(1.2)',
        WebkitBackdropFilter: 'blur(4px) brightness(1.1) contrast(1.2)',
        boxShadow: isHovering
          ? 'inset 0 0 0 1px rgba(255,255,255,0.15), inset 0 0 20px rgba(168,0,0,0.2), 0 0 30px rgba(168,0,0,0.15)'
          : 'inset 0 0 0 1px rgba(255,255,255,0.08), inset 0 0 12px rgba(252,251,248,0.1)',
        transform: `translate(-50%, -50%) scale(${isHovering ? 1.1 : 1})`,
      }}
      animate={{
        width: size,
        height: size,
      }}
      transition={{
        type: 'spring',
        mass: isHovering ? 0.5 : 0.1,
        stiffness: isHovering ? 200 : 800,
        damping: 35,
      }}
    />
  )
}
