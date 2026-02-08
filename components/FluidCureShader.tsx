'use client'

import { useRef, useMemo, useState, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

const vertexShader = `
  varying vec2 vUv;
  varying vec3 vPosition;
  varying vec3 vWorldPosition;
  
  void main() {
    vUv = uv;
    vPosition = position;
    vec4 worldPos = modelMatrix * vec4(position, 1.0);
    vWorldPosition = worldPos.xyz;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

const fragmentShader = `
  uniform sampler2D uLogo;
  uniform float uCure;
  uniform float uTime;
  uniform vec2 uMouse;
  uniform vec2 uResolution;
  uniform float uLogoHeight; // 0.35 for 35% viewport height
  uniform vec2 uLogoOffset; // Logo offset relative to center (+3% X)
  
  varying vec2 vUv;
  varying vec3 vPosition;
  varying vec3 vWorldPosition;
  
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
  
  // Fractal noise for fluid curl
  float fractalNoise(vec2 p) {
    float value = 0.0;
    float amplitude = 0.5;
    float frequency = 1.0;
    
    for (int i = 0; i < 6; i++) {
      value += amplitude * smoothNoise(p * frequency);
      amplitude *= 0.5;
      frequency *= 2.0;
    }
    
    return value;
  }
  
  // Fluid curl simulation (entropic mist)
  vec3 fluidCurl(vec2 uv, float time) {
    vec2 p = uv * 8.0;
    
    // Curl noise field
    float n1 = fractalNoise(p + vec2(time * 0.1, 0.0));
    float n2 = fractalNoise(p + vec2(0.0, time * 0.1));
    
    // Curl vector
    vec2 curl = vec2(
      n2 - n1,
      n1 - n2
    ) * 0.5;
    
    // High-frequency turbulence
    float turbulence = fractalNoise(p * 4.0 + curl * 2.0 + time * 0.2);
    
    return vec3(curl, turbulence);
  }
  
  // Viscous fluid displacement with damping
  vec2 viscousDisplacement(vec2 uv, vec2 mouse, float time, float damping) {
    vec2 center = vec2(0.5, 0.5);
    vec2 mouseInfluence = (mouse - center) * 0.2;
    
    // Damped mouse influence (viscous response)
    vec2 dampedInfluence = mouseInfluence * damping;
    
    vec2 dir = normalize(uv - center - dampedInfluence);
    float dist = length(uv - center - dampedInfluence);
    
    // Refractive index 1.554 distortion
    float ri = 1.554;
    vec2 refracted = dir * (1.0 / ri) * (1.0 - dist * 0.4);
    
    // Slow, viscous ripple
    float ripple = sin(dist * 15.0 - time * 1.5) * 0.008;
    refracted += ripple * normalize(uv - center - dampedInfluence) * damping;
    
    return refracted;
  }
  
  // Beer's Law light attenuation
  float beersLaw(float distance, float density) {
    return exp(-distance * density);
  }
  
  void main() {
    vec2 uv = vUv;
    vec2 center = vec2(0.5, 0.5);
    
    // Viscous displacement (damping 0.95)
    vec2 displacedUv = viscousDisplacement(uv, uMouse, uTime, 0.95);
    
    // Logo UV mapping - 35% viewport height, offset +3% X
    float logoAspect = 1.0; // Assume square logo, adjust if needed
    float logoWidth = uLogoHeight * logoAspect;
    vec2 logoCenter = center + uLogoOffset; // Apply offset
    vec2 logoUv = (displacedUv - logoCenter) / vec2(logoWidth, uLogoHeight) + center;
    
    // Sample logo
    vec4 logoColor = texture2D(uLogo, clamp(logoUv, 0.0, 1.0));
    float inLogoBounds = step(0.0, logoUv.x) * step(logoUv.x, 1.0) * step(0.0, logoUv.y) * step(logoUv.y, 1.0);
    
    // Fluid curl mist effect
    vec3 curl = fluidCurl(logoUv, uTime);
    float mist = curl.z;
    mist = pow(mist, 1.5);
    
    // Mix between fluid curl mist and sharp logo based on cure
    vec3 logo = mix(
      vec3(0.658, 0.0, 0.0) * (0.3 + mist * 0.7), // Entropic red mist
      logoColor.rgb, // Sharp logo
      uCure
    );
    
    // Beer's Law volumetrics - exponential light attenuation from logo center
    float distFromLogo = length(uv - logoCenter);
    float density = 2.0; // Light absorption density
    float attenuation = beersLaw(distFromLogo * 2.0, density);
    
    // Scalar Red glow (#A80000)
    vec3 scalarRed = vec3(0.658, 0.0, 0.0);
    vec3 bloomColor = scalarRed * attenuation * (1.0 - logoColor.a * uCure);
    
    // Combine logo and volumetrics
    vec3 finalColor = bloomColor + logo * logoColor.a * inLogoBounds;
    
    // Alpha based on cure and logo visibility
    float alpha = max(
      logoColor.a * inLogoBounds * uCure,
      attenuation * 0.4 * (1.0 - uCure)
    );
    
    gl_FragColor = vec4(finalColor, alpha);
  }
`

export default function FluidCureShader({ 
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
  const [cure, setCure] = useState(0)
  const [cureStarted, setCureStarted] = useState(false)
  const [logoTexture, setLogoTexture] = useState<THREE.Texture | null>(null)
  const [textureError, setTextureError] = useState<string | null>(null)
  
  // Load texture with TextureLoader and error handling
  useEffect(() => {
    const loader = new THREE.TextureLoader()
    
    loader.load(
      logoPath,
      (texture) => {
        texture.flipY = false
        texture.wrapS = THREE.ClampToEdgeWrapping
        texture.wrapT = THREE.ClampToEdgeWrapping
        texture.minFilter = THREE.LinearFilter
        texture.magFilter = THREE.LinearFilter
        setLogoTexture(texture)
        console.log('Logo texture loaded successfully:', logoPath)
      },
      undefined,
      (error) => {
        const errorMsg = `Failed to load logo texture from ${logoPath}: ${error}`
        console.error(errorMsg)
        setTextureError(errorMsg)
      }
    )
  }, [logoPath])
  
  const uniforms = useMemo(
    () => {
      if (!logoTexture) return null
      return {
        uLogo: { value: logoTexture },
        uCure: { value: 0 },
        uTime: { value: 0 },
        uMouse: { value: [0.5, 0.5] },
        uResolution: { value: [size.width, size.height] },
        uLogoHeight: { value: 0.35 }, // 35% viewport height
        uLogoOffset: { value: [0.03, 0] }, // +3% X offset
      }
    },
    [logoTexture, size.width, size.height]
  )
  
  // Start cure sequence when texture is loaded
  useEffect(() => {
    if (logoTexture && uniforms && !cureStarted && !textureError) {
      setCureStarted(true)
      console.log('Starting 5-second cure sequence')
      
      setTimeout(() => {
        const startTime = Date.now()
        const duration = 5000 // 5 seconds
        
        const animate = () => {
          const elapsed = Date.now() - startTime
          const progress = Math.min(elapsed / duration, 1)
          
          // Easing: ease-out cubic
          const eased = 1 - Math.pow(1 - progress, 3)
          setCure(eased)
          
          if (progress < 1) {
            requestAnimationFrame(animate)
          } else {
            console.log('Cure sequence complete')
            onCureComplete?.()
          }
        }
        
        requestAnimationFrame(animate)
      }, 100)
    }
  }, [logoTexture, uniforms, cureStarted, onCureComplete, textureError])
  
  // Log error if texture failed
  useEffect(() => {
    if (textureError) {
      console.error('Texture loading error:', textureError)
    }
  }, [textureError])

  useFrame((state) => {
    if (meshRef.current && uniforms) {
      const material = meshRef.current.material as THREE.ShaderMaterial
      if (material && material.uniforms) {
        material.uniforms.uTime.value = state.clock.elapsedTime
        material.uniforms.uCure.value = cure
        material.uniforms.uMouse.value = [mouse.x, mouse.y]
      }
    }
  })

  if (!uniforms || textureError) {
    if (textureError) {
      console.error('Shader not rendering due to texture error:', textureError)
    }
    return null
  }

  return (
    <mesh ref={meshRef} position={[0, 0, 0]}>
      <planeGeometry args={[viewport.width, viewport.height, 128, 128]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent={true}
      />
    </mesh>
  )
}
