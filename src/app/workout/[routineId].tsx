import { Feather } from '@expo/vector-icons'
import {
  BottomSheetBackdrop,
  type BottomSheetBackdropProps,
  BottomSheetModal,
  BottomSheetView,
} from '@gorhom/bottom-sheet'
import { useLocalSearchParams, useRouter } from 'expo-router'
import {
  forwardRef,
  memo,
  useCallback,
  useEffect,
  useImperativeHandle,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { Alert, Image, ScrollView, Text, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Colors } from '@/components/colors'
import { NumberRuler } from '@/components/NumberRuler'
import {
  type CatalogExercise,
  getExerciseDisplayNameById,
  videoForExercise,
} from '@/features/exercises/catalog'
import { useWorkoutExerciseSelectionStore } from '@/features/exercises/workout-exercise-selection-store'
import type { RoutineExercise, WorkoutSet } from '@/features/gym/types'
import { useRoutinesStore } from '@/features/routines/routines-store'

const KG_PER_LB = 0.45359237
const MIN_REPS = 1
const KG_STEP = 1
const LBS_STEP = 2.5
const KG_MAX = 200
const LBS_MAX = 300
const REPS_MAX = 30

type Unit = 'kg' | 'lbs'

function kgToDisplay(kg: number, unit: Unit): number {
  return unit === 'kg' ? kg : kg / KG_PER_LB
}

function displayToKg(value: number, unit: Unit): number {
  return unit === 'kg' ? value : value * KG_PER_LB
}

function formatWeight(kg: number, unit: Unit): string {
  return kgToDisplay(kg, unit).toFixed(1)
}

function defaultSets(count: number): WorkoutSet[] {
  return Array.from(
    {
      length: count,
    },
    () => ({
      weightKg: 0,
      reps: 0,
    }),
  )
}

function setKey(exerciseId: string, setIndex: number) {
  return `${exerciseId}#${setIndex}`
}

function isAddedDuringWorkout(exerciseId: string) {
  return exerciseId.startsWith('workout-exercise-')
}

function WorkoutSheetBackdrop(props: BottomSheetBackdropProps) {
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

function UnitToggle({ value, onChange }: { value: Unit; onChange: (value: Unit) => void }) {
  return (
    <View className='flex-row rounded-full bg-surface-card p-0.5' accessibilityRole='radiogroup'>
      {(
        [
          'kg',
          'lbs',
        ] as const
      ).map((option) => {
        const selected = option === value
        return (
          <TouchableOpacity
            key={option}
            onPress={() => onChange(option)}
            accessibilityRole='radio'
            accessibilityState={{
              selected,
            }}
            className={`rounded-full px-3 py-1 ${selected ? 'bg-surface-dark' : ''}`}
          >
            <Text
              className={`font-geist-mono-semibold text-[10px] uppercase tracking-[1px] ${selected ? 'text-surface-card' : 'text-ink-muted'}`}
            >
              {option}
            </Text>
          </TouchableOpacity>
        )
      })}
    </View>
  )
}

type SetDraft = {
  exerciseId: string
  setIndex: number
  exerciseName: string
  unit: Unit
  weightKg: number
  reps: number
  confirmed: boolean
}

type SetSheetHandle = {
  open: (draft: SetDraft) => void
}

const SetSheet = memo(
  forwardRef<
    SetSheetHandle,
    {
      onConfirm: (exerciseId: string, setIndex: number, weightKg: number, reps: number) => void
    }
  >(function SetSheet({ onConfirm }, ref) {
    const sheetRef = useRef<BottomSheetModal>(null)
    const [draft, setDraft] = useState<SetDraft | null>(null)
    const [weightKg, setWeightKg] = useState(0)
    const [reps, setReps] = useState(0)

    useImperativeHandle(
      ref,
      () => ({
        open(nextDraft) {
          setDraft(nextDraft)
          setWeightKg(nextDraft.weightKg)
          setReps(nextDraft.reps)
        },
      }),
      [],
    )

    useLayoutEffect(() => {
      if (draft) sheetRef.current?.present()
    }, [
      draft,
    ])

    const unit = draft?.unit ?? 'kg'
    return (
      <BottomSheetModal
        ref={sheetRef}
        backgroundStyle={{
          backgroundColor: Colors.surface.card,
        }}
        handleIndicatorStyle={{
          backgroundColor: Colors.ink.soft,
        }}
        backdropComponent={WorkoutSheetBackdrop}
        onDismiss={() => setDraft(null)}
      >
        <BottomSheetView className='px-5 pb-7 pt-2'>
          {draft ? (
            <>
              <View className='flex-row items-center justify-between'>
                <View>
                  <Text className='font-geist-mono-semibold text-xl text-surface-dark'>
                    Serie {draft.setIndex + 1}
                  </Text>
                  <Text className='mt-1 font-geist-mono text-xs text-ink-muted'>
                    {draft.exerciseName}
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => sheetRef.current?.dismiss()}
                  accessibilityRole='button'
                  accessibilityLabel='Cerrar'
                  className='h-10 w-10 items-center justify-center rounded-full bg-surface-muted'
                >
                  <Feather name='x' size={18} color={Colors.surface.dark} />
                </TouchableOpacity>
              </View>
              <View className='mt-4'>
                <Text className='font-geist-mono text-[10px] uppercase tracking-[1.5px] text-ink-muted'>
                  Peso ({unit})
                </Text>
                <NumberRuler
                  label=''
                  value={kgToDisplay(weightKg, unit)}
                  min={0}
                  max={unit === 'kg' ? KG_MAX : LBS_MAX}
                  step={unit === 'kg' ? KG_STEP : LBS_STEP}
                  onValueChange={(value) => setWeightKg(displayToKg(value, unit))}
                />
              </View>
              <View className='mt-2'>
                <Text className='font-geist-mono text-[10px] uppercase tracking-[1.5px] text-ink-muted'>
                  Reps
                </Text>
                <NumberRuler
                  label=''
                  value={reps}
                  min={MIN_REPS}
                  max={REPS_MAX}
                  step={1}
                  onValueChange={setReps}
                />
              </View>
              <TouchableOpacity
                onPress={() => {
                  onConfirm(draft.exerciseId, draft.setIndex, weightKg, reps)
                  sheetRef.current?.dismiss()
                }}
                className='mt-6 flex-row items-center justify-center rounded-3xl bg-surface-dark py-4'
              >
                <Feather name='check' size={17} color={Colors.surface.card} />
                <Text className='ml-2 font-geist-mono-semibold text-sm uppercase tracking-tight text-surface-card'>
                  {draft.confirmed ? 'Guardar cambios' : 'Confirmar'}
                </Text>
              </TouchableOpacity>
            </>
          ) : null}
        </BottomSheetView>
      </BottomSheetModal>
    )
  }),
)

export default function WorkoutScreen() {
  const router = useRouter()
  const { routineId } = useLocalSearchParams<{
    routineId?: string
  }>()
  const routine = useRoutinesStore((state) => state.routines.find((item) => item.id === routineId))

  const [seconds, setSeconds] = useState(0)
  const [workoutExercises, setWorkoutExercises] = useState<RoutineExercise[]>(
    () => routine?.exercises ?? [],
  )
  const [expandedId, setExpandedId] = useState<string | undefined>(() => routine?.exercises[0]?.id)
  const [sets, setSets] = useState<Record<string, WorkoutSet[]>>(() =>
    routine
      ? Object.fromEntries(
          routine.exercises.map((exercise) => [
            exercise.id,
            defaultSets(exercise.targetSets),
          ]),
        )
      : {},
  )
  const [units, setUnits] = useState<Record<string, Unit>>({})
  const [confirmed, setConfirmed] = useState<Set<string>>(() => new Set())
  const sheetRef = useRef<SetSheetHandle>(null)
  const selectedExercise = useWorkoutExerciseSelectionStore((state) => state.selectedExercise)
  const clearSelectedExercise = useWorkoutExerciseSelectionStore((state) => state.clearSelection)
  const setExcludedExerciseIds = useWorkoutExerciseSelectionStore(
    (state) => state.setExcludedExerciseIds,
  )
  const addExercise = useCallback((exercise: CatalogExercise) => {
    const id = `workout-exercise-${exercise.id}-${Date.now().toString(36)}`
    const workoutExercise: RoutineExercise = {
      id,
      catalogExerciseId: exercise.id,
      name: exercise.name,
      targetSets: 1,
      targetReps: 0,
    }

    setWorkoutExercises((current) => [
      ...current,
      workoutExercise,
    ])
    setSets((current) => ({
      ...current,
      [id]: defaultSets(1),
    }))
    setExpandedId(id)
  }, [])

  useEffect(() => {
    const timer = setInterval(() => setSeconds((value) => value + 1), 1000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    if (!selectedExercise) return
    if (!workoutExercises.some((exercise) => exercise.catalogExerciseId === selectedExercise.id)) {
      addExercise(selectedExercise)
    }
    clearSelectedExercise()
  }, [
    addExercise,
    clearSelectedExercise,
    selectedExercise,
    workoutExercises,
  ])

  function openSheet(exerciseId: string, setIndex: number) {
    const list = sets[exerciseId] ?? []
    const current = list[setIndex]
    const unit = units[exerciseId] ?? 'kg'
    const step = unit === 'kg' ? KG_STEP : LBS_STEP
    let weightKg = 0
    let reps = 0
    if (current && (current.weightKg > 0 || current.reps > 0)) {
      weightKg = current.weightKg
      reps = current.reps
    } else if (setIndex > 0) {
      const prev = list[setIndex - 1]
      if (prev && (prev.weightKg > 0 || prev.reps > 0)) {
        weightKg = prev.weightKg
        reps = prev.reps
      }
    }
    const weightDisplay = kgToDisplay(weightKg, unit)
    const snapped = Math.round(weightDisplay / step) * step
    const exercise = workoutExercises.find((item) => item.id === exerciseId)
    if (!exercise) return
    sheetRef.current?.open({
      exerciseId,
      setIndex,
      exerciseName: getExerciseDisplayNameById(exercise.catalogExerciseId, exercise.name),
      unit,
      weightKg:
        current && (current.weightKg > 0 || current.reps > 0)
          ? weightKg
          : displayToKg(snapped, unit),
      reps,
      confirmed: confirmed.has(setKey(exerciseId, setIndex)),
    })
  }

  const confirmDraft = useCallback(
    (exerciseId: string, setIndex: number, weightKg: number, reps: number) => {
      setSets((current) => ({
        ...current,
        [exerciseId]: (current[exerciseId] ?? []).map((set, index) =>
          index === setIndex
            ? {
                weightKg,
                reps: Math.max(MIN_REPS, Math.round(reps)),
              }
            : set,
        ),
      }))
      setConfirmed((current) => {
        const next = new Set(current)
        next.add(setKey(exerciseId, setIndex))
        return next
      })
    },
    [],
  )

  function toggleExpanded(exerciseId: string) {
    setExpandedId((current) => (current === exerciseId ? undefined : exerciseId))
  }

  function setUnit(exerciseId: string, unit: Unit) {
    setUnits((current) => ({
      ...current,
      [exerciseId]: unit,
    }))
  }

  function unconfirmSet(exerciseId: string, setIndex: number) {
    setConfirmed((current) => {
      const next = new Set(current)
      next.delete(setKey(exerciseId, setIndex))
      return next
    })
  }

  function addSet(exerciseId: string) {
    setSets((current) => ({
      ...current,
      [exerciseId]: [
        ...(current[exerciseId] ?? []),
        {
          weightKg: 0,
          reps: 0,
        },
      ],
    }))
  }

  function removeSet(exerciseId: string, setIndex: number) {
    setSets((current) => ({
      ...current,
      [exerciseId]: (current[exerciseId] ?? []).filter((_, index) => index !== setIndex),
    }))
    setConfirmed((current) => {
      const next = new Set<string>()
      const prefix = `${exerciseId}#`

      for (const key of current) {
        if (!key.startsWith(prefix)) {
          next.add(key)
          continue
        }

        const confirmedIndex = Number(key.slice(prefix.length))
        if (!Number.isInteger(confirmedIndex) || confirmedIndex === setIndex) continue
        next.add(
          confirmedIndex > setIndex
            ? setKey(exerciseId, confirmedIndex - 1)
            : setKey(exerciseId, confirmedIndex),
        )
      }

      return next
    })
  }

  function confirmRemoveSet(exerciseId: string, setIndex: number) {
    Alert.alert('¿Eliminar serie?', 'Esta acción no se puede deshacer.', [
      {
        text: 'Cancelar',
        style: 'cancel',
      },
      {
        text: 'Eliminar',
        style: 'destructive',
        onPress: () => removeSet(exerciseId, setIndex),
      },
    ])
  }

  function removeExercise(exerciseId: string) {
    setWorkoutExercises((current) => current.filter((exercise) => exercise.id !== exerciseId))
    setSets((current) => {
      const next = {
        ...current,
      }
      delete next[exerciseId]
      return next
    })
    setUnits((current) => {
      const next = {
        ...current,
      }
      delete next[exerciseId]
      return next
    })
    setConfirmed((current) => {
      const prefix = `${exerciseId}#`
      return new Set(Array.from(current).filter((key) => !key.startsWith(prefix)))
    })
    setExpandedId((current) => (current === exerciseId ? undefined : current))
  }

  function confirmRemoveExercise(exerciseId: string, exerciseName: string) {
    Alert.alert('¿Eliminar ejercicio?', `${exerciseName} se quitará sólo de este entrenamiento.`, [
      {
        text: 'Cancelar',
        style: 'cancel',
      },
      {
        text: 'Eliminar',
        style: 'destructive',
        onPress: () => removeExercise(exerciseId),
      },
    ])
  }

  const canFinish = useMemo(() => {
    if (workoutExercises.length === 0) return false
    return workoutExercises.every((exercise) => {
      const list = sets[exercise.id] ?? []
      if (list.length === 0) return false
      return list.every((_, idx) => confirmed.has(setKey(exercise.id, idx)))
    })
  }, [
    confirmed,
    sets,
    workoutExercises,
  ])
  const elapsed = `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`

  if (!routine) {
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
          <TouchableOpacity
            onPress={() => router.back()}
            className='h-10 w-10 items-center justify-center rounded-full bg-surface-muted'
          >
            <Feather name='arrow-left' size={19} color={Colors.surface.dark} />
          </TouchableOpacity>
        </View>
        <View className='flex-1 items-center justify-center px-8'>
          <Text className='text-center font-geist-mono text-sm text-ink-muted'>
            Esta rutina ya no existe.
          </Text>
        </View>
      </SafeAreaView>
    )
  }

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
        <TouchableOpacity
          onPress={() => router.back()}
          className='h-10 w-10 items-center justify-center rounded-full bg-surface-muted'
        >
          <Feather name='x' size={19} color={Colors.surface.dark} />
        </TouchableOpacity>
        <Text className='font-geist-mono-semibold text-base uppercase tracking-tight text-surface-dark'>
          {routine.name}
        </Text>
        <Text className='font-geist-mono-semibold text-base tabular-nums text-surface-dark'>
          {elapsed}
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={{
          padding: 20,
          paddingBottom: 40,
        }}
        keyboardShouldPersistTaps='handled'
      >
        <Text className='font-geist-mono text-xs leading-5 tracking-tight text-ink-soft'>
          Registra lo que hiciste, no tienes que seguir el plan exactamente.
        </Text>

        <View className='mt-9 flex-row items-center justify-between'>
          <Text className='font-geist-mono-semibold text-xl uppercase tracking-[-1px] text-surface-dark'>
            Ejercicios
          </Text>
          <Text className='font-geist-mono text-xs text-ink-muted'>{workoutExercises.length}</Text>
        </View>

        <View className='mt-4 gap-3'>
          {workoutExercises.map((exercise) => {
            const isExpanded = expandedId === exercise.id
            const videoSource = videoForExercise(exercise.catalogExerciseId ?? exercise.id)
            const unit = units[exercise.id] ?? 'kg'
            const list = sets[exercise.id] ?? []
            const maximumReps = Math.max(0, ...list.map((set) => set.reps))
            const activeIndex = list.findIndex((_, idx) => !confirmed.has(setKey(exercise.id, idx)))
            const allDone =
              list.length > 0 && list.every((_, idx) => confirmed.has(setKey(exercise.id, idx)))
            return (
              <View key={exercise.id} className='rounded-3xl bg-surface-muted'>
                {isExpanded && videoSource ? (
                  <Image
                    source={videoSource}
                    resizeMode='contain'
                    className='h-44 w-full rounded-t-3xl bg-surface-card'
                  />
                ) : null}
                <TouchableOpacity
                  onPress={() => toggleExpanded(exercise.id)}
                  activeOpacity={0.82}
                  className='flex-row items-center justify-between p-4'
                >
                  <Text className='flex-1 font-geist-mono-medium text-sm text-surface-dark'>
                    {getExerciseDisplayNameById(exercise.catalogExerciseId, exercise.name)}
                  </Text>
                  <View className='flex-row items-center gap-3'>
                    <View className='rounded-full bg-surface-card px-2.5 py-1'>
                      <Text className='font-geist-mono text-[10px] uppercase tracking-tight text-ink-muted'>
                        {isAddedDuringWorkout(exercise.id)
                          ? `${list.length} × ${maximumReps || '—'}`
                          : `${exercise.targetSets} × ${exercise.targetReps}`}
                      </Text>
                    </View>
                    <TouchableOpacity
                      onPress={() =>
                        confirmRemoveExercise(
                          exercise.id,
                          getExerciseDisplayNameById(exercise.catalogExerciseId, exercise.name),
                        )
                      }
                      accessibilityRole='button'
                      accessibilityLabel={`Eliminar ${getExerciseDisplayNameById(exercise.catalogExerciseId, exercise.name)}`}
                      className='h-7 w-7 items-center justify-center rounded-full bg-surface-card'
                    >
                      <Feather name='trash-2' size={13} color={Colors.ink.soft} />
                    </TouchableOpacity>
                    <Feather
                      name={isExpanded ? 'chevron-up' : 'chevron-down'}
                      size={18}
                      color={Colors.ink.muted}
                    />
                  </View>
                </TouchableOpacity>
                {isExpanded ? (
                  <View className='px-4 pb-4'>
                    <View className='mb-3 flex-row items-center justify-between'>
                      <Text className='font-geist-mono text-[10px] uppercase tracking-[1.5px] text-ink-muted'>
                        Unidad
                      </Text>
                      <UnitToggle value={unit} onChange={(next) => setUnit(exercise.id, next)} />
                    </View>
                    <View className='gap-2'>
                      {list.map((set, index) => {
                        const isConfirmed = confirmed.has(setKey(exercise.id, index))
                        const isActive = index === activeIndex
                        return (
                          <View
                            key={`${exercise.id}-${index}`}
                            className={`flex-row items-stretch rounded-2xl px-3 py-3 ${isConfirmed ? 'bg-surface-soft' : isActive ? 'bg-surface-card' : 'bg-surface-card/60'}`}
                          >
                            <TouchableOpacity
                              onPress={() => openSheet(exercise.id, index)}
                              activeOpacity={0.82}
                              accessibilityRole='button'
                              accessibilityLabel={`${isConfirmed ? 'Editar' : 'Registrar'} serie ${index + 1}`}
                              className='flex-1 flex-row items-center'
                            >
                              <Text className='w-6 text-center font-geist-mono text-xs text-ink-muted'>
                                {index + 1}
                              </Text>
                              <Text
                                className={`flex-1 pl-2 font-geist-mono text-base ${isConfirmed ? 'text-ink-muted' : 'text-surface-dark'}`}
                              >
                                {set.weightKg > 0
                                  ? `${formatWeight(set.weightKg, unit)} ${unit}`
                                  : '—'}
                              </Text>
                              <Text
                                className={`flex-1 pl-2 font-geist-mono text-base ${isConfirmed ? 'text-ink-muted' : 'text-surface-dark'}`}
                              >
                                {set.reps > 0 ? `${set.reps} reps` : '—'}
                              </Text>
                              {isConfirmed ? (
                                <Feather name='edit-2' size={12} color={Colors.ink.muted} />
                              ) : null}
                            </TouchableOpacity>
                            <View className='flex-row items-center gap-1 pl-2'>
                              <TouchableOpacity
                                onPress={() => {
                                  if (isConfirmed) {
                                    unconfirmSet(exercise.id, index)
                                  }
                                }}
                                accessibilityRole='button'
                                accessibilityLabel={
                                  isConfirmed
                                    ? `Desconfirmar serie ${index + 1}`
                                    : `Serie ${index + 1} pendiente`
                                }
                                className='h-7 w-7 items-center justify-center rounded-full'
                                hitSlop={{
                                  top: 6,
                                  bottom: 6,
                                  left: 6,
                                  right: 6,
                                }}
                              >
                                {isConfirmed ? (
                                  <Feather name='check' size={18} color={Colors.surface.dark} />
                                ) : isActive ? (
                                  <View className='h-2 w-2 rounded-full bg-surface-dark' />
                                ) : (
                                  <View className='h-2 w-2 rounded-full bg-ink-soft opacity-40' />
                                )}
                              </TouchableOpacity>
                              {!isConfirmed ? (
                                <TouchableOpacity
                                  onPress={() => confirmRemoveSet(exercise.id, index)}
                                  accessibilityRole='button'
                                  accessibilityLabel={`Eliminar serie ${index + 1}`}
                                  className='h-7 w-7 items-center justify-center rounded-full bg-surface-card'
                                  hitSlop={{
                                    top: 6,
                                    bottom: 6,
                                    left: 6,
                                    right: 6,
                                  }}
                                >
                                  <Feather name='x' size={14} color={Colors.ink.soft} />
                                </TouchableOpacity>
                              ) : null}
                            </View>
                          </View>
                        )
                      })}
                    </View>
                    {allDone ? (
                      <TouchableOpacity
                        onPress={() => addSet(exercise.id)}
                        className='mt-2 flex-row items-center py-3'
                      >
                        <Feather name='plus' size={15} color={Colors.surface.dark} />
                        <Text className='ml-2 font-geist-mono-medium text-xs uppercase text-surface-dark'>
                          Añadir otra serie
                        </Text>
                      </TouchableOpacity>
                    ) : null}
                  </View>
                ) : null}
              </View>
            )
          })}
        </View>

        <TouchableOpacity
          onPress={() => {
            setExcludedExerciseIds(
              workoutExercises
                .map((exercise) => exercise.catalogExerciseId)
                .filter((exerciseId): exerciseId is string => Boolean(exerciseId)),
            )
            router.push({
              pathname: '/routine/exercises',
              params: {
                mode: 'workout',
              },
            })
          }}
          className='mt-3 flex-row items-center self-start py-3'
        >
          <Feather name='plus' size={15} color={Colors.surface.dark} />
          <Text className='ml-2 font-geist-mono-medium text-xs uppercase text-surface-dark'>
            Agregar ejercicio
          </Text>
        </TouchableOpacity>

        <View className='mt-8'>
          <TouchableOpacity
            disabled={!canFinish}
            onPress={() =>
              router.push({
                pathname: '/ticket/create/[routineId]',
                params: {
                  routineId: routine.id,
                  elapsedSeconds: String(Math.max(1, seconds)),
                  sets: JSON.stringify(sets),
                  exercises: JSON.stringify(workoutExercises),
                },
              })
            }
            className={`items-center rounded-3xl py-4 ${canFinish ? 'bg-surface-dark' : 'bg-surface-soft'}`}
          >
            <Text
              className={`font-geist-mono-semibold text-sm ${canFinish ? 'text-surface-card' : 'text-ink-soft'}`}
            >
              Terminar entrenamiento
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <SetSheet ref={sheetRef} onConfirm={confirmDraft} />
    </SafeAreaView>
  )
}
