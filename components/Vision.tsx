'use client'

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'

export default function Vision() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  const specs = [
    { label: 'Sub-5 Micron Dispersion', value: '≤5μm' },
    { label: 'Liquid Glass Optics', value: '50-Layer Glazing' },
    { label: 'Sovereign Innovation', value: '100% Australian' },
  ]

  return (
    <section id="vision" className="py-32 bg-scalar-black-dark">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          {/* Text Side */}
          <motion.div
            ref={ref}
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-5xl md:text-6xl font-heading font-bold mb-8">
              The Vision
            </h2>
            <p className="text-xl font-body tracking-tight text-white/70 mb-8 leading-relaxed">
              Moving away from romanticized craft toward a clinical, physics-based identity.
            </p>
            
            {/* Spec Sheet Style */}
            <div className="space-y-4 mt-12">
              {specs.map((spec, index) => (
                <motion.div
                  key={spec.label}
                  className="border-b border-white/10 pb-4"
                  initial={{ opacity: 0, x: -20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                >
                  <div className="flex justify-between items-baseline">
                    <span className="text-sm font-body tracking-wider text-white/60 uppercase">
                      {spec.label}
                    </span>
                    <span className="text-2xl font-heading font-bold text-scalar-red">
                      {spec.value}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Image Side - Placeholder for macro photography */}
          <motion.div
            className="relative h-[600px] glass-card overflow-hidden"
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-scalar-red/20 via-transparent to-scalar-red/10 flex items-center justify-center">
              <p className="text-white/30 font-body text-sm tracking-wider uppercase">
                Macro Photography<br />Pigment Detail
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
