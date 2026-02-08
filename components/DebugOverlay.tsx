'use client'

import { useState, useEffect } from 'react'

export default function DebugOverlay() {
  const [logs, setLogs] = useState<string[]>([])
  const [showDebug, setShowDebug] = useState(false)

  useEffect(() => {
    // Capture console logs
    const originalLog = console.log
    const originalError = console.error
    const originalWarn = console.warn

    const addLog = (type: string, ...args: any[]) => {
      const message = args.map(arg => 
        typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
      ).join(' ')
      setLogs(prev => [...prev.slice(-49), `[${type}] ${message}`])
    }

    console.log = (...args) => {
      originalLog(...args)
      addLog('LOG', ...args)
    }

    console.error = (...args) => {
      originalError(...args)
      addLog('ERROR', ...args)
    }

    console.warn = (...args) => {
      originalWarn(...args)
      addLog('WARN', ...args)
    }

    // Check WebGL support
    try {
      const canvas = document.createElement('canvas')
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
      if (gl) {
        addLog('INFO', 'WebGL supported')
      } else {
        addLog('WARN', 'WebGL not supported')
      }
    } catch (e) {
      addLog('ERROR', 'WebGL check failed:', e)
    }

    // Check if logo.png exists
    const img = new Image()
    img.onload = () => addLog('INFO', 'Logo image found at /logo.png')
    img.onerror = () => addLog('ERROR', 'Logo image NOT found at /logo.png')
    img.src = '/logo.png'

    return () => {
      console.log = originalLog
      console.error = originalError
      console.warn = originalWarn
    }
  }, [])

  // Toggle with 'D' key
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'd' || e.key === 'D') {
        setShowDebug(prev => !prev)
      }
    }
    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [])

  if (!showDebug) {
    return (
      <div className="fixed bottom-4 left-4 z-[10000] bg-black/50 text-white text-xs p-2 rounded">
        Press 'D' to toggle debug overlay
      </div>
    )
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 z-[10000] bg-black/90 text-white text-xs p-4 rounded border border-white/20 max-h-[50vh] overflow-auto">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-bold">Debug Console (Press 'D' to toggle)</h3>
        <button 
          onClick={() => setLogs([])}
          className="px-2 py-1 bg-red-600 rounded text-xs"
        >
          Clear
        </button>
      </div>
      <div className="font-mono text-[10px] space-y-1">
        {logs.length === 0 ? (
          <div className="text-white/50">No logs yet...</div>
        ) : (
          logs.map((log, i) => (
            <div key={i} className={
              log.includes('[ERROR]') ? 'text-red-400' :
              log.includes('[WARN]') ? 'text-yellow-400' :
              'text-white/80'
            }>
              {log}
            </div>
          ))
        )}
      </div>
    </div>
  )
}
