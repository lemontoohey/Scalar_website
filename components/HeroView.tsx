'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import dynamic from 'next/dynamic'
import { playThud } from '@/hooks/useSound'

const ClientCanvas = dynamic(() => import('./ClientCanvas'), { ssr: false })
const CureSequenceShader = dynamic(() => import('./CureSequenceShader'), { ssr: false })

type HeroViewProps = {
  onSelectCategory: (category: 'organic' | 'inorganic') => void
  onTransitionStart: () => void
}

export default function HeroView({ onSelectCategory, onTransitionStart }: HeroViewProps) {
  const [showButtons, setShowButtons] = useState(false)

  // Synchronization Hook - Flash Peaks EXACTLY at 1600ms inside the Shader
  useEffect(() => {
    const flashTimer = setTimeout(() => {
      setShowButtons(true);
      // Automatically attempt the Sub Bass (browsers require click interactions beforehand sometimes)
      playThud(); 
    }, 1600);

    // Initial click listener simply to satisfy audio strict-policy (if user clicks early, context unlocks)
    const unlockAudio = () => playThud;
    document.addEventListener("click", unlockAudio, { once: true });

    return () => {
      clearTimeout(flashTimer);
      document.removeEventListener("click", unlockAudio);
    };
  },[]);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-[#000502]">
      {/* Background Radial Gradient Mist Backdrop */}
      <div className="absolute inset-0 z-0 opacity-70 bg-[radial-gradient(ellipse_80%_80%_at_50%_50%,rgba(74,0,0,0.5)_0%,rgba(31,5,16,0.35)_40%,transparent_70%)]" aria-hidden />
      
      {/* Decoupled WebGL Animation */}
      <div className="absolute inset-0 z-[1] transform-gpu pointer-events-none">
        <ClientCanvas fallback={<div className="absolute inset-0 bg-[#000502]" />}>
           <CureSequenceShader />
        </ClientCanvas>
      </div>

      {/* Middle Z: Floating Data - Using generic variants without deep delays */}
      <section className="relative min-h-screen flex flex-col items-center justify-center pointer-events-none select-none z-[60]">
        <div className="pointer-events-auto space-y-4 text-center mix-blend-screen bg-transparent" style={{ textShadow: '0 0 40px rgba(168, 0, 0, 0.4)' }}>
            <motion.h1
              data-thermal-hover="true"
              className="text-7xl md:text-9xl font-light tracking-[0.4em] text-[#FCFBF8]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { duration: 1.0, delay: 0.5, ease: 'easeInOut' } }}
              style={{ fontFamily: 'var(--font-archivo)', fontWeight: 300 }}
            >
              Scalar
            </motion.h1>
            <motion.p
              data-thermal-hover="true"
              className="text-lg md:text-xl font-light tracking-[0.6em] lowercase text-[#FCFBF8]/80 mt-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { duration: 0.8, delay: 1.2, ease: 'easeOut' } }}
              style={{ fontFamily: 'var(--font-archivo)' }}
            >
              ordinance of depth
            </motion.p>
        </div>

        {/* Foreground Drop: Words / Trigger */}
        <motion.div
          className="flex items-center justify-center gap-12 md:gap-16 mt-[8vh] pointer-events-auto"
          initial={{ opacity: 0, y: 15 }}
          animate={showButtons ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
          transition={{ duration: 0.6, ease:[0.16, 1, 0.3, 1] }}
        >
          <button type="button" data-thermal-hover onClick={() => { onSelectCategory('organic'); onTransitionStart(); }}
            className="font-light tracking-[0.4em] lowercase text-white/60 hover:text-white p-4 transition-colors font-['var(--font-archivo)'] font-light">
            [organic]
          </button>
          <button type="button" data-thermal-hover onClick={() => { onSelectCategory('inorganic'); onTransitionStart(); }}
            className="font-light tracking-[0.4em] lowercase text-white/60 hover:text-white p-4 transition-colors font-['var(--font-archivo)'] font-light">
            [inorganic]
          </button>
        </motion.div>
      </section>
    </div>
  )
}
