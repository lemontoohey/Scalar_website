'use client'

import { motion } from 'framer-motion'
import { useEffect, useRef } from 'react'
import type { Specimen } from '@/constants/specimens'

const LatticeCanvas = ({ color }: { color: string }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let animationFrameId: number
    let nodes: { x: number; y: number; vx: number; vy: number }[] = []

    const resize = () => {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
      nodes = Array.from({ length: 50 }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
      }))
    }
    resize()

    const draw = () => {
      if (!ctx) return
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.fillStyle = color
      ctx.strokeStyle = color

      nodes.forEach((node) => {
        node.x += node.vx
        node.y += node.vy
        if (node.x < 0 || node.x > canvas.width) node.vx *= -1
        if (node.y < 0 || node.y > canvas.height) node.vy *= -1

        ctx.beginPath()
        ctx.arc(node.x, node.y, 2, 0, Math.PI * 2)
        ctx.fill()
      })

      ctx.lineWidth = 0.5
      ctx.globalAlpha = 0.2
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x
          const dy = nodes[i].y - nodes[j].y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < 100) {
            ctx.beginPath()
            ctx.moveTo(nodes[i].x, nodes[i].y)
            ctx.lineTo(nodes[j].x, nodes[j].y)
            ctx.stroke()
          }
        }
      }
      ctx.globalAlpha = 1
      animationFrameId = requestAnimationFrame(draw)
    }
    draw()
    return () => cancelAnimationFrame(animationFrameId)
  }, [color])

  return <canvas ref={canvasRef} className="w-full h-full opacity-50" />
}

export default function MaterialGenome({
  specimen,
  onClose,
}: {
  specimen: Specimen | null
  onClose: () => void
}) {
  if (!specimen) return null

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[60] bg-[#000502]/95 backdrop-blur-xl flex flex-col md:flex-row"
    >
      {/* LEFT: The Visuals */}
      <div className="w-full md:w-1/2 h-[50vh] md:h-full relative border-r border-[#FCFBF8]/10">
        <div className="absolute top-8 left-8 z-10">
          <h1 className="text-4xl md:text-6xl font-light text-[#FCFBF8] tracking-tighter">
            {specimen.technicalCode}
          </h1>
          <p className="text-[#A80000] tracking-[0.4em] text-xs mt-2 uppercase">
            Molecular Analysis // {specimen.category}
          </p>
        </div>
        <LatticeCanvas color={specimen.category === 'inorganic' ? '#A80000' : '#FCFBF8'} />

        <div className="absolute bottom-8 left-8 text-[#FCFBF8]/40 font-mono text-[10px] space-y-1">
          <div>LATTICE_STRUCT: HEXAGONAL</div>
          <div>BOND_STRENGTH: 14.5 GPa</div>
          <div>REFRACTIVE_INDEX: {specimen.index}</div>
        </div>
      </div>

      {/* RIGHT: The Data */}
      <div className="w-full md:w-1/2 h-[50vh] md:h-full p-12 flex flex-col justify-center relative">
        <button
          onClick={onClose}
          className="absolute top-8 right-8 text-[#FCFBF8] border border-[#FCFBF8]/20 px-4 py-2 hover:bg-[#FCFBF8] hover:text-[#000502] transition-colors text-xs tracking-widest uppercase"
        >
          [Close_Analysis]
        </button>

        <div className="space-y-12">
          <div>
            <h3 className="text-[#A80000] text-[10px] uppercase tracking-widest mb-4">
              Material Narrative
            </h3>
            <p className="text-[#FCFBF8] font-light text-xl leading-relaxed max-w-md">
              {specimen.description}. A proprietary formulation designed for absolute light
              absorption and structural permanence. Engineered for the vacuum of space and the
              luxury of silence.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8 font-mono text-xs text-[#FCFBF8]/60">
            <div className="border-t border-[#FCFBF8]/10 pt-4">
              <span className="block mb-2 opacity-30">CURE_TIME</span>
              14 Seconds (UV)
            </div>
            <div className="border-t border-[#FCFBF8]/10 pt-4">
              <span className="block mb-2 opacity-30">VISCOSITY</span>
              45,000 cPs
            </div>
            <div className="border-t border-[#FCFBF8]/10 pt-4">
              <span className="block mb-2 opacity-30">SHELF_LIFE</span>
              Indefinite (Sealed)
            </div>
            <div className="border-t border-[#FCFBF8]/10 pt-4">
              <span className="block mb-2 opacity-30">BATCH_ID</span>
              SC-{Math.floor(Math.random() * 9000) + 1000}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
