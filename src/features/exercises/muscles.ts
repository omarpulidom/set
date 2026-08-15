import { useMemo } from 'react'
import { exerciseCatalog } from '@/features/exercises/catalog'
import { useRoutineDraftStore } from '@/features/exercises/routine-draft-store'

const MUSCLE_LABEL_ES: Record<string, string> = {
  abductors: 'Abductores',
  abs: 'Abdomen',
  adductors: 'Aductores',
  'cardiovascular system': 'Cardio',
  'serratus anterior': 'Serrato anterior',
  spine: 'Columna',
  biceps: 'Bíceps',
  brachialis: 'Braquial',
  calves: 'Pantorrillas',
  delts: 'Hombros',
  deltoids: 'Hombros',
  forearms: 'Antebrazos',
  glutes: 'Glúteos',
  hamstrings: 'Isquiotibiales',
  lats: 'Dorsales',
  'latissimus dorsi': 'Dorsales',
  'levator scapulae': 'Elevador de la escápula',
  pectorals: 'Pecho',
  chest: 'Pecho',
  'upper chest': 'Pecho alto',
  quads: 'Cuádriceps',
  quadriceps: 'Cuádriceps',
  traps: 'Trapecio',
  trapezius: 'Trapecio',
  triceps: 'Tríceps',
  'upper back': 'Espalda alta',
  back: 'Espalda',
  abdominals: 'Abdomen',
  core: 'Core',
  obliques: 'Oblicuos',
  'lower abs': 'Abdomen bajo',
  'lower back': 'Espalda baja',
  shoulders: 'Hombros',
  rhomboids: 'Romboides',
  'rear deltoids': 'Hombros posteriores',
  'rotator cuff': 'Manguito rotador',
  neck: 'Cuello',
  hip: 'Cadera',
  groin: 'Ingle',
  'inner thighs': 'Aductores',
  'hip flexors': 'Flexores de cadera',
  ankles: 'Tobillos',
  'ankle stabilizers': 'Estabilizadores de tobillo',
  shins: 'Espinillas',
  soleus: 'Sóleo',
  feet: 'Pies',
  hands: 'Manos',
  wrists: 'Muñecas',
  'wrist extensors': 'Extensores de muñeca',
  'wrist flexors': 'Flexores de muñeca',
  'grip muscles': 'Agarre',
  sternocleidomastoid: 'Esternocleidomastoideo',
}

function translateMuscle(value: string): string {
  const key = value.trim().toLowerCase()
  return MUSCLE_LABEL_ES[key] ?? value
}

function getCatalogExerciseById(id: string | undefined) {
  if (!id) return undefined
  return exerciseCatalog.find((exercise) => exercise.id === id)
}

export type AggregatedMuscle = {
  label: string
  count: number
}

export function getExerciseMuscleLabels(catalogExerciseId: string | undefined): string[] {
  const exercise = getCatalogExerciseById(catalogExerciseId)
  if (!exercise) return []

  const labels: string[] = []
  if (exercise.target) labels.push(translateMuscle(exercise.target))
  for (const muscle of exercise.secondary_muscles) {
    labels.push(translateMuscle(muscle))
  }
  return labels
}

export function aggregateMuscleLabels(
  catalogExerciseIds: (string | undefined)[],
): AggregatedMuscle[] {
  const counts = new Map<string, number>()
  for (const id of catalogExerciseIds) {
    for (const label of getExerciseMuscleLabels(id)) {
      counts.set(label, (counts.get(label) ?? 0) + 1)
    }
  }

  return [
    ...counts.entries(),
  ]
    .map(([label, count]) => ({
      label,
      count,
    }))
    .sort((a, b) => {
      if (b.count !== a.count) return b.count - a.count
      return a.label.localeCompare(b.label, 'es')
    })
}

export function formatMuscleList(labels: string[]): string {
  if (labels.length === 0) return ''
  if (labels.length === 1) return labels[0]
  if (labels.length === 2) return `${labels[0]} y ${labels[1]}`
  return `${labels.slice(0, -1).join(', ')} y ${labels[labels.length - 1]}`
}

export function buildDerivedFocus(catalogExerciseIds: (string | undefined)[]): string {
  const aggregated = aggregateMuscleLabels(catalogExerciseIds)
  return formatMuscleList(aggregated.map((item) => item.label))
}

export function useDerivedRoutineFocus(): string {
  const catalogExerciseIds = useRoutineDraftStore((state) =>
    state.exercises.map((exercise) => exercise.catalogExerciseId),
  )
  return useMemo(
    () => buildDerivedFocus(catalogExerciseIds),
    [
      catalogExerciseIds,
    ],
  )
}
