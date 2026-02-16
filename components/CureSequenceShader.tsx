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
  
  /* Simplex Noise */
  vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }
  
  float snoise(vec2 v){
    const vec4 C = vec4(0.211324865405187, 0.366025403784439,
             -0.577350269189626, 0.024390243902439);
    vec2 i  = floor(v + dot(v, C.yy) );
    vec2 x0 = v -   i + dot(i, C.xx);
    vec2 i1;
    i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod(i, 289.0);
    vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
    + i.x + vec3(0.0, i1.x, 1.0 ));
    vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
    m = m*m ;
    return 130.0 * dot(m, vec3( dot(x0,p.x), dot(x12.xy,p.y), dot(x12.zw,p.z) ));
  }
  
  /* Fractal Brownian Motion for rich texture */
  float fbm(vec2 p) {
    float f = 0.0;
    f += 0.500 * snoise(p); p = p * 2.02;
    f += 0.250 * snoise(p); p = p * 2.03;
    f += 0.125 * snoise(p);
    return f;
  }
  
  void main() {
    /* 1. Centering & Soft Mask */
    vec2 center = vUv - 0.5;
    float dist = length(center);
    
    /* Re-enable Expansion: mist grows from 0 to max (0.45) as animation plays.
       Cap at 0.48 to avoid square edges (distance to edge is 0.5). */
    float expandT = smoothstep(0.0, 0.1, uProgress);
    float currentRadius = min(0.45 * expandT, 0.48);
    
    /* Dynamic mask: soft falloff from center, uses expanding radius */
    float radialMask = 1.0 - smoothstep(currentRadius * 0.5, currentRadius, dist);
    
    /* 2. Mist Texture */
    // Make the noise move slowly with time
    float mist = fbm(vUv * 3.0 + uTime * 0.15);
    
    // Combine mask and mist. 
    // We power it to make the center hot and edges soft.
    float density = radialMask * (0.6 + 0.4 * mist);
    density = pow(density, 1.5); // Tighten the cloud
    
    /* 3. Colors */
    // Deep Void Background (Transparent)
    vec3 colorBlack = vec3(0.0);
    
    // Electric Persimmon / Red Boost
    vec3 colorRed = vec3(1.0, 0.2, 0.25); // Boosted Red
    vec3 colorHot = vec3(1.0, 0.95, 0.9); // White hot center
    
    /* 4. Cure Flash Logic - white flash at peak of animation */
    float flash = smoothstep(0.4, 0.5, uProgress) * (1.0 - smoothstep(0.5, 0.6, uProgress));
    
    // Mix Colors: red base, then blend to white at flash peak
    vec3 finalColor = mix(colorBlack, colorRed, density);
    finalColor = mix(finalColor, colorHot, flash * (0.9 + 0.1 * density));
    
    /* 5. Alpha/Opacity Logic */
    float alpha = density;
    
    // Box fix: never exceed 0.48 (distance to edge is 0.5)
    alpha *= (1.0 - smoothstep(currentRadius, 0.48, dist));
    
    // Handle the fade out at end of animation
    float recession = 1.0 - smoothstep(0.6, 1.0, uProgress);
    alpha *= recession;
    
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
  
  /* 
     Make plane slightly larger than viewport so the 'soft fade' 
     happens well within the screen bounds 
  */
  const planeWidth = viewport.width * 1.2
  const planeHeight = viewport.height * 1.2

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
        depthWrite={false} 
        blending={THREE.AdditiveBlending} 
      />
    </mesh>
  )
}