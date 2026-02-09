'use client'

import { useRef, useMemo, useState } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

const DURATION_MS = 3700

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
  uniform float uProgress;
  uniform float uTime;
  uniform float uSpeed;
  
  varying vec2 vUv;
  
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
  
  float fbm(vec2 p) {
    float f = smoothNoise(p);
    f += 0.5 * smoothNoise(p * 2.0);
    f += 0.25 * smoothNoise(p * 4.0);
    return f / 1.75;
  }
  
  void main() {
    vec2 center = vec2(0.5, 0.5);
    float dist = length(vUv - center);
    
    float singularity = 1.0 - smoothstep(0.0, 0.65, dist);
    float tex = fbm(vUv * 1.5 + uTime * uSpeed);
    float mass = singularity * (0.8 + 0.2 * tex);
    
    const vec3 uColorRest = vec3(0.27, 0.0, 0.0);
    const vec3 uColorPeak = vec3(1.0, 0.988, 0.91);
    
    float ignitionHeat = smoothstep(0.0, 0.5, uProgress) * (1.0 - smoothstep(0.5, 1.0, uProgress));
    vec3 hotCoreColor = mix(uColorRest, uColorPeak, ignitionHeat);
    vec3 finalColor = mix(uColorRest, hotCoreColor, mass);
    
    float recession = 1.0 - smoothstep(0.5, 1.0, uProgress);
    float alpha = mass * (0.4 + 0.6 * recession);
    
    gl_FragColor = vec4(finalColor, alpha);
  }
`

// Easing: sineOut (smooth start), exponentialIn (recession)
function easeSineOut(t: number) {
  return 1 - Math.cos((t * Math.PI) / 2)
}
function easeExponentialIn(t: number) {
  return t <= 0 ? 0 : Math.pow(2, 10 * (t - 1))
}

export default function CureSequenceShader({
  onCureComplete,
}: {
  onCureComplete?: () => void
}) {
  const meshRef = useRef<THREE.Mesh>(null)
  const { viewport } = useThree()
  const [progress, setProgress] = useState(0)
  const startTimeRef = useRef<number | null>(null)
  const cureCompleteFired = useRef(false)
  const planeWidth = viewport.width * 0.8
  const planeHeight = viewport.height * 0.8

  const uniforms = useMemo(
    () => ({
      uProgress: { value: 0 },
      uTime: { value: 0 },
      uSpeed: { value: 0.1 },
      uCurlStrength: { value: 2.0 },
    }),
    []
  )

  useFrame((state) => {
    if (startTimeRef.current === null) startTimeRef.current = state.clock.elapsedTime
    const elapsedMs = (state.clock.elapsedTime - startTimeRef.current) * 1000
    const rawProgress = Math.min(elapsedMs / DURATION_MS, 1)

    // Phase A (0–44%): sineOut expansion. Phase B (44–100%): exponentialIn recession.
    const phaseSplit = 0.444 // ~2s of 4.5s
    let eased = 0
    if (rawProgress < phaseSplit) {
      const t = rawProgress / phaseSplit
      eased = phaseSplit * easeSineOut(t)
    } else {
      const t = (rawProgress - phaseSplit) / (1 - phaseSplit)
      eased = phaseSplit + (1 - phaseSplit) * easeExponentialIn(t)
    }
    setProgress(eased)

    if (rawProgress >= 1 && !cureCompleteFired.current) {
      cureCompleteFired.current = true
      onCureComplete?.()
    }

    if (meshRef.current && uniforms) {
      const material = meshRef.current.material as THREE.ShaderMaterial
      if (material && material.uniforms) {
        material.uniforms.uTime.value = state.clock.elapsedTime
        material.uniforms.uProgress.value = eased
        // Standing wave: barely moves (uSpeed 0.1)
        material.uniforms.uSpeed.value = 0.1
        material.uniforms.uCurlStrength.value = 2.0
      }
    }
  })

  return (
    <mesh ref={meshRef} position={[0, 0, -1]}>
      <planeGeometry args={[planeWidth, planeHeight, 64, 64]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent={true}
      />
    </mesh>
  )
}
