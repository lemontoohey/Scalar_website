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

        {/* Section 1: Soup */}
        <PulseSection className="mb-24 md:mb-32">
          <h2
            className="text-2xl md:text-4xl font-light tracking-tight mb-6"
            style={{ color: '#A80000' }}
          >
            ENGINEERING THE VOID
          </h2>
          <p className="text-lg md:text-xl font-light leading-relaxed text-[#FCFBF8]/90 max-w-2xl">
            True depth is a math problem. By milling our materials down to sub-5 microns and locking them inside a specialized polymer system, we strip away the dull fillers that weaken traditional acrylics. What&apos;s left is pure, unbroken saturation and optical depth from the very first drop.
          </p>
        </PulseSection>

        {/* Section 2: UV Flash */}
        <PulseSection className="mb-24 md:mb-32">
          <h2
            className="text-2xl md:text-4xl font-light tracking-tight mb-6"
            style={{ color: '#A80000' }}
          >
            INFINITE FLUID. INSTANT GLASS.
          </h2>
          <p className="text-lg md:text-xl font-light leading-relaxed text-[#FCFBF8]/90 max-w-2xl">
            Traditional evaporation curing is an unacceptable bottleneck. Scalar materials operate on a UV-Flash biopolymer system. This separates the act of shaping from the act of curing. It provides &quot;Infinite Open Time&quot;—remaining perfectly fluid while you work—followed by instant, indestructible crosslinking the moment it meets a 365nm UV light.
          </p>
        </PulseSection>

        {/* Section 3: Optical Hierarchy (3 Pillars) - Parallax layers */}
        <PulseSection>
          <h2
            className="text-2xl md:text-4xl font-light tracking-tight mb-12"
            style={{ color: '#A80000' }}
          >
            OPTICAL HIERARCHY
          </h2>
          <div className="grid md:grid-cols-3 gap-8 md:gap-2" style={{ perspective: '1000px' }}>
            <motion.div
              className="border-l-2 pl-6 md:-mr-4"
              style={{ borderColor: '#A80000', transformStyle: 'preserve-3d' }}
              initial={{ opacity: 0, y: 28, z: -30 }}
              whileInView={{ opacity: 1, y: 0, z: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94], delay: 0 }}
            >
              <h3 className="text-sm font-mono tracking-widest uppercase text-[#A80000] mb-3">
                CLARITY
              </h3>
              <p className="text-[#FCFBF8]/80 font-light leading-relaxed">
                Absolute transparency. The total elimination of &quot;structural mud&quot; and milky haze in multi-layer builds.
              </p>
            </motion.div>
            <motion.div
              className="border-l-2 pl-6 md:-mr-4"
              style={{ borderColor: '#A80000', transformStyle: 'preserve-3d' }}
              initial={{ opacity: 0, y: 28, z: -15 }}
              whileInView={{ opacity: 1, y: 0, z: 15 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.15 }}
            >
              <h3 className="text-sm font-mono tracking-widest uppercase text-[#A80000] mb-3">
                CHROMA
              </h3>
              <p className="text-[#FCFBF8]/80 font-light leading-relaxed">
                Uncompromised saturation. Sub-micron pigments engineered for permanent, zero-settling suspension.
              </p>
            </motion.div>
            <motion.div
              className="border-l-2 pl-6"
              style={{ borderColor: '#A80000', transformStyle: 'preserve-3d' }}
              initial={{ opacity: 0, y: 28, z: 0 }}
              whileInView={{ opacity: 1, y: 0, z: 30 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.3 }}
            >
              <h3 className="text-sm font-mono tracking-widest uppercase text-[#A80000] mb-3">
                DEPTH
              </h3>
              <p className="text-[#FCFBF8]/80 font-light leading-relaxed">
                Infinite refraction. A microscopic architecture designed not just to mimic the look of glass, but its physical behavior.
              </p>
            </motion.div>
          </div>
        </PulseSection>
      </div>
    </main>
  )
}
