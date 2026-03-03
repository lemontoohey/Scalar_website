'use client'

import { useRef, useMemo } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

const DURATION_MS = 3716 // Exactly 3.7 seconds to sync with framer motion UI

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
    f += 0.250 * snoise(p);
    return f; // Reduced math strain
  }

  void main() {
    vec2 center = vUv - 0.5;
    float dist = length(center);

    // Timing
    float heat = smoothstep(0.1, 0.444, uProgress) * (1.0 - smoothstep(0.444, 0.6, uProgress));

    // Expansion
    float currentRadius = 0.25 + (heat * 0.15) + (uProgress * 0.1); 

    // Form
    float mist = fbm(vUv * 4.0 - uTime * 0.15);
    float mask = 1.0 - smoothstep(currentRadius * 0.3, currentRadius, dist);
    float coreMask = 1.0 - smoothstep(0.0, currentRadius * 0.5, dist);

    // Color Setup (Strict opaque output over css)
    vec3 baseColor = vec3(0.8, 0.0, 0.0); // Clinical red
    vec3 burstColor = vec3(1.0, 0.95, 0.8); // Bulb white
    
    vec3 mixedColor = mix(baseColor, burstColor, heat * coreMask * 1.5);
    
    // Normal blending needs firm alpha 
    float visibility = mask * (mist + 0.1);
    float flashVisibility = heat * coreMask * 1.2;
    float totalAlpha = visibility + flashVisibility;

    // Hard clip out outer bounds to prevent geometric box
    if(dist > 0.49 || totalAlpha < 0.01) discard;

    // Render Output
    gl_FragColor = vec4(mixedColor, clamp(totalAlpha, 0.0, 1.0));
  }
`

export default function CureSequenceShader({ onCureComplete, onFlashPeak }: { onCureComplete?: () => void, onFlashPeak?: () => void }) {
  const { viewport } = useThree()
  
  // Independent logic locks (ignore React cycles)
  const timeRef = useRef(0)
  const isCuredRef = useRef(false)
  const isFlashedRef = useRef(false)
  
  // React-three-fiber's viewport can be 0 initially, ensure minimums
  const w = Math.max(viewport.width * 1.5, 10)
  const h = Math.max(viewport.height * 1.5, 10)

  const uniforms = useMemo(() => ({
    uProgress: { value: 0 },
    uTime: { value: 0 },
  }),[])

  useFrame((state, delta) => {
    // Cap wild frame drops caused by tab switching or suspenses
    const safeDelta = Math.min(delta, 0.1);
    timeRef.current += safeDelta;
    
    // Calculate progress based on accumulated safe delta time
    // Note: This replaces the previous logic that might have used state.clock.elapsedTime
    // which could desync if the tab was backgrounded.
    const elapsed = timeRef.current * 1000;
    const rawProgress = Math.min(elapsed / DURATION_MS, 1.0);

    // Easing 
    const phaseSplit = 0.444;
    let eased = 0;
    // Implementation of custom easing logic matching the shader requirements
    if (rawProgress < phaseSplit) {
      // Sine out
      eased = phaseSplit * (1 - Math.cos((rawProgress / phaseSplit) * Math.PI / 2));
    } else {
      // Exponential in
      const t = (rawProgress - phaseSplit) / (1 - phaseSplit);
      eased = phaseSplit + (1 - phaseSplit) * (t <= 0 ? 0 : Math.pow(2, 10 * (t - 1)));
    }

    // Set direct WebGL state
    uniforms.uTime.value = timeRef.current;
    uniforms.uProgress.value = eased;

    // Trigger precise drops
    if (rawProgress >= 0.444 && !isFlashedRef.current) {
      isFlashedRef.current = true;
      if (onFlashPeak) onFlashPeak();
    }
    if (rawProgress >= 1.0 && !isCuredRef.current) {
      isCuredRef.current = true;
      if (onCureComplete) onCureComplete();
    }
    
    // Update mesh material uniforms if needed (though object reference is usually stable)
    // The uniforms object is stable via useMemo, so we update its properties directly.
  })

  return (
    <mesh position={[0, 0, -1]}>
      <planeGeometry args={[w, h, 1, 1]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent={true}
        depthWrite={false}
        blending={THREE.NormalBlending}
      />
    </mesh>
  )
}
