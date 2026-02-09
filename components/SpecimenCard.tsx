'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { Specimen } from '@/constants/specimens'
import { useSound } from '@/hooks/useSound'

function LightRipple({
  mousePos,
  color,
}: {
  mousePos: { x: number; y: number }
  color: string
}) {
  return (
    <motion.div
      className="absolute rounded-full pointer-events-none w-[120px] h-[120px]"
      style={{
        left: `${mousePos.x * 100}%`,
        top: `${mousePos.y * 100}%`,
        transform: 'translate(-50%, -50%)',
        background: `radial-gradient(circle, ${color}30 0%, ${color}00 70%)`,
      }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 3, opacity: [0.6, 0] }}
      transition={{ duration: 0.7, ease: 'easeOut' }}
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
  const { playThud } = useSound()
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
      style={{ borderRadius: '8px', transformStyle: 'preserve-3d' }}
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

      <div className="absolute bottom-3 left-3 right-3 z-10">
        <div
          className="uppercase font-mono text-[10px] tracking-[0.15em]"
          style={{ fontFamily: 'var(--font-archivo)', fontWeight: 300, color: textColor }}
        >
          {specimen.technicalCode} // RI_{specimen.index}
        </div>
        <div
          className="text-sm font-light mt-1"
          style={{ fontFamily: 'var(--font-archivo)', fontWeight: 300, color: textColor }}
        >
          {specimen.name}
        </div>
        <button
          type="button"
          data-thermal-hover
          onClick={(e) => {
            e.stopPropagation()
            playThud()
            onInitiateProcurement(specimen.name)
          }}
          className="mt-2 text-[8px] uppercase tracking-wider border border-[#FCFBF8]/20 text-[#FCFBF8]/60 hover:text-[#FCFBF8] hover:border-[#FCFBF8]/40 transition-colors px-2 py-1"
          style={{ fontFamily: 'var(--font-archivo)', fontWeight: 300 }}
        >
          Initiate Procurement
        </button>
      </div>
    </motion.div>
  )
}
