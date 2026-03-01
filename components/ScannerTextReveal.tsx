'use client'

import { useRef, useEffect, useState } from 'react'
import { motion, useInView, useMotionValue, useTransform, animate } from 'framer-motion'

const DURATION_S = 1.2
const SCANNER_COLOR = '#A80000'

export default function ScannerTextReveal({
  children,
  className = '',
}: {
  children: React.ReactNode
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-10% 0px -10% 0px', amount: 0.2 })
  const [hasAnimated, setHasAnimated] = useState(false)
  const progress = useMotionValue(0)

  useEffect(() => {
    if (!isInView || hasAnimated) return
    setHasAnimated(true)
    const controls = animate(0, 1, {
      duration: DURATION_S,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => progress.set(v),
    })
    return () => controls.stop()
  }, [isInView, hasAnimated, progress])

  const maskImage = useTransform(
    progress,
    (v) =>
      `linear-gradient(to bottom, black 0%, black ${v * 100}%, transparent ${v * 100}%)`
  )
  const scannerTop = useTransform(progress, (v) => `${v * 100}%`)

  return (
    <div ref={ref} className={`relative ${className}`}>
      <motion.div
        style={{
          maskImage,
          WebkitMaskImage: maskImage,
          maskSize: '100% 100%',
          maskRepeat: 'no-repeat',
          maskPosition: '0 0',
        }}
      >
        {children}
      </motion.div>
      {/* Scanning laser line - 1px bright red, travels in sync */}
      <motion.div
        className="absolute left-0 right-0 h-[1px] pointer-events-none z-10"
        style={{
          top: scannerTop,
          backgroundColor: SCANNER_COLOR,
          boxShadow: `0 0 8px ${SCANNER_COLOR}, 0 0 16px ${SCANNER_COLOR}40`,
        }}
      />
    </div>
  )
}
