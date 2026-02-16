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
    f += 0.125 * smoothNoise(p * 8.0);
    return f / 2.0;
  }
  
  void main() {
    vec2 center = vec2(0.5, 0.5);
    float dist = length(vUv - center);
    
    /* Vignette fix: softer falloff so mist stays present across whole SCALAR, no visible box */
    float singularity = 1.0 - smoothstep(0.0, 0.88, dist);
    
    /* Increase density: more FBM octaves + higher mass base */
    float tex = fbm(vUv * 2.0 + uTime * uSpeed);
    float mass = singularity * (0.88 + 0.35 * tex);
    mass = clamp(mass, 0.0, 1.0);
    
    /* Internal contrast: dark = black, red = vivid #FF5A5F */
    const vec3 uColorDark = vec3(0.0, 0.0, 0.0);
    const vec3 uColorRed = vec3(1.0, 0.353, 0.373);
    const vec3 uColorPeak = vec3(1.0, 0.988, 0.91);
    
    /* Cure transition: red stays deep until sharp flash to white */
    float ignitionHeat = smoothstep(0.35, 0.5, uProgress) * (1.0 - smoothstep(0.5, 0.55, uProgress));
    vec3 hotCoreColor = mix(uColorRed, uColorPeak, ignitionHeat);
    
    /* Steep mapping: dark parts black, red parts vivid */
    float mappedMass = pow(mass, 0.75);
    vec3 finalColor = mix(uColorDark, hotCoreColor, mappedMass);
    
    /* Boost red saturation (1.8x) for liquid-light feel */
    finalColor.r = min(1.0, finalColor.r * 1.8);
    finalColor.g = finalColor.g * 0.9;
    finalColor.b = finalColor.b * 0.9;
    
    float recession = 1.0 - smoothstep(0.5, 1.0, uProgress);
    float alpha = mass * (0.55 + 0.45 * recession);
    
    /* Extra fade at edges to prevent visible box */
    alpha *= (1.0 - smoothstep(0.75, 0.9, dist));
    
    gl_FragColor = vec4(finalColor, alpha);
  }
`

// Easing Functions
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
    }),
    []
  )

  useFrame((state) => {
    if (startTimeRef.current === null) startTimeRef.current = state.clock.elapsedTime
    const elapsedMs = (state.clock.elapsedTime - startTimeRef.current) * 1000
    const rawProgress = Math.min(elapsedMs / DURATION_MS, 1)

    // Phase A (0–44%): sineOut expansion. Phase B (44–100%): exponentialIn recession.
    const phaseSplit = 0.444 
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