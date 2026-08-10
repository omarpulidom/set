import { create } from 'zustand'
import type { RoutineExercise } from '@/features/gym/types'
import type { CatalogExercise } from './catalog'

type DraftRoutineExercise = RoutineExercise & {
  catalogExerciseId: string
}

type RoutineDraftStore = {
  name: string
  focus: string
  exercises: DraftRoutineExercise[]
  setName: (name: string) => void
  setFocus: (focus: string) => void
  addExercise: (exercise: CatalogExercise, targetSets?: number, targetReps?: number) => void
  removeExercise: (id: string) => void
  updateExercise: (id: string, field: 'targetSets' | 'targetReps', value: number) => void
  reset: () => void
}

export const useRoutineDraftStore = create<RoutineDraftStore>((set) => ({
  name: '',
  focus: '',
  exercises: [],
  setName: (name) => set({ name }),
  setFocus: (focus) => set({ focus }),
  addExercise: (exercise, targetSets = 3, targetReps = 10) => set((state) => {
    if (state.exercises.some((item) => item.catalogExerciseId === exercise.id)) return state
    return {
      exercises: [
        ...state.exercises,
        {
          id: `routine-exercise-${exercise.id}`,
          catalogExerciseId: exercise.id,
          name: exercise.name,
          targetSets,
          targetReps,
        },
      ],
    }
  }),
  removeExercise: (id) => set((state) => ({
    exercises: state.exercises.filter((exercise) => exercise.id !== id),
  })),
  updateExercise: (id, field, value) => set((state) => ({
    exercises: state.exercises.map((exercise) => exercise.id === id ? { ...exercise, [field]: value } : exercise),
  })),
  reset: () => set({ name: '', focus: '', exercises: [] }),
}))
