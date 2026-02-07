'use client'

import { motion } from 'framer-motion'

const partners = ['Oxerra', 'Paintback', 'Siwochem']

export default function Footer() {
  return (
    <footer className="py-16 bg-scalar-black-dark border-t border-white/10">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-3 gap-12 mb-12">
          {/* Partners */}
          <div>
            <h3 className="text-sm font-body tracking-wider text-white/40 uppercase mb-6">
              Partners
            </h3>
            <ul className="space-y-2">
              {partners.map((partner) => (
                <li
                  key={partner}
                  className="text-sm font-body tracking-tight text-white/60"
                >
                  {partner}
                </li>
              ))}
            </ul>
          </div>

          {/* Quote */}
          <div className="md:col-span-2">
            <motion.blockquote
              className="text-2xl md:text-3xl font-heading font-bold text-white/80 italic"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              "From the canvas to the hyper-car."
            </motion.blockquote>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-white/10">
          <p className="text-xs font-body tracking-wider text-white/40 text-center uppercase">
            © {new Date().getFullYear()} Scalar Materials. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
