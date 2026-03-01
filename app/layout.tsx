import type { Metadata } from 'next'
import { Archivo, Archivo_Narrow } from 'next/font/google'
import SmoothScroll from '@/components/SmoothScroll'
import ScrollPhysicsProvider from '@/components/ScrollPhysicsProvider'
import ClientErrorBoundary from '@/components/ClientErrorBoundary'
import DiagnosticLine from '@/components/DiagnosticLine'
import ThermalCursor from '@/components/ThermalCursor'
import './globals.css'

const archivo = Archivo({
  subsets: ['latin'],
  weight: ['300'],
  variable: '--font-archivo',
  display: 'swap',
})

const archivoNarrow = Archivo_Narrow({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-archivo-narrow',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Scalar Materials | Architecture of Light',
  description: 'A materials science house engineering the highest-performance coatings in Australia.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${archivo.variable} ${archivoNarrow.variable} bg-black text-white`}>
        <ThermalCursor />
        <DiagnosticLine />
        <ClientErrorBoundary>
          <SmoothScroll>
            <ScrollPhysicsProvider>
              {children}
            </ScrollPhysicsProvider>
          </SmoothScroll>
        </ClientErrorBoundary>
      </body>
    </html>
  )
}
