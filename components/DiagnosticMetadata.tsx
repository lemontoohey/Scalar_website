'use client'

import { motion } from 'framer-motion'

export default function DiagnosticMetadata({ visible }: { visible: boolean }) {
  return (
    <>
      {/* SPEC_01 // RI: 1.554 - Above left edge of Hero, aligned with Scalar text */}
      <motion.div
        className="fixed z-[100]"
        style={{
          left: 'calc(50% - 5vw - 200px)', // Left of shifted hero, aligned with Scalar text
          top: 'calc(50% - 3vh - 150px)', // Above hero
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.3 }}
        transition={{ duration: 1, delay: 1 }}
      >
        <div
          className="text-[8px] font-light tracking-[0.1em] text-white/30 uppercase"
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
        animate={{ opacity: 0.3 }}
        transition={{ duration: 1, delay: 1 }}
      >
        <div
          className="text-[8px] font-light tracking-[0.1em] text-white/30 uppercase"
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
