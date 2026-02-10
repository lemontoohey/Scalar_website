'use client'

import { useState, useCallback, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { AnimatePresence, motion } from 'framer-motion'
import type { Specimen } from '@/constants/specimens'
import { playThud } from '@/hooks/useSound'
import Hallmark from '@/components/Hallmark'
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

const CURE_THUD_MS = 3700

export default function Home() {
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
    if (state !== 'hero') return
    const t = setTimeout(() => {
      setIsCured(true)
      playThud()
    }, CURE_THUD_MS)
    return () => clearTimeout(t)
  }, [state, mistKey])

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
      <Hallmark onReset={resetSystem} />
      <MetadataOverlays />
      <HardwareHandshake />
      <ScanningLine />
      <GlobalNav onInnovationClick={() => setViewMode('innovation')} />

      {state === 'hero' && (
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
