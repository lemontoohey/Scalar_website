'use client'

import { useState, useCallback, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { AnimatePresence, motion } from 'framer-motion'
import type { Specimen } from '@/constants/specimens'
import { playThud, playLensClick, initAudio } from '@/hooks/useSound'
import GlobalNav from '@/components/GlobalNav'
import MetadataOverlays from '@/components/MetadataOverlays'
import HardwareHandshake from '@/components/HardwareHandshake'
import AtmosphericAudio from '@/components/AtmosphericAudio'
import ScanningLine from '@/components/ScanningLine'
import SpecimenGrid from '@/components/SpecimenGrid'
import RefractiveTransition from '@/components/RefractiveTransition'
import ProcurementTerminal from '@/components/ProcurementTerminal'
import MaterialGenome from '@/components/MaterialGenome'
import InnovationLayer from '@/components/InnovationLayer'

const HeroView = dynamic(() => import('@/components/HeroView'), { ssr: false })

export type PageState = 'hero' | 'gallery'
export type ViewMode = 'cinema' | 'innovation'

const CURE_THUD_MS = 1650 // Synchronized with the 0.444 shader peak

export default function Home() {
  const [hasEntered, setHasEntered] = useState(false)
  const [state, setState] = useState<PageState>('hero')
  const [viewMode, setViewMode] = useState<ViewMode>('cinema')
  const [isCured, setIsCured] = useState(false)
  const [mistKey, setMistKey] = useState(0)
  const [selectedCategory, setSelectedCategory] = useState<'organic' | 'inorganic' | null>(null)
  const [transitionActive, setTransitionActive] = useState(false)
  const [procurementOpen, setProcurementOpen] = useState(false)
  const [procurementSpecimenName, setProcurementSpecimenName] = useState('')
  const [viewingSpecimen, setViewingSpecimen] = useState<Specimen | null>(null)

  useEffect(() => {
    if (state !== 'hero' || !hasEntered) return
    const t = setTimeout(() => {
      setIsCured(true)
      playThud()
    }, CURE_THUD_MS)
    return () => clearTimeout(t)
  }, [state, hasEntered, mistKey])

  const resetSystem = useCallback(() => {
    setIsCured(false)
    setSelectedCategory(null)
    setViewingSpecimen(null)
    setState('hero')
    setMistKey((k) => k + 1)
  }, [])

  const onSelectCategory = useCallback((category: 'organic' | 'inorganic') => {
    setSelectedCategory(category)
  }, [])

  const onTransitionStart = useCallback(() => {
    setTransitionActive(true)
  }, [])

  const onTransitionPeak = useCallback(() => {
    setState('gallery')
    setTimeout(() => setTransitionActive(false), 600)
  }, [])

  const openProcurement = useCallback((specimenName: string) => {
    setProcurementSpecimenName(specimenName)
    setProcurementOpen(true)
  }, [])

  const viewSpecimen = useCallback((specimen: Specimen) => {
    setViewingSpecimen(specimen)
  }, [])

  return (
    <main className="min-h-[100dvh] min-h-screen bg-black" style={{ backgroundColor: '#000502' }}>
      <AtmosphericAudio />
      {/* Entry Gate: unlocks AudioContext via user gesture, starts shader + thud in sync */}
      {!hasEntered && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-[#000502]">
          <button
            type="button"
            onClick={() => {
              initAudio()
              setHasEntered(true)
            }}
            className="font-mono text-xs md:text-sm tracking-[0.5em] text-[#FCFBF8]/60 hover:text-[#FCFBF8] border border-[#FCFBF8]/20 hover:border-[#FCFBF8]/40 px-8 py-4 transition-colors duration-300"
            style={{ fontFamily: 'var(--font-archivo)', fontWeight: 300 }}
          >
            [ INITIATE_SEQUENCE ]
          </button>
        </div>
      )}
      {/* Top-left Scalar: only on non-landing pages (gallery, innovation, modal) to guide back */}
      {(state !== 'hero' || viewMode === 'innovation' || viewingSpecimen !== null || procurementOpen) && (
        <button
          type="button"
          onClick={resetSystem}
          onMouseEnter={playLensClick}
          className="fixed top-8 left-8 z-[100] min-w-[44px] min-h-[44px] flex items-center justify-center text-[#FCFBF8]/70 hover:text-[#FCFBF8] font-light tracking-[0.3em] text-sm uppercase transition-colors outline-none border-0 bg-transparent cursor-pointer"
          style={{ fontFamily: 'var(--font-archivo)', WebkitTapHighlightColor: 'transparent' }}
          aria-label="Scalar Materials – reset to home"
        >
          Scalar
        </button>
      )}
      <MetadataOverlays />
      <HardwareHandshake />
      <ScanningLine />
      <GlobalNav onInnovationClick={() => setViewMode('innovation')} />

      {state === 'hero' && hasEntered && (
        <HeroView
          key={mistKey}
          isCured={isCured}
          onSelectCategory={onSelectCategory}
          onTransitionStart={onTransitionStart}
        />
      )}
      {state === 'gallery' && selectedCategory && (
        <motion.div
          className="fixed inset-0 z-10 origin-center overflow-hidden"
          animate={{
            scale: viewMode === 'innovation' ? 0.95 : 1,
            filter: viewMode === 'innovation' ? 'blur(10px)' : 'blur(0px)',
          }}
          transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <SpecimenGrid
            category={selectedCategory}
            onInitiateProcurement={openProcurement}
            onViewSpecimen={viewSpecimen}
            contained
          />
        </motion.div>
      )}

      <RefractiveTransition trigger={transitionActive} onPeak={onTransitionPeak} />
      <ProcurementTerminal
        isOpen={procurementOpen}
        onClose={() => setProcurementOpen(false)}
        specimenName={procurementSpecimenName}
      />

      <AnimatePresence>
        {viewingSpecimen && (
          <MaterialGenome specimen={viewingSpecimen} onClose={() => setViewingSpecimen(null)} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {viewMode === 'innovation' && (
          <InnovationLayer onClose={() => setViewMode('cinema')} />
        )}
      </AnimatePresence>
    </main>
  )
}
