'use client'

import { useEffect, useState, useRef } from 'react'
import { motion } from 'framer-motion'

function kelvinToRGB(kelvin: number): string {
  const temp = kelvin / 100
  let red, green, blue
  if (temp <= 66) {
    red = 255
    green = temp
    green = 99.4708025861 * Math.log(green) - 161.1195681661
    if (green < 0) green = 0
    if (green > 255) green = 255
  } else {
    red = temp - 60
    red = 329.698727446 * Math.pow(red, -0.1332047592)
    if (red < 0) red = 0
    if (red > 255) red = 255
    green = temp - 60
    green = 288.1221695283 * Math.pow(green, -0.0755148492)
    if (green < 0) green = 0
    if (green > 255) green = 255
  }
  if (temp <= 19) blue = 0
  else if (temp < 66) {
    blue = temp - 10
    blue = 138.5177312231 * Math.log(blue) - 305.0447927307
    if (blue < 0) blue = 0
    if (blue > 255) blue = 255
  } else blue = 255
  return `rgb(${Math.round(red)}, ${Math.round(green)}, ${Math.round(blue)})`
}

export default function EnsoEchoCursor() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isHovering, setIsHovering] = useState(false)
  const [kelvin, setKelvin] = useState(6500)
  const [mounted, setMounted] = useState(false)
  const [overRedMist, setOverRedMist] = useState(false)
  const soundPlayedRef = useRef(false)

  useEffect(() => {
    setMounted(true)
    
    if (typeof window === 'undefined') return

    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
      const el = document.elementFromPoint(e.clientX, e.clientY)
      setOverRedMist(!!el?.closest('[data-red-mist]'))
    }

    const handleMouseEnter = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (target && (target.tagName === 'A' || target.tagName === 'BUTTON' || target.closest('a, button, [role="button"]'))) {
        if (!isHovering) {
          setIsHovering(true)
          soundPlayedRef.current = false
          // Rapid Kelvin shift: 6500K -> 4000K -> 2000K -> Scalar Red
          const startKelvin = 6500
          const endKelvin = 2000
          
          let currentKelvin = startKelvin
          const duration = 300 // 300ms transition
          const startTime = Date.now()
          
          const animate = () => {
            const elapsed = Date.now() - startTime
            const progress = Math.min(elapsed / duration, 1)
            
            if (progress < 0.5) {
              // Transition through Kelvin scale
              currentKelvin = startKelvin + (4000 - startKelvin) * (progress / 0.5)
            } else if (progress < 0.8) {
              currentKelvin = 4000 + (2000 - 4000) * ((progress - 0.5) / 0.3)
            } else {
              // Land on Scalar Red
              currentKelvin = 2000
            }
            
            setKelvin(currentKelvin)
            
            if (progress < 1) {
              requestAnimationFrame(animate)
            }
          }
          
          animate()
        }
      }
    }

    const handleMouseLeave = () => {
      setIsHovering(false)
      setKelvin(6500) // Return to neutral
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseover', handleMouseEnter)
    document.addEventListener('mouseout', handleMouseLeave)

    // CRITICAL: Kill all system cursors
    const style = document.createElement('style')
    style.textContent = `
      * {
        cursor: none !important;
      }
      body {
        cursor: none !important;
      }
      a, button, [role="button"], [href] {
        cursor: none !important;
      }
    `
    document.head.appendChild(style)

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseover', handleMouseEnter)
      document.removeEventListener('mouseout', handleMouseLeave)
      document.head.removeChild(style)
    }
  }, [isHovering])

  const color = isHovering ? '#A80000' : kelvinToRGB(kelvin)

  if (!mounted) return null

  return (
    <motion.div
      className="fixed pointer-events-none z-[9999]"
      style={{
        left: mousePosition.x,
        top: mousePosition.y,
        transform: 'translate(-50%, -50%)',
        mixBlendMode: overRedMist ? 'difference' : 'normal',
      }}
      animate={{ scale: 1 }}
      transition={{
        type: 'spring',
        stiffness: 250,
        damping: 20,
        mass: 1.5,
      }}
    >
      {isHovering ? (
        // Enso Echo - irregular open circle
        <motion.svg
          width="18"
          height="18"
          viewBox="0 0 18 18"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{
            type: 'spring',
            stiffness: 250,
            damping: 20,
            mass: 1.5,
            duration: 0.3,
          }}
        >
          <motion.path
            d="M 9 2 Q 12 4, 13 7 Q 14 10, 12 13 Q 10 16, 7 16 Q 4 16, 3 13 Q 2 10, 4 7 Q 6 4, 9 2"
            fill="none"
            stroke={color}
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{
              filter: 'drop-shadow(0 0 2px rgba(168, 0, 0, 0.5))',
            }}
          />
        </motion.svg>
      ) : (
        // Neutral state - 2px Parchment White dot
        <motion.div
          className="rounded-full"
          style={{
            width: '2px',
            height: '2px',
            backgroundColor: color,
          }}
          animate={{
            opacity: 1,
          }}
        />
      )}
    </motion.div>
  )
}
