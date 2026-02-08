'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function ProcurementGate() {
  const [isOpen, setIsOpen] = useState(false)
  const [formData, setFormData] = useState({
    projectDesignation: '',
    requiredVolume: '',
    facilityCode: '',
  })

  return (
    <>
      <motion.button
        className="fixed bottom-24 right-8 z-[100] px-6 py-3 text-sm font-light tracking-[0.2em] lowercase border border-white/20 text-white/60 hover:text-white hover:border-white/40 transition-all"
        style={{
          fontFamily: 'var(--font-archivo)',
          fontWeight: 300,
        }}
        onClick={() => setIsOpen(true)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        Initiate Procurement
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-y-0 right-0 z-[200] bg-black/95 border-l border-white/10"
            style={{ width: '30%' }}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            <div className="h-full flex flex-col p-8">
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-lg font-light tracking-[0.2em] uppercase" style={{ fontFamily: 'var(--font-archivo)', fontWeight: 300 }}>
                  Procurement Terminal
                </h3>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-sm font-light tracking-[0.2em] lowercase text-white/60 hover:text-white"
                  style={{ fontFamily: 'var(--font-archivo)', fontWeight: 300 }}
                >
                  [close]
                </button>
              </div>

              <div className="flex-1 space-y-6">
                <div>
                  <label className="block text-xs font-light tracking-[0.1em] uppercase mb-2 text-white/40" style={{ fontFamily: 'var(--font-archivo)', fontWeight: 300 }}>
                    PROJECT_DESIGNATION
                  </label>
                  <input
                    type="text"
                    value={formData.projectDesignation}
                    onChange={(e) => setFormData({ ...formData, projectDesignation: e.target.value })}
                    className="w-full bg-transparent border border-white/10 px-4 py-2 text-sm font-light text-white focus:outline-none focus:border-white/30 transition-colors"
                    style={{ fontFamily: 'var(--font-archivo)', fontWeight: 300 }}
                  />
                </div>

                <div>
                  <label className="block text-xs font-light tracking-[0.1em] uppercase mb-2 text-white/40" style={{ fontFamily: 'var(--font-archivo)', fontWeight: 300 }}>
                    REQUIRED_VOLUME_L
                  </label>
                  <input
                    type="text"
                    value={formData.requiredVolume}
                    onChange={(e) => setFormData({ ...formData, requiredVolume: e.target.value })}
                    className="w-full bg-transparent border border-white/10 px-4 py-2 text-sm font-light text-white focus:outline-none focus:border-white/30 transition-colors"
                    style={{ fontFamily: 'var(--font-archivo)', fontWeight: 300 }}
                  />
                </div>

                <div>
                  <label className="block text-xs font-light tracking-[0.1em] uppercase mb-2 text-white/40" style={{ fontFamily: 'var(--font-archivo)', fontWeight: 300 }}>
                    FACILITY_CODE
                  </label>
                  <input
                    type="text"
                    value={formData.facilityCode}
                    onChange={(e) => setFormData({ ...formData, facilityCode: e.target.value })}
                    className="w-full bg-transparent border border-white/10 px-4 py-2 text-sm font-light text-white focus:outline-none focus:border-white/30 transition-colors"
                    style={{ fontFamily: 'var(--font-archivo)', fontWeight: 300 }}
                  />
                </div>
              </div>

              <button
                className="mt-8 w-full py-3 text-sm font-light tracking-[0.2em] uppercase border border-white/20 text-white/60 hover:text-white hover:border-white/40 transition-all"
                style={{ fontFamily: 'var(--font-archivo)', fontWeight: 300 }}
                onClick={() => {
                  console.log('Procurement initiated:', formData)
                  setIsOpen(false)
                }}
              >
                Submit Procurement
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
