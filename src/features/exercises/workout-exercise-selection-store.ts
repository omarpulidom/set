import { create } from 'zustand'
import type { CatalogExercise } from './catalog'

type WorkoutExerciseSelectionState = {
  selectedExercise: CatalogExercise | null
  excludedExerciseIds: string[]
  selectExercise: (exercise: CatalogExercise) => void
  setExcludedExerciseIds: (exerciseIds: string[]) => void
  clearSelection: () => void
}

export const useWorkoutExerciseSelectionStore = create<WorkoutExerciseSelectionState>((set) => ({
  selectedExercise: null,
  excludedExerciseIds: [],
  selectExercise: (exercise) =>
    set({
      selectedExercise: exercise,
    }),
  setExcludedExerciseIds: (exerciseIds) =>
    set({
      excludedExerciseIds: exerciseIds,
    }),
  clearSelection: () =>
    set({
      selectedExercise: null,
    }),
}))
