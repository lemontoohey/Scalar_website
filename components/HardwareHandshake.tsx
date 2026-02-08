'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

export default function HardwareHandshake() {
  const [hardwareInfo, setHardwareInfo] = useState<string | null>(null)

  useEffect(() => {
    const detectHardware = async () => {
      try {
        // Detect GPU via WebGL
        const canvas = document.createElement('canvas')
        const gl = (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')) as WebGLRenderingContext | null
        
        if (!gl) {
          setHardwareInfo('WEBGL_UNAVAILABLE')
          return
        }

        const debugInfo = gl.getExtension('WEBGL_debug_renderer_info')
        const gpuVendor = debugInfo ? gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL) : 'Unknown'
        const gpuRenderer = debugInfo ? gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) : 'Unknown'
        
        // Detect refresh rate
        let refreshRate = 60 // Default
        let frameCount = 0
        let lastTime = performance.now()
        
        const measureRefreshRate = () => {
          frameCount++
          const now = performance.now()
          if (now - lastTime >= 1000) {
            refreshRate = frameCount
            frameCount = 0
            lastTime = now
            cancelAnimationFrame(rafId)
            
            // Format GPU name
            let gpuName = gpuRenderer
            if (gpuName.includes('NVIDIA')) {
              const match = gpuName.match(/NVIDIA\s+(.+?)(?:\s|$)/)
              gpuName = match ? `NVIDIA ${match[1]}` : 'NVIDIA GPU'
            } else if (gpuName.includes('AMD')) {
              const match = gpuName.match(/AMD\s+(.+?)(?:\s|$)/)
              gpuName = match ? `AMD ${match[1]}` : 'AMD GPU'
            } else if (gpuName.includes('Apple')) {
              const match = gpuName.match(/Apple\s+(.+?)(?:\s|$)/)
              gpuName = match ? `Apple ${match[1]}` : 'Apple GPU'
            }
            
            // Determine API
            const api = gpuVendor.includes('Apple') ? 'METAL_API' : 
                       gpuVendor.includes('NVIDIA') || gpuVendor.includes('AMD') ? 'VULKAN_API' : 
                       'OPENGL_API'
            
            setHardwareInfo(`${api} // ${gpuName} // ${refreshRate}Hz`)
          } else {
            rafId = requestAnimationFrame(measureRefreshRate)
          }
        }
        
        let rafId = requestAnimationFrame(measureRefreshRate)
      } catch (error) {
        console.error('Hardware detection failed:', error)
        setHardwareInfo('DETECTION_FAILED')
      }
    }

    detectHardware()
  }, [])

  return (
    <motion.div
      className="fixed bottom-8 left-8 z-[100]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 0.2 }}
      transition={{ duration: 1, delay: 1 }}
    >
      <div
        className="text-[8px] font-light tracking-[0.1em] text-white/20 uppercase"
        style={{
          fontFamily: 'var(--font-archivo)',
          fontWeight: 300,
        }}
      >
        {hardwareInfo || 'CALIBRATING_GPU_OUTPUT...'}
      </div>
    </motion.div>
  )
}
