'use client'

import { motion } from 'framer-motion'

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
      <div className="min-h-screen max-w-4xl mx-auto px-6 py-24 md:py-32 relative">
        {/* Sticky Close Button (Always visible) */}
        <div className="fixed top-6 right-6 z-50 mix-blend-difference">
          <button
            onClick={onClose}
            className="text-[10px] font-mono border border-[#FCFBF8]/20 px-4 py-2 hover:bg-[#A80000] hover:border-[#A80000] hover:text-[#000502] transition-colors bg-[#000502]/80 backdrop-blur-sm uppercase tracking-widest"
          >
            [Close_Protocol]
          </button>
        </div>

        {/* Header */}
        <div className="border-b border-[#FCFBF8]/10 pb-8 mb-16 mt-12">
          <h1 className="text-5xl md:text-8xl font-light tracking-tighter mb-4 text-[#FCFBF8]">
            ORDINANCE_02
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
              <svg
                className="w-full h-32"
                viewBox="0 0 1000 100"
                preserveAspectRatio="none"
              >
                <path
                  d="M0,100 L200,80 L400,85 L600,40 L800,45 L1000,10"
                  fill="none"
                  stroke="#FCFBF8"
                  strokeWidth="0.5"
                  vectorEffect="non-scaling-stroke"
                />
                <path
                  d="M0,100 L200,90 L400,92 L600,60 L800,55 L1000,20"
                  fill="none"
                  stroke="#A80000"
                  strokeWidth="1"
                  vectorEffect="non-scaling-stroke"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
