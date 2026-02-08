'use client'

export default function ScanningLine() {
  return (
    <div
      className="fixed h-px z-[99] pointer-events-none"
      style={{
        width: '4px',
        bottom: 'calc(8rem + 2px)',
        left: '-100%',
        opacity: 0.1,
        backgroundColor: '#F5F5DC',
        animation: 'scan 15s linear infinite',
      }}
      aria-hidden
    />
  )
}
