import { create } from 'zustand'
import {
  deleteMeasurementRecord,
  insertMeasurement,
  insertMeasurementRecord,
  readMeasurements,
  replaceAllMeasurements,
  updateMeasurementDefinition,
  updateMeasurementRecord,
} from '@/lib/database'

export type MeasurementDefinition = {
  id: string
  name: string
  unit: string
  createdAt: string
}

export type MeasurementRecord = {
  id: string
  measurementId: string
  value: number
  recordedAt: string
}

type CreateMeasurementInput = {
  name: string
  unit: string
  value: number
}

type MeasurementsState = {
  definitions: MeasurementDefinition[]
  records: MeasurementRecord[]
  createMeasurement: (input: CreateMeasurementInput) => string | undefined
  addRecord: (measurementId: string, value: number) => void
  updateRecord: (recordId: string, value: number) => void
  updateDefinition: (
    measurementId: string,
    patch: Pick<MeasurementDefinition, 'name' | 'unit'>,
  ) => void
  deleteRecord: (recordId: string) => void
  replaceMeasurements: (definitions: MeasurementDefinition[], records: MeasurementRecord[]) => void
  resetMeasurements: () => void
}

function generateId(prefix: string) {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`
}

function validValue(value: number) {
  return Number.isFinite(value)
}

const initialMeasurements = readMeasurements()

export const useMeasurementsStore = create<MeasurementsState>()((set, get) => ({
  definitions: initialMeasurements.definitions,
  records: initialMeasurements.records,
  createMeasurement: (input) => {
    const name = input.name.trim()
    const unit = input.unit.trim()
    if (!name || !unit || !validValue(input.value)) return undefined

    const id = generateId('measurement')
    const recordId = generateId('measurement-record')
    const now = new Date().toISOString()
    const definition: MeasurementDefinition = {
      id,
      name,
      unit,
      createdAt: now,
    }
    const record: MeasurementRecord = {
      id: recordId,
      measurementId: id,
      value: input.value,
      recordedAt: now,
    }
    insertMeasurement(definition, record, get().definitions.length)
    set((state) => ({
      definitions: [
        ...state.definitions,
        definition,
      ],
      records: [
        ...state.records,
        record,
      ],
    }))
    return id
  },
  addRecord: (measurementId, value) => {
    if (!validValue(value)) return
    if (!get().definitions.some((definition) => definition.id === measurementId)) return
    const record: MeasurementRecord = {
      id: generateId('measurement-record'),
      measurementId,
      value,
      recordedAt: new Date().toISOString(),
    }
    insertMeasurementRecord(record)
    set((state) => ({
      records: [
        ...state.records,
        record,
      ],
    }))
  },
  updateRecord: (recordId, value) => {
    if (!validValue(value)) return
    updateMeasurementRecord(recordId, value)
    set((state) => ({
      records: state.records.map((record) =>
        record.id === recordId
          ? {
              ...record,
              value,
            }
          : record,
      ),
    }))
  },
  updateDefinition: (measurementId, patch) => {
    const name = patch.name.trim()
    const unit = patch.unit.trim()
    if (!name || !unit) return
    updateMeasurementDefinition(measurementId, {
      name,
      unit,
    })
    set((state) => ({
      definitions: state.definitions.map((definition) =>
        definition.id === measurementId
          ? {
              ...definition,
              name,
              unit,
            }
          : definition,
      ),
    }))
  },
  deleteRecord: (recordId) => {
    deleteMeasurementRecord(recordId)
    set((state) => ({
      records: state.records.filter((record) => record.id !== recordId),
    }))
  },
  replaceMeasurements: (definitions, records) => {
    replaceAllMeasurements(definitions, records)
    set({
      definitions,
      records,
    })
  },
  resetMeasurements: () => {
    replaceAllMeasurements([], [])
    set({
      definitions: [],
      records: [],
    })
  },
}))
