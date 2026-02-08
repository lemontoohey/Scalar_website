'use client'

import { motion } from 'framer-motion'
import { playThud } from '@/hooks/useSound'

type BifurcationViewProps = {
  onSelect: (category: 'organic' | 'inorganic') => void
  onTransitionStart: () => void
}

export default function BifurcationView({ onSelect, onTransitionStart }: BifurcationViewProps) {
  const handleClick = (category: 'organic' | 'inorganic') => {
    playThud()
    onSelect(category)
    onTransitionStart()
  }

  return (
    <section
      className="fixed inset-0 flex items-center justify-center z-10"
      style={{ backgroundColor: '#000502' }}
    >
      <motion.div
        className="flex items-center justify-center gap-12 md:gap-16"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        <button
          type="button"
          onClick={() => handleClick('organic')}
          className="font-light tracking-[0.4em] lowercase text-white/70 hover:text-white transition-colors"
          style={{ fontFamily: 'var(--font-archivo)', fontWeight: 300 }}
        >
          [organic]
        </button>
        <button
          type="button"
          onClick={() => handleClick('inorganic')}
          className="font-light tracking-[0.4em] lowercase text-white/70 hover:text-white transition-colors"
          style={{ fontFamily: 'var(--font-archivo)', fontWeight: 300 }}
        >
          [inorganic]
        </button>
      </motion.div>
    </section>
  )
}
