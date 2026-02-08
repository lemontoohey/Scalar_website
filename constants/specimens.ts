export type Specimen = {
  id: string
  category: 'organic' | 'inorganic'
  name: string
  technicalCode: string
  description: string
  color: string
  index: number
}

export const SPECIMENS: Specimen[] = [
  { id: '1', category: 'inorganic', name: 'Scalar Red', technicalCode: 'SR-01', description: 'Photonic Oxide', color: '#A80000', index: 1.55 },
  { id: '2', category: 'inorganic', name: 'Bluest Black', technicalCode: 'PBk27', description: 'Synthetic Lattice', color: '#000502', index: 1.92 },
  { id: '3', category: 'organic', name: 'Carbon Binder', technicalCode: 'C-LIT', description: 'Bio-Polymer', color: '#0A0A0A', index: 1.42 },
  { id: '4', category: 'inorganic', name: 'Ultramarine Core', technicalCode: 'PB15', description: 'Crystalline Pigment', color: '#003366', index: 1.61 },
  { id: '5', category: 'organic', name: 'Solar Flare', technicalCode: 'PY184', description: 'Organic Yellow', color: '#E6B800', index: 1.48 },
  { id: '6', category: 'organic', name: 'The Scalar Ghost', technicalCode: 'PW5', description: 'Titanium White', color: '#F5F5DC', index: 1.52 },
]
