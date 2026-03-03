'use client'

import { motion, useInView } from 'framer-motion'
import Link from 'next/link'
import { useRef } from 'react'

const pulseVariants = {
  hidden: { opacity: 0, y: 24, filter: 'blur(8px)' },
  visible: {
    opacity: 1, y: 0, filter: 'blur(0px)',
    transition: { duration: 0.7, ease:[0.25, 0.46, 0.45, 0.94] },
  },
}

function PulseSection({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })
  return (
    <motion.section ref={ref} className={className} variants={pulseVariants} initial="hidden" animate={isInView ? 'visible' : 'hidden'}>
      {children}
    </motion.section>
  )
}

export default function InnovationsPage() {
  return (
    <main className="min-h-screen" style={{ backgroundColor: '#090205', color: '#FCFBF8', fontFamily: 'var(--font-archivo)' }}>
      <div className="max-w-4xl mx-auto px-6 sm:px-12 py-24 md:py-32">
        <Link href="/" className="inline-block mb-16 text-[10px] font-mono tracking-widest uppercase text-[#FCFBF8]/60 hover:text-[#A80000] transition-colors">
          ← Back
        </Link>

        <h1 className="text-4xl md:text-7xl font-light tracking-tight mb-4 text-[#FCFBF8]">The Technical Archive</h1>
        <p className="text-[#FCFBF8]/50 font-mono text-xs tracking-widest uppercase mb-24">Scalar Materials // Innovation Protocol</p>

        {/* Section 1: The Molecular Suspension with Data Dots */}
        <PulseSection className="mb-32 relative border-l border-[#FCFBF8]/10 pl-8">
          {/* Animated Telemetry Dots */}
          <div className="absolute top-2 left-[-11px] flex flex-col gap-2">
            {[...Array(5)].map((_, i) => (
              <motion.div key={i} className="w-[20px] h-[3px] bg-[#A80000]" animate={{ opacity:[0.2, 1, 0.2] }} transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2, ease: "linear" }} />
            ))}
          </div>
          <h2 className="text-2xl md:text-4xl font-light tracking-tight mb-6 text-[#A80000]">ENGINEERING THE VOID</h2>
          <p className="text-lg md:text-xl font-light leading-relaxed text-[#FCFBF8]/80 max-w-2xl">
            True depth is a math problem. By milling our materials down to sub-5 microns and locking them inside a specialized polymer system, we strip away the dull fillers that weaken traditional acrylics. What’s left is pure, unbroken saturation and optical depth from the very first drop.
          </p>
        </PulseSection>

        {/* Section 2: The UV-Flash with Liquid-to-Solid blob */}
        <PulseSection className="mb-32">
          <div className="grid md:grid-cols-12 gap-8 items-center border-l border-[#A80000]/30 pl-8">
            <div className="md:col-span-8">
              <h2 className="text-2xl md:text-4xl font-light tracking-tight mb-6 text-[#A80000]">INFINITE FLUID. INSTANT GLASS.</h2>
              <p className="text-lg md:text-xl font-light leading-relaxed text-[#FCFBF8]/80 max-w-2xl">
                Traditional evaporation curing is an unacceptable bottleneck. Scalar materials operate on a UV-Flash biopolymer system. This separates the act of shaping from the act of curing. It provides 'Infinite Open Time'—remaining perfectly fluid while you work—followed by instant, indestructible crosslinking the moment it meets a 365nm UV light.
              </p>
            </div>
            <div className="md:col-span-4 flex justify-center mt-8 md:mt-0">
              <motion.div 
                className="w-32 h-32 bg-[#A80000]/80 shadow-[0_0_40px_rgba(168,0,0,0.5)]"
                style={{ borderRadius: "40% 60% 70% 30% / 40% 50% 60% 50%" }}
                initial={{ borderRadius: "40% 60% 70% 30% / 40% 50% 60% 50%" }}
                whileInView={{ 
                  borderRadius:["40% 60% 70% 30%", "2%", "0%"],
                  backgroundColor:["rgba(168,0,0,0.8)", "rgba(255,255,255,0.9)", "rgba(10,10,10,0.9)"],
                  boxShadow:["0 0 40px rgba(168,0,0,0.5)", "0 0 100px rgba(255,255,255,0.8)", "0 0 10px rgba(255,255,255,0.1)"],
                  rotate:[0, 45, 90]
                }}
                transition={{ duration: 1.5, ease: "anticipate", delay: 0.5 }}
                viewport={{ once: true, margin: "-100px" }}
              />
            </div>
          </div>
        </PulseSection>

        {/* Section 3: Parallax Optical Stack */}
        <PulseSection className="pt-16 border-t border-[#FCFBF8]/10">
          <div className="flex flex-col md:flex-row items-start justify-between relative perspective-1000">
            <motion.div className="mb-12 md:w-1/3 relative z-30 bg-[#090205]/60 p-6 border-t border-[#FCFBF8]" whileHover={{ y: -5 }}>
              <h3 className="text-sm font-mono tracking-widest uppercase text-[#A80000] mb-3">CLARITY</h3>
              <p className="text-[#FCFBF8]/80 font-light leading-relaxed">Absolute transparency. The total elimination of 'structural mud' and milky haze in multi-layer builds.</p>
            </motion.div>
            <motion.div className="mb-12 md:w-1/3 relative z-20 bg-[#090205]/70 p-6 border-t border-[#A80000]/60 mt-4 md:ml-[-10%]" whileHover={{ y: -5 }}>
              <h3 className="text-sm font-mono tracking-widest uppercase text-[#A80000] mb-3">CHROMA</h3>
              <p className="text-[#FCFBF8]/80 font-light leading-relaxed">Uncompromised saturation. Sub-micron pigments engineered for permanent, zero-settling suspension.</p>
            </motion.div>
            <motion.div className="md:w-1/3 relative z-10 bg-[#090205]/80 p-6 border-t border-[#FCFBF8]/20 mt-8 md:ml-[-10%]" whileHover={{ y: -5 }}>
              <h3 className="text-sm font-mono tracking-widest uppercase text-[#A80000] mb-3">DEPTH</h3>
              <p className="text-[#FCFBF8]/80 font-light leading-relaxed">Infinite refraction. A microscopic architecture designed not just to mimic the look of glass, but its physical behavior.</p>
            </motion.div>
          </div>
        </PulseSection>
      </div>
    </main>
  )
}
