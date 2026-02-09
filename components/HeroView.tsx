'use client'

import { motion } from 'framer-motion'
import dynamic from 'next/dynamic'

const MIST_DURATION_S = 3.7
const MIST_PEAK_S = MIST_DURATION_S / 2

const SCALAR_FADE_IN_DELAY_S = MIST_PEAK_S + 0.03
const SCALAR_FADE_IN_DURATION_S = 1.0

const ORDINANCE_FADE_IN_DELAY_S =
  SCALAR_FADE_IN_DELAY_S + SCALAR_FADE_IN_DURATION_S + 0.7
const ORDINANCE_FADE_IN_DURATION_S = 0.8

const ClientCanvas = dynamic(() => import('./ClientCanvas'), { ssr: false })
const CureSequenceShader = dynamic(() => import('./CureSequenceShader'), { ssr: false })
const LensText = dynamic(() => import('./LensText'), { ssr: false })

type HeroViewProps = {
  isCured: boolean
  onSelectCategory: (category: 'organic' | 'inorganic') => void
  onTransitionStart: () => void
}

export default function HeroView({
  isCured,
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
        duration: 1.0,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  }

  const handleChoice = (category: 'organic' | 'inorganic') => {
    onSelectCategory(category)
    onTransitionStart()
  }

  return (
    <div className="relative w-full h-screen overflow-hidden" style={{ backgroundColor: '#000502' }}>
      {/* Layer 1 (Back): WebGL Mist - full screen */}
      <div
        className="absolute inset-0 z-0 opacity-70"
        style={{
          background:
            'radial-gradient(ellipse 80% 80% at 50% 50%, rgba(74,0,0,0.5) 0%, rgba(31,5,16,0.35) 40%, transparent 70%)',
        }}
        aria-hidden
      />
      {typeof window !== 'undefined' && (
        <ClientCanvas
          fallback={
            <div
              className="absolute inset-0 z-[1]"
              style={{
                background:
                  'radial-gradient(ellipse 80% 80% at 50% 50%, rgba(74,0,0,0.45) 0%, rgba(31,5,16,0.3) 40%, transparent 65%)',
              }}
            />
          }
        >
          <CureSequenceShader />
          <LensText position={[0, 0.3, 0]} fontSize={2.5}>
            Scalar
          </LensText>
        </ClientCanvas>
      )}

      {/* Layer 2 (Middle): Hero text - center */}
      <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden pointer-events-none">
        <div className="relative text-center" style={{ zIndex: 50 }}>
          <div className="space-y-4">
            <motion.h1
              className="text-7xl md:text-9xl font-light tracking-[0.4em] mix-blend-screen text-[#FCFBF8]"
              style={{
                fontFamily: 'var(--font-archivo)',
                fontWeight: 300,
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                filter: 'drop-shadow(0 0 20px rgba(168, 0, 0, 0.3))',
                textShadow: '0 0 40px rgba(168, 0, 0, 0.2)',
              }}
              variants={scalarVariant}
              initial="hidden"
              animate="visible"
            >
              Scalar
            </motion.h1>
            <motion.p
              className="text-lg md:text-xl font-light tracking-[0.6em] lowercase mix-blend-screen text-[#FCFBF8]/80 mt-4"
              style={{
                fontFamily: 'var(--font-archivo)',
                fontWeight: 300,
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
              }}
              variants={ordinanceVariant}
              initial="hidden"
              animate="visible"
            >
              ordinance of depth
            </motion.p>
          </div>
        </div>

        {/* Layer 3 (Front): [organic] | [inorganic] - only tied to isCured (3.7s + thud) */}
        <motion.div
          className="flex items-center justify-center gap-12 md:gap-16 pointer-events-auto mt-16"
          style={{ marginTop: '8vh', zIndex: 50 }}
          variants={bifurcationVariant}
          initial="hidden"
          animate={isCured ? 'visible' : 'hidden'}
        >
          <button
            type="button"
            data-thermal-hover
            onClick={() => handleChoice('organic')}
            className="font-light tracking-[0.4em] lowercase text-white/70 hover:text-white transition-colors"
            style={{ fontFamily: 'var(--font-archivo)', fontWeight: 300 }}
          >
            [organic]
          </button>
          <button
            type="button"
            data-thermal-hover
            onClick={() => handleChoice('inorganic')}
            className="font-light tracking-[0.4em] lowercase text-white/70 hover:text-white transition-colors"
            style={{ fontFamily: 'var(--font-archivo)', fontWeight: 300 }}
          >
            [inorganic]
          </button>
        </motion.div>
      </section>
    </div>
  )
}
