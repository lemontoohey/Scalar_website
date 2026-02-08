'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

export default function CustomCursor() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isHovering, setIsHovering] = useState(false)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    const handleMouseEnter = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (target.tagName === 'A' || target.tagName === 'BUTTON' || target.closest('a, button')) {
        setIsHovering(true)
      }
    }

    const handleMouseLeave = () => setIsHovering(false)

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseover', handleMouseEnter)
    document.addEventListener('mouseout', handleMouseLeave)

    // Hide default cursor
    document.body.style.cursor = 'none'

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseover', handleMouseEnter)
      document.removeEventListener('mouseout', handleMouseLeave)
      document.body.style.cursor = 'auto'
    }
  }, [])

  return (
    <motion.div
      className="fixed pointer-events-none z-[9999]"
      style={{
        left: mousePosition.x,
        top: mousePosition.y,
        transform: 'translate(-50%, -50%)',
      }}
      animate={{
        scale: isHovering ? 1.5 : 1,
        opacity: isHovering ? 1 : 0.6,
      }}
      transition={{
        type: 'spring',
        stiffness: 500,
        damping: 28,
      }}
    >
      {/* 1px dot crosshair */}
      <motion.div
        className="w-[1px] h-[1px] bg-white rounded-full"
        animate={{
          scale: isHovering ? [1, 1.3, 1] : 1,
        }}
        transition={{
          duration: 1.5,
          repeat: isHovering ? Infinity : 0,
          ease: 'easeInOut',
        }}
      />
      {/* Crosshair lines */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
        <div className="absolute w-[6px] h-[1px] bg-white/80 -left-[3px] -top-[0.5px]" />
        <div className="absolute h-[6px] w-[1px] bg-white/80 -top-[3px] -left-[0.5px]" />
      </div>
    </motion.div>
  )
}
