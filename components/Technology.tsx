'use client'

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef, useState } from 'react'
import GlassCard from './GlassCard'

const stages = [
  {
    title: 'Stage 1',
    subtitle: 'Water flash-off & Open Time',
    description: 'Precision evaporation control for optimal application window.',
  },
  {
    title: 'Stage 2',
    subtitle: '365nm UV Cross-linking',
    description: 'Instant cure through advanced photopolymerization technology.',
  },
  {
    title: 'Flex-Physics',
    subtitle: '70/30 Hard/Soft Resin blend',
    description: 'Optimized elasticity matrix for superior durability and flexibility.',
  },
  {
    title: 'Refractive Index',
    subtitle: '1.55+ (Nano-Zirconia Sol)',
    description: 'Maximum light transmission and optical clarity through nanoscale engineering.',
  },
]

export default function Technology() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  return (
    <section id="technology" className="py-32 bg-scalar-black-charcoal blueprint-grid">
      <div className="container mx-auto px-6">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl md:text-6xl font-extrabold tracking-wide uppercase mb-4">
            THE TECHNOLOGY
          </h2>
          <h3 className="text-3xl md:text-4xl font-extrabold tracking-wide text-scalar-red mb-4">
            THE MASTER SOUP (SC-01 GLASS BASE)
          </h3>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stages.map((stage, index) => (
            <motion.div
              key={stage.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <GlassCard className="h-full">
                <div className="space-y-4">
                  <div className="text-xs font-light tracking-wide text-white/40 uppercase">
                    {stage.title}
                  </div>
                  <h4 className="text-xl font-extrabold tracking-wide text-scalar-red">
                    {stage.subtitle}
                  </h4>
                  <motion.p
                    className="text-sm font-light text-white/60 leading-relaxed"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{
                      opacity: hoveredIndex === index ? 1 : 0,
                      height: hoveredIndex === index ? 'auto' : 0,
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    {stage.description}
                  </motion.p>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
