'use client'

import { useRef, useMemo } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

const DURATION_MS = 3716

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
    vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
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

    // 1. THE HEAT CURVE (Flash peaks at 0.444)
    float heat = smoothstep(0.1, 0.444, uProgress) * (1.0 - smoothstep(0.444, 0.6, uProgress));

    // 2. EXPANDING RADIUS
    float baseRadius = mix(0.15, 0.35, uProgress); // Base mist grows over time and stays big
    float currentRadius = baseRadius + (heat * 0.2); // Expands massively during flash

    // 3. MIST & MASKS
    float mist = fbm(vUv * 3.5 - uTime * 0.2);
    float mask = 1.0 - smoothstep(currentRadius * 0.3, currentRadius, dist);
    float coreMask = 1.0 - smoothstep(0.0, currentRadius * 0.5, dist);

    // 4. COLORS
    vec3 colorRed = vec3(0.9, 0.05, 0.1);
    vec3 colorBulb = vec3(1.0, 0.95, 0.8); // Warm lightbulb

    vec3 baseColor = colorRed * max(mist, 0.2) * 1.5;
    vec3 finalColor = mix(baseColor, colorBulb, clamp(heat * coreMask * 1.8, 0.0, 1.0));

    // 5. ALPHA
    float alpha = (mask * max(mist, 0.2)) + (heat * coreMask * 0.8);
    alpha *= 1.5; // Overall opacity boost
    // No fade-in (working 89d64af had visible mist from frame 1)

    // Safety bound to prevent hard box edges
    if (dist > 0.48) alpha = 0.0;

    gl_FragColor = vec4(finalColor, clamp(alpha, 0.0, 1.0));
  }
`

function easeSineOut(t: number) {
  return 1 - Math.cos((t * Math.PI) / 2)
}
function easeExponentialIn(t: number) {
  return t <= 0 ? 0 : Math.pow(2, 10 * (t - 1))
}

export default function CureSequenceShader({ onCureComplete }: { onCureComplete?: () => void }) {
  const { viewport } = useThree()
  const cureCompleteFired = useRef(false)
  const startTimeRef = useRef<number | null>(null)

  // Avoid 0-size plane when viewport not yet measured (e.g. first frame)
  const planeWidth = Math.max(viewport.width * 1.5, 10)
  const planeHeight = Math.max(viewport.height * 1.5, 10)

  const uniforms = useMemo(
    () => ({
      uProgress: { value: 0 },
      uTime: { value: 0 },
    }),
    []
  )

  useFrame((state) => {
    // Start from 0 when shader mounts (matches working 89d64af)
    if (startTimeRef.current === null) startTimeRef.current = state.clock.elapsedTime
    const elapsed = state.clock.elapsedTime - startTimeRef.current
    uniforms.uTime.value = state.clock.elapsedTime

    const elapsedMs = elapsed * 1000
    const rawProgress = Math.min(elapsedMs / DURATION_MS, 1.0)

    const phaseSplit = 0.444
    let eased = 0
    if (rawProgress < phaseSplit) {
      eased = phaseSplit * easeSineOut(rawProgress / phaseSplit)
    } else {
      eased =
        phaseSplit +
        (1 - phaseSplit) * easeExponentialIn((rawProgress - phaseSplit) / (1 - phaseSplit))
    }

    uniforms.uProgress.value = eased

    if (rawProgress >= 1.0 && !cureCompleteFired.current) {
      cureCompleteFired.current = true
      if (onCureComplete) onCureComplete()
    }
  })

  return (
    <mesh position={[0, 0, -1]}>
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
