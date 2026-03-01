'use client'

import { useRef, useMemo, useState } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

const DURATION_MS = 3716 // ~1650ms to 0.444 peak (1650/0.444)

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

  vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }
  float snoise(vec2 v){
    const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
    vec2 i  = floor(v + dot(v, C.yy) );
    vec2 x0 = v -   i + dot(i, C.xx);
    vec2 i1;
    i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod(i, 289.0);
    vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 )) + i.x + vec3(0.0, i1.x, 1.0 ));
    vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
    m = m*m ;
    return 130.0 * dot(m, vec3( dot(x0,p.x), dot(x12.xy,p.y), dot(x12.zw,p.z) ));
  }

  float fbm(vec2 p) {
    float f = 0.0;
    f += 0.500 * snoise(p); p *= 2.02;
    f += 0.250 * snoise(p); p *= 2.03;
    f += 0.125 * snoise(p);
    return f;
  }

  void main() {
    vec2 center = vUv - 0.5;
    float dist = length(center);

    // 1. THE HEAT CURVE (Peaks at 0.444 / 1650ms)
    float heatUp = smoothstep(0.15, 0.444, uProgress);
    float coolDown = 1.0 - smoothstep(0.444, 0.65, uProgress);
    float peakIntensity = heatUp * coolDown;
    peakIntensity = pow(peakIntensity, 0.8); // Punchy flash

    // 2. DYNAMIC EXPANDING RADIUS
    // Base size is 0.2. At peak flash, it rapidly inflates to 0.5, then shrinks back.
    float currentRadius = 0.2 + (peakIntensity * 0.3) + (uProgress * 0.1);

    // 3. MASK & MIST
    float mask = 1.0 - smoothstep(currentRadius * 0.2, currentRadius, dist);
    float mist = fbm(vUv * 3.5 - uTime * 0.15); // Negative time makes it flow upward
    float density = mask * max(mist, 0.0);
    density = pow(density, 1.2) * 3.0; // Thicken the smoke

    // 4. COLORS (Deep Red to Lightbulb)
    vec3 colorRed = vec3(0.8, 0.02, 0.05); // Deep pure red
    vec3 colorBulb = vec3(1.0, 0.95, 0.7); // Bright yellowish-white

    // Overpower the red completely at the peak
    vec3 finalColor = mix(colorRed, colorBulb, clamp(peakIntensity * 1.8, 0.0, 1.0));

    // 5. OPACITY BOOST
    // Additive blending washes out whites if alpha is low.
    // We force alpha to 1.0 at the peak so it visually "blinds" the screen.
    float baseAlpha = density;
    baseAlpha += peakIntensity * mask * 0.8;

    // Fade in at start, fade out at end
    float intro = smoothstep(0.0, 0.1, uProgress);
    float outro = 1.0 - smoothstep(0.7, 1.0, uProgress);
    float alpha = baseAlpha * intro * outro;

    if (dist > 0.48) alpha = 0.0; // Safety boundary

    // Multiply color by alpha for clean Additive Blending
    gl_FragColor = vec4(finalColor * alpha, alpha);
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
  
  // Large plane to keep edges far away
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
