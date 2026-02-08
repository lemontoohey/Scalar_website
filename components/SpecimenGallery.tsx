'use client'

import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import dynamic from 'next/dynamic'

const ClientCanvas = dynamic(() => import('./ClientCanvas'), { ssr: false })

const TECHNICAL_STRINGS = ['RI_1.55', 'BATCH_77', 'TEMP_22K', 'PHASE_ALPHA', 'VISC_0.02']

const specimens = [
  { code: 'PBk27', color: '#000000', name: 'The Bluest Black' },
  { code: 'PR179', color: '#722F37', name: 'Bordeaux Depth' },
  { code: 'PY184', color: '#FFD700', name: 'Solar Flare' },
  { code: 'PW5', color: '#FFFFFF', name: 'The Scalar Ghost' },
  { code: 'PB15', color: '#003366', name: 'Ultramarine Core' },
  { code: 'PR254', color: '#FF0000', name: 'Scalar Red' },
]

function SpecimenCard({
  specimen,
  onDoubleClick,
}: {
  specimen: (typeof specimens)[0]
  onDoubleClick: () => void
}) {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const [flickerText, setFlickerText] = useState<string | null>(null)
  const cardRef = useRef<HTMLDivElement>(null)
  const flickerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const getBrightness = (hex: string) => {
    const r = parseInt(hex.slice(1, 3), 16)
    const g = parseInt(hex.slice(3, 5), 16)
    const b = parseInt(hex.slice(5, 7), 16)
    return (r * 299 + g * 587 + b * 114) / 1000
  }
  const brightness = getBrightness(specimen.color)
  const textColor = brightness > 128 ? '#A80000' : '#F5F5DC'

  const onHoverStart = () => {
    if (flickerRef.current) clearInterval(flickerRef.current)
    setFlickerText(TECHNICAL_STRINGS[Math.floor(Math.random() * TECHNICAL_STRINGS.length)])
    let elapsed = 0
    flickerRef.current = setInterval(() => {
      elapsed += 50
      if (elapsed >= 300) {
        if (flickerRef.current) clearInterval(flickerRef.current)
        flickerRef.current = null
        setFlickerText(null)
        return
      }
      setFlickerText(TECHNICAL_STRINGS[Math.floor(Math.random() * TECHNICAL_STRINGS.length)])
    }, 50)
  }
  const onHoverEnd = () => {
    if (flickerRef.current) {
      clearInterval(flickerRef.current)
      flickerRef.current = null
    }
    setFlickerText(null)
  }

  return (
    <motion.div
      ref={cardRef}
      className="relative aspect-square rounded-sm overflow-hidden cursor-pointer"
      style={{
        borderRadius: '8px',
        border: '1px solid rgba(255, 255, 255, 0.1)',
      }}
      onDoubleClick={onDoubleClick}
      onHoverStart={onHoverStart}
      onHoverEnd={onHoverEnd}
      onMouseMove={(e) => {
        if (cardRef.current) {
          const rect = cardRef.current.getBoundingClientRect()
          setMousePos({
            x: (e.clientX - rect.left) / rect.width,
            y: (e.clientY - rect.top) / rect.height,
          })
        }
      }}
      whileHover={{ scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      <motion.div
        className="absolute inset-0"
        style={{
          backgroundColor: specimen.color,
          transform: `translateZ(${(mousePos.x - 0.5) * 2}px) translateY(${(mousePos.y - 0.5) * 2}px)`,
        }}
        animate={{ scale: 1.05 }}
        transition={{ type: 'spring', stiffness: 200, damping: 15 }}
      />
      <div className="absolute bottom-4 left-4 right-4 z-10">
        <div
          className="font-light tracking-[0.1em] uppercase"
          style={{
            fontFamily: 'var(--font-archivo)',
            fontWeight: 300,
            color: textColor,
            fontSize: flickerText ? '6px' : '12px',
          }}
        >
          {flickerText !== null ? flickerText : specimen.code}
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
      </div>
    </motion.div>
  )
}

function MacroZoom({ specimen, onClose }: { specimen: typeof specimens[0], onClose: () => void }) {
  return (
    <motion.div
      className="fixed inset-0 z-[200] flex items-center justify-center"
      style={{ backgroundColor: '#000502' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <ClientCanvas fallback={null}>
        <MolecularLatticeShader color={specimen.color} />
      </ClientCanvas>
      
      <motion.div
        className="absolute top-8 right-8 text-white cursor-pointer"
        onClick={onClose}
        whileHover={{ scale: 1.1 }}
      >
        <div className="text-sm font-light tracking-[0.2em] lowercase" style={{ fontFamily: 'var(--font-archivo)', fontWeight: 300 }}>
          [close]
        </div>
      </motion.div>
    </motion.div>
  )
}

function MolecularLatticeShader({ color }: { color: string }) {
  // Voronoi noise shader for molecular lattice effect
  // Simplified implementation - would need full GLSL shader for production
  return (
    <mesh position={[0, 0, 0]}>
      <planeGeometry args={[10, 10, 64, 64]} />
      <meshBasicMaterial color="#A80000" />
    </mesh>
  )
}

export default function SpecimenGallery() {
  const [zoomedSpecimen, setZoomedSpecimen] = useState<typeof specimens[0] | null>(null)

  return (
    <>
      <section className="py-32" style={{ backgroundColor: '#000502' }}>
        <div className="container mx-auto px-6">
          <h2 className="text-5xl font-light tracking-[0.2em] mb-16 text-center lowercase" style={{ fontFamily: 'var(--font-archivo)', fontWeight: 300 }}>
            The Specimen Gallery
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {specimens.map((specimen) => (
              <SpecimenCard
                key={specimen.code}
                specimen={specimen}
                onDoubleClick={() => setZoomedSpecimen(specimen)}
              />
            ))}
          </div>
        </div>
      </section>

      <AnimatePresence>
        {zoomedSpecimen && (
          <MacroZoom
            specimen={zoomedSpecimen}
            onClose={() => setZoomedSpecimen(null)}
          />
        )}
      </AnimatePresence>
    </>
  )
}
