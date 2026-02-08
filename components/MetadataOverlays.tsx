'use client'

import { motion } from 'framer-motion'

export default function MetadataOverlays() {
  return (
    <>
      {/* SPEC_01 // RI: 1.554 - Top-Left below logo */}
      <motion.div
        className="fixed z-[100]"
        style={{
          left: 'calc(8px + 10vh + 16px)', // Right of hallmark logo
          top: 'calc(8px + 10vh + 16px)', // Below hallmark logo
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.2 }}
        transition={{ duration: 1, delay: 1 }}
      >
        <div
          className="text-[8px] font-light tracking-[0.1em] text-white/20 uppercase"
          style={{
            fontFamily: 'var(--font-archivo)',
            fontWeight: 300,
          }}
        >
          SPEC_01 // RI: 1.554
        </div>
      </motion.div>

      {/* STATUS: OPTICAL_EQUILIBRIUM - Top right */}
      <motion.div
        className="fixed top-8 right-8 z-[100]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.2 }}
        transition={{ duration: 1, delay: 1 }}
      >
        <div
          className="text-[8px] font-light tracking-[0.1em] text-white/20 uppercase"
          style={{
            fontFamily: 'var(--font-archivo)',
            fontWeight: 300,
          }}
        >
          STATUS: OPTICAL_EQUILIBRIUM
        </div>
      </motion.div>
    </>
  )
}
