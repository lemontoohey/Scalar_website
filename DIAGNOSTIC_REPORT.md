# Full Diagnostic Report — Scalar Website

**Date:** 2026-02-10 (updated)  
**Scope:** Build, imports, components, hooks, config, dead code, mobile UX, and consistency.

---

## 1. Build & tooling

| Check | Status | Notes |
|-------|--------|------|
| `npm run build` | Pass | Next.js 14.2.35; static export; 4 routes (/, /_not-found). |
| TypeScript | Pass | No type errors; strict mode. |
| Linter | Not configured | `npm run lint` prompts for ESLint setup. No `.eslintrc` / `eslint.config.js`. |

**Recommendation:** Add Next.js ESLint (e.g. `npx create-next-app@latest --eslint` in a temp dir and copy config, or run `npm run lint` and choose “Strict”) so lint runs in CI and locally.

---

## 2. Dependency & imports

| Check | Status | Notes |
|-------|--------|------|
| All `@/` and `./` imports | Pass | No references to removed files (CustomCursor, EnsoEcho, FluidCureShader, LogoCureShader, GlassCard). |
| `constants/specimens.ts` | Pass | `Specimen` type and `SPECIMENS` array consistent; `index` is number. |
| `hooks/useSound.ts` | Pass | `playThud` and `playLensClick` exported; `useSound()` still used by ProcurementTerminal. |

---

## 3. Component-level findings

### 3.1 Client / server and Canvas

- **ClientCanvas.tsx** — Has `'use client'`; Canvas only after `shouldRender` (useLayoutEffect). OK.
- **HeroView** — Loads ClientCanvas and CureSequenceShader with `dynamic(..., { ssr: false })`. OK.
- **CureSequenceShader** — Uses `useThree().viewport` (R3F 8). Compatible.

### 3.2 HeroView.tsx

- **ClientCanvas** — Renders without redundant `window` guard (cleanup applied). HeroView is already loaded with `ssr: false`, so it only runs on the client. The check is redundant and can be removed for clarity.
- **CureSequenceShader:** Used without `onCureComplete`. Page drives “cure” and thud by a timer (`CURE_THUD_MS`); no bug.

### 3.3 ThermalCursor.tsx

- Cursor starts at `(-100, -100)` and moves on first `mousemove`. Intentional.
- No `initial` on `motion.div`; Framer uses first variant by default. OK.

### 3.4 SmoothScroll.tsx (Lenis)

- Cleanup cancels `rafId` and calls `lenis.destroy()`. Closure sees updated `lenis` / `rafId` after the dynamic import. If the component unmounts before the import resolves, both stay null and cleanup is a no-op. OK.
- Optional improvement: store `lenis` and `rafId` in refs so cleanup always has the latest values in edge cases.

### 3.5 MaterialGenome.tsx — LatticeCanvas

- `ctx.globalAlpha = 1` is restored after drawing. No alpha leak.
- `BATCH_ID: SC-${Math.floor(Math.random() * 9000) + 1000}` changes every render; consider `useMemo` or fixed id if you need stability.

### 3.6 RefractiveTransition.tsx

- Uses ref for `onPeak` to avoid stale closure. OK.

### 3.7 InnovationLayer.tsx

- Has `data-lenis-prevent` for scroll containment. OK.
- Uses `AnimatePresence` in parent (page.tsx). OK.

### 3.8 ProcurementTerminal.tsx

- Uses `useSound()` for `playThud`. Hook is still exported; no issue.
- Resets state when `isOpen` becomes false. OK.

### 3.9 LensText.tsx (R3F)

- Loads font from Google Fonts URL. May fail in offline/strict CSP; consider self-hosting or fallback font.

---

## 4. Dead / unused code (cleanup applied)

| Item | Status |
|------|--------|
| **Hero.tsx** | Removed (was unused; page uses HeroView). |
| **BifurcationView, OpticalEngine, SafeFluidCureShader, SpecimenGallery, ProductArchitecture** | Removed (only used by Hero). |
| **PageState `'bifurcation'`** | Removed from type; now `'hero' | 'gallery'`. |
| **HeroView `typeof window` guard** | Removed (redundant). |

**Recommendation:** Either remove `Hero.tsx` and related unused exports if no longer needed, or document them as “alternate hero flow.” Cleanup applied (see table above).

---

## 5. Config

| File | Status | Notes |
|------|--------|------|
| **next.config.js** | OK | `output: 'export'`, `images.unoptimized: true`, `transpilePackages` for three/R3F. |
| **tsconfig.json** | OK | `paths` `@/*` → `./*`; `jsx: preserve` for Next. |
| **tailwind.config.ts** | OK | Content paths include app/components/pages; scalar-red, scalar-black, fonts. |
| **globals.css** | OK | `cursor: none` under `(hover: hover) and (pointer: fine)`; `:root` overscroll-behavior; html/body max-width/overflow-x/-webkit-font-smoothing; mobile `.specimen-grid` (1 col, 2rem gap), `.hero-title` clamp. |

---

## 6. Accessibility and semantics

- **ThermalCursor:** Cursor is visual only; `pointer-events-none` and custom cursor are acceptable if keyboard and focus remain usable.
- **HeroView [organic] / [inorganic]:** Use `<button>`; OK.
- **InnovationLayer / MaterialGenome / ProcurementTerminal:** Close controls are buttons. Consider `aria-label` where label text is only “[Close_Protocol]” etc. for screen readers.
- **DiagnosticLine:** Decorative; no semantic content. OK.

---

## 7. Summary

| Severity | Count | Items |
|----------|--------|--------|
| Critical (build / runtime breaking) | 0 | — |
| Medium (logic / UX / maintainability) | 0 | Cleanup applied (dead components and bifurcation type removed). |
| Low / optional | 2 | ESLint not configured; optional Lenis cleanup refs; LensText external font. |

---

## 8. Recent changes (mobile & logo)

| Area | Status |
|------|--------|
| **Hallmark logo** | Optical alignment offset **1.5mm** left (`translateX(-1.5mm)`); 44px min touch target. |
| **Main layout** | `min-h-[100dvh]` for mobile viewport stability. |
| **Touch targets** | GlobalNav, SpecimenCard button, InnovationLayer close, Hallmark — all ≥44×44px. |
| **Padding** | SpecimenGrid & GlobalNav: `px-6 sm:px-12`. |
| **ClientCanvas** | Camera z = 6 when `innerWidth < 768` so mist is less cramped on narrow viewports. |
| **globals.css** | Overscroll-behavior, overflow-x hidden, mobile `.specimen-grid` single column, `.hero-title` responsive clamp. |

**Conclusion:** The project builds cleanly, has no broken imports, and follows consistent patterns for client-only Canvas and R3F. Dead-code cleanup and mobile-first refinements are applied. Adding ESLint remains recommended.
