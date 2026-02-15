'use client'

import { motion, useInView } from 'framer-motion'
import Link from 'next/link'
import { useRef } from 'react'

const pulseVariants = {
  hidden: { opacity: 0, y: 24, filter: 'blur(8px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: {
      duration: 0.7,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
}

function PulseSection({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })
  return (
    <motion.section
      ref={ref}
      className={className}
      variants={pulseVariants}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
    >
      {children}
    </motion.section>
  )
}

export default function InnovationsPage() {
  return (
    <main
      className="min-h-screen"
      style={{ backgroundColor: '#090205', color: '#FCFBF8', fontFamily: 'var(--font-archivo)' }}
    >
      <div className="max-w-4xl mx-auto px-6 sm:px-12 py-24 md:py-32">
        <Link
          href="/"
          className="inline-block mb-16 text-[10px] font-mono tracking-widest uppercase text-[#FCFBF8]/60 hover:text-[#FF5A5F] transition-colors"
        >
          ← Back
        </Link>

        <h1
          className="text-4xl md:text-7xl font-light tracking-tight mb-4"
          style={{ color: '#FCFBF8' }}
        >
          The Technical Archive
        </h1>
        <p className="text-[#FCFBF8]/50 font-mono text-xs tracking-widest uppercase mb-24">
          Scalar Materials // Innovation Protocol
        </p>

        {/* Section 1: The Molecular Suspension */}
        <PulseSection className="mb-24 md:mb-32">
          <h2
            className="text-2xl md:text-4xl font-light tracking-tight mb-6"
            style={{ color: '#FF5A5F' }}
          >
            SUB-5 MICRON ARCHITECTURE
          </h2>
          <p className="text-lg md:text-xl font-light leading-relaxed text-[#FCFBF8]/90 max-w-2xl">
            We replaced traditional binders with a self-crosslinking molecular suspension. By
            utilizing nano-tech pigments, we&apos;ve created massive surface areas within the
            liquid, resulting in a coating with unprecedented chroma and refractive depth.
          </p>
        </PulseSection>

        {/* Section 2: The UV-Flash */}
        <PulseSection className="mb-24 md:mb-32">
          <h2
            className="text-2xl md:text-4xl font-light tracking-tight mb-6"
            style={{ color: '#FF5A5F' }}
          >
            50 LAYERS. ONE AFTERNOON.
          </h2>
          <p className="text-lg md:text-xl font-light leading-relaxed text-[#FCFBF8]/90 max-w-2xl">
            Traditional curing is a bottleneck. Scalar utilizes a UV-Flash bio-polymer system. This
            offers &quot;Infinite Open Time&quot;—allowing the technician to work the material
            indefinitely—followed by &quot;Instant Solidification&quot; via UV-light.
          </p>
        </PulseSection>

        {/* Section 3: Optical Hierarchy (3 Pillars) */}
        <PulseSection>
          <h2
            className="text-2xl md:text-4xl font-light tracking-tight mb-12"
            style={{ color: '#FF5A5F' }}
          >
            OPTICAL HIERARCHY
          </h2>
          <div className="grid md:grid-cols-3 gap-8 md:gap-12">
            <div className="border-l-2 pl-6" style={{ borderColor: '#FF5A5F' }}>
              <h3 className="text-sm font-mono tracking-widest uppercase text-[#FF5A5F] mb-3">
                CLARITY
              </h3>
              <p className="text-[#FCFBF8]/80 font-light leading-relaxed">
                Elimination of &quot;Milky&quot; haze in deep builds.
              </p>
            </div>
            <div className="border-l-2 pl-6" style={{ borderColor: '#FF5A5F' }}>
              <h3 className="text-sm font-mono tracking-widest uppercase text-[#FF5A5F] mb-3">
                CHROMA
              </h3>
              <p className="text-[#FCFBF8]/80 font-light leading-relaxed">
                High-saturation nano-pigments that don&apos;t settle.
              </p>
            </div>
            <div className="border-l-2 pl-6" style={{ borderColor: '#FF5A5F' }}>
              <h3 className="text-sm font-mono tracking-widest uppercase text-[#FF5A5F] mb-3">
                DEPTH
              </h3>
              <p className="text-[#FCFBF8]/80 font-light leading-relaxed">
                Layered stratification that mimics the physics of glass.
              </p>
            </div>
          </div>
        </PulseSection>
      </div>
    </main>
  )
}
