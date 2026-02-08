'use client'

import { useRef, useMemo, useState, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { useTexture } from '@react-three/drei'
import * as THREE from 'three'

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
  uniform sampler2D uLogo;
  uniform float uSharpness;
  uniform float uTime;
  uniform vec2 uMouse;
  uniform vec2 uResolution;
  uniform float uBloomIntensity;
  
  varying vec2 vUv;
  varying vec3 vPosition;
  
  // Noise function
  float noise(vec2 p) {
    return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
  }
  
  // Smooth noise
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
  
  // Fractal noise for entropic mist
  float fractalNoise(vec2 p) {
    float value = 0.0;
    float amplitude = 0.5;
    float frequency = 1.0;
    
    for (int i = 0; i < 4; i++) {
      value += amplitude * smoothNoise(p * frequency);
      amplitude *= 0.5;
      frequency *= 2.0;
    }
    
    return value;
  }
  
  // Gaussian blur simulation
  vec3 gaussianBlur(sampler2D tex, vec2 uv, float blurAmount) {
    vec3 color = vec3(0.0);
    float total = 0.0;
    float samples = 9.0;
    
    for (float x = -1.0; x <= 1.0; x += 1.0) {
      for (float y = -1.0; y <= 1.0; y += 1.0) {
        vec2 offset = vec2(x, y) * blurAmount / uResolution;
        color += texture2D(tex, uv + offset).rgb;
        total += 1.0;
      }
    }
    
    return color / total;
  }
  
  // Fluid displacement simulation
  vec2 fluidDisplacement(vec2 uv, vec2 mouse, float time) {
    vec2 center = vec2(0.5, 0.5);
    vec2 mouseInfluence = (mouse - center) * 0.3;
    vec2 dir = normalize(uv - center - mouseInfluence);
    float dist = length(uv - center - mouseInfluence);
    
    // Refractive index 1.55 distortion
    float ri = 1.55;
    vec2 refracted = dir * (1.0 / ri) * (1.0 - dist * 0.5);
    
    // Ripple effect
    float ripple = sin(dist * 20.0 - time * 2.0) * 0.01;
    refracted += ripple * normalize(uv - center - mouseInfluence);
    
    return refracted;
  }
  
  // Chromatic aberration
  vec3 chromaticAberration(sampler2D tex, vec2 uv, vec2 dir, float amount) {
    float r = texture2D(tex, uv + dir * amount * 0.002).r;
    float g = texture2D(tex, uv).g;
    float b = texture2D(tex, uv - dir * amount * 0.002).b;
    return vec3(r, g, b);
  }
  
  void main() {
    vec2 uv = vUv;
    vec2 center = vec2(0.5, 0.5);
    
    // Fluid displacement
    vec2 displacedUv = fluidDisplacement(uv, uMouse, uTime);
    
    // Center and scale logo (logo should be centered and take up reasonable portion of screen)
    vec2 logoUv = (displacedUv - center) * 0.5 + center;
    
    // Sample logo
    vec4 logoColor = texture2D(uLogo, logoUv);
    
    // Entropic mist effect (when sharpness is low)
    float mist = fractalNoise(logoUv * 10.0 + uTime * 0.1);
    mist = pow(mist, 2.0);
    
    // Gaussian blur based on sharpness
    float blurAmount = (1.0 - uSharpness) * 0.02;
    vec3 blurredLogo = blurAmount > 0.0 ? gaussianBlur(uLogo, logoUv, blurAmount) : logoColor.rgb;
    
    // Mix between mist and sharp logo
    vec3 logo = mix(
      blurredLogo * (0.3 + mist * 0.7), // Entropic mist
      logoColor.rgb, // Sharp logo
      uSharpness
    );
    
    // Volumetric bloom behind logo
    float distFromCenter = length(uv - center);
    float bloom = exp(-distFromCenter * 3.0) * uBloomIntensity;
    vec3 scalarRed = vec3(0.658, 0.0, 0.0);
    vec3 bloomColor = scalarRed * bloom * (1.0 - logoColor.a);
    
    // Chromatic aberration on bloom edges
    vec2 bloomDir = normalize(uv - center);
    vec3 bloomWithCA = chromaticAberration(uLogo, logoUv, bloomDir, bloom * 5.0);
    bloomColor = mix(bloomColor, bloomWithCA * scalarRed, 0.3);
    
    // Combine logo and bloom
    vec3 finalColor = logo * logoColor.a + bloomColor;
    
    gl_FragColor = vec4(finalColor, max(logoColor.a, bloom * 0.5));
  }
`

export default function LogoCureShader({ 
  logoPath, 
  mouse,
  onCureComplete 
}: { 
  logoPath: string
  mouse: { x: number; y: number }
  onCureComplete?: () => void
}) {
  const meshRef = useRef<THREE.Mesh>(null)
  const { viewport, size } = useThree()
  const [sharpness, setSharpness] = useState(0)
  const [bloomIntensity, setBloomIntensity] = useState(1.5)
  const [cureStarted, setCureStarted] = useState(false)
  
  const logoTexture = useTexture(logoPath)
  
  const uniforms = useMemo(
    () => ({
      uLogo: { value: logoTexture },
      uSharpness: { value: 0 },
      uTime: { value: 0 },
      uMouse: { value: [0.5, 0.5] },
      uResolution: { value: [size.width, size.height] },
      uBloomIntensity: { value: 1.5 },
    }),
    [logoTexture, size.width, size.height]
  )

  // Start cure sequence when texture is loaded
  useEffect(() => {
    if (logoTexture && !cureStarted) {
      setCureStarted(true)
      
      // Cure animation: 0 to 1 over 3 seconds
      const startTime = Date.now()
      const duration = 3000
      
      const animate = () => {
        const elapsed = Date.now() - startTime
        const progress = Math.min(elapsed / duration, 1)
        
        // Easing: ease-out cubic
        const eased = 1 - Math.pow(1 - progress, 3)
        setSharpness(eased)
        
        if (progress < 1) {
          requestAnimationFrame(animate)
        } else {
          onCureComplete?.()
        }
      }
      
      requestAnimationFrame(animate)
    }
  }, [logoTexture, cureStarted, onCureComplete])

  useFrame((state) => {
    if (meshRef.current) {
      const material = meshRef.current.material as THREE.ShaderMaterial
      if (material && material.uniforms) {
        material.uniforms.uTime.value = state.clock.elapsedTime
        material.uniforms.uSharpness.value = sharpness
        material.uniforms.uBloomIntensity.value = bloomIntensity
        material.uniforms.uMouse.value = [mouse.x, mouse.y]
      }
    }
  })

  return (
    <mesh ref={meshRef} position={[0, 0, 0]}>
      <planeGeometry args={[viewport.width, viewport.height, 64, 64]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent={true}
      />
    </mesh>
  )
}
