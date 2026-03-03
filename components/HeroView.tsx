'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import dynamic from 'next/dynamic'
import { playThud } from '@/hooks/useSound'

// RESTORED: Timing Math Constants
const MIST_DURATION_S = 3.7
const MIST_PEAK_S = MIST_DURATION_S / 2

const SCALAR_FADE_IN_DELAY_S = MIST_PEAK_S + 0.03
const SCALAR_FADE_IN_DURATION_S = 1.0

const ORDINANCE_FADE_IN_DELAY_S =
  SCALAR_FADE_IN_DELAY_S + SCALAR_FADE_IN_DURATION_S + 0.7
const ORDINANCE_FADE_IN_DURATION_S = 0.8

// RESTORED: Missing dynamic R3F imports 
const ClientCanvas = dynamic(() => import('./ClientCanvas'), { ssr: false })
const CureSequenceShader = dynamic(() => import('./CureSequenceShader'), { ssr: false })

type HeroViewProps = {
  isCured: boolean
  onSelectCategory: (category: 'organic' | 'inorganic') => void
  onTransitionStart: () => void
}

export default function HeroView({
  isCured, // Keep prop for fallback logic just in case
  onSelectCategory,
  onTransitionStart,
}: HeroViewProps) {
  
  const scalarVariant = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delay: SCALAR_FADE_IN_DELAY_S,
        duration: SCALAR_FADE_IN_DURATION_S,
        ease: 'easeInOut',
      },
    },
  }

  const ordinanceVariant = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delay: ORDINANCE_FADE_IN_DELAY_S,
        duration: ORDINANCE_FADE_IN_DURATION_S,
        ease: 'easeOut',
      },
    },
  }

  const bifurcationVariant = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        delay: 0, // Drops the EXACT millisecond the shader flash peak hits
        duration: 0.8,
        ease:[0.16, 1, 0.3, 1],
      },
    },
  }

  const [showButtons, setShowButtons] = useState(false)

  const handleChoice = (category: 'organic' | 'inorganic') => {
    onSelectCategory(category)
    onTransitionStart()
  }

  return (
    <div className="relative w-full h-screen overflow-hidden" style={{ backgroundColor: '#000502' }}>
      {/* Layer 1 (Back): WebGL Mist - full screen radial overlay */}
      <div
        className="absolute inset-0 z-0 opacity-70"
        style={{
          background:
            'radial-gradient(ellipse 80% 80% at 50% 50%, rgba(74,0,0,0.5) 0%, rgba(31,5,16,0.35) 40%, transparent 70%)',
        }}
        aria-hidden
      />
      
      {/* WebGL container: Z-Index 1 to sit behind UI text. Pointer events NONE so it doesnt block cursor. */}
      <div className="absolute inset-0 z-[1]" style={{ transform: 'translateZ(0)', pointerEvents: 'none' }}>
        <ClientCanvas
          fallback={
            <div className="absolute inset-0 bg-[#000502]" />
          }
        >
           {/* Pure WebGL Layer - NO Heavy Text / Suspense boundaries rendering 600fps glass */}
           <CureSequenceShader 
             onFlashPeak={() => {
                setShowButtons(true);
                playThud();
             }} 
           />
        </ClientCanvas>
      </div>

      {/* Layer 2 (Middle): Hero text - centered UI, must have pointer events AUTO */}
      <section className="hero-text-block relative min-h-screen flex flex-col items-center justify-center overflow-hidden pointer-events-none" style={{ outline: 'none', WebkitTapHighlightColor: 'transparent' }}>
        <div className="relative text-center pointer-events-auto z-[60]" style={{ outline: 'none', background: 'transparent' }}>
          <div className="space-y-4">
            <motion.h1
              data-thermal-hover="true"
              className="hero-title text-7xl md:text-9xl font-light tracking-[0.4em] text-[#FCFBF8] outline-none select-none"
              style={{
                fontFamily: 'var(--font-archivo)',
                fontWeight: 300,
                background: 'transparent',
                filter: 'drop-shadow(0 0 20px rgba(168, 0, 0, 0.3))',
                textShadow: '0 0 40px rgba(168, 0, 0, 0.2)',
                outline: 'none',
                WebkitTapHighlightColor: 'transparent',
              }}
              variants={scalarVariant}
              initial="hidden"
              animate="visible"
            >
              Scalar
            </motion.h1>
            <motion.p
              data-thermal-hover="true"
              className="text-lg md:text-xl font-light tracking-[0.6em] lowercase text-[#FCFBF8]/80 mt-4"
              style={{
                fontFamily: 'var(--font-archivo)',
                fontWeight: 300,
                background: 'transparent',
              }}
              variants={ordinanceVariant}
              initial="hidden"
              animate="visible"
            >
              ordinance of depth
            </motion.p>
          </div>
        </div>

        {/* Layer 3 (Front): UI Action Gate */}
        <motion.div
          className="flex items-center justify-center gap-12 md:gap-16 pointer-events-auto mt-16 z-[60]"
          style={{ marginTop: '8vh', position: 'relative' }}
          variants={bifurcationVariant}
          initial="hidden"
          animate={showButtons ? 'visible' : 'hidden'}
        >
          <button
            type="button"
            data-thermal-hover="true"
            onClick={() => handleChoice('organic')}
            className="font-light tracking-[0.4em] lowercase text-[#FCFBF8]/60 hover:text-white transition-colors p-4"
            style={{ fontFamily: 'var(--font-archivo)', fontWeight: 300 }}
          >
            [organic]
          </button>
          <button
            type="button"
            data-thermal-hover="true"
            onClick={() => handleChoice('inorganic')}
            className="font-light tracking-[0.4em] lowercase text-[#FCFBF8]/60 hover:text-white transition-colors p-4"
            style={{ fontFamily: 'var(--font-archivo)', fontWeight: 300 }}
          >
            [inorganic]
          </button>
        </motion.div>
      </section>
    </div>
  )
}
