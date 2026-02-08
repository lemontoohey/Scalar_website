'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

export default function BottomNav({ visible }: { visible: boolean }) {
  const navItems = [
    { href: '#home', label: 'home' },
    { href: '#innovation', label: 'innovation' },
    { href: '#collections', label: 'collections' },
    { href: '#procurement', label: 'procurement' },
    { href: '#team', label: 'team' },
  ]

  return (
    <motion.nav
      className="fixed bottom-0 left-0 right-0 z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: visible ? 1 : 0 }}
      transition={{ duration: 1, delay: 2, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="container mx-auto px-6 pb-8">
        <div className="border-t border-white/20 h-px mb-6" />
        <div className="flex items-center justify-center gap-8 flex-wrap">
          {navItems.map((item, index) => (
            <motion.div
              key={item.href}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: visible ? 1 : 0, y: visible ? 0 : 10 }}
              transition={{ 
                duration: 0.8, 
                delay: 2 + index * 0.1, 
                ease: [0.16, 1, 0.3, 1] 
              }}
            >
              <Link
                href={item.href}
                className="text-xs font-light tracking-[0.1em] lowercase text-white/60 hover:text-white transition-colors"
                style={{
                  fontFamily: 'var(--font-archivo)',
                  fontWeight: 300
                }}
              >
                {item.label}
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.nav>
  )
}
