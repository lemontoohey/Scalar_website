'use client'

import { useState, useCallback } from 'react'
import dynamic from 'next/dynamic'
import { AnimatePresence } from 'framer-motion'
import type { Specimen } from '@/constants/specimens'
import Hallmark from '@/components/Hallmark'
import GlobalNav from '@/components/GlobalNav'
import EnsoEchoCursor from '@/components/EnsoEchoCursor'
import MetadataOverlays from '@/components/MetadataOverlays'
import HardwareHandshake from '@/components/HardwareHandshake'
import AtmosphericAudio from '@/components/AtmosphericAudio'
import ScanningLine from '@/components/ScanningLine'
import BifurcationView from '@/components/BifurcationView'
import SpecimenGrid from '@/components/SpecimenGrid'
import RefractiveTransition from '@/components/RefractiveTransition'
import ProcurementTerminal from '@/components/ProcurementTerminal'
import MaterialGenome from '@/components/MaterialGenome'

const HeroView = dynamic(() => import('@/components/HeroView'), { ssr: false })

export type PageState = 'hero' | 'bifurcation' | 'gallery'

export default function Home() {
  const [state, setState] = useState<PageState>('hero')
  const [selectedCategory, setSelectedCategory] = useState<'organic' | 'inorganic' | null>(null)
  const [transitionActive, setTransitionActive] = useState(false)
  const [procurementOpen, setProcurementOpen] = useState(false)
  const [procurementSpecimenName, setProcurementSpecimenName] = useState('')
  const [viewingSpecimen, setViewingSpecimen] = useState<Specimen | null>(null)

  const goToBifurcation = useCallback(() => {
    setState('bifurcation')
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
    <main className="min-h-screen bg-black" style={{ backgroundColor: '#000502' }}>
      <AtmosphericAudio />
      <EnsoEchoCursor />
      <Hallmark />
      <MetadataOverlays />
      <HardwareHandshake />
      <ScanningLine />
      <GlobalNav />

      {state === 'hero' && <HeroView onCureComplete={goToBifurcation} />}
      {state === 'bifurcation' && (
        <BifurcationView onSelect={onSelectCategory} onTransitionStart={onTransitionStart} />
      )}
      {state === 'gallery' && selectedCategory && (
        <SpecimenGrid
          category={selectedCategory}
          onInitiateProcurement={openProcurement}
          onViewSpecimen={viewSpecimen}
        />
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
    </main>
  )
}
