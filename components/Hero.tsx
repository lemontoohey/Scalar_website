'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import dynamic from 'next/dynamic'

// Dynamic imports for R3F components
const ClientCanvas = dynamic(() => import('./ClientCanvas'), { ssr: false })
const CureSequenceShader = dynamic(() => import('./CureSequenceShader'), { ssr: false })
const LensText = dynamic(() => import('./LensText'), { ssr: false })
const SpecimenGallery = dynamic(() => import('./SpecimenGallery'), { ssr: false })

// Regular imports for non-R3F components
import Hallmark from './Hallmark'
import MetadataOverlays from './MetadataOverlays'
import HardwareHandshake from './HardwareHandshake'
import EnsoEchoCursor from './EnsoEchoCursor'
import BottomNav from './BottomNav'
import DebugOverlay from './DebugOverlay'
import ProductArchitecture from './ProductArchitecture'
import ProcurementGate from './ProcurementGate'
import AtmosphericAudio from './AtmosphericAudio'

export default function Hero() {
  const [cureComplete, setCureComplete] = useState(false)

  return (
    <>
      <DebugOverlay />
      <AtmosphericAudio />
      <EnsoEchoCursor />
      <Hallmark />
      <MetadataOverlays />
      <HardwareHandshake />
      
      <div className="relative w-full h-screen overflow-hidden" style={{ backgroundColor: '#000502' }}>
        {/* Cure Sequence Background with 3D Text */}
        <ClientCanvas fallback={null}>
          <CureSequenceShader onCureComplete={() => setCureComplete(true)} />
          <LensText position={[0, 0.3, 0]} fontSize={2.5}>
            Scalar
          </LensText>
        </ClientCanvas>

        {/* Hero Text Overlay (for subtitle and fallback) */}
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden pointer-events-none">
          <div 
            className="relative text-center"
            style={{
              zIndex: 50,
            }}
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-4"
            >
              {/* 3D text renders "Scalar" via LensText above */}
              <div className="h-32 md:h-40" /> {/* Spacer for 3D text */}
              <motion.p
                className="text-lg md:text-xl font-light tracking-[0.6em] lowercase mix-blend-screen"
                style={{ 
                  fontFamily: 'var(--font-archivo)',
                  fontWeight: 300,
                  backdropFilter: 'blur(10px)',
                  WebkitBackdropFilter: 'blur(10px)',
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
              >
                ordinance of depth
              </motion.p>
            </motion.div>
          </div>
        </section>
        
        <ProductArchitecture />
        <SpecimenGallery />
        <ProcurementGate />
        <BottomNav visible={true} />
      </div>
    </>
  )
}
