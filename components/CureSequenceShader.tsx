'use client'

import { useRef, useMemo, useState, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

const vertexShader = `
  varying vec2 vUv;
  varying vec3 vPosition;
  
  void main() {
    vUv = uv;
    vPosition = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

const fragmentShader = `
  uniform float uCure;
  uniform float uTime;
  uniform vec2 uMouse;
  uniform vec2 uResolution;
  
  varying vec2 vUv;
  varying vec3 vPosition;
  
  // Curl noise for entropic mist
  float noise(vec2 p) {
    return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
  }
  
  float smoothNoise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    
    float a = noise(i);
    float b = noise(i + vec2(1.0, 0.0));
    float c = noise(i + vec2(0.0, 1.0));
    float d = noise(i + vec2(1.0, 1.0));
    
    return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
  }
  
  float curlNoise(vec2 p, float time) {
    float n1 = smoothNoise(p + vec2(time * 0.1, 0.0));
    float n2 = smoothNoise(p + vec2(0.0, time * 0.1));
    vec2 curl = vec2(n2 - n1, n1 - n2) * 0.5;
    return length(curl);
  }
  
  void main() {
    vec2 uv = vUv;
    vec2 center = vec2(0.5, 0.5);
    
    // Curl noise mist
    float mist = curlNoise(uv * 8.0, uTime);
    mist = pow(mist, 1.5);
    
    // Distance from center (where text is)
    float distFromCenter = length(uv - center);
    
    // Cure: transition from mist to concentrated glow
    float glow = exp(-distFromCenter * (3.0 + uCure * 5.0)) * (1.0 + uCure * 2.0);
    
    // Mix mist and cured glow
    vec3 color = mix(
      vec3(0.658, 0.0, 0.0) * mist * 0.5, // Entropic red mist
      vec3(0.658, 0.0, 0.0) * glow, // Concentrated Scalar Red glow
      uCure
    );
    
    gl_FragColor = vec4(color, max(mist * (1.0 - uCure), glow * uCure));
  }
`

export default function CureSequenceShader({ 
  onCureComplete 
}: { 
  onCureComplete?: () => void
}) {
  const meshRef = useRef<THREE.Mesh>(null)
  const { viewport, size } = useThree()
  const [cure, setCure] = useState(0)
  const [cureStarted, setCureStarted] = useState(false)
  
  const uniforms = useMemo(
    () => ({
      uCure: { value: 0 },
      uTime: { value: 0 },
      uMouse: { value: [0.5, 0.5] },
      uResolution: { value: [size.width, size.height] },
    }),
    [size.width, size.height]
  )
  
  // Start cure sequence on mount
  useEffect(() => {
    if (!cureStarted) {
      setCureStarted(true)
      
      setTimeout(() => {
        const startTime = Date.now()
        const duration = 5000 // 5 seconds
        
        const animate = () => {
          const elapsed = Date.now() - startTime
          const progress = Math.min(elapsed / duration, 1)
          
          // Easing: ease-out cubic
          const eased = 1 - Math.pow(1 - progress, 3)
          setCure(eased)
          
          if (progress < 1) {
            requestAnimationFrame(animate)
          } else {
            onCureComplete?.()
          }
        }
        
        requestAnimationFrame(animate)
      }, 100)
    }
  }, [cureStarted, onCureComplete])

  useFrame((state) => {
    if (meshRef.current && uniforms) {
      const material = meshRef.current.material as THREE.ShaderMaterial
      if (material && material.uniforms) {
        material.uniforms.uTime.value = state.clock.elapsedTime
        material.uniforms.uCure.value = cure
      }
    }
  })

  return (
    <mesh ref={meshRef} position={[0, 0, -1]}>
      <planeGeometry args={[viewport.width, viewport.height, 64, 64]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent={true}
      />
    </mesh>
  )
}
