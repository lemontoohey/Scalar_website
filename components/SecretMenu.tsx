'use client'

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import { cn } from '@/lib/utils'

const pigments = [
  {
    code: 'PBk27',
    name: 'The Bluest Black',
    description: 'Zero brown-drift.',
  },
  {
    code: 'PR179',
    name: 'Bordeaux Depth',
    description: 'The soul of the red square.',
  },
  {
    code: 'PY184',
    name: 'Solar Flare',
    description: 'Inorganic Mirror.',
  },
  {
    code: 'PW5',
    name: 'The Scalar Ghost',
    description: 'Mist without chalk.',
  },
]

export default function SecretMenu() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section className="py-32 bg-black">
      <div className="container mx-auto px-6">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl md:text-6xl font-black tracking-tight uppercase mb-4">
            THE SECRET MENU
          </h2>
          <p className="text-lg font-normal text-white/60 leading-relaxed">
            High-Tech Filters
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {pigments.map((pigment, index) => (
            <motion.div
              key={pigment.code}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <motion.div
                className={cn('glass-card p-6 h-full text-center transition-all duration-300 hover:bg-scalar-black-charcoal/60 hover:border-white/20')}
                whileHover={{ scale: 1.02, y: -4 }}
                transition={{ duration: 0.2 }}
              >
                <div className="space-y-4">
                  <div className="text-xs font-narrow tracking-wider text-white/40 uppercase mb-2">
                    {pigment.code}
                  </div>
                  <h3 className="text-xl font-semibold tracking-normal text-scalar-red mb-2">
                    {pigment.name}
                  </h3>
                  <p className="text-sm font-normal text-white/60 italic leading-relaxed">
                    {pigment.description}
                  </p>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
