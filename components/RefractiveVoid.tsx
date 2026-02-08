'use client'

import { useRef, useMemo, useState } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { PerformanceMonitor } from '@react-three/drei'
import * as THREE from 'three'

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

const fragmentShader = `
  uniform float uTime;
  uniform vec2 uMouse;
  uniform vec2 uResolution;
  uniform float uPerformance;
  
  varying vec2 vUv;
  
  // Noise function
  float noise(vec2 p) {
    return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
  }
  
  // Smooth noise
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
  
  // Fractal noise
  float fractalNoise(vec2 p) {
    float value = 0.0;
    float amplitude = 0.5;
    float frequency = 1.0;
    
    for (int i = 0; i < 4; i++) {
      value += amplitude * smoothNoise(p * frequency);
      amplitude *= 0.5;
      frequency *= 2.0;
    }
    
    return value;
  }
  
  // Refraction simulation
  vec3 refractLight(vec2 uv, vec2 center, float intensity) {
    vec2 dir = normalize(uv - center);
    float dist = length(uv - center);
    
    // Refractive index distortion
    float ri = 1.55;
    vec2 refracted = dir * (1.0 / ri) * (1.0 - dist * 0.5);
    
    // Caustics pattern
    float caustic = fractalNoise(refracted * 8.0 + uTime * 0.1);
    caustic = pow(caustic, 2.0);
    
    // Chromatic aberration
    float r = fractalNoise(refracted * 8.0 + vec2(uTime * 0.1, 0.0));
    float g = fractalNoise(refracted * 8.0 + vec2(uTime * 0.1, 0.02));
    float b = fractalNoise(refracted * 8.0 + vec2(uTime * 0.1, 0.04));
    
    vec3 color = vec3(r, g, b) * caustic * intensity;
    
    // Scalar Red and Deep Atmospheric Blue mix
    vec3 scalarRed = vec3(0.658, 0.0, 0.0);
    vec3 deepBlue = vec3(0.0, 0.102, 0.137);
    
    return mix(deepBlue, scalarRed, color.r) * (1.0 - dist * 0.3);
  }
  
  void main() {
    vec2 uv = vUv;
    vec2 center = vec2(0.5, 0.5);
    
    // Mouse influence
    vec2 mouseInfluence = (uMouse - center) * 0.3;
    vec2 distortedCenter = center + mouseInfluence;
    
    // Main refractive light
    vec3 light = refractLight(uv, distortedCenter, 1.5);
    
    // Additional light sources for depth
    vec3 light2 = refractLight(uv, distortedCenter + vec2(0.2, -0.15), 0.8);
    vec3 light3 = refractLight(uv, distortedCenter + vec2(-0.15, 0.2), 0.6);
    
    vec3 finalColor = light + light2 * 0.5 + light3 * 0.3;
    
    // Performance-based quality
    float quality = mix(0.5, 1.0, uPerformance);
    finalColor *= quality;
    
    gl_FragColor = vec4(finalColor, 1.0);
  }
`

export default function RefractiveVoid({ mouse }: { mouse: { x: number; y: number } }) {
  const meshRef = useRef<THREE.Mesh>(null)
  const { viewport, size } = useThree()
  const [performance, setPerformance] = useState(1.0)
  
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      uResolution: { value: new THREE.Vector2(size.width, size.height) },
      uPerformance: { value: 1.0 },
    }),
    [size.width, size.height]
  )

  useFrame((state) => {
    if (meshRef.current) {
      const material = meshRef.current.material as THREE.ShaderMaterial
      material.uniforms.uTime.value = state.clock.elapsedTime
      material.uniforms.uMouse.value.set(mouse.x, mouse.y)
      material.uniforms.uPerformance.value = performance
    }
  })

  return (
    <PerformanceMonitor
      onIncline={() => setPerformance((p) => Math.min(1.0, p + 0.1))}
      onDecline={() => setPerformance((p) => Math.max(0.5, p - 0.1))}
    >
      <mesh ref={meshRef} position={[0, 0, 0]}>
        <planeGeometry args={[viewport.width, viewport.height, 64, 64]} />
        <shaderMaterial
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          uniforms={uniforms}
        />
      </mesh>
    </PerformanceMonitor>
  )
}
