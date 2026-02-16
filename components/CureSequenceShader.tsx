'use client'

import { useRef, useMemo, useState } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

const DURATION_MS = 3700

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

const fragmentShader = `
  uniform float uProgress;
  uniform float uTime;
  
  varying vec2 vUv;

  // --- SIMPLEX NOISE (The "Silky" Math) ---
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

  // --- FBM (The "Cloud" Texture) ---
  float fbm(vec2 p) {
    float f = 0.0;
    f += 0.500 * snoise(p); p *= 2.02;
    f += 0.250 * snoise(p); p *= 2.03;
    f += 0.125 * snoise(p);
    return f;
  }

  void main() {
    // 1. Center Coordinates & Distance
    vec2 center = vUv - 0.5;
    float dist = length(center);

    // 2. TIGHTEN THE LIGHT (The Size Fix)
    // We restrict the mist to a tighter circle (0.35) instead of the whole plane (0.5).
    // This prevents the "Too Big" issue.
    float containerMask = 1.0 - smoothstep(0.2, 0.35, dist);

    // 3. ANIMATION LOGIC (The Clunk Fix)
    // Use Simplex Noise + Time for organic flow
    float mist = fbm(vUv * 4.0 + uTime * 0.2); 
    
    // Growth Animation:
    // uProgress 0.0 -> 0.4: Grow from nothing.
    // uProgress 0.4 -> 1.0: Fade out.
    float growth = smoothstep(0.0, 0.3, uProgress) * (1.0 - smoothstep(0.5, 1.0, uProgress));
    
    // Combine Logic
    float density = containerMask * mist * growth;
    
    // Sharpen the cloud edges
    density = pow(density, 1.5); 
    // Boost the core brightness
    density *= 2.0;

    // 4. COLORS
    vec3 colorBlack = vec3(0.0);
    vec3 colorRed = vec3(1.0, 0.25, 0.3); // Deep Red/Pink
    vec3 colorWhite = vec3(1.0, 0.95, 0.9); // White Hot

    // 5. FLASH LOGIC (The Cure)
    // Sharp flash at uProgress ~0.45
    float flash = smoothstep(0.42, 0.45, uProgress) * (1.0 - smoothstep(0.45, 0.55, uProgress));
    
    // Mix Colors
    vec3 finalColor = mix(colorBlack, colorRed, density);
    finalColor = mix(finalColor, colorWhite, flash * density); // Add flash on top

    // 6. FINAL ALPHA
    float alpha = density;
    
    // Hard clip at edges to ensure NO BOX ever appears
    if (dist > 0.45) alpha = 0.0;

    gl_FragColor = vec4(finalColor, alpha);
  }
`

// Smooth Easing Functions
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
  
  // Keep the plane large to avoid box edges, but we control size in shader
  const planeWidth = viewport.width * 1.5
  const planeHeight = viewport.height * 1.5

  const uniforms = useMemo(
    () => ({
      uProgress: { value: 0 },
      uTime: { value: 0 },
    }),
    []
  )

  useFrame((state) => {
    if (startTimeRef.current === null) startTimeRef.current = state.clock.elapsedTime
    const elapsedMs = (state.clock.elapsedTime - startTimeRef.current) * 1000
    const rawProgress = Math.min(elapsedMs / DURATION_MS, 1)

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
