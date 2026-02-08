'use client'

import { Suspense } from 'react'
import ErrorBoundary from './ErrorBoundary'
import FluidCureShader from './FluidCureShader'

export default function SafeFluidCureShader(props: {
  logoPath: string
  mouse: { x: number; y: number }
  onCureComplete?: () => void
}) {
  return (
    <ErrorBoundary 
      fallback={null}
      onError={(error) => {
        console.error('SafeFluidCureShader ErrorBoundary caught:', error)
      }}
    >
      <Suspense fallback={null}>
        <FluidCureShader {...props} />
      </Suspense>
    </ErrorBoundary>
  )
}
