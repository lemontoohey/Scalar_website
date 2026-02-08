'use client'

import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

type RefractiveTransitionProps = {
  trigger: boolean
  onPeak?: () => void
}

export default function RefractiveTransition({ trigger, onPeak }: RefractiveTransitionProps) {
  const onPeakRef = useRef(onPeak)
  onPeakRef.current = onPeak

  useEffect(() => {
    if (!trigger) return
    const id = setTimeout(() => {
      onPeakRef.current?.()
    }, 500)
    return () => clearTimeout(id)
  }, [trigger])

  if (!trigger) return null

  return (
    <motion.div
      className="fixed inset-0 z-[150] pointer-events-none"
      initial={{ opacity: 0 }}
      animate={{
        opacity: [0, 1, 0],
      }}
      transition={{
        duration: 1,
        times: [0, 0.25, 1],
      }}
      style={{
        backgroundColor: 'rgba(0,5,2,0.2)',
      }}
      aria-hidden
    >
      <motion.div
        className="absolute inset-0"
        initial={{ backdropFilter: 'blur(0px)', WebkitBackdropFilter: 'blur(0px)' }}
        animate={{
          backdropFilter: ['blur(0px)', 'blur(40px)', 'blur(0px)'],
          WebkitBackdropFilter: ['blur(0px)', 'blur(40px)', 'blur(0px)'],
        }}
        transition={{
          duration: 1,
          times: [0, 0.25, 1],
        }}
      />
    </motion.div>
  )
}
