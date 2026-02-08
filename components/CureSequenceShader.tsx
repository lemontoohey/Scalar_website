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
  uniform float uSpeed;
  uniform float uCurlStrength;
  
  varying vec2 vUv;
  varying vec3 vPosition;
  
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
    float n1 = smoothNoise(p + vec2(time * uSpeed, 0.0));
    float n2 = smoothNoise(p + vec2(0.0, time * uSpeed));
    vec2 curl = vec2(n2 - n1, n1 - n2) * uCurlStrength;
    return length(curl);
  }
  
  void main() {
    vec2 uv = vUv;
    vec2 center = vec2(0.5, 0.5);
    float mist = curlNoise(uv * 4.0, uTime);
    mist = pow(mist, 1.2);
    float distFromCenter = length(uv - center);
    float glow = exp(-distFromCenter * (3.0 + uCure * 5.0)) * (1.0 + uCure * 2.0);
    float density = max(mist * (1.0 - uCure), glow * uCure);

    // Palette: Scalar Red (thick), Deep Oxide (thin), Cold Blue (thinnest)
    vec3 scalarRed = vec3(0.659, 0.0, 0.0);
    vec3 deepOxide = vec3(0.122, 0.02, 0.063);
    vec3 coldBlue = vec3(0.0, 0.063, 0.125);
    vec3 darkBase = vec3(0.29, 0.0, 0.0);

    // Thick mist -> Scalar Red; thin/fading -> Deep Oxide; thinnest -> hint of Cold Blue
    float t = smoothstep(0.15, 0.7, density);
    vec3 color = mix(deepOxide, scalarRed, t);
    float thin = 1.0 - smoothstep(0.0, 0.25, density);
    color = mix(color, coldBlue, thin * 0.25);
    color = mix(darkBase, color, min(density * 1.2, 1.0));

    float alpha = max(mist * (1.0 - uCure), glow * uCure);
    gl_FragColor = vec4(color, alpha);
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
      uSpeed: { value: 0.05 },
      uCurlStrength: { value: 0.8 },
    }),
    []
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
