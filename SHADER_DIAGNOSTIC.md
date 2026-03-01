# CureSequenceShader Full Diagnostic

## Chat History Summary (What Changed)

| When it worked (89d64af) | Current (broken) |
|--------------------------|------------------|
| **AdditiveBlending** | NormalBlending |
| **startTimeRef** – animation starts when shader mounts | clock.elapsedTime – includes pre-mount time |
| **Uniforms via meshRef** – `material.uniforms.uX.value = x` | Direct `uniforms.uX.value = x` |
| No inner Suspense | LensText wrapped in Suspense (to unblock mist) |
| LensText + CureSequenceShader as siblings | Same, but LensText in `<Suspense fallback={null}>` |

## Component Chain

```
page.tsx (state === 'hero')
  → HeroView (key={mistKey})
    → Layer 1: radial gradient bg (z-0)
    → Mist container (z-[1], CSS mask)
      → ClientCanvas (dynamic, ssr: false)
        → ErrorBoundary (fallback = gradient)
        → div (fixed inset-0, z-0)
          → Suspense (fallback = gradient)
            → Canvas (flat, frameloop=always, dpr [1,2], alpha)
              → CureSequenceShader
              → Suspense (fallback=null)
                → LensText (drei Text, font URL)
```

## Potential Blockers

1. **AdditiveBlending** – On dark backgrounds, additive makes red mist glow and stay visible. NormalBlending can make it nearly invisible.
2. **Layout providers** – ScrollPhysicsProvider wraps page in `motion.div` with `filter`/`textShadow`; at rest it’s `blur(0px)`.
3. **CSS mask** – Mist container uses `mask-image: radial-gradient(ellipse...)` – center visible, edges feathered.
4. **ClientCanvas Suspense** – When any Canvas child suspends, R3F throws and the whole Canvas shows fallback. Our inner Suspense around LensText should catch font load and keep CureSequenceShader visible.
5. **Canvas size** – Root is created only when `containerRect.width > 0 && containerRect.height > 0`. We added `min-w-[1px] min-h-[1px]` to avoid zero size.
6. **body::after** – Film grain at z-9998, opacity 0.04 – doesn’t block mist.

## Key Fix from Working Version

Use **AdditiveBlending** and **startTimeRef** so the animation restarts when the shader mounts.
