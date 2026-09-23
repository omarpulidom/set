import type { BatchQueryCommand, QueryResultRow } from 'react-native-nitro-sqlite'
import type {
  MeasurementDefinition,
  MeasurementRecord,
} from '@/features/measurements/measurements-store'
import { database } from './client'

type MeasurementRow = QueryResultRow & {
  id: string
  name: string
  unit: string
  created_at: string
}

type MeasurementRecordRow = QueryResultRow & {
  id: string
  measurement_id: string
  value: number
  recorded_at: string
}

export function readMeasurements() {
  const definitions = database
    .execute<MeasurementRow>(
      'SELECT id, name, unit, created_at FROM measurements ORDER BY sort_order',
    )
    .rows._array.map((row) => ({
      id: row.id,
      name: row.name,
      unit: row.unit,
      createdAt: row.created_at,
    }))
  const records = database
    .execute<MeasurementRecordRow>(
      'SELECT id, measurement_id, value, recorded_at FROM measurement_records ORDER BY recorded_at',
    )
    .rows._array.map((row) => ({
      id: row.id,
      measurementId: row.measurement_id,
      value: row.value,
      recordedAt: row.recorded_at,
    }))
  return {
    definitions,
    records,
  }
}

export function insertMeasurement(
  definition: MeasurementDefinition,
  record: MeasurementRecord,
  sortOrder: number,
) {
  database.executeBatch([
    {
      query:
        'INSERT INTO measurements (id, name, unit, created_at, sort_order) VALUES (?, ?, ?, ?, ?)',
      params: [
        definition.id,
        definition.name,
        definition.unit,
        definition.createdAt,
        sortOrder,
      ],
    },
    {
      query:
        'INSERT INTO measurement_records (id, measurement_id, value, recorded_at) VALUES (?, ?, ?, ?)',
      params: [
        record.id,
        record.measurementId,
        record.value,
        record.recordedAt,
      ],
    },
  ])
}

export function insertMeasurementRecord(record: MeasurementRecord) {
  database.execute(
    'INSERT INTO measurement_records (id, measurement_id, value, recorded_at) VALUES (?, ?, ?, ?)',
    [
      record.id,
      record.measurementId,
      record.value,
      record.recordedAt,
    ],
  )
}

export function updateMeasurementRecord(recordId: string, value: number) {
  database.execute('UPDATE measurement_records SET value = ? WHERE id = ?', [
    value,
    recordId,
  ])
}

export function updateMeasurementDefinition(
  measurementId: string,
  patch: Pick<MeasurementDefinition, 'name' | 'unit'>,
) {
  database.execute('UPDATE measurements SET name = ?, unit = ? WHERE id = ?', [
    patch.name,
    patch.unit,
    measurementId,
  ])
}

export function deleteMeasurementRecord(recordId: string) {
  database.execute('DELETE FROM measurement_records WHERE id = ?', [
    recordId,
  ])
}

function measurementCommands(
  definitions: MeasurementDefinition[],
  records: MeasurementRecord[],
): BatchQueryCommand[] {
  return [
    ...definitions.map((definition, index) => ({
      query:
        'INSERT INTO measurements (id, name, unit, created_at, sort_order) VALUES (?, ?, ?, ?, ?)',
      params: [
        definition.id,
        definition.name,
        definition.unit,
        definition.createdAt,
        index,
      ],
    })),
    ...records.map((record) => ({
      query:
        'INSERT INTO measurement_records (id, measurement_id, value, recorded_at) VALUES (?, ?, ?, ?)',
      params: [
        record.id,
        record.measurementId,
        record.value,
        record.recordedAt,
      ],
    })),
  ]
}

export function replaceAllMeasurements(
  definitions: MeasurementDefinition[],
  records: MeasurementRecord[],
) {
  database.executeBatch([
    {
      query: 'DELETE FROM measurement_records',
    },
    {
      query: 'DELETE FROM measurements',
    },
    ...measurementCommands(definitions, records),
  ])
}
