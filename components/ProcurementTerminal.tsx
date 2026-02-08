'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useSound } from '@/hooks/useSound'

const LOG_ENTRIES = [
  'INITIALIZING_INQUIRY...',
  'FETCHING_INVENTORY_VOL...',
  'VALIDATING_FACILITY_CODE...',
  'CALIBRATING_REFRACTIVE_STABILITY...',
  'CROSS_REFERENCING_MATERIAL_GENOME...',
  'AUTHORIZING_PROCUREMENT_LOCK...',
]

type ProcurementTerminalProps = {
  isOpen: boolean
  onClose: () => void
  specimenName: string
}

export default function ProcurementTerminal({ isOpen, onClose, specimenName }: ProcurementTerminalProps) {
  const { playThud } = useSound()
  const [status, setStatus] = useState<'idle' | 'processing' | 'authorized'>('idle')
  const [logs, setLogs] = useState<string[]>([])
  const [projectDesignation, setProjectDesignation] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isOpen && inputRef.current) inputRef.current.focus()
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) {
      setStatus('idle')
      setLogs([])
      setProjectDesignation('')
    }
  }, [isOpen])

  const startAuthorization = (e: React.FormEvent) => {
    e.preventDefault()
    if (!projectDesignation.trim()) return

    setStatus('processing')
    playThud()

    LOG_ENTRIES.forEach((entry, i) => {
      setTimeout(() => {
        setLogs((prev) => [...prev, `> ${entry}`])
      }, i * 400)
    })

    setTimeout(() => {
      setStatus('authorized')
      playThud()
    }, LOG_ENTRIES.length * 400 + 500)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="fixed top-0 right-0 w-[400px] h-full bg-[#000502] border-l border-[#FCFBF8]/10 z-[200] p-8 font-mono text-[10px] text-[#FCFBF8]/80"
          style={{ fontFamily: 'var(--font-archivo)' }}
        >
          <div className="mb-8 flex justify-between items-start">
            <h2 className="text-[#A80000] tracking-widest uppercase">INPUT_REQUIRED // PROC_01</h2>
            <button type="button" onClick={onClose} className="hover:text-[#A80000]">
              [close]
            </button>
          </div>

          <div className="mb-4 text-[#A80000]/40">SPECIMEN: {specimenName}</div>

          {status === 'idle' && (
            <form onSubmit={startAuthorization} className="space-y-4">
              <div>
                <label className="block mb-1 text-[8px] opacity-40 uppercase">
                  Project Designation
                </label>
                <input
                  ref={inputRef}
                  type="text"
                  value={projectDesignation}
                  onChange={(e) => setProjectDesignation(e.target.value)}
                  className="w-full bg-transparent border-none outline-none text-[#FCFBF8] uppercase caret-[#A80000]"
                  placeholder="enter_id_"
                />
              </div>
              <button
                type="submit"
                className="text-[8px] border border-[#FCFBF8]/20 px-2 py-1 hover:bg-[#FCFBF8] hover:text-[#000502] transition-colors"
              >
                INITIATE_AUTH
              </button>
            </form>
          )}

          <div className="mt-8 space-y-1">
            {logs.map((log, i) => (
              <div key={i} className="animate-pulse">
                {log}
              </div>
            ))}
          </div>

          {status === 'authorized' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-12 p-4 border border-[#A80000] text-[#A80000] font-bold text-center uppercase tracking-[0.2em]"
            >
              PROJECT_AUTHORIZED
              <br />
              <span className="text-[8px] opacity-60">
                Allocation code: SC-0{Math.floor(Math.random() * 999)}
              </span>
            </motion.div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
