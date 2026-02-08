'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import OpticalEngine from './OpticalEngine'
import BottomNav from './BottomNav'

export default function Hero() {
  const [cureComplete, setCureComplete] = useState(false)

  return (
    <OpticalEngine onCureComplete={() => setCureComplete(true)}>
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="relative z-10 container mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: cureComplete ? 1 : 0 }}
            transition={{ duration: 1, delay: 2, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-4"
          >
            <h1 
              className="text-7xl md:text-9xl font-light tracking-[0.4em] mix-blend-screen"
              style={{ 
                fontFamily: 'var(--font-archivo)',
                fontWeight: 300,
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
              }}
            >
              Scalar
            </h1>
            <motion.p
              className="text-lg md:text-xl font-light tracking-[0.6em] lowercase mix-blend-screen"
              style={{ 
                fontFamily: 'var(--font-archivo)',
                fontWeight: 300,
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: cureComplete ? 1 : 0 }}
              transition={{ duration: 1, delay: 2.2, ease: [0.16, 1, 0.3, 1] }}
            >
              ordinance of depth
            </motion.p>
          </motion.div>
        </div>
      </section>
      <BottomNav visible={cureComplete} />
    </OpticalEngine>
  )
}
