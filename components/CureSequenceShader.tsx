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
  uniform float uSpeed;
  
  varying vec2 vUv;
  
  /* --- Noise Functions --- */
  float hash(vec2 p) { return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453); }
  
  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));
    return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
  }
  
  float fbm(vec2 p) {
    float f = 0.0;
    f += 0.500 * noise(p); p *= 2.02;
    f += 0.250 * noise(p); p *= 2.03;
    f += 0.125 * noise(p);
    return f;
  }
  
  void main() {
    /* 1. Center Coordinates */
    vec2 center = vUv - 0.5;
    float dist = length(center);
    
    /* 2. THE BOX KILLER (Safety Mask)
       The geometry edge is at 0.5. We MUST fade to 0.0 before we hit 0.5.
       We fade from 0.35 to 0.48. Anything past 0.48 is deleted.
    */
    float edgeMask = 1.0 - smoothstep(0.35, 0.48, dist);

    /* 3. Liquid Animation
       We animate the noise coordinates to make it flow.
    */
    float flow = fbm(vUv * 3.0 + uTime * uSpeed);
    
    /* 4. Expansion Logic
       We combine the edgeMask (static safety) with the animation (growing).
       uProgress 0 -> 0.44 expands the cloud.
       uProgress 0.44 -> 1.0 fades it out.
    */
    // Create a growing "core" based on progress
    float coreSize = smoothstep(0.0, 0.2, uProgress); 
    float density = edgeMask * (0.6 + 0.4 * flow) * coreSize;
    
    // Sharpen the cloud
    density = pow(density, 1.2); 

    /* 5. Colors */
    vec3 colorBlack = vec3(0.0);
    vec3 colorRed = vec3(1.0, 0.35, 0.37); // Vivid Red/Pink
    vec3 colorWhite = vec3(1.0, 0.98, 0.92);

    /* 6. Flash Logic (The Cure) */
    float flash = smoothstep(0.4, 0.5, uProgress) * (1.0 - smoothstep(0.5, 0.6, uProgress));
    
    // Mix Red based on density
    vec3 finalColor = mix(colorBlack, colorRed, density);
    
    // Add White Flash
    finalColor += colorWhite * flash * density;

    /* 7. Alpha Logic */
    // Apply recession at end of animation
    float recession = 1.0 - smoothstep(0.5, 1.0, uProgress);
    float alpha = density * (0.6 + 0.4 * recession);
    
    // Final safety clip to ensure 0.0 at edges
    alpha *= edgeMask;

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
     GEOMETRY FIX: 
     Make the plane larger than the screen (1.5x).
     This pushes the square edges far away from the text.
  */
  const planeWidth = viewport.width * 1.5
  const planeHeight = viewport.height * 1.5

  const uniforms = useMemo(
    () => ({
      uProgress: { value: 0 },
      uTime: { value: 0 },
      uSpeed: { value: 0.15 }, // Slightly faster liquid movement
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
