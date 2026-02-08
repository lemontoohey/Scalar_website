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
      animate={{ opacity: 1 }}
      transition={{ duration: 1, delay: 1, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="container mx-auto px-6 pb-8">
        <div className="border-t border-white/10 h-px mb-6" style={{ opacity: 0.1 }} />
        <div className="flex items-center justify-center gap-6 flex-wrap">
          {navItems.map((item, index) => (
            <motion.div
              key={item.href}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: 0.8, 
                delay: 1 + index * 0.1, 
                ease: [0.16, 1, 0.3, 1] 
              }}
            >
              <Link
                href={item.href}
                className="text-xs font-light tracking-[0.2em] lowercase text-white/60 hover:text-white transition-colors"
                style={{
                  fontFamily: 'var(--font-archivo)',
                  fontWeight: 300
                }}
              >
                {index > 0 && <span className="mx-2 text-white/20">|</span>}
                {item.label}
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.nav>
  )
}
