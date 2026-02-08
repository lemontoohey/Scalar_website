'use client'

import { motion } from 'framer-motion'
import OpticalEngine from './OpticalEngine'

export default function Hero() {
  return (
    <OpticalEngine>
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="relative z-10 container mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, filter: 'blur(20px)' }}
            animate={{ opacity: 1, filter: 'blur(0px)' }}
            transition={{ duration: 2.5, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-2"
          >
            <h1 
              className="text-7xl md:text-9xl font-light tracking-[0.2em] mix-blend-exclusion"
              style={{ 
                fontFamily: 'var(--font-archivo)',
                fontWeight: 300
              }}
            >
              Scalar
            </h1>
            <motion.p
              className="text-lg md:text-xl font-light tracking-[0.4em] lowercase mix-blend-exclusion"
              style={{ 
                fontFamily: 'var(--font-archivo)',
                fontWeight: 300
              }}
              initial={{ opacity: 0, filter: 'blur(20px)' }}
              animate={{ opacity: 1, filter: 'blur(0px)' }}
              transition={{ duration: 2.5, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            >
              ordinance of depth
            </motion.p>
          </motion.div>
        </div>
      </section>
    </OpticalEngine>
  )
}
