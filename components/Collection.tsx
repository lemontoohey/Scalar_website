'use client'

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import GlassCard from './GlassCard'

const collections = [
  {
    category: 'Scalar Fine Art',
    products: [
      { name: 'The Liquid Glass Series', symbol: 'LG' },
      { name: 'The Ghosting System', symbol: 'GS' },
    ],
  },
  {
    category: 'Scalar Optic™',
    products: [
      { name: 'Automotive Refinish', symbol: 'AR' },
      { name: 'The Candy Disruptor', symbol: 'CD' },
    ],
  },
  {
    category: 'Scalar Architectural',
    products: [
      { name: 'Graphene-Lime Systems', symbol: 'GL' },
    ],
  },
]

export default function Collection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section id="collection" className="py-32 bg-scalar-black-dark blueprint-grid">
      <div className="container mx-auto px-6">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl md:text-6xl font-heading font-bold mb-4">
            The Collection
          </h2>
          <p className="text-lg font-body tracking-tight text-white/60">
            Periodic Table of Performance
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {collections.map((collection, categoryIndex) => (
            <motion.div
              key={collection.category}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: categoryIndex * 0.15 }}
            >
              <GlassCard className="h-full">
                <div className="space-y-6">
                  <h3 className="text-2xl font-heading font-bold border-b border-white/10 pb-3">
                    {collection.category}
                  </h3>
                  <div className="space-y-4">
                    {collection.products.map((product, productIndex) => (
                      <motion.div
                        key={product.name}
                        className="flex items-start gap-4"
                        initial={{ opacity: 0, x: -20 }}
                        animate={isInView ? { opacity: 1, x: 0 } : {}}
                        transition={{
                          duration: 0.3,
                          delay: categoryIndex * 0.15 + productIndex * 0.1,
                        }}
                      >
                        <div className="flex-shrink-0 w-16 h-16 glass-effect rounded-sm flex items-center justify-center">
                          <span className="text-lg font-mono font-bold text-scalar-red uppercase">
                            {product.symbol}
                          </span>
                        </div>
                        <div className="flex-1">
                          <h4 className="text-sm font-body tracking-tight text-white/90 mb-1">
                            {product.name}
                          </h4>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
