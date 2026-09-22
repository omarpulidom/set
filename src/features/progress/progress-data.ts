import { endOfDay, endOfWeek, isWithinInterval, startOfDay, startOfWeek } from 'date-fns'
import { getExerciseDisplayNameById } from '@/features/exercises/catalog'
import type { WorkoutTicket } from '@/features/gym/types'
import type {
  MeasurementDefinition,
  MeasurementRecord,
} from '@/features/measurements/measurements-store'

export type DateRange = {
  start: Date
  end: Date
}

export type MeasurementPoint = MeasurementRecord & {
  definition: MeasurementDefinition
}

export type ExerciseProgressPoint = {
  key: string
  name: string
  completedAt: string
  maxWeightKg: number
  volumeKg: number
}

export type WeekReport = DateRange & {
  key: string
}

export function startOfLocalWeek(date: Date) {
  return startOfWeek(date, {
    weekStartsOn: 1,
  })
}

export function weekReportFor(date: Date): WeekReport {
  const start = startOfLocalWeek(date)
  return {
    key: start.toISOString().slice(0, 10),
    start,
    end: endOfWeek(date, {
      weekStartsOn: 1,
    }),
  }
}

export function dateIsInRange(value: string, range: DateRange) {
  const date = new Date(value)
  return (
    !Number.isNaN(date.getTime()) &&
    isWithinInterval(date, {
      start: startOfDay(range.start),
      end: endOfDay(range.end),
    })
  )
}

export function measurementPoints(
  definitions: MeasurementDefinition[],
  records: MeasurementRecord[],
  range: DateRange,
) {
  const definitionsById = new Map(
    definitions.map((definition) => [
      definition.id,
      definition,
    ]),
  )
  return records
    .flatMap((record) => {
      const definition = definitionsById.get(record.measurementId)
      return definition && dateIsInRange(record.recordedAt, range)
        ? [
            {
              ...record,
              definition,
            },
          ]
        : []
    })
    .sort((first, second) => first.recordedAt.localeCompare(second.recordedAt))
}

export function exerciseProgressPoints(tickets: WorkoutTicket[], range: DateRange) {
  return tickets
    .filter((ticket) => dateIsInRange(ticket.completedAt, range))
    .flatMap((ticket) =>
      ticket.exercises.map((exercise) => {
        const key = exercise.catalogExerciseId ?? exercise.name.toLocaleLowerCase('es-MX')
        const sets = exercise.sets
        return {
          key,
          name: getExerciseDisplayNameById(exercise.catalogExerciseId, exercise.name),
          completedAt: ticket.completedAt,
          maxWeightKg: Math.max(0, ...sets.map((set) => set.weightKg)),
          volumeKg: sets.reduce((total, set) => total + set.weightKg * set.reps, 0),
        }
      }),
    )
    .sort((first, second) => first.completedAt.localeCompare(second.completedAt))
}

export function latestMeasurement(
  definitionId: string,
  records: MeasurementRecord[],
): MeasurementRecord | undefined {
  return records
    .filter((record) => record.measurementId === definitionId)
    .sort((first, second) => second.recordedAt.localeCompare(first.recordedAt))[0]
}

export function reportsFromHistory(records: MeasurementRecord[], tickets: WorkoutTicket[]) {
  const dates = [
    ...records.map((record) => record.recordedAt),
    ...tickets.map((ticket) => ticket.completedAt),
  ]
    .map((value) => new Date(value))
    .filter((date) => !Number.isNaN(date.getTime()))

  const currentWeek = weekReportFor(new Date())
  if (dates.length === 0)
    return [
      currentWeek,
    ]

  const earliest = startOfLocalWeek(new Date(Math.min(...dates.map((date) => date.getTime()))))
  const reports: WeekReport[] = []
  let cursor = currentWeek.start
  while (cursor.getTime() >= earliest.getTime()) {
    reports.push(weekReportFor(cursor))
    cursor = new Date(cursor.getFullYear(), cursor.getMonth(), cursor.getDate() - 7)
  }
  return reports
}
