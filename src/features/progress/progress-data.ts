import { endOfDay, endOfMonth, isWithinInterval, startOfDay, startOfMonth } from 'date-fns'
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

export type MonthReport = DateRange & {
  key: string
}

export function monthReportFor(date: Date): MonthReport {
  const start = startOfMonth(date)
  return {
    key: `${start.getFullYear()}-${String(start.getMonth() + 1).padStart(2, '0')}`,
    start,
    end: endOfMonth(date),
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

  const currentMonth = monthReportFor(new Date())
  if (dates.length === 0)
    return [
      currentMonth,
    ]

  const earliest = startOfMonth(new Date(Math.min(...dates.map((date) => date.getTime()))))
  const reports: MonthReport[] = []
  let cursor = currentMonth.start
  while (cursor.getTime() >= earliest.getTime()) {
    reports.push(monthReportFor(cursor))
    cursor = new Date(cursor.getFullYear(), cursor.getMonth() - 1, 1)
  }
  return reports
}
