'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { playLensClick } from '@/hooks/useSound'

type HallmarkProps = {
  onReset?: () => void
}

export default function Hallmark({ onReset }: HallmarkProps) {
  const handleClick = (e: React.MouseEvent) => {
    if (onReset) {
      e.preventDefault()
      onReset()
    }
  }

  const handleMouseEnter = () => {
    if (onReset) playLensClick()
  }

  return (
    <Link
      href="/"
      className="fixed top-8 left-8 z-[100] group cursor-pointer flex justify-center items-center min-w-[44px] min-h-[44px]"
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      aria-label="Scalar Materials – reset to home"
    >
      {/* Optical Alignment Offset: 1.5mm left for Scalar signature asymmetry */}
      <motion.div
        className="relative flex justify-center items-center"
        style={{
          width: '10vh',
          height: '10vh',
          transform: 'translateX(-1.5mm)',
        }}
        whileHover={{ scale: 1.05 }}
        transition={{ type: 'spring', stiffness: 400, damping: 17 }}
      >
        <img
          src="/logo.png"
          alt="Scalar Materials Hallmark"
          className="w-full h-full object-contain"
          style={{
            filter: 'drop-shadow(0 0 10px rgba(168, 0, 0, 0.5))',
          }}
        />
        <div className="absolute inset-0 bg-scalar-red/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
      </motion.div>
    </Link>
  )
}
