'use client'

import Link from 'next/link'
import { playLensClick } from '@/hooks/useSound'

type HallmarkProps = {
  onReset?: () => void
}

export default function Hallmark({ onReset }: HallmarkProps) {
  const handleClick = (e: React.MouseEvent) => {
    if (onReset) {
      e.preventDefault()
      onReset()
    }
  }

  return (
    <Link
      href="/"
      className="fixed top-8 left-8 z-[100] flex justify-center items-center min-w-[44px] min-h-[44px] text-[#FCFBF8]/70 hover:text-[#FCFBF8] font-light tracking-[0.3em] text-sm uppercase transition-colors outline-none border-0 cursor-pointer"
      style={{ fontFamily: 'var(--font-archivo)', WebkitTapHighlightColor: 'transparent' }}
      onClick={handleClick}
      onMouseEnter={() => onReset && playLensClick()}
      aria-label="Scalar Materials – reset to home"
    >
      Scalar
    </Link>
  )
}
