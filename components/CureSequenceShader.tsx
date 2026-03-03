'use client'

import { useRef, useMemo } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

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
  const meshRef = useRef<THREE.Mesh>(null)
  const { viewport } = useThree()
  
  // Independent logic locks (ignore React cycles)
  const flashPeakFired = useRef(false)
  const cureCompleteFired = useRef(false)

  const w = Math.max(viewport.width * 1.5, 10)
  const h = Math.max(viewport.height * 1.5, 10)

  const uniforms = useMemo(() => ({
    uProgress: { value: 0 },
    uTime: { value: 0 },
  }),[])

  useFrame((state) => {
    // 1. Clock always ticks regardless of react state
    const t = state.clock.elapsedTime;
    
    // 2. Safely grab material
    if (meshRef.current && meshRef.current.material) {
      const material = meshRef.current.material as THREE.ShaderMaterial;
      if (material.uniforms) {
        
        // Pass infinite time to shader for endless red swirling mist
        material.uniforms.uTime.value = t;

        // Calculate progress manually: 3.7 second duration
        const duration = 3.716;
        let progress = Math.min(t / duration, 1.0);
        material.uniforms.uProgress.value = progress;

        // Flash peaks at progress 0.444 (approx 1.65 seconds)
        if (progress >= 0.444 && !flashPeakFired.current) {
          flashPeakFired.current = true;
          if (onFlashPeak) onFlashPeak();
        }

        // Finish callback at 3.7 seconds
        if (progress >= 1.0 && !cureCompleteFired.current) {
          cureCompleteFired.current = true;
          if (onCureComplete) onCureComplete();
        }
      }
    }
  })

  return (
    <mesh ref={meshRef} position={[0, 0, -1]}>
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
