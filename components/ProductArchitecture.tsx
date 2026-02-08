'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function ProductArchitecture() {
  const [selected, setSelected] = useState<'organic' | 'inorganic' | null>(null)

  return (
    <section className="relative py-32" style={{ backgroundColor: '#000502' }}>
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-center gap-12 mb-16">
          <motion.button
            className="text-2xl font-light tracking-[0.2em] lowercase text-white/60 hover:text-white transition-colors"
            style={{
              fontFamily: 'var(--font-archivo)',
              fontWeight: 300,
            }}
            onClick={() => setSelected(selected === 'organic' ? null : 'organic')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            [organic]
          </motion.button>
          <motion.button
            className="text-2xl font-light tracking-[0.2em] lowercase text-white/60 hover:text-white transition-colors"
            style={{
              fontFamily: 'var(--font-archivo)',
              fontWeight: 300,
            }}
            onClick={() => setSelected(selected === 'inorganic' ? null : 'inorganic')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            [inorganic]
          </motion.button>
        </div>

        <AnimatePresence mode="wait">
          {selected === 'organic' && (
            <motion.div
              key="organic"
              initial={{ opacity: 0, filter: 'blur(20px)' }}
              animate={{ opacity: 1, filter: 'blur(0px)' }}
              exit={{ opacity: 0, filter: 'blur(20px)' }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="text-center max-w-2xl mx-auto"
            >
              <h3 className="text-3xl font-light tracking-[0.2em] mb-4 lowercase" style={{ fontFamily: 'var(--font-archivo)', fontWeight: 300 }}>
                Photonic Lock
              </h3>
              <p className="text-lg font-light text-white/70 leading-relaxed italic" style={{ fontFamily: 'var(--font-archivo)', fontWeight: 300 }}>
                flexible glass in seconds with infinite open time.
              </p>
            </motion.div>
          )}

          {selected === 'inorganic' && (
            <motion.div
              key="inorganic"
              initial={{ opacity: 0, filter: 'blur(20px)' }}
              animate={{ opacity: 1, filter: 'blur(0px)' }}
              exit={{ opacity: 0, filter: 'blur(20px)' }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="text-center max-w-2xl mx-auto"
            >
              <h3 className="text-3xl font-light tracking-[0.2em] mb-4 lowercase" style={{ fontFamily: 'var(--font-archivo)', fontWeight: 300 }}>
                Synthetic Lattice
              </h3>
              <p className="text-lg font-light text-white/70 leading-relaxed italic" style={{ fontFamily: 'var(--font-archivo)', fontWeight: 300 }}>
                molecular self-crosslinking.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}
