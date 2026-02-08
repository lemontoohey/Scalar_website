'use client'

type GlobalNavProps = {
  onInnovationClick?: () => void
}

export default function GlobalNav({ onInnovationClick }: GlobalNavProps) {
  return (
    <div className="fixed bottom-0 left-0 w-full z-40 border-t border-[#FCFBF8]/10 bg-[#000502]/80 backdrop-blur-sm">
      <div className="flex justify-between items-center px-6 py-3 text-[10px] font-mono text-[#FCFBF8]/60 tracking-widest uppercase">
        {/* Left: The Navigation */}
        <div className="flex gap-8">
          <span className="hover:text-[#A80000] cursor-pointer transition-colors">home</span>
          <span
            role="button"
            tabIndex={0}
            onClick={onInnovationClick}
            onKeyDown={(e) => {
              if ((e.key === 'Enter' || e.key === ' ') && onInnovationClick) {
                e.preventDefault()
                onInnovationClick()
              }
            }}
            className="hover:text-[#A80000] cursor-pointer transition-colors"
          >
            innovation
          </span>
          <span className="hover:text-[#A80000] cursor-pointer transition-colors">collections</span>
        </div>

        {/* Right: The Live Tracker */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-[#A80000] animate-pulse" />
            <span>SYSTEM_LIVE</span>
          </div>
          <span className="opacity-30">|</span>
          <span>BATCH_PROD: SC-0992</span>
          <span className="opacity-30">|</span>
          <span>EST_YIELD: 98.4%</span>
        </div>
      </div>
    </div>
  )
}
