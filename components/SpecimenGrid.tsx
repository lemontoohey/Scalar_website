'use client'

import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { SPECIMENS, type Specimen } from '@/constants/specimens'

const TECHNICAL_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_.'

function SpecimenCard({
  specimen,
  onInitiateProcurement,
  onViewSpecimen,
}: {
  specimen: Specimen
  onInitiateProcurement: (name: string) => void
  onViewSpecimen: (specimen: Specimen) => void
}) {
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 })
  const [flicker, setFlicker] = useState<string | null>(null)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const brightness =
    (parseInt(specimen.color.slice(1, 3), 16) * 299 +
      parseInt(specimen.color.slice(3, 5), 16) * 587 +
      parseInt(specimen.color.slice(5, 7), 16) * 114) /
    1000
  const textColor = brightness > 128 ? '#A80000' : '#F5F5DC'

  const onHover = () => {
    if (intervalRef.current) return
    let elapsed = 0
    const shuffle = () =>
      Array.from({ length: specimen.technicalCode.length + 4 }, () =>
        TECHNICAL_CHARS[Math.floor(Math.random() * TECHNICAL_CHARS.length)]
      ).join('')
    setFlicker(shuffle())
    intervalRef.current = setInterval(() => {
      elapsed += 40
      if (elapsed >= 300) {
        if (intervalRef.current) clearInterval(intervalRef.current)
        intervalRef.current = null
        setFlicker(null)
        return
      }
      setFlicker(shuffle())
    }, 40)
  }
  const onLeave = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    setFlicker(null)
  }

  return (
    <motion.div
      role="button"
      tabIndex={0}
      onClick={() => onViewSpecimen(specimen)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onViewSpecimen(specimen)
        }
      }}
      className="relative aspect-square rounded-lg overflow-hidden cursor-pointer"
      style={{
        borderRadius: '8px',
        border: '1px solid rgba(245, 245, 220, 0.1)',
      }}
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect()
        setMousePos({
          x: (e.clientX - rect.left) / rect.width,
          y: (e.clientY - rect.top) / rect.height,
        })
      }}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      whileHover={{ scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      {/* Depth: color layer moves -10% opposite to mouse (trapped behind glass) */}
      <div
        className="absolute inset-0"
        style={{
          backgroundColor: specimen.color,
          transform: `translate(${(mousePos.x - 0.5) * -20}%, ${(mousePos.y - 0.5) * -20}%) scale(1.2)`,
          transition: 'transform 0.15s ease-out',
        }}
      />
      <div className="absolute bottom-3 left-3 right-3 z-10">
        <div
          className="uppercase font-mono"
          style={{
            fontFamily: 'var(--font-archivo)',
            fontWeight: 300,
            color: textColor,
            fontSize: '10px',
            letterSpacing: '0.15em',
          }}
        >
          {flicker !== null ? flicker : `${specimen.technicalCode} // RI_${specimen.index}`}
        </div>
        <div
          className="text-sm font-light mt-1"
          style={{
            fontFamily: 'var(--font-archivo)',
            fontWeight: 300,
            color: textColor,
          }}
        >
          {specimen.name}
        </div>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
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

type SpecimenGridProps = {
  category: 'organic' | 'inorganic'
  onInitiateProcurement: (specimenName: string) => void
  onViewSpecimen: (specimen: Specimen) => void
}

export default function SpecimenGrid({
  category,
  onInitiateProcurement,
  onViewSpecimen,
}: SpecimenGridProps) {
  const filtered = SPECIMENS.filter((s) => s.category === category)

  return (
    <section
      className="fixed inset-0 overflow-auto z-10 pt-24 pb-32"
      style={{ backgroundColor: '#000502' }}
    >
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
          {filtered.map((specimen) => (
            <SpecimenCard
              key={specimen.id}
              specimen={specimen}
              onInitiateProcurement={onInitiateProcurement}
              onViewSpecimen={onViewSpecimen}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
