'use client'

import { useEffect, useState } from 'react'
import { motion, useScroll, useVelocity, useTransform } from 'framer-motion'

const VELOCITY_THRESHOLD = 400
const MAX_BLUR_PX = 3
const CHROMATIC_OFFSET_PX = 2

function useIsTouchDevice(): boolean {
  const [isTouch, setIsTouch] = useState(false)
  useEffect(() => {
    const check =
      'ontouchstart' in window ||
      navigator.maxTouchPoints > 0 ||
      window.matchMedia('(hover: none) and (pointer: coarse)').matches
    setIsTouch(check)
  }, [])
  return isTouch
}

export default function ScrollPhysicsProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const isTouch = useIsTouchDevice()
  const { scrollY } = useScroll()
  const scrollVelocity = useVelocity(scrollY)

  const intensity = useTransform(
    scrollVelocity,
    [-VELOCITY_THRESHOLD * 2, 0, VELOCITY_THRESHOLD * 2],
    [1, 0, 1]
  )

  const filter = useTransform(intensity, (i) =>
    i > 0 ? `blur(${i * MAX_BLUR_PX}px)` : 'blur(0px)'
  )

  const textShadow = useTransform(intensity, (i) =>
    i > 0
      ? `${CHROMATIC_OFFSET_PX}px 0 0 rgba(255,0,0,${i * 0.5}), -${CHROMATIC_OFFSET_PX}px 0 0 rgba(0,0,255,${i * 0.5})`
      : 'none'
  )

  if (isTouch) {
    return <>{children}</>
  }

  return (
    <motion.div
      className="min-h-screen"
      style={{
        filter,
        textShadow,
      }}
    >
      {children}
    </motion.div>
  )
}
