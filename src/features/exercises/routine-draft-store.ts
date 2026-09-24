import { create } from 'zustand'
import type { RoutineExercise } from '@/features/gym/types'
import { useRoutinesStore } from '@/features/routines/routines-store'
import type { CatalogExercise } from './catalog'

export type DraftRoutineExercise = RoutineExercise & {
  catalogExerciseId: string
}

type RoutineDraftStore = {
  name: string
  exercises: DraftRoutineExercise[]
  editingId: string | null
  setName: (name: string) => void
  addExercise: (exercise: CatalogExercise, targetSets?: number, targetReps?: number) => void
  removeExercise: (id: string) => void
  moveExercise: (fromIndex: number, toIndex: number) => void
  updateExercise: (id: string, field: 'targetSets' | 'targetReps', value: number) => void
  loadForEdit: (routineId: string) => void
  reset: () => void
}

export const useRoutineDraftStore = create<RoutineDraftStore>((set) => ({
  name: '',
  exercises: [],
  editingId: null,
  setName: (name) =>
    set({
      name,
    }),
  addExercise: (exercise, targetSets = 3, targetReps = 10) =>
    set((state) => {
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
  removeExercise: (id) =>
    set((state) => ({
      exercises: state.exercises.filter((exercise) => exercise.id !== id),
    })),
  moveExercise: (fromIndex, toIndex) =>
    set((state) => {
      if (
        fromIndex === toIndex ||
        fromIndex < 0 ||
        toIndex < 0 ||
        fromIndex >= state.exercises.length ||
        toIndex >= state.exercises.length
      ) {
        return state
      }
      const exercises = [
        ...state.exercises,
      ]
      const [moved] = exercises.splice(fromIndex, 1)
      exercises.splice(toIndex, 0, moved)
      return {
        exercises,
      }
    }),
  updateExercise: (id, field, value) =>
    set((state) => ({
      exercises: state.exercises.map((exercise) =>
        exercise.id === id
          ? {
              ...exercise,
              [field]: value,
            }
          : exercise,
      ),
    })),
  loadForEdit: (routineId) => {
    const routine = useRoutinesStore.getState().getRoutine(routineId)
    if (!routine) return
    set({
      editingId: routine.id,
      name: routine.name,
      exercises: routine.exercises.map((exercise) => ({
        id: exercise.id,
        catalogExerciseId: exercise.catalogExerciseId ?? exercise.id,
        name: exercise.name,
        targetSets: exercise.targetSets,
        targetReps: exercise.targetReps,
      })),
    })
  },
  reset: () =>
    set({
      name: '',
      exercises: [],
      editingId: null,
    }),
}))
