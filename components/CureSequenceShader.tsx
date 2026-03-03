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
    return f; 
  }

  void main() {
    vec2 center = vUv - 0.5;
    float dist = length(center);

    // INTERNAL TIMELINE (Clock in Seconds)
    // Red mist swells (0 -> 1.0s), flash heats up (1.0 -> 1.6s), cools down (1.6 -> 2.5s)
    float heat = smoothstep(1.0, 1.6, uTime) * (1.0 - smoothstep(1.6, 2.5, uTime));

    // Dynamic Expanding Radius (Grows infinitely slow, with massive bump at flash)
    float baseRadius = clamp(uTime * 0.08, 0.15, 0.35); 
    float radius = baseRadius + (heat * 0.25);

    // Form the cloud
    float mist = fbm(vUv * 3.5 - uTime * 0.2);
    float mask = 1.0 - smoothstep(radius * 0.2, radius, dist);

    // Colors
    vec3 baseRed = vec3(0.8, 0.02, 0.05); // Standard deep scalar red
    vec3 lightBulb = vec3(1.0, 0.95, 0.7); // High intensity hot-white

    vec3 mixedColor = mix(baseRed, lightBulb, heat * 1.5) * max(mist, 0.15) * 1.5;

    float alpha = mask * (mist + (heat * 1.2));
    
    // Fade in from black on absolute zero start
    alpha *= smoothstep(0.0, 0.8, uTime);

    // Hard Stop invisible geometry borders
    if(dist > 0.49 || alpha < 0.01) discard;

    gl_FragColor = vec4(mixedColor, alpha);
  }
`

export default function CureSequenceShader() {
  const { viewport } = useThree();
  const timeRef = useRef(0);
  
  const w = Math.max(viewport.width * 1.5, 10);
  const h = Math.max(viewport.height * 1.5, 10);

  const uniforms = useMemo(() => ({ uTime: { value: 0 } }),[]);

  useFrame((_, delta) => {
    // Only pass direct internal stopwatch, skipping React reconciliations
    const safeDelta = Math.min(delta, 0.1); 
    timeRef.current += safeDelta;
    uniforms.uTime.value = timeRef.current;
  });

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
  );
}
