'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

export default function ThermalCursor() {
  const [mousePosition, setMousePosition] = useState({ x: -100, y: -100 })
  const [isHovering, setIsHovering] = useState(false)

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

  const variants = {
    default: {
      height: 8,
      width: 8,
      x: mousePosition.x - 4,
      y: mousePosition.y - 4,
      background:
        'radial-gradient(circle, rgba(252, 251, 248, 0.8) 0%, rgba(252, 251, 248, 0) 70%)',
      filter: 'blur(1px)',
      borderRadius: '50%',
      mixBlendMode: 'difference' as const,
      transition: {
        type: 'spring',
        mass: 0.1,
        stiffness: 800,
        damping: 35,
        background: { duration: 0.5 },
        filter: { duration: 0.5 },
        borderRadius: { duration: 0.5 },
      },
    },
    hover: {
      height: 64,
      width: 64,
      x: mousePosition.x - 32,
      y: mousePosition.y - 32,
      background:
        'radial-gradient(circle, rgba(168, 0, 0, 0.6) 0%, rgba(168, 0, 0, 0) 70%)',
      filter: 'blur(12px)',
      borderRadius: [
        '50% 50%',
        '30% 70% 40% 60%',
        '60% 40% 70% 30%',
        '50% 50%',
      ],
      mixBlendMode: 'screen' as const,
      transition: {
        type: 'spring',
        mass: 0.6,
        stiffness: 200,
        damping: 20,
        borderRadius: {
          duration: 4,
          repeat: Infinity,
          ease: 'easeInOut',
        },
        background: { duration: 0.5 },
        filter: { duration: 0.5 },
      },
    },
  }

  return (
    <motion.div
      className="fixed top-0 left-0 pointer-events-none z-[9999]"
      variants={variants}
      animate={isHovering ? 'hover' : 'default'}
    />
  )
}
