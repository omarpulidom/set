import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { zustandMMKVStorage } from '@/lib/mmkv'

export const MEASUREMENTS_STORE_NAME = 'set-measurements-v1'

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
  resetMeasurements: () => void
}

function generateId(prefix: string) {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`
}

function validValue(value: number) {
  return Number.isFinite(value)
}

export const useMeasurementsStore = create<MeasurementsState>()(
  persist(
    (set) => ({
      definitions: [],
      records: [],
      createMeasurement: (input) => {
        const name = input.name.trim()
        const unit = input.unit.trim()
        if (!name || !unit || !validValue(input.value)) return undefined

        const id = generateId('measurement')
        const now = new Date().toISOString()
        set((state) => ({
          definitions: [
            ...state.definitions,
            {
              id,
              name,
              unit,
              createdAt: now,
            },
          ],
          records: [
            ...state.records,
            {
              id: generateId('measurement-record'),
              measurementId: id,
              value: input.value,
              recordedAt: now,
            },
          ],
        }))
        return id
      },
      addRecord: (measurementId, value) => {
        if (!validValue(value)) return
        set((state) => {
          if (!state.definitions.some((definition) => definition.id === measurementId)) return state
          return {
            records: [
              ...state.records,
              {
                id: generateId('measurement-record'),
                measurementId,
                value,
                recordedAt: new Date().toISOString(),
              },
            ],
          }
        })
      },
      updateRecord: (recordId, value) => {
        if (!validValue(value)) return
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
      deleteRecord: (recordId) =>
        set((state) => ({
          records: state.records.filter((record) => record.id !== recordId),
        })),
      resetMeasurements: () =>
        set({
          definitions: [],
          records: [],
        }),
    }),
    {
      name: MEASUREMENTS_STORE_NAME,
      storage: createJSONStorage(() => zustandMMKVStorage),
    },
  ),
)
