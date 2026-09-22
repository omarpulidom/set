import { Feather } from '@expo/vector-icons'
import {
  BottomSheetBackdrop,
  type BottomSheetBackdropProps,
  BottomSheetModal,
  BottomSheetView,
} from '@gorhom/bottom-sheet'
import { addMonths, format, startOfMonth, subMonths } from 'date-fns'
import { es } from 'date-fns/locale'
import { useMemo, useRef, useState } from 'react'
import {
  Alert,
  FlatList,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Colors } from '@/components/colors'
import { ProgressLineChart } from '@/components/progress/ProgressLineChart'
import { RoutinePaper, RoutineRule } from '@/components/routines/RoutinePaper'
import {
  type MeasurementDefinition,
  useMeasurementsStore,
} from '@/features/measurements/measurements-store'
import {
  type DateRange,
  exerciseProgressPoints,
  latestMeasurement,
  measurementPoints,
  reportsFromHistory,
} from '@/features/progress/progress-data'
import { useTicketsStore } from '@/features/tickets/tickets-store'

type SheetMode = 'new' | 'existing' | 'manage'
type RangeDraftPart = 'start' | 'end'
type ReportPage = {
  key: string
  range?: DateRange
  title: string
  subtitle: string
}

function ArchiveSheetBackdrop(props: BottomSheetBackdropProps) {
  return (
    <BottomSheetBackdrop
      {...props}
      appearsOnIndex={0}
      disappearsOnIndex={-1}
      opacity={0.45}
      pressBehavior='close'
    />
  )
}

function dayKey(date: Date) {
  return format(date, 'yyyy-MM-dd')
}

function sameDay(first: Date | undefined, second: Date) {
  return first !== undefined && dayKey(first) === dayKey(second)
}

function inRange(date: Date, start: Date | undefined, end: Date | undefined) {
  if (!start || !end) return false
  return date.getTime() > start.getTime() && date.getTime() < end.getTime()
}

function rangeLabel(range: DateRange) {
  const sameYear = range.start.getFullYear() === range.end.getFullYear()
  return `${format(range.start, sameYear ? 'd MMM' : 'd MMM yyyy', {
    locale: es,
  })} — ${format(range.end, 'd MMM yyyy', {
    locale: es,
  })}`
}

function MeasurementChart({
  definition,
  points,
}: {
  definition: MeasurementDefinition
  points: {
    value: number
    recordedAt: string
  }[]
}) {
  return (
    <View>
      <ProgressLineChart
        title={definition.name}
        unit={definition.unit}
        points={points.map((point) => ({
          label: format(new Date(point.recordedAt), 'd MMM', {
            locale: es,
          }),
          value: point.value,
        }))}
      />
    </View>
  )
}

function ExerciseChart({
  name,
  points,
}: {
  name: string
  points: {
    maxWeightKg: number
    volumeKg: number
    completedAt: string
  }[]
}) {
  const [metric, setMetric] = useState<'weight' | 'volume'>('weight')
  const isWeight = metric === 'weight'
  return (
    <View>
      <ProgressLineChart
        title={name}
        unit='kg'
        points={points.map((point) => ({
          label: format(new Date(point.completedAt), 'd MMM', {
            locale: es,
          }),
          value: isWeight ? point.maxWeightKg : point.volumeKg,
        }))}
      />
      <View className='mt-4 flex-row justify-end'>
        <View className='flex-row rounded-full bg-surface-muted p-0.5'>
          <TouchableOpacity
            onPress={() => setMetric('weight')}
            className={`rounded-full px-2.5 py-1 ${isWeight ? 'bg-surface-dark' : ''}`}
          >
            <Text
              className={`font-geist-mono text-[9px] ${isWeight ? 'text-surface-card' : 'text-ink-muted'}`}
            >
              PESO
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setMetric('volume')}
            className={`rounded-full px-2.5 py-1 ${!isWeight ? 'bg-surface-dark' : ''}`}
          >
            <Text
              className={`font-geist-mono text-[9px] ${!isWeight ? 'text-surface-card' : 'text-ink-muted'}`}
            >
              VOLUMEN
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )
}

function EmptyReport({ label }: { label: string }) {
  return <Text className='py-8 text-center font-geist-mono text-sm text-ink-muted'>{label}</Text>
}

function Calendar({
  month,
  start,
  end,
  onMonthChange,
  onSelect,
}: {
  month: Date
  start?: Date
  end?: Date
  onMonthChange: (month: Date) => void
  onSelect: (date: Date) => void
}) {
  const today = new Date()
  const first = startOfMonth(month)
  const leadingDays = (first.getDay() + 6) % 7
  const daysInMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate()
  const cellCount = Math.ceil((leadingDays + daysInMonth) / 7) * 7

  return (
    <View>
      <View className='flex-row items-center justify-between'>
        <TouchableOpacity
          onPress={() => onMonthChange(subMonths(month, 1))}
          className='h-9 w-9 items-center justify-center rounded-full bg-surface-muted'
        >
          <Feather name='chevron-left' size={17} color={Colors.surface.dark} />
        </TouchableOpacity>
        <Text className='font-geist-mono-semibold text-sm capitalize text-surface-dark'>
          {format(month, 'MMMM yyyy', {
            locale: es,
          })}
        </Text>
        <TouchableOpacity
          onPress={() => onMonthChange(addMonths(month, 1))}
          disabled={startOfMonth(month).getTime() >= startOfMonth(today).getTime()}
          className='h-9 w-9 items-center justify-center rounded-full bg-surface-muted'
        >
          <Feather name='chevron-right' size={17} color={Colors.surface.dark} />
        </TouchableOpacity>
      </View>
      <View className='mt-5 flex-row'>
        {[
          'L',
          'M',
          'M',
          'J',
          'V',
          'S',
          'D',
        ].map((day, index) => (
          <Text
            key={`${day}-${index}`}
            className='flex-1 text-center font-geist-mono text-[10px] text-ink-muted'
          >
            {day}
          </Text>
        ))}
      </View>
      <View className='mt-2 flex-row flex-wrap'>
        {Array.from(
          {
            length: cellCount,
          },
          (_, index) => {
            const day = index - leadingDays + 1
            const exists = day >= 1 && day <= daysInMonth
            const date = new Date(month.getFullYear(), month.getMonth(), day)
            const selected = sameDay(start, date) || sameDay(end, date)
            const disabled = !exists || date.getTime() > today.getTime()
            return (
              <View
                key={index}
                className='items-center py-1'
                style={{
                  width: '14.2857%',
                }}
              >
                <TouchableOpacity
                  disabled={disabled}
                  onPress={() => onSelect(date)}
                  className={`h-9 w-9 items-center justify-center rounded-full ${selected ? 'bg-surface-dark' : inRange(date, start, end) ? 'bg-surface-control' : ''}`}
                >
                  <Text
                    className={`font-geist-mono text-xs ${selected ? 'text-surface-card' : disabled ? 'text-ink-light' : 'text-surface-dark'}`}
                  >
                    {exists ? day : ''}
                  </Text>
                </TouchableOpacity>
              </View>
            )
          },
        )}
      </View>
    </View>
  )
}

export default function ArchiveTab() {
  const { width } = useWindowDimensions()
  const definitions = useMeasurementsStore((state) => state.definitions)
  const records = useMeasurementsStore((state) => state.records)
  const createMeasurement = useMeasurementsStore((state) => state.createMeasurement)
  const addRecord = useMeasurementsStore((state) => state.addRecord)
  const updateRecord = useMeasurementsStore((state) => state.updateRecord)
  const updateDefinition = useMeasurementsStore((state) => state.updateDefinition)
  const deleteRecord = useMeasurementsStore((state) => state.deleteRecord)
  const tickets = useTicketsStore((state) => state.tickets)
  const measurementSheetRef = useRef<BottomSheetModal>(null)
  const rangeSheetRef = useRef<BottomSheetModal>(null)
  const [sheetMode, setSheetMode] = useState<SheetMode>('new')
  const [selectedMeasurementId, setSelectedMeasurementId] = useState<string>()
  const [editingRecordId, setEditingRecordId] = useState<string>()
  const [draftName, setDraftName] = useState('')
  const [draftUnit, setDraftUnit] = useState('')
  const [draftValue, setDraftValue] = useState('')
  const [range, setRange] = useState<DateRange>()
  const [draftStart, setDraftStart] = useState<Date>()
  const [draftEnd, setDraftEnd] = useState<Date>()
  const [selectingRangePart, setSelectingRangePart] = useState<RangeDraftPart>('start')
  const [calendarMonth, setCalendarMonth] = useState(new Date())

  const reports = useMemo(
    () => reportsFromHistory(records, tickets),
    [
      records,
      tickets,
    ],
  )
  const selectedDefinition = definitions.find(
    (definition) => definition.id === selectedMeasurementId,
  )
  const reportPages: ReportPage[] = range
    ? [
        {
          key: `range-${dayKey(range.start)}-${dayKey(range.end)}`,
          range,
          title: 'Rango personalizado',
          subtitle: rangeLabel(range),
        },
      ]
    : [
        {
          key: 'now',
          title: 'Ahora',
          subtitle: 'Resumen actual',
        },
        ...reports.map((report) => ({
          key: report.key,
          range: report,
          title: 'Semana',
          subtitle: rangeLabel(report),
        })),
      ]

  function openNewMeasurement() {
    setSheetMode('new')
    setSelectedMeasurementId(undefined)
    setEditingRecordId(undefined)
    setDraftName('')
    setDraftUnit('')
    setDraftValue('')
    measurementSheetRef.current?.present()
  }

  function openMeasurement(definition: MeasurementDefinition) {
    setSheetMode('manage')
    setSelectedMeasurementId(definition.id)
    setEditingRecordId(undefined)
    setDraftName(definition.name)
    setDraftUnit(definition.unit)
    setDraftValue('')
    measurementSheetRef.current?.present()
  }

  function selectExistingMeasurement(definition: MeasurementDefinition) {
    setSheetMode('existing')
    setSelectedMeasurementId(definition.id)
    setEditingRecordId(undefined)
    setDraftName(definition.name)
    setDraftUnit(definition.unit)
    setDraftValue('')
  }

  function saveMeasurement() {
    const value = Number(draftValue.replace(',', '.'))
    if (!Number.isFinite(value)) return
    if (sheetMode === 'new') {
      const id = createMeasurement({
        name: draftName,
        unit: draftUnit,
        value,
      })
      if (!id) return
    } else if (selectedDefinition) {
      updateDefinition(selectedDefinition.id, {
        name: draftName,
        unit: draftUnit,
      })
      if (editingRecordId) updateRecord(editingRecordId, value)
      else addRecord(selectedDefinition.id, value)
    }
    measurementSheetRef.current?.dismiss()
  }

  function editRecord(recordId: string, value: number) {
    setEditingRecordId(recordId)
    setDraftValue(String(value))
  }

  function removeRecord(recordId: string) {
    Alert.alert('¿Eliminar registro?', 'Esta medición se quitará del historial.', [
      {
        text: 'Cancelar',
        style: 'cancel',
      },
      {
        text: 'Eliminar',
        style: 'destructive',
        onPress: () => deleteRecord(recordId),
      },
    ])
  }

  function openRange() {
    setDraftStart(range?.start)
    setDraftEnd(range?.end)
    setSelectingRangePart(range?.start ? 'end' : 'start')
    setCalendarMonth(range?.end ?? new Date())
    rangeSheetRef.current?.present()
  }

  function selectRangeDate(date: Date) {
    if (selectingRangePart === 'start') {
      setDraftStart(date)
      setSelectingRangePart('end')
      return
    }
    if (!draftStart || date.getTime() >= draftStart.getTime()) {
      setDraftEnd(date)
      return
    }
    setDraftStart(date)
    setDraftEnd(undefined)
  }

  function applyRange() {
    if (!draftStart || !draftEnd || draftStart.getTime() > draftEnd.getTime()) return
    setRange({
      start: draftStart,
      end: draftEnd,
    })
    rangeSheetRef.current?.dismiss()
  }

  function renderReport({ item }: { item: ReportPage }) {
    const isNow = item.key === 'now'
    const points = item.range ? measurementPoints(definitions, records, item.range) : []
    const exercisePoints = item.range ? exerciseProgressPoints(tickets, item.range) : []
    const measurementGroups = new Map<string, typeof points>()
    const exerciseGroups = new Map<string, typeof exercisePoints>()
    for (const point of points) {
      measurementGroups.set(point.measurementId, [
        ...(measurementGroups.get(point.measurementId) ?? []),
        point,
      ])
    }
    for (const point of exercisePoints) {
      exerciseGroups.set(point.key, [
        ...(exerciseGroups.get(point.key) ?? []),
        point,
      ])
    }

    return (
      <View
        style={{
          width,
        }}
        className='px-5'
      >
        <RoutinePaper className='flex-1' topRule={false}>
          <ScrollView
            className='flex-1'
            contentContainerStyle={{
              paddingBottom: 36,
            }}
            showsVerticalScrollIndicator={false}
          >
            <View>
              <Text className='font-geist-mono text-[10px] uppercase tracking-[2px] text-ink-muted'>
                {item.title}
              </Text>
              <Text className='mt-2 font-geist-mono-semibold text-2xl uppercase tracking-[-1px] text-surface-dark'>
                {item.subtitle}
              </Text>
            </View>
            <View className='my-5'>
              <RoutineRule />
            </View>

            {isNow ? (
              <>
                <Text className='mt-7 font-geist-mono text-[10px] uppercase tracking-[2px] text-ink-muted'>
                  Medidas actuales
                </Text>
                {definitions.length === 0 ? (
                  <EmptyReport label='Aún no has registrado medidas.' />
                ) : (
                  <View className='mt-3 gap-3'>
                    {definitions.map((definition) => {
                      const latest = latestMeasurement(definition.id, records)
                      return (
                        <TouchableOpacity
                          key={definition.id}
                          onPress={() => openMeasurement(definition)}
                          className='rounded-3xl border border-border-soft bg-surface-muted p-4'
                        >
                          <Text className='font-geist-mono text-[10px] uppercase tracking-[1.5px] text-ink-muted'>
                            {definition.name}
                          </Text>
                          <View className='mt-2 flex-row items-baseline justify-between'>
                            <Text className='font-geist-mono-semibold text-2xl text-surface-dark'>
                              {latest ? latest.value.toLocaleString('es-MX') : '—'}
                            </Text>
                            <Text className='font-geist-mono text-sm text-ink-muted'>
                              {definition.unit}
                            </Text>
                          </View>
                          {latest ? (
                            <Text className='mt-2 font-geist-mono text-[10px] text-ink-muted'>
                              {format(new Date(latest.recordedAt), 'd MMM yyyy', {
                                locale: es,
                              })}
                            </Text>
                          ) : null}
                        </TouchableOpacity>
                      )
                    })}
                  </View>
                )}
                <Text className='mt-8 font-geist-mono text-[10px] uppercase tracking-[2px] text-ink-muted'>
                  Ejercicios
                </Text>
                {tickets.length === 0 ? (
                  <EmptyReport label='Aún no hay entrenamientos registrados.' />
                ) : (
                  <View className='mt-5 border border-surface-dark'>
                    <View className='flex-row border-b border-surface-dark'>
                      <Text className='flex-1 px-3 py-2 font-geist-mono-semibold text-[10px] tracking-[1px] text-surface-dark'>
                        EJERCICIO
                      </Text>
                      <Text className='w-20 border-l border-surface-dark px-2 py-2 text-right font-geist-mono-semibold text-[10px] tracking-[1px] text-surface-dark'>
                        PESO
                      </Text>
                      <Text className='w-20 border-l border-surface-dark px-2 py-2 text-right font-geist-mono-semibold text-[10px] tracking-[1px] text-surface-dark'>
                        VOLUMEN
                      </Text>
                    </View>
                    {Array.from(
                      new Map(
                        exerciseProgressPoints(tickets, {
                          start: new Date(0),
                          end: new Date(),
                        })
                          .reverse()
                          .map((point) => [
                            point.key,
                            point,
                          ]),
                      ).values(),
                    ).map((point, index, currentExercises) => (
                      <View key={point.key} className='relative flex-row items-stretch'>
                        <Text className='flex-1 px-3 py-3 font-geist-mono text-xs uppercase text-surface-dark'>
                          {point.name}
                        </Text>
                        <Text className='w-20 border-l border-surface-dark px-2 py-3 text-right font-geist-mono text-xs text-surface-dark'>
                          {point.maxWeightKg.toLocaleString('es-MX')} kg
                        </Text>
                        <Text className='w-20 border-l border-surface-dark px-2 py-3 text-right font-geist-mono text-xs text-surface-dark'>
                          {Math.round(point.volumeKg).toLocaleString('es-MX')} kg
                        </Text>
                        {index < currentExercises.length - 1 ? (
                          <View className='absolute bottom-0 left-0 right-0 h-px bg-border-warm' />
                        ) : null}
                      </View>
                    ))}
                  </View>
                )}
              </>
            ) : measurementGroups.size === 0 && exerciseGroups.size === 0 ? (
              <EmptyReport label='Sin registros en esta semana.' />
            ) : (
              <>
                {measurementGroups.size > 0 ? (
                  <>
                    <Text className='mt-7 font-geist-mono text-[10px] uppercase tracking-[2px] text-ink-muted'>
                      Medidas
                    </Text>
                    <View className='mt-5 gap-6'>
                      {Array.from(measurementGroups.entries()).map(
                        ([measurementId, groupedPoints]) => {
                          const definition = definitions.find((item) => item.id === measurementId)
                          return definition ? (
                            <View key={measurementId}>
                              <MeasurementChart definition={definition} points={groupedPoints} />
                              <View className='mt-5'>
                                <RoutineRule />
                              </View>
                            </View>
                          ) : null
                        },
                      )}
                    </View>
                  </>
                ) : null}
                {exerciseGroups.size > 0 ? (
                  <>
                    <Text className='mt-8 font-geist-mono text-[10px] uppercase tracking-[2px] text-ink-muted'>
                      Cargas
                    </Text>
                    <View className='mt-5 gap-6'>
                      {Array.from(exerciseGroups.entries()).map(([key, groupedPoints]) => (
                        <View key={key}>
                          <ExerciseChart
                            name={groupedPoints[0]?.name ?? ''}
                            points={groupedPoints}
                          />
                          <View className='mt-5'>
                            <RoutineRule />
                          </View>
                        </View>
                      ))}
                    </View>
                  </>
                ) : null}
              </>
            )}
          </ScrollView>
        </RoutinePaper>
      </View>
    )
  }

  const selectedRecords = selectedMeasurementId
    ? records
        .filter((record) => record.measurementId === selectedMeasurementId)
        .sort((first, second) => second.recordedAt.localeCompare(first.recordedAt))
    : []
  const canSave =
    draftName.trim().length > 0 && draftUnit.trim().length > 0 && draftValue.trim().length > 0

  return (
    <SafeAreaView
      className='flex-1 bg-surface'
      edges={[
        'top',
        'left',
        'right',
      ]}
    >
      <View className='flex-row items-center justify-between px-5 pt-5'>
        <Text className='font-geist-mono-semibold text-3xl uppercase tracking-[-1px] text-surface-dark'>
          Archivo
        </Text>
        <TouchableOpacity
          onPress={openNewMeasurement}
          className='h-10 w-10 items-center justify-center rounded-full bg-surface-dark'
          accessibilityLabel='Agregar medida'
        >
          <Feather name='plus' size={19} color={Colors.surface.card} />
        </TouchableOpacity>
      </View>
      <View className='mt-5 flex-row items-center justify-between px-5'>
        <Text className='font-geist-mono text-xs text-ink-muted'>
          Desliza para ver tu historial.
        </Text>
        <TouchableOpacity onPress={openRange} className='flex-row items-center'>
          <Feather name='calendar' size={14} color={Colors.surface.dark} />
          <Text className='ml-2 font-geist-mono-semibold text-xs uppercase text-surface-dark'>
            Rango
          </Text>
        </TouchableOpacity>
      </View>
      {range ? (
        <TouchableOpacity
          onPress={() => setRange(undefined)}
          className='mt-4 ml-5 flex-row items-center self-start rounded-full bg-surface-muted px-3 py-2'
        >
          <Feather name='x' size={13} color={Colors.ink.muted} />
          <Text className='ml-1.5 font-geist-mono text-xs text-surface-dark'>Limpiar rango</Text>
        </TouchableOpacity>
      ) : null}
      <FlatList
        data={reportPages}
        key={range ? reportPages[0]?.key : 'weekly-reports'}
        renderItem={renderReport}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.key}
        className='mb-4 mt-5 flex-1'
      />

      <BottomSheetModal
        ref={measurementSheetRef}
        backgroundStyle={{
          backgroundColor: Colors.surface.card,
        }}
        handleIndicatorStyle={{
          backgroundColor: Colors.ink.soft,
        }}
        backdropComponent={ArchiveSheetBackdrop}
      >
        <BottomSheetView className='px-5 pt-2'>
          <View className='flex-row items-center justify-between'>
            <Text className='font-geist-mono-semibold text-xl uppercase text-surface-dark'>
              {sheetMode === 'manage' ? 'Medida' : 'Agregar medida'}
            </Text>
            <TouchableOpacity
              onPress={() => measurementSheetRef.current?.dismiss()}
              className='h-10 w-10 items-center justify-center rounded-full bg-surface-muted'
            >
              <Feather name='x' size={18} color={Colors.surface.dark} />
            </TouchableOpacity>
          </View>
          {sheetMode !== 'manage' && definitions.length > 0 ? (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} className='mt-5'>
              <TouchableOpacity
                onPress={() => setSheetMode('new')}
                className={`mr-2 rounded-full px-4 py-2 ${sheetMode === 'new' ? 'bg-surface-dark' : 'bg-surface-muted'}`}
              >
                <Text
                  className={`font-geist-mono text-xs ${sheetMode === 'new' ? 'text-surface-card' : 'text-ink-muted'}`}
                >
                  Nueva
                </Text>
              </TouchableOpacity>
              {definitions.map((definition) => (
                <TouchableOpacity
                  key={definition.id}
                  onPress={() => selectExistingMeasurement(definition)}
                  className={`mr-2 rounded-full px-4 py-2 ${selectedMeasurementId === definition.id ? 'bg-surface-dark' : 'bg-surface-muted'}`}
                >
                  <Text
                    className={`font-geist-mono text-xs ${selectedMeasurementId === definition.id ? 'text-surface-card' : 'text-ink-muted'}`}
                  >
                    {definition.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          ) : null}
          <View className='mt-5'>
            <Text className='font-geist-mono text-[10px] uppercase tracking-[1.5px] text-ink-muted'>
              Nombre
            </Text>
            <TextInput
              value={draftName}
              onChangeText={setDraftName}
              editable={sheetMode !== 'existing'}
              placeholder='Ej. Cintura'
              placeholderTextColor={Colors.ink.soft}
              className='mt-2 border-b border-border-soft py-3 font-geist-mono text-lg text-surface-dark'
            />
            <Text className='mt-5 font-geist-mono text-[10px] uppercase tracking-[1.5px] text-ink-muted'>
              Unidad
            </Text>
            <TextInput
              value={draftUnit}
              onChangeText={setDraftUnit}
              editable={sheetMode !== 'existing'}
              placeholder='Ej. cm'
              placeholderTextColor={Colors.ink.soft}
              className='mt-2 border-b border-border-soft py-3 font-geist-mono text-lg text-surface-dark'
            />
            <Text className='mt-5 font-geist-mono text-[10px] uppercase tracking-[1.5px] text-ink-muted'>
              Valor actual
            </Text>
            <TextInput
              value={draftValue}
              onChangeText={setDraftValue}
              keyboardType='decimal-pad'
              placeholder='0'
              placeholderTextColor={Colors.ink.soft}
              className='mt-2 border-b border-border-soft py-3 font-geist-mono text-lg text-surface-dark'
            />
            {sheetMode === 'manage' ? (
              <View className='mt-7'>
                <Text className='font-geist-mono text-[10px] uppercase tracking-[1.5px] text-ink-muted'>
                  Historial
                </Text>
                {selectedRecords.map((record) => (
                  <View
                    key={record.id}
                    className='mt-3 flex-row items-center justify-between rounded-2xl bg-surface-muted px-4 py-3'
                  >
                    <TouchableOpacity
                      onPress={() => editRecord(record.id, record.value)}
                      className='flex-1'
                    >
                      <Text className='font-geist-mono-medium text-sm text-surface-dark'>
                        {record.value.toLocaleString('es-MX')} {draftUnit}
                      </Text>
                      <Text className='mt-1 font-geist-mono text-[10px] text-ink-muted'>
                        {format(new Date(record.recordedAt), 'd MMM yyyy', {
                          locale: es,
                        })}
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => removeRecord(record.id)}
                      className='h-8 w-8 items-center justify-center'
                    >
                      <Feather name='trash-2' size={14} color={Colors.ink.soft} />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            ) : null}
            <TouchableOpacity
              onPress={saveMeasurement}
              disabled={!canSave}
              className={`mb-5 mt-8 items-center rounded-3xl py-4 ${canSave ? 'bg-surface-dark' : 'bg-surface-soft'}`}
            >
              <Text
                className={`font-geist-mono-semibold text-sm ${canSave ? 'text-surface-card' : 'text-ink-soft'}`}
              >
                {editingRecordId ? 'GUARDAR REGISTRO' : 'GUARDAR MEDIDA'}
              </Text>
            </TouchableOpacity>
          </View>
        </BottomSheetView>
      </BottomSheetModal>

      <BottomSheetModal
        ref={rangeSheetRef}
        backgroundStyle={{
          backgroundColor: Colors.surface.card,
        }}
        handleIndicatorStyle={{
          backgroundColor: Colors.ink.soft,
        }}
        backdropComponent={ArchiveSheetBackdrop}
      >
        <BottomSheetView className='px-5 pb-7 pt-2'>
          <View className='flex-row items-center justify-between'>
            <Text className='font-geist-mono-semibold text-xl uppercase text-surface-dark'>
              Rango
            </Text>
            <TouchableOpacity
              onPress={() => rangeSheetRef.current?.dismiss()}
              className='h-10 w-10 items-center justify-center rounded-full bg-surface-muted'
            >
              <Feather name='x' size={18} color={Colors.surface.dark} />
            </TouchableOpacity>
          </View>
          <View className='mt-5 flex-row gap-2'>
            {(
              [
                'start',
                'end',
              ] as const
            ).map((part) => {
              const value = part === 'start' ? draftStart : draftEnd
              const active = selectingRangePart === part
              return (
                <TouchableOpacity
                  key={part}
                  onPress={() => setSelectingRangePart(part)}
                  className={`flex-1 rounded-2xl p-3 ${active ? 'bg-surface-dark' : 'bg-surface-muted'}`}
                >
                  <Text
                    className={`font-geist-mono text-[10px] uppercase ${active ? 'text-surface-card' : 'text-ink-muted'}`}
                  >
                    {part === 'start' ? 'Inicio' : 'Fin'}
                  </Text>
                  <Text
                    className={`mt-1 font-geist-mono text-sm ${active ? 'text-surface-card' : 'text-surface-dark'}`}
                  >
                    {value
                      ? format(value, 'd MMM yyyy', {
                          locale: es,
                        })
                      : 'Elegir fecha'}
                  </Text>
                </TouchableOpacity>
              )
            })}
          </View>
          <View className='mt-6'>
            <Calendar
              month={calendarMonth}
              start={draftStart}
              end={draftEnd}
              onMonthChange={setCalendarMonth}
              onSelect={selectRangeDate}
            />
          </View>
          <TouchableOpacity
            onPress={applyRange}
            disabled={!draftStart || !draftEnd}
            className={`mt-7 items-center rounded-3xl py-4 ${draftStart && draftEnd ? 'bg-surface-dark' : 'bg-surface-soft'}`}
          >
            <Text
              className={`font-geist-mono-semibold text-sm ${draftStart && draftEnd ? 'text-surface-card' : 'text-ink-soft'}`}
            >
              VER RANGO
            </Text>
          </TouchableOpacity>
        </BottomSheetView>
      </BottomSheetModal>
    </SafeAreaView>
  )
}
