# Scalar Materials Website

A modern, high-performance website for Scalar Materials - a materials science brand transitioning from traditional art paint to clinical, physics-based coatings.

## Design Philosophy

**"Science over Art"** - Moving away from romanticized craft toward a clinical, physics-based identity.

**Aesthetic:** Automotive Luxury meets Laboratory Science
- Dark mode dominant design
- Liquid Glass aesthetic with glassmorphism
- Deep blacks and charcoals allowing pigment colors to "glow"
- Scalar Red accent (#A80000 to #C50000)

## Tech Stack

- **Next.js 14** (App Directory)
- **TypeScript**
- **Tailwind CSS**
- **Framer Motion** (animations)
- **Google Fonts** (Space Grotesk for headings, Inter for body)

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
├── app/
│   ├── layout.tsx      # Root layout with fonts
│   ├── page.tsx        # Home page
│   └── globals.css     # Global styles
├── components/
│   ├── HeroView.tsx     # Hero (mist, Scalar text, organic/inorganic)
│   ├── ClientCanvas.tsx # R3F Canvas wrapper (SSR-safe)
│   ├── CureSequenceShader.tsx  # Hero mist shader
│   ├── SpecimenGrid.tsx # Specimen cards grid
│   ├── Technology.tsx   # Technology section
│   ├── Collection.tsx   # Product collection
│   ├── SecretMenu.tsx   # Secret menu pigments
│   └── (glass cards inlined in SecretMenu, Collection, Technology)
└── lib/
    └── utils.ts        # Utility functions (cn helper)
```

## Typography

- **Headings:** Space Grotesk (technical, mathematical, engineered)
- **Body:** Inter (clinical lab report / spec sheet feel)

## Key Features

- Smooth scroll animations with Framer Motion
- Glassmorphism effects throughout
- Responsive design
- Dark mode optimized
- Performance-focused (Next.js 14 App Directory)

## Build

```bash
npm run build
```

## License

Private - Scalar Materials
