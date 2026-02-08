'use client'

import { motion } from 'framer-motion'
import dynamic from 'next/dynamic'

const ClientCanvas = dynamic(() => import('./ClientCanvas'), { ssr: false })
const CureSequenceShader = dynamic(() => import('./CureSequenceShader'), { ssr: false })
const LensText = dynamic(() => import('./LensText'), { ssr: false })

type HeroViewProps = {
  onCureComplete?: () => void
}

export default function HeroView({ onCureComplete }: HeroViewProps) {
  return (
    <div className="relative w-full h-screen overflow-hidden" style={{ backgroundColor: '#000502' }}>
      <div
        className="absolute inset-0 z-0 opacity-60"
        style={{
          background: 'radial-gradient(ellipse 80% 80% at 50% 50%, rgba(168,0,0,0.4) 0%, transparent 70%)',
        }}
        aria-hidden
      />
      {typeof window !== 'undefined' && (
        <ClientCanvas
          fallback={
            <div
              className="absolute inset-0 z-[1]"
              style={{
                background: 'radial-gradient(ellipse 80% 80% at 50% 50%, rgba(168,0,0,0.35) 0%, transparent 65%)',
              }}
            />
          }
        >
          <CureSequenceShader onCureComplete={onCureComplete} />
          <LensText position={[0, 0.3, 0]} fontSize={2.5}>
            Scalar
          </LensText>
        </ClientCanvas>
      )}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pointer-events-none">
        <div className="relative text-center" style={{ zIndex: 50 }}>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-4"
          >
            <h1
              className="text-7xl md:text-9xl font-light tracking-[0.4em] mix-blend-screen"
              style={{
                fontFamily: 'var(--font-archivo)',
                fontWeight: 300,
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                filter: 'drop-shadow(0 0 20px rgba(168, 0, 0, 0.3))',
                textShadow: '0 0 40px rgba(168, 0, 0, 0.2)',
              }}
            >
              Scalar
            </h1>
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
    </div>
  )
}
