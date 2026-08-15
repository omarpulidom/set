import catalog from '@/assets/exercises/data/exercises.json'
import { exerciseImageById } from './exercise-image-map'
import { exerciseVideoById } from './exercise-video-map'

export type CatalogBodyPart = 'all' | 'back' | 'chest' | 'shoulders' | 'arms' | 'legs' | 'waist'

export type CatalogExercise = {
  id: string
  name: string
  category: string
  body_part: string
  equipment: string
  muscle_group: string
  secondary_muscles: string[]
  target: string
  media_id: string
  instructions: {
    en: string
    es: string
  }
  instruction_steps: {
    en: string[]
    es: string[]
  }
}

export const bodyPartFilters: {
  id: CatalogBodyPart
  label: string
}[] = [
  {
    id: 'all',
    label: 'Todos',
  },
  {
    id: 'back',
    label: 'Espalda',
  },
  {
    id: 'chest',
    label: 'Pecho',
  },
  {
    id: 'shoulders',
    label: 'Hombros',
  },
  {
    id: 'arms',
    label: 'Brazos',
  },
  {
    id: 'legs',
    label: 'Piernas',
  },
  {
    id: 'waist',
    label: 'Abdomen',
  },
]

export const exerciseCatalog = catalog as CatalogExercise[]

export function getCatalogExercise(exerciseId?: string) {
  return exerciseCatalog.find((exercise) => exercise.id === exerciseId)
}

export function imageForExercise(exerciseId: string) {
  return exerciseImageById[exerciseId]
}

export function videoForExercise(exerciseId: string) {
  return exerciseVideoById[exerciseId]
}

export function normalizeExerciseSearch(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, '')
    .toLowerCase()
}

export function bodyPartGroup(bodyPart: string): CatalogBodyPart {
  if (bodyPart === 'upper arms' || bodyPart === 'lower arms') return 'arms'
  if (bodyPart === 'upper legs' || bodyPart === 'lower legs') return 'legs'
  if (
    bodyPart === 'back' ||
    bodyPart === 'chest' ||
    bodyPart === 'shoulders' ||
    bodyPart === 'waist'
  )
    return bodyPart
  return 'all'
}

export function filterCatalogExercises(query: string, filter: CatalogBodyPart) {
  const normalizedQuery = normalizeExerciseSearch(query)
  return exerciseCatalog.filter((exercise) => {
    const matchesQuery =
      !normalizedQuery || normalizeExerciseSearch(exercise.name).includes(normalizedQuery)
    const matchesBodyPart = filter === 'all' || bodyPartGroup(exercise.body_part) === filter
    return matchesQuery && matchesBodyPart
  })
}
