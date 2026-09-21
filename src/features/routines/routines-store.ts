import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { Colors } from '@/components/colors'
import { getCatalogExerciseId } from '@/features/exercises/catalog'
import type { Routine, RoutineExercise } from '@/features/gym/types'
import { zustandMMKVStorage } from '@/lib/mmkv'

export const ROUTINES_STORE_NAME = 'zustand-routines-store'

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
}

function generateId() {
  return `routine-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`
}

function generateExerciseId(routineId: string, catalogExerciseId?: string) {
  const base = catalogExerciseId ?? 'exercise'
  return `routine-exercise-${routineId}-${base}-${Math.random().toString(36).slice(2, 6)}`
}

function catalogIdFromRoutineExerciseId(id: string | undefined) {
  if (!id) return undefined
  const match = id.match(/-(\d{4})-[a-z0-9]{4}$/i)
  return getCatalogExerciseId(match?.[1])
}

function normalizePersistedRoutine(value: unknown): Routine | undefined {
  if (typeof value !== 'object' || value === null) return undefined
  const candidate = value as Partial<Routine>
  if (typeof candidate.id !== 'string' || typeof candidate.name !== 'string') return undefined
  if (!Array.isArray(candidate.exercises)) return undefined

  const usedExerciseIds = new Set<string>()
  const exercises = candidate.exercises.flatMap((exercise, index) => {
    if (typeof exercise !== 'object' || exercise === null) return []
    const item = exercise as Partial<RoutineExercise>
    if (
      typeof item.name !== 'string' ||
      typeof item.targetSets !== 'number' ||
      typeof item.targetReps !== 'number'
    ) {
      return []
    }

    const persistedExerciseId = typeof item.id === 'string' ? item.id : undefined
    const persistedCatalogId =
      typeof item.catalogExerciseId === 'string' ? item.catalogExerciseId : undefined
    const catalogExerciseId =
      getCatalogExerciseId(persistedCatalogId) ??
      catalogIdFromRoutineExerciseId(persistedExerciseId) ??
      getCatalogExerciseId(undefined, item.name)
    const baseId =
      persistedExerciseId || `routine-exercise-${candidate.id}-${catalogExerciseId ?? index}`
    const id = usedExerciseIds.has(baseId) ? `${baseId}-${index}` : baseId
    usedExerciseIds.add(id)

    return [
      {
        id,
        catalogExerciseId,
        name: item.name,
        targetSets: item.targetSets,
        targetReps: item.targetReps,
      },
    ]
  })

  return {
    id: candidate.id,
    name: candidate.name,
    description:
      typeof candidate.description === 'string' ? candidate.description : 'Rutina personalizada',
    accent: typeof candidate.accent === 'string' ? candidate.accent : Colors.mono.DEFAULT,
    exercises,
  }
}

function normalizePersistedRoutines(routines: unknown[]) {
  return routines.flatMap((routine) => {
    const normalized = normalizePersistedRoutine(routine)
    return normalized
      ? [
          normalized,
        ]
      : []
  })
}

export const useRoutinesStore = create<RoutinesStore>()(
  persist(
    (set, get) => ({
      routines: [],

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
        set((state) => ({
          routines: [
            routine,
            ...state.routines,
          ],
        }))
        return id
      },

      updateRoutine: (id, patch) => {
        set((state) => ({
          routines: state.routines.map((routine) => {
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
          }),
        }))
      },

      deleteRoutine: (id) => {
        set((state) => ({
          routines: state.routines.filter((routine) => routine.id !== id),
        }))
      },

      reorderRoutines: (orderedIds) => {
        set((state) => {
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
          return {
            routines: next,
          }
        })
      },

      reorderExercises: (routineId, fromIndex, toIndex) => {
        set((state) => ({
          routines: state.routines.map((routine) => {
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
          }),
        }))
      },
    }),
    {
      name: ROUTINES_STORE_NAME,
      storage: createJSONStorage(() => zustandMMKVStorage),
      version: 2,
      migrate: (persistedState) => {
        const persisted = persistedState as {
          routines?: unknown[]
        }
        return {
          ...persisted,
          routines: Array.isArray(persisted.routines)
            ? normalizePersistedRoutines(persisted.routines)
            : [],
        }
      },
      merge: (persistedState, currentState) => {
        const persisted = persistedState as
          | {
              routines?: unknown[]
            }
          | undefined
        const routines = Array.isArray(persisted?.routines)
          ? normalizePersistedRoutines(persisted.routines)
          : []
        return {
          ...currentState,
          routines,
        }
      },
    },
  ),
)

// Convenience selectors — keep components from re-rendering on every
// unrelated store mutation.
export const selectRoutines = (state: RoutinesStore) => state.routines
export const selectRoutineById = (id: string) => (state: RoutinesStore) =>
  state.routines.find((routine) => routine.id === id)
