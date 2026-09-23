import { create } from 'zustand'
import { Colors } from '@/components/colors'
import type { Routine, RoutineExercise } from '@/features/gym/types'
import {
  deleteRoutineRecord,
  insertRoutine,
  readRoutines,
  replaceAllRoutines,
  replaceRoutine,
  updateRoutineOrder,
} from '@/lib/database'

export type CreateRoutineInput = {
  name: string
  description?: string
  accent?: string
  exercises: RoutineExercise[]
}

export type UpdateRoutineInput = Partial<Pick<Routine, 'name' | 'description' | 'accent'>> & {
  exercises?: RoutineExercise[]
}

type RoutinesStore = {
  routines: Routine[]
  getRoutine: (id: string | undefined) => Routine | undefined
  createRoutine: (input: CreateRoutineInput) => string
  updateRoutine: (id: string, patch: UpdateRoutineInput) => void
  deleteRoutine: (id: string) => void
  reorderRoutines: (orderedIds: string[]) => void
  reorderExercises: (routineId: string, fromIndex: number, toIndex: number) => void
  replaceRoutines: (routines: Routine[]) => void
}

function generateId() {
  return `routine-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`
}

function generateExerciseId(routineId: string, catalogExerciseId?: string) {
  const base = catalogExerciseId ?? 'exercise'
  return `routine-exercise-${routineId}-${base}-${Math.random().toString(36).slice(2, 6)}`
}

export const useRoutinesStore = create<RoutinesStore>()((set, get) => ({
  routines: readRoutines(),

  getRoutine: (id) => {
    if (!id) return undefined
    return get().routines.find((routine) => routine.id === id)
  },

  createRoutine: (input) => {
    const id = generateId()
    const routine: Routine = {
      id,
      name: input.name.trim(),
      description: input.description?.trim() || 'Rutina personalizada',
      accent: input.accent ?? Colors.mono.DEFAULT,
      exercises: input.exercises.map((exercise) => ({
        ...exercise,
        id: generateExerciseId(id, exercise.catalogExerciseId),
      })),
    }
    const routines = [
      routine,
      ...get().routines,
    ]
    insertRoutine(routine, 0)
    updateRoutineOrder(routines)
    set({
      routines,
    })
    return id
  },

  updateRoutine: (id, patch) => {
    const routines = get().routines.map((routine) => {
      if (routine.id !== id) return routine
      return {
        ...routine,
        ...(patch.name !== undefined
          ? {
              name: patch.name.trim(),
            }
          : {}),
        ...(patch.description !== undefined
          ? {
              description: patch.description,
            }
          : {}),
        ...(patch.accent !== undefined
          ? {
              accent: patch.accent,
            }
          : {}),
        ...(patch.exercises !== undefined
          ? {
              exercises: patch.exercises,
            }
          : {}),
      }
    })
    const updatedRoutine = routines.find((routine) => routine.id === id)
    if (!updatedRoutine) return
    replaceRoutine(updatedRoutine, routines.indexOf(updatedRoutine))
    set({
      routines,
    })
  },

  deleteRoutine: (id) => {
    deleteRoutineRecord(id)
    set((state) => ({
      routines: state.routines.filter((routine) => routine.id !== id),
    }))
  },

  reorderRoutines: (orderedIds) => {
    const state = get()
    const byId = new Map(
      state.routines.map((routine) => [
        routine.id,
        routine,
      ]),
    )
    const next: Routine[] = []
    for (const id of orderedIds) {
      const routine = byId.get(id)
      if (routine) next.push(routine)
    }
    // Append any routine that wasn't in the supplied ordering
    // (defensive — should never happen, but keeps the list complete).
    for (const routine of state.routines) {
      if (!orderedIds.includes(routine.id)) next.push(routine)
    }
    updateRoutineOrder(next)
    set({
      routines: next,
    })
  },

  reorderExercises: (routineId, fromIndex, toIndex) => {
    const routines = get().routines.map((routine) => {
      if (routine.id !== routineId) return routine
      if (
        fromIndex < 0 ||
        toIndex < 0 ||
        fromIndex >= routine.exercises.length ||
        toIndex >= routine.exercises.length
      ) {
        return routine
      }
      const next = [
        ...routine.exercises,
      ]
      const [moved] = next.splice(fromIndex, 1)
      if (!moved) return routine
      next.splice(toIndex, 0, moved)
      return {
        ...routine,
        exercises: next,
      }
    })
    const routine = routines.find((item) => item.id === routineId)
    if (!routine) return
    replaceRoutine(routine, routines.indexOf(routine))
    set({
      routines,
    })
  },
  replaceRoutines: (routines) => {
    replaceAllRoutines(routines)
    set({
      routines,
    })
  },
}))

// Convenience selectors — keep components from re-rendering on every
// unrelated store mutation.
export const selectRoutines = (state: RoutinesStore) => state.routines
export const selectRoutineById = (id: string) => (state: RoutinesStore) =>
  state.routines.find((routine) => routine.id === id)
