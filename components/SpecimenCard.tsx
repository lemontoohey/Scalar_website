'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { Specimen } from '@/constants/specimens'
import { playThud } from '@/hooks/useSound'

const SCRAMBLE_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_//'
const SCRAMBLE_DURATION_MS = 400
const SCRAMBLE_INTERVAL_MS = 30

function ScrambleText({ text, trigger }: { text: string; trigger: boolean }) {
  const [displayText, setDisplayText] = useState(text)

  useEffect(() => {
    if (!trigger) {
      setDisplayText(text)
      return
    }
    let iterations = 0
    const totalFrames = Math.ceil(SCRAMBLE_DURATION_MS / SCRAMBLE_INTERVAL_MS)
    const increment = Math.max(1, text.length / totalFrames)

    const interval = setInterval(() => {
      setDisplayText(
        text
          .split('')
          .map((char, index) => {
            if (index < iterations) return char
            return SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)]
          })
          .join('')
      )
      iterations += increment
      if (iterations >= text.length) {
        clearInterval(interval)
        setDisplayText(text)
      }
    }, SCRAMBLE_INTERVAL_MS)
    return () => clearInterval(interval)
  }, [text, trigger])

  return <>{displayText}</>
}

function LightRipple({
  mousePos,
  color,
}: {
  mousePos: { x: number; y: number }
  color: string
}) {
  return (
    <motion.div
      className="absolute rounded-full pointer-events-none"
      style={{
        width: '200px',
        height: '200px',
        left: `${mousePos.x * 100}%`,
        top: `${mousePos.y * 100}%`,
        transform: 'translate(-50%, -50%)',
        background: `radial-gradient(circle, ${color}40 0%, ${color}00 60%)`,
      }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 2.5, opacity: [0.7, 0] }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
    />
  )
}

export default function SpecimenCard({
  specimen,
  onInitiateProcurement,
  onViewSpecimen,
}: {
  specimen: Specimen
  onInitiateProcurement: (name: string) => void
  onViewSpecimen: (specimen: Specimen) => void
}) {
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 })
  const [isHovering, setIsHovering] = useState(false)

  const brightness =
    (parseInt(specimen.color.slice(1, 3), 16) * 299 +
      parseInt(specimen.color.slice(3, 5), 16) * 587 +
      parseInt(specimen.color.slice(5, 7), 16) * 114) /
    1000
  const textColor = brightness > 128 ? '#A80000' : '#FCFBF8'

  return (
    <motion.div
      role="button"
      tabIndex={0}
      data-thermal-hover
      onClick={() => onViewSpecimen(specimen)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onViewSpecimen(specimen)
        }
      }}
      className="relative aspect-square rounded-lg overflow-hidden cursor-pointer border border-[#FCFBF8]/10"
      style={{
        borderRadius: '8px',
        transformStyle: 'preserve-3d',
        boxShadow:
          'inset 0 0 0 1px rgba(255,255,255,0.04), inset 0 1px 0 0 rgba(255,255,255,0.04)',
      }}
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect()
        setMousePos({
          x: (e.clientX - rect.left) / rect.width,
          y: (e.clientY - rect.top) / rect.height,
        })
      }}
      onHoverStart={() => setIsHovering(true)}
      onHoverEnd={() => setIsHovering(false)}
      whileHover={{
        scale: 1.05,
        z: 20,
        boxShadow: `0px 20px 50px -10px ${specimen.color}80, 0px 0px 20px 0px ${specimen.color}40, inset 0 0 0 1px rgba(255,255,255,0.12), inset 0 1px 0 0 rgba(255,255,255,0.15)`,
      }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      <div
        className="absolute inset-0"
        style={{
          backgroundColor: specimen.color,
          transform: `translate(${(mousePos.x - 0.5) * -15}%, ${(mousePos.y - 0.5) * -15}%) scale(1.15)`,
          transition: 'transform 0.1s ease-out',
        }}
      />

      <AnimatePresence>
        {isHovering && <LightRipple mousePos={mousePos} color={specimen.color} />}
      </AnimatePresence>

      <motion.div
        className="absolute bottom-3 left-3 right-3 z-10"
        style={{
          transform: `translate(${(mousePos.x - 0.5) * 15}px, ${(mousePos.y - 0.5) * 15}px)`,
          transition: 'transform 0.1s ease-out',
        }}
      >
        <div
          className="uppercase font-mono text-[10px] tracking-[0.15em]"
          style={{ fontFamily: 'var(--font-archivo)', fontWeight: 300, color: textColor }}
        >
          <ScrambleText
            text={`${specimen.technicalCode} // RI_${specimen.index}`}
            trigger={isHovering}
          />
        </div>
        <div
          className="text-sm font-light mt-1"
          style={{ fontFamily: 'var(--font-archivo)', fontWeight: 300, color: textColor }}
        >
          <ScrambleText text={specimen.name} trigger={isHovering} />
        </div>
        <button
          type="button"
          data-thermal-hover
          onClick={(e) => {
            e.stopPropagation()
            playThud()
            onInitiateProcurement(specimen.name)
          }}
          className="mt-2 min-h-[44px] min-w-[44px] flex items-center justify-center text-[8px] uppercase tracking-wider border border-[#FCFBF8]/20 text-[#FCFBF8]/60 hover:text-[#FCFBF8] hover:border-[#FCFBF8]/40 transition-colors px-2 py-1"
          style={{ fontFamily: 'var(--font-archivo)', fontWeight: 300 }}
        >
          Initiate Procurement
        </button>
      </motion.div>
    </motion.div>
  )
}
