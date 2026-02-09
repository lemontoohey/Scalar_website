'use client'

import { SPECIMENS, type Specimen } from '@/constants/specimens'
import SpecimenCard from './SpecimenCard'

type SpecimenGridProps = {
  category: 'organic' | 'inorganic'
  onInitiateProcurement: (specimenName: string) => void
  onViewSpecimen: (specimen: Specimen) => void
  contained?: boolean
}

export default function SpecimenGrid({
  category,
  onInitiateProcurement,
  onViewSpecimen,
  contained = false,
}: SpecimenGridProps) {
  const filtered = SPECIMENS.filter((s) => s.category === category)

  return (
    <section
      className={`overflow-auto pt-24 pb-32 z-10 ${contained ? 'absolute inset-0' : 'fixed inset-0'}`}
      style={{ backgroundColor: '#000502' }}
    >
      <div className="container mx-auto px-6">
        <div
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-5xl mx-auto"
          style={{ perspective: '1000px' }}
        >
          {filtered.map((specimen) => (
            <SpecimenCard
              key={specimen.id}
              specimen={specimen}
              onInitiateProcurement={onInitiateProcurement}
              onViewSpecimen={onViewSpecimen}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
