'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function ProcurementTerminal() {
  const [open, setOpen] = useState(false)
  const [project, setProject] = useState('')
  const [volume, setVolume] = useState('')
  const [facility, setFacility] = useState('')

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed bottom-24 right-8 z-[100] px-6 py-3 text-sm font-light tracking-[0.2em] lowercase border border-white/20 text-white/60 hover:text-white"
        style={{ fontFamily: 'var(--font-archivo)', fontWeight: 300 }}
      >
        Initiate Procurement
      </button>

      <AnimatePresence>
        {open && (
          <motion.aside
            className="fixed top-0 right-0 bottom-0 z-[200] border-l"
            style={{
              width: '350px',
              backgroundColor: '#000502',
              borderLeftWidth: '1px',
              borderColor: 'rgba(245,245,220,0.2)',
            }}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            <div className="p-6 h-full flex flex-col">
              <div className="text-[10px] font-mono tracking-wider text-white/50 uppercase mb-6" style={{ fontFamily: 'var(--font-archivo)' }}>
                INPUT_REQUIRED // PROCUREMENT_01
              </div>
              <div className="space-y-4 flex-1">
                <div>
                  <label className="block text-[10px] font-mono text-white/40 uppercase mb-1" style={{ fontFamily: 'var(--font-archivo)' }}>
                    PROJECT_DESIGNATION:
                  </label>
                  <input
                    type="text"
                    value={project}
                    onChange={(e) => setProject(e.target.value)}
                    className="w-full bg-transparent text-white text-[10px] font-mono focus:outline-none caret-white"
                    style={{ fontFamily: 'var(--font-archivo)' }}
                    placeholder="_"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-mono text-white/40 uppercase mb-1" style={{ fontFamily: 'var(--font-archivo)' }}>
                    REQ_VOLUME_L:
                  </label>
                  <input
                    type="text"
                    value={volume}
                    onChange={(e) => setVolume(e.target.value)}
                    className="w-full bg-transparent text-white text-[10px] font-mono focus:outline-none caret-white"
                    style={{ fontFamily: 'var(--font-archivo)' }}
                    placeholder="_"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-mono text-white/40 uppercase mb-1" style={{ fontFamily: 'var(--font-archivo)' }}>
                    FACILITY_CODE:
                  </label>
                  <input
                    type="text"
                    value={facility}
                    onChange={(e) => setFacility(e.target.value)}
                    className="w-full bg-transparent text-white text-[10px] font-mono focus:outline-none caret-white"
                    style={{ fontFamily: 'var(--font-archivo)' }}
                    placeholder="_"
                  />
                </div>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="text-[10px] font-mono tracking-wider text-white/50 hover:text-white uppercase mt-4"
                style={{ fontFamily: 'var(--font-archivo)' }}
              >
                [close]
              </button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  )
}
