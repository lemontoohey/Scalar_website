'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'

export default function Hallmark() {
  return (
    <Link href="/" className="fixed top-8 left-8 z-[100] group">
      <motion.div
        className="relative"
        style={{
          width: '10vh',
          height: '10vh',
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
