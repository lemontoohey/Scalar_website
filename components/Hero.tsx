'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import OpticalEngine from './OpticalEngine'
import BottomNav from './BottomNav'
import DiagnosticMetadata from './DiagnosticMetadata'
import EnsoEchoCursor from './EnsoEchoCursor'

export default function Hero() {
  const [cureComplete, setCureComplete] = useState(false)

  return (
    <>
      <EnsoEchoCursor />
      <OpticalEngine onCureComplete={() => setCureComplete(true)}>
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
          {/* Hero Stack with Engineered Asymmetry: -5% X, -3% Y from center */}
          <div 
            className="relative text-center"
            style={{
              transform: 'translate(calc(-50% - 5vw), calc(-50% - 3vh))',
              position: 'absolute',
              top: '50%',
              left: '50%',
              zIndex: 50,
            }}
          >
            {/* Scalar text - Logo offset +3% X relative to this */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-4"
            >
              {/* Logo positioned +3% X from text center */}
              <div
                className="relative mb-8"
                style={{
                  transform: 'translateX(3%)',
                  display: 'inline-block',
                }}
              >
                {/* Fallback logo in case shader fails */}
                <img
                  src="/logo.png"
                  alt="Scalar Enso"
                  className="w-[35vh] h-[35vh] object-contain opacity-50"
                  style={{
                    filter: 'drop-shadow(0 0 20px rgba(168, 0, 0, 0.5))',
                    mixBlendMode: 'screen',
                  }}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    console.error('Fallback logo failed to load')
                    target.style.display = 'none'
                  }}
                />
              </div>

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
        <DiagnosticMetadata visible={true} />
        <BottomNav visible={true} />
      </OpticalEngine>
    </>
  )
}
