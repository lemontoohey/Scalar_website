'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'

const Redacted = ({ children }: { children: React.ReactNode }) => {
  const [isHovered, setIsHovered] = useState(false)
  return (
    <span
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative inline-block cursor-crosshair group"
    >
      <span className={`transition-opacity duration-500 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
        {children}
      </span>
      <span
        className={`absolute inset-0 bg-[#FCFBF8] transition-all duration-500 ${isHovered ? 'w-0' : 'w-full'}`}
      />
    </span>
  )
}

export default function InnovationLayer({ onClose }: { onClose: () => void }) {
  return (
    <motion.div
      initial={{ y: '100%' }}
      animate={{ y: 0 }}
      exit={{ y: '100%' }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className="fixed inset-0 z-40 bg-[#000502] text-[#FCFBF8] overflow-y-auto"
    >
      <div className="max-w-4xl mx-auto px-6 py-24 md:py-32">
        <div className="flex justify-between items-end border-b border-[#FCFBF8]/10 pb-8 mb-16">
          <div>
            <h1 className="text-6xl md:text-8xl font-light tracking-tighter mb-2">ORDINANCE_02</h1>
            <p className="font-mono text-xs text-[#A80000] tracking-widest uppercase">
              Declassified: Protocol for Absolute Depth
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-xs font-mono border border-[#FCFBF8]/20 px-4 py-2 hover:bg-[#A80000] hover:border-[#A80000] transition-colors"
          >
            [CLOSE_FILE]
          </button>
        </div>

        <div className="grid md:grid-cols-12 gap-12 font-light text-lg leading-relaxed text-[#FCFBF8]/80">
          <div className="md:col-span-4 font-mono text-xs text-[#FCFBF8]/40 space-y-4">
            <p>REF: 99-A</p>
            <p>SUB: PHOTONIC TRAPPING</p>
            <p>LOC: TASMANIA, AU</p>
          </div>

          <div className="md:col-span-8 space-y-12">
            <p>
              We do not manufacture paint. We engineer <Redacted>optical voids</Redacted>. Scalar
              Materials was founded on a singular principle: that depth is not a dimension of space,
              but a function of <Redacted>light absorption</Redacted>.
            </p>

            <p>
              Our process begins where traditional chemistry ends. By utilizing
              <Redacted>suspended crystal lattice</Redacted> structures, we create binders that do
              not reflect light—they consume it. The result is not &quot;black&quot; or
              &quot;red&quot; in the traditional sense, but a material absence that the human eye
              struggles to resolve.
            </p>

            <div className="border-l-2 border-[#A80000] pl-6 py-2 my-12 italic text-2xl text-[#FCFBF8]">
              &quot;To define the edge is to limit the object. We remove the edge.&quot;
            </div>

            <p>
              Each batch is cured in a hyper-baric chamber to ensure <Redacted>zero-porosity</Redacted>.
              This is not for the hobbyist. This is for the sovereignty of the object.
            </p>
          </div>
        </div>

        <div className="mt-24 border-t border-[#FCFBF8]/10 pt-8 opacity-50">
          <div className="font-mono text-xs mb-8">FIG 1.1: LATTICE REFRACTION</div>
          <svg className="w-full h-32" viewBox="0 0 1000 100">
            <motion.path
              d="M0,50 Q250,0 500,50 T1000,50"
              fill="none"
              stroke="#FCFBF8"
              strokeWidth="1"
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              transition={{ duration: 2 }}
            />
            <motion.path
              d="M0,50 Q250,100 500,50 T1000,50"
              fill="none"
              stroke="#A80000"
              strokeWidth="1"
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              transition={{ duration: 2, delay: 0.5 }}
            />
          </svg>
        </div>
      </div>
    </motion.div>
  )
}
