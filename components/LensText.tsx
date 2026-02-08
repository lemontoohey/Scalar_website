'use client'

import { useRef } from 'react'
import { Text, MeshTransmissionMaterial } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export default function LensText({ 
  children, 
  position,
  fontSize = 1,
}: { 
  children: string
  position: [number, number, number]
  fontSize?: number
}) {
  const textRef = useRef<THREE.Mesh>(null)

  return (
    <Text
      ref={textRef}
      position={position}
      fontSize={fontSize}
      font="https://fonts.gstatic.com/s/archivo/v18/k3k6o8UDI-1M0wlSV9XAw6lQkqWY8Q82sJaRE-NWIDdgffTTNDJp8B0oJk8vH.ttf"
      anchorX="center"
      anchorY="middle"
      color="#ffffff"
      letterSpacing={0.04}
    >
      {children}
      <MeshTransmissionMaterial
        backside
        samples={10}
        resolution={512}
        transmission={0.95}
        thickness={0.5}
        roughness={0.1}
        chromaticAberration={0.05}
        anisotropy={0.1}
        distortion={0.1}
        distortionScale={0.5}
        temporalDistortion={0.0}
      />
    </Text>
  )
}
