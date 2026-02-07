'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { useState, useEffect } from 'react'

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <motion.header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'glass-effect py-4' : 'py-8'
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <nav className="container mx-auto px-6 flex items-center justify-between">
        <Link href="/" className="flex items-center group z-50">
          <motion.div 
            className="relative transition-all duration-300"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <div className="absolute inset-0 bg-scalar-red/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
            <img
              src={`/logo.png?t=${Date.now()}`}
              alt="Scalar Materials Logo"
              className="object-contain relative z-50"
              style={{ 
                backgroundColor: 'transparent', 
                display: 'block',
                width: '300px',
                height: '300px',
                minWidth: '300px',
                minHeight: '300px',
                filter: 'drop-shadow(0 0 40px rgba(168, 0, 0, 1))',
                imageRendering: 'high-quality'
              }}
              onError={(e) => {
                console.error('Logo failed to load:', e);
                (e.target as HTMLImageElement).style.border = '2px solid red';
              }}
            />
          </motion.div>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <Link
            href="#vision"
            className="text-sm font-body tracking-tight hover:text-scalar-red transition-colors"
          >
            Vision
          </Link>
          <Link
            href="#technology"
            className="text-sm font-body tracking-tight hover:text-scalar-red transition-colors"
          >
            Technology
          </Link>
          <Link
            href="#collection"
            className="text-sm font-body tracking-tight hover:text-scalar-red transition-colors"
          >
            The Collection
          </Link>
          <Link
            href="#team"
            className="text-sm font-body tracking-tight hover:text-scalar-red transition-colors"
          >
            Team
          </Link>
        </div>

        <motion.button
          className="px-6 py-2 text-sm font-body tracking-tight border border-white/20 glass-effect rounded-sm hover:border-scalar-red hover:text-scalar-red transition-all"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Request Access
        </motion.button>
      </nav>
    </motion.header>
  )
}
