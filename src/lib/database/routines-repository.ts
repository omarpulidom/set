import type { BatchQueryCommand, QueryResultRow } from 'react-native-nitro-sqlite'
import type { Routine, RoutineExercise } from '@/features/gym/types'
import { database } from './client'

type RoutineRow = QueryResultRow & {
  id: string
  name: string
  description: string
  accent: string
}

type RoutineExerciseRow = QueryResultRow & {
  id: string
  routine_id: string
  catalog_exercise_id: string | null
  name: string
  target_sets: number
  target_reps: number
}

export function readRoutines(): Routine[] {
  const routines = database.execute<RoutineRow>(
    'SELECT id, name, description, accent FROM routines ORDER BY sort_order',
  ).rows._array
  const exercises = database.execute<RoutineExerciseRow>(
    `SELECT id, routine_id, catalog_exercise_id, name, target_sets, target_reps
     FROM routine_exercises
     ORDER BY routine_id, sort_order`,
  ).rows._array

  return routines.map((routine) => ({
    id: routine.id,
    name: routine.name,
    description: routine.description,
    accent: routine.accent,
    exercises: exercises
      .filter((exercise) => exercise.routine_id === routine.id)
      .map((exercise) => ({
        id: exercise.id,
        catalogExerciseId: exercise.catalog_exercise_id ?? undefined,
        name: exercise.name,
        targetSets: exercise.target_sets,
        targetReps: exercise.target_reps,
      })),
  }))
}

function routineCommands(routine: Routine, sortOrder: number): BatchQueryCommand[] {
  return [
    {
      query: `INSERT INTO routines (id, name, description, accent, sort_order)
              VALUES (?, ?, ?, ?, ?)`,
      params: [
        routine.id,
        routine.name,
        routine.description,
        routine.accent,
        sortOrder,
      ],
    },
    ...routine.exercises.map((exercise, exerciseOrder) => ({
      query: `INSERT INTO routine_exercises
              (id, routine_id, catalog_exercise_id, name, target_sets, target_reps, sort_order)
              VALUES (?, ?, ?, ?, ?, ?, ?)`,
      params: [
        exercise.id,
        routine.id,
        exercise.catalogExerciseId ?? null,
        exercise.name,
        exercise.targetSets,
        exercise.targetReps,
        exerciseOrder,
      ],
    })),
  ]
}

export function insertRoutine(routine: Routine, sortOrder: number) {
  database.executeBatch(routineCommands(routine, sortOrder))
}

export function replaceRoutine(routine: Routine, sortOrder: number) {
  database.executeBatch([
    {
      query: 'DELETE FROM routines WHERE id = ?',
      params: [
        routine.id,
      ],
    },
    ...routineCommands(routine, sortOrder),
  ])
}

export function deleteRoutineRecord(id: string) {
  database.execute('DELETE FROM routines WHERE id = ?', [
    id,
  ])
}

export function updateRoutineOrder(routines: Routine[]) {
  database.executeBatch(
    routines.map((routine, index) => ({
      query: 'UPDATE routines SET sort_order = ? WHERE id = ?',
      params: [
        index,
        routine.id,
      ],
    })),
  )
}

export function replaceAllRoutines(routines: Routine[]) {
  database.executeBatch([
    {
      query: 'DELETE FROM routine_exercises',
    },
    {
      query: 'DELETE FROM routines',
    },
    ...routines.flatMap(routineCommands),
  ])
}

export function writeRoutineExercises(routine: Routine, exercises: RoutineExercise[]) {
  replaceRoutine(
    {
      ...routine,
      exercises,
    },
    readRoutines().findIndex((item) => item.id === routine.id),
  )
}
