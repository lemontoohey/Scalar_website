'use client'

import { motion } from 'framer-motion'

export default function DiagnosticMetadata({ visible }: { visible: boolean }) {
  return (
    <>
      {/* SPEC_01 // RI: 1.554 - Above left edge of Hero */}
      <motion.div
        className="fixed z-50"
        style={{
          left: 'calc(50% - 5% - 200px)', // Left of shifted hero
          top: 'calc(50% - 3% - 150px)', // Above hero
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: visible ? 0.2 : 0 }}
        transition={{ duration: 1, delay: 2 }}
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
        className="fixed top-8 right-8 z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: visible ? 0.2 : 0 }}
        transition={{ duration: 1, delay: 2 }}
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
