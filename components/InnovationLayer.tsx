'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

const ScrambleTitle = ({ text }: { text: string }) => {
  const [displayText, setDisplayText] = useState('')

  useEffect(() => {
    let iterations = 0
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_//[]'
    const interval = setInterval(() => {
      setDisplayText(
        text
          .split('')
          .map((char, index) => {
            if (index < iterations) return char
            return chars[Math.floor(Math.random() * chars.length)]
          })
          .join('')
      )
      if (iterations >= text.length) {
        clearInterval(interval)
        setDisplayText(text)
      }
      iterations += 1 / 3 // Slower decipher for dramatic effect
    }, 30)
    return () => clearInterval(interval)
  }, [text])

  return <>{displayText}</>
}

export default function InnovationLayer({ onClose }: { onClose: () => void }) {
  return (
    <motion.div
      initial={{ y: '100%' }}
      animate={{ y: 0 }}
      exit={{ y: '100%' }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className="fixed inset-0 z-50 h-screen bg-[#000502] text-[#FCFBF8] overflow-y-auto overscroll-none"
      data-lenis-prevent
    >
      {/* Suspended Lattice Background */}
      <div
        className="fixed inset-0 z-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: `linear-gradient(rgba(168, 0, 0, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(168, 0, 0, 0.1) 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
          backgroundPosition: 'center center',
          transform: 'perspective(500px) rotateX(60deg) translateY(-100px) translateZ(-200px)',
          transformOrigin: 'top center',
        }}
      />
      <div
        className="fixed inset-0 z-0 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at 50% 50%, transparent 0%, #000502 80%)',
        }}
      />

      <div className="min-h-screen max-w-4xl mx-auto px-6 py-24 md:py-32 relative z-10">
        {/* Sticky Close Button (Always visible) */}
        <div className="fixed top-6 right-6 z-50 mix-blend-difference">
          <button
            onClick={onClose}
            className="min-h-[44px] min-w-[44px] flex items-center justify-center text-[10px] font-mono border border-[#FCFBF8]/20 px-4 py-2 hover:bg-[#A80000] hover:border-[#A80000] hover:text-[#000502] transition-colors bg-[#000502]/80 backdrop-blur-sm uppercase tracking-widest"
          >
            [Close_Protocol]
          </button>
        </div>

        {/* Header */}
        <div className="border-b border-[#FCFBF8]/10 pb-8 mb-16 mt-12">
          <h1 className="text-5xl md:text-8xl font-light tracking-tighter mb-4 text-[#FCFBF8]">
            <ScrambleTitle text="ORDINANCE_02" />
          </h1>
          <p className="font-mono text-xs text-[#A80000] tracking-widest uppercase">
            Protocol: Light Absorption & Structural Permanence
          </p>
        </div>

        {/* The Manifesto - Clean, Clinical, No Redaction */}
        <div className="grid md:grid-cols-12 gap-12 font-light text-lg md:text-xl leading-relaxed text-[#FCFBF8]/90">
          <div className="md:col-span-3 font-mono text-[10px] text-[#FCFBF8]/40 space-y-4 pt-2">
            <p>REF: 99-A</p>
            <p>SUB: PHOTONIC TRAPPING</p>
            <p>LOC: TASMANIA, AU</p>
            <div className="w-8 h-[1px] bg-[#A80000] my-4" />
          </div>

          <div className="md:col-span-9 space-y-12">
            <p>
              We do not manufacture paint. We engineer{' '}
              <span className="text-[#A80000] font-mono text-base">optical voids</span>. Scalar
              Materials was founded on a singular principle: that depth is not a dimension of space,
              but a function of{' '}
              <span className="text-[#A80000] font-mono text-base">light absorption</span>.
            </p>

            <p>
              Our process begins where traditional chemistry ends. By utilizing{' '}
              <span className="text-[#A80000] font-mono text-base">suspended crystal lattice</span>{' '}
              structures, we create binders that do not reflect light—they consume it. The result is
              not &quot;black&quot; or &quot;red&quot; in the traditional sense, but a material absence
              that the human eye struggles to resolve.
            </p>

            <div className="border-l-2 border-[#A80000] pl-8 py-2 my-12 text-2xl md:text-3xl text-[#FCFBF8] font-thin">
              &quot;To define the edge is to limit the object. We remove the edge.&quot;
            </div>

            <p>
              Each batch is cured in a hyper-baric chamber to ensure{' '}
              <span className="text-[#A80000] font-mono text-base">zero-porosity</span>. This is not
              for the hobbyist. This is for the sovereignty of the object.
            </p>

            {/* Technical Footer */}
            <div className="mt-24 pt-12 border-t border-[#FCFBF8]/10 opacity-60">
              <div className="font-mono text-xs mb-8 uppercase tracking-widest">
                FIG 1.1: Refractive Index / Time
              </div>
              <motion.svg
                className="w-full h-32 relative z-10"
                viewBox="0 0 1000 100"
                preserveAspectRatio="none"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-50px' }}
              >
                {/* Reference Grid inside SVG */}
                <line
                  x1="0"
                  y1="50"
                  x2="1000"
                  y2="50"
                  stroke="#FCFBF8"
                  strokeWidth="0.5"
                  strokeDasharray="5,5"
                  opacity="0.2"
                />
                <line
                  x1="0"
                  y1="25"
                  x2="1000"
                  y2="25"
                  stroke="#FCFBF8"
                  strokeWidth="0.5"
                  strokeDasharray="5,5"
                  opacity="0.1"
                />
                <line
                  x1="0"
                  y1="75"
                  x2="1000"
                  y2="75"
                  stroke="#FCFBF8"
                  strokeWidth="0.5"
                  strokeDasharray="5,5"
                  opacity="0.1"
                />

                {/* Base Refractive Index Line */}
                <motion.path
                  d="M0,100 L200,80 L400,85 L600,40 L800,45 L1000,10"
                  fill="none"
                  stroke="#FCFBF8"
                  strokeWidth="1"
                  opacity="0.5"
                  vectorEffect="non-scaling-stroke"
                  variants={{
                    hidden: { pathLength: 0 },
                    visible: {
                      pathLength: 1,
                      transition: { duration: 2, ease: 'easeInOut' },
                    },
                  }}
                />

                {/* Scalar High-RI Line */}
                <motion.path
                  d="M0,100 L200,90 L400,92 L600,60 L800,55 L1000,20"
                  fill="none"
                  stroke="#A80000"
                  strokeWidth="2"
                  vectorEffect="non-scaling-stroke"
                  variants={{
                    hidden: { pathLength: 0 },
                    visible: {
                      pathLength: 1,
                      transition: { duration: 2, ease: 'easeInOut', delay: 0.5 },
                    },
                  }}
                />

                {/* Scanning Laser Line */}
                <motion.g
                  variants={{
                    hidden: { opacity: 0 },
                    visible: {
                      x: [0, 1000],
                      opacity: [0, 0.8],
                      transition: {
                        duration: 4,
                        ease: 'linear',
                        repeat: Infinity,
                        repeatType: 'reverse',
                      },
                    },
                  }}
                >
                  <line
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="100"
                    stroke="#A80000"
                    strokeWidth="2"
                    opacity="0.8"
                  />
                </motion.g>
              </motion.svg>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
