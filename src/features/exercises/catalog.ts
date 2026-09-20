import catalog from '@/assets/exercises/data/exercises.json'
import { exerciseImageById } from './exercise-image-map'
import { exerciseVideoById } from './exercise-video-map'
import { getExerciseMetadataEs, getExerciseNameEs } from './translations'

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

// This variation is intentionally unavailable in the app for now.
export const exerciseCatalog = (catalog as CatalogExercise[]).filter(
  (exercise) => exercise.id !== '0046',
)

export function getCatalogExercise(exerciseId?: string) {
  return exerciseCatalog.find((exercise) => exercise.id === exerciseId)
}

export function getCatalogExerciseId(exerciseId: string | undefined, englishName?: string) {
  if (exerciseId && getCatalogExercise(exerciseId)) return exerciseId
  if (!englishName) return undefined
  const matches = exerciseCatalog.filter(
    (exercise) => normalizeExerciseSearch(exercise.name) === normalizeExerciseSearch(englishName),
  )
  return matches.length === 1 ? matches[0]?.id : undefined
}

export function getExerciseDisplayName(exercise: Pick<CatalogExercise, 'id' | 'name'>) {
  return getExerciseNameEs(exercise.id, exercise.name)
}

export function getExerciseDisplayNameById(
  catalogExerciseId: string | undefined,
  fallbackName: string,
) {
  const exercise = getCatalogExercise(catalogExerciseId)
  return exercise
    ? getExerciseDisplayName(exercise)
    : `${fallbackName[0]?.toLocaleUpperCase('es-MX') ?? ''}${fallbackName.slice(1)}`
}

export function getExerciseMetadata(value: string) {
  return getExerciseMetadataEs(value)
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
      !normalizedQuery ||
      [
        exercise.name,
        getExerciseDisplayName(exercise),
      ].some((name) => normalizeExerciseSearch(name).includes(normalizedQuery))
    const matchesBodyPart = filter === 'all' || bodyPartGroup(exercise.body_part) === filter
    return matchesQuery && matchesBodyPart
  })
}
