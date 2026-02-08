'use client'

import { motion } from 'framer-motion'

export default function DiagnosticLine() {
  return (
    <motion.div
      initial={{ top: '-5%' }}
      animate={{ top: '105%' }}
      transition={{
        duration: 20,
        repeat: Infinity,
        ease: 'linear',
      }}
      className="fixed left-0 w-full h-[1px] bg-[#FCFBF8] opacity-[0.03] pointer-events-none z-[100]"
      style={{ boxShadow: '0 0 10px 1px rgba(252, 251, 248, 0.1)' }}
    />
  )
}
